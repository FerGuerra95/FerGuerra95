import { listMaDeals } from '../ma/deals.service.js';
import { getExecutiveComplianceHubBrief } from '../compliance/executiveHub.service.js';
import { getFundingSummary } from '../funding/funding.service.js';
import { getGovernanceSummary } from '../governance/governance.service.js';
import { getPmiSummary } from '../pmi/pmi.service.js';
import { getEnterpriseBridgeSummary } from '../bridge/bridge.service.js';
import { getRiskSummary } from '../risk/risk.service.js';
import { getReportingSummary } from '../reporting/reporting.service.js';
import { getStrategySummary } from '../strategy/strategy.service.js';
import { recordAuditLog } from '../audit/auditLog.service.js';
import { buildBoardViewSnapshot, createExecutiveBoardView } from './boardView.service.js';
import { buildExecutiveCalendar } from './executiveCalendar.service.js';
import { buildExecutiveDecisionQueue } from './decisionQueue.service.js';
import { buildExecutiveSignals } from './executiveSignals.service.js';
import { calculateExecutiveReadinessIndex, clampScore } from './readinessIndex.service.js';
import { createExecutiveReport, createExecutiveSnapshot, getExecutiveReportTypes } from './executiveReports.service.js';

function text(value, fallback = '') {
  return String(value ?? fallback).trim() || fallback;
}

function assertOrganizationId(organizationId) {
  if (!text(organizationId)) {
    const error = new Error('Scope de organizacion no definido.');
    error.status = 403;
    error.code = 'INVALID_SCOPE';
    throw error;
  }
}

async function safeModule(key, loader) {
  try {
    const data = await loader();
    return { key, status: 'available', data };
  } catch (error) {
    return {
      key,
      status: 'not_available',
      data: null,
      reason: error?.code || error?.message || 'not_available'
    };
  }
}

function hasPersistedExecutiveModuleData(key, data) {
  if (!data || typeof data !== 'object') return false;

  switch (key) {
    case 'ma':
      return Number(data.counts?.deals ?? data.totalDeals ?? 0) > 0 || Boolean(data.latestDeal?.id);
    case 'compliance':
      return Boolean(data.latestAuditRun?.id);
    case 'funding':
      return (
        Number(data.totalAmountRaised ?? data.totalRaised ?? 0) > 0 ||
        Number(data.totalRounds ?? data.roundsCount ?? 0) > 0 ||
        Number(data.projectedRunwayMonths ?? data.runwayMonths ?? 0) > 0
      );
    case 'governance':
      return Number(data.counts?.decisions ?? data.metrics?.decisionsCount ?? 0) > 0;
    case 'pmi':
      return Boolean(data.latestCase?.id) || Number(data.metrics?.casesCount ?? 0) > 0;
    case 'bridge':
      return (
        Number(data.metrics?.counterpartiesCount ?? 0) > 0 ||
        Number(data.metrics?.documentsCount ?? 0) > 0 ||
        Number(data.metrics?.qualifiedOpportunitiesCount ?? 0) > 0
      );
    case 'risk':
      return Number(data.counts?.risks ?? data.metrics?.totalRisks ?? 0) > 0;
    case 'reporting':
      return (
        Number(data.counts?.reports ?? 0) > 0 ||
        Number(data.counts?.boardPacks ?? 0) > 0 ||
        Number(data.counts?.evidence ?? 0) > 0
      );
    case 'strategy':
      return (
        Number(data.counts?.objectives ?? 0) > 0 ||
        Number(data.counts?.initiatives ?? 0) > 0
      );
    default:
      return false;
  }
}

function normalizeExecutiveModuleEntry(entry) {
  if (entry.status !== 'available' || !entry.data) {
    return {
      ...entry,
      humanReviewRequired: true,
      executiveSignalEligible: false,
      dataSource: entry.status === 'not_available' ? 'not_available' : 'insufficient_data'
    };
  }

  if (hasPersistedExecutiveModuleData(entry.key, entry.data)) {
    return {
      ...entry,
      humanReviewRequired: true,
      executiveSignalEligible: true,
      dataSource: 'persisted_operational_dss'
    };
  }

  return {
    ...entry,
    status: 'insufficient_data',
    reason: 'insufficient_persisted_data',
    humanReviewRequired: true,
    executiveSignalEligible: false,
    dataSource: 'empty'
  };
}

function summarizeMaDeals(deals = []) {
  const activeDeals = deals.filter((item) => !['archived', 'completed'].includes(text(item.status).toLowerCase()));
  const highPriority = activeDeals.filter((item) => ['high', 'review', 'watch'].includes(text(item.priority).toLowerCase())).length;

  if (deals.length === 0) {
    return {
      readinessScore: null,
      score: null,
      counts: { deals: 0, activeDeals: 0, highPriority: 0 },
      latestDeal: null,
      requiresExecutiveAttention: true,
      humanReviewPosture: 'human_review_required',
      dataSource: 'empty',
      executiveSignalEligible: false
    };
  }

  const readinessScore = clampScore(68 + Math.min(18, activeDeals.length * 3) - highPriority * 4);
  return {
    readinessScore,
    score: readinessScore,
    counts: { deals: deals.length, activeDeals: activeDeals.length, highPriority },
    latestDeal: deals[0] || null,
    requiresExecutiveAttention: highPriority > 0,
    humanReviewPosture: 'human_review_required',
    dataSource: 'persisted_operational_dss',
    executiveSignalEligible: true
  };
}

