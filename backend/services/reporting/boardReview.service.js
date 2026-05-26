import { omitClientTenantFields } from '../../utils/tenantPayload.js';
import {
  archiveSnapshot,
  createAuditEvent,
  createSnapshot,
  getSnapshotById,
  listAuditEvents,
  listSnapshots,
  revokeSnapshot,
  updateSnapshotStatus
} from './boardReview.repository.js';

export const BOARD_REVIEW_STATUSES = Object.freeze({
  DRAFT: 'draft',
  AI_DRAFT: 'ai_draft',
  HUMAN_REVIEW_REQUIRED: 'human_review_required',
  REVIEWED: 'reviewed',
  INTERNAL_FINAL: 'internal_final',
  ARCHIVED: 'archived',
  REVOKED: 'revoked'
});

const ALLOWED_STATUSES = new Set(Object.values(BOARD_REVIEW_STATUSES));
const CREATE_ALLOWED_STATUSES = new Set([
  BOARD_REVIEW_STATUSES.DRAFT,
  BOARD_REVIEW_STATUSES.AI_DRAFT,
  BOARD_REVIEW_STATUSES.HUMAN_REVIEW_REQUIRED
]);
const SENSITIVE_KEY_PATTERN =
  /(password|token|cookie|authorization|authheader|auth_header|secret|api[_-]?key|private[_-]?key|secure[_-]?share|bearer)/i;

function normalizeText(value, fallback = '') {
  return String(value ?? fallback).trim();
}

function actorId(actor = {}) {
  return normalizeText(actor.userId || actor.id);
}

function error(status, code, message) {
  const issue = new Error(message);
  issue.status = status;
  issue.code = code;
  return issue;
}

function assertOrganizationId(organizationId) {
  if (!normalizeText(organizationId)) {
    throw error(403, 'INVALID_SCOPE', 'Scope de organizacion no definido.');
  }
}

function cloneSafe(value) {
  if (Array.isArray(value)) {
    return value.map(cloneSafe);
  }

  if (value && typeof value === 'object') {
    return Object.entries(value).reduce((acc, [key, nested]) => {
      acc[key] = SENSITIVE_KEY_PATTERN.test(key) ? '[REDACTED]' : cloneSafe(nested);
      return acc;
    }, {});
  }

  return value;
}

export function redactBoardReviewPayload(payload = {}) {
  return cloneSafe(payload);
}

function isAiActor(actor = {}) {
  const role = normalizeText(actor.role).toLowerCase();
  const type = normalizeText(actor.type || actor.actorType).toLowerCase();
  return role === 'ai' || role === 'service' || type === 'ai' || type === 'service';
}

function normalizeStatus(status, fallback = BOARD_REVIEW_STATUSES.HUMAN_REVIEW_REQUIRED) {
  const normalized = normalizeText(status, fallback).toLowerCase();
  if (normalized === 'board_approved') {
    throw error(400, 'BOARD_APPROVED_STATUS_FORBIDDEN', 'Estado no permitido.');
  }
  if (!ALLOWED_STATUSES.has(normalized)) {
    throw error(400, 'INVALID_BOARD_REVIEW_STATUS', 'Estado de Board Review no permitido.');
  }
  return normalized;
}

function assertHumanActor(actor = {}) {
  const id = actorId(actor);
  if (!id || isAiActor(actor)) {
    throw error(403, 'HUMAN_REVIEW_REQUIRED', 'La accion requiere un actor humano.');
  }
  return id;
}

function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
}

function buildTruthfulness(payload = {}) {
  return {
    ...(normalizeObject(payload.truthfulness)),
    rendererIsSourceOfTruth: false,
    snapshotIsSourceOfTruth: true,
    humanReviewRequired: true,
    notBoardApproved: true,
    noScoreRecalculation: true,
    noCertification: true
  };
}

