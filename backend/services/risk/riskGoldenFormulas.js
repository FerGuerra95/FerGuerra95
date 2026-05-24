/**
 * Pure Risk benchmark/oracle helpers aligned to Golden Dataset RISK_LIKELIHOOD_IMPACT.
 * Not the product operational enterprise score (see riskScoreFrom in risk.service.js).
 */

const GOLDEN_SEVERITY_BANDS = {
  low: { min: 1, max: 5 },
  medium: { min: 6, max: 10 },
  high: { min: 11, max: 15 },
  critical: { min: 16, max: 25 }
};

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

function requireScaleValue(value) {
  const parsed = toFiniteNumber(value);

  if (parsed === null || parsed < 1 || parsed > 5) {
    return null;
  }

  return parsed;
}

export function calculateRiskLikelihoodImpactGolden({ likelihood, impact } = {}) {
  const normalizedLikelihood = requireScaleValue(likelihood);
  const normalizedImpact = requireScaleValue(impact);

  if (normalizedLikelihood === null || normalizedImpact === null) {
    return null;
  }

  return normalizedLikelihood * normalizedImpact;
}

export function classifyRiskSeverityBandGolden(riskScore) {
  const normalizedScore = toFiniteNumber(riskScore);

  if (normalizedScore === null || normalizedScore < 1 || normalizedScore > 25) {
    return null;
  }

  if (normalizedScore >= GOLDEN_SEVERITY_BANDS.critical.min) {
    return 'critical';
  }

  if (normalizedScore >= GOLDEN_SEVERITY_BANDS.high.min) {
    return 'high';
  }

  if (normalizedScore >= GOLDEN_SEVERITY_BANDS.medium.min) {
    return 'medium';
  }

  return 'low';
}

export function calculateRiskLikelihoodImpactGoldenResult({ likelihood, impact } = {}) {
  const riskScore = calculateRiskLikelihoodImpactGolden({ likelihood, impact });

  if (riskScore === null) {
    return null;
  }

  return {
    riskScore,
    severity: classifyRiskSeverityBandGolden(riskScore)
  };
}

export default calculateRiskLikelihoodImpactGolden;
