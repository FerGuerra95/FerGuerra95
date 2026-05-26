import { safeDate, safeText } from './reportSanitizers.js';

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

export function resolveBoardReviewStatus(input = {}) {
  const source = input && typeof input === 'object' ? input : { status: input };
  const requestedStatus = safeText(source.status, BOARD_REVIEW_STATUSES.HUMAN_REVIEW_REQUIRED);

  if (!ALLOWED_STATUSES.has(requestedStatus)) {
    return BOARD_REVIEW_STATUSES.HUMAN_REVIEW_REQUIRED;
  }

  if (requestedStatus === BOARD_REVIEW_STATUSES.REVOKED || requestedStatus === BOARD_REVIEW_STATUSES.ARCHIVED) {
    return requestedStatus;
  }

  if (source.aiOnly === true) {
    return requestedStatus === BOARD_REVIEW_STATUSES.AI_DRAFT
      ? BOARD_REVIEW_STATUSES.AI_DRAFT
      : BOARD_REVIEW_STATUSES.HUMAN_REVIEW_REQUIRED;
  }

  if (requestedStatus === BOARD_REVIEW_STATUSES.INTERNAL_FINAL) {
    return source.internalFinalApproved === true
      ? BOARD_REVIEW_STATUSES.INTERNAL_FINAL
      : BOARD_REVIEW_STATUSES.HUMAN_REVIEW_REQUIRED;
  }

  if (requestedStatus === BOARD_REVIEW_STATUSES.REVIEWED) {
    return source.humanReviewed === true && source.aiOnly !== true
      ? BOARD_REVIEW_STATUSES.REVIEWED
      : BOARD_REVIEW_STATUSES.HUMAN_REVIEW_REQUIRED;
  }

  return requestedStatus || BOARD_REVIEW_STATUSES.HUMAN_REVIEW_REQUIRED;
}

export function createBoardReviewVersionMetadata({
  version,
  status,
  createdAt,
  generatedAt,
  reviewedAt,
  reviewedBy,
  source,
  aiUsed,
  promptVersion,
  humanReviewed,
  internalFinalApproved,
  aiOnly
} = {}) {
  const resolvedStatus = resolveBoardReviewStatus({
    status,
    humanReviewed,
    internalFinalApproved,
    aiOnly,
    aiUsed
  });
  const isReviewed = resolvedStatus === BOARD_REVIEW_STATUSES.REVIEWED;

  return {
    version: safeText(version, 'draft-preview-1'),
    status: resolvedStatus,
    createdAt: safeDate(createdAt || generatedAt || new Date()),
    generatedAt: safeDate(generatedAt || createdAt || new Date()),
    reviewedAt: isReviewed ? safeDate(reviewedAt) : 'N/A',
    reviewedBy: isReviewed ? safeText(reviewedBy, 'N/A') : 'N/A',
    source: safeText(source, 'reporting_preview'),
    aiUsed: aiUsed === true,
    promptVersion: aiUsed === true ? safeText(promptVersion, 'N/A') : 'N/A'
  };
}
