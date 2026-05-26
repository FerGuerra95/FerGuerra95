import {
  archiveBoardReviewSnapshot,
  createBoardReviewSnapshot,
  createBoardPack,
  createEnterpriseReport,
  createReportEvidence,
  createReportExport,
  createReportSchedule,
  createReportTemplate,
  createReportVersion,
  getBoardReviewSnapshot,
  getReportingDashboard,
  getReportingSummary,
  listBoardReviewSnapshots,
  listBoardPacks,
  listEnterpriseReports,
  listReportEvidence,
  listReportExports,
  listReportSchedules,
  listReportTemplates,
  listReportVersions,
  listReportingAuditLogs,
  markBoardReviewInternalFinal,
  markBoardReviewReviewed,
  revokeBoardReviewSnapshot
} from '../../services/reporting/reporting.service.js';

function meta(extra = {}) { return { timestamp: new Date().toISOString(), ...extra }; }
function ok(res, data) { return res.json({ data, meta: meta(), error: null }); }
function created(res, data) { return res.status(201).json({ data, meta: meta(), error: null }); }

function scope(req) {
  return {
    organizationId: req.organizationId || req.user?.organizationId || '',
    userId: req.user?.id || '',
    role: req.user?.role || req.role || 'viewer'
  };
}

function actor(req) {
  const current = scope(req);
  return { userId: current.userId, role: current.role };
}

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
    const current = scope(req);
    return created(res, await creator(current.organizationId, req.body, actor(req)));
  } catch (error) {
    return next(error);
  }
}

export const getDashboard = (req, res, next) =>
  getReportingDashboard(scope(req)).then((data) => ok(res, data)).catch(next);
export const getSummary = (req, res, next) =>
  getReportingSummary(scope(req)).then((data) => ok(res, data)).catch(next);

export const listReports = (req, res, next) => listResponse(req, res, next, listEnterpriseReports);
export const createReport = (req, res, next) => createResponse(req, res, next, createEnterpriseReport);
export const listTemplates = (req, res, next) => listResponse(req, res, next, listReportTemplates);
export const createTemplate = (req, res, next) => createResponse(req, res, next, createReportTemplate);
export const listVersions = (req, res, next) => listResponse(req, res, next, listReportVersions);
export const createVersion = (req, res, next) => createResponse(req, res, next, createReportVersion);
export const listExports = (req, res, next) => listResponse(req, res, next, listReportExports);
export const createExport = (req, res, next) => createResponse(req, res, next, createReportExport);
export const listSchedules = (req, res, next) => listResponse(req, res, next, listReportSchedules);
export const createSchedule = (req, res, next) => createResponse(req, res, next, createReportSchedule);
export const listEvidence = (req, res, next) => listResponse(req, res, next, listReportEvidence);
export const createEvidence = (req, res, next) => createResponse(req, res, next, createReportEvidence);
export const listBoardPack = (req, res, next) => listResponse(req, res, next, listBoardPacks);
export const createBoardPackReport = (req, res, next) => createResponse(req, res, next, createBoardPack);

export async function listBoardReviewSnapshotRecords(req, res, next) {
  try {
    const current = scope(req);
    const items = await listBoardReviewSnapshots({
      organizationId: current.organizationId,
      filters: { status: req.query?.status }
    });
    return ok(res, { items, total: items.length });
  } catch (error) {
    return next(error);
  }
}

export async function getBoardReviewSnapshotRecord(req, res, next) {
  try {
    const current = scope(req);
    const item = await getBoardReviewSnapshot({
      organizationId: current.organizationId,
      snapshotId: req.params.id
    });
    return ok(res, item);
  } catch (error) {
    return next(error);
  }
}

export async function createBoardReviewSnapshotRecord(req, res, next) {
  try {
    const current = scope(req);
    const item = await createBoardReviewSnapshot({
      organizationId: current.organizationId,
      actor: actor(req),
      payload: req.body
    });
    return created(res, item);
  } catch (error) {
    return next(error);
  }
}

export async function markBoardReviewSnapshotReviewed(req, res, next) {
  try {
    const current = scope(req);
    const item = await markBoardReviewReviewed({
      organizationId: current.organizationId,
      snapshotId: req.params.id,
      actor: actor(req),
      reviewMetadata: req.body?.reviewMetadata || req.body || {}
    });
    return ok(res, item);
  } catch (error) {
    return next(error);
  }
}

export async function markBoardReviewSnapshotInternalFinal(req, res, next) {
  try {
    const current = scope(req);
    const item = await markBoardReviewInternalFinal({
      organizationId: current.organizationId,
      snapshotId: req.params.id,
      actor: actor(req),
      approvalMetadata: req.body?.approvalMetadata || req.body || {}
    });
    return ok(res, item);
  } catch (error) {
    return next(error);
  }
}

export async function archiveBoardReviewSnapshotRecord(req, res, next) {
  try {
    const current = scope(req);
    const item = await archiveBoardReviewSnapshot({
      organizationId: current.organizationId,
      snapshotId: req.params.id,
      actor: actor(req)
    });
    return ok(res, item);
  } catch (error) {
    return next(error);
  }
}

export async function revokeBoardReviewSnapshotRecord(req, res, next) {
  try {
    const current = scope(req);
    const item = await revokeBoardReviewSnapshot({
      organizationId: current.organizationId,
      snapshotId: req.params.id,
      actor: actor(req)
    });
    return ok(res, item);
  } catch (error) {
    return next(error);
  }
}

export async function listAuditTrail(req, res, next) {
  try {
    const items = await listReportingAuditLogs(scope(req).organizationId, { limit: req.query?.limit });
    return ok(res, { items, total: items.length });
  } catch (error) {
    return next(error);
  }
}
