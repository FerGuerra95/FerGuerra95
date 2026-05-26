import React from 'react';

import { BOARD_REVIEW_DRAFT_LABELS } from '../utils/reportLabels.js';
import { BOARD_REVIEW_STATUSES } from '../utils/boardReviewVersioning.js';
import { resolveBoardReviewWorkflowState } from '../utils/boardReviewWorkflow.js';
import { safeDate, safeText } from '../utils/reportSanitizers.js';

const badgeStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  border: '1px solid rgba(148,163,184,.28)',
  borderRadius: 8,
  padding: '5px 8px',
  fontSize: 11,
  fontWeight: 800,
  textTransform: 'uppercase',
  color: '#e2e8f0',
  background: 'rgba(15,23,42,.72)'
};

const wrapperStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 8,
  alignItems: 'center'
};

export function BoardReviewStatusBadge({
  status,
  humanReviewRequired = true,
  aiUsed,
  reviewedBy,
  reviewedAt,
  internalFinalApproved
}) {
  const workflowStatus = resolveBoardReviewWorkflowState({
    status,
    aiUsed,
    humanReviewed: Boolean(reviewedBy && reviewedAt),
    reviewedBy,
    reviewedAt,
    internalFinalApproved
  });
  const showReviewed = workflowStatus === BOARD_REVIEW_STATUSES.REVIEWED;
  const showInternalFinal = workflowStatus === BOARD_REVIEW_STATUSES.INTERNAL_FINAL;

  return (
    <div style={wrapperStyle} aria-label="Board Review Draft workflow status">
      <span style={badgeStyle}>{BOARD_REVIEW_DRAFT_LABELS.status}</span>
      {humanReviewRequired && !showReviewed && !showInternalFinal ? (
        <span style={badgeStyle}>{BOARD_REVIEW_DRAFT_LABELS.humanReview}</span>
      ) : null}
      {aiUsed ? <span style={badgeStyle}>AI Draft</span> : null}
      {showReviewed ? <span style={badgeStyle}>Reviewed</span> : null}
      {showInternalFinal ? <span style={badgeStyle}>Internal Final</span> : null}
      {workflowStatus === BOARD_REVIEW_STATUSES.REVOKED ? <span style={badgeStyle}>Revoked</span> : null}
      {workflowStatus === BOARD_REVIEW_STATUSES.ARCHIVED ? <span style={badgeStyle}>Archived</span> : null}
      <span style={badgeStyle}>{BOARD_REVIEW_DRAFT_LABELS.notBoardApproved}</span>
      {showReviewed ? <span style={badgeStyle}>Reviewed by {safeText(reviewedBy)}</span> : null}
      {showReviewed ? <span style={badgeStyle}>Reviewed at {safeDate(reviewedAt)}</span> : null}
    </div>
  );
}

export default BoardReviewStatusBadge;
