import { createSqliteEntityStore } from '../../storage/sqliteEntityStore.service.js';
import { listAuditLogs, recordAuditLog } from '../audit/auditLog.service.js';

export const DECISION_STATUSES = [
  'draft',
  'under_review',
  'approved',
  'rejected',
  'deferred',
  'escalated',
  'implemented',
  'archived'
];

export const DECISION_TYPES = [
  'strategic',
  'financial',
  'legal',
  'compliance',
  'investment',
  'acquisition',
  'funding',
  'operational',
  'people',
  'technology',
  'governance',
  'risk',
  'reporting'
];

const decisionsStore = createSqliteEntityStore('governance_decisions', 'gov_decision', {
  title: 'Governance decision',
  category: 'Board',
  decisionType: 'governance',
  status: 'draft',
  priority: 'medium',
  owner: 'Board Secretary',
  approver: '',
  dueDate: '',
  deadlineAt: '',
  decisionDate: '',
  evidenceStatus: 'pending',
  boardApprovalRequired: 1,
  sourceModule: '',
  sourceEntityId: '',
  approvalNotes: '',
  changeHistory: [],
  evidence: [],
  blockingDecision: 0,
  estimatedFinancialImpact: 0,
  estimatedComplianceImpact: 0,
  estimatedStrategicImpact: 0,
  lockedAt: '',
  submittedAt: '',
  approvedAt: '',
  rejectedAt: '',
  deferredAt: '',
  escalatedAt: '',
  implementedAt: '',
  payload: {}
});

const controlsStore = createSqliteEntityStore('governance_controls', 'gov_control', {
  name: 'Governance control',
  domain: 'Board',
  status: 'active',
  owner: 'Governance Lead',
  effectiveness: 60,
  reviewCadence: 'quarterly',
  lastReviewAt: '',
  nextReviewAt: '',
  payload: {}
});

const esgMetricsStore = createSqliteEntityStore('governance_esg_metrics', 'gov_esg', {
  metric: 'ESG metric',
  pillar: 'Governance',
  value: 0,
  target: 100,
  status: 'tracking',
  evidenceStatus: 'pending',
  reportingPeriod: '',
  payload: {}
});

const boardPacksStore = createSqliteEntityStore('governance_board_packs', 'gov_pack', {
  title: 'Governance Board Pack',
  status: 'draft',
  agenda: [],
  executiveSummary: '',
  keyDecisions: [],
  risks: [],
  financialHighlights: [],
  complianceHighlights: [],
  maHighlights: [],
  fundingHighlights: [],
  pmiHighlights: [],
  governanceHighlights: [],
  annexes: [],
  evidence: [],
  readinessScore: 0,
  finalizedAt: '',
  payload: {}
});

const committeesStore = createSqliteEntityStore('governance_committees', 'gov_committee', {
  committeeName: 'Governance Committee',
  committeeType: 'board',
  chair: '',
  members: [],
  cadence: 'monthly',
  nextMeetingDate: '',
  scope: '',
  status: 'active',
  linkedDecisions: [],
  linkedPolicies: [],
  payload: {}
});

const policiesStore = createSqliteEntityStore('governance_policies', 'gov_policy', {
  title: 'Governance Policy',
  area: 'Governance',
  jurisdiction: '',
  owner: 'Governance Lead',
  effectiveDate: '',
  reviewDate: '',
  controlPoints: [],
  requiredEvidence: [],
  status: 'active',
  riskIfOverdue: 'medium',
  linkedComplianceControls: [],
  payload: {}
});

const actionsStore = createSqliteEntityStore('governance_action_items', 'gov_action', {
  title: 'Governance action',
  owner: 'Governance Lead',
  dueDate: '',
  status: 'open',
  escalationLevel: 'none',
  linkedDecisionId: '',
  linkedBoardPackId: '',
  linkedCommitteeId: '',
  blockerNotes: '',
  completionEvidence: [],
  overdueRiskFlag: 0,
  completedAt: '',
  payload: {}
});

const meetingsStore = createSqliteEntityStore('governance_meetings', 'gov_meeting', {
  meetingTitle: 'Governance Meeting',
  meetingDate: '',
  committeeId: '',
  attendees: [],
  agenda: [],
  decisions: [],
  actions: [],
  minutesSummary: '',
  status: 'draft',
  finalizedAt: '',
  payload: {}
});

const approvalHistoryStore = createSqliteEntityStore('governance_approval_history', 'gov_approval', {
  decisionId: '',
  action: 'updated',
  fromStatus: '',
  toStatus: '',
  notes: '',
  payload: {}
});

const reportExportsStore = createSqliteEntityStore('governance_report_exports', 'gov_report', {
  reportType: 'board_readiness_snapshot',
  title: 'Governance Report',
  status: 'generated',
  payload: {}
});

function createError(message, status = 400, code = 'GOVERNANCE_ERROR') {
  const error = new Error(message);
  error.status = status;
  error.code = code;
  return error;
}

function text(value, fallback = '') {
  return String(value ?? fallback).trim();
}

