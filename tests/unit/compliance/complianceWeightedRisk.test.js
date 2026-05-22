import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { calculateWeightedRiskScore } from '../../../src/modules/compliance/engine/complianceWeightedRisk.js';

const GOLDEN_PATH = path.join(process.cwd(), 'docs/testing/golden_inputs.json');
const GOLDEN_ID = 'compliance_weighted_risk_score_basic';

function loadGoldenJson() {
  return JSON.parse(fs.readFileSync(GOLDEN_PATH, 'utf8'));
}

describe('complianceWeightedRisk (golden compliance_weighted_risk_score_basic)', () => {
  const golden = loadGoldenJson();
  const dataset = golden.datasets[GOLDEN_ID];

  it('matches golden expected weightedRiskScore', () => {
    const { financialRisk, jurisdictionRisk, evidenceRisk } = dataset.inputs;
    const { weightedRiskScore: expected } = dataset.expected;
    const tolerance = dataset.tolerance ?? golden.globalRules.toleranceDefault;

    const result = calculateWeightedRiskScore({
      financialRisk,
      jurisdictionRisk,
      evidenceRisk
    });

    expect(result).not.toBeNull();
    expect(Number.isFinite(result)).toBe(true);
    expect(Math.abs(result - expected)).toBeLessThanOrEqual(tolerance);
    expect(result).toBe(68);
  });

  it('returns null when any input is missing', () => {
    expect(
      calculateWeightedRiskScore({
        jurisdictionRisk: 80,
        evidenceRisk: 40
      })
    ).toBeNull();
    expect(
      calculateWeightedRiskScore({
        financialRisk: 70,
        evidenceRisk: 40
      })
    ).toBeNull();
    expect(
      calculateWeightedRiskScore({
        financialRisk: 70,
        jurisdictionRisk: 80
      })
    ).toBeNull();
  });

  it('returns null for non-finite inputs', () => {
    expect(
      calculateWeightedRiskScore({
        financialRisk: NaN,
        jurisdictionRisk: 80,
        evidenceRisk: 40
      })
    ).toBeNull();
    expect(
      calculateWeightedRiskScore({
        financialRisk: 70,
        jurisdictionRisk: Infinity,
        evidenceRisk: 40
      })
    ).toBeNull();
    expect(
      calculateWeightedRiskScore({
        financialRisk: 'bad',
        jurisdictionRisk: 80,
        evidenceRisk: 40
      })
    ).toBeNull();
  });

  it('clamps out-of-range inputs to 0–100', () => {
    const clampedHighLow = calculateWeightedRiskScore({
      financialRisk: 150,
      jurisdictionRisk: -10,
      evidenceRisk: 40
    });

    expect(clampedHighLow).toBe(48);
    expect(Number.isFinite(clampedHighLow)).toBe(true);

    const clampedEvidence = calculateWeightedRiskScore({
      financialRisk: 70,
      jurisdictionRisk: 80,
      evidenceRisk: 110
    });

    expect(clampedEvidence).toBe(80);
    expect(Number.isNaN(clampedEvidence)).toBe(false);
  });

  it('never returns NaN or Infinity', () => {
    const cases = [
      { financialRisk: 0, jurisdictionRisk: 0, evidenceRisk: 0 },
      { financialRisk: 100, jurisdictionRisk: 100, evidenceRisk: 100 },
      { financialRisk: '70', jurisdictionRisk: '80', evidenceRisk: '40' }
    ];

    for (const input of cases) {
      const result = calculateWeightedRiskScore(input);
      expect(result).not.toBeNull();
      expect(Number.isFinite(result)).toBe(true);
      expect(Number.isNaN(result)).toBe(false);
    }
  });
});
