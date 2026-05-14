import { describe, expect, it } from 'vitest';

import { calculateReportingMetrics } from '../../../backend/services/reporting/reporting.service.js';

describe('enterprise reporting metrics', () => {
  it('calcula readiness, evidence gaps, freshness y atencion ejecutiva', () => {
    const metrics = calculateReportingMetrics({
      reports: [
        { module: 'M&A', status: 'draft', evidenceCompleteness: 50 },
        { module: 'Compliance', status: 'exported', evidenceCompleteness: 90, lastExportedAt: '2026-01-01T00:00:00Z' }
      ],
      templates: [{ templateKey: 'board' }],
      versions: [{ reportId: 'r1' }],
      exports: [{ reportId: 'r2' }],
      schedules: [{ status: 'active' }],
      evidence: [{ evidenceStatus: 'missing' }],
      boardPacks: [{ status: 'draft', completenessScore: 60 }]
    });

    expect(metrics.reportsByModule['M&A']).toBe(1);
    expect(metrics.reportsPendingReview).toBe(1);
    expect(metrics.boardPacksInDraft).toBe(1);
    expect(metrics.missingEvidenceCount).toBe(1);
    expect(metrics.outdatedReports).toBe(1);
    expect(metrics.requiresExecutiveAttention).toBe(true);
  });
});
