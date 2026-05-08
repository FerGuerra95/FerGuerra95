import { createSqliteEntityStore } from '../../storage/sqliteEntityStore.service.js';
import { allSql } from '../../storage/sqliteStorage.js';
import { recordAuditLog } from '../audit/auditLog.service.js';
import { listAuditLogs } from '../audit/auditLog.service.js';
import {
  getComplianceFundingSignal,
  getMaValuationFundingSignal
} from './fundingBridge.service.js';

const fundingRoundsStore = createSqliteEntityStore(
  'funding_rounds',
  'funding_round',
  {
    status: 'draft',
    amountRaised: 0,
    riskStatus: 'normal',
    payload: {}
  }
);

const VALID_ROUND_TYPES = new Set(['pre-seed', 'seed', 'series a', 'debt']);

function createError(message, status = 400, code = 'FUNDING_ROUND_ERROR') {
  const error = new Error(message);
  error.status = status;
  error.code = code;
  return error;
}

function normalizeText(value, fallback = '') {
  return String(value ?? fallback).trim();
}

function normalizeNumber(value) {
  if (value === null || value === undefined || value === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function assertOrganizationId(organizationId) {
  if (!normalizeText(organizationId)) {
    throw createError(
      'Scope de organizacion no definido. No se puede operar sin organizationId.',
      403,
      'INVALID_ORGANIZATION_SCOPE'
    );
  }
}

function normalizeRoundType(value) {
  const roundType = normalizeText(value).toLowerCase();

  if (!VALID_ROUND_TYPES.has(roundType)) {
    throw createError(
      'round_type no valido. Usa: Pre-seed, Seed, Series A o Debt.',
      400,
      'INVALID_ROUND_TYPE'
    );
  }

  return roundType;
}

function sanitizePayload(payload = {}, { requireRoundType = false } = {}) {
  const source = payload && typeof payload === 'object' ? payload : {};
  const next = {};

  if (requireRoundType || source.roundType !== undefined) {
    next.roundType = normalizeRoundType(source.roundType);
  }
  if (source.status !== undefined) next.status = normalizeText(source.status, 'draft') || 'draft';
  if (source.fundingCaseId !== undefined) next.fundingCaseId = normalizeText(source.fundingCaseId) || null;
  if (source.investorName !== undefined) next.investorName = normalizeText(source.investorName) || null;
  if (source.closingDate !== undefined) next.closingDate = normalizeText(source.closingDate) || null;
  if (source.notes !== undefined) next.notes = normalizeText(source.notes) || null;
  if (source.riskStatus !== undefined) next.riskStatus = normalizeText(source.riskStatus, 'normal') || 'normal';
  if (source.payload !== undefined) {
    next.payload = source.payload && typeof source.payload === 'object' ? source.payload : {};
  }

  if (source.amountRaised !== undefined) next.amountRaised = normalizeNumber(source.amountRaised) ?? 0;
  if (source.valuationPreMoney !== undefined) next.valuationPreMoney = normalizeNumber(source.valuationPreMoney);
  if (source.valuationPostMoney !== undefined) next.valuationPostMoney = normalizeNumber(source.valuationPostMoney);
  if (source.dilutionPercentage !== undefined) next.dilutionPercentage = normalizeNumber(source.dilutionPercentage);
  if (source.monthlyBurnRate !== undefined) next.monthlyBurnRate = normalizeNumber(source.monthlyBurnRate);
  if (source.currentCash !== undefined) next.currentCash = normalizeNumber(source.currentCash);
  if (source.projectedRunwayMonths !== undefined) next.projectedRunwayMonths = normalizeNumber(source.projectedRunwayMonths);

  return next;
}

export function calculateCashRunway({ currentCash, amountRaised, monthlyBurnRate } = {}) {
  const cash = normalizeNumber(currentCash) ?? 0;
  const raised = normalizeNumber(amountRaised) ?? 0;
  const burn = normalizeNumber(monthlyBurnRate);

  if (!burn || burn <= 0) {
    return {
      projectedRunwayMonths: null,
      status: 'insufficient_data'
    };
  }

  const projectedRunwayMonths = (cash + raised) / burn;

  return {
    projectedRunwayMonths: Number.isFinite(projectedRunwayMonths)
      ? projectedRunwayMonths
      : null,
    status: Number.isFinite(projectedRunwayMonths) ? 'ok' : 'insufficient_data'
  };
}

export function calculateDilution({ amountRaised, valuationPostMoney } = {}) {
  const raised = normalizeNumber(amountRaised);
  const postMoney = normalizeNumber(valuationPostMoney);

  if (raised === null || postMoney === null || postMoney <= 0) {
    return null;
  }

  const dilution = (raised / postMoney) * 100;

  return Number.isFinite(dilution) ? dilution : null;
}

async function recordFundingAudit({
  organizationId,
  userId,
  action,
  entityId = '',
  metadata = {}
}) {
  if (!normalizeText(userId)) return;

  try {
    await recordAuditLog({
      organizationId,
      userId,
      action,
      entityType: 'funding_round',
      entityId,
      metadata
    });
  } catch {
    // Audit never blocks funding operations.
  }
}

async function markExecutiveFundingUpdate({
  organizationId,
  userId,
  reason,
  fundingRoundId = ''
}) {
  if (!normalizeText(userId)) return;

  try {
    await recordAuditLog({
      organizationId,
      userId,
      action: 'executive.funding_update_required',
      entityType: 'executive',
      entityId: 'funding',
      metadata: {
        reason,
        fundingRoundId: normalizeText(fundingRoundId) || null
      }
    });
  } catch {
    // Audit never blocks funding operations.
  }
}

function toSafeNumber(value) {
  return normalizeNumber(value);
}

function getRunwayStatus(projectedRunwayMonths) {
  const months = toSafeNumber(projectedRunwayMonths);
  if (months === null) return 'insufficient_data';
  if (months < 6) return 'critical';
  if (months <= 18) return 'watch';
  return 'healthy';
}

function roundToIntegerOrNull(value) {
  const number = toSafeNumber(value);
  return number === null ? null : Math.round(number);
}

function pickLatestTimestamp(logs = []) {
  const first = Array.isArray(logs) ? logs[0] : null;
  if (!first?.createdAt) return null;
  const ms = new Date(first.createdAt).getTime();
  return Number.isFinite(ms) ? ms : null;
}

function evaluateOptimalFundingWindow({
  totalRounds,
  projectedRunwayMonths,
  fundingRiskStatus,
  hasValuationSignal,
  complianceScore
}) {
  const runway = toSafeNumber(projectedRunwayMonths);
  const hasComplianceSignal = toSafeNumber(complianceScore) !== null;
  const complianceBlocked = hasComplianceSignal && Number(complianceScore) < 70;
  const highRisk = fundingRiskStatus === 'high_risk_audit_required';

  if (totalRounds <= 0 || runway === null) {
    return {
      optimalFundingWindow: false,
      optimalFundingWindowStatus: 'insufficient_data',
      message:
        'Insufficient funding data. Add rounds, burn rate and valuation inputs to activate this signal.'
    };
  }

  if (complianceBlocked || highRisk || runway < 6) {
    return {
      optimalFundingWindow: false,
      optimalFundingWindowStatus: 'blocked',
      message:
        'Funding window requires review. Compliance, valuation or runway signals need validation.'
    };
  }

  if (runway >= 6 && runway <= 18 && hasValuationSignal) {
    return {
      optimalFundingWindow: true,
      optimalFundingWindowStatus: 'open',
      message:
        'Optimal funding window may be open. Human review recommended before investor outreach.'
    };
  }

  return {
    optimalFundingWindow: false,
    optimalFundingWindowStatus: 'watch',
    message:
      'Funding window should be monitored. Timing or data completeness may need review.'
  };
}

export async function listByOrganization(organizationId, filters = {}) {
  assertOrganizationId(organizationId);

  const where = ['organization_id = @organizationId'];
  const params = { organizationId };
  if (filters.status) {
    where.push('status = @status');
    params.status = normalizeText(filters.status);
  }

  if (filters.roundType) {
    where.push('round_type = @roundType');
    params.roundType = normalizeRoundType(filters.roundType);
  }

  return allSql(
    `
      SELECT *
      FROM funding_rounds
      WHERE ${where.join(' AND ')}
      ORDER BY created_at DESC
    `,
    params
  ).map((row) => ({
    id: row.id,
    organizationId: row.organization_id,
    userId: row.user_id,
    fundingCaseId: row.funding_case_id,
    roundType: row.round_type,
    status: row.status,
    amountRaised: row.amount_raised,
    valuationPreMoney: row.valuation_pre_money,
    valuationPostMoney: row.valuation_post_money,
    dilutionPercentage: row.dilution_percentage,
    investorName: row.investor_name,
    closingDate: row.closing_date,
    monthlyBurnRate: row.monthly_burn_rate,
    currentCash: row.current_cash,
    projectedRunwayMonths: row.projected_runway_months,
    riskStatus: row.risk_status,
    payload: (() => {
      try {
        return JSON.parse(row.payload_json || '{}');
      } catch {
        return {};
      }
    })(),
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  }));
}

export async function getByIdForOrganization(organizationId, fundingRoundId) {
  assertOrganizationId(organizationId);
  return fundingRoundsStore.getByIdForOrganization(
    normalizeText(fundingRoundId),
    organizationId
  );
}

export async function createForOrganization(organizationId, payload = {}, actor = {}) {
  assertOrganizationId(organizationId);

  const normalized = sanitizePayload(payload, {
    requireRoundType: true
  });
  const amountRaised = normalizeNumber(normalized.amountRaised) ?? 0;
  const runway = calculateCashRunway({
    currentCash: normalized.currentCash,
    amountRaised,
    monthlyBurnRate: normalized.monthlyBurnRate
  });
  const dilution =
    normalized.dilutionPercentage ??
    calculateDilution({
      amountRaised,
      valuationPostMoney: normalized.valuationPostMoney
    });

  const created = await fundingRoundsStore.create({
    organizationId,
    userId: normalizeText(actor.userId) || null,
    fundingCaseId: normalized.fundingCaseId || null,
    roundType: normalized.roundType,
    status: normalized.status || 'draft',
    amountRaised,
    valuationPreMoney: normalized.valuationPreMoney,
    valuationPostMoney: normalized.valuationPostMoney,
    dilutionPercentage: dilution,
    investorName: normalized.investorName || null,
    closingDate: normalized.closingDate || null,
    monthlyBurnRate: normalized.monthlyBurnRate,
    currentCash: normalized.currentCash,
    projectedRunwayMonths: runway.projectedRunwayMonths,
    riskStatus: normalized.riskStatus || 'normal',
    payload: normalized.payload || {},
    notes: normalized.notes || null
  });

  await recordFundingAudit({
    organizationId,
    userId: actor.userId,
    action: 'funding.round.created',
    entityId: created?.id || '',
    metadata: {
      roundType: created?.roundType || null,
      status: created?.status || null,
      runwayStatus: runway.status
    }
  });
  await markExecutiveFundingUpdate({
    organizationId,
    userId: actor.userId,
    reason: 'funding_round_created',
    fundingRoundId: created?.id || ''
  });

  return created;
}

export async function updateForOrganization(
  organizationId,
  fundingRoundId,
  payload = {},
  actor = {}
) {
  assertOrganizationId(organizationId);

  const existing = await getByIdForOrganization(organizationId, fundingRoundId);
  if (!existing) return null;

  const normalized = sanitizePayload(payload, {
    requireRoundType: false
  });

  const amountRaised = normalized.amountRaised ?? existing.amountRaised ?? 0;
  const valuationPostMoney =
    normalized.valuationPostMoney ?? existing.valuationPostMoney ?? null;
  const monthlyBurnRate =
    normalized.monthlyBurnRate ?? existing.monthlyBurnRate ?? null;
  const currentCash = normalized.currentCash ?? existing.currentCash ?? null;

  const runway = calculateCashRunway({
    currentCash,
    amountRaised,
    monthlyBurnRate
  });

  const dilution =
    normalized.dilutionPercentage ??
    calculateDilution({
      amountRaised,
      valuationPostMoney
    });

  const updated = await fundingRoundsStore.updateForOrganization(
    fundingRoundId,
    {
      ...normalized,
      amountRaised,
      valuationPostMoney,
      monthlyBurnRate,
      currentCash,
      projectedRunwayMonths: runway.projectedRunwayMonths,
      dilutionPercentage: dilution
    },
    organizationId
  );

  if (!updated) return null;

  await recordFundingAudit({
    organizationId,
    userId: actor.userId,
    action: 'funding.round.updated',
    entityId: updated.id,
    metadata: {
      roundType: updated.roundType,
      status: updated.status,
      runwayStatus: runway.status
    }
  });
  await markExecutiveFundingUpdate({
    organizationId,
    userId: actor.userId,
    reason: 'funding_round_updated',
    fundingRoundId: updated?.id || ''
  });

  return updated;
}

export async function deleteForOrganization(
  organizationId,
  fundingRoundId,
  actor = {}
) {
  assertOrganizationId(organizationId);

  const existing = await getByIdForOrganization(organizationId, fundingRoundId);
  if (!existing) {
    return {
      deleted: false,
      id: normalizeText(fundingRoundId)
    };
  }

  const result = await fundingRoundsStore.removeForOrganization(
    normalizeText(fundingRoundId),
    organizationId
  );

  if (result.deleted) {
    await recordFundingAudit({
      organizationId,
      userId: actor.userId,
      action: 'funding.round.deleted',
      entityId: normalizeText(fundingRoundId),
      metadata: {
        roundType: existing.roundType,
        status: existing.status
      }
    });
    await markExecutiveFundingUpdate({
      organizationId,
      userId: actor.userId,
      reason: 'funding_round_deleted',
      fundingRoundId
    });
  }

  return result;
}

export async function getFundingSummary(organizationId, actor = {}) {
  assertOrganizationId(organizationId);

  const rounds = await fundingRoundsStore.listByOrganization(organizationId);
  const totalRaised = rounds.reduce(
    (acc, round) => acc + (normalizeNumber(round.amountRaised) ?? 0),
    0
  );
  const latestRound = rounds[0] || null;
  const totalRounds = rounds.length;
  const activeRounds = rounds.filter((item) => item.status === 'active').length;
  const avgDilutionSamples = rounds
    .map((item) => normalizeNumber(item.dilutionPercentage))
    .filter((item) => item !== null);
  const averageDilution =
    avgDilutionSamples.length > 0
      ? avgDilutionSamples.reduce((acc, value) => acc + value, 0) /
        avgDilutionSamples.length
      : null;

  const complianceSignal = await getComplianceFundingSignal({
    organizationId
  });
  const valuationSignal = await getMaValuationFundingSignal({
    organizationId
  });
  const monthlyBurnRate = toSafeNumber(latestRound?.monthlyBurnRate);
  const currentCash = toSafeNumber(latestRound?.currentCash);
  const latestAmountRaised = toSafeNumber(latestRound?.amountRaised) ?? 0;
  const computedRunway = calculateCashRunway({
    currentCash,
    amountRaised: latestAmountRaised,
    monthlyBurnRate
  });
  const projectedRunwayMonths =
    toSafeNumber(latestRound?.projectedRunwayMonths) ??
    computedRunway.projectedRunwayMonths;
  const runwayStatus = getRunwayStatus(projectedRunwayMonths);
  const baseRiskStatus = normalizeText(latestRound?.riskStatus, 'normal') || 'normal';
  const complianceBlocked =
    complianceSignal.complianceScore !== null && complianceSignal.complianceScore < 70;
  const fundingRiskStatus = complianceBlocked
    ? 'high_risk_audit_required'
    : baseRiskStatus;
  const hasValuationSignal =
    toSafeNumber(latestRound?.valuationPostMoney) !== null ||
    toSafeNumber(valuationSignal.suggestedPreMoneyValuation) !== null;
  const windowSignal = evaluateOptimalFundingWindow({
    totalRounds,
    projectedRunwayMonths,
    fundingRiskStatus,
    hasValuationSignal,
    complianceScore: complianceSignal.complianceScore
  });
  const mutationLogs = await listAuditLogs({
    organizationId,
    action: 'executive.funding_update_required',
    entityType: 'executive',
    entityId: 'funding',
    limit: 1
  });
  const summaryViewLogs = await listAuditLogs({
    organizationId,
    action: 'funding.summary.viewed',
    entityType: 'funding_round',
    limit: 1
  });
  const lastMutationAt = pickLatestTimestamp(mutationLogs);
  const lastSummaryViewedAt = pickLatestTimestamp(summaryViewLogs);
  const requiresExecutiveUpdate =
    lastMutationAt !== null &&
    (lastSummaryViewedAt === null || lastMutationAt > lastSummaryViewedAt);
  const dilutionForEfficiency =
    toSafeNumber(latestRound?.dilutionPercentage) ?? averageDilution;
  const runwayForEfficiency = toSafeNumber(projectedRunwayMonths);
  const capitalEfficiencyScore = roundToIntegerOrNull(
    Math.max(
      0,
      Math.min(
        100,
        (runwayForEfficiency === null ? 50 : Math.min(100, (runwayForEfficiency / 24) * 100)) *
          0.45 +
          (dilutionForEfficiency === null
            ? 45
            : Math.max(0, 100 - Math.max(0, dilutionForEfficiency - 12) * 3)) *
            0.35 +
          (totalRounds > 0 ? Math.min(100, totalRounds * 20) : 0) * 0.2
      )
    )
  );
  const humanReviewRequired =
    complianceSignal.requiresHumanReview ||
    fundingRiskStatus === 'high_risk_audit_required' ||
    windowSignal.optimalFundingWindowStatus !== 'open';
  const executiveSignals = [
    complianceSignal.rationale,
    valuationSignal.rationale,
    windowSignal.message,
    'Funding Intelligence is a decision-support layer. Financial, legal and investor actions require human review.'
  ];

  await recordFundingAudit({
    organizationId,
    userId: actor.userId,
    action: 'funding.bridge.evaluated',
    metadata: {
      complianceStatus: complianceSignal.complianceStatus,
      valuationSource: valuationSignal.suggestedValuationSource
    }
  });
  await recordFundingAudit({
    organizationId,
    userId: actor.userId,
    action: 'funding.window.evaluated',
    metadata: {
      optimalFundingWindow: windowSignal.optimalFundingWindow,
      optimalFundingWindowStatus: windowSignal.optimalFundingWindowStatus
    }
  });
  await recordFundingAudit({
    organizationId,
    userId: actor.userId,
    action: 'funding.summary.viewed',
    metadata: {
      roundsCount: rounds.length,
      totalRaised
    }
  });

  return {
    roundsCount: rounds.length,
    activeRounds,
    totalRaised,
    totalAmountRaised: totalRaised,
    totalRounds,
    latestRoundId: latestRound?.id || null,
    latestRoundType: latestRound?.roundType || null,
    latestInvestorName: latestRound?.investorName || null,
    latestClosingDate: latestRound?.closingDate || null,
    latestAmountRaised: toSafeNumber(latestRound?.amountRaised),
    latestPostMoneyValuation: toSafeNumber(latestRound?.valuationPostMoney),
    latestPreMoneyValuation: toSafeNumber(latestRound?.valuationPreMoney),
    estimatedDilution: toSafeNumber(latestRound?.dilutionPercentage) ?? averageDilution,
    averageDilution,
    monthlyBurnRate,
    currentCash,
    projectedRunwayMonths,
    runwayStatus,
    capitalEfficiencyScore,
    fundingRiskStatus,
    complianceScore: complianceSignal.complianceScore,
    complianceStatus: complianceSignal.complianceStatus,
    suggestedPreMoneyValuation: valuationSignal.suggestedPreMoneyValuation,
    suggestedValuationSource: valuationSignal.suggestedValuationSource,
    suggestedValuationConfidence: valuationSignal.suggestedValuationConfidence,
    requiresExecutiveUpdate,
    optimalFundingWindow: windowSignal.optimalFundingWindow,
    optimalFundingWindowStatus: windowSignal.optimalFundingWindowStatus,
    executiveSignals,
    humanReviewRequired,
    latestRound
  };
}

export default {
  listByOrganization,
  getByIdForOrganization,
  createForOrganization,
  updateForOrganization,
  deleteForOrganization,
  getFundingSummary,
  calculateCashRunway,
  calculateDilution
};
