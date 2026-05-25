/**
 * Strip client-supplied tenant identifiers from create/update payloads.
 * Session organizationId from auth must always win.
 */

const TENANT_FIELD_KEYS = new Set([
  'organizationId',
  'orgId',
  'organization_id',
  'tenantId',
  'tenant_id'
]);

/**
 * @param {Record<string, unknown> | null | undefined} input
 * @returns {Record<string, unknown>}
 */
export function omitClientTenantFields(input = {}) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return {};
  }

  const safe = {};

  for (const [key, value] of Object.entries(input)) {
    if (TENANT_FIELD_KEYS.has(key)) {
      continue;
    }
    safe[key] = value;
  }

  return safe;
}

/**
 * @param {Record<string, unknown>} payload
 * @param {string} organizationId
 * @param {{ userId?: string, id?: string }} [actor]
 */
export function buildTenantSafeCreateFields(payload = {}, organizationId, actor = {}) {
  const userId = String(actor.userId || actor.id || '').trim();

  return {
    ...omitClientTenantFields(payload),
    organizationId,
    userId,
    createdBy: userId
  };
}
