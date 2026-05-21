import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

/**
 * C.13.1A — Golden dataset schema / structure harness only.
 * Does NOT verify product implementation against expected values.
 */

const GOLDEN_PATH = path.join(process.cwd(), 'docs/testing/golden_inputs.json');

const BASE_DATASET_IDS = [
  'ma_valuation_ebitda_multiple_basic',
  'ma_valuation_equity_value_basic',
  'ma_waterfall_simple_distribution',
  'funding_runway_basic',
  'funding_runway_zero_burn',
  'funding_post_money_and_dilution_basic',
  'compliance_weighted_risk_score_basic',
  'compliance_resilience_score_basic',
  'pmi_synergy_capture_rate_basic',
  'pmi_synergy_zero_forecast',
  'bridge_priority_score_basic',
  'risk_score_likelihood_impact_basic',
  'reporting_kpi_variance_basic',
  'executive_module_health_average_basic'
];

const REQUIRED_DATASET_FIELDS = [
  'module',
  'calculation',
  'description',
  'inputs',
  'expected',
  'formula',
  'manualCalculation',
  'tolerance',
  'edgeCase',
  'riskIfMismatch',
  'disclaimer'
];

function loadGoldenJson() {
  const raw = fs.readFileSync(GOLDEN_PATH, 'utf8');
  return JSON.parse(raw);
}

function collectNumericValues(value, pathParts = [], acc = []) {
  if (value === null || value === undefined) {
    return acc;
  }

  if (typeof value === 'number') {
    acc.push({ path: pathParts.join('.'), value });
    return acc;
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      collectNumericValues(item, [...pathParts, String(index)], acc);
    });
    return acc;
  }

  if (typeof value === 'object') {
    Object.entries(value).forEach(([key, nested]) => {
      collectNumericValues(nested, [...pathParts, key], acc);
    });
  }

  return acc;
}

function assertNoUnsafeNumericExpected(expected, datasetId) {
  const numerics = collectNumericValues(expected, []);
  for (const { path: valuePath, value } of numerics) {
    expect(Number.isNaN(value), `${datasetId}.expected.${valuePath}`).toBe(false);
    expect(Number.isFinite(value), `${datasetId}.expected.${valuePath}`).toBe(true);
  }
}

describe('golden_inputs.json schema harness (structure only, not implementation)', () => {
  let golden;

  it('reads and parses docs/testing/golden_inputs.json from disk', () => {
    expect(fs.existsSync(GOLDEN_PATH)).toBe(true);
    golden = loadGoldenJson();
    expect(golden).toBeTypeOf('object');
  });

  it('defines root metadata and globalRules', () => {
    golden = golden || loadGoldenJson();

    expect(golden.schemaVersion).toBe('1.0.0');
    expect(golden.project).toBe("CEO's OS / The Sovereign OS");
    expect(typeof golden.purpose).toBe('string');
    expect(golden.purpose.length).toBeGreaterThan(0);
    expect(golden.status).toBe('baseline_seed');
    expect(golden.globalRules).toBeTypeOf('object');
    expect(golden.globalRules.currency).toBe('EUR');
    expect(typeof golden.globalRules.toleranceDefault).toBe('number');
    expect(golden.globalRules.toleranceDefault).toBeGreaterThanOrEqual(0);
    expect(golden.globalRules.humanReviewRequired).toBe(true);
    expect(Array.isArray(golden.globalRules.notAdvice)).toBe(true);
    expect(golden.globalRules.notAdvice.length).toBeGreaterThan(0);
  });

  it('defines datasets object with exactly the 14 baseline dataset IDs', () => {
    golden = golden || loadGoldenJson();

    expect(golden.datasets).toBeTypeOf('object');
    expect(golden.datasets).not.toBeNull();

    const datasetKeys = Object.keys(golden.datasets);
    expect(datasetKeys.length).toBe(BASE_DATASET_IDS.length);

    for (const id of BASE_DATASET_IDS) {
      expect(golden.datasets[id], `missing dataset: ${id}`).toBeDefined();
    }

    const unexpectedIds = datasetKeys.filter((id) => !BASE_DATASET_IDS.includes(id));
    expect(unexpectedIds, 'unexpected extra dataset IDs in baseline harness').toEqual([]);
  });

  it('defines futureDatasetsRequired as a non-empty array', () => {
    golden = golden || loadGoldenJson();

    expect(Array.isArray(golden.futureDatasetsRequired)).toBe(true);
    expect(golden.futureDatasetsRequired.length).toBeGreaterThan(0);
    golden.futureDatasetsRequired.forEach((entry) => {
      expect(typeof entry).toBe('string');
      expect(entry.length).toBeGreaterThan(0);
    });
  });

  it('each baseline dataset satisfies required structural fields and types', () => {
    golden = golden || loadGoldenJson();

    for (const id of BASE_DATASET_IDS) {
      const dataset = golden.datasets[id];

      for (const field of REQUIRED_DATASET_FIELDS) {
        expect(dataset[field], `${id}.${field}`).toBeDefined();
      }

      expect(typeof dataset.module).toBe('string');
      expect(typeof dataset.calculation).toBe('string');
      expect(typeof dataset.description).toBe('string');
      expect(dataset.inputs).toBeTypeOf('object');
      expect(dataset.inputs).not.toBeNull();
      expect(dataset.expected).toBeTypeOf('object');
      expect(dataset.expected).not.toBeNull();
      expect(typeof dataset.formula).toBe('string');
      expect(dataset.formula.length).toBeGreaterThan(0);
      expect(typeof dataset.manualCalculation).toBe('string');
      expect(dataset.manualCalculation.length).toBeGreaterThan(0);
      expect(typeof dataset.tolerance).toBe('number');
      expect(dataset.tolerance).toBeGreaterThanOrEqual(0);
      expect(typeof dataset.edgeCase).toBe('boolean');
      expect(typeof dataset.riskIfMismatch).toBe('string');
      expect(dataset.riskIfMismatch.length).toBeGreaterThan(0);
      expect(typeof dataset.disclaimer).toBe('string');
      expect(dataset.disclaimer.length).toBeGreaterThan(0);

      assertNoUnsafeNumericExpected(dataset.expected, id);
    }
  });

  it('validates structural edge cases for zero-burn and zero-forecast datasets', () => {
    golden = golden || loadGoldenJson();

    const fundingZeroBurn = golden.datasets.funding_runway_zero_burn;
    expect(fundingZeroBurn.edgeCase).toBe(true);
    expect(fundingZeroBurn.expected.runwayMonths).toBeNull();
    expect(Array.isArray(fundingZeroBurn.expected.mustNotDisplay)).toBe(true);
    expect(fundingZeroBurn.expected.mustNotDisplay).toContain('Infinity');
    expect(fundingZeroBurn.expected.mustNotDisplay).toContain('NaN');

    const pmiZeroForecast = golden.datasets.pmi_synergy_zero_forecast;
    expect(pmiZeroForecast.edgeCase).toBe(true);
    expect(pmiZeroForecast.expected.captureRateDecimal).toBeNull();
    expect(Array.isArray(pmiZeroForecast.expected.mustNotDisplay)).toBe(true);
    expect(pmiZeroForecast.expected.mustNotDisplay).toContain('Infinity');
    expect(pmiZeroForecast.expected.mustNotDisplay).toContain('NaN');
  });

  it('has no duplicate dataset keys at parsed object level', () => {
    golden = golden || loadGoldenJson();
    const keys = Object.keys(golden.datasets);
    const unique = new Set(keys);
    expect(unique.size).toBe(keys.length);
    expect(keys.length).toBe(BASE_DATASET_IDS.length);
  });
});
