import {
  createPmiCase,
  createPmiCaseFromMaDeal,
  deletePmiCase,
  duplicatePmiCase,
  createPmiDayOneItem,
  createPmiHundredDayItem,
  createPmiMilestone,
  createPmiOperatingModelItem,
  createPmiPeopleCultureItem,
  createPmiProgram,
  createPmiRisk,
  createPmiSynergy,
  createPmiTechnologyItem,
  createPmiTransitionService,
  generatePmiReport,
  getPmiBridgeSignals,
  getPmiDashboard,
  getPmiCaseById,
  getPmiExecutiveHubBrief,
  getPmiProgramById,
  getPmiSummary,
  listPmiDayOneItems,
  listPmiHundredDayItems,
  listPmiAuditLogs,
  listPmiCases,
  listPmiMilestones,
  listPmiOperatingModelItems,
  listPmiPeopleCultureItems,
  listPmiPrograms,
  listPmiReports,
  listPmiRisks,
  listPmiSynergies,
  listPmiTechnologyItems,
  listPmiTransitionServices,
  updatePmiCase,
  updatePmiDayOneItem,
  updatePmiHundredDayItem,
  updatePmiMilestone,
  updatePmiOperatingModelItem,
  updatePmiPeopleCultureItem,
  updatePmiProgram,
  updatePmiRisk,
  updatePmiSynergy,
  updatePmiTechnologyItem,
  updatePmiTransitionService
} from '../../services/pmi/pmi.service.js';

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

function getScope(req) {
  return {
    organizationId: req.organizationId || req.user?.organizationId || '',
    userId: req.user?.id || '',
    role: req.user?.role || req.role || 'viewer'
  };
}

function actor(req) {
  const scope = getScope(req);
  return { userId: scope.userId, role: scope.role };
}

async function listResponse(req, res, next, loader) {
  try {
    const scope = getScope(req);
    const items = await loader(scope.organizationId);
    return ok(res, { items, total: items.length });
  } catch (error) {
    return next(error);
  }
}

async function createResponse(req, res, next, creator) {
  try {
    const scope = getScope(req);
    return created(res, await creator(scope.organizationId, req.body, actor(req)));
  } catch (error) {
    return next(error);
  }
}

async function updateResponse(req, res, next, updater, message) {
  try {
    const scope = getScope(req);
    const item = await updater(scope.organizationId, req.params.id, req.body, actor(req));
    if (!item) return notFound(res, message);
    return ok(res, item);
  } catch (error) {
    return next(error);
  }
}

export const getDashboard = (req, res, next) =>
  getPmiDashboard(getScope(req)).then((data) => ok(res, data)).catch(next);

export const getSummary = (req, res, next) =>
  getPmiSummary(getScope(req)).then((data) => ok(res, data)).catch(next);

export const getBridgeSignals = (req, res, next) =>
  getPmiBridgeSignals(getScope(req)).then((data) => ok(res, data)).catch(next);

export async function listCases(req, res, next) {
  try {
    const scope = getScope(req);
    const items = await listPmiCases(scope.organizationId);
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
    const scope = getScope(req);
    const item = await createPmiCase(scope.organizationId, req.body, actor(req));
    return created(res, item);
  } catch (error) {
    return next(error);
  }
}

export async function createCaseFromMaDeal(req, res, next) {
  try {
    const scope = getScope(req);
    const item = await createPmiCaseFromMaDeal(scope.organizationId, req.params.dealId, actor(req));
    return created(res, item);
  } catch (error) {
    return next(error);
  }
}

export async function duplicateCase(req, res, next) {
  try {
    const scope = getScope(req);
    const item = await duplicatePmiCase(scope.organizationId, req.params.id, actor(req));
    if (!item) return notFound(res, 'PMI case no encontrado');
    return created(res, item);
  } catch (error) {
    return next(error);
  }
}

export async function getCaseById(req, res, next) {
  try {
    const scope = getScope(req);
    const item = await getPmiCaseById(scope.organizationId, req.params.id);
    if (!item) return notFound(res, 'PMI case no encontrado');
    return ok(res, item);
  } catch (error) {
    return next(error);
  }
}

export async function updateCase(req, res, next) {
  try {
    const scope = getScope(req);
    const item = await updatePmiCase(scope.organizationId, req.params.id, req.body, actor(req));
    if (!item) return notFound(res, 'PMI case no encontrado');
    return ok(res, item);
  } catch (error) {
    return next(error);
  }
}

