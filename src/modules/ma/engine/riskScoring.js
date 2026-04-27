import { clamp } from '../../../shared/utils/validators.js';

export function getRiskModeMultiplier(riskMode) {
  if (riskMode === 'conservative') return 0.93;
  if (riskMode === 'aggressive') return 1.07;
  return 1;
}

export function buildRiskLevel(qualityScore) {
  if (qualityScore >= 78) return { label: 'Bajo', color: 'text-success' };
  if (qualityScore >= 58) return { label: 'Medio', color: 'text-warning' };
  return { label: 'Alto', color: 'text-danger' };
}

export function calculateQualityScore({ inputs, sectorMeta }) {
  const esgPenalty = (inputs.regionHighRisk / 100) * sectorMeta.esgRisk * 30;
  const riskPenalty =
    inputs.ownerDependency * 0.28 +
    inputs.clientConcentration * 0.24 +
    inputs.workingCapitalNeed * 0.16 +
    esgPenalty;

  const qualityBoost = inputs.recurringRevenue * 0.22 + clamp(inputs.growth, -20, 40) * 0.9;
  return clamp(72 + qualityBoost - riskPenalty, 18, 96);
}