export async function collectExecutiveModuleSummaries(scope = {}) {
  assertOrganizationId(scope.organizationId);
  const organizationId = scope.organizationId;
  const actor = { userId: scope.userId || '', role: scope.role || 'viewer' };

  const entries = await Promise.all([
    safeModule('ma', async () => summarizeMaDeals(await listMaDeals({ organizationId }))),
    safeModule('compliance', () => getExecutiveComplianceHubBrief({ organizationId })),
    safeModule('funding', () => getFundingSummary(organizationId, actor)),
    safeModule('governance', () => getGovernanceSummary({ organizationId })),
    safeModule('pmi', () => getPmiSummary({ organizationId })),
    safeModule('bridge', () => getEnterpriseBridgeSummary({ organizationId })),
    safeModule('risk', () => getRiskSummary({ organizationId })),
    safeModule('reporting', () => getReportingSummary({ organizationId })),
    safeModule('strategy', () => getStrategySummary({ organizationId }))
  ]);

  return entries.reduce((acc, entry) => {
    const normalized = normalizeExecutiveModuleEntry(entry);
    acc[normalized.key] = {
      status: normalized.status,
      data: normalized.data,
      reason: normalized.reason,
      dataSource: normalized.dataSource,
      humanReviewRequired: normalized.humanReviewRequired,
      executiveSignalEligible: normalized.executiveSignalEligible
    };
    return acc;
  }, {});
}

export function buildExecutiveAlerts({ signals = [], readiness = {} } = {}) {
  const alerts = signals
    .filter((item) => ['blocked', 'critical', 'risk', 'insufficient_data'].includes(item.severity))
    .map((item) => ({
      module: item.module,
      status: item.severity,
      title: item.title,
      recommendedAction: item.recommendedAction,
      humanReviewRequired: true
    }));
  if (readiness.score !== null && readiness.score < 60) {
    alerts.unshift({
      module: 'Executive',
      status: 'risk',
      title: 'Executive readiness below target',
      recommendedAction: 'Review missing data, blocked decisions and readiness drivers.',
      humanReviewRequired: true
    });
  }
  return alerts.slice(0, 12);
}

export function buildModuleCards(moduleSummaries = {}, readiness = {}) {
  const score = (key, paths = []) => readiness.moduleScores?.[key] ?? paths.reduce((value, path) => {
    if (value !== null) return value;
    const next = path.split('.').reduce((current, part) => current?.[part], moduleSummaries[key]?.data);
    return Number.isFinite(Number(next)) ? clampScore(next) : null;
  }, null);
  return [
    ['ma', 'M&A', '/ma/dashboard', score('ma')],
    ['compliance', 'Compliance', '/compliance/dashboard', score('compliance')],
    ['funding', 'Funding', '/funding/dashboard', score('funding')],
    ['governance', 'Governance', '/governance/dashboard', score('governance')],
    ['pmi', 'PMI', '/pmi/dashboard', score('pmi')],
    ['bridge', 'Bridge', '/bridge/dashboard', moduleSummaries.bridge?.data?.metrics?.crossModuleReadiness],
    ['risk', 'Risk', '/risk/dashboard', score('risk')],
    ['reporting', 'Reporting', '/reporting/dashboard', score('reporting')],
    ['strategy', 'Strategy', '/strategy/dashboard', score('strategy')]
  ].map(([key, title, route, rawScore]) => {
    const entry = moduleSummaries[key] || {};
    const envelopeStatus = entry.status;
    const eligible =
      envelopeStatus === 'available' && entry.executiveSignalEligible !== false;
    const value =
      eligible && rawScore !== null && rawScore !== undefined ? clampScore(rawScore) : null;

    let status = 'insufficient_data';
    if (envelopeStatus === 'not_available') {
      status = 'not_available';
    } else if (value !== null) {
      status = value < 60 ? 'watch' : 'normal';
    }

    return {
      key,
      title,
      route,
      status,
      score: value,
      trend: value !== null ? readiness.trend : 'insufficient_data',
      keyMetric: value !== null ? `${value}/100` : 'Insufficient data',
      attentionFlag: value !== null ? value < 65 : false,
      cta: value !== null ? 'Open module' : 'Signal not available',
      humanReviewRequired: true,
      executiveSignalEligible: value !== null
    };
  });
}

