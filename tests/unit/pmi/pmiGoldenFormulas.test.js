import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

import {
  calculatePmiCaptureRateGolden,
  pmiCaptureRateGolden
} from '../../../backend/services/pmi/pmiGoldenFormulas.js';

const GOLDEN_PATH = path.join(process.cwd(), 'docs/testing/golden_inputs.json');
const GOLDEN_CAPTURE_BASIC_ID = 'pmi_synergy_capture_rate_basic';
const GOLDEN_ZERO_FORECAST_ID = 'pmi_synergy_zero_forecast';

function loadGoldenJson() {
  return JSON.parse(fs.readFileSync(GOLDEN_PATH, 'utf8'));
}

describe('pmiGoldenFormulas — PMI_CAPTURE_RATE (golden pmi_synergy_capture_rate_basic)', () => {
  it('matches golden captureRateDecimal and captureRatePercent', () => {
    const golden = loadGoldenJson();
    const dataset = golden.datasets[GOLDEN_CAPTURE_BASIC_ID];
    const result = calculatePmiCaptureRateGolden(dataset.inputs);

    expect(result?.isCalculable).toBe(true);
    expect(result?.captureRateDecimal).toBeCloseTo(dataset.expected.captureRateDecimal, 6);
    expect(result?.captureRatePercent).toBeCloseTo(dataset.expected.captureRatePercent, 6);
    expect(result?.captureRateDecimal).toBe(0.3);
    expect(result?.captureRatePercent).toBe(30);
  });

  it('exports conceptual alias pmiCaptureRateGolden', () => {
    expect(pmiCaptureRateGolden).toBe(calculatePmiCaptureRateGolden);
    expect(
      pmiCaptureRateGolden({
        forecastSynergies: 5_000_000,
        capturedSynergies: 1_500_000
      })?.captureRateDecimal
    ).toBe(0.3);
  });

  it('accepts numeric string inputs', () => {
    const result = calculatePmiCaptureRateGolden({
      forecast: '5000000',
      captured: '1500000'
    });

    expect(result?.captureRateDecimal).toBe(0.3);
    expect(result?.captureRatePercent).toBe(30);
  });
});

describe('pmiGoldenFormulas — PMI_CAPTURE_RATE zero forecast (golden pmi_synergy_zero_forecast)', () => {
  it('returns null rates when forecast is zero', () => {
    const golden = loadGoldenJson();
    const dataset = golden.datasets[GOLDEN_ZERO_FORECAST_ID];
    const result = calculatePmiCaptureRateGolden(dataset.inputs);

    expect(result?.isCalculable).toBe(false);
    expect(result?.captureRateDecimal).toBeNull();
    expect(result?.captureRatePercent).toBeNull();
    expect(result?.reason).toBe('forecast_zero_or_invalid');
  });

  it('returns zero rates when captured is zero but forecast is valid', () => {
    const result = calculatePmiCaptureRateGolden({
      forecastSynergy: 5_000_000,
      capturedSynergy: 0
    });

    expect(result?.isCalculable).toBe(true);
    expect(result?.captureRateDecimal).toBe(0);
    expect(result?.captureRatePercent).toBe(0);
  });

  it('returns null when forecast is null or undefined', () => {
    expect(calculatePmiCaptureRateGolden({ forecastSynergy: null, capturedSynergy: 1 })).toMatchObject({
      captureRateDecimal: null,
      isCalculable: false
    });
    expect(calculatePmiCaptureRateGolden({ capturedSynergy: 1 })).toMatchObject({
      captureRateDecimal: null,
      isCalculable: false
    });
  });

  it('returns null when forecast is negative', () => {
    const result = calculatePmiCaptureRateGolden({
      forecastSynergy: -100,
      capturedSynergy: 50_000
    });

    expect(result?.isCalculable).toBe(false);
    expect(result?.captureRateDecimal).toBeNull();
    expect(result?.captureRatePercent).toBeNull();
  });

  it('returns null for non-finite inputs and does not propagate NaN/Infinity', () => {
    expect(calculatePmiCaptureRateGolden({ forecastSynergy: NaN, capturedSynergy: 1 })).toMatchObject({
      captureRateDecimal: null,
      isCalculable: false
    });
    expect(calculatePmiCaptureRateGolden({ forecastSynergy: 5, capturedSynergy: Infinity })).toMatchObject({
      captureRateDecimal: null,
      isCalculable: false
    });
    expect(calculatePmiCaptureRateGolden({ forecastSynergy: 5, capturedSynergy: 'bad' })).toMatchObject({
      captureRateDecimal: null,
      isCalculable: false
    });
  });
});

describe('pmiGoldenFormulas — dual-layer truthfulness (Golden forecast vs operational target)', () => {
  it('uses forecast denominator, not synergyTarget, for Golden capture rate', () => {
    const result = calculatePmiCaptureRateGolden({
      forecastSynergy: 5_000_000,
      capturedSynergy: 1_500_000,
      synergyTarget: 3_000_000
    });

    expect(result?.captureRateDecimal).toBe(0.3);
    expect(result?.captureRatePercent).toBe(30);
    expect(result?.captureRateDecimal).not.toBe(0.5);
  });

  it('does not treat synergyTarget alone as forecast without explicit forecast input', () => {
    const result = calculatePmiCaptureRateGolden({
      synergyTarget: 5_000_000,
      capturedSynergy: 1_500_000
    });

    expect(result?.isCalculable).toBe(false);
    expect(result?.captureRateDecimal).toBeNull();
  });
});
