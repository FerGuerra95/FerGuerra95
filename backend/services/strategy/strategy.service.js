import { createSqliteEntityStore } from '../../storage/sqliteEntityStore.service.js';
import { listAuditLogs, recordAuditLog } from '../audit/auditLog.service.js';

const objectivesStore = createSqliteEntityStore('strategic_objectives', 'strategy_objective', {
  title: 'Strategic objective',
  description: '',
  owner: 'Strategy Office',
  horizon: '12_months',
  priority: 'medium',
  status: 'active',
  targetMetric: 0,
  currentMetric: 0,
  linkedModule: '',
  linkedBoardDecisionId: '',
  payload: {}
});

const initiativesStore = createSqliteEntityStore('strategic_initiatives', 'strategy_initiative', {
  objectiveId: '',
  title: 'Strategic initiative',
  owner: 'Strategy Office',
  dueDate: '',
  status: 'active',
  progress: 0,
  blockers: [],
  dependencies: [],
  budgetNeed: 0,
  capitalNeed: 0,
  linkedFundingRoundId: '',
  linkedRiskId: '',
  payload: {}
});

const scenariosStore = createSqliteEntityStore('strategic_scenarios', 'strategy_scenario', {
  title: 'Strategic scenario',
  assumptions: [],
  upside: '',
  downside: '',
  recommendedAction: '',
  capitalImpact: 0,
  riskImpact: 'medium',
  probability: 50,
  confidence: 60,
  status: 'draft',
  payload: {}
});

const marketNotesStore = createSqliteEntityStore('strategic_market_notes', 'strategy_market_note', {
  market: '',
  competitor: '',
  signal: '',
  implication: '',
  sourceEvidence: '',
  confidence: 60,
  status: 'active',
  payload: {}
});

const risksStore = createSqliteEntityStore('strategic_risks', 'strategy_risk', {
  risk: 'Strategic risk',
  impact: 'medium',
  mitigation: '',
  linkedEnterpriseRiskId: '',
  status: 'open',
  payload: {}
});

const reportsStore = createSqliteEntityStore('strategy_report_exports', 'strategy_report', {
  reportType: 'strategy_board_memo',
  title: 'Strategy Board Memo',
  status: 'generated',
  payload: {}
});

function normalizeText(value, fallback = '') {
  return String(value ?? fallback).trim();
}

function normalizeNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

function clampScore(value) {
  return Math.max(0, Math.min(100, Math.round(normalizeNumber(value))));
}

function assertOrganizationId(organizationId) {
  if (!normalizeText(organizationId)) {
    const error = new Error('Scope de organizacion no definido.');
    error.status = 403;
    error.code = 'INVALID_SCOPE';
    throw error;
  }
}

function actorId(actor = {}) {
  return normalizeText(actor.userId || actor.id);
}

function commonCreate(organizationId, actor = {}) {
  const userId = actorId(actor);
  return { organizationId, userId, createdBy: userId };
}

function impactRank(value) {
  const impact = normalizeText(value).toLowerCase();
  if (impact === 'critical') return 4;
  if (impact === 'high') return 3;
  if (impact === 'medium') return 2;
  if (impact === 'low') return 1;
  return 0;
}

async function audit({ organizationId, userId = '', action, entityId = '', metadata = {} }) {
  await recordAuditLog({ organizationId, userId, action, entityType: 'strategy', entityId, metadata });
}

async function createWith(store, organizationId, payload = {}, actor = {}, action) {
  assertOrganizationId(organizationId);
  const item = await store.create({ ...commonCreate(organizationId, actor), ...payload });
  await audit({ organizationId, userId: actorId(actor), action, entityId: item.id, metadata: { title: item.title || item.risk || item.market } });
  return item;
}

async function updateWith(store, organizationId, id, payload = {}, actor = {}, action) {
  assertOrganizationId(organizationId);
  const item = await store.updateForOrganization(id, payload, organizationId);
  if (item) await audit({ organizationId, userId: actorId(actor), action, entityId: item.id, metadata: { status: item.status } });
  return item;
}

