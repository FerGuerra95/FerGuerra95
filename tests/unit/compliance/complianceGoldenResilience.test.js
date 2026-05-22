import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { calculateGoldenResilienceScore } from '../../../src/modules/compliance/engine/complianceGoldenResilience.js';

const GOLDEN_PATH = path.join(process.cwd(), 'docs/testing/golden_inputs.json');
const GOLDEN_ID = 'compliance_resilience_score_basic';

function loadGoldenJson() {
  return JSON.parse(fs.readFileSync(GOLDEN_PATH, 'utf8'));
}

describe('complianceGoldenResilience (golden compliance_resilience_score_basic)', () => {
  const golden = loadGoldenJson();
  const dataset = golden.datasets[GOLDEN_ID];

  it('matches golden expected resilienceScore', () => {
    const { riskScore, mitigationBonus } = dataset.inputs;
    const { resilienceScore: expected } = dataset.expected;
    const tolerance = dataset.tolerance ?? golden.globalRules.toleranceDefault;

    const result = calculateGoldenResilienceScore({
      riskScore,
      mitigationBonus
    });

    expect(result).not.toBeNull();
    expect(Number.isFinite(result)).toBe(true);
    expect(Math.abs(result - expected)).toBeLessThanOrEqual(tolerance);
    expect(result).toBe(40);
  });

  it('returns null when riskScore is missing', () => {
    expect(calculateGoldenResilienceScore({ mitigationBonus: 8 })).toBeNull();
  });

  it('returns null when mitigationBonus is missing', () => {
    expect(calculateGoldenResilienceScore({ riskScore: 68 })).toBeNull();
  });

  it('returns null for non-finite inputs', () => {
    expect(
      calculateGoldenResilienceScore({ riskScore: NaN, mitigationBonus: 8 })
    ).toBeNull();
    expect(
      calculateGoldenResilienceScore({ riskScore: 68, mitigationBonus: Infinity })
    ).toBeNull();
    expect(
      calculateGoldenResilienceScore({ riskScore: 'bad', mitigationBonus: 8 })
    ).toBeNull();
  });

  it('clamps out-of-range inputs to 0–100', () => {
    const highRisk = calculateGoldenResilienceScore({
      riskScore: 150,
      mitigationBonus: 8
    });

    expect(highRisk).toBe(8);
    expect(Number.isFinite(highRisk)).toBe(true);

    const lowBonus = calculateGoldenResilienceScore({
      riskScore: 68,
      mitigationBonus: -10
    });

    expect(lowBonus).toBe(32);

    const highBonus = calculateGoldenResilienceScore({
      riskScore: 68,
      mitigationBonus: 120
    });

    expect(highBonus).toBe(100);
  });

  it('never returns NaN or Infinity and output stays within 0–100', () => {
    const cases = [
      { riskScore: 0, mitigationBonus: 0 },
      { riskScore: 100, mitigationBonus: 100 },
      { riskScore: '68', mitigationBonus: '8' },
      { riskScore: 68, mitigationBonus: 8 }
    ];

    for (const input of cases) {
      const result = calculateGoldenResilienceScore(input);
      expect(result).not.toBeNull();
      expect(Number.isFinite(result)).toBe(true);
      expect(Number.isNaN(result)).toBe(false);
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThanOrEqual(100);
    }
  });
});
