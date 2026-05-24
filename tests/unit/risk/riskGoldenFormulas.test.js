import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

import {
  calculateRiskLikelihoodImpactGolden,
  calculateRiskLikelihoodImpactGoldenResult,
  classifyRiskSeverityBandGolden
} from '../../../backend/services/risk/riskGoldenFormulas.js';
import { calculateRiskMetrics } from '../../../backend/services/risk/risk.service.js';

const GOLDEN_PATH = path.join(process.cwd(), 'docs/testing/golden_inputs.json');
const GOLDEN_RISK_LIKELIHOOD_IMPACT_ID = 'risk_score_likelihood_impact_basic';

function loadGoldenJson() {
  return JSON.parse(fs.readFileSync(GOLDEN_PATH, 'utf8'));
}

describe('riskGoldenFormulas — RISK_LIKELIHOOD_IMPACT (golden risk_score_likelihood_impact_basic)', () => {
  it('matches golden riskScore = likelihood × impact', () => {
    const golden = loadGoldenJson();
    const dataset = golden.datasets[GOLDEN_RISK_LIKELIHOOD_IMPACT_ID];
    const result = calculateRiskLikelihoodImpactGolden(dataset.inputs);

    expect(result).toBe(dataset.expected.riskScore);
    expect(result).toBe(20);
  });

  it('matches golden severity band critical for score 20', () => {
    const golden = loadGoldenJson();
    const dataset = golden.datasets[GOLDEN_RISK_LIKELIHOOD_IMPACT_ID];
    const result = calculateRiskLikelihoodImpactGoldenResult(dataset.inputs);

    expect(result).toEqual({
      riskScore: dataset.expected.riskScore,
      severity: dataset.expected.severity
    });
    expect(result?.severity).toBe('critical');
  });

  it('accepts numeric string inputs (same policy as maGoldenFormulas)', () => {
    expect(
      calculateRiskLikelihoodImpactGolden({
        likelihood: '4',
        impact: '5'
      })
    ).toBe(20);
  });

  it('returns null when likelihood or impact is missing', () => {
    expect(calculateRiskLikelihoodImpactGolden({ impact: 5 })).toBeNull();
    expect(calculateRiskLikelihoodImpactGolden({ likelihood: 4 })).toBeNull();
  });

  it('returns null for non-finite inputs', () => {
    expect(calculateRiskLikelihoodImpactGolden({ likelihood: NaN, impact: 5 })).toBeNull();
    expect(calculateRiskLikelihoodImpactGolden({ likelihood: 4, impact: Infinity })).toBeNull();
    expect(calculateRiskLikelihoodImpactGolden({ likelihood: 4, impact: 'bad' })).toBeNull();
  });

  it('returns null when likelihood or impact is outside Golden 1–5 scale', () => {
    expect(calculateRiskLikelihoodImpactGolden({ likelihood: 0, impact: 5 })).toBeNull();
    expect(calculateRiskLikelihoodImpactGolden({ likelihood: 4, impact: 6 })).toBeNull();
  });

  it('classifies Golden severity bands (low / medium / high / critical)', () => {
    expect(classifyRiskSeverityBandGolden(3)).toBe('low');
    expect(classifyRiskSeverityBandGolden(8)).toBe('medium');
    expect(classifyRiskSeverityBandGolden(12)).toBe('high');
    expect(classifyRiskSeverityBandGolden(20)).toBe('critical');
  });

  it('documents product operationalEnterpriseRiskScore uses a different model (C13-P1-08)', () => {
    const goldenScore = calculateRiskLikelihoodImpactGolden({
      likelihood: 4,
      impact: 5
    });

    expect(goldenScore).toBe(20);

    // Product uses riskScoreFrom via calculateRiskMetrics — severity + likelihood + impact normalized 0–100.
    const operational = calculateRiskMetrics({
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

    expect(operational.residualRisk).not.toBe(goldenScore);
    expect(operational.residualRisk).toBe(93);
  });
});
