import { clamp } from '../../../shared/utils/validators.js';

export function calculateComplianceMultipleAdjustment({
  legalRiskScore = 0,
  criticalFindings = 0
} = {}) {
  const score = Number(legalRiskScore) || 0;
  const critical = Number(criticalFindings) || 0;

  if (critical >= 3 || score >= 85) return -1.25;
  if (score >= 70) return -0.8;
  if (score >= 55) return -0.45;
  if (score >= 35) return -0.2;

  return 0;
}

export function normalizeComplianceRiskImpact(value = {}) {
  const payload = value && typeof value === 'object' ? value : {};
  const legalRiskScore = clamp(Number(payload.legalRiskScore) || 0, 0, 100);
  const criticalFindings = Math.max(
    0,
    Math.round(Number(payload.criticalFindings) || 0)
  );
  const providedDelta = Number(payload.ebitdaMultipleDelta);
  const ebitdaMultipleDelta = Number.isFinite(providedDelta)
    ? clamp(providedDelta, -2.5, 0)
    : calculateComplianceMultipleAdjustment({
        legalRiskScore,
        criticalFindings
      });

  return {
    auditRunId: String(payload.auditRunId || '').trim(),
    legalRiskScore,
    criticalFindings,
    evidenceCoverage: clamp(Number(payload.evidenceCoverage) || 0, 0, 100),
    ebitdaMultipleDelta,
    rationale: String(payload.rationale || '').trim()
  };
}

export function applyComplianceValuationImpact(baseMultiple, impact = {}) {
  const normalizedImpact = normalizeComplianceRiskImpact(impact);

  return {
    adjustedMultiple: clamp(
      Number(baseMultiple || 0) + normalizedImpact.ebitdaMultipleDelta,
      1.2,
      12
    ),
    complianceRiskImpact: normalizedImpact
  };
}
