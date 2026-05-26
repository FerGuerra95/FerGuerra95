import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { BoardReviewSnapshotActions } from '../../../src/modules/reporting/components/BoardReviewSnapshotActions.jsx';

describe('BoardReviewSnapshotActions', () => {
  it('disables internal final before reviewed status', () => {
    render(
      <BoardReviewSnapshotActions
        snapshot={{ id: 'snap_1', status: 'human_review_required' }}
        canCreate
        canReview
        canFinalize
        canArchive
      />
    );

    expect(screen.getByText('Mark internal final').disabled).toBe(true);
  });

  it('fires review action only through explicit handler', () => {
    const onMarkReviewed = vi.fn();
    render(
      <BoardReviewSnapshotActions
        snapshot={{ id: 'snap_1', status: 'human_review_required' }}
        canCreate
        canReview
        canFinalize
        canArchive
        onMarkReviewed={onMarkReviewed}
      />
    );

    screen.getByText('Mark reviewed').click();
    expect(onMarkReviewed).toHaveBeenCalledWith({ id: 'snap_1', status: 'human_review_required' });
  });

  it('does not claim board approval or certified PDF', () => {
    const { container } = render(
      <BoardReviewSnapshotActions
        snapshot={{ id: 'snap_1', status: 'reviewed' }}
        canCreate
        canReview
        canFinalize
        canArchive
      />
    );

    expect(container.textContent).not.toMatch(/Certified PDF/i);
    expect(container.textContent).toMatch(/not board approval/i);
  });
});
