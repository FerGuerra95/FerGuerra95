import { createSqliteEntityStore } from '../../storage/sqliteEntityStore.service.js';
import { listAuditLogs, recordAuditLog } from '../audit/auditLog.service.js';
import { getMaDealById } from '../ma/deals.service.js';

const pmiCasesStore = createSqliteEntityStore('pmi_cases', 'pmi_case', {
  dealName: 'PMI case',
  buyerName: '',
  targetName: '',
  status: 'draft',
  integrationDay: 0,
  synergyTarget: 0,
  synergyCaptured: 0,
  integrationBudget: 0,
  integrationCostUsed: 0,
  currency: 'EUR',
  payload: {}
});

const pmiProgramsStore = createSqliteEntityStore('pmi_programs', 'pmi_program', {
  acquisitionName: '',
  title: 'PMI Program',
  strategicRationale: '',
  integrationThesis: '',
  integrationPhase: 'planning',
  owner: 'PMI Lead',
  sponsor: '',
  integrationManager: '',
  linkedMaDealId: '',
  startDate: '',
  targetCompletionDate: '',
  status: 'active',
  integrationScope: '',
  targetOperatingModel: '',
  valueCreationThesis: '',
  statusNotes: '',
  payload: {}
});

const pmiSynergiesStore = createSqliteEntityStore('pmi_synergy_initiatives', 'pmi_synergy', {
  programId: '',
  title: 'Synergy initiative',
  synergyType: 'cost',
  targetValue: 0,
  capturedValue: 0,
  annualizedValue: 0,
  oneTimeCost: 0,
  confidenceLevel: 50,
  owner: 'PMI Lead',
  status: 'identified',
  dueDate: '',
  evidence: [],
  dependencies: [],
  valueLeakageRisk: 'medium',
  realizationDate: '',
  financeValidationStatus: 'pending',
  payload: {}
});

const pmiMilestonesStore = createSqliteEntityStore('pmi_milestones', 'pmi_milestone', {
  programId: '',
  title: 'Integration milestone',
  category: 'operations',
  owner: 'PMI Lead',
  dueDate: '',
  status: 'pending',
  progress: 0,
  dependencies: [],
  blockers: [],
  linkedSynergyId: '',
  evidence: [],
  escalation: 'none',
  criticalPathFlag: 0,
  payload: {}
});

const pmiRisksStore = createSqliteEntityStore('pmi_risks', 'pmi_risk', {
  programId: '',
  title: 'Integration risk',
  riskArea: 'operations',
  severity: 'medium',
  likelihood: 2,
  impact: 2,
  mitigation: '',
  owner: 'PMI Lead',
  status: 'open',
  linkedComplianceAlertId: '',
  linkedMilestoneId: '',
  residualRisk: 'medium',
  escalationStatus: 'none',
  payload: {}
});

const pmiDayOneStore = createSqliteEntityStore('pmi_day1_checklist', 'pmi_day1', {
  programId: '',
  title: 'Day 1 readiness item',
  checklistArea: 'governance',
  owner: 'PMI Lead',
  status: 'pending',
  readinessScore: 0,
  evidence: [],
  blockerNotes: '',
  payload: {}
});

const pmiHundredDayStore = createSqliteEntityStore('pmi_100_day_plan', 'pmi_day100', {
  programId: '',
  title: '100-day plan item',
  period: 'day_30',
  priorities: [],
  completedActions: [],
  delayedActions: [],
  criticalBlockers: [],
  valueCaptureProgress: 0,
  committeeDecisionsRequired: [],
  status: 'in_progress',
  owner: 'PMI Lead',
  payload: {}
});

const pmiTransitionServicesStore = createSqliteEntityStore('pmi_transition_services', 'pmi_tsa', {
  programId: '',
  title: 'TSA item',
  provider: '',
  receiver: '',
  serviceArea: '',
  startDate: '',
  endDate: '',
  cost: 0,
  risk: 'medium',
  owner: 'PMI Lead',
  exitPlan: '',
  status: 'active',
  payload: {}
});

const pmiOperatingModelStore = createSqliteEntityStore('pmi_operating_model_items', 'pmi_ops_model', {
  programId: '',
  title: 'Operating model item',
  targetOperatingModelNotes: '',
  orgStructureDependencies: [],
  systemsIntegrationDependencies: [],
  processHarmonization: '',
  reportingLines: '',
  decisionRights: '',
  governanceCadence: '',
  owner: 'PMI Lead',
  status: 'draft',
  payload: {}
});

const pmiPeopleCultureStore = createSqliteEntityStore('pmi_people_culture_items', 'pmi_people', {
  programId: '',
  title: 'People and culture item',
  keyPeopleRisk: 'medium',
  retentionPlan: '',
  culturalIntegrationNotes: '',
  communicationPlan: '',
  laborDependencyNote: '',
  leadershipAlignment: '',
  owner: 'PMI Lead',
  status: 'active',
  payload: {}
});

const pmiTechnologyStore = createSqliteEntityStore('pmi_technology_items', 'pmi_tech', {
  programId: '',
  title: 'Technology integration item',
  systemsInventory: [],
  integrationApproach: '',
  cyberSecurityDependencies: [],
  dataMigrationRisk: 'medium',
  tsaTechnologyDependency: '',
  owner: 'Technology Lead',
  status: 'active',
  payload: {}
});

const pmiReportsStore = createSqliteEntityStore('pmi_report_exports', 'pmi_report', {
  reportType: 'pmi_executive_integration_memo',
  title: 'PMI Report',
  status: 'generated',
  payload: {}
});

