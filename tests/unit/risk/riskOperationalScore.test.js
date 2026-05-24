import { describe, expect, it } from 'vitest';

import { calculateRiskLikelihoodImpactGolden } from '../../../backend/services/risk/riskGoldenFormulas.js';
import { calculateRiskMetrics, riskScoreFrom } from '../../../backend/services/risk/risk.service.js';

/**
 * operationalEnterpriseRiskScore — product DSS heuristic for Risk Enterprise item scoring.
 * Implemented today as `riskScoreFrom()` in risk.service.js (C.13.6B Option C).
 * Not the Golden benchmark (`riskLikelihoodImpactGolden` / calculateRiskLikelihoodImpactGolden).
 */
const operationalEnterpriseRiskScore = riskScoreFrom;

function expectOperationalScore(risk, expectedScore, mode = 'residual') {
  expect(operationalEnterpriseRiskScore(risk, mode)).toBe(expectedScore);
}

describe('operationalEnterpriseRiskScore — Risk DSS heuristic (riskScoreFrom)', () => {
  it('combines residual/inherent severity rank with likelihood and impact (0–100)', () => {
    expectOperationalScore(
      { inherentSeverity: 'critical', residualRisk: 'critical', likelihood: 5, impact: 5 },
      100
    );
    expectOperationalScore(
      { inherentSeverity: 'high', residualRisk: 'medium', likelihood: 3, impact: 4 },
      67
    );
    expectOperationalScore(
      { inherentSeverity: 'medium', residualRisk: 'medium', likelihood: 2, impact: 2 },
      47
    );
  });

  it('supports inherent mode using inherentSeverity only', () => {
    expectOperationalScore(
      { inherentSeverity: 'critical', residualRisk: 'medium', likelihood: 4, impact: 5 },
      93,
      'inherent'
    );
  });

  it('clamps likelihood and impact to 1–5 scale', () => {
    expectOperationalScore(
      { inherentSeverity: 'low', residualRisk: 'low', likelihood: 0, impact: 10 },
      53
    );
  });

  it('defaults missing likelihood and impact to 2', () => {
    expectOperationalScore(
      { inherentSeverity: 'medium', residualRisk: 'medium' },
      47
    );
  });

  it('maps unknown severity labels to default rank 1 in operational scoring', () => {
    expectOperationalScore(
      { inherentSeverity: 'watch', residualRisk: 'watch', likelihood: 2, impact: 2 },
      33
    );
  });

  it('feeds calculateRiskMetrics residualRisk as portfolio average of operational scores', () => {
    const metrics = calculateRiskMetrics({
      risks: [
        {
          inherentSeverity: 'critical',
          residualRisk: 'critical',
          likelihood: 4,
          impact: 5,
          status: 'open'
        }
      ]
    });

    expect(metrics.residualRisk).toBe(93);
  });

  it('flags critical risks via operational score threshold and residual severity', () => {
    const metrics = calculateRiskMetrics({
      risks: [
        {
          inherentSeverity: 'critical',
          residualRisk: 'critical',
          likelihood: 4,
          impact: 5,
          status: 'open'
        }
      ]
    });

    expect(metrics.criticalRiskCount).toBe(1);
    expect(metrics.riskPosture).toBe('critical');
  });

  it('is not equivalent to riskLikelihoodImpactGolden (dual-layer Option C)', () => {
    const goldenScore = calculateRiskLikelihoodImpactGolden({
      likelihood: 4,
      impact: 5
    });

    expect(goldenScore).toBe(20);

    const operationalScore = operationalEnterpriseRiskScore({
      inherentSeverity: 'critical',
      residualRisk: 'critical',
      likelihood: 4,
      impact: 5
    });

    expect(operationalScore).not.toBe(goldenScore);
    expect(operationalScore).toBe(93);
  });
});
