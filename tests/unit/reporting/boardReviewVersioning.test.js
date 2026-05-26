import { describe, expect, it } from 'vitest';

import {
  BOARD_REVIEW_STATUSES,
  createBoardReviewVersionMetadata,
  resolveBoardReviewStatus
} from '../../../src/modules/reporting/utils/boardReviewVersioning.js';

describe('boardReviewVersioning', () => {
  it('defaults to human_review_required', () => {
    expect(resolveBoardReviewStatus()).toBe(BOARD_REVIEW_STATUSES.HUMAN_REVIEW_REQUIRED);
  });

  it('falls back on invalid status', () => {
    expect(resolveBoardReviewStatus({ status: 'board_approved' })).toBe(BOARD_REVIEW_STATUSES.HUMAN_REVIEW_REQUIRED);
  });

  it('does not let AI-only output become reviewed', () => {
    expect(resolveBoardReviewStatus({ status: 'reviewed', aiOnly: true, humanReviewed: true }))
      .toBe(BOARD_REVIEW_STATUSES.HUMAN_REVIEW_REQUIRED);
  });

  it('requires humanReviewed true for reviewed', () => {
    expect(resolveBoardReviewStatus({ status: 'reviewed' })).toBe(BOARD_REVIEW_STATUSES.HUMAN_REVIEW_REQUIRED);
    expect(resolveBoardReviewStatus({ status: 'reviewed', humanReviewed: true })).toBe(BOARD_REVIEW_STATUSES.REVIEWED);
  });

  it('requires internalFinalApproved true for internal_final', () => {
    expect(resolveBoardReviewStatus({ status: 'internal_final' })).toBe(BOARD_REVIEW_STATUSES.HUMAN_REVIEW_REQUIRED);
    expect(resolveBoardReviewStatus({ status: 'internal_final', internalFinalApproved: true }))
      .toBe(BOARD_REVIEW_STATUSES.INTERNAL_FINAL);
  });

  it('preserves revoked and never returns board_approved', () => {
    expect(resolveBoardReviewStatus({ status: 'revoked' })).toBe(BOARD_REVIEW_STATUSES.REVOKED);
    expect(Object.values(BOARD_REVIEW_STATUSES)).not.toContain('board_approved');
  });

  it('creates safe version metadata', () => {
    const metadata = createBoardReviewVersionMetadata({
      version: 'v2',
      status: 'reviewed',
      generatedAt: '2026-05-26T10:00:00.000Z',
      reviewedAt: '2026-05-26T11:00:00.000Z',
      reviewedBy: 'Ops reviewer',
      humanReviewed: true,
      aiUsed: true,
      promptVersion: 'BOARD_REVIEW_DRAFT_V1'
    });

    expect(metadata.version).toBe('v2');
    expect(metadata.status).toBe('reviewed');
    expect(metadata.reviewedBy).toBe('Ops reviewer');
    expect(metadata.promptVersion).toBe('BOARD_REVIEW_DRAFT_V1');
  });
});
