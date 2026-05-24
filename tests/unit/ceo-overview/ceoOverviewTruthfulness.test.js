import { describe, expect, it } from 'vitest';

import {
  buildInsufficientFallbackModuleCards,
  buildRadarAxis,
  estimateMaFinancialRadar,
  formatModuleSignalValue,
  getComplianceOverview,
  getEcosystemBranchOverview,
  getExecutiveSignal,
  getMAOverview,
  getRiskOverview
} from '../../../src/modules/ceo-overview/utils/ceoOverviewTruthfulness.js';

describe('CEO overview truthfulness helpers', () => {
  it('does not return fallback scores for empty M&A', () => {
    const overview = getMAOverview({});
    expect(overview.score).toBeNull();
    expect(overview.dataSource).toBe('insufficient_data');
    expect(overview.executiveSignalEligible).toBe(false);
    expect(overview.score).not.toBe(64);
  });

  it('does not return fallback scores or controlled posture for empty Compliance', () => {
    const overview = getComplianceOverview({ suppliers: [], alerts: [], evidenceItems: [], reviews: [] });
    expect(overview.score).toBeNull();
    expect(overview.posture).toBe('insufficient_data');
    expect(overview.score).not.toBe(60);
    expect(overview.title).not.toMatch(/controlled/i);
  });

  it('does not return fallback scores for empty Governance/ESG branch', () => {
    const overview = getEcosystemBranchOverview({ branches: [] }, 'governance', {
      title: 'Governance',
      route: '/governance/dashboard'
    });
    expect(overview.score).toBeNull();
    expect(overview.score).not.toBe(64);
    expect(overview.score).not.toBe(55);
  });

  it('does not return fallback scores for empty Risk', () => {
    const overview = getRiskOverview({ counts: { risks: 0 }, metrics: { dataSource: 'insufficient_data' } });
    expect(overview.score).toBeNull();
    expect(overview.score).not.toBe(62);
  });

  it('does not synthesize executive signal from insufficient modules', () => {
    const signal = getExecutiveSignal([
      { score: null, executiveSignalEligible: false, dataSource: 'insufficient_data' },
      { score: 64, executiveSignalEligible: false, dataSource: 'fallback' },
      { score: 60, truthfulnessStatus: 'insufficient_data', dataSource: 'operational_dss' }
    ]);
    expect(signal.score).toBeNull();
    expect(signal.dataSource).toBe('insufficient_data');
    expect(signal.title).toMatch(/pending/i);
  });

  it('averages only eligible modules with real scores', () => {
    const signal = getExecutiveSignal([
      { score: 80, executiveSignalEligible: true, dataSource: 'operational_dss', truthfulnessStatus: 'operational_dss' },
      { score: 60, executiveSignalEligible: false, dataSource: 'insufficient_data' }
    ]);
    expect(signal.score).toBe(80);
    expect(signal.executiveSignalEligible).toBe(true);
  });

  it('builds radar axes with N/A labels when score is null', () => {
    const axis = buildRadarAxis({ key: 'esg', label: 'ESG', score: null, route: '/governance/dashboard' });
    expect(axis.displayLabel).toBe('N/A');
    expect(axis.value).toBe(0);
    expect(axis.isCalculable).toBe(false);
    expect(axis.displayLabel).not.toBe('55%');
  });

  it('returns null financial radar when no M&A cases exist', () => {
    expect(estimateMaFinancialRadar([])).toEqual({ score: null, geometryValue: 0 });
  });

  it('builds fallback module cards without hardcoded scores', () => {
    const cards = buildInsufficientFallbackModuleCards();
    expect(cards.length).toBeGreaterThan(0);
    cards.forEach((card) => {
      expect(card.score).toBeNull();
      expect(card.status).toBe('insufficient_data');
      expect(card.humanReviewRequired).toBe(true);
    });
    const scores = cards.map((card) => card.score).filter((score) => score !== null);
    expect(scores).toHaveLength(0);
  });

  it('formats module signal values as insufficient data when score is null', () => {
    expect(formatModuleSignalValue({ score: null })).toBe('N/A');
    expect(formatModuleSignalValue({ scoreDisplay: 'Insufficient data — human review required' })).toBe(
      'Insufficient data — human review required'
    );
  });
});
