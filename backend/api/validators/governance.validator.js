import {
  assertFiniteNumber,
  assertId,
  assertPlainObject,
  normalizeString
} from '../middlewares/validate.middleware.js';

const DECISION_STATUSES = ['draft', 'under_review', 'approved', 'rejected', 'deferred', 'escalated', 'implemented', 'archived'];
const DECISION_TYPES = ['strategic', 'financial', 'legal', 'compliance', 'investment', 'acquisition', 'funding', 'operational', 'people', 'technology', 'governance', 'risk', 'reporting'];

function idParams(value = {}) {
  return { ...value, id: assertId(value.id, 'id') };
}

function pickStrings(source, keys) {
  const next = {};
  keys.forEach((key) => {
    if (source[key] !== undefined) next[key] = normalizeString(source[key]);
  });
  return next;
}

function optionalArray(source, target, key) {
  if (source[key] === undefined) return;
  target[key] = Array.isArray(source[key]) ? source[key] : [];
}

function optionalNumber(source, target, key) {
  if (source[key] !== undefined) target[key] = assertFiniteNumber(source[key], key);
}

function decisionBody(value = {}) {
  const source = assertPlainObject(value, 'governance decision');
  const next = pickStrings(source, [
    'title',
    'category',
    'status',
    'decisionType',
    'type',
    'priority',
    'owner',
    'approver',
    'dueDate',
    'deadlineAt',
    'decisionDate',
    'evidenceStatus',
    'sourceModule',
    'sourceEntityId',
    'approvalNotes'
  ]);
  if (next.status && !DECISION_STATUSES.includes(next.status)) next.status = 'draft';
  if (next.decisionType && !DECISION_TYPES.includes(next.decisionType)) next.decisionType = 'governance';
  if (source.boardApprovalRequired !== undefined) next.boardApprovalRequired = Boolean(source.boardApprovalRequired);
  if (source.blockingDecision !== undefined) next.blockingDecision = Boolean(source.blockingDecision);
  optionalNumber(source, next, 'estimatedFinancialImpact');
  optionalNumber(source, next, 'estimatedComplianceImpact');
  optionalNumber(source, next, 'estimatedStrategicImpact');
  optionalArray(source, next, 'evidence');
  optionalArray(source, next, 'evidenceJson');
  if (source.payload !== undefined) next.payload = assertPlainObject(source.payload, 'payload');
  return next;
}

function workflowBody(value = {}) {
  const source = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  const next = pickStrings(source, ['notes', 'approvalNotes', 'reason']);
  if (source.payload !== undefined) next.payload = assertPlainObject(source.payload, 'payload');
  return next;
}

function boardPackBody(value = {}) {
  const source = assertPlainObject(value, 'governance board pack');
  const next = pickStrings(source, ['title', 'status', 'executiveSummary', 'finalizedAt']);
  ['agenda', 'keyDecisions', 'risks', 'financialHighlights', 'complianceHighlights', 'maHighlights', 'fundingHighlights', 'pmiHighlights', 'governanceHighlights', 'annexes', 'evidence'].forEach((key) => optionalArray(source, next, key));
  optionalNumber(source, next, 'readinessScore');
  if (source.payload !== undefined) next.payload = assertPlainObject(source.payload, 'payload');
  return next;
}

function committeeBody(value = {}) {
  const source = assertPlainObject(value, 'governance committee');
  const next = pickStrings(source, ['committeeName', 'name', 'committeeType', 'chair', 'cadence', 'nextMeetingDate', 'scope', 'status']);
  ['members', 'linkedDecisions', 'linkedPolicies'].forEach((key) => optionalArray(source, next, key));
  if (source.payload !== undefined) next.payload = assertPlainObject(source.payload, 'payload');
  return next;
}

function policyBody(value = {}) {
  const source = assertPlainObject(value, 'governance policy');
  const next = pickStrings(source, ['title', 'area', 'jurisdiction', 'owner', 'effectiveDate', 'reviewDate', 'status', 'riskIfOverdue']);
  ['controlPoints', 'requiredEvidence', 'linkedComplianceControls'].forEach((key) => optionalArray(source, next, key));
  if (source.payload !== undefined) next.payload = assertPlainObject(source.payload, 'payload');
  return next;
}

function actionBody(value = {}) {
  const source = assertPlainObject(value, 'governance action item');
  const next = pickStrings(source, ['title', 'owner', 'dueDate', 'status', 'escalationLevel', 'linkedDecisionId', 'linkedBoardPackId', 'linkedCommitteeId', 'blockerNotes', 'completedAt']);
  optionalArray(source, next, 'completionEvidence');
  if (source.overdueRiskFlag !== undefined) next.overdueRiskFlag = Boolean(source.overdueRiskFlag);
  if (source.payload !== undefined) next.payload = assertPlainObject(source.payload, 'payload');
  return next;
}

function meetingBody(value = {}) {
  const source = assertPlainObject(value, 'governance meeting');
  const next = pickStrings(source, ['meetingTitle', 'title', 'meetingDate', 'committeeId', 'minutesSummary', 'status', 'finalizedAt']);
  ['attendees', 'agenda', 'decisions', 'actions'].forEach((key) => optionalArray(source, next, key));
  if (source.payload !== undefined) next.payload = assertPlainObject(source.payload, 'payload');
  return next;
}

function reportBody(value = {}) {
  const source = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  const next = pickStrings(source, ['title', 'reportType', 'status']);
  if (source.payload !== undefined) next.payload = assertPlainObject(source.payload, 'payload');
  return next;
}

function controlBody(value = {}) {
  const source = assertPlainObject(value, 'governance control');
  const next = pickStrings(source, ['name', 'domain', 'status', 'owner', 'reviewCadence', 'lastReviewAt', 'nextReviewAt']);
  optionalNumber(source, next, 'effectiveness');
  if (source.payload !== undefined) next.payload = assertPlainObject(source.payload, 'payload');
  return next;
}

function esgMetricBody(value = {}) {
  const source = assertPlainObject(value, 'governance ESG metric');
  const next = pickStrings(source, ['metric', 'pillar', 'status', 'evidenceStatus', 'reportingPeriod']);
  optionalNumber(source, next, 'value');
  optionalNumber(source, next, 'target');
  if (source.payload !== undefined) next.payload = assertPlainObject(source.payload, 'payload');
  return next;
}

export const governanceValidator = {
  idParams: { params: idParams },
  decisionCreate: { body: decisionBody },
  decisionUpdate: { params: idParams, body: decisionBody },
  workflow: { params: idParams, body: workflowBody },
  boardPackCreate: { body: boardPackBody },
  boardPackUpdate: { params: idParams, body: boardPackBody },
  committeeCreate: { body: committeeBody },
  committeeUpdate: { params: idParams, body: committeeBody },
  policyCreate: { body: policyBody },
  policyUpdate: { params: idParams, body: policyBody },
  actionCreate: { body: actionBody },
  actionUpdate: { params: idParams, body: actionBody },
  meetingCreate: { body: meetingBody },
  meetingUpdate: { params: idParams, body: meetingBody },
  reportCreate: { body: reportBody },
  controlCreate: { body: controlBody },
  controlUpdate: { params: idParams, body: controlBody },
  esgMetricCreate: { body: esgMetricBody },
  esgMetricUpdate: { params: idParams, body: esgMetricBody }
};

export default governanceValidator;
