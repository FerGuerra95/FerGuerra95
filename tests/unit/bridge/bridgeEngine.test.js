import { describe, expect, it } from 'vitest';

import {
  buildEnterpriseBridgeSignals,
  calculateBridgeSummary,
  calculateSignalPriority
} from '../../../backend/services/bridge/bridge.service.js';

describe('enterprise bridge engine', () => {
  it('genera senales minimas defensivas desde summaries disponibles y no disponibles', () => {
    const signals = buildEnterpriseBridgeSignals({
      compliance: { status: 'available', data: { legalHealthScore: 62 } },
      funding: { status: 'available', data: { metrics: { runwayMonths: 3, targetRaise: 1000000 } } },
      ma: { status: 'available', data: { latestDeal: { id: 'deal_1', name: 'Deal One', payload: { equityValue: 5000000 } } } },
      pmi: { status: 'available', data: { metrics: { synergyCaptureRatio: 28, criticalIntegrationRisks: 1 } } },
      governance: { status: 'available', data: { metrics: { pendingCriticalDecisions: 1, boardReadinessScore: 58 } } },
      strategy: { status: 'not_available', data: null }
    });

    expect(signals.map((item) => item.signalType)).toEqual(expect.arrayContaining([
      'compliance_funding_risk',
      'runway_attention_required',
      'valuation_reference_available',
      'value_capture_risk',
      'governance_blocker',
      'enterprise_risk_attention',
      'board_pack_evidence_gap',
      'strategic_capital_dependency'
    ]));
    expect(signals.every((item) => item.humanReviewStatus === 'required')).toBe(true);
  });

  it('prioriza severidad y calcula summary ejecutivo', () => {
    const priority = calculateSignalPriority({ severity: 'blocked', confidenceLevel: 80 });
    expect(priority).toBeGreaterThan(80);

    const summary = calculateBridgeSummary({
      signals: [
        { severity: 'blocked', status: 'open', confidenceLevel: 80, recommendedAction: 'Escalate' },
        { severity: 'watch', status: 'resolved', confidenceLevel: 50 }
      ],
      dependencies: [{ blockingFlag: 1, status: 'open' }],
      conflicts: [{ status: 'open' }],
      attentionQueue: [{ status: 'open' }]
    });

    expect(summary.criticalCrossModuleSignals).toBe(1);
    expect(summary.blockedDependencies).toBe(1);
    expect(summary.unresolvedConflicts).toBe(1);
    expect(summary.executiveAttentionCount).toBe(1);
    expect(summary.bridgeHealthStatus).toBe('blocked');
  });
});
