import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { BoardReviewWorkflowPanel } from '../../../src/modules/reporting/components/BoardReviewWorkflowPanel.jsx';

const snapshot = {
  status: 'human_review_required',
  aiMetadata: null,
  insufficientDataFlags: ['risk:insufficient_data'],
  versionMetadata: {
    status: 'human_review_required',
    reviewedBy: 'N/A',
    reviewedAt: 'N/A'
  },
  auditMetadata: {
    exportType: 'html_preview',
    previewOnly: true,
    limitations: ['Human Review Required']
  },
  rendererInput: {
    humanReviewChecklist: ['Confirm source labels.']
  }
};

describe('BoardReviewWorkflowPanel', () => {
  it('shows preview-only and backend persistence note', () => {
    render(<BoardReviewWorkflowPanel snapshot={snapshot} />);

    expect(screen.getByText(/Preview only/)).toBeTruthy();
    expect(screen.getByText(/Requires backend persistence/)).toBeTruthy();
  });

  it('shows missing data and limitations', () => {
    render(<BoardReviewWorkflowPanel snapshot={snapshot} />);

    expect(screen.getByText('risk:insufficient_data')).toBeTruthy();
    expect(screen.getAllByText('Human Review Required').length).toBeGreaterThan(0);
  });

  it('disables internal-final action without eligibility', () => {
    render(<BoardReviewWorkflowPanel snapshot={snapshot} />);

    expect(screen.getByText(/Mark internal final/).disabled).toBe(true);
  });

  it('does not claim save or persistence completion', () => {
    const { container } = render(<BoardReviewWorkflowPanel snapshot={snapshot} />);

    expect(container.textContent).not.toMatch(/\bsaved\b/i);
    expect(container.textContent).not.toMatch(/\bpersisted\b/i);
  });
});
