import {
  createHeritageAsset,
  createHeritageDocument,
  createHeritageProtection,
  createHeritageReport,
  createHeritageSuccession,
  deleteHeritageAsset,
  deleteHeritageProtection,
  deleteHeritageSuccession,
  generateHeritageContinuityReport,
  getHeritageBridgeSignals,
  getHeritageDashboard,
  getHeritageExecutiveHubBrief,
  getHeritageSummary,
  listHeritageAuditLogs,
  listHeritageAssets,
  listHeritageDocuments,
  listHeritageProtections,
  listHeritageReports,
  listHeritageSuccessions,
  updateHeritageAsset,
  updateHeritageDocument,
  updateHeritageProtection,
  updateHeritageSuccession
} from '../../services/heritage/heritage.service.js';

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
    userId: req.user?.id || ''
  };
}

export async function listAssets(req, res, next) {
  try {
    return ok(res, { items: await listHeritageAssets(scope(req).organizationId) });
  } catch (error) {
    return next(error);
  }
}

export async function getDashboard(req, res, next) {
  try {
    return ok(res, await getHeritageDashboard(scope(req)));
  } catch (error) {
    return next(error);
  }
}

export async function getSummary(req, res, next) {
  try {
    return ok(res, await getHeritageSummary(scope(req)));
  } catch (error) {
    return next(error);
  }
}

export async function getBridgeSignals(req, res, next) {
  try {
    return ok(res, await getHeritageBridgeSignals(scope(req)));
  } catch (error) {
    return next(error);
  }
}

export async function createAsset(req, res, next) {
  try {
    const currentScope = scope(req);
    return created(res, await createHeritageAsset(currentScope.organizationId, req.body, { userId: currentScope.userId }));
  } catch (error) {
    return next(error);
  }
}

export async function updateAsset(req, res, next) {
  try {
    const currentScope = scope(req);
    const item = await updateHeritageAsset(currentScope.organizationId, req.params.id, req.body, { userId: currentScope.userId });
    if (!item) return notFound(res, 'Heritage asset no encontrado');
    return ok(res, item);
  } catch (error) {
    return next(error);
  }
}

export async function deleteAsset(req, res, next) {
  try {
    const currentScope = scope(req);
    const result = await deleteHeritageAsset(currentScope.organizationId, req.params.id, { userId: currentScope.userId });
    if (!result.deleted) return notFound(res, 'Heritage asset no encontrado');
    return ok(res, result);
  } catch (error) {
    return next(error);
  }
}

export async function listSuccessions(req, res, next) {
  try {
    return ok(res, { items: await listHeritageSuccessions(scope(req).organizationId) });
  } catch (error) {
    return next(error);
  }
}

export async function createSuccession(req, res, next) {
  try {
    const currentScope = scope(req);
    return created(res, await createHeritageSuccession(currentScope.organizationId, req.body, { userId: currentScope.userId }));
  } catch (error) {
    return next(error);
  }
}

export async function updateSuccession(req, res, next) {
  try {
    const currentScope = scope(req);
    const item = await updateHeritageSuccession(currentScope.organizationId, req.params.id, req.body, { userId: currentScope.userId });
    if (!item) return notFound(res, 'Heritage succession no encontrada');
    return ok(res, item);
  } catch (error) {
    return next(error);
  }
}

export async function deleteSuccession(req, res, next) {
  try {
    const currentScope = scope(req);
    const result = await deleteHeritageSuccession(currentScope.organizationId, req.params.id, { userId: currentScope.userId });
    if (!result.deleted) return notFound(res, 'Heritage succession no encontrada');
    return ok(res, result);
  } catch (error) {
    return next(error);
  }
}

export async function listProtections(req, res, next) {
  try {
    return ok(res, { items: await listHeritageProtections(scope(req).organizationId) });
  } catch (error) {
    return next(error);
  }
}

export async function createProtection(req, res, next) {
  try {
    const currentScope = scope(req);
    return created(res, await createHeritageProtection(currentScope.organizationId, req.body, { userId: currentScope.userId }));
  } catch (error) {
    return next(error);
  }
}

export async function updateProtection(req, res, next) {
  try {
    const currentScope = scope(req);
    const item = await updateHeritageProtection(currentScope.organizationId, req.params.id, req.body, { userId: currentScope.userId });
    if (!item) return notFound(res, 'Heritage protection no encontrada');
    return ok(res, item);
  } catch (error) {
    return next(error);
  }
}

export async function deleteProtection(req, res, next) {
  try {
    const currentScope = scope(req);
    const result = await deleteHeritageProtection(currentScope.organizationId, req.params.id, { userId: currentScope.userId });
    if (!result.deleted) return notFound(res, 'Heritage protection no encontrada');
    return ok(res, result);
  } catch (error) {
    return next(error);
  }
}

export async function listDocuments(req, res, next) {
  try {
    return ok(res, { items: await listHeritageDocuments(scope(req).organizationId) });
  } catch (error) {
    return next(error);
  }
}

export async function createDocument(req, res, next) {
  try {
    const currentScope = scope(req);
    return created(res, await createHeritageDocument(currentScope.organizationId, req.body, { userId: currentScope.userId }));
  } catch (error) {
    return next(error);
  }
}

export async function updateDocument(req, res, next) {
  try {
    const currentScope = scope(req);
    const item = await updateHeritageDocument(currentScope.organizationId, req.params.id, req.body, { userId: currentScope.userId });
    if (!item) return notFound(res, 'Heritage document no encontrado');
    return ok(res, item);
  } catch (error) {
    return next(error);
  }
}

export async function listReports(req, res, next) {
  try {
    return ok(res, { items: await listHeritageReports(scope(req).organizationId) });
  } catch (error) {
    return next(error);
  }
}

export async function createReport(req, res, next) {
  try {
    const currentScope = scope(req);
    return created(res, await createHeritageReport(currentScope.organizationId, req.body, { userId: currentScope.userId }));
  } catch (error) {
    return next(error);
  }
}

export async function generateReport(req, res, next) {
  try {
    const currentScope = scope(req);
    return created(res, await generateHeritageContinuityReport(currentScope, req.body || {}));
  } catch (error) {
    return next(error);
  }
}

export async function listAuditTrail(req, res, next) {
  try {
    return ok(res, {
      items: await listHeritageAuditLogs(scope(req).organizationId, {
        action: req.query?.action || '',
        entityId: req.query?.entityId || '',
        limit: req.query?.limit || 100
      })
    });
  } catch (error) {
    return next(error);
  }
}

export async function getHubOverview(req, res, next) {
  try {
    return ok(res, await getHeritageExecutiveHubBrief({ organizationId: scope(req).organizationId }));
  } catch (error) {
    return next(error);
  }
}
