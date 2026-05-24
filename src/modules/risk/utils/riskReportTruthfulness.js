/**
 * Risk report/export truthfulness copy — dual-layer Option C (C.13.6B).
 * Operational scores are DSS signals; Golden L×I is validation-only.
 */

export const RISK_REPORT_PANEL_DISCLAIMER =
  'Generated reports use operational DSS scoring (severity, likelihood, impact). Not a certified risk rating. Golden L×I benchmark is separate and used for validation only. Human review required.';

export const RISK_REPORT_PAGE_COPY =
  'Enterprise Risk Brief, Committee Pack, Control Effectiveness, Incident Summary and Appetite Breach exports. Scores are decision-support signals — not certified ratings. Human review required.';

export const RISK_REPORT_FORBIDDEN_OPERATIONAL_TERMS = [
  /certified risk rating/i,
  /validated formula/i,
  /golden score/i,
  /oracle score/i,
  /automatic risk decision/i,
  /guaranteed rating/i,
  /ai-certified risk/i,
  /definitive risk rating/i
];

export function riskReportCopyIsTruthful(text = '') {
  const normalized = String(text || '');

  if (/\bnot a certified risk rating\b/i.test(normalized)) {
    return !RISK_REPORT_FORBIDDEN_OPERATIONAL_TERMS.filter(
      (pattern) => !String(pattern).includes('certified risk rating')
    ).some((pattern) => pattern.test(normalized));
  }

  return !RISK_REPORT_FORBIDDEN_OPERATIONAL_TERMS.some((pattern) => pattern.test(normalized));
}

export function summarizeRiskReportPayloadTruthfulness(payload = {}) {
  const boardMemo = payload?.boardReadyMemo || {};
  const scoring = payload?.scoringTruthfulness || {};

  return {
    humanReviewRequired: Boolean(payload?.humanReviewRequired ?? boardMemo?.requiredHumanReview),
    operationalModel: scoring?.operationalModel || 'operationalEnterpriseRiskScore',
    goldenBenchmarkModel: scoring?.goldenBenchmarkModel || 'riskLikelihoodImpactGolden',
    disclaimer: boardMemo?.disclaimer || RISK_REPORT_PANEL_DISCLAIMER
  };
}
