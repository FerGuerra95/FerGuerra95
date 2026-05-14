import { createSqliteEntityStore } from '../../storage/sqliteEntityStore.service.js';
import { recordAuditLog } from '../audit/auditLog.service.js';
import { getBridgeExecutiveHubBrief } from '../bridge/bridge.service.js';
import { getGovernanceExecutiveHubBrief } from '../governance/governance.service.js';
import { getHeritageExecutiveHubBrief } from '../heritage/heritage.service.js';

const VALID_BRANCHES = new Set(['bridge', 'heritage', 'governance']);

const BRANCH_BASELINES = Object.freeze({
  bridge: Object.freeze({
    label: 'The Bridge',
    score: 62,
    posture: 'Curate verified network',
    title: 'Liquidity network foundation',
    route: '/bridge/dashboard'
  }),
  heritage: Object.freeze({
    label: 'Heritage & Legacy',
    score: 58,
    posture: 'Map owner legacy',
    title: 'Legacy infrastructure foundation',
    route: '/heritage/dashboard'
  }),
  governance: Object.freeze({
    label: 'Governance & ESG',
    score: 64,
    posture: 'Formalize board controls',
    title: 'Governance control foundation',
    route: '/governance/dashboard'
  })
});

const ecosystemStore = createSqliteEntityStore(
  'ecosystem_records',
  'ecosystem_record',
  {
    branch: 'bridge',
    title: 'Ecosystem record',
    status: 'draft',
    score: '',
    payload: {}
  }
);

function createError(message, status = 400, code = 'ECOSYSTEM_ERROR') {
  const error = new Error(message);
  error.status = status;
  error.code = code;
  return error;
}

function normalizeText(value, fallback = '') {
  return String(value ?? fallback).trim();
}

export function normalizeBranch(value) {
  const branch = normalizeText(value).toLowerCase();

  if (!VALID_BRANCHES.has(branch)) {
    throw createError(
      'Rama ecosystem no valida. Usa bridge, heritage o governance.',
      400,
      'INVALID_ECOSYSTEM_BRANCH'
    );
  }

  return branch;
}

function assertOrganizationId(organizationId) {
  if (!normalizeText(organizationId)) {
    throw createError('Scope de organizacion no definido.', 403, 'INVALID_SCOPE');
  }
}

function sanitizePayload(branch, payload = {}) {
  const source = payload && typeof payload === 'object' ? payload : {};

  const next = {
    branch: normalizeBranch(branch),
    ...(source.title !== undefined
      ? { title: normalizeText(source.title, 'Ecosystem record') || 'Ecosystem record' }
      : {}),
    ...(source.status !== undefined
      ? { status: normalizeText(source.status, 'draft') || 'draft' }
      : {}),
    ...(source.score !== undefined ? { score: normalizeText(source.score) } : {})
  };

  if (source.payload && typeof source.payload === 'object') {
    next.payload = source.payload;
  }

  return next;
}

function clampScore(value) {
  return Math.max(0, Math.min(100, Math.round(Number(value) || 0)));
}

function normalizeNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function getRecordScore(record, fallback) {
  const payloadScore = Number(record?.payload?.score);
  const directScore = Number(record?.score);

  if (Number.isFinite(payloadScore)) return clampScore(payloadScore);
  if (Number.isFinite(directScore)) return clampScore(directScore);

  return fallback;
}

