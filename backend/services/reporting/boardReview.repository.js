import {
  allSql,
  createSqliteId,
  fromJson,
  getSql,
  now,
  runSql,
  toJson
} from '../../storage/sqliteStorage.js';
import { omitClientTenantFields } from '../../utils/tenantPayload.js';

const JSON_FIELDS = {
  source_modules_json: ['sourceModules', []],
  data_freshness_json: ['dataFreshness', {}],
  renderer_input_json: ['rendererInput', {}],
  missing_data_json: ['missingData', []],
  insufficient_data_flags_json: ['insufficientDataFlags', []],
  ai_metadata_json: ['aiMetadata', {}],
  truthfulness_json: ['truthfulness', {}],
  audit_metadata_json: ['auditMetadata', {}]
};

function assertOrganizationId(organizationId) {
  if (!String(organizationId || '').trim()) {
    const error = new Error('Scope de organizacion no definido.');
    error.status = 403;
    error.code = 'INVALID_SCOPE';
    throw error;
  }
}

function rowToSnapshot(row) {
  if (!row) return null;

  const snapshot = {
    id: row.id,
    organizationId: row.organization_id,
    reportId: row.report_id,
    boardPackId: row.board_pack_id,
    title: row.title,
    status: row.status,
    snapshotVersion: row.snapshot_version,
    rendererVersion: row.renderer_version,
    createdBy: row.created_by,
    reviewedBy: row.reviewed_by,
    reviewedAt: row.reviewed_at,
    internalFinalBy: row.internal_final_by,
    internalFinalAt: row.internal_final_at,
    archivedAt: row.archived_at,
    revokedAt: row.revoked_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };

  Object.entries(JSON_FIELDS).forEach(([column, [field, fallback]]) => {
    snapshot[field] = fromJson(row[column], fallback);
  });

  return snapshot;
}

function rowToAuditEvent(row) {
  if (!row) return null;

  return {
    id: row.id,
    organizationId: row.organization_id,
    snapshotId: row.snapshot_id,
    actorId: row.actor_id,
    eventType: row.event_type,
    previousStatus: row.previous_status,
    nextStatus: row.next_status,
    result: row.result,
    blockedReason: row.blocked_reason,
    metadata: fromJson(row.metadata_json, {}),
    createdAt: row.created_at
  };
}

export async function createSnapshot({ organizationId, actorId, payload = {} }) {
  assertOrganizationId(organizationId);

  const safePayload = omitClientTenantFields(payload);
  const createdAt = now();
  const id = safePayload.id || createSqliteId('board_review_snapshot');

  runSql(
    `
      INSERT INTO board_review_snapshots (
        id, organization_id, report_id, board_pack_id, title, status,
        snapshot_version, renderer_version, source_modules_json,
        data_freshness_json, renderer_input_json, missing_data_json,
        insufficient_data_flags_json, ai_metadata_json, truthfulness_json,
        audit_metadata_json, created_by, reviewed_by, reviewed_at,
        internal_final_by, internal_final_at, archived_at, revoked_at,
        created_at, updated_at
      )
      VALUES (
        @id, @organizationId, @reportId, @boardPackId, @title, @status,
        @snapshotVersion, @rendererVersion, @sourceModulesJson,
        @dataFreshnessJson, @rendererInputJson, @missingDataJson,
        @insufficientDataFlagsJson, @aiMetadataJson, @truthfulnessJson,
        @auditMetadataJson, @createdBy, NULL, NULL, NULL, NULL, NULL, NULL,
        @createdAt, @updatedAt
      )
    `,
    {
      id,
      organizationId,
      reportId: safePayload.reportId || null,
      boardPackId: safePayload.boardPackId || null,
      title: safePayload.title,
      status: safePayload.status,
      snapshotVersion: safePayload.snapshotVersion || 1,
      rendererVersion: safePayload.rendererVersion || 'html_board_review_v1',
      sourceModulesJson: toJson(safePayload.sourceModules, []),
      dataFreshnessJson: toJson(safePayload.dataFreshness, {}),
      rendererInputJson: toJson(safePayload.rendererInput, {}),
      missingDataJson: toJson(safePayload.missingData, []),
      insufficientDataFlagsJson: toJson(safePayload.insufficientDataFlags, []),
      aiMetadataJson: toJson(safePayload.aiMetadata, {}),
      truthfulnessJson: toJson(safePayload.truthfulness, {}),
      auditMetadataJson: toJson(safePayload.auditMetadata, {}),
      createdBy: actorId || '',
      createdAt,
      updatedAt: createdAt
    }
  );

  return getSnapshotById({ organizationId, snapshotId: id });
}

