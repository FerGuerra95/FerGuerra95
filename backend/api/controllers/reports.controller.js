import {
  createMaReport,
  listMaReports
} from '../../services/ma/reports.service.js';

import {
  listReports as listComplianceReports,
  getReportById,
  createComplianceReport,
  updateComplianceReport as updateComplianceReportService,
  deleteComplianceReport as deleteComplianceReportService
} from '../../services/compliance/reports.service.js';

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
      message: 'Informe no encontrado'
    }
  });

function getRequestScope(req) {
  return {
    organizationId: req.organizationId || req.user?.organizationId || '',
    userId: req.user?.id || ''
  };
}

export async function listReports(req, res, next) {
  try {
    const scope = getRequestScope(req);
    const type = req.query.type || 'all';

    const ma =
      type === 'compliance'
        ? []
        : await listMaReports({
            organizationId: scope.organizationId
          });

    const compliance =
      type === 'ma'
        ? []
        : await listComplianceReports({
            organizationId: scope.organizationId
          });

    const items = [...ma, ...compliance];

    return ok(res, {
      items,
      total: items.length
    });
  } catch (error) {
    return next(error);
  }
}

export async function generateMaReport(req, res, next) {
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

export async function generateComplianceReport(req, res, next) {
  try {
    const scope = getRequestScope(req);

    const item = await createComplianceReport({
      ...req.body,
      organizationId: scope.organizationId,
      userId: scope.userId
    });

    return created(res, item);
  } catch (error) {
    return next(error);
  }
}

export async function getComplianceReportById(req, res, next) {
  try {
    const scope = getRequestScope(req);

    const item = await getReportById(req.params.id, {
      organizationId: scope.organizationId
    });

    if (!item) return notFound(res);

    return ok(res, item);
  } catch (error) {
    return next(error);
  }
}

export async function updateComplianceReport(req, res, next) {
  try {
    const scope = getRequestScope(req);

    const item = await updateComplianceReportService(
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

export async function deleteComplianceReport(req, res, next) {
  try {
    const scope = getRequestScope(req);

    const result = await deleteComplianceReportService(req.params.id, {
      organizationId: scope.organizationId
    });

    return ok(res, result);
  } catch (error) {
    return next(error);
  }
}