function summarizeBridgeMetrics(records = []) {
  const bridgeRecords = records.filter((item) => item.branch === 'bridge');
  const opportunityRecords = bridgeRecords.filter(
    (item) => normalizeText(item.payload?.recordType, 'opportunity') !== 'counterparty'
  );
  const counterpartyRecords = bridgeRecords.filter(
    (item) => normalizeText(item.payload?.recordType) === 'counterparty'
  );
  const activeRecords = bridgeRecords.filter((item) => {
    const status = normalizeText(item.status).toLowerCase();
    return status === 'active' || status === 'ready' || status === 'in_progress';
  });
  const qualifiedRecords = opportunityRecords.filter((item) => {
    const qualification = normalizeText(item.payload?.qualificationStatus).toLowerCase();
    return ['qualified', 'verified', 'ic_ready', 'mandated'].includes(qualification);
  });
  const introducedRecords = opportunityRecords.filter((item) => {
    const stage = normalizeText(item.payload?.stage).toLowerCase();
    return stage.includes('intro') || stage.includes('diligence') || stage.includes('closing');
  });
  const mandatedRecords = opportunityRecords.filter((item) => {
    const stage = normalizeText(item.payload?.stage).toLowerCase();
    return stage.includes('mandate') || stage.includes('closing');
  });
  const totalOpportunityValue = opportunityRecords.reduce(
    (sum, item) => sum + normalizeNumber(item.payload?.opportunityValue),
    0
  );
  const weightedPipelineValue = opportunityRecords.reduce((sum, item) => {
    const value = normalizeNumber(item.payload?.opportunityValue);
    const probability = normalizeNumber(item.payload?.probability, 0) / 100;
    return sum + value * Math.max(0, Math.min(1, probability));
  }, 0);
  const introductionLedgerCount = opportunityRecords.reduce(
    (sum, item) =>
      sum + (Array.isArray(item.payload?.introductionLedger) ? item.payload.introductionLedger.length : 0),
    0
  );
  const introductionsCount = opportunityRecords.reduce(
    (sum, item) =>
      sum +
      Math.max(
        normalizeNumber(item.payload?.introductionsCount),
        Array.isArray(item.payload?.introductionLedger) ? item.payload.introductionLedger.length : 0
      ),
    0
  );
  const confidentialityExceptionsCount = opportunityRecords.filter((item) => {
    const ndaStatus = normalizeText(item.payload?.ndaStatus, 'required').toLowerCase();
    const redactionLevel = normalizeText(item.payload?.redactionLevel, 'teaser').toLowerCase();
    const boardApprovalRequired = item.payload?.boardApprovalRequired === true;
    return ndaStatus !== 'signed' || redactionLevel === 'full_data_room' || boardApprovalRequired;
  }).length;
  const readinessScore = clampScore(
    opportunityRecords.length === 0
      ? BRANCH_BASELINES.bridge.score
      : qualifiedRecords.length * 18 +
          introducedRecords.length * 14 +
          mandatedRecords.length * 18 +
          Math.min(18, counterpartyRecords.length * 4) +
          Math.min(30, introductionsCount * 4) +
          Math.min(16, totalOpportunityValue / 1000000) -
          confidentialityExceptionsCount * 6
  );

  return {
    totalOpportunityValue: Math.round(totalOpportunityValue),
    weightedPipelineValue: Math.round(weightedPipelineValue),
    introductionsCount,
    introductionLedgerCount,
    counterpartiesCount: counterpartyRecords.length,
    qualifiedOpportunitiesCount: qualifiedRecords.length,
    activeMandatesCount: mandatedRecords.length,
    confidentialityExceptionsCount,
    activeOpportunitiesCount: activeRecords.filter(
      (item) => normalizeText(item.payload?.recordType, 'opportunity') !== 'counterparty'
    ).length,
    conversionRate:
      opportunityRecords.length > 0
        ? clampScore((introducedRecords.length / opportunityRecords.length) * 100)
        : 0,
    readinessScore
  };
}

