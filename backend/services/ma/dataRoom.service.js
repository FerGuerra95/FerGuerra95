import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

import { createSqliteEntityStore } from '../../storage/sqliteEntityStore.service.js';
import { getDatabaseFilePath, getSql } from '../../storage/sqliteStorage.js';
import { getMaCaseById } from './cases.service.js';
import { getMaReportById } from './reports.service.js';
import { getMaSecureShareLinkById } from './secureShare.service.js';

const dataRoomStore = createSqliteEntityStore(
  'ma_data_room_documents',
  'ma_data_room_document',
  {
    status: 'draft',
    documentType: 'report',
    classification: 'confidential',
    payload: {}
  }
);

const VALID_DOCUMENT_STATUSES = [
  'draft',
  'ready',
  'shared',
  'revoked',
  'archived'
];

const VALID_DOCUMENT_TYPES = [
  'report',
  'cim',
  'financials',
  'legal',
  'tax',
  'operations',
  'other'
];

const VALID_VDR_AREAS = [
  'financial',
  'legal',
  'tax',
  'hr',
  'commercial',
  'operations',
  'esg',
  'technology',
  'other'
];
const VALID_VDR_ROLES = ['admin', 'user', 'viewer'];
const MAX_VDR_FILE_BYTES = 25 * 1024 * 1024;
const BLOCKED_FILE_EXTENSIONS = new Set([
  '.bat',
  '.cmd',
  '.com',
  '.dll',
  '.exe',
  '.js',
  '.msi',
  '.ps1',
  '.scr',
  '.vbs'
]);

function createError(message, status = 400, code = 'MA_DATA_ROOM_ERROR') {
  const error = new Error(message);
  error.status = status;
  error.code = code;
  return error;
}

function normalizeText(value, fallback = '') {
  return String(value ?? fallback).trim();
}

function normalizeEnum(value, allowedValues, fallback) {
  const normalized = normalizeText(value || fallback).toLowerCase();
  return allowedValues.includes(normalized) ? normalized : fallback;
}

function normalizeBoolean(value, fallback = false) {
  if (value === true || value === false) return value;
  if (value === undefined || value === null || value === '') return fallback;

  const normalized = normalizeText(value).toLowerCase();

  if (['1', 'true', 'yes', 'y', 'on'].includes(normalized)) return true;
  if (['0', 'false', 'no', 'n', 'off'].includes(normalized)) return false;

  return fallback;
}

function normalizeIsoDate(value, fallback = '') {
  const text = normalizeText(value);

  if (!text) return fallback;

  const timestamp = Date.parse(text);

  if (!Number.isFinite(timestamp)) return fallback;

  return new Date(timestamp).toISOString();
}

function normalizeRoles(value, fallback = VALID_VDR_ROLES) {
  const rawItems = Array.isArray(value)
    ? value
    : normalizeText(value)
      .split(',')
      .map((item) => item.trim());

  const roles = rawItems
    .map((item) => normalizeText(item).toLowerCase())
    .filter((item) => VALID_VDR_ROLES.includes(item));

  return [...new Set(roles.length ? roles : fallback)];
}

function normalizeStorageSegment(value, fallback = 'unknown') {
  return (
    normalizeText(value, fallback)
      .replace(/[^a-zA-Z0-9_.-]/g, '_')
      .replace(/_+/g, '_')
      .slice(0, 120) || fallback
  );
}

