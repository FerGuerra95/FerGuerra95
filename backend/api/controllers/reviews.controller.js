import {
  listReviews as listService,
  getReviewById as getService,
  createReviewDecision as createService,
  updateReviewDecision as updateService,
  deleteReviewDecision as deleteService,
  decideReview as decideService
} from '../../services/compliance/reviews.service.js';

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
      message: 'Revisión no encontrada'
    }
  });

function getRequestScope(req) {
  return {
    organizationId: req.organizationId || req.user?.organizationId || '',
    userId: req.user?.id || ''
  };
}

export async function listReviews(req, res, next) {
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

export async function createReviewDecision(req, res, next) {
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

export async function getReviewById(req, res, next) {
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

export async function updateReviewDecision(req, res, next) {
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

export async function decideReview(req, res, next) {
  try {
    const scope = getRequestScope(req);

    const item = await decideService(
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

export async function deleteReviewDecision(req, res, next) {
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