export async function getSnapshotById({ organizationId, snapshotId }) {
  assertOrganizationId(organizationId);

  const row = getSql(
    `
      SELECT *
      FROM board_review_snapshots
      WHERE organization_id = @organizationId
        AND id = @snapshotId
      LIMIT 1
    `,
    { organizationId, snapshotId }
  );

  return rowToSnapshot(row);
}

export async function listSnapshots({ organizationId, filters = {} }) {
  assertOrganizationId(organizationId);

  const params = { organizationId };
  const clauses = ['organization_id = @organizationId'];

  if (filters.status) {
    clauses.push('status = @status');
    params.status = filters.status;
  }

  const rows = allSql(
    `
      SELECT *
      FROM board_review_snapshots
      WHERE ${clauses.join(' AND ')}
      ORDER BY created_at DESC
    `,
    params
  );

  return rows.map(rowToSnapshot);
}

export async function updateSnapshotStatus({
  organizationId,
  snapshotId,
  actorId,
  transition = {}
}) {
  assertOrganizationId(organizationId);

  const existing = await getSnapshotById({ organizationId, snapshotId });
  if (!existing) return null;

  const updatedAt = now();

  runSql(
    `
      UPDATE board_review_snapshots
      SET status = @status,
          reviewed_by = COALESCE(@reviewedBy, reviewed_by),
          reviewed_at = COALESCE(@reviewedAt, reviewed_at),
          internal_final_by = COALESCE(@internalFinalBy, internal_final_by),
          internal_final_at = COALESCE(@internalFinalAt, internal_final_at),
          archived_at = COALESCE(@archivedAt, archived_at),
          revoked_at = COALESCE(@revokedAt, revoked_at),
          updated_at = @updatedAt
      WHERE organization_id = @organizationId
        AND id = @snapshotId
    `,
    {
      organizationId,
      snapshotId,
      status: transition.status,
      reviewedBy: transition.reviewedBy || null,
      reviewedAt: transition.reviewedAt || null,
      internalFinalBy: transition.internalFinalBy || null,
      internalFinalAt: transition.internalFinalAt || null,
      archivedAt: transition.archivedAt || null,
      revokedAt: transition.revokedAt || null,
      updatedAt,
      actorId: actorId || ''
    }
  );

  return getSnapshotById({ organizationId, snapshotId });
}

export const archiveSnapshot = ({ organizationId, snapshotId, actorId }) =>
  updateSnapshotStatus({
    organizationId,
    snapshotId,
    actorId,
    transition: { status: 'archived', archivedAt: now() }
  });

export const revokeSnapshot = ({ organizationId, snapshotId, actorId }) =>
  updateSnapshotStatus({
    organizationId,
    snapshotId,
    actorId,
    transition: { status: 'revoked', revokedAt: now() }
  });

export async function createAuditEvent({
  organizationId,
  snapshotId,
  actorId = '',
  eventType,
  previousStatus = null,
  nextStatus = null,
  result = 'succeeded',
  blockedReason = null,
  metadata = {}
}) {
  assertOrganizationId(organizationId);

  const id = createSqliteId('board_review_audit');
  const createdAt = now();

  runSql(
    `
      INSERT INTO board_review_audit_events (
        id, organization_id, snapshot_id, actor_id, event_type,
        previous_status, next_status, result, blocked_reason,
        metadata_json, created_at
      )
      VALUES (
        @id, @organizationId, @snapshotId, @actorId, @eventType,
        @previousStatus, @nextStatus, @result, @blockedReason,
        @metadataJson, @createdAt
      )
    `,
    {
      id,
      organizationId,
      snapshotId,
      actorId,
      eventType,
      previousStatus,
      nextStatus,
      result,
      blockedReason,
      metadataJson: toJson(metadata, {}),
      createdAt
    }
  );

  return rowToAuditEvent(
    getSql(
      `
        SELECT *
        FROM board_review_audit_events
        WHERE id = @id
        LIMIT 1
      `,
      { id }
    )
  );
}

export async function listAuditEvents({ organizationId, snapshotId }) {
  assertOrganizationId(organizationId);

  const rows = allSql(
    `
      SELECT *
      FROM board_review_audit_events
      WHERE organization_id = @organizationId
        AND snapshot_id = @snapshotId
      ORDER BY created_at DESC
    `,
    { organizationId, snapshotId }
  );

  return rows.map(rowToAuditEvent);
}
