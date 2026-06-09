import { describe, expect, it } from 'vitest';

import {
  alignOverviewScoreWithRadarBranch,
  buildExecutiveBoardReadinessSummary,
  buildExecutiveInputBlockers,
  buildExecutiveLiveDecisionQueueItems,
  buildExecutivePriorityRows,
  buildExecutiveRecommendedActions,
  buildInsufficientFallbackModuleCards,
  buildRadarAxis,
  estimateMaFinancialRadar,
  formatModuleScoreDisplay,
  formatModuleSignalValue,
  getComplianceOverview,
  getEcosystemBranchOverview,
  getExecutiveSignal,
  getMAOverview,
  getRiskOverview,
  mapExecutiveCorporateRadarAxis,
  mergeExecutiveCorporateRadarAxes,
  resolveLegalHealthRadarScore
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

  it('does not coerce missing supplier risk scores into compliance score 0', () => {
    const overview = getComplianceOverview({
      suppliers: [{ id: 's1', name: 'Acme', riskScore: null }],
      alerts: [],
      evidenceItems: [],
      reviews: []
    });
    expect(overview.score).toBeNull();
    expect(overview.posture).toBe('insufficient_data');
    expect(overview.score).not.toBe(0);
  });

  it('formats module score display as N/A when score is null', () => {
    expect(formatModuleScoreDisplay(null)).toBe('N/A');
    expect(formatModuleScoreDisplay(undefined)).toBe('N/A');
    expect(formatModuleScoreDisplay(0)).toBe('0/100');
    expect(formatModuleScoreDisplay(72)).toBe('72/100');
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

  it('does not resolve legal health radar without audit baseline', () => {
    expect(resolveLegalHealthRadarScore({ legalHealthScore: 72 })).toBeNull();
    expect(resolveLegalHealthRadarScore({ legalHealthScore: 0 })).toBeNull();
  });

  it('resolves legal health radar from hub when audit baseline exists', () => {
    expect(
      resolveLegalHealthRadarScore({ latestAuditRun: { id: 'audit-1' }, legalHealthScore: 68 })
    ).toBe(68);
    expect(
      resolveLegalHealthRadarScore({ latestAuditRun: { id: 'audit-1' }, legalHealthScore: 0 })
    ).toBe(0);
    expect(
      resolveLegalHealthRadarScore({ latestAuditRun: { id: 'audit-1' }, legalHealthScore: null })
    ).toBeNull();
  });

  it('tolerates null or non-object executive corporate radar axis without throwing', () => {
    expect(() => mapExecutiveCorporateRadarAxis(null)).not.toThrow();
    const fromNull = mapExecutiveCorporateRadarAxis(null);
    expect(fromNull.value).toBeNull();
    expect(fromNull.status).toBe('insufficient_data');
    expect(fromNull.displayLabel).toBe('N/A');

    const fromString = mapExecutiveCorporateRadarAxis('invalid');
    expect(fromString.value).toBeNull();
    expect(fromString.isCalculable).toBe(false);
  });

  it('maps executive corporate radar axis to insufficient_data when score is null', () => {
    const axis = mapExecutiveCorporateRadarAxis({
      key: 'compliance',
      label: 'Compliance',
      value: null,
      status: 'watch',
      executiveSignalEligible: false
    });
    expect(axis.value).toBeNull();
    expect(axis.displayLabel).toBe('N/A');
    expect(axis.status).toBe('insufficient_data');
    expect(axis.isCalculable).toBe(false);
  });

  it('deduplicates radar aliases into canonical executive branches', () => {
    const axes = mergeExecutiveCorporateRadarAxes(
      [
        { key: 'legal', label: 'Legal', value: 72, status: 'watch' },
        { key: 'financial', label: 'Financial · M&A', value: 68, status: 'watch' },
        { key: 'ops', label: 'Operational', value: 55, status: 'watch' },
        { key: 'esg', label: 'ESG & reputational risk', value: 61, status: 'watch' }
      ],
      [
        buildRadarAxis({ key: 'compliance', label: 'Compliance', score: null, route: '/compliance/dashboard' }),
        buildRadarAxis({ key: 'ma', label: 'M&A', score: null, route: '/ma/dashboard' }),
        buildRadarAxis({ key: 'pmi', label: 'PMI', score: null, route: '/pmi/dashboard' }),
        buildRadarAxis({ key: 'governance', label: 'Governance', score: null, route: '/governance/dashboard' }),
        buildRadarAxis({ key: 'heritage', label: 'Heritage', score: null, route: '/heritage/dashboard' })
      ]
    );
    const keys = axes.map((axis) => axis.key);

    expect(keys).toEqual(['ma', 'compliance', 'pmi', 'governance', 'heritage']);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('does not display a Bridge score when status is pending inputs', () => {
    const axis = mapExecutiveCorporateRadarAxis({
      key: 'bridge',
      label: 'Bridge',
      value: 100,
      status: 'Pending inputs',
      executiveSignalEligible: true
    });

    expect(axis.key).toBe('bridge');
    expect(axis.value).toBeNull();
    expect(axis.displayLabel).toBe('N/A');
    expect(axis.status).toBe('insufficient_data');
    expect(axis.isCalculable).toBe(false);
  });

  it('keeps Heritage without data as N/A pending inputs', () => {
    const axis = mapExecutiveCorporateRadarAxis({
      key: 'heritage',
      label: 'Heritage',
      value: null,
      status: 'insufficient_data',
      executiveSignalEligible: false
    });

    expect(axis.key).toBe('heritage');
    expect(axis.value).toBeNull();
    expect(axis.displayLabel).toBe('N/A');
    expect(axis.status).toBe('insufficient_data');
    expect(axis.isCalculable).toBe(false);
  });

  it('preserves real zero compliance score when signal is eligible', () => {
    const axis = mapExecutiveCorporateRadarAxis({
      key: 'compliance',
      label: 'Compliance',
      value: 0,
      status: 'watch',
      executiveSignalEligible: true
    });
    expect(axis.value).toBe(0);
    expect(axis.displayLabel).toBe('0%');
    expect(axis.status).toBe('watch');
    expect(axis.isCalculable).toBe(true);
  });

  it('aligns compliance overview display score with canonical radar branch when available', () => {
    const overview = getComplianceOverview({
      suppliers: [{ id: 's1', name: 'Acme', riskScore: 96 }],
      alerts: [],
      evidenceItems: [],
      reviews: []
    });
    const aligned = alignOverviewScoreWithRadarBranch(
      overview,
      [
        mapExecutiveCorporateRadarAxis({
          key: 'compliance',
          label: 'Compliance',
          value: 0,
          status: 'watch',
          executiveSignalEligible: true
        })
      ],
      'compliance'
    );

    expect(overview.score).toBe(4);
    expect(aligned.score).toBe(0);
    expect(aligned.executiveSignalEligible).toBe(true);
    expect(aligned.supplierCount).toBe(1);
  });

  it('aligns compliance overview to N/A when radar branch is pending inputs', () => {
    const overview = getComplianceOverview({
      suppliers: [{ id: 's1', name: 'Acme', riskScore: 96 }],
      alerts: [],
      evidenceItems: [],
      reviews: []
    });
    const aligned = alignOverviewScoreWithRadarBranch(
      overview,
      [
        mapExecutiveCorporateRadarAxis({
          key: 'compliance',
          label: 'Compliance',
          value: null,
          status: 'insufficient_data',
          executiveSignalEligible: false
        })
      ],
      'compliance'
    );

    expect(aligned.score).toBeNull();
    expect(aligned.posture).toBe('insufficient_data');
    expect(aligned.executiveSignalEligible).toBe(false);
    expect(aligned.score).not.toBe(0);
  });

  it('surfaces live decision queue without replacing null scores with zero', () => {
    const items = buildExecutiveLiveDecisionQueueItems([
      {
        id: 'funding-1',
        title: 'Confirm funding window decision',
        module: 'Funding',
        severity: 'risk',
        recommendedAction: 'Confirm timing and board memo readiness.',
        priorityScore: 78,
        dueDate: ''
      }
    ]);

    expect(items).toHaveLength(1);
    expect(items[0].priorityScore).toBe(78);
    expect(items[0].dueDate).toBeNull();
    expect(items[0].recommendedAction).toBe('Confirm timing and board memo readiness.');
  });

  it('does not render fake recommendations when recommendedAction is missing', () => {
    const actions = buildExecutiveRecommendedActions({
      alerts: [{ title: 'Compliance exposure', module: 'Compliance', severity: 'risk' }],
      signals: []
    });

    expect(actions).toHaveLength(1);
    expect(actions[0].recommendedAction).toBeNull();
    expect(actions[0].actionLabel).toBe('Review required');
    expect(actions[0].actionLabel).not.toMatch(/cost of inaction/i);
  });

  it('preserves blockers from readiness missingData', () => {
    const blockers = buildExecutiveInputBlockers({
      readiness: { missingData: ['compliance', 'funding'], insufficientModules: [] },
      moduleOverviews: {}
    });

    expect(blockers.length).toBeGreaterThan(0);
    expect(blockers.some((item) => item.branch === 'Compliance')).toBe(true);
    expect(blockers.some((item) => item.branch === 'Funding')).toBe(true);
  });

  it('shows no blockers identified only when blocker sources are empty', () => {
    const blockers = buildExecutiveInputBlockers({
      readiness: { missingData: [], insufficientModules: [] },
      moduleOverviews: {
        ma: { score: 72, posture: 'watch' },
        compliance: { score: 68, posture: 'watch' }
      }
    });

    expect(blockers).toHaveLength(0);
  });

  it('does not show board readiness Ready when human review or missing inputs exist', () => {
    const withMissing = buildExecutiveBoardReadinessSummary({
      boardView: { humanReviewRequired: true, readinessStatus: 'insufficient_data' },
      readiness: { score: null, missingData: ['ma'], humanReviewRequired: true }
    });
    expect(withMissing.statusLabel).not.toBe('Ready');
    expect(withMissing.statusLabel).toBe('Pending inputs');

    const withHumanReview = buildExecutiveBoardReadinessSummary({
      boardView: { humanReviewRequired: true, readinessStatus: 'operational_dss' },
      readiness: { score: 82, missingData: [], humanReviewRequired: true }
    });
    expect(withHumanReview.statusLabel).toBe('Human review required');
  });

  it('labels static priority rows as informational when no live executive rows exist', () => {
    const rows = buildExecutivePriorityRows({
      decisionQueue: [],
      alerts: [],
      signals: [],
      pmiOverview: { alerts: [] },
      fundingOverview: { requiresExecutiveUpdate: false },
      complianceOverview: { openAlerts: 0 }
    });

    expect(rows.every((row) => row.isInformational)).toBe(true);
    expect(rows[0].label).toBe('Decision quality');
  });

  it('prefers real priority rows from decision queue over static posture copy', () => {
    const rows = buildExecutivePriorityRows({
      decisionQueue: [
        {
          title: 'Resolve critical governance decisions',
          module: 'Governance',
          severity: 'blocked',
          recommendedAction: 'Schedule board review.'
        }
      ],
      alerts: [],
      signals: [],
      pmiOverview: { alerts: [] },
      fundingOverview: { requiresExecutiveUpdate: false },
      complianceOverview: { openAlerts: 0 }
    });

    expect(rows[0].label).toBe('Governance');
    expect(rows[0].isInformational).toBe(false);
    expect(rows.some((row) => row.label === 'Decision quality')).toBe(false);
  });

  it('does not emit since last review or cost of inaction copy in decision intelligence helpers', () => {
    const actions = buildExecutiveRecommendedActions({
      alerts: [{ title: 'Risk signal', module: 'Risk', severity: 'critical' }],
      signals: [{ title: 'Funding signal', module: 'Funding', severity: 'watch' }]
    });
    const board = buildExecutiveBoardReadinessSummary({
      boardView: { humanReviewRequired: true },
      readiness: { score: null, missingData: ['strategy'], humanReviewRequired: true }
    });
    const serialized = JSON.stringify({ actions, board });

    expect(serialized).not.toMatch(/since last review/i);
    expect(serialized).not.toMatch(/what changed/i);
    expect(serialized).not.toMatch(/cost of inaction/i);
  });
});