function createError(message, status = 400, code = 'PMI_ERROR') {
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

function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeBool(value, fallback = false) {
  if (value === true || value === 'true' || value === 1 || value === '1') return true;
  if (value === false || value === 'false' || value === 0 || value === '0') return false;
  return fallback;
}

function clampScore(value) {
  return Math.max(0, Math.min(100, Math.round(normalizeNumber(value))));
}

function assertOrganizationId(organizationId) {
  if (!normalizeText(organizationId)) {
    throw createError('Scope de organizacion no definido.', 403, 'INVALID_SCOPE');
  }
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

function isWithinDays(value, days = 30) {
  const safe = normalizeText(value);
  if (!safe) return false;
  const date = new Date(safe);
  if (Number.isNaN(date.getTime())) return false;
  const diff = date.getTime() - todayMs();
  return diff >= 0 && diff <= days * 24 * 60 * 60 * 1000;
}

function actorId(actor = {}) {
  return normalizeText(actor.userId || actor.id);
}

function commonCreate(organizationId, actor = {}) {
  const userId = actorId(actor);
  return {
    organizationId,
    userId,
    createdBy: userId
  };
}

function sanitizePayload(payload = {}, { requireDealName = false } = {}) {
  const source = payload && typeof payload === 'object' ? payload : {};
  const next = {};

  if (requireDealName || source.dealName !== undefined) {
    next.dealName = normalizeText(source.dealName, 'PMI case') || 'PMI case';
  }
  if (source.buyerName !== undefined) next.buyerName = normalizeText(source.buyerName);
  if (source.targetName !== undefined) next.targetName = normalizeText(source.targetName);
  if (source.status !== undefined) next.status = normalizeText(source.status, 'draft') || 'draft';
  if (source.currency !== undefined) next.currency = normalizeText(source.currency, 'EUR') || 'EUR';
  if (source.integrationDay !== undefined) next.integrationDay = normalizeNumber(source.integrationDay);
  if (source.synergyTarget !== undefined) next.synergyTarget = normalizeNumber(source.synergyTarget);
  if (source.synergyCaptured !== undefined) next.synergyCaptured = normalizeNumber(source.synergyCaptured);
  if (source.integrationBudget !== undefined) next.integrationBudget = normalizeNumber(source.integrationBudget);
  if (source.integrationCostUsed !== undefined) {
    next.integrationCostUsed = normalizeNumber(source.integrationCostUsed);
  }

  const payloadPatch = {
    ...(source.payload && typeof source.payload === 'object' ? source.payload : {}),
    ...(source.closingDate !== undefined ? { closingDate: normalizeText(source.closingDate) } : {}),
    ...(source.sourceDealId !== undefined ? { sourceDealId: normalizeText(source.sourceDealId) } : {}),
    ...(Array.isArray(source.workstreams) ? { workstreams: source.workstreams } : {}),
    ...(Array.isArray(source.risks) ? { risks: source.risks } : {}),
    ...(Array.isArray(source.milestones) ? { milestones: source.milestones } : {}),
    ...(Array.isArray(source.boardActions) ? { boardActions: source.boardActions } : {}),
    ...(Array.isArray(source.synergyLedger) ? { synergyLedger: source.synergyLedger } : {}),
    ...(Array.isArray(source.playbooks) ? { playbooks: source.playbooks } : {}),
    ...(Array.isArray(source.dependencies) ? { dependencies: source.dependencies } : {})
  };

  if (Object.keys(payloadPatch).length > 0) {
    next.payload = payloadPatch;
  }

  return next;
}

function expandCase(item) {
  if (!item) return null;

  const payload = item.payload && typeof item.payload === 'object' ? item.payload : {};

  return {
    ...payload,
    ...item,
    workstreams: Array.isArray(payload.workstreams) ? payload.workstreams : [],
    risks: Array.isArray(payload.risks) ? payload.risks : [],
    milestones: Array.isArray(payload.milestones) ? payload.milestones : [],
    boardActions: Array.isArray(payload.boardActions) ? payload.boardActions : [],
    synergyLedger: Array.isArray(payload.synergyLedger) ? payload.synergyLedger : [],
    playbooks: Array.isArray(payload.playbooks) ? payload.playbooks : [],
    dependencies: Array.isArray(payload.dependencies) ? payload.dependencies : []
  };
}

function getAverageProgress(items = []) {
  if (!Array.isArray(items) || items.length === 0) return 0;

  const total = items.reduce((sum, item) => sum + normalizeNumber(item?.progress), 0);

  return Math.max(0, Math.min(100, Math.round(total / items.length)));
}

function getHighRiskCount(risks = []) {
  if (!Array.isArray(risks)) return 0;

  return risks.filter((risk) => {
    const severity = normalizeText(risk?.severity).toLowerCase();
    return severity.includes('high') || severity.includes('critical');
  }).length;
}

function getOpenRiskCount(risks = []) {
  if (!Array.isArray(risks)) return 0;

  return risks.filter((risk) => {
    const status = normalizeText(risk?.status, 'open').toLowerCase();
    return status !== 'closed' && status !== 'mitigated';
  }).length;
}

function getBlockedWorkstreams(workstreams = []) {
  if (!Array.isArray(workstreams)) return [];

  return workstreams.filter((item) => {
    const risk = normalizeText(item?.risk).toLowerCase();
    const progress = normalizeNumber(item?.progress);
    return risk.includes('high') || progress < 45;
  });
}

function getLedgerTotals(synergyLedger = []) {
  const items = Array.isArray(synergyLedger) ? synergyLedger : [];
  const forecast = items.reduce((sum, item) => sum + normalizeNumber(item?.forecast), 0);
  const captured = items.reduce((sum, item) => sum + normalizeNumber(item?.captured), 0);
  const confidence = items.reduce((sum, item) => sum + normalizeNumber(item?.confidence), 0);

  return {
    ledgerForecast: forecast,
    ledgerCaptured: captured,
    ledgerCaptureRate:
      forecast > 0 ? Math.max(0, Math.min(100, Math.round((captured / forecast) * 100))) : 0,
    ledgerConfidenceScore:
      items.length > 0 ? Math.max(0, Math.min(100, Math.round(confidence / items.length))) : 0
  };
}

function getPlaybookProgress(playbooks = []) {
  const checks = (Array.isArray(playbooks) ? playbooks : []).flatMap((item) =>
    Array.isArray(item?.checklist) ? item.checklist : []
  );
  if (checks.length > 0) {
    const done = checks.filter((item) => Boolean(item?.done)).length;
    return Math.max(0, Math.min(100, Math.round((done / checks.length) * 100)));
  }

  return getAverageProgress(playbooks);
}

function getBlockedDependencies(dependencies = []) {
  if (!Array.isArray(dependencies)) return [];

  return dependencies.filter((item) => {
    const status = normalizeText(item?.status).toLowerCase();
    const severity = normalizeText(item?.severity).toLowerCase();
    return status.includes('block') || severity.includes('high') || severity.includes('critical');
  });
}

function indexById(items = []) {
  return new Map(
    (Array.isArray(items) ? items : [])
      .filter((item) => item?.id)
      .map((item) => [String(item.id), item])
  );
}

function getPmiChangeEvents(existing = {}, updated = {}) {
  const events = [];
  const previousWorkstreams = indexById(existing.workstreams);
  const previousRisks = indexById(existing.risks);
  const previousMilestones = indexById(existing.milestones);
  const previousSynergies = indexById(existing.synergyLedger);
  const previousDependencies = indexById(existing.dependencies);

  for (const item of updated.workstreams || []) {
    const previous = previousWorkstreams.get(String(item.id));
    if (!previous) events.push({ action: 'pmi.workstream.created', id: item.id, name: item.name });
    if (previous && normalizeNumber(previous.progress) !== normalizeNumber(item.progress)) {
      events.push({ action: 'pmi.workstream.progress_changed', id: item.id, name: item.name });
    }
    if (previous && normalizeText(previous.risk) !== normalizeText(item.risk)) {
      events.push({ action: 'pmi.workstream.risk_changed', id: item.id, name: item.name });
    }
  }

  for (const item of existing.workstreams || []) {
    if (item?.id && !indexById(updated.workstreams).has(String(item.id))) {
      events.push({ action: 'pmi.workstream.removed', id: item.id, name: item.name });
    }
  }

  for (const item of updated.risks || []) {
    const previous = previousRisks.get(String(item.id));
    if (!previous) events.push({ action: 'pmi.risk.created', id: item.id, title: item.title });
    if (previous && normalizeText(previous.severity) !== normalizeText(item.severity)) {
      events.push({ action: 'pmi.risk.severity_changed', id: item.id, title: item.title });
    }
    if (previous && normalizeText(previous.status) !== normalizeText(item.status)) {
      events.push({ action: 'pmi.risk.status_changed', id: item.id, title: item.title });
    }
  }

  for (const item of existing.risks || []) {
    if (item?.id && !indexById(updated.risks).has(String(item.id))) {
      events.push({ action: 'pmi.risk.removed', id: item.id, title: item.title });
    }
  }

  for (const item of updated.milestones || []) {
    const previous = previousMilestones.get(String(item.id));
    if (!previous) events.push({ action: 'pmi.milestone.created', id: item.id, title: item.title });
    if (previous && normalizeText(previous.status) !== normalizeText(item.status)) {
      events.push({ action: 'pmi.milestone.status_changed', id: item.id, title: item.title });
    }
  }

  for (const action of updated.boardActions || []) {
    if (!(existing.boardActions || []).includes(action)) {
      events.push({ action: 'pmi.board_action.created', label: action });
    }
  }

  for (const action of existing.boardActions || []) {
    if (!(updated.boardActions || []).includes(action)) {
      events.push({ action: 'pmi.board_action.closed', label: action });
    }
  }

  for (const item of updated.synergyLedger || []) {
    const previous = previousSynergies.get(String(item.id));
    if (!previous) events.push({ action: 'pmi.synergy.created', id: item.id, name: item.name });
    if (previous && normalizeNumber(previous.captured) !== normalizeNumber(item.captured)) {
      events.push({ action: 'pmi.synergy.capture_changed', id: item.id, name: item.name });
    }
    if (previous && normalizeNumber(previous.forecast) !== normalizeNumber(item.forecast)) {
      events.push({ action: 'pmi.synergy.forecast_changed', id: item.id, name: item.name });
    }
  }

  for (const item of existing.synergyLedger || []) {
    if (item?.id && !indexById(updated.synergyLedger).has(String(item.id))) {
      events.push({ action: 'pmi.synergy.removed', id: item.id, name: item.name });
    }
  }

  for (const item of updated.dependencies || []) {
    const previous = previousDependencies.get(String(item.id));
    if (!previous) events.push({ action: 'pmi.dependency.created', id: item.id, title: item.title });
    if (previous && normalizeText(previous.status) !== normalizeText(item.status)) {
      events.push({ action: 'pmi.dependency.status_changed', id: item.id, title: item.title });
    }
  }

  for (const item of existing.dependencies || []) {
    if (item?.id && !indexById(updated.dependencies).has(String(item.id))) {
      events.push({ action: 'pmi.dependency.removed', id: item.id, title: item.title });
    }
  }

  return events.slice(0, 12);
}

export function resolvePmiExecutiveHubTruthfulness({
  cases = [],
  latestCase = null,
  signal = {},
  enterpriseMetrics = {}
} = {}) {
  const hasPersistedData = cases.length > 0 && Boolean(latestCase?.id);

  if (!hasPersistedData) {
    return {
      dataSource: 'empty',
      truthfulnessStatus: 'insufficient_data',
      hasPersistedData: false,
      isDemo: false,
      isFallback: true,
      isTemplate: false,
      humanReviewRequired: true,
      demoDataIncluded: false,
      executiveSignalEligible: false
    };
  }

  return {
    dataSource: 'persisted',
    truthfulnessStatus: 'persisted',
    hasPersistedData: true,
    isDemo: false,
    isFallback: false,
    isTemplate: false,
    humanReviewRequired: Boolean(
      enterpriseMetrics.requiresExecutiveAttention ?? signal.humanReviewRequired
    ),
    demoDataIncluded: false,
    executiveSignalEligible: true
  };
}

export function buildPmiSignal(pmiCase) {
  if (!pmiCase) {
    return {
      score: null,
      posture: 'Insufficient persisted PMI data',
      title: 'PMI data pending',
      description:
        'No persisted PMI integration case is available for this organization. Create or sync a case before using PMI as an executive signal.',
      dataSource: 'empty',
      isFallback: true,
      humanReviewRequired: true,
      truthfulnessStatus: 'insufficient_data',
      demoDataIncluded: false,
      executiveSignalEligible: false
    };
  }

  const synergyTarget = normalizeNumber(pmiCase.synergyTarget);
  const synergyCaptured = normalizeNumber(pmiCase.synergyCaptured);
  const synergyCaptureRate =
    synergyTarget > 0
      ? Math.max(0, Math.min(100, Math.round((synergyCaptured / synergyTarget) * 100)))
      : 0;
  const workstreamProgress = getAverageProgress(pmiCase.workstreams);
  const milestoneProgress = getAverageProgress(pmiCase.milestones);
  const highRiskCount = getHighRiskCount(pmiCase.risks);
  const ledger = getLedgerTotals(pmiCase.synergyLedger);
  const playbookProgress = getPlaybookProgress(pmiCase.playbooks);
  const dependencyRiskScore = Math.max(0, 100 - getBlockedDependencies(pmiCase.dependencies).length * 22);
  const score = Math.max(
    0,
    Math.min(
      100,
      Math.round(
        workstreamProgress * 0.24 +
          milestoneProgress * 0.18 +
          synergyCaptureRate * 0.18 +
          ledger.ledgerCaptureRate * 0.12 +
          playbookProgress * 0.12 +
          dependencyRiskScore * 0.08 +
          Math.max(0, 100 - highRiskCount * 18) * 0.08
      )
    )
  );

  if (score >= 82) {
    return {
      score,
      posture: 'Accelerate synergy capture',
      title: 'Integration on track',
      description:
        'PMI shows strong execution, controlled risks and advanced synergy capture.'
    };
  }

  if (score < 58 || highRiskCount > 0) {
    return {
      score,
      posture: 'Prioritize risk mitigation',
      title: 'Integration risk requires attention',
      description:
        'PMI has relevant risks or execution gaps. Owners, mitigants and board actions should be reviewed.'
    };
  }

  return {
    score,
    posture: 'Manage execution',
    title: 'Integration plan in progress',
    description:
      'PMI has workstreams, milestones, risks and synergies ready for executive tracking.'
  };
}

async function recordPmiAudit({ organizationId, userId, action, entityId = '', metadata = {} }) {
  if (!normalizeText(userId)) return;

  try {
    await recordAuditLog({
      organizationId,
      userId,
      action,
      entityType: 'pmi_case',
      entityId,
      metadata
    });
  } catch {
    // Audit never blocks PMI operations.
  }
}

export async function listPmiCases(organizationId) {
  assertOrganizationId(organizationId);
  const items = await pmiCasesStore.listByOrganization(organizationId);
  return items.map(expandCase);
}

export async function getPmiCaseById(organizationId, id) {
  assertOrganizationId(organizationId);
  return expandCase(await pmiCasesStore.getByIdForOrganization(normalizeText(id), organizationId));
}

export async function createPmiCase(organizationId, payload = {}, actor = {}) {
  assertOrganizationId(organizationId);

  const created = expandCase(
    await pmiCasesStore.create({
      ...sanitizePayload(payload, { requireDealName: true }),
      organizationId,
      userId: normalizeText(actor.userId) || null
    })
  );

  await recordPmiAudit({
    organizationId,
    userId: actor.userId,
    action: 'pmi.case.created',
    entityId: created?.id || '',
    metadata: {
      dealName: created?.dealName || null,
      status: created?.status || null
    }
  });

  return created;
}

export async function createPmiCaseFromMaDeal(organizationId, dealId, actor = {}) {
  assertOrganizationId(organizationId);

  const deal = await getMaDealById(dealId, { organizationId });
  if (!deal) {
    throw createError('Deal M&A no encontrado para crear PMI.', 404, 'MA_DEAL_NOT_FOUND');
  }

  const payload = deal.payload && typeof deal.payload === 'object' ? deal.payload : {};
  const owner = normalizeText(deal.ownerName, 'M&A Owner') || 'M&A Owner';
  const dealName = normalizeText(deal.name, 'M&A deal');
  const equityValue = normalizeNumber(payload.equityValue);
  const synergyTarget = normalizeNumber(payload.synergyTarget || payload.expectedSynergies, Math.round(equityValue * 0.04));
  const currency = normalizeText(payload.currency, 'EUR') || 'EUR';
  const closingDate = normalizeText(deal.expectedCloseAt || payload.expectedCloseAt);

  const created = await createPmiCase(
    organizationId,
    {
      dealName: `${dealName} Integration`,
      buyerName: normalizeText(payload.buyerName || payload.buyer, 'Buyer / Sponsor'),
      targetName: dealName,
      closingDate,
      integrationDay: 0,
      synergyTarget,
      synergyCaptured: 0,
      integrationBudget: Math.max(0, Math.round(synergyTarget * 0.28)),
      integrationCostUsed: 0,
      currency,
      status: 'Active integration',
      sourceDealId: deal.id,
      workstreams: [
        {
          id: `ops-${deal.id}`,
          name: 'Operations integration',
          owner,
          progress: 0,
          risk: deal.riskLevel === 'high' ? 'High' : 'Medium',
          priority: deal.priority === 'high' ? 'High' : 'Medium',
          summary: 'Stabilize operating model, service continuity and critical dependencies.'
        },
        {
          id: `finance-${deal.id}`,
          name: 'Finance & reporting',
          owner: 'CFO Office',
          progress: 0,
          risk: 'Medium',
          priority: 'High',
          summary: 'Align reporting, cash discipline, synergy tracking and integration budget.'
        },
        {
          id: `people-${deal.id}`,
          name: 'People & culture',
          owner: 'HR Lead',
          progress: 0,
          risk: 'Medium',
          priority: 'Medium',
          summary: 'Secure key people, communication cadence and organizational decisions.'
        }
      ],
      risks: [
        {
          id: `deal-risk-${deal.id}`,
          title: 'Deal thesis execution risk',
          severity: deal.riskLevel === 'high' ? 'High' : 'Medium',
          status: 'open',
          owner,
          mitigation: normalizeText(deal.nextStep, 'Convert M&A thesis into owned PMI workstreams.')
        }
      ],
      milestones: [
        {
          id: `day1-${deal.id}`,
          label: 'Day 1',
          title: 'Control & communication',
          status: 'Pending',
          progress: 0,
          summary: 'Confirm governance, critical access, operating continuity and internal communications.'
        },
        {
          id: `day30-${deal.id}`,
          label: 'Day 30',
          title: 'Stabilize integration',
          status: 'Pending',
          progress: 0,
          summary: 'Validate workstream owners, risk register and first synergy baseline.'
        },
        {
          id: `day90-${deal.id}`,
          label: 'Day 90',
          title: 'Board integration review',
          status: 'Pending',
          progress: 0,
          summary: 'Review synergy capture, open risks, budget discipline and next-phase priorities.'
        }
      ],
      synergyLedger: [
        {
          id: `cost-synergy-${deal.id}`,
          name: 'Cost synergy baseline',
          type: 'Cost',
          owner: 'CFO Office',
          workstreamId: `finance-${deal.id}`,
          baseline: 0,
          forecast: Math.round(synergyTarget * 0.5),
          captured: 0,
          confidence: 55,
          status: 'Baseline',
          dueDate: closingDate
        },
        {
          id: `operating-synergy-${deal.id}`,
          name: 'Operating model efficiency',
          type: 'Cost',
          owner,
          workstreamId: `ops-${deal.id}`,
          baseline: 0,
          forecast: Math.round(synergyTarget * 0.3),
          captured: 0,
          confidence: 50,
          status: 'Baseline',
          dueDate: closingDate
        },
        {
          id: `revenue-synergy-${deal.id}`,
          name: 'Revenue synergy pipeline',
          type: 'Revenue',
          owner: 'Revenue Lead',
          workstreamId: `ops-${deal.id}`,
          baseline: 0,
          forecast: Math.round(synergyTarget * 0.2),
          captured: 0,
          confidence: 42,
          status: 'Thesis linked',
          dueDate: closingDate
        }
      ],
      playbooks: [
        {
          id: `day1-playbook-${deal.id}`,
          label: 'Day 1',
          title: 'Control and continuity',
          owner,
          status: 'Pending',
          checklist: [
            { id: `day1-comms-${deal.id}`, label: 'Stakeholder communications released', done: false },
            { id: `day1-access-${deal.id}`, label: 'Critical system access validated', done: false },
            { id: `day1-cash-${deal.id}`, label: 'Cash controls confirmed', done: false }
          ]
        },
        {
          id: `day30-playbook-${deal.id}`,
          label: 'Day 30',
          title: 'Stabilize the operating model',
          owner: 'PMI Office',
          status: 'Pending',
          checklist: [
            { id: `day30-owners-${deal.id}`, label: 'Workstream owners and cadence locked', done: false },
            { id: `day30-risks-${deal.id}`, label: 'Risk register reviewed by committee', done: false },
            { id: `day30-synergies-${deal.id}`, label: 'Synergy baseline approved by CFO', done: false }
          ]
        },
        {
          id: `day90-playbook-${deal.id}`,
          label: 'Day 90',
          title: 'Board integration review',
          owner: 'CEO Office',
          status: 'Pending',
          checklist: [
            { id: `day90-memo-${deal.id}`, label: 'Board Integration Memo drafted', done: false },
            { id: `day90-value-${deal.id}`, label: 'Captured value reconciled with thesis', done: false },
            { id: `day90-next-${deal.id}`, label: 'Next-phase priorities funded', done: false }
          ]
        }
      ],
      dependencies: [
        {
          id: `dependency-finance-ops-${deal.id}`,
          fromWorkstreamId: `ops-${deal.id}`,
          toWorkstreamId: `finance-${deal.id}`,
          title: 'Operating KPI handoff required for finance reporting',
          status: 'Monitoring',
          severity: deal.riskLevel === 'high' ? 'High' : 'Medium',
          owner,
          mitigation: 'Lock KPI owners and reporting evidence before first board review.'
        }
      ],
      boardActions: [
        'Confirm PMI owner and committee cadence.',
        'Validate Day 1 operating continuity plan.',
        'Translate M&A thesis into synergy baseline and workstream KPIs.'
      ],
      payload: {
        source: 'ma_deal',
        maDealId: deal.id,
        maCaseId: deal.caseId || null,
        maStage: deal.stage,
        maPriority: deal.priority,
        maIcMemoStatus: deal.icMemoStatus,
        thesis: normalizeText(payload.thesis || deal.nextStep),
        thesisDrivers: Array.isArray(payload.thesisDrivers) ? payload.thesisDrivers : []
      }
    },
    actor
  );

  await recordPmiAudit({
    organizationId,
    userId: actor.userId,
    action: 'pmi.case.created_from_ma_deal',
    entityId: created?.id || '',
    metadata: {
      maDealId: deal.id,
      maDealName: deal.name
    }
  });

  return created;
}

export async function duplicatePmiCase(organizationId, id, actor = {}) {
  assertOrganizationId(organizationId);

  const existing = await getPmiCaseById(organizationId, id);
  if (!existing) return null;

  const created = await createPmiCase(
    organizationId,
    {
      ...existing,
      dealName: `${existing.dealName || 'PMI case'} Copy`,
      status: 'Draft review',
      payload: {
        ...(existing.payload && typeof existing.payload === 'object' ? existing.payload : {}),
        duplicatedFrom: existing.id,
        duplicatedAt: new Date().toISOString()
      }
    },
    actor
  );

  await recordPmiAudit({
    organizationId,
    userId: actor.userId,
    action: 'pmi.case.duplicated',
    entityId: created?.id || '',
    metadata: {
      sourceCaseId: existing.id
    }
  });

  return created;
}

export async function updatePmiCase(organizationId, id, payload = {}, actor = {}) {
  assertOrganizationId(organizationId);

  const existing = await getPmiCaseById(organizationId, id);
  if (!existing) return null;

  const sanitizedPatch = sanitizePayload(payload);
  const nextPatch = {
    ...sanitizedPatch,
    ...(sanitizedPatch.payload
      ? {
          payload: {
            ...(existing.payload && typeof existing.payload === 'object'
              ? existing.payload
              : {}),
            ...sanitizedPatch.payload
          }
        }
      : {})
  };

  const updated = expandCase(
    await pmiCasesStore.updateForOrganization(
      normalizeText(id),
      nextPatch,
      organizationId
    )
  );

  if (!updated) return null;

  await recordPmiAudit({
    organizationId,
    userId: actor.userId,
    action: 'pmi.case.updated',
    entityId: updated.id,
    metadata: {
      status: updated.status
    }
  });

  for (const event of getPmiChangeEvents(existing, updated)) {
    await recordPmiAudit({
      organizationId,
      userId: actor.userId,
      action: event.action,
      entityId: updated.id,
      metadata: event
    });
  }

  return updated;
}

export async function deletePmiCase(organizationId, id, actor = {}) {
  assertOrganizationId(organizationId);

  const result = await pmiCasesStore.removeForOrganization(normalizeText(id), organizationId);

  if (result.deleted) {
    await recordPmiAudit({
      organizationId,
      userId: actor.userId,
      action: 'pmi.case.deleted',
      entityId: normalizeText(id)
    });
  }

  return result;
}

export async function listPmiAuditLogs(organizationId, options = {}) {
  assertOrganizationId(organizationId);

  return listAuditLogs({
    organizationId,
    entityType: 'pmi_case',
    entityId: normalizeText(options.caseId),
    limit: normalizeNumber(options.limit, 80)
  });
}

function sanitizeProgram(payload = {}, { requireTitle = false } = {}) {
  const source = payload && typeof payload === 'object' ? payload : {};
  const next = {};
  if (requireTitle || source.title !== undefined) next.title = normalizeText(source.title, 'PMI Program') || 'PMI Program';
  [
    'acquisitionName',
    'strategicRationale',
    'integrationThesis',
    'integrationPhase',
    'owner',
    'sponsor',
    'integrationManager',
    'linkedMaDealId',
    'startDate',
    'targetCompletionDate',
    'status',
    'integrationScope',
    'targetOperatingModel',
    'valueCreationThesis',
    'statusNotes'
  ].forEach((key) => {
    if (source[key] !== undefined) next[key] = normalizeText(source[key]);
  });
  if (source.payload && typeof source.payload === 'object') next.payload = source.payload;
  return next;
}

function sanitizeSynergy(payload = {}, { requireTitle = false } = {}) {
  const source = payload && typeof payload === 'object' ? payload : {};
  const next = {};
  if (requireTitle || source.title !== undefined || source.name !== undefined) next.title = normalizeText(source.title || source.name, 'Synergy initiative') || 'Synergy initiative';
  ['programId', 'synergyType', 'owner', 'status', 'dueDate', 'valueLeakageRisk', 'realizationDate', 'financeValidationStatus'].forEach((key) => {
    if (source[key] !== undefined) next[key] = normalizeText(source[key]);
  });
  ['targetValue', 'capturedValue', 'annualizedValue', 'oneTimeCost', 'confidenceLevel'].forEach((key) => {
    if (source[key] !== undefined) next[key] = normalizeNumber(source[key]);
  });
  if (source.evidence !== undefined) next.evidence = normalizeArray(source.evidence);
  if (source.dependencies !== undefined) next.dependencies = normalizeArray(source.dependencies);
  if (source.payload && typeof source.payload === 'object') next.payload = source.payload;
  return next;
}

function sanitizeMilestone(payload = {}, { requireTitle = false } = {}) {
  const source = payload && typeof payload === 'object' ? payload : {};
  const next = {};
  if (requireTitle || source.title !== undefined) next.title = normalizeText(source.title, 'Integration milestone') || 'Integration milestone';
  ['programId', 'category', 'owner', 'dueDate', 'status', 'linkedSynergyId', 'escalation'].forEach((key) => {
    if (source[key] !== undefined) next[key] = normalizeText(source[key]);
  });
  if (source.progress !== undefined) next.progress = clampScore(source.progress);
  if (source.criticalPathFlag !== undefined) next.criticalPathFlag = normalizeBool(source.criticalPathFlag) ? 1 : 0;
  if (source.dependencies !== undefined) next.dependencies = normalizeArray(source.dependencies);
  if (source.blockers !== undefined) next.blockers = normalizeArray(source.blockers);
  if (source.evidence !== undefined) next.evidence = normalizeArray(source.evidence);
  if (source.payload && typeof source.payload === 'object') next.payload = source.payload;
  return next;
}

function sanitizeRisk(payload = {}, { requireTitle = false } = {}) {
  const source = payload && typeof payload === 'object' ? payload : {};
  const next = {};
  if (requireTitle || source.title !== undefined) next.title = normalizeText(source.title, 'Integration risk') || 'Integration risk';
  ['programId', 'riskArea', 'severity', 'mitigation', 'owner', 'status', 'linkedComplianceAlertId', 'linkedMilestoneId', 'residualRisk', 'escalationStatus'].forEach((key) => {
    if (source[key] !== undefined) next[key] = normalizeText(source[key]);
  });
  if (source.likelihood !== undefined) next.likelihood = normalizeNumber(source.likelihood);
  if (source.impact !== undefined) next.impact = normalizeNumber(source.impact);
  if (source.payload && typeof source.payload === 'object') next.payload = source.payload;
  return next;
}

function sanitizeDayOne(payload = {}, { requireTitle = false } = {}) {
  const source = payload && typeof payload === 'object' ? payload : {};
  const next = {};
  if (requireTitle || source.title !== undefined) next.title = normalizeText(source.title, 'Day 1 readiness item') || 'Day 1 readiness item';
  ['programId', 'checklistArea', 'owner', 'status', 'blockerNotes'].forEach((key) => {
    if (source[key] !== undefined) next[key] = normalizeText(source[key]);
  });
  if (source.readinessScore !== undefined) next.readinessScore = clampScore(source.readinessScore);
  if (source.evidence !== undefined) next.evidence = normalizeArray(source.evidence);
  if (source.payload && typeof source.payload === 'object') next.payload = source.payload;
  return next;
}

function sanitizeHundredDay(payload = {}, { requireTitle = false } = {}) {
  const source = payload && typeof payload === 'object' ? payload : {};
  const next = {};
  if (requireTitle || source.title !== undefined) next.title = normalizeText(source.title, '100-day plan item') || '100-day plan item';
  ['programId', 'period', 'status', 'owner'].forEach((key) => {
    if (source[key] !== undefined) next[key] = normalizeText(source[key]);
  });
  ['priorities', 'completedActions', 'delayedActions', 'criticalBlockers', 'committeeDecisionsRequired'].forEach((key) => {
    if (source[key] !== undefined) next[key] = normalizeArray(source[key]);
  });
  if (source.valueCaptureProgress !== undefined) next.valueCaptureProgress = clampScore(source.valueCaptureProgress);
  if (source.payload && typeof source.payload === 'object') next.payload = source.payload;
  return next;
}

function sanitizeTransitionService(payload = {}, { requireTitle = false } = {}) {
  const source = payload && typeof payload === 'object' ? payload : {};
  const next = {};
  if (requireTitle || source.title !== undefined || source.tsaItem !== undefined) next.title = normalizeText(source.title || source.tsaItem, 'TSA item') || 'TSA item';
  ['programId', 'provider', 'receiver', 'serviceArea', 'startDate', 'endDate', 'risk', 'owner', 'exitPlan', 'status'].forEach((key) => {
    if (source[key] !== undefined) next[key] = normalizeText(source[key]);
  });
  if (source.cost !== undefined) next.cost = normalizeNumber(source.cost);
  if (source.payload && typeof source.payload === 'object') next.payload = source.payload;
  return next;
}

function sanitizeOperatingModel(payload = {}, { requireTitle = false } = {}) {
  const source = payload && typeof payload === 'object' ? payload : {};
  const next = {};
  if (requireTitle || source.title !== undefined) next.title = normalizeText(source.title, 'Operating model item') || 'Operating model item';
  ['programId', 'targetOperatingModelNotes', 'processHarmonization', 'reportingLines', 'decisionRights', 'governanceCadence', 'owner', 'status'].forEach((key) => {
    if (source[key] !== undefined) next[key] = normalizeText(source[key]);
  });
  if (source.orgStructureDependencies !== undefined) next.orgStructureDependencies = normalizeArray(source.orgStructureDependencies);
  if (source.systemsIntegrationDependencies !== undefined) next.systemsIntegrationDependencies = normalizeArray(source.systemsIntegrationDependencies);
  if (source.payload && typeof source.payload === 'object') next.payload = source.payload;
  return next;
}

function sanitizePeopleCulture(payload = {}, { requireTitle = false } = {}) {
  const source = payload && typeof payload === 'object' ? payload : {};
  const next = {};
  if (requireTitle || source.title !== undefined) next.title = normalizeText(source.title, 'People and culture item') || 'People and culture item';
  ['programId', 'keyPeopleRisk', 'retentionPlan', 'culturalIntegrationNotes', 'communicationPlan', 'laborDependencyNote', 'leadershipAlignment', 'owner', 'status'].forEach((key) => {
    if (source[key] !== undefined) next[key] = normalizeText(source[key]);
  });
  if (source.payload && typeof source.payload === 'object') next.payload = source.payload;
  return next;
}

function sanitizeTechnology(payload = {}, { requireTitle = false } = {}) {
  const source = payload && typeof payload === 'object' ? payload : {};
  const next = {};
  if (requireTitle || source.title !== undefined) next.title = normalizeText(source.title, 'Technology integration item') || 'Technology integration item';
  ['programId', 'integrationApproach', 'dataMigrationRisk', 'tsaTechnologyDependency', 'owner', 'status'].forEach((key) => {
    if (source[key] !== undefined) next[key] = normalizeText(source[key]);
  });
  if (source.systemsInventory !== undefined) next.systemsInventory = normalizeArray(source.systemsInventory);
  if (source.cyberSecurityDependencies !== undefined) next.cyberSecurityDependencies = normalizeArray(source.cyberSecurityDependencies);
  if (source.payload && typeof source.payload === 'object') next.payload = source.payload;
  return next;
}

function createEnterpriseCrud({ store, sanitize, createAction, updateAction, completeAction }) {
  return {
    async list(organizationId) {
      assertOrganizationId(organizationId);
      return store.listByOrganization(organizationId);
    },
    async get(organizationId, id) {
      assertOrganizationId(organizationId);
      return store.getByIdForOrganization(normalizeText(id), organizationId);
    },
    async create(organizationId, payload = {}, actor = {}) {
      assertOrganizationId(organizationId);
      const created = await store.create({
        ...sanitize(payload, { requireTitle: true }),
        ...commonCreate(organizationId, actor)
      });
      await recordPmiAudit({ organizationId, userId: actorId(actor), action: createAction, entityId: created?.id || '' });
      return created;
    },
    async update(organizationId, id, payload = {}, actor = {}) {
      assertOrganizationId(organizationId);
      const updated = await store.updateForOrganization(normalizeText(id), sanitize(payload), organizationId);
      if (updated) {
        const status = normalizeText(updated.status).toLowerCase();
        const event = completeAction && ['completed', 'captured', 'finance_validated'].includes(status) ? completeAction : updateAction;
        await recordPmiAudit({ organizationId, userId: actorId(actor), action: event, entityId: updated.id });
      }
      return updated;
    }
  };
}

const programCrud = createEnterpriseCrud({ store: pmiProgramsStore, sanitize: sanitizeProgram, createAction: 'pmi.program.created', updateAction: 'pmi.program.updated' });
const synergyCrud = createEnterpriseCrud({ store: pmiSynergiesStore, sanitize: sanitizeSynergy, createAction: 'pmi.synergy.created', updateAction: 'pmi.synergy.updated', completeAction: 'pmi.synergy.captured' });
const milestoneCrud = createEnterpriseCrud({ store: pmiMilestonesStore, sanitize: sanitizeMilestone, createAction: 'pmi.milestone.created', updateAction: 'pmi.milestone.updated', completeAction: 'pmi.milestone.completed' });
const riskCrud = createEnterpriseCrud({ store: pmiRisksStore, sanitize: sanitizeRisk, createAction: 'pmi.risk.created', updateAction: 'pmi.risk.updated', completeAction: 'pmi.risk.escalated' });
const dayOneCrud = createEnterpriseCrud({ store: pmiDayOneStore, sanitize: sanitizeDayOne, createAction: 'pmi.day1.updated', updateAction: 'pmi.day1.updated' });
const hundredDayCrud = createEnterpriseCrud({ store: pmiHundredDayStore, sanitize: sanitizeHundredDay, createAction: 'pmi.day100.updated', updateAction: 'pmi.day100.updated' });
const transitionCrud = createEnterpriseCrud({ store: pmiTransitionServicesStore, sanitize: sanitizeTransitionService, createAction: 'pmi.tsa.created', updateAction: 'pmi.tsa.updated', completeAction: 'pmi.tsa.exit_risk' });
const operatingModelCrud = createEnterpriseCrud({ store: pmiOperatingModelStore, sanitize: sanitizeOperatingModel, createAction: 'pmi.operating_model.updated', updateAction: 'pmi.operating_model.updated' });
const peopleCultureCrud = createEnterpriseCrud({ store: pmiPeopleCultureStore, sanitize: sanitizePeopleCulture, createAction: 'pmi.people_culture.updated', updateAction: 'pmi.people_culture.updated' });
const technologyCrud = createEnterpriseCrud({ store: pmiTechnologyStore, sanitize: sanitizeTechnology, createAction: 'pmi.technology.updated', updateAction: 'pmi.technology.updated' });

export const listPmiPrograms = programCrud.list;
export const getPmiProgramById = programCrud.get;
export const createPmiProgram = programCrud.create;
export const updatePmiProgram = programCrud.update;
export const listPmiSynergies = synergyCrud.list;
export const createPmiSynergy = synergyCrud.create;
export const updatePmiSynergy = synergyCrud.update;
export const listPmiMilestones = milestoneCrud.list;
export const createPmiMilestone = milestoneCrud.create;
export const updatePmiMilestone = milestoneCrud.update;
export const listPmiRisks = riskCrud.list;
export const createPmiRisk = riskCrud.create;
export const updatePmiRisk = riskCrud.update;
export const listPmiDayOneItems = dayOneCrud.list;
export const createPmiDayOneItem = dayOneCrud.create;
export const updatePmiDayOneItem = dayOneCrud.update;
export const listPmiHundredDayItems = hundredDayCrud.list;
export const createPmiHundredDayItem = hundredDayCrud.create;
export const updatePmiHundredDayItem = hundredDayCrud.update;
export const listPmiTransitionServices = transitionCrud.list;
export const createPmiTransitionService = transitionCrud.create;
export const updatePmiTransitionService = transitionCrud.update;
export const listPmiOperatingModelItems = operatingModelCrud.list;
export const createPmiOperatingModelItem = operatingModelCrud.create;
export const updatePmiOperatingModelItem = operatingModelCrud.update;
export const listPmiPeopleCultureItems = peopleCultureCrud.list;
export const createPmiPeopleCultureItem = peopleCultureCrud.create;
export const updatePmiPeopleCultureItem = peopleCultureCrud.update;
export const listPmiTechnologyItems = technologyCrud.list;
export const createPmiTechnologyItem = technologyCrud.create;
export const updatePmiTechnologyItem = technologyCrud.update;

function severityWeight(value) {
  const severity = normalizeText(value).toLowerCase();
  if (severity.includes('critical')) return 4;
  if (severity.includes('high')) return 3;
  if (severity.includes('medium')) return 2;
  if (severity.includes('low')) return 1;
  return 2;
}

export function calculatePmiEnterpriseMetrics({
  cases = [],
  programs = [],
  synergies = [],
  milestones = [],
  risks = [],
  dayOneItems = [],
  hundredDayItems = [],
  transitionServices = [],
  peopleCultureItems = [],
  technologyItems = []
} = {}) {
  const latestCase = cases[0] || null;
  const legacyLedger = cases.flatMap((item) => normalizeArray(item.synergyLedger));
  const legacyMilestones = cases.flatMap((item) => normalizeArray(item.milestones));
  const legacyRisks = cases.flatMap((item) => normalizeArray(item.risks));
  const totalSynergyTarget = synergies.reduce((sum, item) => sum + normalizeNumber(item.targetValue), 0) || cases.reduce((sum, item) => sum + normalizeNumber(item.synergyTarget), 0) || legacyLedger.reduce((sum, item) => sum + normalizeNumber(item.forecast), 0);
  const capturedSynergy = synergies.reduce((sum, item) => sum + normalizeNumber(item.capturedValue), 0) || cases.reduce((sum, item) => sum + normalizeNumber(item.synergyCaptured), 0) || legacyLedger.reduce((sum, item) => sum + normalizeNumber(item.captured), 0);
  const synergyCaptureRatio = totalSynergyTarget > 0 ? clampScore((capturedSynergy / totalSynergyTarget) * 100) : 0;
  const allMilestones = [...milestones, ...legacyMilestones];
  const delayedMilestones = allMilestones.filter((item) => {
    const status = normalizeText(item.status).toLowerCase();
    return status.includes('delay') || status.includes('blocked') || (isPastDate(item.dueDate) && !status.includes('complete'));
  });
  const allRisks = [...risks, ...legacyRisks];
  const criticalIntegrationRisks = allRisks.filter((item) => severityWeight(item.severity || item.residualRisk) >= 3 && !['closed', 'mitigated'].includes(normalizeText(item.status).toLowerCase()));
  const blockedSynergies = synergies.filter((item) => ['delayed', 'at_risk'].includes(normalizeText(item.status).toLowerCase()) || severityWeight(item.valueLeakageRisk) >= 3);
  const day1ReadinessScore = dayOneItems.length > 0
    ? clampScore(dayOneItems.reduce((sum, item) => sum + normalizeNumber(item.readinessScore), 0) / dayOneItems.length)
    : getPlaybookProgress(cases.flatMap((item) => normalizeArray(item.playbooks)).filter((item) => normalizeText(item.label).toLowerCase().includes('day 1')));
  const progressForPeriod = (period) => {
    const items = hundredDayItems.filter((item) => normalizeText(item.period).toLowerCase() === period);
    if (items.length > 0) return clampScore(items.reduce((sum, item) => sum + normalizeNumber(item.valueCaptureProgress), 0) / items.length);
    const legacy = legacyMilestones.filter((item) => normalizeText(item.label).toLowerCase().replace(/\s+/g, '_') === period);
    return legacy.length > 0 ? clampScore(legacy.reduce((sum, item) => sum + normalizeNumber(item.progress), 0) / legacy.length) : 0;
  };
  const tsaRisk = transitionServices.filter((item) => severityWeight(item.risk) >= 3 || isWithinDays(item.endDate, 30) || isPastDate(item.endDate)).length;
  const peopleRisk = peopleCultureItems.filter((item) => severityWeight(item.keyPeopleRisk) >= 3).length;
  const technologyRisk = technologyItems.filter((item) => severityWeight(item.dataMigrationRisk) >= 3 || normalizeText(item.status).toLowerCase().includes('block')).length;
  const milestoneProgress = allMilestones.length > 0 ? clampScore(allMilestones.reduce((sum, item) => sum + normalizeNumber(item.progress), 0) / allMilestones.length) : 0;
  const riskControlScore = clampScore(100 - criticalIntegrationRisks.length * 18 - delayedMilestones.length * 8 - tsaRisk * 8 - peopleRisk * 8 - technologyRisk * 8);
  const integrationReadinessScore = clampScore(
    day1ReadinessScore * 0.2 +
      synergyCaptureRatio * 0.25 +
      milestoneProgress * 0.2 +
      riskControlScore * 0.25 +
      Math.max(0, 100 - blockedSynergies.length * 15) * 0.1
  );
  const requiresExecutiveAttention =
    criticalIntegrationRisks.length > 0 ||
    delayedMilestones.length > 1 ||
    blockedSynergies.length > 0 ||
    tsaRisk > 0 ||
    day1ReadinessScore < 70;
  const valueCaptureStatus = synergyCaptureRatio >= 75 ? 'on_track' : blockedSynergies.length > 0 ? 'at_risk' : 'building';
  const pmiStatus =
    cases.length + programs.length + synergies.length + milestones.length === 0
      ? 'insufficient_data'
      : integrationReadinessScore >= 78 && !requiresExecutiveAttention
        ? 'strong'
        : integrationReadinessScore >= 62
          ? 'watch'
          : requiresExecutiveAttention
            ? 'risk'
            : 'blocked';

  return {
    pmiReadinessScore: integrationReadinessScore,
    integrationReadinessScore,
    integrationPhase: programs[0]?.integrationPhase || latestCase?.status || 'planning',
    totalSynergyTarget,
    capturedSynergy,
    synergyCaptureRatio,
    day1ReadinessScore,
    day30Progress: progressForPeriod('day_30'),
    day60Progress: progressForPeriod('day_60'),
    day90Progress: progressForPeriod('day_90'),
    delayedMilestones: delayedMilestones.length,
    criticalBlockers: delayedMilestones.filter((item) => normalizeBool(item.criticalPathFlag) || normalizeArray(item.blockers).length > 0).length,
    integrationRisks: criticalIntegrationRisks.length,
    criticalIntegrationRisks: criticalIntegrationRisks.length,
    blockedSynergies: blockedSynergies.length,
    valueCaptureStatus,
    tsaRisk,
    peopleRisk,
    technologyRisk,
    requiresExecutiveAttention,
    pmiStatus,
    nextIntegrationCommitteeActions: hundredDayItems.flatMap((item) => normalizeArray(item.committeeDecisionsRequired)).slice(0, 5),
    humanReviewPosture: requiresExecutiveAttention ? 'human_review_required' : 'human_review_available'
  };
}

export async function getPmiSummary(scope = {}) {
  assertOrganizationId(scope.organizationId);
  const [cases, programs, synergies, milestones, risks, dayOneItems, hundredDayItems, transitionServices, operatingModelItems, peopleCultureItems, technologyItems, reports] = await Promise.all([
    listPmiCases(scope.organizationId),
    listPmiPrograms(scope.organizationId),
    listPmiSynergies(scope.organizationId),
    listPmiMilestones(scope.organizationId),
    listPmiRisks(scope.organizationId),
    listPmiDayOneItems(scope.organizationId),
    listPmiHundredDayItems(scope.organizationId),
    listPmiTransitionServices(scope.organizationId),
    listPmiOperatingModelItems(scope.organizationId),
    listPmiPeopleCultureItems(scope.organizationId),
    listPmiTechnologyItems(scope.organizationId),
    listPmiReports(scope.organizationId)
  ]);
  const metrics = calculatePmiEnterpriseMetrics({ cases, programs, synergies, milestones, risks, dayOneItems, hundredDayItems, transitionServices, operatingModelItems, peopleCultureItems, technologyItems });
  return {
    version: 'pmi-synergies-enterprise-v1',
    organizationId: scope.organizationId,
    generatedAt: new Date().toISOString(),
    metrics,
    latestProgram: programs[0] || null,
    latestCase: cases[0] || null,
    latestReport: reports[0] || null
  };
}

export async function getPmiDashboard(scope = {}) {
  const [summary, auditEvents] = await Promise.all([
    getPmiSummary(scope),
    listPmiAuditLogs(scope.organizationId, { limit: 10 })
  ]);
  return {
    ...summary,
    auditEvents,
    dssNotice: 'Decision support only. PMI outputs do not replace integration committees, CFO, HR, legal counsel, advisors or formal board approvals.'
  };
}

export async function generatePmiReport(organizationId, payload = {}, actor = {}) {
  assertOrganizationId(organizationId);
  const summary = await getPmiSummary({ organizationId });
  const reportType = normalizeText(payload.reportType, 'pmi_executive_integration_memo');
  const title = normalizeText(payload.title) || ({
    pmi_executive_integration_memo: 'PMI Executive Integration Memo',
    day1_readiness_pack: 'Day 1 Readiness Pack',
    day_30_60_90_integration_plan: '30-60-90 Integration Plan',
    hundred_day_value_capture_report: '100-Day Value Capture Report',
    synergy_capture_report: 'Synergy Capture Report',
    integration_risk_brief: 'Integration Risk Brief',
    integration_committee_pack: 'Integration Committee Pack',
    tsa_exit_plan_summary: 'TSA Exit Plan Summary'
  }[reportType] || 'PMI Report');
  const created = await pmiReportsStore.create({
    ...commonCreate(organizationId, actor),
    reportType,
    title,
    status: 'generated',
    payload: {
      generatedAt: new Date().toISOString(),
      summary,
      dssNotice:
        'Decision support only. PMI outputs require human review before committee or board use and do not replace integration committees, CFO, HR, legal counsel, advisors or formal board approvals.',
      boardReadyMemo: {
        posture: summary.metrics?.pmiStatus || 'building',
        operationalReadiness: summary.metrics?.pmiReadinessScore ?? null,
        synergyCaptureRatio: summary.metrics?.synergyCaptureRatio ?? null,
        requiredHumanReview: true,
        disclaimer:
          'Decision-support PMI integration memo. Operational capture and readiness signals may use target, forecast or initiative sources depending on layer. Not a certified rating. Golden benchmark pmiCaptureRateGolden (captured/forecast) is validation-only.'
      },
      scoringTruthfulness: {
        goldenBenchmark: 'pmiCaptureRateGolden',
        goldenFormula: 'captured / forecast',
        operationalLayers: [
          'operationalPmiCaseCapture',
          'operationalPmiLedgerCapture',
          'operationalPmiEnterpriseCapture',
          'operationalPmiReadinessScore'
        ],
        humanReviewRequired: true,
        certifiedRating: false,
        note: 'Operational PMI metrics are decision-support signals and may differ from Golden benchmarks.'
      },
      humanReviewRequired: true
    }
  });
  await recordPmiAudit({ organizationId, userId: actorId(actor), action: 'pmi.report.exported', entityId: created.id, metadata: { reportType } });
  return created;
}

export async function listPmiReports(organizationId) {
  assertOrganizationId(organizationId);
  return pmiReportsStore.listByOrganization(organizationId);
}

export function buildPmiBridgeSignals(summary = {}) {
  const metrics = summary.metrics || summary;
  const signals = [];
  if (metrics.delayedMilestones > 0 || metrics.synergyCaptureRatio < 50) signals.push('pmi.synergy_delay_affects_ma_value');
  if (metrics.criticalBlockers > 0 || metrics.requiresExecutiveAttention) signals.push('pmi.governance_decision_required');
  if (metrics.criticalIntegrationRisks > 0) signals.push('pmi.integration_risk_critical');
  if (metrics.blockedSynergies > 0 || metrics.valueCaptureStatus === 'at_risk') signals.push('pmi.value_capture_at_risk');
  if (metrics.tsaRisk > 0) signals.push('pmi.tsa_exit_risk');
  if (metrics.day1ReadinessScore < 70) signals.push('pmi.day1_not_ready');
  if (metrics.integrationRisks > 0) signals.push('pmi.compliance_blocker_detected');
  return signals;
}

export async function getPmiBridgeSignals(scope = {}) {
  const summary = await getPmiSummary(scope);
  const signals = buildPmiBridgeSignals(summary);
  if (signals.length > 0) {
    await recordPmiAudit({
      organizationId: scope.organizationId,
      userId: scope.userId || '',
      action: 'bridge.pmi_signal.created',
      metadata: { signals }
    });
  }
  return {
    version: 'pmi-bridge-signals-v1',
    organizationId: scope.organizationId,
    generatedAt: new Date().toISOString(),
    signals
  };
}

export async function getPmiExecutiveHubBrief(scope = {}) {
  assertOrganizationId(scope.organizationId);

  const cases = await listPmiCases(scope.organizationId);
  const sortedCases = [...cases].sort(
    (a, b) =>
      new Date(b.updatedAt || b.createdAt || 0).getTime() -
      new Date(a.updatedAt || a.createdAt || 0).getTime()
  );
  const latestCase = sortedCases[0] || null;
  const signal = buildPmiSignal(latestCase);
  const workstreams = latestCase?.workstreams || [];
  const risks = latestCase?.risks || [];
  const milestones = latestCase?.milestones || [];
  const synergyLedger = latestCase?.synergyLedger || [];
  const playbooks = latestCase?.playbooks || [];
  const dependencies = latestCase?.dependencies || [];
  const synergyTarget = normalizeNumber(latestCase?.synergyTarget);
  const synergyCaptured = normalizeNumber(latestCase?.synergyCaptured);
  const integrationBudget = normalizeNumber(latestCase?.integrationBudget);
  const integrationCostUsed = normalizeNumber(latestCase?.integrationCostUsed);
  const synergyCaptureRate =
    synergyTarget > 0
      ? Math.max(0, Math.min(100, Math.round((synergyCaptured / synergyTarget) * 100)))
      : 0;
  const budgetUsedRate =
    integrationBudget > 0
      ? Math.max(0, Math.min(100, Math.round((integrationCostUsed / integrationBudget) * 100)))
      : 0;
  const ledger = getLedgerTotals(synergyLedger);
  const blockedDependencies = getBlockedDependencies(dependencies);

  const enterpriseSummary = await getPmiSummary(scope);
  const enterpriseMetrics = enterpriseSummary.metrics || {};
  const truthfulness = resolvePmiExecutiveHubTruthfulness({
    cases,
    latestCase,
    signal,
    enterpriseMetrics
  });
  const score = truthfulness.executiveSignalEligible
    ? enterpriseMetrics.pmiReadinessScore ?? signal.score ?? null
    : null;

  return {
    version: 'pmi-executive-hub-v2',
    organizationId: scope.organizationId,
    generatedAt: new Date().toISOString(),
    score,
    posture: truthfulness.executiveSignalEligible
      ? enterpriseMetrics.requiresExecutiveAttention
        ? 'Executive attention required'
        : signal.posture
      : signal.posture,
    title: signal.title,
    description: signal.description,
    dataSource: truthfulness.dataSource,
    truthfulnessStatus: truthfulness.truthfulnessStatus,
    hasPersistedData: truthfulness.hasPersistedData,
    humanReviewRequired: truthfulness.humanReviewRequired,
    demoDataIncluded: truthfulness.demoDataIncluded,
    executiveSignalEligible: truthfulness.executiveSignalEligible,
    truthfulness,
    latestCase: latestCase && {
      id: latestCase.id,
      dealName: latestCase.dealName,
      buyerName: latestCase.buyerName,
      targetName: latestCase.targetName,
      status: latestCase.status,
      integrationDay: latestCase.integrationDay,
      currency: latestCase.currency,
      synergyTarget: latestCase.synergyTarget,
      synergyCaptured: latestCase.synergyCaptured,
      integrationBudget: latestCase.integrationBudget,
      integrationCostUsed: latestCase.integrationCostUsed,
      synergyLedgerCount: synergyLedger.length,
      playbooksCount: playbooks.length,
      dependenciesCount: dependencies.length,
      updatedAt: latestCase.updatedAt
    },
    metrics: {
      casesCount: cases.length,
      workstreamsCount: workstreams.length,
      risksCount: risks.length,
      highRiskCount: getHighRiskCount(risks),
      openRiskCount: getOpenRiskCount(risks),
      milestonesCount: milestones.length,
      workstreamProgress: getAverageProgress(workstreams),
      milestoneProgress: getAverageProgress(milestones),
      synergyCaptureRate,
      ...ledger,
      playbookProgress: getPlaybookProgress(playbooks),
      synergyGap: Math.max(0, synergyTarget - synergyCaptured),
      budgetUsedRate,
      budgetRemaining: Math.max(0, integrationBudget - integrationCostUsed),
      blockedWorkstreamsCount: getBlockedWorkstreams(workstreams).length,
      dependenciesCount: dependencies.length,
      blockedDependenciesCount: blockedDependencies.length,
      dependencyRiskScore: Math.max(0, 100 - blockedDependencies.length * 22 - dependencies.length * 3),
      ...enterpriseMetrics
    }
  };
}

export default {
  listPmiCases,
  getPmiCaseById,
  createPmiCase,
  createPmiCaseFromMaDeal,
  duplicatePmiCase,
  updatePmiCase,
  deletePmiCase,
  listPmiAuditLogs,
  listPmiPrograms,
  getPmiProgramById,
  createPmiProgram,
  updatePmiProgram,
  listPmiSynergies,
  createPmiSynergy,
  updatePmiSynergy,
  listPmiMilestones,
  createPmiMilestone,
  updatePmiMilestone,
  listPmiRisks,
  createPmiRisk,
  updatePmiRisk,
  listPmiDayOneItems,
  createPmiDayOneItem,
  updatePmiDayOneItem,
  listPmiHundredDayItems,
  createPmiHundredDayItem,
  updatePmiHundredDayItem,
  listPmiTransitionServices,
  createPmiTransitionService,
  updatePmiTransitionService,
  listPmiOperatingModelItems,
  createPmiOperatingModelItem,
  updatePmiOperatingModelItem,
  listPmiPeopleCultureItems,
  createPmiPeopleCultureItem,
  updatePmiPeopleCultureItem,
  listPmiTechnologyItems,
  createPmiTechnologyItem,
  updatePmiTechnologyItem,
  getPmiSummary,
  getPmiDashboard,
  generatePmiReport,
  listPmiReports,
  getPmiBridgeSignals,
  getPmiExecutiveHubBrief
};
