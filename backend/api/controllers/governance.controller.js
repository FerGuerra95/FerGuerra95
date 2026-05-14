import {
  approveGovernanceDecision,
  completeGovernanceActionItem,
  createGovernanceActionItem,
  createGovernanceBoardPack,
  createGovernanceCommittee,
  createGovernanceControl,
  createGovernanceDecision,
  createGovernanceEsgMetric,
  createGovernanceMeeting,
  createGovernancePolicy,
  deferGovernanceDecision,
  escalateGovernanceDecision,
  finalizeGovernanceBoardPack,
  finalizeGovernanceMeetingMinutes,
  generateGovernanceReport,
  getGovernanceDashboard,
  getGovernanceDecisionById,
  getGovernanceExecutiveHubBrief,
  getGovernanceSummary,
  getGovernanceBridgeSignals,
  implementGovernanceDecision,
  listGovernanceActionItems,
  listGovernanceApprovalHistory,
  listGovernanceAuditLogs,
  listGovernanceBoardPacks,
  listGovernanceCommittees,
  listGovernanceControls,
  listGovernanceDecisions,
  listGovernanceEsgMetrics,
  listGovernanceMeetings,
  listGovernancePolicies,
  listGovernanceReports,
  rejectGovernanceDecision,
  requestGovernanceDecisionChanges,
  submitGovernanceDecision,
  updateGovernanceActionItem,
  updateGovernanceBoardPack,
  updateGovernanceCommittee,
  updateGovernanceControl,
  updateGovernanceDecision,
  updateGovernanceEsgMetric,
  updateGovernanceMeeting,
  updateGovernancePolicy
} from '../../services/governance/governance.service.js';

function ok(res, data) {
  return res.json({ data, meta: { timestamp: new Date().toISOString() }, error: null });
}

function created(res, data) {
  return res.status(201).json({ data, meta: { timestamp: new Date().toISOString() }, error: null });
}

function notFound(res, message) {
  return res.status(404).json({
    data: null,
    meta: { timestamp: new Date().toISOString() },
    error: { code: 'NOT_FOUND', message }
  });
}

function scope(req) {
  return {
    organizationId: req.organizationId || req.user?.organizationId || '',
    userId: req.user?.id || '',
    role: req.user?.role || req.role || 'viewer'
  };
}

const actor = (req) => ({ userId: scope(req).userId, role: scope(req).role });

async function listResponse(req, res, next, loader) {
  try {
    const items = await loader(scope(req).organizationId);
    return ok(res, { items, total: items.length });
  } catch (error) {
    return next(error);
  }
}

async function createResponse(req, res, next, creator) {
  try {
    const currentScope = scope(req);
    return created(res, await creator(currentScope.organizationId, req.body, actor(req)));
  } catch (error) {
    return next(error);
  }
}

async function updateResponse(req, res, next, updater, message) {
  try {
    const currentScope = scope(req);
    const item = await updater(currentScope.organizationId, req.params.id, req.body, actor(req));
    if (!item) return notFound(res, message);
    return ok(res, item);
  } catch (error) {
    return next(error);
  }
}

export const getDashboard = (req, res, next) =>
  getGovernanceDashboard(scope(req)).then((data) => ok(res, data)).catch(next);

export const getSummary = (req, res, next) =>
  getGovernanceSummary(scope(req)).then((data) => ok(res, data)).catch(next);

export const getHubOverview = (req, res, next) =>
  getGovernanceExecutiveHubBrief({ organizationId: scope(req).organizationId }).then((data) => ok(res, data)).catch(next);

export const getBridgeSignals = (req, res, next) =>
  getGovernanceBridgeSignals(scope(req)).then((data) => ok(res, data)).catch(next);

export const listDecisions = (req, res, next) => listResponse(req, res, next, listGovernanceDecisions);
export const createDecision = (req, res, next) => createResponse(req, res, next, createGovernanceDecision);
export const updateDecision = (req, res, next) => updateResponse(req, res, next, updateGovernanceDecision, 'Governance decision no encontrada');

async function workflowResponse(req, res, next, runner) {
  try {
    const currentScope = scope(req);
    const item = await runner(currentScope.organizationId, req.params.id, actor(req), req.body || {});
    if (!item) return notFound(res, 'Governance decision no encontrada');
    return ok(res, item);
  } catch (error) {
    return next(error);
  }
}