function normalizeCreatePayload(payload = {}, actor = {}) {
  const safePayload = omitClientTenantFields(payload);
  const status = normalizeStatus(safePayload.status);

  if (!CREATE_ALLOWED_STATUSES.has(status)) {
    throw error(409, 'INVALID_INITIAL_STATUS', 'El snapshot inicial debe permanecer como draft/review-required.');
  }

  const title = normalizeText(safePayload.title);
  if (!title) {
    throw error(400, 'TITLE_REQUIRED', 'El titulo del Board Review Snapshot es obligatorio.');
  }

  const rendererInput = normalizeObject(safePayload.rendererInput);
  if (Object.keys(rendererInput).length === 0) {
    throw error(400, 'RENDERER_INPUT_REQUIRED', 'rendererInput es obligatorio.');
  }

  return {
    ...safePayload,
    title,
    status,
    snapshotVersion: Number.isInteger(Number(safePayload.snapshotVersion))
      ? Number(safePayload.snapshotVersion)
      : 1,
    rendererVersion: normalizeText(safePayload.rendererVersion, 'html_board_review_v1'),
    sourceModules: normalizeArray(safePayload.sourceModules),
    dataFreshness: normalizeObject(safePayload.dataFreshness),
    rendererInput,
    missingData: normalizeArray(safePayload.missingData),
    insufficientDataFlags: normalizeArray(safePayload.insufficientDataFlags),
    aiMetadata: normalizeObject(safePayload.aiMetadata),
    truthfulness: buildTruthfulness(safePayload),
    auditMetadata: redactBoardReviewPayload({
      ...normalizeObject(safePayload.auditMetadata),
      humanReviewRequired: true,
      statusLabel: 'Board Review Draft',
      notBoardApproved: true
    }),
    createdBy: actorId(actor)
  };
}

async function auditTransition({
  organizationId,
  snapshot,
  actor,
  eventType,
  previousStatus,
  nextStatus,
  result = 'succeeded',
  blockedReason = null,
  metadata = {}
}) {
  return createAuditEvent({
    organizationId,
    snapshotId: snapshot?.id || 'unknown',
    actorId: actorId(actor),
    eventType,
    previousStatus,
    nextStatus,
    result,
    blockedReason,
    metadata: redactBoardReviewPayload(metadata)
  });
}

function assertMutable(snapshot) {
  if (!snapshot) {
    throw error(404, 'BOARD_REVIEW_SNAPSHOT_NOT_FOUND', 'Snapshot no encontrado.');
  }
  if (snapshot.status === BOARD_REVIEW_STATUSES.REVOKED || snapshot.revokedAt) {
    throw error(409, 'BOARD_REVIEW_REVOKED', 'El snapshot revocado no puede modificarse.');
  }
  if (snapshot.status === BOARD_REVIEW_STATUSES.ARCHIVED || snapshot.archivedAt) {
    throw error(409, 'BOARD_REVIEW_ARCHIVED', 'El snapshot archivado es solo lectura.');
  }
}

export async function createBoardReviewSnapshot({ organizationId, actor = {}, payload = {} }) {
  assertOrganizationId(organizationId);
  const normalized = normalizeCreatePayload(payload, actor);

  const snapshot = await createSnapshot({
    organizationId,
    actorId: actorId(actor),
    payload: normalized
  });

  await auditTransition({
    organizationId,
    snapshot,
    actor,
    eventType: 'board_review.snapshot.created',
    previousStatus: null,
    nextStatus: snapshot.status,
    metadata: { title: snapshot.title, sourceModules: snapshot.sourceModules }
  });

  return snapshot;
}

export async function listBoardReviewSnapshots({ organizationId, filters = {} }) {
  assertOrganizationId(organizationId);
  return listSnapshots({ organizationId, filters });
}

export async function getBoardReviewSnapshot({ organizationId, snapshotId }) {
  assertOrganizationId(organizationId);
  const snapshot = await getSnapshotById({ organizationId, snapshotId });

  if (!snapshot) {
    throw error(404, 'BOARD_REVIEW_SNAPSHOT_NOT_FOUND', 'Snapshot no encontrado.');
  }

  return snapshot;
}

export async function markBoardReviewReviewed({
  organizationId,
  snapshotId,
  actor = {},
  reviewMetadata = {}
}) {
  assertOrganizationId(organizationId);
  const snapshot = await getBoardReviewSnapshot({ organizationId, snapshotId });

  try {
    assertMutable(snapshot);
    const reviewer = assertHumanActor(actor);
    const reviewedAt = normalizeText(reviewMetadata.reviewedAt) || new Date().toISOString();
    const updated = await updateSnapshotStatus({
      organizationId,
      snapshotId,
      actorId: reviewer,
      transition: {
        status: BOARD_REVIEW_STATUSES.REVIEWED,
        reviewedBy: reviewer,
        reviewedAt
      }
    });

    await auditTransition({
      organizationId,
      snapshot,
      actor,
      eventType: 'board_review.workflow.reviewed',
      previousStatus: snapshot.status,
      nextStatus: BOARD_REVIEW_STATUSES.REVIEWED,
      metadata: reviewMetadata
    });

    return updated;
  } catch (issue) {
    await auditTransition({
      organizationId,
      snapshot,
      actor,
      eventType: 'board_review.workflow.reviewed',
      previousStatus: snapshot.status,
      nextStatus: BOARD_REVIEW_STATUSES.REVIEWED,
      result: 'blocked',
      blockedReason: issue.code || 'REVIEW_BLOCKED',
      metadata: reviewMetadata
    });
    throw issue;
  }
}