function summarizeBranch(branch, records = []) {
  const baseline = BRANCH_BASELINES[branch];
  const branchRecords = records.filter((item) => item.branch === branch);
  const latestRecord = [...branchRecords].sort(
    (a, b) =>
      new Date(b.updatedAt || b.createdAt || 0).getTime() -
      new Date(a.updatedAt || a.createdAt || 0).getTime()
  )[0] || null;
  const activeRecords = branchRecords.filter((item) => {
    const status = normalizeText(item.status).toLowerCase();
    return status === 'active' || status === 'ready' || status === 'in_progress';
  });
  const scoreSamples = branchRecords.map((item) => getRecordScore(item, baseline.score));
  const bridgeMetrics = branch === 'bridge' ? summarizeBridgeMetrics(records) : null;
  const averageRecordScore =
    scoreSamples.length > 0
      ? clampScore(scoreSamples.reduce((sum, item) => sum + item, 0) / scoreSamples.length)
      : baseline.score;
  const score =
    bridgeMetrics
      ? Math.max(averageRecordScore, bridgeMetrics.readinessScore)
      : scoreSamples.length > 0
      ? averageRecordScore
      : baseline.score;

  return {
    branch,
    label: baseline.label,
    score,
    posture: latestRecord?.payload?.posture || baseline.posture,
    title: latestRecord?.title || baseline.title,
    route: baseline.route,
    recordsCount: branchRecords.length,
    activeRecordsCount: activeRecords.length,
    metrics: bridgeMetrics || {},
    latestRecord: latestRecord && {
      id: latestRecord.id,
      title: latestRecord.title,
      status: latestRecord.status,
      score: getRecordScore(latestRecord, baseline.score),
      updatedAt: latestRecord.updatedAt
    }
  };
}

async function recordEcosystemAudit({
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
      entityType: 'ecosystem_record',
      entityId,
      metadata
    });
  } catch {
    // Audit never blocks ecosystem operations.
  }
}

export async function listEcosystemRecords(organizationId, branch) {
  assertOrganizationId(organizationId);
  const normalizedBranch = normalizeBranch(branch);
  const items = await ecosystemStore.listByOrganization(organizationId);
  return items.filter((item) => item.branch === normalizedBranch);
}

export async function getEcosystemRecordById(organizationId, branch, id) {
  assertOrganizationId(organizationId);
  const normalizedBranch = normalizeBranch(branch);
  const item = await ecosystemStore.getByIdForOrganization(normalizeText(id), organizationId);

  if (!item || item.branch !== normalizedBranch) return null;

  return item;
}

export async function createEcosystemRecord(
  organizationId,
  branch,
  payload = {},
  actor = {}
) {
  assertOrganizationId(organizationId);
  const normalizedBranch = normalizeBranch(branch);

  const created = await ecosystemStore.create({
    ...sanitizePayload(normalizedBranch, payload),
    organizationId,
    userId: normalizeText(actor.userId) || null
  });

  await recordEcosystemAudit({
    organizationId,
    userId: actor.userId,
    action: `ecosystem.${normalizedBranch}.record.created`,
    entityId: created?.id || '',
    metadata: {
      branch: normalizedBranch,
      status: created?.status || null
    }
  });

  return created;
}

export async function updateEcosystemRecord(
  organizationId,
  branch,
  id,
  payload = {},
  actor = {}
) {
  assertOrganizationId(organizationId);
  const existing = await getEcosystemRecordById(organizationId, branch, id);

  if (!existing) return null;

  const normalizedBranch = normalizeBranch(branch);
  const updated = await ecosystemStore.updateForOrganization(
    normalizeText(id),
    sanitizePayload(normalizedBranch, payload),
    organizationId
  );

  await recordEcosystemAudit({
    organizationId,
    userId: actor.userId,
    action: `ecosystem.${normalizedBranch}.record.updated`,
    entityId: updated?.id || '',
    metadata: {
      branch: normalizedBranch,
      status: updated?.status || null
    }
  });

  return updated;
}