async function listAll(organizationId) {
  assertOrganizationId(organizationId);
  const [objectives, initiatives, scenarios, marketNotes, risks, reports] = await Promise.all([
    objectivesStore.listByOrganization(organizationId),
    initiativesStore.listByOrganization(organizationId),
    scenariosStore.listByOrganization(organizationId),
    marketNotesStore.listByOrganization(organizationId),
    risksStore.listByOrganization(organizationId),
    reportsStore.listByOrganization(organizationId)
  ]);
  return { objectives, initiatives, scenarios, marketNotes, risks, reports };
}

export function calculateStrategyMetrics({ objectives = [], initiatives = [], scenarios = [], marketNotes = [], risks = [] } = {}) {
  const normalizedObjectives = normalizeArray(objectives);
  const normalizedInitiatives = normalizeArray(initiatives);
  const normalizedScenarios = normalizeArray(scenarios);
  const normalizedMarketNotes = normalizeArray(marketNotes);
  const normalizedRisks = normalizeArray(risks);
  const hasPersistedStrategyData =
    normalizedObjectives.length +
      normalizedInitiatives.length +
      normalizedScenarios.length +
      normalizedMarketNotes.length +
      normalizedRisks.length >
    0;
  const scoringTruthfulness = {
    certifiedRating: false,
    operationalDss: true,
    goldenBenchmark: null,
    humanReviewRequired: true,
    note: 'Strategy readiness is an operational DSS heuristic — not a certified strategy rating.'
  };

  if (!hasPersistedStrategyData) {
    return {
      strategyReadinessScore: null,
      objectiveCompletion: null,
      scenarioConfidence: null,
      executionConfidence: null,
      objectivesByStatus: {},
      initiativesProgress: null,
      blockedStrategicInitiatives: 0,
      strategicRisks: 0,
      capitalDependencyCount: 0,
      boardDecisionsRequired: 0,
      strategicRiskLevel: 'not_assessed',
      scenariosCount: 0,
      marketSignalsCount: 0,
      requiresExecutiveAttention: false,
      humanReviewPosture: 'human_review_required',
      strategyStatus: 'insufficient_data',
      dataSource: 'insufficient_data',
      executiveSignalEligible: false,
      humanReviewRequired: true,
      scoringTruthfulness
    };
  }

  const activeObjectives = normalizedObjectives.filter(
    (item) => !['closed', 'archived'].includes(normalizeText(item.status).toLowerCase())
  );
  const blockedStrategicInitiatives = normalizedInitiatives.filter(
    (item) => normalizeText(item.status).toLowerCase() === 'blocked' || normalizeArray(item.blockers).length > 0
  ).length;
  const initiativeProgress = normalizedInitiatives.length
    ? Math.round(
        normalizedInitiatives.reduce((sum, item) => sum + normalizeNumber(item.progress), 0) /
          normalizedInitiatives.length
      )
    : null;
  const capitalDependencyCount = normalizedInitiatives.filter(
    (item) => normalizeNumber(item.capitalNeed) > 0 || normalizeNumber(item.budgetNeed) > 0 || item.linkedFundingRoundId
  ).length;
  const boardDecisionsRequired =
    normalizedObjectives.filter((item) => normalizeText(item.linkedBoardDecisionId)).length +
    normalizedInitiatives.filter((item) =>
      normalizeArray(item.dependencies).some((dep) => String(dep).toLowerCase().includes('board'))
    ).length;
  const highRiskCount = normalizedRisks.filter(
    (item) => impactRank(item.impact) >= 3 && !['closed', 'mitigated'].includes(normalizeText(item.status).toLowerCase())
  ).length;
  const scenarioConfidence = normalizedScenarios.length
    ? Math.round(
        normalizedScenarios.reduce((sum, item) => sum + normalizeNumber(item.confidence), 0) /
          normalizedScenarios.length
      )
    : null;
  const objectiveCompletion = activeObjectives.length
    ? Math.round(
        activeObjectives.reduce((sum, item) => {
          const target = normalizeNumber(item.targetMetric);
          const current = normalizeNumber(item.currentMetric);
          return sum + (target > 0 ? clampScore((current / target) * 100) : 50);
        }, 0) / activeObjectives.length
      )
    : null;
  const canCalculateReadiness =
    activeObjectives.length > 0 || normalizedInitiatives.length > 0 || normalizedScenarios.length > 0;
  const strategyReadinessScore = canCalculateReadiness
    ? clampScore(
        (objectiveCompletion ?? 0) * 0.3 +
          (initiativeProgress ?? 0) * 0.25 +
          (scenarioConfidence ?? 0) * 0.18 +
          Math.min(100, normalizedMarketNotes.length * 10) * 0.08 +
          Math.max(0, 100 - blockedStrategicInitiatives * 18) * 0.1 +
          Math.max(0, 100 - highRiskCount * 15) * 0.09
      )
    : null;
  const requiresExecutiveAttention =
    blockedStrategicInitiatives > 0 || capitalDependencyCount > 0 || highRiskCount > 0 || boardDecisionsRequired > 0;
  const strategicRiskLevel =
    highRiskCount > 0 ? 'high' : normalizedRisks.length > 0 ? 'watch' : 'not_assessed';

  return {
    strategyReadinessScore,
    objectiveCompletion,
    scenarioConfidence,
    executionConfidence: initiativeProgress,
    objectivesByStatus: normalizedObjectives.reduce((acc, item) => {
      const key = normalizeText(item.status, 'active');
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {}),
    initiativesProgress: initiativeProgress === null ? null : clampScore(initiativeProgress),
    blockedStrategicInitiatives,
    strategicRisks: normalizedRisks.length,
    capitalDependencyCount,
    boardDecisionsRequired,
    strategicRiskLevel,
    scenariosCount: normalizedScenarios.length,
    marketSignalsCount: normalizedMarketNotes.length,
    requiresExecutiveAttention,
    humanReviewPosture: 'human_review_required',
    strategyStatus:
      strategyReadinessScore === null
        ? 'insufficient_data'
        : requiresExecutiveAttention
          ? 'watch'
          : 'aligned',
    dataSource: 'operational_dss',
    executiveSignalEligible: strategyReadinessScore !== null,
    humanReviewRequired: true,
    scoringTruthfulness
  };
}

function bridgeSignals(metrics = {}) {
  const signals = [];
  if (metrics.capitalDependencyCount > 0) signals.push('strategy.strategic_capital_dependency');
  if (metrics.blockedStrategicInitiatives > 0) signals.push('strategy.blocked_initiative_requires_governance');
  if (metrics.boardDecisionsRequired > 0) signals.push('strategy.board_decision_required');
  if (metrics.requiresExecutiveAttention) signals.push('bridge.strategy_signal.created');
  return signals;
}

export async function listStrategicObjectives(organizationId) { assertOrganizationId(organizationId); return objectivesStore.listByOrganization(organizationId); }
export const createStrategicObjective = (organizationId, payload, actor) => createWith(objectivesStore, organizationId, payload, actor, 'strategy.objective.created');
export const updateStrategicObjective = (organizationId, id, payload, actor) => updateWith(objectivesStore, organizationId, id, payload, actor, 'strategy.objective.updated');
export async function listStrategicInitiatives(organizationId) { assertOrganizationId(organizationId); return initiativesStore.listByOrganization(organizationId); }
export const createStrategicInitiative = (organizationId, payload, actor) => createWith(initiativesStore, organizationId, payload, actor, 'strategy.initiative.created');
export const updateStrategicInitiative = (organizationId, id, payload, actor) => updateWith(initiativesStore, organizationId, id, payload, actor, 'strategy.initiative.updated');
export async function listStrategicScenarios(organizationId) { assertOrganizationId(organizationId); return scenariosStore.listByOrganization(organizationId); }
export const createStrategicScenario = (organizationId, payload, actor) => createWith(scenariosStore, organizationId, payload, actor, 'strategy.scenario.created');
export async function listStrategicMarketNotes(organizationId) { assertOrganizationId(organizationId); return marketNotesStore.listByOrganization(organizationId); }
export const createStrategicMarketNote = (organizationId, payload, actor) => createWith(marketNotesStore, organizationId, payload, actor, 'strategy.market_note.created');
export async function listStrategicRisks(organizationId) { assertOrganizationId(organizationId); return risksStore.listByOrganization(organizationId); }
export const createStrategicRisk = (organizationId, payload, actor) => createWith(risksStore, organizationId, payload, actor, 'strategy.risk.created');
export async function listStrategyReports(organizationId) { assertOrganizationId(organizationId); return reportsStore.listByOrganization(organizationId); }
export const createStrategyReport = (organizationId, payload = {}, actor = {}) => createWith(reportsStore, organizationId, {
  reportType: payload.reportType || 'strategy_board_memo',
  title: payload.title || 'Strategy Board Memo',
  status: 'generated',
  payload: {
    reportTypes: ['Strategy Board Memo', 'Strategic Scenario Pack', 'Strategic Execution Report', 'Capital Allocation Memo'],
    humanReviewRequired: true,
    statusLabel: 'draft_metadata',
    documentPipeline: 'metadata_only',
    note: 'Strategy report metadata — not a generated export document.',
    ...(payload.payload || {})
  }
}, actor, 'strategy.report.exported');

export async function getStrategySummary(scope = {}) {
  assertOrganizationId(scope.organizationId);
  const data = await listAll(scope.organizationId);
  const metrics = calculateStrategyMetrics(data);
  return {
    metrics,
    strategyReadinessScore: metrics.strategyReadinessScore,
    blockedStrategicInitiatives: metrics.blockedStrategicInitiatives,
    capitalDependencyCount: metrics.capitalDependencyCount,
    strategicRiskLevel: metrics.strategicRiskLevel,
    requiresExecutiveAttention: metrics.requiresExecutiveAttention,
    strategyStatus: metrics.strategyStatus,
    dataSource: metrics.dataSource,
    executiveSignalEligible: metrics.executiveSignalEligible,
    humanReviewRequired: metrics.humanReviewRequired,
    scoringTruthfulness: metrics.scoringTruthfulness,
    counts: {
      objectives: data.objectives.length,
      initiatives: data.initiatives.length,
      scenarios: data.scenarios.length,
      marketNotes: data.marketNotes.length,
      risks: data.risks.length,
      reports: data.reports.length
    },
    latestObjective: data.objectives[0] || null,
    bridgeSignals: bridgeSignals(metrics),
    humanReviewPosture: 'human_review_required'
  };
}

export async function getStrategyDashboard(scope = {}) {
  assertOrganizationId(scope.organizationId);
  const data = await listAll(scope.organizationId);
  const metrics = calculateStrategyMetrics(data);
  return { ...data, metrics, bridgeSignals: bridgeSignals(metrics), humanReviewPosture: 'human_review_required' };
}

export async function listStrategyAuditLogs(organizationId, options = {}) {
  assertOrganizationId(organizationId);
  return listAuditLogs({ organizationId, entityType: 'strategy', limit: options.limit || 50 });
}

export default {
  calculateStrategyMetrics,
  getStrategySummary,
  getStrategyDashboard,
  listStrategicObjectives,
  createStrategicObjective,
  updateStrategicObjective,
  listStrategicInitiatives,
  createStrategicInitiative,
  updateStrategicInitiative,
  listStrategicScenarios,
  createStrategicScenario,
  listStrategicMarketNotes,
  createStrategicMarketNote,
  listStrategicRisks,
  createStrategicRisk,
  listStrategyReports,
  createStrategyReport,
  listStrategyAuditLogs
};
