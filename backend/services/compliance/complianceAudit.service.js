import { recordAuditLog } from '../audit/auditLog.service.js';
import { pickChangedFieldNames, sanitizeAuditMetadata } from '../../utils/auditMetadata.js';

function normalizeText(value) {
  return String(value ?? '').trim();
}

/**
 * @param {{
 *   organizationId: string;
 *   userId?: string;
 *   action: string;
 *   entityType?: string;
 *   entityId?: string;
 *   metadata?: Record<string, unknown>;
 * }} params
 */
export async function recordComplianceAudit({
  organizationId,
  userId = '',
  action,
  entityType = 'compliance',
  entityId = '',
  metadata = {}
} = {}) {
  const safeOrganizationId = normalizeText(organizationId);
  const safeUserId = normalizeText(userId);

  if (!safeOrganizationId || !safeUserId) {
    return null;
  }

  return recordAuditLog({
    organizationId: safeOrganizationId,
    userId: safeUserId,
    action,
    entityType,
    entityId: normalizeText(entityId),
    metadata: sanitizeAuditMetadata(metadata)
  });
}

/**
 * @param {Record<string, unknown>} existing
 * @param {Record<string, unknown>} patch
 * @param {string[]} keys
 */
export function complianceChangedFields(existing = {}, patch = {}, keys = []) {
  return pickChangedFieldNames(existing, patch, keys);
}
