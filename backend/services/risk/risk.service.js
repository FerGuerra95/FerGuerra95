import { createSqliteEntityStore } from '../../storage/sqliteEntityStore.service.js';
import { listAuditLogs, recordAuditLog } from '../audit/auditLog.service.js';

const riskRegisterStore = createSqliteEntityStore('risk_register', 'risk', {
  title: 'Enterprise risk',
  category: 'operational',
  description: '',
  inherentSeverity: 'medium',
  likelihood: 2,
  impact: 2,
  residualRisk: 'medium',
  owner: 'Risk Owner',
  status: 'open',
  mitigation: '',
  linkedModule: '',
  linkedEntityId: '',
  reviewDate: '',
  payload: {}
});

const controlsStore = createSqliteEntityStore('risk_controls', 'risk_control', {
  riskId: '',
  title: 'Risk control',
  controlType: 'preventive',
  owner: 'Control Owner',
  frequency: 'quarterly',
  status: 'active',
  evidence: [],
  lastTestedDate: '',
  effectiveness: 0,
  payload: {}
});

const mitigationsStore = createSqliteEntityStore('risk_mitigations', 'risk_mitigation', {
  riskId: '',
  action: 'Mitigation action',
  owner: 'Risk Owner',
  dueDate: '',
  status: 'open',
  progress: 0,
  blockers: '',
  payload: {}
});

const incidentsStore = createSqliteEntityStore('risk_incidents', 'risk_incident', {
  incidentDate: '',
  severity: 'medium',
  description: '',
  impactedArea: '',
  resolution: '',
  rootCause: '',
  status: 'open',
  linkedRiskId: '',
  payload: {}
});

const kriStore = createSqliteEntityStore('risk_kri_metrics', 'risk_kri', {
  metric: 'KRI metric',
  threshold: 0,
  actualValue: 0,
  breachFlag: 0,
  trend: 'stable',
  owner: 'Risk Owner',
  payload: {}
});

const appetiteStore = createSqliteEntityStore('risk_appetite_statements', 'risk_appetite', {
  appetiteStatement: 'Risk appetite statement',
  metric: '',
  threshold: 0,
  breachHandling: '',
  owner: 'Risk Committee',
  breachFlag: 0,
  payload: {}
});

const reportsStore = createSqliteEntityStore('risk_report_exports', 'risk_report', {
  reportType: 'enterprise_risk_brief',
  title: 'Enterprise Risk Brief',
  status: 'generated',
  payload: {}
});

const committeeReviewsStore = createSqliteEntityStore('risk_committee_reviews', 'risk_committee', {
  reviewTitle: 'Risk committee review',
  committeeName: 'Risk Committee',
  meetingDate: '',
  chair: '',
  attendees: [],
  agenda: [],
  linkedRisks: [],
  decisions: [],
  status: 'draft',
  minutesSummary: '',
  payload: {}
});

const evidenceLinksStore = createSqliteEntityStore('risk_evidence_links', 'risk_evidence', {
  riskId: '',
  linkedEntityType: 'risk',
  linkedEntityId: '',
  evidenceTitle: 'Risk evidence',
  evidenceType: 'document',
  evidenceQuality: 'medium',
  sourceModule: 'Risk',
  reviewer: '',
  reviewStatus: 'pending',
  humanReviewNote: '',
  payload: {}
});

const notificationsStore = createSqliteEntityStore('risk_notifications', 'risk_notification', {
  notificationType: 'risk_update_required',
  targetRole: 'executive',
  title: 'Risk update required',
  message: '',
  severity: 'watch',
  status: 'queued',
  linkedRiskId: '',
  payload: {}
});

function createError(message, status = 400, code = 'RISK_ERROR') {
  const error = new Error(message);
  error.status = status;
  error.code = code;
  return error;
}

function normalizeText(value, fallback = '') {
  return String(value ?? fallback).trim();
}

