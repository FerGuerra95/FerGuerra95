import { describe, expect, it } from 'vitest';

import {
  buildBoardPackScoringTruthfulness,
  generateExecutiveSummary
} from '../../../backend/services/reporting/boardPack.service.js';
import { calculateReportingMetrics } from '../../../backend/services/reporting/reporting.service.js';
import { calculateExecutiveReadinessIndex } from '../../../backend/services/executive/readinessIndex.service.js';

describe('reporting aggregator truthfulness', () => {
  it('returns null reporting readiness when no persisted reporting metadata exists', () => {
    const metrics = calculateReportingMetrics({});

    expect(metrics.reportingReadinessScore).toBeNull();
    expect(metrics.hasPersistedReportingData).toBe(false);
    expect(metrics.dataSource).toBe('insufficient_data');
    expect(metrics.executiveReportingStatus).toBe('insufficient_data');
    expect(Number.isNaN(metrics.reportingReadinessScore)).toBe(false);
  });

  it('buildBoardPackScoringTruthfulness declares decision-support only metadata', () => {
    const truthfulness = buildBoardPackScoringTruthfulness();

    expect(truthfulness.certifiedRating).toBe(false);
    expect(truthfulness.humanReviewRequired).toBe(true);
    expect(truthfulness.decisionSupportOnly).toBe(true);
    expect(truthfulness.moduleLayers.pmi.preservesNullCapture).toBe(true);
    expect(truthfulness.moduleLayers.compliance.nullMeansInsufficientData).toBe(true);
  });

  it('does not treat PMI null capture as a strength in executive summary', () => {
    const summary = generateExecutiveSummary({
      pmi: {
        synergyCaptureRate: null,
        ledgerCaptureRate: null,
        playbookProgress: 80,
        integrationProgress: 70,
        openRiskCount: 0
      }
    });

    expect(summary).not.toMatch(/captura de sinergias y playbooks en avance/i);
  });

  it('excludes insufficient modules from executive readiness score fallbacks', () => {
    const readiness = calculateExecutiveReadinessIndex({
      ma: { status: 'insufficient_data', data: { counts: { deals: 0 } } },
      reporting: { status: 'insufficient_data', data: { counts: { reports: 0 } } },
      strategy: {
        status: 'available',
        data: { metrics: { strategyReadinessScore: 72 }, counts: { objectives: 1 } }
      }
    });

    expect(readiness.score).toBe(72);
    expect(readiness.missingData).toContain('ma');
    expect(readiness.missingData).toContain('reporting');
    expect(readiness.executiveSignalEligible).toBe(true);
    expect(readiness.humanReviewRequired).toBe(true);
  });
});
