import {
  createStrategicInitiative,
  createStrategicMarketNote,
  createStrategicObjective,
  createStrategicRisk,
  createStrategicScenario,
  createStrategyReport,
  getStrategyDashboard,
  getStrategySummary,
  listStrategicInitiatives,
  listStrategicMarketNotes,
  listStrategicObjectives,
  listStrategicRisks,
  listStrategicScenarios,
  listStrategyAuditLogs,
  listStrategyReports,
  updateStrategicInitiative,
  updateStrategicObjective
} from '../../services/strategy/strategy.service.js';

function ok(res, data) { return res.json({ data, meta: { timestamp: new Date().toISOString() }, error: null }); }
function created(res, data) { return res.status(201).json({ data, meta: { timestamp: new Date().toISOString() }, error: null }); }
function notFound(res, message = 'Recurso no encontrado') { return res.status(404).json({ data: null, meta: { timestamp: new Date().toISOString() }, error: { code: 'NOT_FOUND', message } }); }
function scope(req) { return { organizationId: req.organizationId || req.user?.organizationId || '', userId: req.user?.id || '', role: req.user?.role || req.role || 'viewer' }; }
function actor(req) { const current = scope(req); return { userId: current.userId, role: current.role }; }

async function listResponse(req, res, next, loader) {
  try {
    const items = await loader(scope(req).organizationId);
    return ok(res, { items, total: items.length });
  } catch (error) { return next(error); }
}

async function createResponse(req, res, next, creator) {
  try {
    const current = scope(req);
    return created(res, await creator(current.organizationId, req.body, actor(req)));
  } catch (error) { return next(error); }
}

async function updateResponse(req, res, next, updater, message) {
  try {
    const current = scope(req);
    const item = await updater(current.organizationId, req.params.id, req.body, actor(req));
    if (!item) return notFound(res, message);
    return ok(res, item);
  } catch (error) { return next(error); }
}

export const getDashboard = (req, res, next) => getStrategyDashboard(scope(req)).then((data) => ok(res, data)).catch(next);
export const getSummary = (req, res, next) => getStrategySummary(scope(req)).then((data) => ok(res, data)).catch(next);
export const listObjectives = (req, res, next) => listResponse(req, res, next, listStrategicObjectives);
export const createObjective = (req, res, next) => createResponse(req, res, next, createStrategicObjective);
export const updateObjective = (req, res, next) => updateResponse(req, res, next, updateStrategicObjective, 'Objetivo no encontrado');
export const listInitiatives = (req, res, next) => listResponse(req, res, next, listStrategicInitiatives);
export const createInitiative = (req, res, next) => createResponse(req, res, next, createStrategicInitiative);
export const updateInitiative = (req, res, next) => updateResponse(req, res, next, updateStrategicInitiative, 'Iniciativa no encontrada');
export const listScenarios = (req, res, next) => listResponse(req, res, next, listStrategicScenarios);
export const createScenario = (req, res, next) => createResponse(req, res, next, createStrategicScenario);
export const listMarketNotes = (req, res, next) => listResponse(req, res, next, listStrategicMarketNotes);
export const createMarketNote = (req, res, next) => createResponse(req, res, next, createStrategicMarketNote);
export const listRisks = (req, res, next) => listResponse(req, res, next, listStrategicRisks);
export const createRisk = (req, res, next) => createResponse(req, res, next, createStrategicRisk);
export const listReports = (req, res, next) => listResponse(req, res, next, listStrategyReports);
export const createReport = (req, res, next) => createResponse(req, res, next, createStrategyReport);
export async function listAuditTrail(req, res, next) {
  try {
    const items = await listStrategyAuditLogs(scope(req).organizationId, { limit: req.query?.limit });
    return ok(res, { items, total: items.length });
  } catch (error) { return next(error); }
}
