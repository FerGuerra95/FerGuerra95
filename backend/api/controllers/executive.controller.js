import {
  createBoardViewFromOverview,
  createExecutiveReportFromOverview,
  createSnapshotFromOverview,
  getExecutiveBoardView,
  getExecutiveCalendar,
  getExecutiveDecisionQueue,
  getExecutiveOverview,
  getExecutiveReadiness,
  getExecutiveSignals,
  getExecutiveSummary
} from '../../services/executive/executiveOverview.service.js';
import {
  createExecutiveSignal,
  listExecutiveSignals,
  updateExecutiveSignal
} from '../../services/executive/executiveSignals.service.js';
import { listExecutiveReports } from '../../services/executive/executiveReports.service.js';

function ok(res, data) {
  return res.json({ data, meta: { timestamp: new Date().toISOString() }, error: null });
}

function created(res, data) {
  return res.status(201).json({ data, meta: { timestamp: new Date().toISOString() }, error: null });
}

function notFound(res, message = 'Recurso no encontrado') {
  return res.status(404).json({ data: null, meta: { timestamp: new Date().toISOString() }, error: { code: 'NOT_FOUND', message } });
}

function scope(req) {
  return {
    organizationId: req.organizationId || req.user?.organizationId || '',
    userId: req.user?.id || '',
    role: req.user?.role || req.role || 'viewer'
  };
}

function actor(req) {
  const current = scope(req);
  return { userId: current.userId, role: current.role };
}

export const getOverview = (req, res, next) => getExecutiveOverview(scope(req)).then((data) => ok(res, data)).catch(next);
export const getSummary = (req, res, next) => getExecutiveSummary(scope(req)).then((data) => ok(res, data)).catch(next);
export const getReadiness = (req, res, next) => getExecutiveReadiness(scope(req)).then((data) => ok(res, data)).catch(next);
export const getSignals = (req, res, next) => getExecutiveSignals(scope(req)).then((data) => ok(res, { items: data, total: data.length })).catch(next);
export const getDecisionQueue = (req, res, next) => getExecutiveDecisionQueue(scope(req)).then((data) => ok(res, { items: data, total: data.length })).catch(next);
export const getBoardView = (req, res, next) => getExecutiveBoardView(scope(req)).then((data) => ok(res, data)).catch(next);
export const getCalendar = (req, res, next) => getExecutiveCalendar(scope(req)).then((data) => ok(res, { items: data, total: data.length })).catch(next);

export async function listPersistedSignals(req, res, next) {
  try {
    const items = await listExecutiveSignals(scope(req).organizationId);
    return ok(res, { generated: await getExecutiveSignals(scope(req)), persisted: items, items, total: items.length });
  } catch (error) {
    return next(error);
  }
}

export async function createSignal(req, res, next) {
  try {
    return created(res, await createExecutiveSignal(scope(req).organizationId, req.body, actor(req)));
  } catch (error) {
    return next(error);
  }
}

export async function updateSignal(req, res, next) {
  try {
    const item = await updateExecutiveSignal(scope(req).organizationId, req.params.id, req.body, actor(req));
    if (!item) return notFound(res, 'Executive signal no encontrada');
    return ok(res, item);
  } catch (error) {
    return next(error);
  }
}

export async function listReports(req, res, next) {
  try {
    const items = await listExecutiveReports(scope(req).organizationId);
    return ok(res, { items, total: items.length });
  } catch (error) {
    return next(error);
  }
}

export const createReport = (req, res, next) => createExecutiveReportFromOverview(scope(req), req.body).then((data) => created(res, data)).catch(next);
export const createSnapshot = (req, res, next) => createSnapshotFromOverview(scope(req), req.body).then((data) => created(res, data)).catch(next);
export const createBoardView = (req, res, next) => createBoardViewFromOverview(scope(req), req.body).then((data) => created(res, data)).catch(next);
