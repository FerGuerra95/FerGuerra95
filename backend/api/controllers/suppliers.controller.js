import {
  listSuppliers as listService,
  getSupplierById as getService,
  createSupplier as createService,
  updateSupplier as updateService,
  deleteSupplier as deleteService
} from '../../services/compliance/suppliers.service.js';

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

function notFound(res, message = 'Proveedor no encontrado') {
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

export async function listSuppliers(req, res, next) {
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

export async function createSupplier(req, res, next) {
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

export async function getSupplierById(req, res, next) {
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

export async function updateSupplier(req, res, next) {
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

export async function deleteSupplier(req, res, next) {
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