import {
  createBridgeCounterparty,
  createBridgeDocument,
  createBridgeDependency,
  createBridgeEvidenceLink,
  createBridgeConflict,
  createBridgeSignal,
  createBridgeSnapshot,
  createBridgeIntroduction,
  createBridgeOpportunity,
  createBridgeOpportunityFromFundingRound,
  createBridgeOpportunityFromMaDeal,
  createBridgeReport,
  dismissBridgeSignal,
  deleteBridgeCounterparty,
  deleteBridgeOpportunity,
  generateEnterpriseBridgeReport,
  generateBridgeNetworkReport,
  getEnterpriseBridgeDashboard,
  getEnterpriseBridgeSummary,
  listBridgeAuditLogs,
  getBridgeExecutiveHubBrief,
  getBridgeMatches,
  listBridgeAttentionQueue,
  listBridgeCounterparties,
  listBridgeConflicts,
  listBridgeDependencies,
  listBridgeDocuments,
  listBridgeEvidenceLinks,
  listBridgeIntroductions,
  listBridgeOpportunities,
  listBridgeReports,
  listBridgeSignals,
  listBridgeSnapshots,
  markBridgeSignalInReview,
  recalculateEnterpriseBridge,
  resolveBridgeSignal,
  acknowledgeBridgeSignal,
  updateBridgeCounterparty,
  updateBridgeDependency,
  updateBridgeConflict,
  updateBridgeDocument,
  updateBridgeEvidenceLink,
  updateBridgeOpportunity,
  updateBridgeSignal
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
    userId: req.user?.id || '',
    role: req.user?.role || req.role || 'viewer'
  };
}

const actor = (req) => ({ userId: scope(req).userId, role: scope(req).role });

async function listResponse(req, res, next, loader) {
  try {
    const items = await loader(scope(req).organizationId);
    return ok(res, { items, total: items.length });
  } catch (error) {
    return next(error);
  }
}

async function createResponse(req, res, next, creator) {
  try {
    const currentScope = scope(req);
    return created(res, await creator(currentScope.organizationId, req.body, actor(req)));
  } catch (error) {
    return next(error);
  }
}

async function updateResponse(req, res, next, updater, message) {
  try {
    const currentScope = scope(req);
    const item = await updater(currentScope.organizationId, req.params.id, req.body, actor(req));
    if (!item) return notFound(res, message);
    return ok(res, item);
  } catch (error) {
    return next(error);
  }
}

export const getDashboard = (req, res, next) =>
  getEnterpriseBridgeDashboard(scope(req)).then((data) => ok(res, data)).catch(next);

export const getSummary = (req, res, next) =>
  getEnterpriseBridgeSummary(scope(req)).then((data) => ok(res, data)).catch(next);

export const recalculate = (req, res, next) =>
  recalculateEnterpriseBridge(scope(req)).then((data) => ok(res, data)).catch(next);

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

export const listSignals = (req, res, next) => listResponse(req, res, next, listBridgeSignals);
export const createSignal = (req, res, next) => createResponse(req, res, next, createBridgeSignal);
export const updateSignal = (req, res, next) => updateResponse(req, res, next, updateBridgeSignal, 'Bridge signal no encontrada');

async function signalWorkflow(req, res, next, runner) {
  try {
    const currentScope = scope(req);
    const item = await runner(currentScope.organizationId, req.params.id, actor(req), req.body || {});
    if (!item) return notFound(res, 'Bridge signal no encontrada');
    return ok(res, item);
  } catch (error) {
    return next(error);
  }
}

export const acknowledgeSignal = (req, res, next) => signalWorkflow(req, res, next, acknowledgeBridgeSignal);
export const markSignalInReview = (req, res, next) => signalWorkflow(req, res, next, markBridgeSignalInReview);
export const resolveSignal = (req, res, next) => signalWorkflow(req, res, next, resolveBridgeSignal);
export const dismissSignal = (req, res, next) => signalWorkflow(req, res, next, dismissBridgeSignal);

export const listDependencies = (req, res, next) => listResponse(req, res, next, listBridgeDependencies);
export const createDependency = (req, res, next) => createResponse(req, res, next, createBridgeDependency);
export const updateDependency = (req, res, next) => updateResponse(req, res, next, updateBridgeDependency, 'Bridge dependency no encontrada');

export const listConflicts = (req, res, next) => listResponse(req, res, next, listBridgeConflicts);
export const createConflict = (req, res, next) => createResponse(req, res, next, createBridgeConflict);
export const updateConflict = (req, res, next) => updateResponse(req, res, next, updateBridgeConflict, 'Bridge conflict no encontrado');

export const listAttentionQueue = (req, res, next) => listResponse(req, res, next, listBridgeAttentionQueue);

export const listEvidenceLinks = (req, res, next) => listResponse(req, res, next, listBridgeEvidenceLinks);
export const createEvidenceLink = (req, res, next) => createResponse(req, res, next, createBridgeEvidenceLink);
export const updateEvidenceLink = (req, res, next) => updateResponse(req, res, next, updateBridgeEvidenceLink, 'Bridge evidence link no encontrado');

export const listSnapshots = (req, res, next) => listResponse(req, res, next, listBridgeSnapshots);
export const createSnapshot = (req, res, next) => createResponse(req, res, next, createBridgeSnapshot);

export async function createEnterpriseReport(req, res, next) {
  try {
    const currentScope = scope(req);
    return created(res, await generateEnterpriseBridgeReport(currentScope.organizationId, req.body || {}, actor(req)));
  } catch (error) {
    return next(error);
  }
}
