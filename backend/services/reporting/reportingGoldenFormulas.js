/**
 * Pure Reporting benchmark/oracle helpers aligned to Golden Dataset REPORTING_VARIANCE.
 * Not Reporting product readiness, Board Pack scores, or Executive readiness indexes.
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
  const actual =
    toFiniteNumber(input.actual) ??
    toFiniteNumber(input.actualValue) ??
    toFiniteNumber(input.observed);

  const expected =
    toFiniteNumber(input.expected) ??
    toFiniteNumber(input.expectedValue) ??
    toFiniteNumber(input.budget) ??
    toFiniteNumber(input.target) ??
    toFiniteNumber(input.benchmark);

  return { actual, expected };
}

function buildNonCalculableResult(actual, expected, reason) {
  return {
    actual,
    expected,
    absoluteVariance: null,
    variancePercent: null,
    isCalculable: false,
    reason
  };
}

/**
 * Golden benchmark: absoluteVariance = actual - expected;
 * variancePercent = (absoluteVariance / expected) * 100 when expected !== 0.
 * Golden Dataset uses `budget` as expected and `varianceAmount` as absolute variance.
 */
export function calculateReportingVarianceGolden(input = {}) {
  const { actual, expected } = resolveGoldenInputs(input);

  if (actual === null || expected === null) {
    return buildNonCalculableResult(actual, expected, 'invalid_input');
  }

  const absoluteVariance = actual - expected;

  if (!Number.isFinite(absoluteVariance)) {
    return buildNonCalculableResult(actual, expected, 'invalid_input');
  }

  if (expected === 0) {
    return {
      actual,
      expected,
      absoluteVariance,
      variancePercent: null,
      isCalculable: true,
      reason: 'expected_zero_percent_not_calculable'
    };
  }

  const variancePercent = (absoluteVariance / expected) * 100;

  if (!Number.isFinite(variancePercent)) {
    return buildNonCalculableResult(actual, expected, 'non_finite_result');
  }

  return {
    actual,
    expected,
    absoluteVariance,
    variancePercent,
    isCalculable: true,
    reason: null
  };
}

export const reportingVarianceGolden = calculateReportingVarianceGolden;

export default calculateReportingVarianceGolden;
