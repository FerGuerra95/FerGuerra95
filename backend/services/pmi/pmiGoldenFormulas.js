/**
 * Pure PMI benchmark/oracle helpers aligned to Golden Dataset PMI_CAPTURE_RATE.
 * Not the product operational synergy capture models (case target, ledger, enterprise initiatives).
 */

function toFiniteNumber(value) {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function resolveGoldenInputs(input = {}) {
  const forecastSynergy =
    toFiniteNumber(input.forecastSynergy) ??
    toFiniteNumber(input.forecastSynergies) ??
    toFiniteNumber(input.forecast) ??
    toFiniteNumber(input.forecastValue);

  const capturedSynergy =
    toFiniteNumber(input.capturedSynergy) ??
    toFiniteNumber(input.capturedSynergies) ??
    toFiniteNumber(input.captured) ??
    toFiniteNumber(input.capturedValue);

  return { forecastSynergy, capturedSynergy };
}

function buildNonCalculableResult(forecastSynergy, capturedSynergy, reason) {
  return {
    forecastSynergy,
    capturedSynergy,
    captureRateDecimal: null,
    captureRatePercent: null,
    isCalculable: false,
    reason
  };
}

/**
 * Golden benchmark: captureRate = capturedSynergy / forecastSynergy.
 * If forecastSynergy <= 0, rates are null (not 0%).
 */
export function calculatePmiCaptureRateGolden(input = {}) {
  const { forecastSynergy, capturedSynergy } = resolveGoldenInputs(input);

  if (forecastSynergy === null || capturedSynergy === null) {
    return buildNonCalculableResult(forecastSynergy, capturedSynergy, 'missing_or_invalid_inputs');
  }

  if (forecastSynergy <= 0) {
    return buildNonCalculableResult(forecastSynergy, capturedSynergy, 'forecast_zero_or_invalid');
  }

  const captureRateDecimal = capturedSynergy / forecastSynergy;

  if (!Number.isFinite(captureRateDecimal)) {
    return buildNonCalculableResult(forecastSynergy, capturedSynergy, 'non_finite_result');
  }

  const captureRatePercent = captureRateDecimal * 100;

  if (!Number.isFinite(captureRatePercent)) {
    return buildNonCalculableResult(forecastSynergy, capturedSynergy, 'non_finite_result');
  }

  return {
    forecastSynergy,
    capturedSynergy,
    captureRateDecimal,
    captureRatePercent,
    isCalculable: true,
    reason: null
  };
}

export const pmiCaptureRateGolden = calculatePmiCaptureRateGolden;

export default calculatePmiCaptureRateGolden;
