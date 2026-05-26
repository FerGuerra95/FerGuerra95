import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { BoardReviewStatusBadge } from '../../../src/modules/reporting/components/BoardReviewStatusBadge.jsx';

describe('BoardReviewStatusBadge', () => {
  it('renders Board Review Draft and Human Review Required', () => {
    render(<BoardReviewStatusBadge status="human_review_required" />);

    expect(screen.getByText('Board Review Draft')).toBeTruthy();
    expect(screen.getByText('Human Review Required')).toBeTruthy();
    expect(screen.getByText('Not Board Approved')).toBeTruthy();
  });

  it('renders AI Draft when aiUsed', () => {
    render(<BoardReviewStatusBadge status="ai_draft" aiUsed />);

    expect(screen.getByText('AI Draft')).toBeTruthy();
  });

  it('renders Reviewed only with valid metadata', () => {
    render(
      <BoardReviewStatusBadge
        status="reviewed"
        reviewedBy="Reviewer"
        reviewedAt="2026-05-26T10:00:00.000Z"
      />
    );

    expect(screen.getByText('Reviewed')).toBeTruthy();
    expect(screen.getByText(/Reviewed by Reviewer/)).toBeTruthy();
  });

  it('renders Internal Final only with explicit metadata', () => {
    render(<BoardReviewStatusBadge status="internal_final" internalFinalApproved />);

    expect(screen.getByText('Internal Final')).toBeTruthy();
  });

  it('never renders prohibited claims', () => {
    const { container } = render(<BoardReviewStatusBadge status="reviewed" />);

    expect(container.textContent).not.toMatch(/board-approved/i);
    expect(container.textContent).not.toMatch(/certified/i);
  });
});
