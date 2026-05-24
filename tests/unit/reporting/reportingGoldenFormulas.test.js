import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

import {
  calculateReportingVarianceGolden,
  reportingVarianceGolden
} from '../../../backend/services/reporting/reportingGoldenFormulas.js';

const GOLDEN_PATH = path.join(process.cwd(), 'docs/testing/golden_inputs.json');
const GOLDEN_VARIANCE_BASIC_ID = 'reporting_kpi_variance_basic';

function loadGoldenJson() {
  return JSON.parse(fs.readFileSync(GOLDEN_PATH, 'utf8'));
}

describe('reportingGoldenFormulas — REPORTING_VARIANCE (golden reporting_kpi_variance_basic)', () => {
  it('matches golden varianceAmount and variancePercent from golden_inputs.json', () => {
    const golden = loadGoldenJson();
    const dataset = golden.datasets[GOLDEN_VARIANCE_BASIC_ID];
    const tolerance = dataset.tolerance ?? 0.000001;
    const result = calculateReportingVarianceGolden(dataset.inputs);

    expect(result?.isCalculable).toBe(true);
    expect(result?.actual).toBe(dataset.inputs.actual);
    expect(result?.expected).toBe(dataset.inputs.budget);
    expect(result?.absoluteVariance).toBeCloseTo(dataset.expected.varianceAmount, 6);
    expect(result?.variancePercent).toBeCloseTo(dataset.expected.variancePercent, tolerance);
    expect(result?.absoluteVariance).toBe(100_000);
    expect(result?.variancePercent).toBe(10);
  });

  it('exports conceptual alias reportingVarianceGolden', () => {
    expect(reportingVarianceGolden).toBe(calculateReportingVarianceGolden);
    expect(
      reportingVarianceGolden({
        actual: 1_100_000,
        budget: 1_000_000
      })?.variancePercent
    ).toBe(10);
  });

  it('accepts numeric string inputs', () => {
    const result = calculateReportingVarianceGolden({
      actual: '120',
      expected: '100'
    });

    expect(result?.absoluteVariance).toBe(20);
    expect(result?.variancePercent).toBe(20);
  });
});

describe('reportingGoldenFormulas — variance direction and edges', () => {
  it('returns positive absoluteVariance when actual > expected', () => {
    const result = calculateReportingVarianceGolden({ actual: 150, expected: 100 });

    expect(result?.absoluteVariance).toBe(50);
    expect(result?.variancePercent).toBe(50);
  });

  it('returns negative absoluteVariance when actual < expected', () => {
    const result = calculateReportingVarianceGolden({ actual: 80, expected: 100 });

    expect(result?.absoluteVariance).toBe(-20);
    expect(result?.variancePercent).toBe(-20);
  });

  it('returns zero variance when actual equals expected', () => {
    const result = calculateReportingVarianceGolden({ actual: 100, expected: 100 });

    expect(result?.absoluteVariance).toBe(0);
    expect(result?.variancePercent).toBe(0);
  });

  it('returns null variancePercent when expected is zero (no NaN/Infinity)', () => {
    const result = calculateReportingVarianceGolden({ actual: 50, expected: 0 });

    expect(result?.absoluteVariance).toBe(50);
    expect(result?.variancePercent).toBeNull();
    expect(result?.reason).toBe('expected_zero_percent_not_calculable');
    expect(Number.isNaN(result?.variancePercent)).toBe(false);
  });

  it('handles actual zero with valid expected', () => {
    const result = calculateReportingVarianceGolden({ actual: 0, expected: 100 });

    expect(result?.absoluteVariance).toBe(-100);
    expect(result?.variancePercent).toBe(-100);
  });

  it('returns null outputs for invalid inputs without NaN/Infinity', () => {
    for (const badActual of [null, undefined, NaN, Infinity, 'bad']) {
      const result = calculateReportingVarianceGolden({ actual: badActual, expected: 100 });
      expect(result?.isCalculable).toBe(false);
      expect(result?.absoluteVariance).toBeNull();
      expect(result?.variancePercent).toBeNull();
      expect(result?.reason).toBe('invalid_input');
    }

    for (const badExpected of [null, undefined, NaN, Infinity, 'bad']) {
      const result = calculateReportingVarianceGolden({ actual: 100, expected: badExpected });
      expect(result?.isCalculable).toBe(false);
      expect(result?.absoluteVariance).toBeNull();
      expect(result?.variancePercent).toBeNull();
    }
  });

  it('allows negative expected for absolute and percent (defensive)', () => {
    const result = calculateReportingVarianceGolden({ actual: 50, expected: -100 });

    expect(result?.absoluteVariance).toBe(150);
    expect(result?.variancePercent).toBe(-150);
  });
});

describe('reportingGoldenFormulas — truthfulness (separate from product readiness)', () => {
  it('ignores reportingReadinessScore, completenessScore, and boardPackScore keys', () => {
    const result = calculateReportingVarianceGolden({
      reportingReadinessScore: 99,
      completenessScore: 88,
      boardPackScore: 77,
      moduleScore: 66,
      readinessIndex: 55,
      actual: 110,
      expected: 100
    });

    expect(result?.absoluteVariance).toBe(10);
    expect(result?.variancePercent).toBe(10);
    expect(result).not.toHaveProperty('reportingReadinessScore');
    expect(result).not.toHaveProperty('boardPackScore');
  });

  it('does not import reporting product services', () => {
    const sourcePath = path.join(
      process.cwd(),
      'backend/services/reporting/reportingGoldenFormulas.js'
    );
    const source = fs.readFileSync(sourcePath, 'utf8');

    expect(source).not.toMatch(/import\s+.*reporting\.service/);
    expect(source).not.toMatch(/import\s+.*boardPack\.service/);
    expect(source).not.toMatch(/import\s+.*executive/);
    expect(source).not.toMatch(/reportingReadinessScore/);
  });
});
