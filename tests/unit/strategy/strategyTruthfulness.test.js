import { describe, expect, it } from 'vitest';

import { calculateStrategyMetrics } from '../../../backend/services/strategy/strategy.service.js';
import { calculateExecutiveReadinessIndex } from '../../../backend/services/executive/readinessIndex.service.js';
import { buildBoardPackScoringTruthfulness } from '../../../backend/services/reporting/boardPack.service.js';

describe('strategy truthfulness — empty org and defaults', () => {
  it('returns null readiness scores and insufficient_data for empty strategy org', () => {
    const metrics = calculateStrategyMetrics({
      objectives: [],
      initiatives: [],
      scenarios: [],
      marketNotes: [],
      risks: []
    });

    expect(metrics.strategyReadinessScore).toBeNull();
    expect(metrics.objectiveCompletion).toBeNull();
    expect(metrics.scenarioConfidence).toBeNull();
    expect(metrics.executionConfidence).toBeNull();
    expect(metrics.strategyStatus).toBe('insufficient_data');
    expect(metrics.dataSource).toBe('insufficient_data');
    expect(metrics.executiveSignalEligible).toBe(false);
    expect(metrics.scoringTruthfulness?.certifiedRating).toBe(false);
  });

  it('does not export 60 defaults as real scores when strategic inputs are empty', () => {
    const metrics = calculateStrategyMetrics({
      objectives: [],
      initiatives: [],
      scenarios: [],
      marketNotes: [],
      risks: []
    });

    expect(metrics.strategyReadinessScore).not.toBe(60);
    expect(metrics.objectiveCompletion).not.toBe(60);
    expect(metrics.scenarioConfidence).not.toBe(60);
  });

  it('uses not_assessed for strategicRiskLevel when no risks are recorded', () => {
    const metrics = calculateStrategyMetrics({
      objectives: [{ title: 'Expand', status: 'active', targetMetric: 100, currentMetric: 40 }],
      initiatives: [],
      scenarios: [],
      marketNotes: [],
      risks: []
    });

    expect(metrics.strategicRiskLevel).toBe('not_assessed');
    expect(metrics.strategicRiskLevel).not.toBe('controlled');
  });
});

describe('strategy truthfulness — operational DSS with data', () => {
  it('calculates finite readiness when persisted strategy data exists', () => {
    const metrics = calculateStrategyMetrics({
      objectives: [{ title: 'Enter US market', status: 'active', targetMetric: 100, currentMetric: 40 }],
      initiatives: [{ title: 'US GTM', status: 'active', progress: 35 }],
      scenarios: [{ confidence: 75 }],
      marketNotes: [{ market: 'US' }],
      risks: [{ impact: 'high', status: 'open' }]
    });

    expect(Number.isFinite(metrics.strategyReadinessScore)).toBe(true);
    expect(metrics.executiveSignalEligible).toBe(true);
    expect(metrics.dataSource).toBe('operational_dss');
    expect(metrics.scoringTruthfulness?.operationalDss).toBe(true);
    expect(metrics.scoringTruthfulness?.certifiedRating).toBe(false);
  });
});

describe('strategy truthfulness — executive readiness gating', () => {
  it('does not elevate Strategy null score into executive readiness index', () => {
    const readiness = calculateExecutiveReadinessIndex({
      strategy: {
        status: 'available',
        data: {
          metrics: {
            strategyReadinessScore: null,
            executiveSignalEligible: false,
            dataSource: 'insufficient_data'
          },
          strategyReadinessScore: null,
          executiveSignalEligible: false
        }
      }
    });

    expect(readiness.moduleScores.strategy).toBeNull();
    expect(readiness.missingData).toContain('strategy');
  });
});

describe('strategy truthfulness — board pack exclusion', () => {
  it('documents Strategy exclusion from Reporting Board Pack until SoT/Golden', () => {
    const truthfulness = buildBoardPackScoringTruthfulness();

    expect(truthfulness.moduleLayers.strategy.boardPackBranchStatus).toBe('excluded_until_sot_golden');
    expect(truthfulness.moduleLayers.strategy.certifiedRating).toBe(false);
    expect(truthfulness.moduleLayers.strategy.humanReviewRequired).toBe(true);
  });
});