export async function deleteCase(req, res, next) {
  try {
    const scope = getScope(req);
    const result = await deletePmiCase(scope.organizationId, req.params.id, actor(req));
    if (!result.deleted) return notFound(res, 'PMI case no encontrado');
    return ok(res, result);
  } catch (error) {
    return next(error);
  }
}

export async function listAuditLogs(req, res, next) {
  try {
    const scope = getScope(req);
    const items = await listPmiAuditLogs(scope.organizationId, {
      caseId: req.query.caseId,
      limit: req.query.limit
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
    const scope = getScope(req);
    const item = await getPmiExecutiveHubBrief({
      organizationId: scope.organizationId
    });
    return ok(res, item);
  } catch (error) {
    return next(error);
  }
}

export const listPrograms = (req, res, next) => listResponse(req, res, next, listPmiPrograms);
export const createProgram = (req, res, next) => createResponse(req, res, next, createPmiProgram);
export const updateProgram = (req, res, next) => updateResponse(req, res, next, updatePmiProgram, 'PMI program no encontrado');

export async function getProgramById(req, res, next) {
  try {
    const item = await getPmiProgramById(getScope(req).organizationId, req.params.id);
    if (!item) return notFound(res, 'PMI program no encontrado');
    return ok(res, item);
  } catch (error) {
    return next(error);
  }
}

export const listSynergies = (req, res, next) => listResponse(req, res, next, listPmiSynergies);
export const createSynergy = (req, res, next) => createResponse(req, res, next, createPmiSynergy);
export const updateSynergy = (req, res, next) => updateResponse(req, res, next, updatePmiSynergy, 'PMI synergy no encontrada');

export const listMilestones = (req, res, next) => listResponse(req, res, next, listPmiMilestones);
export const createMilestone = (req, res, next) => createResponse(req, res, next, createPmiMilestone);
export const updateMilestone = (req, res, next) => updateResponse(req, res, next, updatePmiMilestone, 'PMI milestone no encontrado');

export const listRisks = (req, res, next) => listResponse(req, res, next, listPmiRisks);
export const createRisk = (req, res, next) => createResponse(req, res, next, createPmiRisk);
export const updateRisk = (req, res, next) => updateResponse(req, res, next, updatePmiRisk, 'PMI risk no encontrado');

export const listDayOne = (req, res, next) => listResponse(req, res, next, listPmiDayOneItems);
export const createDayOne = (req, res, next) => createResponse(req, res, next, createPmiDayOneItem);
export const updateDayOne = (req, res, next) => updateResponse(req, res, next, updatePmiDayOneItem, 'PMI Day 1 item no encontrado');

export const listHundredDay = (req, res, next) => listResponse(req, res, next, listPmiHundredDayItems);
export const createHundredDay = (req, res, next) => createResponse(req, res, next, createPmiHundredDayItem);
export const updateHundredDay = (req, res, next) => updateResponse(req, res, next, updatePmiHundredDayItem, 'PMI 100-day item no encontrado');

export const listTransitionServices = (req, res, next) => listResponse(req, res, next, listPmiTransitionServices);
export const createTransitionService = (req, res, next) => createResponse(req, res, next, createPmiTransitionService);
export const updateTransitionService = (req, res, next) => updateResponse(req, res, next, updatePmiTransitionService, 'PMI TSA item no encontrado');

export const listOperatingModel = (req, res, next) => listResponse(req, res, next, listPmiOperatingModelItems);
export const createOperatingModel = (req, res, next) => createResponse(req, res, next, createPmiOperatingModelItem);
export const updateOperatingModel = (req, res, next) => updateResponse(req, res, next, updatePmiOperatingModelItem, 'PMI operating model item no encontrado');

export const listPeopleCulture = (req, res, next) => listResponse(req, res, next, listPmiPeopleCultureItems);
export const createPeopleCulture = (req, res, next) => createResponse(req, res, next, createPmiPeopleCultureItem);
export const updatePeopleCulture = (req, res, next) => updateResponse(req, res, next, updatePmiPeopleCultureItem, 'PMI people/culture item no encontrado');

export const listTechnology = (req, res, next) => listResponse(req, res, next, listPmiTechnologyItems);
export const createTechnology = (req, res, next) => createResponse(req, res, next, createPmiTechnologyItem);
export const updateTechnology = (req, res, next) => updateResponse(req, res, next, updatePmiTechnologyItem, 'PMI technology item no encontrado');

export const listReports = (req, res, next) => listResponse(req, res, next, listPmiReports);
export const createReport = (req, res, next) => createResponse(req, res, next, generatePmiReport);
