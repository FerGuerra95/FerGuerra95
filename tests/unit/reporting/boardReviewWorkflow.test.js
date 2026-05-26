import { describe, expect, it } from 'vitest';

import { BOARD_REVIEW_STATUSES } from '../../../src/modules/reporting/utils/boardReviewVersioning.js';
import {
  canTransitionBoardReviewStatus,
  markReviewIntent,
  resolveBoardReviewWorkflowState,
  validateInternalFinalEligibility
} from '../../../src/modules/reporting/utils/boardReviewWorkflow.js';

describe('boardReviewWorkflow', () => {
  it('defaults workflow state to human_review_required', () => {
    expect(resolveBoardReviewWorkflowState()).toBe(BOARD_REVIEW_STATUSES.HUMAN_REVIEW_REQUIRED);
  });

  it('blocks AI-only transitions to reviewed and internal_final', () => {
    expect(canTransitionBoardReviewStatus({
      fromStatus: 'ai_draft',
      toStatus: 'reviewed',
      actor: 'Reviewer',
      humanReviewed: true,
      aiUsed: true
    })).toBe(false);
    expect(canTransitionBoardReviewStatus({
      fromStatus: 'reviewed',
      toStatus: 'internal_final',
      actor: 'Reviewer',
      internalFinalApproved: true,
      humanReviewed: true,
      aiUsed: true
    })).toBe(false);
  });

  it('requires humanReviewed true and actor for reviewed', () => {
    expect(canTransitionBoardReviewStatus({ fromStatus: 'human_review_required', toStatus: 'reviewed', actor: 'A' })).toBe(false);
    expect(canTransitionBoardReviewStatus({ fromStatus: 'human_review_required', toStatus: 'reviewed', actor: 'A', humanReviewed: true })).toBe(true);
  });

  it('requires reviewed state and explicit approval for internal_final', () => {
    expect(canTransitionBoardReviewStatus({
      fromStatus: 'human_review_required',
      toStatus: 'internal_final',
      actor: 'A',
      internalFinalApproved: true,
      humanReviewed: true
    })).toBe(false);
    expect(canTransitionBoardReviewStatus({
      fromStatus: 'reviewed',
      toStatus: 'internal_final',
      actor: 'A',
      internalFinalApproved: true,
      humanReviewed: true
    })).toBe(true);
  });

  it('blocks internal_final with critical unresolved limitations', () => {
    const eligibility = validateInternalFinalEligibility({
      status: 'reviewed',
      humanReviewed: true,
      reviewedBy: 'A',
      reviewedAt: '2026-05-26T10:00:00.000Z',
      internalFinalApproved: true,
      unresolvedLimitations: ['critical unresolved evidence']
    });

    expect(eligibility.eligible).toBe(false);
    expect(eligibility.blockedReasons).toContain('critical_limitations_unresolved');
  });

  it('preserves revoked and archived states', () => {
    expect(resolveBoardReviewWorkflowState({ revoked: true })).toBe('revoked');
    expect(resolveBoardReviewWorkflowState({ archived: true })).toBe('archived');
  });

  it('does not support board_approved and requires manual reset', () => {
    expect(canTransitionBoardReviewStatus({ fromStatus: 'draft', toStatus: 'board_approved', actor: 'A' })).toBe(false);
    expect(canTransitionBoardReviewStatus({ fromStatus: 'revoked', toStatus: 'draft', actor: 'A' })).toBe(false);
    expect(canTransitionBoardReviewStatus({ fromStatus: 'revoked', toStatus: 'draft', actor: 'A', manualAction: true })).toBe(true);
  });

  it('marks review intent as preview only and requiring backend persistence', () => {
    const intent = markReviewIntent({
      action: 'mark_reviewed',
      actor: 'Reviewer',
      timestamp: '2026-05-26T10:00:00.000Z',
      currentStatus: 'human_review_required'
    });

    expect(intent.previewOnly).toBe(true);
    expect(intent.requiresBackendPersistence).toBe(true);
  });
});
