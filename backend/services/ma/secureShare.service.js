import crypto from 'node:crypto';

import { createSqliteEntityStore } from '../../storage/sqliteEntityStore.service.js';
import { getMaReportById } from './reports.service.js';

const secureShareStore = createSqliteEntityStore(
  'secure_share_links',
  'ma_secure_share',
  {
    status: 'active'
  }
);

const DEFAULT_EXPIRES_IN_HOURS = 72;
const MAX_EXPIRES_IN_HOURS = 24 * 30;

function createError(message, status = 400, code = 'SECURE_SHARE_ERROR') {
  const error = new Error(message);
  error.status = status;
  error.code = code;
  return error;
}

function normalizeText(value, fallback = '') {
  return String(value ?? fallback).trim();
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

function normalizeExpiresInHours(value) {
  const number = Number(value || DEFAULT_EXPIRES_IN_HOURS);

  if (!Number.isFinite(number)) return DEFAULT_EXPIRES_IN_HOURS;

  return Math.max(1, Math.min(MAX_EXPIRES_IN_HOURS, Math.round(number)));
}

function createSecureToken() {
  return crypto.randomBytes(32).toString('base64url');
}

function hashToken(token) {
  const secret = process.env.AUTH_SECRET || 'ceo-os-local-development-secret';

  return crypto
    .createHash('sha256')
    .update(`${secret}:${token}`)
    .digest('hex');
}

function safeTokenCompare(left, right) {
  const leftBuffer = Buffer.from(String(left || ''));
  const rightBuffer = Buffer.from(String(right || ''));

  if (leftBuffer.length !== rightBuffer.length) return false;

  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

function isExpired(item) {
  return item?.expiresAt && new Date(item.expiresAt).getTime() <= Date.now();
}

/**
 * Builds a URL for human sharing: SPA route keeps the bearer secret in the fragment
 * (never sent as Referrer to arbitrary origins, omit from typical server-side access logs).
 * Access still requires authenticated session matching organizationId (enterprise pilot model).
 *
 * Prefer calling the backend with header `X-MA-Share-Token`, not query `?token=`.
 */
function buildShareUrls(id, token) {
  const safeId = encodeURIComponent(id);
  const safeToken = encodeURIComponent(token);

  const apiPathPlain = `/api/ma/secure-shares/${safeId}`;
  const viewerFragment = `#sid=${safeId}&t=${safeToken}`;
  const viewerPath = `/ma/secure-share${viewerFragment}`;

  const baseUrl = normalizeText(
    process.env.PUBLIC_APP_URL || process.env.FRONTEND_URL
  ).replace(/\/$/, '');

  const viewerUrl = baseUrl ? `${baseUrl}${viewerPath}` : viewerPath;

  return {
    apiPath: apiPathPlain,
    viewerPath,
    viewerUrl,
    /** @deprecated Prefer viewerUrl — never embed bearer token under /api/ paths. */
    legacyApiUrlWithQueryToken: `${apiPathPlain}?token=${safeToken}`
  };
}

function sanitizeShare(item, token = '') {
  if (!item) return null;

  const shareUrls = token ? buildShareUrls(item.id, token) : {};

  return {
    id: item.id,
    reportId: item.reportId,
    status: item.status,
    expiresAt: item.expiresAt,
    revokedAt: item.revokedAt || null,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    ...(token
      ? {
          token,
          shareUrl: shareUrls.viewerUrl,
          viewerPath: shareUrls.viewerPath,
          viewerUrl: shareUrls.viewerUrl,
          apiPath: shareUrls.apiPath
        }
      : {})
  };
}

export async function createMaSecureShareLink({
  reportId,
  organizationId,
  userId,
  expiresInHours = DEFAULT_EXPIRES_IN_HOURS
} = {}) {
  assertOrganizationScope(organizationId);

  const safeReportId = normalizeText(reportId);
  const safeUserId = normalizeText(userId);

  if (!safeReportId) {
    throw createError('reportId es obligatorio.', 400, 'REPORT_ID_REQUIRED');
  }

  if (!safeUserId) {
    throw createError('userId es obligatorio.', 403, 'USER_SCOPE_REQUIRED');
  }

  const report = await getMaReportById(safeReportId, {
    organizationId
  });

  if (!report) {
    throw createError('Informe M&A no encontrado.', 404, 'MA_REPORT_NOT_FOUND');
  }

  const token = createSecureToken();
  const now = new Date();
  const expiresAt = new Date(
    now.getTime() + normalizeExpiresInHours(expiresInHours) * 60 * 60 * 1000
  ).toISOString();

  const item = await secureShareStore.create({
    organizationId,
    userId: safeUserId,
    reportId: safeReportId,
    tokenHash: hashToken(token),
    status: 'active',
    expiresAt
  });

  return sanitizeShare(item, token);
}

export async function listMaSecureShares({
  organizationId
} = {}) {
  assertOrganizationScope(organizationId);

  const items = await secureShareStore.listByOrganization(organizationId);

  return items.map((item) => sanitizeShare(item));
}

export async function getMaSecureShareLinkById({
  id,
  organizationId
} = {}) {
  assertOrganizationScope(organizationId);

  const item = await secureShareStore.getByIdForOrganization(
    normalizeText(id),
    organizationId
  );

  return sanitizeShare(item);
}

export async function getMaSecureShare({
  id,
  token,
  organizationId
} = {}) {
  assertOrganizationScope(organizationId);

  const item = await secureShareStore.getByIdForOrganization(
    normalizeText(id),
    organizationId
  );

  if (!item) {
    throw createError('Secure share no encontrado.', 404, 'SECURE_SHARE_NOT_FOUND');
  }

  if (item.status !== 'active' || item.revokedAt) {
    throw createError('Secure share revocado.', 403, 'SECURE_SHARE_REVOKED');
  }

  if (isExpired(item)) {
    throw createError('Secure share caducado.', 403, 'SECURE_SHARE_EXPIRED');
  }

  if (!token || !safeTokenCompare(hashToken(token), item.tokenHash)) {
    throw createError('Token de secure share no valido.', 403, 'SECURE_SHARE_TOKEN_INVALID');
  }

  const report = await getMaReportById(item.reportId, {
    organizationId
  });

  if (!report) {
    throw createError('Informe M&A no encontrado.', 404, 'MA_REPORT_NOT_FOUND');
  }

  return {
    share: sanitizeShare(item),
    report
  };
}

export async function revokeMaSecureShare({
  id,
  organizationId
} = {}) {
  assertOrganizationScope(organizationId);

  const existing = await secureShareStore.getByIdForOrganization(
    normalizeText(id),
    organizationId
  );

  if (!existing) {
    throw createError('Secure share no encontrado.', 404, 'SECURE_SHARE_NOT_FOUND');
  }

  const revokedAt = new Date().toISOString();
  const item = await secureShareStore.updateForOrganization(
    existing.id,
    {
      status: 'revoked',
      revokedAt
    },
    organizationId
  );

  return sanitizeShare(item);
}