function normalizeFileName(value) {
  const baseName = path.basename(normalizeText(value, 'document.bin'));
  const safeName = baseName
    .replace(/[<>:"/\\|?*\u0000-\u001F]/g, '_')
    .replace(/\s+/g, ' ')
    .trim();

  return safeName.slice(0, 180) || 'document.bin';
}

function assertAllowedFileName(fileName) {
  const extension = path.extname(fileName).toLowerCase();

  if (BLOCKED_FILE_EXTENSIONS.has(extension)) {
    throw createError(
      'Tipo de fichero no permitido para el VDR.',
      400,
      'MA_VDR_FILE_TYPE_BLOCKED'
    );
  }
}

function inferDocumentType(fileName, fallback = 'other') {
  const extension = path.extname(fileName).toLowerCase();

  if (extension === '.pdf') return 'report';
  if (['.xls', '.xlsx', '.csv'].includes(extension)) return 'financials';
  if (['.doc', '.docx', '.ppt', '.pptx'].includes(extension)) return 'cim';
  if (['.zip', '.7z'].includes(extension)) return 'other';

  return fallback;
}

function getVdrStorageRoot() {
  const configuredRoot =
    process.env.MA_VDR_STORAGE_DIR || process.env.VDR_STORAGE_DIR || '';

  if (configuredRoot.trim()) {
    return path.resolve(configuredRoot);
  }

  return path.join(path.dirname(getDatabaseFilePath()), 'ma_vdr');
}

function buildStorageKey({ organizationId, documentId, fileName }) {
  const versionId = `v${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;

  return path.join(
    normalizeStorageSegment(organizationId, 'org'),
    normalizeStorageSegment(documentId, 'document'),
    `${versionId}_${normalizeFileName(fileName)}`
  );
}

function resolveStoragePath(storageKey) {
  const root = path.resolve(getVdrStorageRoot());
  const target = path.resolve(root, storageKey || '');

  if (target !== root && !target.startsWith(`${root}${path.sep}`)) {
    throw createError(
      'Ruta VDR no valida.',
      400,
      'MA_VDR_STORAGE_PATH_INVALID'
    );
  }

  return target;
}

function toFileBuffer(value) {
  if (Buffer.isBuffer(value)) return value;
  if (value instanceof Uint8Array) return Buffer.from(value);

  return Buffer.alloc(0);
}

function buildVdrGovernancePayload(payload = {}) {
  const existingAccess =
    payload.access && typeof payload.access === 'object' ? payload.access : {};
  const existingGovernance =
    payload.governance && typeof payload.governance === 'object'
      ? payload.governance
      : {};

  return {
    area: normalizeEnum(payload.area, VALID_VDR_AREAS, 'financial'),
    folder: normalizeText(payload.folder, 'General DD') || 'General DD',
    access: {
      allowDownload: normalizeBoolean(
        payload.allowDownload ?? existingAccess.allowDownload,
        true
      ),
      expiresAt: normalizeIsoDate(
        payload.expiresAt || payload.accessExpiresAt || existingAccess.expiresAt
      ),
      watermarkLabel:
        normalizeText(
          payload.watermarkLabel || existingAccess.watermarkLabel,
          'CONFIDENTIAL'
        ) || 'CONFIDENTIAL',
      allowedRoles: normalizeRoles(
        payload.allowedRoles || existingAccess.allowedRoles,
        VALID_VDR_ROLES
      )
    },
    governance: {
      legalHold: normalizeBoolean(
        payload.legalHold ?? existingGovernance.legalHold,
        false
      ),
      retentionUntil: normalizeIsoDate(
        payload.retentionUntil || existingGovernance.retentionUntil
      ),
      purgePolicy:
        normalizeText(
          payload.purgePolicy || existingGovernance.purgePolicy,
          'manual_review'
        ) || 'manual_review'
    }
  };
}

function mergeVdrGovernancePayload(existingPayload = {}, patch = {}) {
  const existing =
    existingPayload && typeof existingPayload === 'object' ? existingPayload : {};
  const currentAccess =
    existing.access && typeof existing.access === 'object' ? existing.access : {};
  const currentGovernance =
    existing.governance && typeof existing.governance === 'object'
      ? existing.governance
      : {};
  const next = {
    ...existing
  };

  if (Object.prototype.hasOwnProperty.call(patch, 'area')) {
    next.area = normalizeEnum(patch.area, VALID_VDR_AREAS, existing.area || 'financial');
  }

  if (Object.prototype.hasOwnProperty.call(patch, 'folder')) {
    next.folder = normalizeText(patch.folder, existing.folder || 'General DD');
  }

  const nextAccess = {
    ...currentAccess
  };

  if (Object.prototype.hasOwnProperty.call(patch, 'allowDownload')) {
    nextAccess.allowDownload = normalizeBoolean(patch.allowDownload, true);
  }

  if (
    Object.prototype.hasOwnProperty.call(patch, 'expiresAt') ||
    Object.prototype.hasOwnProperty.call(patch, 'accessExpiresAt')
  ) {
    nextAccess.expiresAt = normalizeIsoDate(
      patch.expiresAt || patch.accessExpiresAt
    );
  }

  if (Object.prototype.hasOwnProperty.call(patch, 'watermarkLabel')) {
    nextAccess.watermarkLabel =
      normalizeText(patch.watermarkLabel, currentAccess.watermarkLabel || 'CONFIDENTIAL') ||
      'CONFIDENTIAL';
  }

  if (Object.prototype.hasOwnProperty.call(patch, 'allowedRoles')) {
    nextAccess.allowedRoles = normalizeRoles(
      patch.allowedRoles,
      currentAccess.allowedRoles || VALID_VDR_ROLES
    );
  }

  const nextGovernance = {
    ...currentGovernance
  };

  if (Object.prototype.hasOwnProperty.call(patch, 'legalHold')) {
    nextGovernance.legalHold = normalizeBoolean(patch.legalHold, false);
  }

  if (Object.prototype.hasOwnProperty.call(patch, 'retentionUntil')) {
    nextGovernance.retentionUntil = normalizeIsoDate(patch.retentionUntil);
  }

  if (Object.prototype.hasOwnProperty.call(patch, 'purgePolicy')) {
    nextGovernance.purgePolicy =
      normalizeText(patch.purgePolicy, currentGovernance.purgePolicy || 'manual_review') ||
      'manual_review';
  }

  next.access = {
    allowDownload:
      nextAccess.allowDownload === false ? false : true,
    expiresAt: normalizeIsoDate(nextAccess.expiresAt),
    watermarkLabel:
      normalizeText(nextAccess.watermarkLabel, 'CONFIDENTIAL') || 'CONFIDENTIAL',
    allowedRoles: normalizeRoles(nextAccess.allowedRoles, VALID_VDR_ROLES)
  };
  next.governance = {
    legalHold: nextGovernance.legalHold === true,
    retentionUntil: normalizeIsoDate(nextGovernance.retentionUntil),
    purgePolicy:
      normalizeText(nextGovernance.purgePolicy, 'manual_review') ||
      'manual_review'
  };

  return next;
}

function buildDownloadWatermark(document = {}, scope = {}) {
  const access = document.access && typeof document.access === 'object'
    ? document.access
    : {};
  const label =
    normalizeText(access.watermarkLabel, document.classification || 'CONFIDENTIAL') ||
    'CONFIDENTIAL';

  return [
    label.toUpperCase(),
    normalizeText(scope.organizationId),
    normalizeText(scope.userId, 'unknown-user'),
    normalizeText(scope.role, 'viewer'),
    normalizeText(document.id),
    new Date().toISOString()
  ]
    .filter(Boolean)
    .join(' | ');
}

function assertDownloadPolicy(document = {}, scope = {}) {
  const access =
    document.access && typeof document.access === 'object' ? document.access : {};

  if (access.allowDownload === false) {
    throw createError(
      'La descarga de este documento VDR esta deshabilitada.',
      403,
      'MA_VDR_DOWNLOAD_DISABLED'
    );
  }

  if (access.expiresAt && Date.parse(access.expiresAt) <= Date.now()) {
    throw createError(
      'El acceso a este documento VDR ha expirado.',
      403,
      'MA_VDR_ACCESS_EXPIRED'
    );
  }

  const allowedRoles = normalizeRoles(access.allowedRoles, VALID_VDR_ROLES);
  const role = normalizeText(scope.role, 'viewer').toLowerCase();

  if (role !== 'admin' && allowedRoles.length && !allowedRoles.includes(role)) {
    throw createError(
      'El rol del usuario no permite descargar este documento VDR.',
      403,
      'MA_VDR_ROLE_NOT_ALLOWED'
    );
  }
}

function assertOrganizationScope(organizationId) {
  if (!normalizeText(organizationId)) {
    throw createError(
      'Scope de organizacion no definido.',
      403,
      'INVALID_ORGANIZATION_SCOPE'
    );
  }
}

function assertUserScope(userId) {
  if (!normalizeText(userId)) {
    throw createError('Usuario no definido.', 403, 'USER_SCOPE_REQUIRED');
  }
}

function expandDocument(entity) {
  if (!entity) return null;

  const payload =
    entity.payload && typeof entity.payload === 'object'
      ? entity.payload
      : {};

  return {
    ...payload,
    ...entity,
    documentType: entity.documentType || payload.documentType || 'report',
    classification:
      entity.classification || payload.classification || 'confidential'
  };
}

async function assertOptionalCaseScope(caseId, organizationId) {
  if (!caseId) return;

  const item = await getMaCaseById(caseId, {
    organizationId
  });

  if (!item) {
    throw createError(
      'Caso M&A no encontrado para esta organizacion.',
      404,
      'MA_CASE_NOT_FOUND'
    );
  }
}

async function assertOptionalReportScope(reportId, organizationId) {
  if (!reportId) return null;

  const item = await getMaReportById(reportId, {
    organizationId
  });

  if (!item) {
    throw createError(
      'Informe M&A no encontrado para esta organizacion.',
      404,
      'MA_REPORT_NOT_FOUND'
    );
  }

  return item;
}

async function assertOptionalShareScope(shareId, organizationId) {
  if (!shareId) return null;

  const item = await getMaSecureShareLinkById({
    id: shareId,
    organizationId
  });

  if (!item) {
    throw createError(
      'Secure share no encontrado para esta organizacion.',
      404,
      'SECURE_SHARE_NOT_FOUND'
    );
  }

  return item;
}

async function getDataRoomDocumentByShareId(shareId, organizationId) {
  const row = getSql(
    `
      SELECT id
      FROM ma_data_room_documents
      WHERE organization_id = @organizationId
        AND share_id = @shareId
      LIMIT 1
    `,
    {
      organizationId,
      shareId
    }
  );

  if (!row?.id) return null;

  return dataRoomStore.getByIdForOrganization(row.id, organizationId);
}

export async function listMaDataRoomDocuments(scope = {}) {
  assertOrganizationScope(scope.organizationId);

  const items = await dataRoomStore.listByOrganization(scope.organizationId);

  return items.map(expandDocument);
}

export async function getMaDataRoomDocumentById(id, scope = {}) {
  assertOrganizationScope(scope.organizationId);

  const item = await dataRoomStore.getByIdForOrganization(
    normalizeText(id),
    scope.organizationId
  );

  return expandDocument(item);
}

export async function createMaDataRoomDocument(payload = {}) {
  assertOrganizationScope(payload.organizationId);
  assertUserScope(payload.userId);

  const caseId = normalizeText(payload.caseId) || null;
  const reportId = normalizeText(payload.reportId) || null;
  const shareId = normalizeText(payload.shareId) || null;

  await assertOptionalCaseScope(caseId, payload.organizationId);
  const report = await assertOptionalReportScope(reportId, payload.organizationId);
  await assertOptionalShareScope(shareId, payload.organizationId);

  const title =
    normalizeText(payload.title) ||
    normalizeText(report?.title) ||
    'M&A Data Room Document';

  const documentType = normalizeEnum(
    payload.documentType,
    VALID_DOCUMENT_TYPES,
    reportId ? 'report' : 'other'
  );
  const status = normalizeEnum(payload.status, VALID_DOCUMENT_STATUSES, 'ready');
  const classification =
    normalizeText(payload.classification, 'confidential').toLowerCase() ||
    'confidential';

  const created = await dataRoomStore.create({
    organizationId: payload.organizationId,
    userId: payload.userId,
    caseId,
    reportId,
    shareId,
    title,
    documentType,
    classification,
    status,
    payload: {
      ...(payload.payload && typeof payload.payload === 'object'
        ? payload.payload
        : {}),
      ...buildVdrGovernancePayload({
        ...(payload.payload && typeof payload.payload === 'object'
          ? payload.payload
          : {}),
        ...payload
      }),
      source: payload.source || 'manual',
      reportTitle: report?.title || '',
      caseId,
      reportId,
      shareId
    }
  });

  return expandDocument(created);
}

export async function createMaDataRoomFileDocument(payload = {}) {
  assertOrganizationScope(payload.organizationId);
  assertUserScope(payload.userId);

  const fileBuffer = toFileBuffer(payload.fileBuffer);
  const originalFileName = normalizeFileName(
    payload.originalFileName || payload.fileName || payload.title
  );

  assertAllowedFileName(originalFileName);

  if (fileBuffer.length <= 0) {
    throw createError('Fichero VDR obligatorio.', 400, 'MA_VDR_FILE_REQUIRED');
  }

  if (fileBuffer.length > MAX_VDR_FILE_BYTES) {
    throw createError(
      `El fichero supera el limite VDR de ${Math.round(MAX_VDR_FILE_BYTES / 1024 / 1024)} MB.`,
      413,
      'MA_VDR_FILE_TOO_LARGE'
    );
  }

  const caseId = normalizeText(payload.caseId) || null;
  const reportId = normalizeText(payload.reportId) || null;
  const shareId = normalizeText(payload.shareId) || null;

  await assertOptionalCaseScope(caseId, payload.organizationId);
  const report = await assertOptionalReportScope(reportId, payload.organizationId);
  await assertOptionalShareScope(shareId, payload.organizationId);

  const title =
    normalizeText(payload.title) ||
    normalizeText(report?.title) ||
    originalFileName;
  const documentType = normalizeEnum(
    payload.documentType,
    VALID_DOCUMENT_TYPES,
    inferDocumentType(originalFileName)
  );
  const status = normalizeEnum(payload.status, VALID_DOCUMENT_STATUSES, 'ready');
  const classification =
    normalizeText(payload.classification, 'confidential').toLowerCase() ||
    'confidential';
  const checksumSha256 = crypto
    .createHash('sha256')
    .update(fileBuffer)
    .digest('hex');
  const uploadedAt = new Date().toISOString();

  const basePayload = {
    ...(payload.payload && typeof payload.payload === 'object'
      ? payload.payload
      : {}),
    ...buildVdrGovernancePayload({
      ...(payload.payload && typeof payload.payload === 'object'
        ? payload.payload
        : {}),
      ...payload
    }),
    source: 'file_upload',
    reportTitle: report?.title || '',
    caseId,
    reportId,
    shareId
  };

  const created = await dataRoomStore.create({
    organizationId: payload.organizationId,
    userId: payload.userId,
    caseId,
    reportId,
    shareId,
    title,
    documentType,
    classification,
    status,
    payload: basePayload
  });

  const storageKey = buildStorageKey({
    organizationId: payload.organizationId,
    documentId: created.id,
    fileName: originalFileName
  });
  const filePath = resolveStoragePath(storageKey);

  try {
    await fs.mkdir(path.dirname(filePath), {
      recursive: true
    });
    await fs.writeFile(filePath, fileBuffer, {
      flag: 'wx'
    });
  } catch (error) {
    await dataRoomStore.removeForOrganization(
      created.id,
      payload.organizationId
    );

    throw createError(
      `No se pudo persistir el fichero VDR: ${error.message}`,
      500,
      'MA_VDR_FILE_WRITE_FAILED'
    );
  }

  const updated = await dataRoomStore.updateForOrganization(
    created.id,
    {
      payload: {
        ...basePayload,
        storage: {
          kind: 'server_file',
          storageKey,
          originalFileName,
          mimeType: normalizeText(payload.mimeType, 'application/octet-stream'),
          sizeBytes: fileBuffer.length,
          checksumSha256,
          uploadedAt,
          version: 'v1'
        },
        versions: [
          {
            kind: 'server_file',
            storageKey,
            originalFileName,
            mimeType: normalizeText(payload.mimeType, 'application/octet-stream'),
            sizeBytes: fileBuffer.length,
            checksumSha256,
            uploadedAt,
            version: 'v1'
          }
        ]
      }
    },
    payload.organizationId
  );

  return expandDocument(updated);
}

export async function getMaDataRoomFileDownload({
  id,
  organizationId,
  userId = '',
  role = 'viewer'
} = {}) {
  assertOrganizationScope(organizationId);

  const item = await dataRoomStore.getByIdForOrganization(
    normalizeText(id),
    organizationId
  );

  if (!item) {
    throw createError(
      'Documento VDR no encontrado para esta organizacion.',
      404,
      'MA_VDR_DOCUMENT_NOT_FOUND'
    );
  }

  if (['revoked', 'archived'].includes(item.status)) {
    throw createError(
      'Documento VDR no descargable por su estado actual.',
      403,
      'MA_VDR_DOCUMENT_NOT_DOWNLOADABLE'
    );
  }

  const expanded = expandDocument(item);
  assertDownloadPolicy(expanded, {
    organizationId,
    userId,
    role
  });

  const storage = expanded.storage || {};

  if (storage.kind !== 'server_file' || !storage.storageKey) {
    throw createError(
      'El documento no tiene fichero VDR persistido.',
      404,
      'MA_VDR_FILE_NOT_FOUND'
    );
  }

  const filePath = resolveStoragePath(storage.storageKey);
  let stats;

  try {
    stats = await fs.stat(filePath);
  } catch (_error) {
    throw createError(
      'El fichero VDR no existe en storage.',
      404,
      'MA_VDR_FILE_NOT_FOUND'
    );
  }

  await dataRoomStore.updateForOrganization(
    item.id,
    {
      lastAccessedAt: new Date().toISOString()
    },
    organizationId
  );

  return {
    document: expanded,
    filePath,
    fileName: normalizeFileName(storage.originalFileName || expanded.title),
    mimeType: normalizeText(storage.mimeType, 'application/octet-stream'),
    sizeBytes: stats.size,
    checksumSha256: normalizeText(storage.checksumSha256),
    watermark: buildDownloadWatermark(expanded, {
      organizationId,
      userId,
      role
    })
  };
}

export async function updateMaDataRoomDocumentGovernance(
  id,
  patch = {},
  scope = {}
) {
  assertOrganizationScope(scope.organizationId);

  const existing = await dataRoomStore.getByIdForOrganization(
    normalizeText(id),
    scope.organizationId
  );

  if (!existing) return null;

  const existingPayload =
    existing.payload && typeof existing.payload === 'object'
      ? existing.payload
      : {};
  const nextPatch = {};

  if (Object.prototype.hasOwnProperty.call(patch, 'title')) {
    nextPatch.title = normalizeText(patch.title, existing.title);
  }

  if (Object.prototype.hasOwnProperty.call(patch, 'documentType')) {
    nextPatch.documentType = normalizeEnum(
      patch.documentType,
      VALID_DOCUMENT_TYPES,
      existing.documentType || 'other'
    );
  }

  if (Object.prototype.hasOwnProperty.call(patch, 'classification')) {
    nextPatch.classification =
      normalizeText(patch.classification, existing.classification || 'confidential').toLowerCase() ||
      'confidential';
  }

  if (Object.prototype.hasOwnProperty.call(patch, 'status')) {
    nextPatch.status = normalizeEnum(
      patch.status,
      VALID_DOCUMENT_STATUSES,
      existing.status || 'ready'
    );
  }

  nextPatch.payload = mergeVdrGovernancePayload(existingPayload, patch);

  const updated = await dataRoomStore.updateForOrganization(
    existing.id,
    nextPatch,
    scope.organizationId
  );

  return expandDocument(updated);
}

export async function registerSecureShareDataRoomDocument({
  organizationId,
  userId,
  share,
  reportId
} = {}) {
  assertOrganizationScope(organizationId);
  assertUserScope(userId);

  const safeShareId = normalizeText(share?.id);
  const safeReportId = normalizeText(reportId || share?.reportId);

  if (!safeShareId) {
    throw createError('shareId es obligatorio.', 400, 'SHARE_ID_REQUIRED');
  }

  const report = await assertOptionalReportScope(safeReportId, organizationId);
  const existing = await getDataRoomDocumentByShareId(
    safeShareId,
    organizationId
  );

  const payload = {
    organizationId,
    userId,
    caseId: report?.caseId || null,
    reportId: safeReportId || null,
    shareId: safeShareId,
    title: normalizeText(report?.title) || 'M&A Secure Shared Report',
    documentType: 'report',
    classification: 'confidential',
    status: share?.status === 'revoked' ? 'revoked' : 'shared',
    payload: {
      source: 'secure_share',
      shareId: safeShareId,
      expiresAt: share?.expiresAt || '',
      reportTitle: report?.title || '',
      caseId: report?.caseId || null
    }
  };

  if (!existing) {
    return createMaDataRoomDocument(payload);
  }

  const updated = await dataRoomStore.updateForOrganization(
    existing.id,
    payload,
    organizationId
  );

  return expandDocument(updated);
}

export async function markSecureShareDataRoomDocumentRevoked({
  organizationId,
  shareId
} = {}) {
  assertOrganizationScope(organizationId);

  const existing = await getDataRoomDocumentByShareId(
    normalizeText(shareId),
    organizationId
  );

  if (!existing) return null;

  const updated = await dataRoomStore.updateForOrganization(
    existing.id,
    {
      status: 'revoked',
      payload: {
        ...(existing.payload && typeof existing.payload === 'object'
          ? existing.payload
          : {}),
        revokedAt: new Date().toISOString()
      }
    },
    organizationId
  );

  return expandDocument(updated);
}
