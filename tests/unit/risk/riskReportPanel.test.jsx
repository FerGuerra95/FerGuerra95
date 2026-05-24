import React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { RiskReportsPanel } from '../../../src/modules/risk/components/RiskEnterpriseComponents.jsx';

describe('RiskReportsPanel truthfulness', () => {
  it('renders operational DSS disclaimer and scoring model label', () => {
    render(
      <RiskReportsPanel
        items={[
          {
            id: 'rep-1',
            title: 'Enterprise Risk Brief',
            reportType: 'enterprise_risk_brief',
            status: 'generated',
            createdAt: '2026-05-23',
            payload: {
              humanReviewRequired: true,
              scoringTruthfulness: {
                operationalModel: 'operationalEnterpriseRiskScore',
                goldenBenchmarkModel: 'riskLikelihoodImpactGolden'
              },
              boardReadyMemo: {
                disclaimer:
                  'Decision-support output using operationalEnterpriseRiskScore heuristic. Not a certified risk rating.'
              }
            }
          }
        ]}
      />
    );

    expect(screen.getByText(/operationalEnterpriseRiskScore heuristic/i)).toBeTruthy();
    expect(screen.getByText(/operationalEnterpriseRiskScore · DSS/)).toBeTruthy();
    expect(screen.getByText(/not a certified risk rating/i)).toBeTruthy();
    expect(screen.queryByText(/Golden score/i)).toBeNull();
  });

  it('shows empty-state human review message without NaN/Infinity', () => {
    render(<RiskReportsPanel items={[]} />);

    expect(screen.getByText(/Human review required before board use/i)).toBeTruthy();
    expect(screen.queryByText(/NaN/i)).toBeNull();
    expect(screen.queryByText(/Infinity/i)).toBeNull();
  });
});
