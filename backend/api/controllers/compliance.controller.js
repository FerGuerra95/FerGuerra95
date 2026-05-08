import {
  buildComplianceAuditLedgerExport,
  getComplianceAuditRunById,
  listComplianceAuditRuns,
  listComplianceMaRiskImpacts,
  runComplianceAudit
} from '../../services/compliance/auditRuns.service.js';
import { getExecutiveComplianceHubBrief } from '../../services/compliance/executiveHub.service.js';

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

export async function listAuditRuns(req, res, next) {
  try {
    const scope = getRequestScope(req);

    if (!validateScope(res, scope)) return null;

    const items = await listComplianceAuditRuns({
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

export async function getAuditRunById(req, res, next) {
  try {
    const scope = getRequestScope(req);

    if (!validateScope(res, scope)) return null;

    const item = await getComplianceAuditRunById(req.params.id, {
      organizationId: scope.organizationId
    });

    if (!item) return notFound(res, 'Compliance audit run no encontrado');

    return ok(res, item);
  } catch (error) {
    return next(error);
  }
}

export async function exportAuditRunLedger(req, res, next) {
  try {
    const scope = getRequestScope(req);

    if (!validateScope(res, scope)) return null;

    const item = await buildComplianceAuditLedgerExport(req.params.id, {
      organizationId: scope.organizationId
    });

    if (!item) return notFound(res, 'Compliance audit ledger no encontrado');

    return ok(res, item);
  } catch (error) {
    return next(error);
  }
}

export async function createAuditRun(req, res, next) {
  try {
    const scope = getRequestScope(req);

    if (!validateScope(res, scope)) return null;

    const item = await runComplianceAudit({
      ...req.body,
      organizationId: scope.organizationId,
      userId: scope.userId
    });

    return created(res, item);
  } catch (error) {
    return next(error);
  }
}

export async function listMaRiskImpacts(req, res, next) {
  try {
    const scope = getRequestScope(req);

    if (!validateScope(res, scope)) return null;

    const items = await listComplianceMaRiskImpacts({
      organizationId: scope.organizationId,
      maCaseId: req.query?.maCaseId || ''
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
    const scope = getRequestScope(req);

    if (!validateScope(res, scope)) return null;

    const item = await getExecutiveComplianceHubBrief({
      organizationId: scope.organizationId
    });

    return ok(res, item);
  } catch (error) {
    return next(error);
  }
}
