import {
  createKriMetric,
  createRisk,
  createRiskAppetite,
  createRiskControl,
  createRiskIncident,
  createRiskMitigation,
  createRiskReport,
  getRiskBridgeSignals,
  getRiskDashboard,
  getRiskSummary,
  listControls,
  listIncidents,
  listKriMetrics,
  listMitigations,
  listRiskAppetite,
  listRiskAuditLogs,
  listRiskReports,
  listRisks,
  updateKriMetric,
  updateRisk,
  updateRiskAppetite,
  updateRiskControl,
  updateRiskIncident,
  updateRiskMitigation
} from '../../services/risk/risk.service.js';

function buildMeta(extra = {}) {
  return { timestamp: new Date().toISOString(), ...extra };
}

function ok(res, data, meta = {}) {
  return res.json({ data, meta: buildMeta(meta), error: null });
}

function created(res, data, meta = {}) {
  return res.status(201).json({ data, meta: buildMeta(meta), error: null });
}

function notFound(res, message = 'Recurso no encontrado') {
  return res.status(404).json({
    data: null,
    meta: buildMeta(),
    error: { code: 'NOT_FOUND', message }
  });
}

function getScope(req) {
  return {
    organizationId: req.organizationId || req.user?.organizationId || '',
    userId: req.user?.id || '',
    role: req.user?.role || req.role || 'viewer'
  };
}

function actor(req) {
  const scope = getScope(req);
  return { userId: scope.userId, role: scope.role };
}

async function listResponse(req, res, next, loader) {
  try {
    const items = await loader(getScope(req).organizationId);
    return ok(res, { items, total: items.length });
  } catch (error) {
    return next(error);
  }
}

async function createResponse(req, res, next, creator) {
  try {
    const scope = getScope(req);
    return created(res, await creator(scope.organizationId, req.body, actor(req)));
  } catch (error) {
    return next(error);
  }
}

async function updateResponse(req, res, next, updater, message) {
  try {
    const scope = getScope(req);
    const item = await updater(scope.organizationId, req.params.id, req.body, actor(req));
    if (!item) return notFound(res, message);
    return ok(res, item);
  } catch (error) {
    return next(error);
  }
}

export const getDashboard = (req, res, next) =>
  getRiskDashboard(getScope(req)).then((data) => ok(res, data)).catch(next);

export const getSummary = (req, res, next) =>
  getRiskSummary(getScope(req)).then((data) => ok(res, data)).catch(next);

export const getBridgeSignals = (req, res, next) =>
  getRiskBridgeSignals(getScope(req)).then((data) => ok(res, data)).catch(next);

export const listRegister = (req, res, next) => listResponse(req, res, next, listRisks);
export const createRegister = (req, res, next) => createResponse(req, res, next, createRisk);
export const updateRegister = (req, res, next) => updateResponse(req, res, next, updateRisk, 'Risk no encontrado');

export const listControlLibrary = (req, res, next) => listResponse(req, res, next, listControls);
export const createControl = (req, res, next) => createResponse(req, res, next, createRiskControl);
export const updateControl = (req, res, next) => updateResponse(req, res, next, updateRiskControl, 'Control no encontrado');

export const listMitigationPlans = (req, res, next) => listResponse(req, res, next, listMitigations);
export const createMitigation = (req, res, next) => createResponse(req, res, next, createRiskMitigation);
export const updateMitigation = (req, res, next) => updateResponse(req, res, next, updateRiskMitigation, 'Mitigacion no encontrada');

export const listIncidentLog = (req, res, next) => listResponse(req, res, next, listIncidents);
export const createIncident = (req, res, next) => createResponse(req, res, next, createRiskIncident);
export const updateIncident = (req, res, next) => updateResponse(req, res, next, updateRiskIncident, 'Incidente no encontrado');

export const listKri = (req, res, next) => listResponse(req, res, next, listKriMetrics);
export const createKri = (req, res, next) => createResponse(req, res, next, createKriMetric);
export const updateKri = (req, res, next) => updateResponse(req, res, next, updateKriMetric, 'KRI no encontrado');

export const listAppetite = (req, res, next) => listResponse(req, res, next, listRiskAppetite);
export const createAppetite = (req, res, next) => createResponse(req, res, next, createRiskAppetite);
export const updateAppetite = (req, res, next) => updateResponse(req, res, next, updateRiskAppetite, 'Risk appetite no encontrado');

export const listReports = (req, res, next) => listResponse(req, res, next, listRiskReports);
export const createReport = (req, res, next) => createResponse(req, res, next, createRiskReport);

export async function listAuditTrail(req, res, next) {
  try {
    const items = await listRiskAuditLogs(getScope(req).organizationId, { limit: req.query?.limit });
    return ok(res, { items, total: items.length });
  } catch (error) {
    return next(error);
  }
}
