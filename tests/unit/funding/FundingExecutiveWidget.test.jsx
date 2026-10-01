import React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { FundingExecutiveWidget } from '../../../src/modules/funding/components/FundingExecutiveWidget.jsx';

describe('FundingExecutiveWidget', () => {
  it('renders persisted enterprise source labels', () => {
    render(<FundingExecutiveWidget summary={{}} currency="EUR" />);

    expect(screen.getByText('Funding rounds summary')).toBeTruthy();
    expect(
      screen.getByText(/From enterprise funding rounds and stored round records/i)
    ).toBeTruthy();
  });

  it('renders safe fallbacks for incomplete summary data', () => {
    render(<FundingExecutiveWidget summary={{}} currency="EUR" />);

    expect(
      screen.getByText('Liquidity and runway').parentElement?.textContent
    ).toContain('Insufficient data');
    expect(screen.getByText('Runway status').parentElement?.textContent).toContain(
      'Insufficient data'
    );
    expect(
      screen.getByText('Monthly burn rate').parentElement?.textContent
    ).toContain('Insufficient data');
    expect(screen.getByText('Funding window').parentElement?.textContent).toContain(
      'Insufficient data'
    );
    expect(screen.getByText('Pending data')).toBeTruthy();
    expect(screen.getByText('Not available')).toBeTruthy();
    expect(screen.getByText(/Human review:/i)).toBeTruthy();
  });

  it('renders enterprise statuses without NaN/Infinity', () => {
    render(
      <FundingExecutiveWidget
        summary={{
          projectedRunwayMonths: 12,
          monthlyBurnRate: 75000,
          totalAmountRaised: 450000,
          complianceStatus: 'validated',
          optimalFundingWindowStatus: 'open',
          requiresExecutiveUpdate: true,
          humanReviewRequired: true
        }}
        currency="EUR"
      />
    );

    expect(screen.getByText('12 months')).toBeTruthy();
    expect(screen.getByText('validated')).toBeTruthy();
    expect(screen.getByText('Open')).toBeTruthy();
    expect(screen.getByText('Requires update')).toBeTruthy();
    expect(screen.queryByText(/NaN/i)).toBeNull();
    expect(screen.queryByText(/Infinity/i)).toBeNull();
  });
});