export async function markBoardReviewInternalFinal({
  organizationId,
  snapshotId,
  actor = {},
  approvalMetadata = {}
}) {
  assertOrganizationId(organizationId);
  const snapshot = await getBoardReviewSnapshot({ organizationId, snapshotId });

  try {
    assertMutable(snapshot);
    const approver = assertHumanActor(actor);
    if (snapshot.status !== BOARD_REVIEW_STATUSES.REVIEWED || !snapshot.reviewedAt) {
      throw error(409, 'REVIEW_REQUIRED_BEFORE_INTERNAL_FINAL', 'Internal final requiere revision humana previa.');
    }
    if (approvalMetadata.explicitApproval !== true) {
      throw error(409, 'EXPLICIT_APPROVAL_REQUIRED', 'Internal final requiere aprobacion explicita.');
    }

    const internalFinalAt = normalizeText(approvalMetadata.internalFinalAt) || new Date().toISOString();
    const updated = await updateSnapshotStatus({
      organizationId,
      snapshotId,
      actorId: approver,
      transition: {
        status: BOARD_REVIEW_STATUSES.INTERNAL_FINAL,
        internalFinalBy: approver,
        internalFinalAt
      }
    });

    await auditTransition({
      organizationId,
      snapshot,
      actor,
      eventType: 'board_review.workflow.internal_final_marked',
      previousStatus: snapshot.status,
      nextStatus: BOARD_REVIEW_STATUSES.INTERNAL_FINAL,
      metadata: approvalMetadata
    });

    return updated;
  } catch (issue) {
    await auditTransition({
      organizationId,
      snapshot,
      actor,
      eventType: 'board_review.workflow.internal_final_marked',
      previousStatus: snapshot.status,
      nextStatus: BOARD_REVIEW_STATUSES.INTERNAL_FINAL,
      result: 'blocked',
      blockedReason: issue.code || 'INTERNAL_FINAL_BLOCKED',
      metadata: approvalMetadata
    });
    throw issue;
  }
}

export async function archiveBoardReviewSnapshot({ organizationId, snapshotId, actor = {} }) {
  assertOrganizationId(organizationId);
  const snapshot = await getBoardReviewSnapshot({ organizationId, snapshotId });
  assertMutable(snapshot);

  const updated = await archiveSnapshot({ organizationId, snapshotId, actorId: actorId(actor) });
  await auditTransition({
    organizationId,
    snapshot,
    actor,
    eventType: 'board_review.workflow.archived',
    previousStatus: snapshot.status,
    nextStatus: BOARD_REVIEW_STATUSES.ARCHIVED
  });
  return updated;
}

export async function revokeBoardReviewSnapshot({ organizationId, snapshotId, actor = {} }) {
  assertOrganizationId(organizationId);
  const snapshot = await getBoardReviewSnapshot({ organizationId, snapshotId });
  if (snapshot.status === BOARD_REVIEW_STATUSES.ARCHIVED || snapshot.archivedAt) {
    throw error(409, 'BOARD_REVIEW_ARCHIVED', 'El snapshot archivado es solo lectura.');
  }

  const updated = await revokeSnapshot({ organizationId, snapshotId, actorId: actorId(actor) });
  await auditTransition({
    organizationId,
    snapshot,
    actor,
    eventType: 'board_review.workflow.revoked',
    previousStatus: snapshot.status,
    nextStatus: BOARD_REVIEW_STATUSES.REVOKED
  });
  return updated;
}

export async function listBoardReviewAuditEvents({ organizationId, snapshotId }) {
  assertOrganizationId(organizationId);
  return listAuditEvents({ organizationId, snapshotId });
}