export async function getDecision(req, res, next) {
  try {
    const item = await getGovernanceDecisionById(scope(req).organizationId, req.params.id);
    if (!item) return notFound(res, 'Governance decision no encontrada');
    const history = await listGovernanceApprovalHistory(scope(req).organizationId, req.params.id);
    return ok(res, { ...item, approvalHistory: history });
  } catch (error) {
    return next(error);
  }
}

export const submitDecision = (req, res, next) => workflowResponse(req, res, next, submitGovernanceDecision);
export const approveDecision = (req, res, next) => workflowResponse(req, res, next, approveGovernanceDecision);
export const rejectDecision = (req, res, next) => workflowResponse(req, res, next, rejectGovernanceDecision);
export const deferDecision = (req, res, next) => workflowResponse(req, res, next, deferGovernanceDecision);
export const escalateDecision = (req, res, next) => workflowResponse(req, res, next, escalateGovernanceDecision);
export const requestDecisionChanges = (req, res, next) => workflowResponse(req, res, next, requestGovernanceDecisionChanges);
export const implementDecision = (req, res, next) => workflowResponse(req, res, next, implementGovernanceDecision);

export const listBoardPacks = (req, res, next) => listResponse(req, res, next, listGovernanceBoardPacks);
export const createBoardPack = (req, res, next) => createResponse(req, res, next, createGovernanceBoardPack);
export const updateBoardPack = (req, res, next) => updateResponse(req, res, next, updateGovernanceBoardPack, 'Governance board pack no encontrado');
export const finalizeBoardPack = (req, res, next) => updateResponse(req, res, next, (org, id, _body, currentActor) => finalizeGovernanceBoardPack(org, id, currentActor), 'Governance board pack no encontrado');

export const listCommittees = (req, res, next) => listResponse(req, res, next, listGovernanceCommittees);
export const createCommittee = (req, res, next) => createResponse(req, res, next, createGovernanceCommittee);
export const updateCommittee = (req, res, next) => updateResponse(req, res, next, updateGovernanceCommittee, 'Governance committee no encontrado');

export const listPolicies = (req, res, next) => listResponse(req, res, next, listGovernancePolicies);
export const createPolicy = (req, res, next) => createResponse(req, res, next, createGovernancePolicy);
export const updatePolicy = (req, res, next) => updateResponse(req, res, next, updateGovernancePolicy, 'Governance policy no encontrada');

export const listActions = (req, res, next) => listResponse(req, res, next, listGovernanceActionItems);
export const createAction = (req, res, next) => createResponse(req, res, next, createGovernanceActionItem);
export const updateAction = (req, res, next) => updateResponse(req, res, next, updateGovernanceActionItem, 'Governance action no encontrada');
export const completeAction = (req, res, next) => updateResponse(req, res, next, completeGovernanceActionItem, 'Governance action no encontrada');

export const listMeetings = (req, res, next) => listResponse(req, res, next, listGovernanceMeetings);
export const createMeeting = (req, res, next) => createResponse(req, res, next, createGovernanceMeeting);
export const updateMeeting = (req, res, next) => updateResponse(req, res, next, updateGovernanceMeeting, 'Governance meeting no encontrada');
export const finalizeMeetingMinutes = (req, res, next) => updateResponse(req, res, next, (org, id, _body, currentActor) => finalizeGovernanceMeetingMinutes(org, id, currentActor), 'Governance meeting no encontrada');

export const listReports = (req, res, next) => listResponse(req, res, next, listGovernanceReports);
export const createReport = (req, res, next) => createResponse(req, res, next, generateGovernanceReport);

export const listAuditTrail = (req, res, next) =>
  listGovernanceAuditLogs(scope(req).organizationId, req.query || {})
    .then((items) => ok(res, { items, total: items.length }))
    .catch(next);

export const listControls = (req, res, next) => listResponse(req, res, next, listGovernanceControls);
export const createControl = (req, res, next) => createResponse(req, res, next, createGovernanceControl);
export const updateControl = (req, res, next) => updateResponse(req, res, next, updateGovernanceControl, 'Governance control no encontrado');
export const listEsgMetrics = (req, res, next) => listResponse(req, res, next, listGovernanceEsgMetrics);
export const createEsgMetric = (req, res, next) => createResponse(req, res, next, createGovernanceEsgMetric);
export const updateEsgMetric = (req, res, next) => updateResponse(req, res, next, updateGovernanceEsgMetric, 'Governance ESG metric no encontrada');
