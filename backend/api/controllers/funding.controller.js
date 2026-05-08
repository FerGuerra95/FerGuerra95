import {
  buildFundingLedgerExport,
  createFundingSnapshot,
  getFundingExecutiveHubBrief,
  getFundingSnapshotById,
  listFundingSnapshots
} from '../../services/funding/enterprise.service.js';
import {
  createForOrganization,
  deleteForOrganization,
  getByIdForOrganization,
  getFundingSummary,
  listByOrganization,
  updateForOrganization
} from '../../services/funding/funding.service.js';

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

function forbidden(res, message = 'Scope de organizacion no valido.') {
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
    forbidden(res, 'Usuario sin organizacion asignada.');
    return false;
  }

  if (!scope.userId) {
    forbidden(res, 'Usuario no identificado.');
    return false;
  }

  return true;
}

export async function listSnapshots(req, res, next) {
  try {
    const scope = getRequestScope(req);

    if (!validateScope(res, scope)) return null;

    const items = await listFundingSnapshots({
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

export async function getSnapshotById(req, res, next) {
  try {
    const scope = getRequestScope(req);

    if (!validateScope(res, scope)) return null;

    const item = await getFundingSnapshotById(req.params.id, {
      organizationId: scope.organizationId
    });

    if (!item) return notFound(res, 'Funding snapshot no encontrado');

    return ok(res, item);
  } catch (error) {
    return next(error);
  }
}

export async function createSnapshot(req, res, next) {
  try {
    const scope = getRequestScope(req);

    if (!validateScope(res, scope)) return null;

    const item = await createFundingSnapshot({
      ...req.body,
      organizationId: scope.organizationId,
      userId: scope.userId
    });

    return created(res, item);
  } catch (error) {
    return next(error);
  }
}

export async function exportSnapshotLedger(req, res, next) {
  try {
    const scope = getRequestScope(req);

    if (!validateScope(res, scope)) return null;

    const item = await buildFundingLedgerExport(req.params.id, {
      organizationId: scope.organizationId
    });

    if (!item) return notFound(res, 'Funding ledger no encontrado');

    return ok(res, item);
  } catch (error) {
    return next(error);
  }
}

export async function getHubOverview(req, res, next) {
  try {
    const scope = getRequestScope(req);

    if (!validateScope(res, scope)) return null;

    const item = await getFundingExecutiveHubBrief({
      organizationId: scope.organizationId
    });

    return ok(res, item);
  } catch (error) {
    return next(error);
  }
}

export async function listRounds(req, res, next) {
  try {
    const scope = getRequestScope(req);
    if (!validateScope(res, scope)) return null;

    const items = await listByOrganization(scope.organizationId, req.query || {});

    return ok(res, {
      items,
      total: items.length
    });
  } catch (error) {
    return next(error);
  }
}

export async function createRound(req, res, next) {
  try {
    const scope = getRequestScope(req);
    if (!validateScope(res, scope)) return null;

    const item = await createForOrganization(scope.organizationId, req.body, {
      userId: scope.userId
    });

    return created(res, item);
  } catch (error) {
    return next(error);
  }
}

export async function getRoundById(req, res, next) {
  try {
    const scope = getRequestScope(req);
    if (!validateScope(res, scope)) return null;

    const item = await getByIdForOrganization(scope.organizationId, req.params.id);
    if (!item) return notFound(res, 'Funding round no encontrada');

    return ok(res, item);
  } catch (error) {
    return next(error);
  }
}

export async function updateRound(req, res, next) {
  try {
    const scope = getRequestScope(req);
    if (!validateScope(res, scope)) return null;

    const item = await updateForOrganization(
      scope.organizationId,
      req.params.id,
      req.body,
      {
        userId: scope.userId
      }
    );

    if (!item) return notFound(res, 'Funding round no encontrada');

    return ok(res, item);
  } catch (error) {
    return next(error);
  }
}

export async function deleteRound(req, res, next) {
  try {
    const scope = getRequestScope(req);
    if (!validateScope(res, scope)) return null;

    const result = await deleteForOrganization(
      scope.organizationId,
      req.params.id,
      {
        userId: scope.userId
      }
    );

    if (!result?.deleted) return notFound(res, 'Funding round no encontrada');

    return ok(res, result);
  } catch (error) {
    return next(error);
  }
}

export async function getRoundSummary(req, res, next) {
  try {
    const scope = getRequestScope(req);
    if (!validateScope(res, scope)) return null;

    const summary = await getFundingSummary(scope.organizationId, {
      userId: scope.userId
    });

    return ok(res, summary);
  } catch (error) {
    return next(error);
  }
}
