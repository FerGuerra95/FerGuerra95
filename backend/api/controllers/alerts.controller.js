import {
  listAlerts as listService,
  getAlertById as getService,
  createAlert as createService,
  updateAlert as updateService,
  deleteAlert as deleteService
} from '../../services/compliance/alerts.service.js';

const ok = (res, data, meta = {}) =>
  res.json({
    data,
    meta,
    error: null
  });

const created = (res, data, meta = {}) =>
  res.status(201).json({
    data,
    meta,
    error: null
  });

const notFound = (res) =>
  res.status(404).json({
    data: null,
    meta: {},
    error: {
      message: 'Alerta no encontrada'
    }
  });

function getRequestScope(req) {
  return {
    organizationId: req.organizationId || req.user?.organizationId || '',
    userId: req.user?.id || ''
  };
}

export async function listAlerts(req, res, next) {
  try {
    const scope = getRequestScope(req);

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

    const result = await deleteService(req.params.id, {
      organizationId: scope.organizationId
    });

    return ok(res, result);
  } catch (error) {
    return next(error);
  }
}