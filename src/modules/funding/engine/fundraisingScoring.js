import { clamp } from '../../../shared/utils/validators.js';

export function getScenarioMultiplier(mode) {
  if (mode === 'conservative') return { raise: 0.9, valuation: 0.92, burn: 1.08 };
  if (mode === 'aggressive') return { raise: 1.15, valuation: 1.12, burn: 0.96 };
  return { raise: 1, valuation: 1, burn: 1 };
}

export function buildReadinessLevel(score) {
  if (score >= 78) return { label: 'Alta', color: 'text-success' };
  if (score >= 58) return { label: 'Media', color: 'text-warning' };
  return { label: 'Baja', color: 'text-danger' };
}

export function calculateReadinessScore({ inputs, core }) {
  const runwayComponent = clamp((core.currentRunwayMonths / inputs.runwayMonthsTarget) * 100, 0, 100);
  const growthComponent = clamp(inputs.annualGrowthRate, 0, 100);
  const debtComponent = clamp((inputs.debtCapacity / Math.max(inputs.targetRaise, 1)) * 100, 0, 100);
  const dilutionPenalty = clamp(core.dilutionPct * 1.1, 0, 30);

  const raw =
    inputs.dataRoomCompletion * 0.28 +
    inputs.founderMarketFit * 0.2 +
    inputs.investorInterest * 0.18 +
    inputs.grossMargin * 0.12 +
    runwayComponent * 0.12 +
    growthComponent * 0.1 +
    debtComponent * 0.05;

  return clamp(raw - dilutionPenalty, 22, 96);
}
