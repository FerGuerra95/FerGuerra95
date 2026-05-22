import { clamp } from '../../../shared/utils/validators.js';

/**
 * Pure weighted risk score (Golden / reports / decision-support).
 * Separate from operational supplier risk engine (complianceScoring.js).
 */
function toClampedRiskDimension(value) {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return null;
  }

  return clamp(parsed, 0, 100);
}

/**
 * @param {{ financialRisk?: unknown, jurisdictionRisk?: unknown, evidenceRisk?: unknown }} input
 * @returns {number | null}
 */
export function calculateWeightedRiskScore(input = {}) {
  const financialRisk = toClampedRiskDimension(input.financialRisk);
  const jurisdictionRisk = toClampedRiskDimension(input.jurisdictionRisk);
  const evidenceRisk = toClampedRiskDimension(input.evidenceRisk);

  if (financialRisk === null || jurisdictionRisk === null || evidenceRisk === null) {
    return null;
  }

  const score =
    financialRisk * 0.4 + jurisdictionRisk * 0.4 + evidenceRisk * 0.2;

  if (!Number.isFinite(score)) {
    return null;
  }

  return score;
}
