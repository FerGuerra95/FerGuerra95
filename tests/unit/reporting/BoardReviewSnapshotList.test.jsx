import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { BoardReviewSnapshotList } from '../../../src/modules/reporting/components/BoardReviewSnapshotList.jsx';

describe('BoardReviewSnapshotList', () => {
  it('renders persisted snapshots with status', () => {
    render(
      <BoardReviewSnapshotList
        snapshots={[{
          id: 'snap_1',
          title: 'Persisted Draft',
          status: 'human_review_required',
          createdAt: '2026-05-26T10:00:00.000Z'
        }]}
      />
    );

    expect(screen.getByText('Persisted Draft')).toBeTruthy();
    expect(screen.getByText('Board Review Draft')).toBeTruthy();
    expect(screen.getByText('Human Review Required')).toBeTruthy();
  });

  it('blocks active preview for revoked snapshots', () => {
    const onPreview = vi.fn();
    render(
      <BoardReviewSnapshotList
        snapshots={[{
          id: 'snap_1',
          title: 'Revoked Draft',
          status: 'revoked',
          createdAt: '2026-05-26T10:00:00.000Z'
        }]}
        onPreview={onPreview}
      />
    );

    expect(screen.getByText('Revoked').disabled).toBe(true);
    expect(screen.getByText(/cannot be previewed as an active Board Review Draft/)).toBeTruthy();
    expect(onPreview).not.toHaveBeenCalled();
  });

  it('does not render certified claim', () => {
    const { container } = render(<BoardReviewSnapshotList snapshots={[]} />);

    expect(container.textContent).not.toMatch(/Certified PDF/i);
  });
});
