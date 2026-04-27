import {
  listAlerts as listService,
  getAlertById as getService,
  createAlert as createService,
  updateAlert as updateService,
  deleteAlert as deleteService
} from '../../services/compliance/alerts.service.js';

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

function notFound(res, message = 'Alerta no encontrada') {
  return res.status(404).json({
    data: null,
    meta: buildMeta(),
    error: {
      code: 'NOT_FOUND',
      message
    }
  });
}

function forbidden(res, message = 'Scope de organización no válido.') {
  return res.status(403).json({
    data: null,
    meta: buildMeta(),
    error: {
      code: 'INVALID_SCOPE',
      message
    }
  });
}

function getRequestScope(req) {
  return {
    organizationId: req.organizationId || req.user?.organizationId || '',
    userId: req.user?.id || ''
  };
}

function validateScope(res, scope) {
  if (!scope.organizationId) {
    forbidden(res, 'Usuario sin organización asignada.');
    return false;
  }

  if (!scope.userId) {
    forbidden(res, 'Usuario no identificado.');
    return false;
  }

  return true;
}

export async function listAlerts(req, res, next) {
  try {
    const scope = getRequestScope(req);

    if (!validateScope(res, scope)) return null;

    const items = await listService({
      organizationId: scope.organizationId
    });

    return ok(res, {
      items,
      total: items.length
    });
  } catch (error) {
    return next(error);
  }
}

export async function createAlert(req, res, next) {
  try {
    const scope = getRequestScope(req);

    if (!validateScope(res, scope)) return null;

    const item = await createService({
      ...req.body,
      organizationId: scope.organizationId,
      userId: scope.userId
    });

    return created(res, item);
  } catch (error) {
    return next(error);
  }
}

export async function getAlertById(req, res, next) {
  try {
    const scope = getRequestScope(req);

    if (!validateScope(res, scope)) return null;

    const item = await getService(req.params.id, {
      organizationId: scope.organizationId
    });

    if (!item) return notFound(res);

    return ok(res, item);
  } catch (error) {
    return next(error);
  }
}

export async function updateAlert(req, res, next) {
  try {
    const scope = getRequestScope(req);

    if (!validateScope(res, scope)) return null;

    const item = await updateService(
      req.params.id,
      {
        ...req.body,
        organizationId: scope.organizationId,
        userId: scope.userId
      },
      {
        organizationId: scope.organizationId
      }
    );

    if (!item) return notFound(res);

    return ok(res, item);
  } catch (error) {
    return next(error);
  }
}

export async function scanAlerts(req, res, next) {
  try {
    const scope = getRequestScope(req);

    if (!validateScope(res, scope)) return null;

    const item = await createService({
      ...req.body,
      title: req.body?.title || 'Alerta generada por scan',
      source: req.body?.source || 'Backend scan',
      status: 'open',
      organizationId: scope.organizationId,
      userId: scope.userId
    });

    return created(res, item, {
      action: 'scan_created_demo_alert'
    });
  } catch (error) {
    return next(error);
  }
}

export async function updateAlertStatus(req, res, next) {
  try {
    const scope = getRequestScope(req);

    if (!validateScope(res, scope)) return null;

    const item = await updateService(
      req.params.id,
      {
        status: req.body?.status || 'in_review',
        organizationId: scope.organizationId,
        userId: scope.userId
      },
      {
        organizationId: scope.organizationId
      }
    );

    if (!item) return notFound(res);

    return ok(res, item);
  } catch (error) {
    return next(error);
  }
}

export async function deleteAlert(req, res, next) {
  try {
    const scope = getRequestScope(req);

    if (!validateScope(res, scope)) return null;

    const result = await deleteService(req.params.id, {
      organizationId: scope.organizationId
    });

    if (!result || result.deleted === false) {
      return notFound(res);
    }

    return ok(res, result);
  } catch (error) {
    return next(error);
  }
}