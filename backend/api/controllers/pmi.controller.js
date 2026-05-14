import {
  createPmiCase,
  createPmiCaseFromMaDeal,
  deletePmiCase,
  duplicatePmiCase,
  getPmiCaseById,
  getPmiExecutiveHubBrief,
  listPmiAuditLogs,
  listPmiCases,
  updatePmiCase
} from '../../services/pmi/pmi.service.js';

function buildMeta(extra = {}) {
  return {
    timestamp: new Date().toISOString(),
    ...extra
  };
}

function ok(res, data, meta = {}) {
  return res.json({
    data,
    meta: buildMeta(meta),
    error: null
  });
}

function created(res, data, meta = {}) {
  return res.status(201).json({
    data,
    meta: buildMeta(meta),
    error: null
  });
}

function notFound(res, message = 'Recurso no encontrado') {
  return res.status(404).json({
    data: null,
    meta: buildMeta(),
    error: {
      code: 'NOT_FOUND',
      message
    }
  });
}

function getScope(req) {
  return {
    organizationId: req.organizationId || req.user?.organizationId || '',
    userId: req.user?.id || ''
  };
}

export async function listCases(req, res, next) {
  try {
    const scope = getScope(req);
    const items = await listPmiCases(scope.organizationId);
    return ok(res, {
      items,
      total: items.length
    });
  } catch (error) {
    return next(error);
  }
}

export async function createCase(req, res, next) {
  try {
    const scope = getScope(req);
    const item = await createPmiCase(scope.organizationId, req.body, {
      userId: scope.userId
    });
    return created(res, item);
  } catch (error) {
    return next(error);
  }
}

export async function createCaseFromMaDeal(req, res, next) {
  try {
    const scope = getScope(req);
    const item = await createPmiCaseFromMaDeal(scope.organizationId, req.params.dealId, {
      userId: scope.userId
    });
    return created(res, item);
  } catch (error) {
    return next(error);
  }
}

export async function duplicateCase(req, res, next) {
  try {
    const scope = getScope(req);
    const item = await duplicatePmiCase(scope.organizationId, req.params.id, {
      userId: scope.userId
    });
    if (!item) return notFound(res, 'PMI case no encontrado');
    return created(res, item);
  } catch (error) {
    return next(error);
  }
}

export async function getCaseById(req, res, next) {
  try {
    const scope = getScope(req);
    const item = await getPmiCaseById(scope.organizationId, req.params.id);
    if (!item) return notFound(res, 'PMI case no encontrado');
    return ok(res, item);
  } catch (error) {
    return next(error);
  }
}

export async function updateCase(req, res, next) {
  try {
    const scope = getScope(req);
    const item = await updatePmiCase(scope.organizationId, req.params.id, req.body, {
      userId: scope.userId
    });
    if (!item) return notFound(res, 'PMI case no encontrado');
    return ok(res, item);
  } catch (error) {
    return next(error);
  }
}

export async function deleteCase(req, res, next) {
  try {
    const scope = getScope(req);
    const result = await deletePmiCase(scope.organizationId, req.params.id, {
      userId: scope.userId
    });
    if (!result.deleted) return notFound(res, 'PMI case no encontrado');
    return ok(res, result);
  } catch (error) {
    return next(error);
  }
}

export async function listAuditLogs(req, res, next) {
  try {
    const scope = getScope(req);
    const items = await listPmiAuditLogs(scope.organizationId, {
      caseId: req.query.caseId,
      limit: req.query.limit
    });

    return ok(res, {
      items,
      total: items.length
    });
  } catch (error) {
    return next(error);
  }
}

export async function getExecutiveHubBrief(req, res, next) {
  try {
    const scope = getScope(req);
    const item = await getPmiExecutiveHubBrief({
      organizationId: scope.organizationId
    });
    return ok(res, item);
  } catch (error) {
    return next(error);
  }
}
