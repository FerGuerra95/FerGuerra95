import {
  createBridgeCounterparty,
  createBridgeDocument,
  createBridgeIntroduction,
  createBridgeOpportunity,
  createBridgeOpportunityFromFundingRound,
  createBridgeOpportunityFromMaDeal,
  createBridgeReport,
  deleteBridgeCounterparty,
  deleteBridgeOpportunity,
  generateBridgeNetworkReport,
  listBridgeAuditLogs,
  getBridgeExecutiveHubBrief,
  getBridgeMatches,
  listBridgeCounterparties,
  listBridgeDocuments,
  listBridgeIntroductions,
  listBridgeOpportunities,
  listBridgeReports,
  updateBridgeCounterparty,
  updateBridgeDocument,
  updateBridgeOpportunity
} from '../../services/bridge/bridge.service.js';

function meta(extra = {}) {
  return { timestamp: new Date().toISOString(), ...extra };
}

function ok(res, data) {
  return res.json({ data, meta: meta(), error: null });
}

function created(res, data) {
  return res.status(201).json({ data, meta: meta(), error: null });
}

function notFound(res, message = 'Recurso no encontrado') {
  return res.status(404).json({
    data: null,
    meta: meta(),
    error: { code: 'NOT_FOUND', message }
  });
}

function scope(req) {
  return {
    organizationId: req.organizationId || req.user?.organizationId || '',
    userId: req.user?.id || ''
  };
}

export async function listOpportunities(req, res, next) {
  try {
    return ok(res, { items: await listBridgeOpportunities(scope(req).organizationId) });
  } catch (error) {
    return next(error);
  }
}

export async function createOpportunity(req, res, next) {
  try {
    const currentScope = scope(req);
    return created(
      res,
      await createBridgeOpportunity(currentScope.organizationId, req.body, {
        userId: currentScope.userId
      })
    );
  } catch (error) {
    return next(error);
  }
}

export async function updateOpportunity(req, res, next) {
  try {
    const currentScope = scope(req);
    const item = await updateBridgeOpportunity(
      currentScope.organizationId,
      req.params.id,
      req.body,
      { userId: currentScope.userId }
    );
    if (!item) return notFound(res, 'Bridge opportunity no encontrada');
    return ok(res, item);
  } catch (error) {
    return next(error);
  }
}

export async function deleteOpportunity(req, res, next) {
  try {
    const currentScope = scope(req);
    const result = await deleteBridgeOpportunity(
      currentScope.organizationId,
      req.params.id,
      { userId: currentScope.userId }
    );
    if (!result.deleted) return notFound(res, 'Bridge opportunity no encontrada');
    return ok(res, result);
  } catch (error) {
    return next(error);
  }
}

export async function createFromMaDeal(req, res, next) {
  try {
    const currentScope = scope(req);
    return created(
      res,
      await createBridgeOpportunityFromMaDeal(
        currentScope.organizationId,
        req.params.dealId,
        { userId: currentScope.userId }
      )
    );
  } catch (error) {
    return next(error);
  }
}

export async function createFromFundingRound(req, res, next) {
  try {
    const currentScope = scope(req);
    return created(
      res,
      await createBridgeOpportunityFromFundingRound(
        currentScope.organizationId,
        req.params.roundId,
        { userId: currentScope.userId }
      )
    );
  } catch (error) {
    return next(error);
  }
}

export async function listCounterparties(req, res, next) {
  try {
    return ok(res, { items: await listBridgeCounterparties(scope(req).organizationId) });
  } catch (error) {
    return next(error);
  }
}

export async function createCounterparty(req, res, next) {
  try {
    const currentScope = scope(req);
    return created(
      res,
      await createBridgeCounterparty(currentScope.organizationId, req.body, {
        userId: currentScope.userId
      })
    );
  } catch (error) {
    return next(error);
  }
}

export async function updateCounterparty(req, res, next) {
  try {
    const currentScope = scope(req);
    const item = await updateBridgeCounterparty(
      currentScope.organizationId,
      req.params.id,
      req.body,
      { userId: currentScope.userId }
    );
    if (!item) return notFound(res, 'Bridge counterparty no encontrada');
    return ok(res, item);
  } catch (error) {
    return next(error);
  }
}

export async function deleteCounterparty(req, res, next) {
  try {
    const currentScope = scope(req);
    const result = await deleteBridgeCounterparty(
      currentScope.organizationId,
      req.params.id,
      { userId: currentScope.userId }
    );
    if (!result.deleted) return notFound(res, 'Bridge counterparty no encontrada');
    return ok(res, result);
  } catch (error) {
    return next(error);
  }
}

export async function listIntroductions(req, res, next) {
  try {
    return ok(res, {
      items: await listBridgeIntroductions(scope(req).organizationId, req.query.opportunityId)
    });
  } catch (error) {
    return next(error);
  }
}

export async function createIntroduction(req, res, next) {
  try {
    const currentScope = scope(req);
    return created(
      res,
      await createBridgeIntroduction(currentScope.organizationId, req.body, {
        userId: currentScope.userId
      })
    );
  } catch (error) {
    return next(error);
  }
}

export async function listDocuments(req, res, next) {
  try {
    return ok(res, { items: await listBridgeDocuments(scope(req).organizationId) });
  } catch (error) {
    return next(error);
  }
}

export async function createDocument(req, res, next) {
  try {
    const currentScope = scope(req);
    return created(
      res,
      await createBridgeDocument(currentScope.organizationId, req.body, {
        userId: currentScope.userId
      })
    );
  } catch (error) {
    return next(error);
  }
}

export async function updateDocument(req, res, next) {
  try {
    const currentScope = scope(req);
    const item = await updateBridgeDocument(
      currentScope.organizationId,
      req.params.id,
      req.body,
      { userId: currentScope.userId }
    );
    if (!item) return notFound(res, 'Bridge document no encontrado');
    return ok(res, item);
  } catch (error) {
    return next(error);
  }
}

export async function listReports(req, res, next) {
  try {
    return ok(res, { items: await listBridgeReports(scope(req).organizationId) });
  } catch (error) {
    return next(error);
  }
}

export async function createReport(req, res, next) {
  try {
    const currentScope = scope(req);
    return created(
      res,
      await createBridgeReport(currentScope.organizationId, req.body, {
        userId: currentScope.userId
      })
    );
  } catch (error) {
    return next(error);
  }
}

export async function generateReport(req, res, next) {
  try {
    const currentScope = scope(req);
    return created(res, await generateBridgeNetworkReport(currentScope, req.body || {}));
  } catch (error) {
    return next(error);
  }
}

export async function listAuditTrail(req, res, next) {
  try {
    return ok(res, {
      items: await listBridgeAuditLogs(scope(req).organizationId, {
        action: req.query?.action || '',
        entityId: req.query?.entityId || '',
        limit: req.query?.limit || 100
      })
    });
  } catch (error) {
    return next(error);
  }
}

export async function getMatches(req, res, next) {
  try {
    const items = await getBridgeMatches(scope(req).organizationId, req.params.id);
    if (!items) return notFound(res, 'Bridge opportunity no encontrada');
    return ok(res, { items });
  } catch (error) {
    return next(error);
  }
}

export async function getHubOverview(req, res, next) {
  try {
    return ok(res, await getBridgeExecutiveHubBrief({ organizationId: scope(req).organizationId }));
  } catch (error) {
    return next(error);
  }
}
