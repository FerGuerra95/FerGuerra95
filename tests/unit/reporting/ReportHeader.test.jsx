import React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { ReportHeader } from '../../../src/modules/reporting/components/ReportHeader.jsx';

describe('ReportHeader', () => {
  it('renders logo, status labels, generated metadata, and human review label', () => {
    render(
      <ReportHeader
        logoSrc="/brand/ceos-logo.svg"
        title="Q2 Board Review Draft"
        generatedAt="2026-05-26T10:00:00.000Z"
        organizationName="Acme Holdings"
        scopeLabel="Reporting"
        humanReviewRequired
      />
    );

    expect(screen.getByAltText("CEO's OS")).toBeTruthy();
    expect(screen.getByText('Q2 Board Review Draft')).toBeTruthy();
    expect(screen.getByText('Board Review Draft')).toBeTruthy();
    expect(screen.getByText('Human Review Required')).toBeTruthy();
    expect(screen.getByText('Not Board Approved')).toBeTruthy();
    expect(screen.getByText(/Generated at:/)).toBeTruthy();
    expect(screen.getByText(/Acme Holdings - Reporting/)).toBeTruthy();
  });

  it('renders fallback text mark without logoSrc', () => {
    render(<ReportHeader title="Draft" logoSrc="" generatedAt="2026-05-26T10:00:00.000Z" />);

    expect(screen.getByText("CEO's OS")).toBeTruthy();
  });
});
