import { describe, expect, it } from 'vitest';

import {
  alignOverviewScoreWithRadarBranch,
  buildExecutiveBoardReadinessSummary,
  buildExecutiveConclusion,
  buildExecutiveInputBlockers,
  buildExecutiveLiveDecisionQueueItems,
  buildExecutivePriorityRows,
  buildExecutiveRecommendedActions,
  BOARD_PACK_GENERATE_DISABLED_HINT,
  BOARD_PACK_PRINT_DRAFT_HINT,
  BRIEFING_PACK_STATUS_ONLY_NOTE,
  resolveBoardReviewDraftPackStatus,
  resolveSuggestedOwnerLabel,
  formatExecutiveBlockerSummaryLine,
  MODULE_READINESS_NA_CLARIFICATION,
  prioritizeExecutiveBlockers,
  summarizeExecutiveInputBlockers,
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
import {
  CEO_BRIEFING_PACKS_SECTION_NOTE,
  CEO_DECISION_QUEUE_STATUS_NOTE,
  CEO_EXECUTIVE_SIGNAL_STATUS_NOTE,
  CEO_REPORTING_WORKSPACE_BUTTON_LABEL,
  CEO_REPORTING_WORKSPACE_HINT,
  CEO_REPORTING_WORKSPACE_ROUTE,
  CEO_WORKFLOW_STATUS_NOTE
} from '../../../src/modules/ceo-overview/components/ExecutiveCommandCenterView.jsx';

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
    expect(actions[0].actionLabel).toMatch(/review source module|complete source inputs/i);
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

  it('deduplicates blockers to one row per module when sources overlap', () => {
    const blockers = buildExecutiveInputBlockers({
      readiness: { missingData: ['funding'], insufficientModules: ['funding'] },
      moduleOverviews: {
        funding: { score: null, posture: 'insufficient_data', scoreDisplay: 'Pending inputs' }
      }
    });

    expect(blockers).toHaveLength(1);
    expect(blockers[0].branch).toBe('Funding');
    expect(blockers[0].description).toMatch(/funding cannot be assessed/i);
    expect(blockers[0].effect).toMatch(/executive posture incomplete|required before board/i);
  });

  it('caps visible blockers at four while preserving additional count', () => {
    const blockers = buildExecutiveInputBlockers({
      readiness: {
        missingData: ['ma', 'funding', 'compliance', 'risk', 'pmi', 'governance', 'strategy'],
        insufficientModules: []
      },
      moduleOverviews: {}
    });
    const summary = summarizeExecutiveInputBlockers(blockers, { maxVisible: 4 });

    expect(summary.blockers).toHaveLength(4);
    expect(summary.total).toBe(7);
    expect(summary.additionalCount).toBe(3);
  });

  it('prioritizes funding and governance blockers ahead of lower-priority modules', () => {
    const blockers = buildExecutiveInputBlockers({
      readiness: {
        missingData: ['heritage', 'bridge', 'funding', 'governance'],
        insufficientModules: []
      },
      moduleOverviews: {}
    });
    const prioritized = prioritizeExecutiveBlockers(blockers);

    expect(prioritized[0].moduleKey).toBe('funding');
    expect(prioritized[1].moduleKey).toBe('governance');
  });

  it('formats blocker summary as description and effect on one line', () => {
    const line = formatExecutiveBlockerSummaryLine({
      description: 'Pending inputs',
      effect: 'Blocks complete executive posture'
    });

    expect(line).toMatch(/inputs pending|cannot be assessed/i);
    expect(line).not.toMatch(/approved|certified/i);
    expect(line).not.toMatch(/blocks complete executive posture/i);
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
    expect(rows[0].value).toMatch(/not a scored signal/i);
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

  it('does not emit approved or certified copy in board readiness summary', () => {
    const board = buildExecutiveBoardReadinessSummary({
      boardView: { humanReviewRequired: true, reportingReadiness: 72 },
      readiness: { score: 80, missingData: [], humanReviewRequired: true },
      briefingDraftPrepared: true
    });
    const serialized = JSON.stringify(board);

    expect(serialized).not.toMatch(/approved/i);
    expect(serialized).not.toMatch(/certified/i);
    expect(board.compactSummaryLines.length).toBeGreaterThan(0);
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

  it('exposes N/A clarification that missing data is not failed performance', () => {
    expect(MODULE_READINESS_NA_CLARIFICATION).toMatch(/not poor operational performance/i);
    expect(MODULE_READINESS_NA_CLARIFICATION).not.toMatch(/approved|certified/i);
  });

  it('builds executive conclusion without approved or invented change claims', () => {
    const conclusion = buildExecutiveConclusion({
      readiness: { score: null, missingData: ['funding'], humanReviewRequired: true },
      blockerCount: 2,
      hasLivePriorities: false
    });
    const serialized = JSON.stringify(conclusion);

    expect(conclusion.headline).toMatch(/priority reviews/i);
    expect(conclusion.subline).toMatch(/missing inputs/i);
    expect(conclusion.subline).toMatch(/human review/i);
    expect(serialized).not.toMatch(/approved|certified|since last review|cost of inaction/i);
  });

  it('deduplicates recommended actions already present in the live decision queue', () => {
    const queueItem = {
      title: 'Compliance exposure',
      module: 'Compliance',
      severity: 'risk',
      recommendedAction: 'Review supplier evidence.'
    };
    const actions = buildExecutiveRecommendedActions({
      decisionQueue: [queueItem],
      alerts: [queueItem],
      signals: [],
      limit: 5
    });

    expect(actions).toHaveLength(0);
  });

  it('does not invent deadlines in recommended action labels', () => {
    const actions = buildExecutiveRecommendedActions({
      alerts: [{ title: 'Funding signal', module: 'Funding', severity: 'watch' }],
      signals: []
    });

    expect(actions[0].actionLabel).not.toMatch(/due |deadline/i);
    expect(actions[0].actionLabel).toMatch(/review source module|complete source inputs/i);
  });

  it('caps recommended actions at three main items plus one pending group', () => {
    const alerts = Array.from({ length: 10 }, (_, index) => ({
      title: `Executive alert ${index + 1}`,
      module: ['M&A', 'Funding', 'Compliance', 'Risk', 'PMI', 'Governance', 'Strategy', 'Reporting', 'Bridge', 'Heritage'][
        index
      ],
      severity: index < 2 ? 'critical' : 'watch',
      recommendedAction: `Action ${index + 1}`
    }));
    const signals = [
      { title: 'Funding signal not available', module: 'Funding', severity: 'watch' },
      { title: 'Governance signal not available', module: 'Governance', severity: 'watch' }
    ];

    const actions = buildExecutiveRecommendedActions({ alerts, signals, limit: 3 });
    const mainActions = actions.filter((item) => !item.isGroupedPending);
    const groupedActions = actions.filter((item) => item.isGroupedPending);

    expect(mainActions.length).toBeLessThanOrEqual(3);
    expect(groupedActions.length).toBeLessThanOrEqual(1);
    expect(actions.length).toBeLessThanOrEqual(4);
  });

  it('collapses duplicate module actions to one recommended item', () => {
    const actions = buildExecutiveRecommendedActions({
      alerts: [
        { title: 'Funding runway exposure', module: 'Funding', severity: 'critical', recommendedAction: 'Review runway.' },
        { title: 'Funding signal watch', module: 'Funding', severity: 'watch', recommendedAction: 'Secondary funding note.' }
      ],
      signals: []
    });

    expect(actions.filter((item) => item.moduleKey === 'funding')).toHaveLength(1);
    expect(actions[0].recommendedAction).toBe('Review runway.');
  });

  it('groups multiple signal-not-available items into one pending signals row', () => {
    const actions = buildExecutiveRecommendedActions({
      alerts: [],
      signals: [
        { title: 'FUNDING signal not available', module: 'Funding', severity: 'watch' },
        { title: 'Governance signal not available', module: 'Governance', severity: 'watch' },
        { title: 'Bridge signal not available', module: 'Bridge', severity: 'watch' },
        { title: 'Risk signal not available', module: 'Risk', severity: 'watch' }
      ]
    });

    expect(actions).toHaveLength(1);
    expect(actions[0].title).toMatch(/pending module signals/i);
    expect(actions[0].actionLabel).toMatch(/funding · governance · bridge · risk/i);
    expect(actions[0].actionLabel).toMatch(/require source inputs before board circulation/i);
    expect(actions[0].status).toBe('Pending inputs');
  });

  it('includes compliance at most once in recommended actions', () => {
    const actions = buildExecutiveRecommendedActions({
      alerts: [
        { title: 'Compliance exposure', module: 'Compliance', severity: 'critical', recommendedAction: 'Review audit ledger.' },
        { title: 'Compliance remediation watch', module: 'Compliance', severity: 'risk', recommendedAction: 'Review remediation.' },
        { title: 'Risk escalation', module: 'Risk', severity: 'risk', recommendedAction: 'Review risk register.' }
      ],
      signals: []
    });

    expect(actions.filter((item) => item.moduleKey === 'compliance')).toHaveLength(1);
    expect(actions[0].moduleKey).toBe('compliance');
  });

  it('labels suggested owners clearly without implying assignment', () => {
    const actions = buildExecutiveRecommendedActions({
      alerts: [{ title: 'Risk escalation', module: 'Risk', severity: 'risk' }],
      signals: []
    });

    expect(actions[0].suggestedOwner).toMatch(/^Suggested owner:/i);
    expect(actions[0]).not.toHaveProperty('owner');
    expect(resolveSuggestedOwnerLabel('enterprise', { isGroupedPending: true })).toBeNull();
  });

  it('preserves pending inputs labeling for grouped unavailable signals', () => {
    const actions = buildExecutiveRecommendedActions({
      alerts: [{ title: 'Strategy signal not available', module: 'Strategy', severity: 'watch' }],
      signals: []
    });

    expect(actions[0].whyItMatters).toMatch(/pending inputs/i);
    expect(actions[0].whyItMatters).toMatch(/not treated as failed performance/i);
  });

  it('does not duplicate the same module in hero executive attention rows', () => {
    const rows = buildExecutivePriorityRows({
      decisionQueue: [
        {
          title: 'Compliance exposure',
          module: 'Compliance',
          severity: 'risk',
          recommendedAction: 'Review supplier evidence.'
        },
        { title: 'PMI integration gap', module: 'PMI', severity: 'watch' }
      ],
      alerts: [{ title: 'Compliance alert', module: 'Compliance', severity: 'risk' }],
      signals: [],
      pmiOverview: { alerts: [] },
      fundingOverview: { requiresExecutiveUpdate: false },
      complianceOverview: { openAlerts: 3 }
    });

    const complianceRows = rows.filter(
      (row) => row.moduleKey === 'compliance' || row.label === 'Compliance'
    );

    expect(complianceRows).toHaveLength(1);
    expect(rows.length).toBeLessThanOrEqual(3);
    expect(rows.some((row) => row.label === 'PMI')).toBe(true);
  });

  it('does not emit Review Executive generic recommended action title', () => {
    const actions = buildExecutiveRecommendedActions({
      alerts: [{ title: 'Executive posture signal', module: 'Executive', severity: 'watch' }],
      signals: []
    });
    const serialized = JSON.stringify(actions);

    expect(actions[0].title).not.toMatch(/^Review Executive$/i);
    expect(actions[0].title).toMatch(/readiness blockers|board readiness/i);
    expect(serialized).not.toMatch(/approved|certified/i);
  });

  it('humanizes compliance and risk blocker copy for executives', () => {
    const blockers = buildExecutiveInputBlockers({
      readiness: { missingData: ['compliance', 'risk'], insufficientModules: [] },
      moduleOverviews: {}
    });

    expect(blockers.find((item) => item.moduleKey === 'compliance')?.description).toMatch(
      /compliance signal requires/i
    );
    expect(blockers.find((item) => item.moduleKey === 'risk')?.description).toMatch(
      /risk posture cannot be reviewed/i
    );
  });

  it('surfaces required-before-distribution lines in board readiness summary', () => {
    const board = buildExecutiveBoardReadinessSummary({
      boardView: { humanReviewRequired: true, reportingReadiness: 72 },
      readiness: { score: null, missingData: ['ma', 'funding'], humanReviewRequired: true }
    });

    expect(board.statusLabel).not.toBe('Ready');
    expect(board.boardDistributionLabel).toBe('Not ready');
    expect(board.requiredBeforeDistribution).toContain('Human review');
    expect(board.requiredBeforeDistribution.some((line) => /module score/i.test(line))).toBe(true);
  });

  it('uses Review PMI title for PMI recommended actions', () => {
    const actions = buildExecutiveRecommendedActions({
      alerts: [{ title: 'PMI integration watch', module: 'PMI', severity: 'watch' }],
      signals: []
    });

    expect(actions[0].title).toBe('Review PMI');
    expect(actions[0].suggestedOwner).toMatch(/^Suggested owner: Integration Lead/i);
  });

  it('exposes N/A clarification constant once for module readiness', () => {
    expect(MODULE_READINESS_NA_CLARIFICATION).toMatch(
      /insufficient available data, not poor operational performance/i
    );
    expect(MODULE_READINESS_NA_CLARIFICATION).not.toMatch(/approved|certified/i);
  });

  it('labels briefing packs as status-only without downloadable claims', () => {
    expect(BRIEFING_PACK_STATUS_ONLY_NOTE).toMatch(/status only/i);
    expect(BRIEFING_PACK_STATUS_ONLY_NOTE).toMatch(/not a downloadable/i);
    expect(BRIEFING_PACK_STATUS_ONLY_NOTE).toMatch(/not a downloadable or certified pack/i);
  });

  it('prefers session generatedAt over localStorage trace for board review draft status', () => {
    const session = resolveBoardReviewDraftPackStatus({
      sessionGeneratedAt: '2026-06-08T12:00:00.000Z',
      lastDraftTraceAt: '2026-06-01T12:00:00.000Z'
    });
    const traceOnly = resolveBoardReviewDraftPackStatus({
      lastDraftTraceAt: '2026-06-01T12:00:00.000Z'
    });
    const empty = resolveBoardReviewDraftPackStatus({});

    expect(session.statusLabel).toMatch(/draft prepared this session/i);
    expect(traceOnly.statusLabel).toBe('Previous draft trace');
    expect(traceOnly.statusLabel).not.toBe('Prepared');
    expect(empty.statusLabel).toBe('Draft');
  });

  it('exposes generate disabled and print draft hints without certified export claims', () => {
    expect(BOARD_PACK_GENERATE_DISABLED_HINT).toMatch(/admin or board member/i);
    expect(BOARD_PACK_PRINT_DRAFT_HINT).toMatch(/browser print/i);
    expect(BOARD_PACK_PRINT_DRAFT_HINT).toMatch(/draft only/i);
    expect(BOARD_PACK_PRINT_DRAFT_HINT).toMatch(/layout may vary/i);
    expect(BOARD_PACK_PRINT_DRAFT_HINT).not.toMatch(/export pdf|certified/i);
  });
});

describe('Executive command center demo affordance constants', () => {
  it('uses honest reporting workspace CTA labels and routes', () => {
    expect(CEO_REPORTING_WORKSPACE_BUTTON_LABEL).toBe('Open reporting workspace');
    expect(CEO_REPORTING_WORKSPACE_ROUTE).toBe('/reporting/dashboard');
    expect(CEO_REPORTING_WORKSPACE_HINT).toMatch(/reporting metadata/i);
    expect(CEO_REPORTING_WORKSPACE_HINT).not.toMatch(/briefing pack|certified|download/i);
    expect(CEO_DECISION_QUEUE_STATUS_NOTE).toMatch(/read-only/i);
    expect(CEO_DECISION_QUEUE_STATUS_NOTE).toMatch(/not clickable/i);
    expect(CEO_EXECUTIVE_SIGNAL_STATUS_NOTE).toMatch(/read-only/i);
    expect(CEO_EXECUTIVE_SIGNAL_STATUS_NOTE).toMatch(/not clickable/i);
    expect(CEO_WORKFLOW_STATUS_NOTE).toMatch(/process status only/i);
    expect(CEO_BRIEFING_PACKS_SECTION_NOTE).toMatch(/not downloadable or certified pack/i);
  });
});
