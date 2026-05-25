/**
 * Safe audit metadata — never store secrets or large sensitive payloads.
 */

const FORBIDDEN_METADATA_KEYS = new Set([
  'password',
  'token',
  'accessToken',
  'access_token',
  'refreshToken',
  'refresh_token',
  'id_token',
  'idToken',
  'cookie',
  'authorization',
  'authHeader',
  'auth_secret',
  'AUTH_SECRET',
  'excerpt',
  'translatedExcerpt',
  'sourceUrl',
  'notes',
  'description',
  'content',
  'body',
  'payload'
]);

/**
 * @param {Record<string, unknown> | null | undefined} input
 * @returns {Record<string, unknown>}
 */
export function sanitizeAuditMetadata(input = {}) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return {};
  }

  const safe = {};

  for (const [key, value] of Object.entries(input)) {
    if (FORBIDDEN_METADATA_KEYS.has(key)) {
      continue;
    }

    if (value === undefined) {
      continue;
    }

    if (typeof value === 'string' && value.length > 500) {
      safe[key] = `${value.slice(0, 120)}…`;
      continue;
    }

    safe[key] = value;
  }

  return safe;
}

/**
 * @param {string} email
 */
export function emailAuditHint(email) {
  const normalized = String(email || '')
    .trim()
    .toLowerCase();

  if (!normalized || !normalized.includes('@')) {
    return { emailPresent: false };
  }

  const [local, domain] = normalized.split('@');

  return sanitizeAuditMetadata({
    emailPresent: true,
    emailDomain: domain || 'unknown',
    emailLocalPrefix: local ? `${local.slice(0, 2)}***` : '***'
  });
}

/**
 * @param {Record<string, unknown>} previous
 * @param {Record<string, unknown>} patch
 * @param {string[]} keys
 */
export function pickChangedFieldNames(previous = {}, patch = {}, keys = []) {
  const changed = [];

  for (const key of keys) {
    if (!Object.prototype.hasOwnProperty.call(patch, key)) {
      continue;
    }

    if (previous[key] !== patch[key]) {
      changed.push(key);
    }
  }

  return changed;
}
