import {
  listMaCases,
  getMaCaseById,
  createMaCase,
  updateMaCase,
  deleteMaCase,
  addMaSnapshot
} from '../../services/ma/cases.service.js';

import {
  createMaReport,
  listMaReports
} from '../../services/ma/reports.service.js';

function ok(res, data, meta = {}) {
  return res.json({
    data,
    meta,
    error: null
  });
}

function created(res, data, meta = {}) {
  return res.status(201).json({
    data,
    meta,
    error: null
  });
}

function notFound(res, message = 'Recurso no encontrado') {
  return res.status(404).json({
    data: null,
    meta: {},
    error: {
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

export async function listCases(req, res, next) {
  try {
    const scope = getRequestScope(req);

    const items = await listMaCases({
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

export async function createCase(req, res, next) {
  try {
    const scope = getRequestScope(req);

    const item = await createMaCase({
      ...req.body,
      organizationId: scope.organizationId,
      userId: scope.userId
    });

    return created(res, item);
  } catch (error) {
    return next(error);
  }
}

export async function getCaseById(req, res, next) {
  try {
    const scope = getRequestScope(req);

    const item = await getMaCaseById(req.params.id, {
      organizationId: scope.organizationId
    });

    if (!item) return notFound(res, 'Caso M&A no encontrado');

    return ok(res, item);
  } catch (error) {
    return next(error);
  }
}

export async function updateCase(req, res, next) {
  try {
    const scope = getRequestScope(req);

    const item = await updateMaCase(
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

    if (!item) return notFound(res, 'Caso M&A no encontrado');

    return ok(res, item);
  } catch (error) {
    return next(error);
  }
}

export async function deleteCase(req, res, next) {
  try {
    const scope = getRequestScope(req);

    const result = await deleteMaCase(req.params.id, {
      organizationId: scope.organizationId
    });

    return ok(res, result);
  } catch (error) {
    return next(error);
  }
}

export async function runValuation(req, res, next) {
  try {
    const scope = getRequestScope(req);
    const { caseId, snapshot } = req.body || {};

    if (caseId) {
      const item = await addMaSnapshot(
        caseId,
        {
          ...(snapshot || req.body),
          organizationId: scope.organizationId,
          userId: scope.userId
        },
        {
          organizationId: scope.organizationId
        }
      );

      if (!item) {
        return notFound(res, 'Caso M&A no encontrado para guardar snapshot');
      }

      return ok(res, item, {
        action: 'snapshot_saved'
      });
    }

    return ok(res, {
      snapshot: {
        ...req.body,
        id: `snapshot_${Date.now()}`,
        organizationId: scope.organizationId,
        userId: scope.userId,
        createdAt: new Date().toISOString()
      }
    });
  } catch (error) {
    return next(error);
  }
}

export async function listReports(req, res, next) {
  try {
    const scope = getRequestScope(req);

    const items = await listMaReports({
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

export async function exportReport(req, res, next) {
  try {
    const scope = getRequestScope(req);

    const item = await createMaReport({
      ...req.body,
      organizationId: scope.organizationId,
      userId: scope.userId
    });

    return created(res, item);
  } catch (error) {
    return next(error);
  }
}