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
import {
  createMaSecureShareLink,
  getMaSecureShare,
  listMaSecureShares,
  revokeMaSecureShare
} from '../../services/ma/secureShare.service.js';
import {
  createMaDataRoomFileDocument,
  createMaDataRoomDocument,
  getMaDataRoomFileDownload,
  listMaDataRoomDocuments,
  markSecureShareDataRoomDocumentRevoked,
  registerSecureShareDataRoomDocument,
  updateMaDataRoomDocumentGovernance
} from '../../services/ma/dataRoom.service.js';
import {
  createMaDeal,
  deleteMaDeal,
  listMaDeals,
  updateMaDeal
} from '../../services/ma/deals.service.js';
import {
  listAuditLogs,
  recordAuditLog
} from '../../services/audit/auditLog.service.js';

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

function forbidden(res, message = 'Scope de organización no válido.') {
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
    userId: req.user?.id || '',
    role: req.role || req.user?.role || 'viewer'
  };
}

function decodeHeaderValue(value = '') {
  const text = String(value || '').trim();

  if (!text) return '';

  try {
    return decodeURIComponent(text);
  } catch (_error) {
    return text;
  }
}

function getHeader(req, name) {
  return decodeHeaderValue(req.get(name) || '');
}

function buildDownloadFileName(value = 'document.bin') {
  return String(value || 'document.bin').replace(/["\r\n]/g, '_');
}

function validateScope(res, scope) {
  if (!scope.organizationId) {
    forbidden(res, 'Usuario sin organización asignada.');
    return false;
  }

  if (!scope.userId) {
    forbidden(res, 'Usuario no identificado.');
    return false;
  }

  return true;
}

async function auditMaAction(scope, action, entityId = '', metadata = {}) {
  return recordAuditLog({
    organizationId: scope.organizationId,
    userId: scope.userId,
    action,
    entityType: 'ma',
    entityId,
    metadata
  });
}

export async function listCases(req, res, next) {
  try {
    const scope = getRequestScope(req);

    if (!validateScope(res, scope)) return null;

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

    if (!validateScope(res, scope)) return null;

    const item = await createMaCase({
      ...req.body,
      organizationId: scope.organizationId,
      userId: scope.userId
    });

    await auditMaAction(scope, 'ma.case.created', item.id, {
      name: item.name,
      status: item.status
    });

    return created(res, item);
  } catch (error) {
    return next(error);
  }
}

export async function getCaseById(req, res, next) {
  try {
    const scope = getRequestScope(req);

    if (!validateScope(res, scope)) return null;

    const item = await getMaCaseById(req.params.id, {
      organizationId: scope.organizationId
    });

    if (!item) return notFound(res, 'Caso M&A no encontrado');

    await auditMaAction(scope, 'ma.case.accessed', item.id);

    return ok(res, item);
  } catch (error) {
    return next(error);
  }
}

export async function updateCase(req, res, next) {
  try {
    const scope = getRequestScope(req);

    if (!validateScope(res, scope)) return null;

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

    await auditMaAction(scope, 'ma.case.updated', item.id, {
      name: item.name,
      status: item.status
    });

    return ok(res, item);
  } catch (error) {
    return next(error);
  }
}

export async function deleteCase(req, res, next) {
  try {
    const scope = getRequestScope(req);

    if (!validateScope(res, scope)) return null;

    const result = await deleteMaCase(req.params.id, {
      organizationId: scope.organizationId
    });

    if (!result || result.deleted === false) {
      return notFound(res, 'Caso M&A no encontrado');
    }

    await auditMaAction(scope, 'ma.case.deleted', req.params.id);

    return ok(res, result);
  } catch (error) {
    return next(error);
  }
}

export async function runValuation(req, res, next) {
  try {
    const scope = getRequestScope(req);

    if (!validateScope(res, scope)) return null;

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

      await auditMaAction(scope, 'ma.snapshot.created', item.id, {
        caseId
      });

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

    if (!validateScope(res, scope)) return null;

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

export async function listDeals(req, res, next) {
  try {
    const scope = getRequestScope(req);

    if (!validateScope(res, scope)) return null;

    const items = await listMaDeals({
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

export async function createDeal(req, res, next) {
  try {
    const scope = getRequestScope(req);

    if (!validateScope(res, scope)) return null;

    const item = await createMaDeal({
      ...req.body,
      organizationId: scope.organizationId,
      userId: scope.userId
    });

    await auditMaAction(scope, 'ma.deal.created', item.id, {
      caseId: item.caseId,
      name: item.name,
      stage: item.stage,
      status: item.status
    });

    return created(res, item);
  } catch (error) {
    return next(error);
  }
}

export async function updateDeal(req, res, next) {
  try {
    const scope = getRequestScope(req);

    if (!validateScope(res, scope)) return null;

    const item = await updateMaDeal(
      req.params.id,
      {
        ...req.body,
        userId: scope.userId
      },
      {
        organizationId: scope.organizationId
      }
    );

    if (!item) return notFound(res, 'Deal M&A no encontrado');

    await auditMaAction(scope, 'ma.deal.updated', item.id, {
      caseId: item.caseId,
      name: item.name,
      stage: item.stage,
      status: item.status
    });

    return ok(res, item);
  } catch (error) {
    return next(error);
  }
}

export async function deleteDeal(req, res, next) {
  try {
    const scope = getRequestScope(req);

    if (!validateScope(res, scope)) return null;

    const result = await deleteMaDeal(req.params.id, {
      organizationId: scope.organizationId
    });

    if (!result || result.deleted === false) {
      return notFound(res, 'Deal M&A no encontrado');
    }

    await auditMaAction(scope, 'ma.deal.deleted', req.params.id);

    return ok(res, result);
  } catch (error) {
    return next(error);
  }
}

export async function exportReport(req, res, next) {
  try {
    const scope = getRequestScope(req);

    if (!validateScope(res, scope)) return null;

    const item = await createMaReport({
      ...req.body,
      organizationId: scope.organizationId,
      userId: scope.userId
    });

    await auditMaAction(scope, 'ma.report.exported', item.id, {
      caseId: item.caseId,
      title: item.title,
      status: item.status
    });

    return created(res, item);
  } catch (error) {
    return next(error);
  }
}

export async function createSecureShare(req, res, next) {
  try {
    const scope = getRequestScope(req);

    if (!validateScope(res, scope)) return null;

    const item = await createMaSecureShareLink({
      reportId: req.params.id,
      organizationId: scope.organizationId,
      userId: scope.userId,
      expiresInHours: req.body?.expiresInHours
    });

    const dataRoomDocument = await registerSecureShareDataRoomDocument({
      organizationId: scope.organizationId,
      userId: scope.userId,
      share: item,
      reportId: item.reportId
    });

    await auditMaAction(scope, 'ma.secure_share.created', item.id, {
      reportId: item.reportId,
      expiresAt: item.expiresAt,
      dataRoomDocumentId: dataRoomDocument?.id
    });

    return created(res, {
      ...item,
      dataRoomDocument
    });
  } catch (error) {
    return next(error);
  }
}

export async function listDataRoom(req, res, next) {
  try {
    const scope = getRequestScope(req);

    if (!validateScope(res, scope)) return null;

    const [documents, shares] = await Promise.all([
      listMaDataRoomDocuments({
        organizationId: scope.organizationId
      }),
      listMaSecureShares({
        organizationId: scope.organizationId
      })
    ]);

    return ok(res, {
      documents,
      shares,
      totalDocuments: documents.length,
      totalShares: shares.length
    });
  } catch (error) {
    return next(error);
  }
}

export async function listMaAuditLogs(req, res, next) {
  try {
    const scope = getRequestScope(req);

    if (!validateScope(res, scope)) return null;

    const items = await listAuditLogs({
      organizationId: scope.organizationId,
      entityType: req.query?.entityType || 'ma',
      action: req.query?.action || '',
      entityId: req.query?.entityId || '',
      limit: req.query?.limit || 100
    });

    return ok(res, {
      items,
      total: items.length
    });
  } catch (error) {
    return next(error);
  }
}

export async function createDataRoomDocument(req, res, next) {
  try {
    const scope = getRequestScope(req);

    if (!validateScope(res, scope)) return null;

    const item = await createMaDataRoomDocument({
      ...req.body,
      organizationId: scope.organizationId,
      userId: scope.userId
    });

    await auditMaAction(scope, 'ma.data_room.document.created', item.id, {
      caseId: item.caseId,
      reportId: item.reportId,
      classification: item.classification,
      status: item.status
    });

    return created(res, item);
  } catch (error) {
    return next(error);
  }
}

export async function uploadDataRoomFile(req, res, next) {
  try {
    const scope = getRequestScope(req);

    if (!validateScope(res, scope)) return null;

    const item = await createMaDataRoomFileDocument({
      organizationId: scope.organizationId,
      userId: scope.userId,
      fileBuffer: req.body,
      originalFileName: getHeader(req, 'x-ma-file-name'),
      title: getHeader(req, 'x-ma-document-title'),
      documentType: getHeader(req, 'x-ma-document-type'),
      classification: getHeader(req, 'x-ma-classification'),
      status: getHeader(req, 'x-ma-document-status'),
      caseId: getHeader(req, 'x-ma-case-id'),
      reportId: getHeader(req, 'x-ma-report-id'),
      area: getHeader(req, 'x-ma-area'),
      folder: getHeader(req, 'x-ma-folder'),
      allowDownload: getHeader(req, 'x-ma-allow-download'),
      expiresAt: getHeader(req, 'x-ma-access-expires-at'),
      watermarkLabel: getHeader(req, 'x-ma-watermark-label'),
      allowedRoles: getHeader(req, 'x-ma-allowed-roles'),
      legalHold: getHeader(req, 'x-ma-legal-hold'),
      retentionUntil: getHeader(req, 'x-ma-retention-until'),
      mimeType: req.get('content-type') || 'application/octet-stream'
    });

    await auditMaAction(scope, 'ma.data_room.file.uploaded', item.id, {
      classification: item.classification,
      documentType: item.documentType,
      sizeBytes: item.storage?.sizeBytes,
      checksumSha256: item.storage?.checksumSha256,
      area: item.area,
      folder: item.folder,
      allowDownload: item.access?.allowDownload
    });

    return created(res, item);
  } catch (error) {
    return next(error);
  }
}

export async function downloadDataRoomDocument(req, res, next) {
  try {
    const scope = getRequestScope(req);

    if (!validateScope(res, scope)) return null;

    const file = await getMaDataRoomFileDownload({
      id: req.params.id,
      organizationId: scope.organizationId,
      userId: scope.userId,
      role: scope.role
    });

    await auditMaAction(scope, 'ma.data_room.file.downloaded', req.params.id, {
      sizeBytes: file.sizeBytes,
      checksumSha256: file.checksumSha256,
      watermark: file.watermark
    });

    res.setHeader('Content-Type', file.mimeType);
    res.setHeader('Content-Length', String(file.sizeBytes));
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-MA-Checksum-SHA256', file.checksumSha256);
    res.setHeader('X-MA-Watermark', buildDownloadFileName(file.watermark));
    res.setHeader(
      'X-MA-Document-Classification',
      file.document?.classification || ''
    );
    res.setHeader('X-MA-Document-Version', file.document?.storage?.version || '');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${buildDownloadFileName(file.fileName)}"`
    );

    return res.sendFile(file.filePath, (error) => {
      if (error) return next(error);
      return null;
    });
  } catch (error) {
    return next(error);
  }
}

export async function updateDataRoomDocumentGovernance(req, res, next) {
  try {
    const scope = getRequestScope(req);

    if (!validateScope(res, scope)) return null;

    const item = await updateMaDataRoomDocumentGovernance(
      req.params.id,
      req.body || {},
      {
        organizationId: scope.organizationId
      }
    );

    if (!item) return notFound(res, 'Documento VDR no encontrado');

    await auditMaAction(scope, 'ma.data_room.document.governance_updated', item.id, {
      status: item.status,
      classification: item.classification,
      area: item.area,
      folder: item.folder,
      allowDownload: item.access?.allowDownload,
      expiresAt: item.access?.expiresAt
    });

    return ok(res, item);
  } catch (error) {
    return next(error);
  }
}

export async function getSecureShare(req, res, next) {
  try {
    const scope = getRequestScope(req);

    if (!validateScope(res, scope)) return null;

    const shareToken =
      String(
        typeof req.get === 'function'
          ? req.get('x-ma-share-token') || ''
          : ''
      ).trim() ||
      String(req.query?.token ?? '').trim();

    const item = await getMaSecureShare({
      id: req.params.id,
      token: shareToken,
      organizationId: scope.organizationId
    });

    await auditMaAction(scope, 'ma.secure_share.accessed', req.params.id, {
      reportId: item.report?.id
    });

    return ok(res, item);
  } catch (error) {
    return next(error);
  }
}

export async function revokeSecureShare(req, res, next) {
  try {
    const scope = getRequestScope(req);

    if (!validateScope(res, scope)) return null;

    const item = await revokeMaSecureShare({
      id: req.params.id,
      organizationId: scope.organizationId
    });

    const dataRoomDocument = await markSecureShareDataRoomDocumentRevoked({
      id: req.params.id,
      shareId: req.params.id,
      organizationId: scope.organizationId
    });

    await auditMaAction(scope, 'ma.secure_share.revoked', item.id, {
      reportId: item.reportId,
      dataRoomDocumentId: dataRoomDocument?.id
    });

    return ok(res, {
      ...item,
      dataRoomDocument
    });
  } catch (error) {
    return next(error);
  }
}
