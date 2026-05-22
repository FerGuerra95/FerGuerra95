import { clamp } from '../../../shared/utils/validators.js';

/**
 * Pure Golden / benchmark resilience score (oracle).
 * Separate from operational resilience engine (resilienceScore.js).
 * Formula: clamp(100 - riskScore + mitigationBonus, 0, 100)
 */
function toClampedGoldenInput(value) {
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
 * @param {{ riskScore?: unknown, mitigationBonus?: unknown }} input
 * @returns {number | null}
 */
export function calculateGoldenResilienceScore(input = {}) {
  const riskScore = toClampedGoldenInput(input.riskScore);
  const mitigationBonus = toClampedGoldenInput(input.mitigationBonus);

  if (riskScore === null || mitigationBonus === null) {
    return null;
  }

  const score = 100 - riskScore + mitigationBonus;

  if (!Number.isFinite(score)) {
    return null;
  }

  return clamp(score, 0, 100);
}
