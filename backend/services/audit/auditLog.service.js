import { sanitizeAuditMetadata, emailAuditHint } from '../../utils/auditMetadata.js';
import { createSqliteEntityStore } from '../../storage/sqliteEntityStore.service.js';
import { allSql } from '../../storage/sqliteStorage.js';

export const PLATFORM_AUDIT_ORG_ID = 'org_platform';
export const SYSTEM_AUDIT_ACTOR_ID = 'system_audit';

const auditLogStore = createSqliteEntityStore('audit_logs', 'audit_log', {
  metadata: {}
});

function normalizeText(value, fallback = '') {
  return String(value ?? fallback).trim();
}

function parseMetadata(value) {
  if (!value) return {};

  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
      ? parsed
      : {};
  } catch {
    return {};
  }
}

export async function recordAuditLog({
  organizationId,
  userId,
  action,
  entityType,
  entityId = '',
  metadata = {}
} = {}) {
  const safeOrganizationId = normalizeText(organizationId);
  const safeUserId = normalizeText(userId);
  const safeAction = normalizeText(action);
  const safeEntityType = normalizeText(entityType);

  if (!safeOrganizationId || !safeUserId || !safeAction || !safeEntityType) {
    return null;
  }

  try {
    return await auditLogStore.create({
      organizationId: safeOrganizationId,
      userId: safeUserId,
      action: safeAction,
      entityType: safeEntityType,
      entityId: normalizeText(entityId),
      metadata: sanitizeAuditMetadata(metadata)
    });
  } catch {
    return null;
  }
}

/**
 * Auth/security events — allows platform org + system actor when user unknown.
 * Never pass passwords or tokens in metadata.
 */
export async function recordAuthAuditLog({
  organizationId = PLATFORM_AUDIT_ORG_ID,
  userId = SYSTEM_AUDIT_ACTOR_ID,
  action,
  entityType = 'auth',
  entityId = '',
  metadata = {}
} = {}) {
  const safeAction = normalizeText(action);
  const safeEntityType = normalizeText(entityType) || 'auth';

  if (!safeAction) {
    return null;
  }

  return recordAuditLog({
    organizationId: normalizeText(organizationId) || PLATFORM_AUDIT_ORG_ID,
    userId: normalizeText(userId) || SYSTEM_AUDIT_ACTOR_ID,
    action: safeAction,
    entityType: safeEntityType,
    entityId: normalizeText(entityId) || normalizeText(userId) || SYSTEM_AUDIT_ACTOR_ID,
    metadata: sanitizeAuditMetadata({
      ...emailAuditHint(metadata.email),
      ...metadata,
      email: undefined
    })
  });
}

export async function listAuditLogs({
  organizationId,
  entityType = '',
  action = '',
  entityId = '',
  limit = 100
} = {}) {
  const safeOrganizationId = normalizeText(organizationId);

  if (!safeOrganizationId) return [];

  const safeLimit = Math.max(1, Math.min(Number(limit) || 100, 500));
  const safeEntityType = normalizeText(entityType);
  const safeAction = normalizeText(action);
  const safeEntityId = normalizeText(entityId);
  const clauses = ['organization_id = @organizationId'];
  const params = {
    organizationId: safeOrganizationId,
    limit: safeLimit
  };

  if (safeEntityType) {
    clauses.push('entity_type = @entityType');
    params.entityType = safeEntityType;
  }

  if (safeAction) {
    clauses.push('action = @action');
    params.action = safeAction;
  }

  if (safeEntityId) {
    clauses.push('entity_id = @entityId');
    params.entityId = safeEntityId;
  }

  const rows = allSql(
    `
      SELECT *
      FROM audit_logs
      WHERE ${clauses.join(' AND ')}
      ORDER BY created_at DESC
      LIMIT @limit
    `,
    params
  );

  return rows.map((row) => ({
    id: row.id,
    organizationId: row.organization_id,
    userId: row.user_id,
    action: row.action,
    entityType: row.entity_type,
    entityId: row.entity_id,
    metadata: parseMetadata(row.metadata_json),
    createdAt: row.created_at,
    updatedAt: row.updated_at
  }));
}