export async function getExecutiveOverview(scope = {}) {
  assertOrganizationId(scope.organizationId);
  const moduleSummaries = await collectExecutiveModuleSummaries(scope);
  const readiness = calculateExecutiveReadinessIndex(moduleSummaries);
  const signals = buildExecutiveSignals({ moduleSummaries, readiness });
  const decisionQueue = buildExecutiveDecisionQueue({ moduleSummaries, signals });
  const boardView = buildBoardViewSnapshot({ moduleSummaries, signals, decisionQueue, readiness });
  const calendar = buildExecutiveCalendar({ moduleSummaries, decisionQueue });
  const alerts = buildExecutiveAlerts({ signals, readiness });
  const moduleCards = buildModuleCards(moduleSummaries, readiness);
  const overview = {
    version: 'executive-command-center-v1',
    organizationId: scope.organizationId,
    generatedAt: new Date().toISOString(),
    corporateHealthRadar: moduleCards.map((card) => ({
      key: card.key,
      label: card.title,
      value: card.score,
      score: card.score,
      status: card.status,
      route: card.route,
      displayLabel: card.score === null ? 'N/A' : `${card.score}/100`,
      executiveSignalEligible: card.executiveSignalEligible === true
    })),
    readiness,
    executiveReadinessIndex: readiness,
    signals,
    decisionQueue,
    boardView,
    alerts,
    moduleCards,
    calendar,
    reports: getExecutiveReportTypes(),
    humanReviewPosture: 'human_review_required',
    dssNotice: 'Decision support only. Outputs require human review and do not replace board, legal, finance, audit or committee approvals.'
  };

  await recordAuditLog({
    organizationId: scope.organizationId,
    userId: scope.userId || '',
    action: 'executive.decision_queue.viewed',
    entityType: 'executive',
    entityId: 'overview',
    metadata: { readinessScore: readiness.score, signalCount: signals.length }
  });

  return overview;
}

export async function getExecutiveSummary(scope = {}) {
  const overview = await getExecutiveOverview(scope);
  return {
    generatedAt: overview.generatedAt,
    readiness: overview.readiness,
    bridgeHealthStatus: overview.moduleCards.find((item) => item.key === 'bridge')?.status || 'not_available',
    criticalSignals: overview.signals.filter((item) => ['blocked', 'critical'].includes(item.severity)).length,
    executiveAttentionCount: overview.alerts.length,
    missingData: overview.readiness.missingData,
    requiresExecutiveAttention: overview.alerts.length > 0,
    humanReviewPosture: overview.humanReviewPosture
  };
}

export async function getExecutiveReadiness(scope = {}) {
  const moduleSummaries = await collectExecutiveModuleSummaries(scope);
  return calculateExecutiveReadinessIndex(moduleSummaries);
}

export async function getExecutiveSignals(scope = {}) {
  const moduleSummaries = await collectExecutiveModuleSummaries(scope);
  const readiness = calculateExecutiveReadinessIndex(moduleSummaries);
  return buildExecutiveSignals({ moduleSummaries, readiness });
}

export async function getExecutiveDecisionQueue(scope = {}) {
  const moduleSummaries = await collectExecutiveModuleSummaries(scope);
  const readiness = calculateExecutiveReadinessIndex(moduleSummaries);
  const signals = buildExecutiveSignals({ moduleSummaries, readiness });
  return buildExecutiveDecisionQueue({ moduleSummaries, signals });
}

export async function getExecutiveBoardView(scope = {}) {
  const moduleSummaries = await collectExecutiveModuleSummaries(scope);
  const readiness = calculateExecutiveReadinessIndex(moduleSummaries);
  const signals = buildExecutiveSignals({ moduleSummaries, readiness });
  const decisionQueue = buildExecutiveDecisionQueue({ moduleSummaries, signals });
  return buildBoardViewSnapshot({ moduleSummaries, signals, decisionQueue, readiness });
}

export async function getExecutiveCalendar(scope = {}) {
  const moduleSummaries = await collectExecutiveModuleSummaries(scope);
  const readiness = calculateExecutiveReadinessIndex(moduleSummaries);
  const signals = buildExecutiveSignals({ moduleSummaries, readiness });
  const decisionQueue = buildExecutiveDecisionQueue({ moduleSummaries, signals });
  return buildExecutiveCalendar({ moduleSummaries, decisionQueue });
}

export async function createSnapshotFromOverview(scope = {}, payload = {}) {
  const overview = await getExecutiveOverview(scope);
  return createExecutiveSnapshot(scope.organizationId, {
    title: payload.title || 'Executive snapshot',
    readinessScore: overview.readiness.score,
    confidence: overview.readiness.confidence,
    overview
  }, { userId: scope.userId || '' });
}

export async function createBoardViewFromOverview(scope = {}, payload = {}) {
  const boardView = await getExecutiveBoardView(scope);
  return createExecutiveBoardView(scope.organizationId, { ...boardView, ...payload }, { userId: scope.userId || '' });
}

export async function createExecutiveReportFromOverview(scope = {}, payload = {}) {
  const overview = await getExecutiveOverview(scope);
  return createExecutiveReport(scope.organizationId, {
    title: payload.title || 'CEO Weekly Brief',
    reportType: payload.reportType || 'ceo_weekly_brief',
    payload: { overview }
  }, { userId: scope.userId || '' });
}

export default {
  collectExecutiveModuleSummaries,
  getExecutiveBoardView,
  getExecutiveCalendar,
  getExecutiveDecisionQueue,
  getExecutiveOverview,
  getExecutiveReadiness,
  getExecutiveSignals,
  getExecutiveSummary
};
