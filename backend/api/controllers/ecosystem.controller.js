import {
  createEcosystemRecord,
  deleteEcosystemRecord,
  getEcosystemExecutiveHubBrief,
  getEcosystemRecordById,
  listEcosystemRecords,
  updateEcosystemRecord
} from '../../services/ecosystem/ecosystem.service.js';

function meta(extra = {}) {
  return {
    timestamp: new Date().toISOString(),
    ...extra
  };
}

function ok(res, data) {
  return res.json({
    data,
    meta: meta(),
    error: null
  });
}

function created(res, data) {
  return res.status(201).json({
    data,
    meta: meta(),
    error: null
  });
}

function notFound(res, message = 'Recurso no encontrado') {
  return res.status(404).json({
    data: null,
    meta: meta(),
    error: {
      code: 'NOT_FOUND',
      message
    }
  });
}

function scope(req) {
  return {
    organizationId: req.organizationId || req.user?.organizationId || '',
    userId: req.user?.id || ''
  };
}

export async function listRecords(req, res, next) {
  try {
    const currentScope = scope(req);
    const items = await listEcosystemRecords(
      currentScope.organizationId,
      req.params.branch
    );
    return ok(res, {
      items,
      total: items.length
    });
  } catch (error) {
    return next(error);
  }
}

export async function createRecord(req, res, next) {
  try {
    const currentScope = scope(req);
    const item = await createEcosystemRecord(
      currentScope.organizationId,
      req.params.branch,
      req.body,
      { userId: currentScope.userId }
    );
    return created(res, item);
  } catch (error) {
    return next(error);
  }
}

export async function getRecordById(req, res, next) {
  try {
    const currentScope = scope(req);
    const item = await getEcosystemRecordById(
      currentScope.organizationId,
      req.params.branch,
      req.params.id
    );
    if (!item) return notFound(res, 'Ecosystem record no encontrado');
    return ok(res, item);
  } catch (error) {
    return next(error);
  }
}

export async function updateRecord(req, res, next) {
  try {
    const currentScope = scope(req);
    const item = await updateEcosystemRecord(
      currentScope.organizationId,
      req.params.branch,
      req.params.id,
      req.body,
      { userId: currentScope.userId }
    );
    if (!item) return notFound(res, 'Ecosystem record no encontrado');
    return ok(res, item);
  } catch (error) {
    return next(error);
  }
}

export async function deleteRecord(req, res, next) {
  try {
    const currentScope = scope(req);
    const result = await deleteEcosystemRecord(
      currentScope.organizationId,
      req.params.branch,
      req.params.id,
      { userId: currentScope.userId }
    );
    if (!result.deleted) return notFound(res, 'Ecosystem record no encontrado');
    return ok(res, result);
  } catch (error) {
    return next(error);
  }
}

export async function getExecutiveHubBrief(req, res, next) {
  try {
    const currentScope = scope(req);
    const item = await getEcosystemExecutiveHubBrief({
      organizationId: currentScope.organizationId
    });
    return ok(res, item);
  } catch (error) {
    return next(error);
  }
}
