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
  const activeObjectives = normalizeArray(objectives).filter((item) => !['closed', 'archived'].includes(normalizeText(item.status).toLowerCase()));
  const blockedStrategicInitiatives = normalizeArray(initiatives).filter((item) => normalizeText(item.status).toLowerCase() === 'blocked' || normalizeArray(item.blockers).length > 0).length;
  const initiativeProgress = initiatives.length ? Math.round(initiatives.reduce((sum, item) => sum + normalizeNumber(item.progress), 0) / initiatives.length) : 0;
  const capitalDependencyCount = initiatives.filter((item) => normalizeNumber(item.capitalNeed) > 0 || normalizeNumber(item.budgetNeed) > 0 || item.linkedFundingRoundId).length;
  const boardDecisionsRequired = objectives.filter((item) => normalizeText(item.linkedBoardDecisionId)).length + initiatives.filter((item) => normalizeArray(item.dependencies).some((dep) => String(dep).toLowerCase().includes('board'))).length;
  const highRiskCount = risks.filter((item) => impactRank(item.impact) >= 3 && !['closed', 'mitigated'].includes(normalizeText(item.status).toLowerCase())).length;
  const scenarioConfidence = scenarios.length ? Math.round(scenarios.reduce((sum, item) => sum + normalizeNumber(item.confidence), 0) / scenarios.length) : 60;
  const objectiveCompletion = activeObjectives.length
    ? Math.round(activeObjectives.reduce((sum, item) => {
        const target = normalizeNumber(item.targetMetric);
        const current = normalizeNumber(item.currentMetric);
        return sum + (target > 0 ? clampScore((current / target) * 100) : 50);
      }, 0) / activeObjectives.length)
    : 60;
  const strategyReadinessScore = clampScore(objectiveCompletion * 0.3 + initiativeProgress * 0.25 + scenarioConfidence * 0.18 + Math.min(100, marketNotes.length * 10) * 0.08 + Math.max(0, 100 - blockedStrategicInitiatives * 18) * 0.1 + Math.max(0, 100 - highRiskCount * 15) * 0.09);
  const requiresExecutiveAttention = blockedStrategicInitiatives > 0 || capitalDependencyCount > 0 || highRiskCount > 0 || boardDecisionsRequired > 0;
  return {
    strategyReadinessScore,
    objectivesByStatus: objectives.reduce((acc, item) => {
      const key = normalizeText(item.status, 'active');
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {}),
    initiativesProgress: clampScore(initiativeProgress),
    blockedStrategicInitiatives,
    strategicRisks: risks.length,
    capitalDependencyCount,
    boardDecisionsRequired,
    strategicRiskLevel: highRiskCount > 0 ? 'high' : risks.length > 0 ? 'watch' : 'controlled',
    scenariosCount: scenarios.length,
    marketSignalsCount: marketNotes.length,
    requiresExecutiveAttention
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
  payload: { reportTypes: ['Strategy Board Memo', 'Strategic Scenario Pack', 'Strategic Execution Report', 'Capital Allocation Memo'], humanReviewRequired: true, ...(payload.payload || {}) }
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