export async function deleteEcosystemRecord(organizationId, branch, id, actor = {}) {
  assertOrganizationId(organizationId);
  const existing = await getEcosystemRecordById(organizationId, branch, id);

  if (!existing) {
    return {
      deleted: false,
      id: normalizeText(id)
    };
  }

  const result = await ecosystemStore.removeForOrganization(normalizeText(id), organizationId);

  if (result.deleted) {
    const normalizedBranch = normalizeBranch(branch);
    await recordEcosystemAudit({
      organizationId,
      userId: actor.userId,
      action: `ecosystem.${normalizedBranch}.record.deleted`,
      entityId: normalizeText(id),
      metadata: {
        branch: normalizedBranch
      }
    });
  }

  return result;
}

export async function getEcosystemExecutiveHubBrief(scope = {}) {
  assertOrganizationId(scope.organizationId);

  const records = await ecosystemStore.listByOrganization(scope.organizationId);
  const branches = Object.keys(BRANCH_BASELINES).map((branch) =>
    summarizeBranch(branch, records)
  );
  const bridgeBrief = await getBridgeExecutiveHubBrief({
    organizationId: scope.organizationId
  });
  const governanceBrief = await getGovernanceExecutiveHubBrief({
    organizationId: scope.organizationId
  });
  const heritageBrief = await getHeritageExecutiveHubBrief({
    organizationId: scope.organizationId
  });
  const enrichedBranches = branches.map((branch) =>
    branch.branch === 'bridge'
      ? {
          ...branch,
          score: bridgeBrief.score,
          posture: bridgeBrief.posture,
          title: bridgeBrief.title,
          recordsCount: bridgeBrief.metrics.activeOpportunitiesCount + bridgeBrief.metrics.counterpartiesCount,
          activeRecordsCount: bridgeBrief.metrics.activeOpportunitiesCount,
          metrics: bridgeBrief.metrics,
          latestRecord: bridgeBrief.latestOpportunity
        }
      : branch.branch === 'governance'
        ? {
            ...branch,
            score: governanceBrief.score,
            posture: governanceBrief.posture,
            title: governanceBrief.title,
            recordsCount:
              governanceBrief.metrics.decisionsCount +
              governanceBrief.metrics.controlsCount +
              governanceBrief.metrics.esgMetricsCount +
              (governanceBrief.metrics.boardPacksDraft || 0) +
              (governanceBrief.metrics.boardPacksReview || 0) +
              (governanceBrief.metrics.boardPacksFinal || 0) +
              (governanceBrief.metrics.upcomingCommittees || 0) +
              (governanceBrief.metrics.policyReviewRisk || 0),
            activeRecordsCount: governanceBrief.metrics.controlsCount + governanceBrief.metrics.pendingDecisions,
            metrics: governanceBrief.metrics,
            latestRecord: governanceBrief.latestDecision
          }
      : branch.branch === 'heritage'
        ? {
            ...branch,
            score: heritageBrief.score,
            posture: heritageBrief.posture,
            title: heritageBrief.title,
            recordsCount:
              heritageBrief.metrics.assetsCount +
              heritageBrief.metrics.successionsCount +
              heritageBrief.metrics.protectionsCount +
              (heritageBrief.metrics.documentsCount || 0) +
              (heritageBrief.metrics.reportsCount || 0),
            activeRecordsCount: heritageBrief.metrics.protectedAssetsCount,
            metrics: heritageBrief.metrics,
            latestRecord: heritageBrief.latestAsset
          }
      : branch
  );
  const averageScore = clampScore(
    enrichedBranches.reduce((sum, branch) => sum + branch.score, 0) / enrichedBranches.length
  );

  return {
    version: 'ecosystem-executive-hub-v1',
    organizationId: scope.organizationId,
    generatedAt: new Date().toISOString(),
    score: averageScore,
    posture:
      averageScore >= 75
        ? 'Enterprise branches active'
        : 'Activate branch records',
    branches: enrichedBranches,
    recordsCount: records.length
  };
}

export default {
  listEcosystemRecords,
  getEcosystemRecordById,
  createEcosystemRecord,
  updateEcosystemRecord,
  deleteEcosystemRecord,
  getEcosystemExecutiveHubBrief
};
