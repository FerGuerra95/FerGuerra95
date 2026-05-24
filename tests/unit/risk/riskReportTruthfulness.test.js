import { describe, expect, it } from 'vitest';

import {
  RISK_REPORT_PAGE_COPY,
  RISK_REPORT_PANEL_DISCLAIMER,
  riskReportCopyIsTruthful,
  summarizeRiskReportPayloadTruthfulness
} from '../../../src/modules/risk/utils/riskReportTruthfulness.js';

describe('riskReportTruthfulness', () => {
  it('uses decision-support copy without certified/validated operational claims', () => {
    expect(riskReportCopyIsTruthful(RISK_REPORT_PANEL_DISCLAIMER)).toBe(true);
    expect(riskReportCopyIsTruthful(RISK_REPORT_PAGE_COPY)).toBe(true);
    expect(RISK_REPORT_PANEL_DISCLAIMER).toMatch(/operational DSS/i);
    expect(RISK_REPORT_PANEL_DISCLAIMER).toMatch(/not a certified risk rating/i);
    expect(RISK_REPORT_PANEL_DISCLAIMER).toMatch(/Golden L×I benchmark/i);
    expect(RISK_REPORT_PANEL_DISCLAIMER).toMatch(/Human review required/i);
  });

  it('flags misleading operational report language', () => {
    expect(riskReportCopyIsTruthful('Golden score for portfolio rating')).toBe(false);
    expect(riskReportCopyIsTruthful('AI-certified risk decision')).toBe(false);
    expect(riskReportCopyIsTruthful('Validated formula oracle score')).toBe(false);
  });

  it('summarizes export payload with operational model and human review', () => {
    const summary = summarizeRiskReportPayloadTruthfulness({
      humanReviewRequired: true,
      boardReadyMemo: {
        disclaimer: 'Decision-support output using operationalEnterpriseRiskScore heuristic.'
      },
      scoringTruthfulness: {
        operationalModel: 'operationalEnterpriseRiskScore',
        goldenBenchmarkModel: 'riskLikelihoodImpactGolden'
      }
    });

    expect(summary.humanReviewRequired).toBe(true);
    expect(summary.operationalModel).toBe('operationalEnterpriseRiskScore');
    expect(summary.goldenBenchmarkModel).toBe('riskLikelihoodImpactGolden');
    expect(summary.disclaimer).toMatch(/operationalEnterpriseRiskScore/i);
  });
});