function number(value, fallback = 0) {
  if (value === '' || value === null || value === undefined) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function bool(value, fallback = false) {
  if (value === true || value === 'true' || value === 1 || value === '1') return true;
  if (value === false || value === 'false' || value === 0 || value === '0') return false;
  return fallback;
}

function array(value) {
  return Array.isArray(value) ? value : [];
}

export function clampScore(value) {
  return Math.max(0, Math.min(100, Math.round(number(value))));
}

function normalizeStatus(value, fallback = 'draft') {
  const status = text(value, fallback).toLowerCase();
  return DECISION_STATUSES.includes(status) ? status : fallback;
}

function normalizeDecisionType(value) {
  const type = text(value, 'governance').toLowerCase();
  return DECISION_TYPES.includes(type) ? type : 'governance';
}

function todayMs() {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now.getTime();
}

function isPastDate(value) {
  const safe = text(value);
  if (!safe) return false;
  const date = new Date(safe);
  if (Number.isNaN(date.getTime())) return false;
  date.setHours(0, 0, 0, 0);
  return date.getTime() < todayMs();
}

function isWithinDays(value, days = 30) {
  const safe = text(value);
  if (!safe) return false;
  const date = new Date(safe);
  if (Number.isNaN(date.getTime())) return false;
  const diff = date.getTime() - todayMs();
  return diff >= 0 && diff <= days * 24 * 60 * 60 * 1000;
}

function actorId(actor = {}) {
  return text(actor.userId || actor.id);
}

function assertOrganizationId(organizationId) {
  if (!text(organizationId)) {
    throw createError('Scope de organizacion no definido.', 403, 'INVALID_SCOPE');
  }
}

function assertMutableDecision(decision) {
  if (!decision) return;
  if (text(decision.lockedAt) && !['implemented', 'archived'].includes(text(decision.status))) {
    throw createError('La decision aprobada esta bloqueada para edicion directa.', 409, 'DECISION_LOCKED');
  }
}

function commonCreate(scope = {}, actor = {}) {
  const userId = actorId(actor);
  return {
    organizationId: scope.organizationId,
    userId,
    createdBy: userId
  };
}

function sanitizeDecision(payload = {}, { requireTitle = false, patch = false } = {}) {
  const source = payload && typeof payload === 'object' ? payload : {};
  const next = {};
  if (requireTitle || source.title !== undefined) next.title = text(source.title, 'Governance decision') || 'Governance decision';
  if (source.category !== undefined) next.category = text(source.category, 'Board');
  if (source.decisionType !== undefined || source.type !== undefined) next.decisionType = normalizeDecisionType(source.decisionType || source.type);
  if (source.status !== undefined) next.status = normalizeStatus(source.status);
  if (source.priority !== undefined) next.priority = text(source.priority, 'medium').toLowerCase();
  ['owner', 'approver', 'dueDate', 'deadlineAt', 'decisionDate', 'evidenceStatus', 'sourceModule', 'sourceEntityId', 'approvalNotes'].forEach((key) => {
    if (source[key] !== undefined) next[key] = text(source[key]);
  });
  if (!patch && next.deadlineAt === undefined && next.dueDate) next.deadlineAt = next.dueDate;
  if (!patch && next.dueDate === undefined && next.deadlineAt) next.dueDate = next.deadlineAt;
  if (source.boardApprovalRequired !== undefined) next.boardApprovalRequired = bool(source.boardApprovalRequired) ? 1 : 0;
  if (source.blockingDecision !== undefined) next.blockingDecision = bool(source.blockingDecision) ? 1 : 0;
  if (source.estimatedFinancialImpact !== undefined) next.estimatedFinancialImpact = number(source.estimatedFinancialImpact);
  if (source.estimatedComplianceImpact !== undefined) next.estimatedComplianceImpact = number(source.estimatedComplianceImpact);
  if (source.estimatedStrategicImpact !== undefined) next.estimatedStrategicImpact = number(source.estimatedStrategicImpact);
  if (source.evidence !== undefined || source.evidenceJson !== undefined) next.evidence = array(source.evidence || source.evidenceJson);
  if (source.changeHistory !== undefined) next.changeHistory = array(source.changeHistory);
  if (source.payload && typeof source.payload === 'object') next.payload = source.payload;
  return next;
}

function sanitizeBoardPack(payload = {}, { requireTitle = false } = {}) {
  const source = payload && typeof payload === 'object' ? payload : {};
  const next = {};
  if (requireTitle || source.title !== undefined) next.title = text(source.title, 'Governance Board Pack') || 'Governance Board Pack';
  ['status', 'executiveSummary', 'finalizedAt'].forEach((key) => {
    if (source[key] !== undefined) next[key] = text(source[key]);
  });
  ['agenda', 'keyDecisions', 'risks', 'financialHighlights', 'complianceHighlights', 'maHighlights', 'fundingHighlights', 'pmiHighlights', 'governanceHighlights', 'annexes', 'evidence'].forEach((key) => {
    if (source[key] !== undefined) next[key] = array(source[key]);
  });
  if (source.readinessScore !== undefined) next.readinessScore = clampScore(source.readinessScore);
  if (source.payload && typeof source.payload === 'object') next.payload = source.payload;
  return next;
}

function sanitizeCommittee(payload = {}, { requireName = false } = {}) {
  const source = payload && typeof payload === 'object' ? payload : {};
  const next = {};
  if (requireName || source.committeeName !== undefined || source.name !== undefined) {
    next.committeeName = text(source.committeeName || source.name, 'Governance Committee') || 'Governance Committee';
  }
  ['committeeType', 'chair', 'cadence', 'nextMeetingDate', 'scope', 'status'].forEach((key) => {
    if (source[key] !== undefined) next[key] = text(source[key]);
  });
  ['members', 'linkedDecisions', 'linkedPolicies'].forEach((key) => {
    if (source[key] !== undefined) next[key] = array(source[key]);
  });
  if (source.payload && typeof source.payload === 'object') next.payload = source.payload;
  return next;
}

function sanitizePolicy(payload = {}, { requireTitle = false } = {}) {
  const source = payload && typeof payload === 'object' ? payload : {};
  const next = {};
  if (requireTitle || source.title !== undefined) next.title = text(source.title, 'Governance Policy') || 'Governance Policy';
  ['area', 'jurisdiction', 'owner', 'effectiveDate', 'reviewDate', 'status', 'riskIfOverdue'].forEach((key) => {
    if (source[key] !== undefined) next[key] = text(source[key]);
  });
  ['controlPoints', 'requiredEvidence', 'linkedComplianceControls'].forEach((key) => {
    if (source[key] !== undefined) next[key] = array(source[key]);
  });
  if (source.payload && typeof source.payload === 'object') next.payload = source.payload;
  return next;
}

function sanitizeActionItem(payload = {}, { requireTitle = false } = {}) {
  const source = payload && typeof payload === 'object' ? payload : {};
  const next = {};
  if (requireTitle || source.title !== undefined) next.title = text(source.title, 'Governance action') || 'Governance action';
  ['owner', 'dueDate', 'status', 'escalationLevel', 'linkedDecisionId', 'linkedBoardPackId', 'linkedCommitteeId', 'blockerNotes', 'completedAt'].forEach((key) => {
    if (source[key] !== undefined) next[key] = text(source[key]);
  });
  if (source.completionEvidence !== undefined) next.completionEvidence = array(source.completionEvidence);
  if (source.overdueRiskFlag !== undefined) next.overdueRiskFlag = bool(source.overdueRiskFlag) ? 1 : 0;
  if (source.payload && typeof source.payload === 'object') next.payload = source.payload;
  return next;
}

function sanitizeMeeting(payload = {}, { requireTitle = false } = {}) {
  const source = payload && typeof payload === 'object' ? payload : {};
  const next = {};
  if (requireTitle || source.meetingTitle !== undefined || source.title !== undefined) {
    next.meetingTitle = text(source.meetingTitle || source.title, 'Governance Meeting') || 'Governance Meeting';
  }
  ['meetingDate', 'committeeId', 'minutesSummary', 'status', 'finalizedAt'].forEach((key) => {
    if (source[key] !== undefined) next[key] = text(source[key]);
  });
  ['attendees', 'agenda', 'decisions', 'actions'].forEach((key) => {
    if (source[key] !== undefined) next[key] = array(source[key]);
  });
  if (source.payload && typeof source.payload === 'object') next.payload = source.payload;
  return next;
}

async function recordGovernanceAudit({ organizationId, userId, action, entityId = '', metadata = {} }) {
  if (!text(userId)) return null;
  return recordAuditLog({
    organizationId,
    userId,
    action,
    entityType: 'governance',
    entityId,
    metadata
  });
}

async function recordApprovalHistory({ organizationId, decision, action, fromStatus = '', toStatus = '', notes = '', actor = {}, payload = {} }) {
  const userId = actorId(actor);
  if (!decision?.id) return null;
  return approvalHistoryStore.create({
    organizationId,
    userId,
    createdBy: userId,
    decisionId: decision.id,
    action,
    fromStatus,
    toStatus,
    notes: text(notes),
    payload
  });
}

async function getDecisionOrThrow(organizationId, id) {
  const decision = await decisionsStore.getByIdForOrganization(text(id), organizationId);
  if (!decision) throw createError('Governance decision no encontrada.', 404, 'GOVERNANCE_DECISION_NOT_FOUND');
  return decision;
}

export async function listGovernanceDecisions(organizationId) {
  assertOrganizationId(organizationId);
  return decisionsStore.listByOrganization(organizationId);
}

export async function getGovernanceDecisionById(organizationId, id) {
  assertOrganizationId(organizationId);
  return decisionsStore.getByIdForOrganization(text(id), organizationId);
}

export async function createGovernanceDecision(organizationId, payload = {}, actor = {}) {
  assertOrganizationId(organizationId);
  const created = await decisionsStore.create({
    ...sanitizeDecision(payload, { requireTitle: true }),
    ...commonCreate({ organizationId }, actor)
  });
  await recordGovernanceAudit({ organizationId, userId: actorId(actor), action: 'governance.decision.created', entityId: created.id });
  await recordApprovalHistory({ organizationId, decision: created, action: 'created', toStatus: created.status, actor });
  return created;
}

export async function updateGovernanceDecision(organizationId, id, payload = {}, actor = {}) {
  assertOrganizationId(organizationId);
  const existing = await getDecisionOrThrow(organizationId, id);
  assertMutableDecision(existing);
  const patch = sanitizeDecision(payload, { patch: true });
  const updated = await decisionsStore.updateForOrganization(existing.id, patch, organizationId);
  await recordGovernanceAudit({ organizationId, userId: actorId(actor), action: 'governance.decision.updated', entityId: updated.id });
  await recordApprovalHistory({ organizationId, decision: updated, action: 'updated', fromStatus: existing.status, toStatus: updated.status, actor, payload: patch });
  return updated;
}

async function transitionDecision(organizationId, id, transition, actor = {}, options = {}) {
  assertOrganizationId(organizationId);
  const existing = await getDecisionOrThrow(organizationId, id);
  const currentStatus = text(existing.status, 'draft');
  const now = new Date().toISOString();
  const notes = text(options.notes || options.approvalNotes || options.reason);
  const patch = {
    approvalNotes: notes || existing.approvalNotes || '',
    status: transition.status
  };

  if (transition.status === 'under_review') patch.submittedAt = now;
  if (transition.status === 'approved') {
    patch.approvedAt = now;
    patch.decisionDate = now;
    patch.lockedAt = now;
    patch.evidenceStatus = existing.evidenceStatus === 'approved' ? existing.evidenceStatus : 'ready';
  }
  if (transition.status === 'rejected') patch.rejectedAt = now;
  if (transition.status === 'deferred') patch.deferredAt = now;
  if (transition.status === 'escalated') patch.escalatedAt = now;
  if (transition.status === 'implemented') patch.implementedAt = now;

  const updated = await decisionsStore.updateForOrganization(existing.id, patch, organizationId);
  await recordApprovalHistory({
    organizationId,
    decision: updated,
    action: transition.historyAction,
    fromStatus: currentStatus,
    toStatus: updated.status,
    notes,
    actor,
    payload: options
  });
  await recordGovernanceAudit({
    organizationId,
    userId: actorId(actor),
    action: transition.auditAction,
    entityId: updated.id,
    metadata: { fromStatus: currentStatus, toStatus: updated.status, notes }
  });
  return updated;
}

export const submitGovernanceDecision = (organizationId, id, actor = {}, options = {}) =>
  transitionDecision(organizationId, id, { status: 'under_review', historyAction: 'submitted', auditAction: 'governance.decision.submitted' }, actor, options);

export const approveGovernanceDecision = (organizationId, id, actor = {}, options = {}) =>
  transitionDecision(organizationId, id, { status: 'approved', historyAction: 'approved', auditAction: 'governance.decision.approved' }, actor, options);

export const rejectGovernanceDecision = (organizationId, id, actor = {}, options = {}) =>
  transitionDecision(organizationId, id, { status: 'rejected', historyAction: 'rejected', auditAction: 'governance.decision.rejected' }, actor, options);

export const deferGovernanceDecision = (organizationId, id, actor = {}, options = {}) =>
  transitionDecision(organizationId, id, { status: 'deferred', historyAction: 'deferred', auditAction: 'governance.decision.deferred' }, actor, options);

export const escalateGovernanceDecision = (organizationId, id, actor = {}, options = {}) =>
  transitionDecision(organizationId, id, { status: 'escalated', historyAction: 'escalated', auditAction: 'governance.decision.escalated' }, actor, options);

export const requestGovernanceDecisionChanges = (organizationId, id, actor = {}, options = {}) =>
  transitionDecision(organizationId, id, { status: 'draft', historyAction: 'changes_requested', auditAction: 'governance.decision.changes_requested' }, actor, options);

export const implementGovernanceDecision = (organizationId, id, actor = {}, options = {}) =>
  transitionDecision(organizationId, id, { status: 'implemented', historyAction: 'implemented', auditAction: 'governance.decision.implemented' }, actor, options);

export async function listGovernanceApprovalHistory(organizationId, decisionId = '') {
  assertOrganizationId(organizationId);
  const items = await approvalHistoryStore.listByOrganization(organizationId);
  return text(decisionId) ? items.filter((item) => item.decisionId === text(decisionId)) : items;
}

export async function listGovernanceControls(organizationId) {
  assertOrganizationId(organizationId);
  return controlsStore.listByOrganization(organizationId);
}

export async function createGovernanceControl(organizationId, payload = {}, actor = {}) {
  assertOrganizationId(organizationId);
  const created = await controlsStore.create({ ...payload, ...commonCreate({ organizationId }, actor) });
  await recordGovernanceAudit({ organizationId, userId: actorId(actor), action: 'governance.control.created', entityId: created.id });
  return created;
}

export async function updateGovernanceControl(organizationId, id, payload = {}, actor = {}) {
  assertOrganizationId(organizationId);
  const updated = await controlsStore.updateForOrganization(text(id), payload, organizationId);
  if (updated) await recordGovernanceAudit({ organizationId, userId: actorId(actor), action: 'governance.control.updated', entityId: updated.id });
  return updated;
}

export async function listGovernanceEsgMetrics(organizationId) {
  assertOrganizationId(organizationId);
  return esgMetricsStore.listByOrganization(organizationId);
}

export async function createGovernanceEsgMetric(organizationId, payload = {}, actor = {}) {
  assertOrganizationId(organizationId);
  const created = await esgMetricsStore.create({ ...payload, ...commonCreate({ organizationId }, actor) });
  await recordGovernanceAudit({ organizationId, userId: actorId(actor), action: 'governance.esg_metric.created', entityId: created.id });
  return created;
}

export async function updateGovernanceEsgMetric(organizationId, id, payload = {}, actor = {}) {
  assertOrganizationId(organizationId);
  const updated = await esgMetricsStore.updateForOrganization(text(id), payload, organizationId);
  if (updated) await recordGovernanceAudit({ organizationId, userId: actorId(actor), action: 'governance.esg_metric.updated', entityId: updated.id });
  return updated;
}

function createCrud({ store, sanitize, createAction, updateAction, required = 'title' }) {
  return {
    async list(organizationId) {
      assertOrganizationId(organizationId);
      return store.listByOrganization(organizationId);
    },
    async create(organizationId, payload = {}, actor = {}) {
      assertOrganizationId(organizationId);
      const created = await store.create({
        ...sanitize(payload, { [required === 'title' ? 'requireTitle' : 'requireName']: true }),
        ...commonCreate({ organizationId }, actor)
      });
      await recordGovernanceAudit({ organizationId, userId: actorId(actor), action: createAction, entityId: created.id });
      return created;
    },
    async update(organizationId, id, payload = {}, actor = {}) {
      assertOrganizationId(organizationId);
      const updated = await store.updateForOrganization(text(id), sanitize(payload), organizationId);
      if (updated) await recordGovernanceAudit({ organizationId, userId: actorId(actor), action: updateAction, entityId: updated.id });
      return updated;
    }
  };
}

const boardPackCrud = createCrud({ store: boardPacksStore, sanitize: sanitizeBoardPack, createAction: 'governance.board_pack.created', updateAction: 'governance.board_pack.updated' });
const committeeCrud = createCrud({ store: committeesStore, sanitize: sanitizeCommittee, createAction: 'governance.committee.created', updateAction: 'governance.committee.updated', required: 'name' });
const policyCrud = createCrud({ store: policiesStore, sanitize: sanitizePolicy, createAction: 'governance.policy.created', updateAction: 'governance.policy.updated' });
const actionCrud = createCrud({ store: actionsStore, sanitize: sanitizeActionItem, createAction: 'governance.action.created', updateAction: 'governance.action.updated' });
const meetingCrud = createCrud({ store: meetingsStore, sanitize: sanitizeMeeting, createAction: 'governance.meeting.created', updateAction: 'governance.meeting.updated', required: 'name' });

export const listGovernanceBoardPacks = boardPackCrud.list;
export const createGovernanceBoardPack = boardPackCrud.create;
export const updateGovernanceBoardPack = boardPackCrud.update;
export const listGovernanceCommittees = committeeCrud.list;
export const createGovernanceCommittee = committeeCrud.create;
export const updateGovernanceCommittee = committeeCrud.update;
export const listGovernancePolicies = policyCrud.list;
export const createGovernancePolicy = policyCrud.create;
export const updateGovernancePolicy = policyCrud.update;
export const listGovernanceActionItems = actionCrud.list;
export const createGovernanceActionItem = actionCrud.create;
export const updateGovernanceActionItem = actionCrud.update;
export const listGovernanceMeetings = meetingCrud.list;
export const createGovernanceMeeting = meetingCrud.create;
export const updateGovernanceMeeting = meetingCrud.update;

export async function finalizeGovernanceBoardPack(organizationId, id, actor = {}) {
  const updated = await boardPacksStore.updateForOrganization(text(id), { status: 'final', finalizedAt: new Date().toISOString() }, organizationId);
  if (updated) await recordGovernanceAudit({ organizationId, userId: actorId(actor), action: 'governance.board_pack.finalized', entityId: updated.id });
  return updated;
}

export async function completeGovernanceActionItem(organizationId, id, payload = {}, actor = {}) {
  const updated = await actionsStore.updateForOrganization(text(id), {
    status: 'completed',
    completedAt: new Date().toISOString(),
    completionEvidence: array(payload.completionEvidence)
  }, organizationId);
  if (updated) await recordGovernanceAudit({ organizationId, userId: actorId(actor), action: 'governance.action.completed', entityId: updated.id });
  return updated;
}

export async function finalizeGovernanceMeetingMinutes(organizationId, id, actor = {}) {
  const updated = await meetingsStore.updateForOrganization(text(id), { status: 'final', finalizedAt: new Date().toISOString() }, organizationId);
  if (updated) await recordGovernanceAudit({ organizationId, userId: actorId(actor), action: 'governance.minutes.finalized', entityId: updated.id });
  return updated;
}

export function calculateGovernanceMetrics({ decisions = [], boardPacks = [], committees = [], policies = [], actions = [], meetings = [] } = {}) {
  const hasPersistedGovernanceData =
    decisions.length + boardPacks.length + committees.length + policies.length + actions.length + meetings.length > 0;
  const scoringTruthfulness = {
    certifiedRating: false,
    operationalDss: true,
    goldenBenchmark: null,
    humanReviewRequired: true,
    note: 'Governance readiness is an operational DSS heuristic — not a certified governance rating.'
  };

  if (!hasPersistedGovernanceData) {
    return {
      governanceReadinessScore: null,
      boardReadinessScore: null,
      pendingDecisions: 0,
      pendingCriticalDecisions: 0,
      criticalDecisions: 0,
      overdueDecisions: 0,
      escalatedDecisions: 0,
      boardPacksDraft: 0,
      boardPacksReview: 0,
      boardPacksFinal: 0,
      overdueBoardActions: 0,
      actionItemsOverdue: 0,
      policyReviewRisk: 0,
      upcomingPolicyReviews: 0,
      upcomingCommittees: 0,
      committeeReadiness: null,
      governanceRisks: 0,
      approvalBottlenecks: 0,
      decisionVelocity: null,
      implementedDecisions: 0,
      requiresExecutiveAttention: false,
      humanReviewPosture: 'human_review_required',
      governanceStatus: 'insufficient_data',
      dataSource: 'insufficient_data',
      executiveSignalEligible: false,
      humanReviewRequired: true,
      scoringTruthfulness
    };
  }

  const pending = decisions.filter((item) => ['draft', 'under_review', 'deferred'].includes(text(item.status)));
  const critical = decisions.filter((item) => ['critical', 'high'].includes(text(item.priority).toLowerCase()) || bool(item.blockingDecision));
  const overdueDecisions = decisions.filter((item) => isPastDate(item.deadlineAt || item.dueDate) && !['approved', 'implemented', 'archived', 'rejected'].includes(text(item.status)));
  const escalated = decisions.filter((item) => text(item.status) === 'escalated');
  const approved = decisions.filter((item) => ['approved', 'implemented'].includes(text(item.status)));
  const implemented = decisions.filter((item) => text(item.status) === 'implemented');
  const overdueActions = actions.filter((item) => isPastDate(item.dueDate) && !['completed', 'archived'].includes(text(item.status)));
  const policyReviewRisk = policies.filter((item) => text(item.status) === 'expired' || isPastDate(item.reviewDate) || isWithinDays(item.reviewDate, 30));
  const upcomingCommittees = committees.filter((item) => isWithinDays(item.nextMeetingDate, 30));
  const draftPacks = boardPacks.filter((item) => text(item.status) === 'draft').length;
  const reviewPacks = boardPacks.filter((item) => text(item.status) === 'review').length;
  const finalPacks = boardPacks.filter((item) => text(item.status) === 'final').length;
  const decisionVelocity = decisions.length > 0 ? clampScore((approved.length + implemented.length) / decisions.length * 100) : null;
  const approvalBottlenecks = decisions.filter((item) => text(item.status) === 'under_review' && isPastDate(item.deadlineAt || item.dueDate)).length + escalated.length;
  const committeeReadiness =
    committees.length > 0 ? clampScore((upcomingCommittees.length / committees.length) * 100) : null;
  const boardReadinessScore = clampScore(
    (finalPacks * 20) +
      (decisionVelocity ?? 0) * 0.28 +
      (100 - Math.min(100, overdueActions.length * 15)) * 0.18 +
      (100 - Math.min(100, policyReviewRisk.length * 15)) * 0.18 +
      (committeeReadiness ?? 0) * 0.16
  );
  const governanceReadinessScore = clampScore(
    boardReadinessScore * 0.42 +
      decisionVelocity * 0.24 +
      (100 - Math.min(100, approvalBottlenecks * 18)) * 0.18 +
      (100 - Math.min(100, critical.filter((item) => !['approved', 'implemented'].includes(text(item.status))).length * 12)) * 0.16
  );
  const requiresExecutiveAttention =
    overdueDecisions.length > 0 ||
    overdueActions.length > 0 ||
    approvalBottlenecks > 0 ||
    policyReviewRisk.some((item) => text(item.status) === 'expired');
  const governanceStatus =
    governanceReadinessScore >= 78 && !requiresExecutiveAttention
      ? 'strong'
      : governanceReadinessScore >= 62
        ? 'watch'
        : approvalBottlenecks > 2 || overdueActions.length > 2
          ? 'blocked'
          : 'risk';

  return {
    governanceReadinessScore,
    boardReadinessScore,
    pendingDecisions: pending.length,
    pendingCriticalDecisions: critical.filter((item) => !['approved', 'implemented', 'archived'].includes(text(item.status))).length,
    criticalDecisions: critical.length,
    overdueDecisions: overdueDecisions.length,
    escalatedDecisions: escalated.length,
    boardPacksDraft: draftPacks,
    boardPacksReview: reviewPacks,
    boardPacksFinal: finalPacks,
    overdueBoardActions: overdueActions.length,
    actionItemsOverdue: overdueActions.length,
    policyReviewRisk: policyReviewRisk.length,
    upcomingPolicyReviews: policies.filter((item) => isWithinDays(item.reviewDate, 30)).length,
    upcomingCommittees: upcomingCommittees.length,
    committeeReadiness,
    governanceRisks: overdueDecisions.length + overdueActions.length + policyReviewRisk.length + approvalBottlenecks,
    approvalBottlenecks,
    decisionVelocity,
    implementedDecisions: implemented.length,
    requiresExecutiveAttention,
    humanReviewPosture: requiresExecutiveAttention ? 'human_review_required' : 'human_review_available',
    governanceStatus,
    dataSource: 'operational_dss',
    executiveSignalEligible: true,
    humanReviewRequired: true,
    scoringTruthfulness
  };
}

export async function getGovernanceSummary(scope = {}) {
  assertOrganizationId(scope.organizationId);
  const [decisions, boardPacks, committees, policies, actions, meetings] = await Promise.all([
    listGovernanceDecisions(scope.organizationId),
    listGovernanceBoardPacks(scope.organizationId),
    listGovernanceCommittees(scope.organizationId),
    listGovernancePolicies(scope.organizationId),
    listGovernanceActionItems(scope.organizationId),
    listGovernanceMeetings(scope.organizationId)
  ]);
  const metrics = calculateGovernanceMetrics({ decisions, boardPacks, committees, policies, actions, meetings });
  return {
    version: 'governance-summary-v1',
    organizationId: scope.organizationId,
    generatedAt: new Date().toISOString(),
    metrics,
    latestDecision: decisions[0] || null,
    latestBoardPack: boardPacks[0] || null,
    latestPolicy: policies[0] || null,
    humanReviewRequired: true,
    executiveSignalEligible: metrics.executiveSignalEligible === true,
    dataSource: metrics.dataSource || 'operational_dss',
    scoringTruthfulness: metrics.scoringTruthfulness
  };
}

export async function getGovernanceDashboard(scope = {}) {
  const [summary, auditEvents] = await Promise.all([
    getGovernanceSummary(scope),
    listGovernanceAuditLogs(scope.organizationId, { limit: 8 })
  ]);
  return {
    ...summary,
    auditEvents,
    dssNotice: 'Decision support only. Governance outputs do not replace the board, legal counsel, corporate secretary, auditor or formal committee approval.'
  };
}

export async function generateGovernanceReport(organizationId, payload = {}, actor = {}) {
  assertOrganizationId(organizationId);
  const summary = await getGovernanceSummary({ organizationId });
  const reportType = text(payload.reportType, 'board_readiness_snapshot');
  const title = text(payload.title) || ({
    governance_board_pack: 'Governance Board Pack',
    decision_memo: 'Decision Memo',
    committee_action_tracker: 'Committee Action Tracker',
    policy_review_summary: 'Policy Review Summary',
    governance_risk_brief: 'Governance Risk Brief',
    board_readiness_snapshot: 'Board Readiness Snapshot',
    governance_audit_trail_summary: 'Governance Audit Trail Summary'
  }[reportType] || 'Governance Report');
  const created = await reportExportsStore.create({
    organizationId,
    userId: actorId(actor),
    createdBy: actorId(actor),
    title,
    reportType,
    status: 'generated',
    payload: {
      generatedAt: new Date().toISOString(),
      summary,
      dssNotice: 'Decision support only. Requires human review.'
    }
  });
  await recordGovernanceAudit({ organizationId, userId: actorId(actor), action: 'governance.report.exported', entityId: created.id, metadata: { reportType } });
  return created;
}

export async function listGovernanceReports(organizationId) {
  assertOrganizationId(organizationId);
  return reportExportsStore.listByOrganization(organizationId);
}

export async function listGovernanceAuditLogs(organizationId, filters = {}) {
  assertOrganizationId(organizationId);
  return listAuditLogs({
    organizationId,
    entityType: 'governance',
    action: filters.action || '',
    entityId: filters.entityId || '',
    limit: filters.limit || 100
  });
}

export const GOVERNANCE_BRIDGE_SIGNAL_META = {
  'governance.decision_required_for_ma': {
    label: 'Governance decision signal (M&A)',
    signalType: 'operational_dss',
    certifiedRating: false,
    humanReviewRequired: true,
    note: 'Heuristic governance signal — not a certified board approval.'
  },
  'governance.decision_blocking_pmi': {
    label: 'Governance decision signal (PMI)',
    signalType: 'operational_dss',
    certifiedRating: false,
    humanReviewRequired: true,
    note: 'Heuristic governance signal — not a certified board approval.'
  },
  'governance.policy_overdue_affects_compliance': {
    label: 'Policy review signal',
    signalType: 'operational_dss',
    certifiedRating: false,
    humanReviewRequired: true,
    note: 'Operational policy review signal — not compliance certification.'
  },
  'governance.board_approval_required_for_funding': {
    label: 'Board review draft signal (Funding)',
    signalType: 'operational_dss',
    certifiedRating: false,
    humanReviewRequired: true,
    note: 'Board review draft signal — not certified funding approval.'
  },
  'governance.risk_committee_required': {
    label: 'Risk committee review signal',
    signalType: 'operational_dss',
    certifiedRating: false,
    humanReviewRequired: true,
    note: 'Operational risk committee signal — not certified oversight.'
  },
  'governance.board_pack_ready': {
    label: 'Governance board review draft signal',
    signalType: 'operational_dss',
    certifiedRating: false,
    humanReviewRequired: true,
    note: 'Heuristic governance signal based on boardReadinessScore — not a certified board approval.'
  }
};

export function buildGovernanceBridgeSignals(summary = {}) {
  const metrics = summary.metrics || summary;
  const signals = [];
  if (metrics.pendingCriticalDecisions > 0) signals.push('governance.decision_required_for_ma');
  if (metrics.pendingCriticalDecisions > 0) signals.push('governance.decision_blocking_pmi');
  if (metrics.policyReviewRisk > 0) signals.push('governance.policy_overdue_affects_compliance');
  if (metrics.approvalBottlenecks > 0) signals.push('governance.board_approval_required_for_funding');
  if (metrics.governanceRisks > 2) signals.push('governance.risk_committee_required');
  if (Number.isFinite(Number(metrics.boardReadinessScore)) && metrics.boardReadinessScore >= 75) {
    signals.push('governance.board_pack_ready');
  }
  return signals;
}

export function buildGovernanceBridgeSignalDetails(summary = {}) {
  return buildGovernanceBridgeSignals(summary).map((key) => ({
    key,
    ...(GOVERNANCE_BRIDGE_SIGNAL_META[key] || {
      label: key,
      signalType: 'operational_dss',
      certifiedRating: false,
      humanReviewRequired: true,
      note: 'Heuristic governance signal — not a certified board approval.'
    })
  }));
}

export async function getGovernanceBridgeSignals(scope = {}) {
  const summary = await getGovernanceSummary(scope);
  return {
    version: 'governance-bridge-signals-v1',
    organizationId: scope.organizationId,
    generatedAt: new Date().toISOString(),
    signals: buildGovernanceBridgeSignals(summary),
    signalDetails: buildGovernanceBridgeSignalDetails(summary)
  };
}

export function summarizeGovernance({ decisions = [], controls = [], esgMetrics = [], boardPacks = [], committees = [], policies = [], actions = [], meetings = [] } = {}) {
  const legacyClosed = decisions.filter((item) => ['closed', 'approved', 'completed', 'implemented'].includes(text(item.status).toLowerCase()));
  const legacyOpen = decisions.filter((item) => !['closed', 'approved', 'completed', 'implemented', 'archived', 'rejected'].includes(text(item.status).toLowerCase()));
  const evidenceReady = decisions.filter((item) => ['ready', 'approved', 'complete'].includes(text(item.evidenceStatus).toLowerCase()));
  const controlEffectiveness =
    controls.length > 0
      ? clampScore(controls.reduce((sum, item) => sum + number(item.effectiveness), 0) / controls.length)
      : null;
  const esgReadiness =
    esgMetrics.length > 0
      ? clampScore(
          esgMetrics.reduce((sum, item) => {
            const target = number(item.target, 100);
            return sum + (target > 0 ? Math.min(100, (number(item.value) / target) * 100) : 0);
          }, 0) / esgMetrics.length
        )
      : null;
  const enterprise = calculateGovernanceMetrics({ decisions, boardPacks, committees, policies, actions, meetings });
  const fallbackScore =
    enterprise.executiveSignalEligible && controlEffectiveness !== null && esgReadiness !== null
      ? clampScore(controlEffectiveness * 0.4 + esgReadiness * 0.3)
      : null;
  return {
    decisionsCount: decisions.length,
    openDecisionsCount: legacyOpen.length,
    decisionClosureRate: decisions.length > 0 ? clampScore((legacyClosed.length / decisions.length) * 100) : 0,
    controlsCount: controls.length,
    weakControlsCount: controls.filter((item) => number(item.effectiveness) < 60).length,
    controlEffectiveness,
    esgMetricsCount: esgMetrics.length,
    esgReadiness,
    evidenceReadiness: decisions.length > 0 ? clampScore((evidenceReady.length / decisions.length) * 100) : 0,
    boardApprovalQueueCount: decisions.filter((item) => bool(item.boardApprovalRequired)).length,
    ...enterprise,
    score: enterprise.governanceReadinessScore ?? fallbackScore
  };
}

export async function getGovernanceExecutiveHubBrief(scope = {}) {
  assertOrganizationId(scope.organizationId);
  const [decisions, controls, esgMetrics, boardPacks, committees, policies, actions, meetings] = await Promise.all([
    listGovernanceDecisions(scope.organizationId),
    listGovernanceControls(scope.organizationId),
    listGovernanceEsgMetrics(scope.organizationId),
    listGovernanceBoardPacks(scope.organizationId),
    listGovernanceCommittees(scope.organizationId),
    listGovernancePolicies(scope.organizationId),
    listGovernanceActionItems(scope.organizationId),
    listGovernanceMeetings(scope.organizationId)
  ]);
  const metrics = summarizeGovernance({ decisions, controls, esgMetrics, boardPacks, committees, policies, actions, meetings });
  const hasSignal = metrics.executiveSignalEligible === true;
  return {
    version: 'governance-executive-hub-v2',
    organizationId: scope.organizationId,
    generatedAt: new Date().toISOString(),
    score: hasSignal ? (metrics.governanceReadinessScore ?? metrics.score ?? null) : null,
    posture: !hasSignal
      ? 'Insufficient persisted governance data'
      : metrics.requiresExecutiveAttention
        ? 'Executive attention required'
        : Number.isFinite(Number(metrics.governanceReadinessScore)) && metrics.governanceReadinessScore >= 75
          ? 'Operational governance signal — board review draft'
          : 'Formalize board controls — DSS only',
    title: decisions[0]?.title || boardPacks[0]?.title || 'Governance control foundation',
    metrics,
    latestDecision: decisions[0] || null,
    humanReviewRequired: true,
    executiveSignalEligible: hasSignal,
    dataSource: metrics.dataSource || (hasSignal ? 'operational_dss' : 'insufficient_data'),
    scoringTruthfulness: metrics.scoringTruthfulness
  };
}

export default {
  listGovernanceDecisions,
  getGovernanceDecisionById,
  createGovernanceDecision,
  updateGovernanceDecision,
  submitGovernanceDecision,
  approveGovernanceDecision,
  rejectGovernanceDecision,
  deferGovernanceDecision,
  escalateGovernanceDecision,
  requestGovernanceDecisionChanges,
  implementGovernanceDecision,
  listGovernanceApprovalHistory,
  listGovernanceControls,
  createGovernanceControl,
  updateGovernanceControl,
  listGovernanceEsgMetrics,
  createGovernanceEsgMetric,
  updateGovernanceEsgMetric,
  listGovernanceBoardPacks,
  createGovernanceBoardPack,
  updateGovernanceBoardPack,
  finalizeGovernanceBoardPack,
  listGovernanceCommittees,
  createGovernanceCommittee,
  updateGovernanceCommittee,
  listGovernancePolicies,
  createGovernancePolicy,
  updateGovernancePolicy,
  listGovernanceActionItems,
  createGovernanceActionItem,
  updateGovernanceActionItem,
  completeGovernanceActionItem,
  listGovernanceMeetings,
  createGovernanceMeeting,
  updateGovernanceMeeting,
  finalizeGovernanceMeetingMinutes,
  getGovernanceSummary,
  getGovernanceDashboard,
  generateGovernanceReport,
  listGovernanceReports,
  listGovernanceAuditLogs,
  getGovernanceBridgeSignals,
  getGovernanceExecutiveHubBrief
};
