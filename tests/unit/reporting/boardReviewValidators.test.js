import { describe, expect, it } from 'vitest';

import { reportingValidator } from '../../../backend/api/validators/reporting.validator.js';

describe('boardReview validators', () => {
  it('strips client tenant fields while accepting valid create payloads', () => {
    const next = reportingValidator.boardReviewCreate.body({
      organizationId: 'client_org',
      orgId: 'client_org',
      title: 'Board Review Draft',
      status: 'human_review_required',
      rendererInput: { moduleSignals: [] }
    });

    expect(next.organizationId).toBeUndefined();
    expect(next.orgId).toBeUndefined();
    expect(next.title).toBe('Board Review Draft');
  });

  it('rejects board_approved and invalid statuses', () => {
    expect(() =>
      reportingValidator.boardReviewCreate.body({
        title: 'Invalid',
        status: 'board_approved',
        rendererInput: {}
      })
    ).toThrow(/status/i);
  });

  it('rejects sensitive keys in payloads', () => {
    expect(() =>
      reportingValidator.boardReviewCreate.body({
        title: 'Secret',
        rendererInput: {},
        metadata: { token: 'abc' }
      })
    ).toThrow(/sensibles/i);
  });

  it('requires explicitApproval for internal final transition', () => {
    expect(() =>
      reportingValidator.boardReviewInternalFinal.body({
        approvalMetadata: { explicitApproval: false }
      })
    ).toThrow(/explicitApproval/i);

    expect(
      reportingValidator.boardReviewInternalFinal.body({
        approvalMetadata: { explicitApproval: true }
      }).approvalMetadata.explicitApproval
    ).toBe(true);
  });
});
