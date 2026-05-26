import { BOARD_REVIEW_STATUSES, resolveBoardReviewStatus } from './boardReviewVersioning.js';
import { normalizeMissingData, safeDate, safeList, safeText } from './reportSanitizers.js';

export const BOARD_REVIEW_ACTIONS = Object.freeze({
  REQUEST_REVIEW: 'request_review',
  MARK_REVIEWED: 'mark_reviewed',
  MARK_INTERNAL_FINAL: 'mark_internal_final',
  ARCHIVE: 'archive',
  REVOKE: 'revoke',
  RESET_TO_DRAFT: 'reset_to_draft'
});

const CRITICAL_LIMITATION_PATTERN = /critical|unresolved|blocker/i;

function hasReviewMetadata({ humanReviewed, reviewedBy, reviewActor, reviewedAt, timestamp } = {}) {
  return humanReviewed === true
    && Boolean(safeText(reviewedBy || reviewActor, ''))
    && safeDate(reviewedAt || timestamp) !== 'N/A';
}

export function resolveBoardReviewWorkflowState({
  status,
  aiUsed,
  humanReviewed,
  internalFinalApproved,
  reviewedBy,
  reviewActor,
  reviewedAt,
  timestamp,
  revoked,
  archived
} = {}) {
  if (revoked === true) {
    return BOARD_REVIEW_STATUSES.REVOKED;
  }
  if (archived === true) {
    return BOARD_REVIEW_STATUSES.ARCHIVED;
  }

  return resolveBoardReviewStatus({
    status: status || BOARD_REVIEW_STATUSES.HUMAN_REVIEW_REQUIRED,
    aiOnly: aiUsed === true && humanReviewed !== true,
    humanReviewed: hasReviewMetadata({ humanReviewed, reviewedBy, reviewActor, reviewedAt, timestamp }),
    internalFinalApproved: internalFinalApproved === true
  });
}

export function canTransitionBoardReviewStatus({
  fromStatus,
  toStatus,
  actor,
  humanReviewed,
  internalFinalApproved,
  aiUsed,
  manualAction
} = {}) {
  const knownStatuses = new Set(Object.values(BOARD_REVIEW_STATUSES));
  const from = knownStatuses.has(fromStatus)
    ? fromStatus
    : resolveBoardReviewWorkflowState({ status: fromStatus });
  const actorPresent = Boolean(actor);

  if (toStatus === 'board_approved') {
    return false;
  }

  if (from === BOARD_REVIEW_STATUSES.REVOKED || from === BOARD_REVIEW_STATUSES.ARCHIVED) {
    return toStatus === BOARD_REVIEW_STATUSES.DRAFT && manualAction === true && actorPresent;
  }

  if (toStatus === BOARD_REVIEW_STATUSES.REVIEWED) {
    return aiUsed !== true && humanReviewed === true && actorPresent;
  }

  if (toStatus === BOARD_REVIEW_STATUSES.INTERNAL_FINAL) {
    return aiUsed !== true
      && internalFinalApproved === true
      && actorPresent
      && from === BOARD_REVIEW_STATUSES.REVIEWED
      && humanReviewed === true;
  }

  if (toStatus === BOARD_REVIEW_STATUSES.ARCHIVED || toStatus === BOARD_REVIEW_STATUSES.REVOKED) {
    return actorPresent && manualAction === true;
  }

  if (toStatus === BOARD_REVIEW_STATUSES.DRAFT) {
    return actorPresent && manualAction === true;
  }

  return toStatus === BOARD_REVIEW_STATUSES.HUMAN_REVIEW_REQUIRED || toStatus === BOARD_REVIEW_STATUSES.AI_DRAFT;
}

export function buildHumanReviewChecklistState({
  checklist,
  reviewedItems,
  requiredItems
} = {}) {
  const items = safeList(checklist);
  const reviewed = new Set(safeList(reviewedItems).map((item) => safeText(item)));
  const required = new Set(safeList(requiredItems).map((item) => safeText(item)));

  return items.map((item) => {
    const label = safeText(item);
    return {
      label,
      required: required.size === 0 || required.has(label),
      reviewed: reviewed.has(label)
    };
  });
}

export function validateInternalFinalEligibility({
  status,
  humanReviewed,
  reviewedBy,
  reviewedAt,
  internalFinalApproved,
  insufficientDataFlags,
  unresolvedLimitations
} = {}) {
  const limitations = safeList(unresolvedLimitations).map((item) => safeText(item));
  const hasCriticalLimitation = limitations.some((item) => CRITICAL_LIMITATION_PATTERN.test(item));
  const hasReview = hasReviewMetadata({ humanReviewed, reviewedBy, reviewedAt });
  const normalizedStatus = resolveBoardReviewWorkflowState({ status, humanReviewed, reviewedBy, reviewedAt });
  const insufficientFlags = normalizeMissingData(insufficientDataFlags);
  const eligible = internalFinalApproved === true
    && hasReview
    && normalizedStatus === BOARD_REVIEW_STATUSES.REVIEWED
    && !hasCriticalLimitation;

  return {
    eligible,
    status: eligible ? BOARD_REVIEW_STATUSES.INTERNAL_FINAL : BOARD_REVIEW_STATUSES.HUMAN_REVIEW_REQUIRED,
    humanReviewPresent: hasReview,
    internalFinalApproved: internalFinalApproved === true,
    insufficientDataFlags: insufficientFlags,
    unresolvedLimitations: limitations,
    blockedReasons: [
      hasReview ? null : 'human_review_required',
      internalFinalApproved === true ? null : 'internal_final_approval_required',
      hasCriticalLimitation ? 'critical_limitations_unresolved' : null
    ].filter(Boolean)
  };
}

export function markReviewIntent({
  action,
  actor,
  timestamp = new Date(),
  currentStatus
} = {}) {
  const allowed = canTransitionBoardReviewStatus({
    fromStatus: currentStatus,
    toStatus: action === BOARD_REVIEW_ACTIONS.MARK_REVIEWED
      ? BOARD_REVIEW_STATUSES.REVIEWED
      : BOARD_REVIEW_STATUSES.HUMAN_REVIEW_REQUIRED,
    actor,
    humanReviewed: action === BOARD_REVIEW_ACTIONS.MARK_REVIEWED,
    manualAction: true
  });

  return {
    action: safeText(action, BOARD_REVIEW_ACTIONS.REQUEST_REVIEW),
    actor: safeText(actor, 'N/A'),
    timestamp: safeDate(timestamp),
    previewOnly: true,
    requiresBackendPersistence: true,
    allowed
  };
}