function normalizeNumber(value, fallback = 0) {
  if (value === '' || value === null || value === undefined) return fallback;
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function normalizeBool(value, fallback = false) {
  if (value === true || value === 'true' || value === 1 || value === '1') return true;
  if (value === false || value === 'false' || value === 0 || value === '0') return false;
  return fallback;
}

function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

function clampScore(value) {
  return Math.max(0, Math.min(100, Math.round(normalizeNumber(value))));
}

function assertOrganizationId(organizationId) {
  if (!normalizeText(organizationId)) {
    throw createError('Scope de organizacion no definido.', 403, 'INVALID_SCOPE');
  }
}

function actorId(actor = {}) {
  return normalizeText(actor.userId || actor.id);
}

function commonCreate(organizationId, actor = {}) {
  const userId = actorId(actor);
  return { organizationId, userId, createdBy: userId };
}

function todayMs() {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now.getTime();
}

function isPastDate(value) {
  const safe = normalizeText(value);
  if (!safe) return false;
  const date = new Date(safe);
  if (Number.isNaN(date.getTime())) return false;
  date.setHours(0, 0, 0, 0);
  return date.getTime() < todayMs();
}

function severityRank(value) {
  const severity = normalizeText(value).toLowerCase();
  if (severity === 'critical') return 5;
  if (severity === 'high') return 4;
  if (severity === 'medium') return 3;
  if (severity === 'low') return 2;
  return 1;
}

export function riskScoreFrom(item = {}, mode = 'residual') {
  const severity =
    mode === 'inherent'
      ? severityRank(item.inherentSeverity)
      : Math.max(severityRank(item.residualRisk), severityRank(item.inherentSeverity) - 1);
  const likelihood = Math.max(1, Math.min(5, normalizeNumber(item.likelihood, 2)));
  const impact = Math.max(1, Math.min(5, normalizeNumber(item.impact, 2)));
  return Math.round(((severity + likelihood + impact) / 15) * 100);
}

export function calculateRiskMetrics({
  risks = [],
  controls = [],
  mitigations = [],
  incidents = [],
  kri = [],
  appetite = []
  ,
  committeeReviews = [],
  evidenceLinks = []
} = {}) {
  const activeRisks = normalizeArray(risks).filter((item) => !['closed', 'archived'].includes(normalizeText(item.status).toLowerCase()));
  const criticalRiskCount = activeRisks.filter((item) => riskScoreFrom(item) >= 78 || severityRank(item.residualRisk) >= 5).length;
  const overdueMitigations = normalizeArray(mitigations).filter((item) => !['completed', 'closed'].includes(normalizeText(item.status).toLowerCase()) && isPastDate(item.dueDate)).length;
  const openIncidents = normalizeArray(incidents).filter((item) => !['resolved', 'closed'].includes(normalizeText(item.status).toLowerCase())).length;
  const kriBreaches = normalizeArray(kri).filter((item) => normalizeBool(item.breachFlag) || normalizeNumber(item.actualValue) > normalizeNumber(item.threshold)).length;
  const appetiteBreaches = normalizeArray(appetite).filter((item) => normalizeBool(item.breachFlag)).length;
  const effectiveControls = normalizeArray(controls).filter((item) => normalizeNumber(item.effectiveness) >= 70 && normalizeText(item.status).toLowerCase() === 'active').length;
  const avgResidual = activeRisks.length
    ? Math.round(activeRisks.reduce((sum, item) => sum + riskScoreFrom(item), 0) / activeRisks.length)
    : 30;
  const controlCoverage = activeRisks.length ? Math.round((normalizeArray(controls).filter((item) => item.riskId).length / activeRisks.length) * 100) : 100;
  const controlEffectiveness = controls.length ? Math.round((effectiveControls / controls.length) * 100) : 100;
  const finalizedCommitteeReviews = normalizeArray(committeeReviews).filter((item) => ['final', 'approved', 'closed'].includes(normalizeText(item.status).toLowerCase())).length;
  const committeeReadiness = clampScore(committeeReviews.length ? Math.round((finalizedCommitteeReviews / committeeReviews.length) * 100) : 70);
  const highQualityEvidence = normalizeArray(evidenceLinks).filter((item) => ['high', 'verified'].includes(normalizeText(item.evidenceQuality).toLowerCase()) && ['reviewed', 'approved'].includes(normalizeText(item.reviewStatus).toLowerCase())).length;
  const evidenceCoverage = activeRisks.length ? clampScore(Math.round((normalizeArray(evidenceLinks).filter((item) => item.riskId).length / activeRisks.length) * 100)) : 100;
  const evidenceQualityScore = evidenceLinks.length ? clampScore(Math.round((highQualityEvidence / evidenceLinks.length) * 100)) : 70;
  const penalty =
    criticalRiskCount * 12 +
    overdueMitigations * 8 +
    openIncidents * 5 +
    kriBreaches * 7 +
    appetiteBreaches * 10 +
    Math.max(0, avgResidual - 45) * 0.45;
  const riskReadinessScore = clampScore(
    100 -
      penalty +
      Math.min(10, controlCoverage * 0.04) +
      Math.min(10, controlEffectiveness * 0.04) +
      Math.min(8, committeeReadiness * 0.04) +
      Math.min(8, evidenceCoverage * 0.04)
  );
  const requiresExecutiveAttention =
    criticalRiskCount > 0 || overdueMitigations > 0 || kriBreaches > 0 || appetiteBreaches > 0;
  const riskPosture =
    criticalRiskCount > 0 || appetiteBreaches > 0
      ? 'critical'
      : overdueMitigations > 0 || kriBreaches > 0 || avgResidual >= 65
        ? 'watch'
        : 'controlled';
  return {
    riskReadinessScore,
    riskPosture,
    criticalRiskCount,
    risksByCategory: activeRisks.reduce((acc, item) => {
      const key = normalizeText(item.category, 'uncategorized');
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {}),
    residualRisk: avgResidual,
    overdueMitigations,
    openIncidents,
    kriBreaches,
    appetiteBreaches,
    controlCoverage: clampScore(controlCoverage),
    controlEffectiveness: clampScore(controlEffectiveness),
    committeeReadiness,
    evidenceCoverage,
    evidenceQualityScore,
    incidentSeverityTrend: openIncidents > 0 ? 'elevated' : 'stable',
    requiresExecutiveAttention,
    executiveAttention: requiresExecutiveAttention
  };
}

function buildHeatmap(risks = []) {
  return normalizeArray(risks).map((item) => ({
    id: item.id,
    title: item.title,
    category: item.category,
    owner: item.owner,
    status: item.status,
    inherentScore: riskScoreFrom(item, 'inherent'),
    residualScore: riskScoreFrom(item, 'residual'),
    likelihood: normalizeNumber(item.likelihood, 2),
    impact: normalizeNumber(item.impact, 2),
    residualRisk: item.residualRisk
  }));
}

function buildBridgeSignals(metrics = {}) {
  const signals = [];
  if (metrics.criticalRiskCount > 0) signals.push('risk.critical_risk_requires_ceo');
  if (metrics.overdueMitigations > 0) signals.push('risk.overdue_mitigation_affects_bridge');
  if (metrics.kriBreaches > 0) signals.push('risk.kri_breach_detected');
  if (metrics.appetiteBreaches > 0) signals.push('risk.appetite_breach_requires_committee');
  if (metrics.requiresExecutiveAttention) signals.push('bridge.risk_signal.created');
  if (metrics.committeeReadiness < 70) signals.push('risk.committee_readiness_gap');
  if (metrics.evidenceCoverage < 70) signals.push('risk.evidence_gap_affects_board_readiness');
  return signals;
}

async function recordRiskAudit({ organizationId, userId = '', action, entityId = '', metadata = {} }) {
  await recordAuditLog({
    organizationId,
    userId,
    action,
    entityType: 'risk',
    entityId,
    metadata
  });
}

async function listAll(organizationId) {
  assertOrganizationId(organizationId);
  const [risks, controls, mitigations, incidents, kri, appetite, reports, committeeReviews, evidenceLinks, notifications] = await Promise.all([
    riskRegisterStore.listByOrganization(organizationId),
    controlsStore.listByOrganization(organizationId),
    mitigationsStore.listByOrganization(organizationId),
    incidentsStore.listByOrganization(organizationId),
    kriStore.listByOrganization(organizationId),
    appetiteStore.listByOrganization(organizationId),
    reportsStore.listByOrganization(organizationId),
    committeeReviewsStore.listByOrganization(organizationId),
    evidenceLinksStore.listByOrganization(organizationId),
    notificationsStore.listByOrganization(organizationId)
  ]);
  return { risks, controls, mitigations, incidents, kri, appetite, reports, committeeReviews, evidenceLinks, notifications };
}

async function createWith(store, organizationId, payload = {}, actor = {}, action) {
  assertOrganizationId(organizationId);
  const item = await store.create({ ...commonCreate(organizationId, actor), ...payload });
  await recordRiskAudit({ organizationId, userId: actorId(actor), action, entityId: item.id, metadata: { title: item.title || item.action || item.metric } });
  return item;
}

async function updateWith(store, organizationId, id, payload = {}, actor = {}, action) {
  assertOrganizationId(organizationId);
  const item = await store.updateForOrganization(id, payload, organizationId);
  if (item) {
    await recordRiskAudit({ organizationId, userId: actorId(actor), action, entityId: item.id, metadata: { status: item.status } });
  }
  return item;
}

export async function listRisks(organizationId) {
  assertOrganizationId(organizationId);
  return riskRegisterStore.listByOrganization(organizationId);
}
export const createRisk = (organizationId, payload, actor) => createWith(riskRegisterStore, organizationId, payload, actor, 'risk.created');
export const updateRisk = (organizationId, id, payload, actor) => updateWith(riskRegisterStore, organizationId, id, payload, actor, payload?.status === 'escalated' ? 'risk.escalated' : 'risk.updated');

export async function listControls(organizationId) {
  assertOrganizationId(organizationId);
  return controlsStore.listByOrganization(organizationId);
}
export const createRiskControl = (organizationId, payload, actor) => createWith(controlsStore, organizationId, payload, actor, 'risk.control.created');
export const updateRiskControl = (organizationId, id, payload, actor) => updateWith(controlsStore, organizationId, id, payload, actor, payload?.lastTestedDate ? 'risk.control.tested' : 'risk.control.updated');

export async function listMitigations(organizationId) {
  assertOrganizationId(organizationId);
  return mitigationsStore.listByOrganization(organizationId);
}
export const createRiskMitigation = (organizationId, payload, actor) => createWith(mitigationsStore, organizationId, payload, actor, 'risk.mitigation.created');
export const updateRiskMitigation = (organizationId, id, payload, actor) => updateWith(mitigationsStore, organizationId, id, payload, actor, 'risk.mitigation.updated');

export async function listIncidents(organizationId) {
  assertOrganizationId(organizationId);
  return incidentsStore.listByOrganization(organizationId);
}
export const createRiskIncident = (organizationId, payload, actor) => createWith(incidentsStore, organizationId, payload, actor, 'risk.incident.created');
export const updateRiskIncident = (organizationId, id, payload, actor) => updateWith(incidentsStore, organizationId, id, payload, actor, 'risk.incident.updated');

export async function listKriMetrics(organizationId) {
  assertOrganizationId(organizationId);
  return kriStore.listByOrganization(organizationId);
}
export async function createKriMetric(organizationId, payload, actor) {
  const item = await createWith(kriStore, organizationId, { ...payload, breachFlag: normalizeBool(payload?.breachFlag) || normalizeNumber(payload?.actualValue) > normalizeNumber(payload?.threshold) ? 1 : 0 }, actor, 'risk.kri.created');
  if (normalizeBool(item.breachFlag)) {
    await recordRiskAudit({ organizationId, userId: actorId(actor), action: 'risk.kri.breached', entityId: item.id, metadata: { metric: item.metric } });
  }
  return item;
}
export const updateKriMetric = (organizationId, id, payload, actor) => updateWith(kriStore, organizationId, id, payload, actor, payload?.breachFlag ? 'risk.kri.breached' : 'risk.kri.updated');

export async function listRiskAppetite(organizationId) {
  assertOrganizationId(organizationId);
  return appetiteStore.listByOrganization(organizationId);
}
export async function createRiskAppetite(organizationId, payload, actor) {
  const item = await createWith(appetiteStore, organizationId, payload, actor, 'risk.appetite.created');
  if (normalizeBool(item.breachFlag)) {
    await recordRiskAudit({ organizationId, userId: actorId(actor), action: 'risk.appetite.breached', entityId: item.id, metadata: { metric: item.metric } });
  }
  return item;
}
export const updateRiskAppetite = (organizationId, id, payload, actor) => updateWith(appetiteStore, organizationId, id, payload, actor, payload?.breachFlag ? 'risk.appetite.breached' : 'risk.appetite.updated');

export async function listRiskReports(organizationId) {
  assertOrganizationId(organizationId);
  return reportsStore.listByOrganization(organizationId);
}

export async function listRiskCommitteeReviews(organizationId) {
  assertOrganizationId(organizationId);
  return committeeReviewsStore.listByOrganization(organizationId);
}
export const createRiskCommitteeReview = (organizationId, payload, actor) =>
  createWith(committeeReviewsStore, organizationId, payload, actor, 'risk.committee_review.created');
export const updateRiskCommitteeReview = (organizationId, id, payload, actor) =>
  updateWith(committeeReviewsStore, organizationId, id, payload, actor, payload?.status === 'final' ? 'risk.committee_review.finalized' : 'risk.committee_review.updated');

export async function listRiskEvidenceLinks(organizationId) {
  assertOrganizationId(organizationId);
  return evidenceLinksStore.listByOrganization(organizationId);
}
export const createRiskEvidenceLink = (organizationId, payload, actor) =>
  createWith(evidenceLinksStore, organizationId, payload, actor, 'risk.evidence.linked');
export const updateRiskEvidenceLink = (organizationId, id, payload, actor) =>
  updateWith(evidenceLinksStore, organizationId, id, payload, actor, payload?.reviewStatus === 'reviewed' ? 'risk.evidence.reviewed' : 'risk.evidence.updated');

export async function listRiskNotifications(organizationId) {
  assertOrganizationId(organizationId);
  return notificationsStore.listByOrganization(organizationId);
}
export const createRiskNotification = (organizationId, payload, actor) =>
  createWith(notificationsStore, organizationId, payload, actor, 'executive.risk_notification.queued');

export async function createRiskReport(organizationId, payload = {}, actor = {}) {
  const summary = await getRiskSummary({ organizationId });
  const item = await createWith(reportsStore, organizationId, {
    reportType: payload.reportType || 'enterprise_risk_brief',
    title: payload.title || 'Enterprise Risk Brief',
    status: 'generated',
    payload: {
      reportTypes: [
        'Enterprise Risk Brief',
        'Risk Committee Pack',
        'Control Effectiveness Report',
        'Incident Summary',
        'Risk Appetite Breach Report'
      ],
      summary,
      boardReadyMemo: {
        posture: summary.metrics.riskPosture,
        committeeReadiness: summary.metrics.committeeReadiness,
        evidenceCoverage: summary.metrics.evidenceCoverage,
        requiredHumanReview: true,
        disclaimer:
          'Decision-support output using operationalEnterpriseRiskScore heuristic. Not a certified risk rating. Golden L×I benchmark is separate and used for validation only. CRO, audit committee, legal and board review remain required.'
      },
      scoringTruthfulness: {
        operationalModel: 'operationalEnterpriseRiskScore',
        operationalLabel: 'Operational DSS risk signal',
        goldenBenchmarkModel: 'riskLikelihoodImpactGolden',
        goldenBenchmarkNote: 'Golden L×I benchmark is used for validation only — separate from operational scoring',
        humanReviewRequired: true,
        notCertifiedRiskRating: true
      },
      humanReviewRequired: true
    }
  }, actor, 'risk.report.exported');
  return item;
}

export async function getRiskSummary(scope = {}) {
  assertOrganizationId(scope.organizationId);
  const data = await listAll(scope.organizationId);
  const metrics = calculateRiskMetrics(data);
  return {
    metrics,
    riskReadinessScore: metrics.riskReadinessScore,
    criticalRiskCount: metrics.criticalRiskCount,
    overdueMitigations: metrics.overdueMitigations,
    appetiteBreaches: metrics.appetiteBreaches,
    incidentSeverityTrend: metrics.incidentSeverityTrend,
    requiresExecutiveAttention: metrics.requiresExecutiveAttention,
    counts: {
      risks: data.risks.length,
      controls: data.controls.length,
      mitigations: data.mitigations.length,
      incidents: data.incidents.length,
      kri: data.kri.length,
      appetite: data.appetite.length,
      reports: data.reports.length
      ,
      committeeReviews: data.committeeReviews.length,
      evidenceLinks: data.evidenceLinks.length,
      notifications: data.notifications.length
    },
    committeeReadiness: metrics.committeeReadiness,
    evidenceCoverage: metrics.evidenceCoverage,
    latestRisk: data.risks[0] || null,
    bridgeSignals: buildBridgeSignals(metrics),
    humanReviewPosture: 'human_review_required'
  };
}

export async function getRiskDashboard(scope = {}) {
  assertOrganizationId(scope.organizationId);
  const data = await listAll(scope.organizationId);
  const metrics = calculateRiskMetrics(data);
  return {
    metrics,
    risks: data.risks,
    controls: data.controls,
    mitigations: data.mitigations,
    incidents: data.incidents,
    kri: data.kri,
    appetite: data.appetite,
    reports: data.reports,
    committeeReviews: data.committeeReviews,
    evidenceLinks: data.evidenceLinks,
    notifications: data.notifications,
    heatmap: buildHeatmap(data.risks),
    bridgeSignals: buildBridgeSignals(metrics),
    humanReviewPosture: 'human_review_required'
  };
}

export async function getRiskBridgeSignals(scope = {}) {
  const summary = await getRiskSummary(scope);
  return {
    signals: summary.bridgeSignals,
    metrics: summary.metrics,
    requiresExecutiveAttention: summary.requiresExecutiveAttention
  };
}

export async function listRiskAuditLogs(organizationId, options = {}) {
  assertOrganizationId(organizationId);
  return listAuditLogs({
    organizationId,
    entityType: 'risk',
    limit: options.limit || 50
  });
}

export default {
  calculateRiskMetrics,
  riskScoreFrom,
  getRiskSummary,
  getRiskDashboard,
  getRiskBridgeSignals,
  listRisks,
  createRisk,
  updateRisk,
  listControls,
  createRiskControl,
  updateRiskControl,
  listMitigations,
  createRiskMitigation,
  updateRiskMitigation,
  listIncidents,
  createRiskIncident,
  updateRiskIncident,
  listKriMetrics,
  createKriMetric,
  updateKriMetric,
  listRiskAppetite,
  createRiskAppetite,
  updateRiskAppetite,
  listRiskReports,
  createRiskReport,
  listRiskCommitteeReviews,
  createRiskCommitteeReview,
  updateRiskCommitteeReview,
  listRiskEvidenceLinks,
  createRiskEvidenceLink,
  updateRiskEvidenceLink,
  listRiskNotifications,
  createRiskNotification,
  listRiskAuditLogs
};
