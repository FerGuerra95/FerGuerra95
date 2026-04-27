import {
  listEvidence as listService,
  getEvidenceById as getService,
  createEvidence as createService,
  updateEvidence as updateService,
  deleteEvidence as deleteService
} from '../../services/compliance/evidence.service.js';

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
      message: 'Evidencia no encontrada'
    }
  });

function getRequestScope(req) {
  return {
    organizationId: req.organizationId || req.user?.organizationId || '',
    userId: req.user?.id || ''
  };
}

export async function listEvidence(req, res, next) {
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

export async function createEvidence(req, res, next) {
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

export async function getEvidenceById(req, res, next) {
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

export async function updateEvidence(req, res, next) {
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

export async function deleteEvidence(req, res, next) {
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