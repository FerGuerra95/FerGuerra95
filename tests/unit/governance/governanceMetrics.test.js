import { describe, expect, it } from 'vitest';

import {
  buildGovernanceBridgeSignals,
  calculateGovernanceMetrics
} from '../../../backend/services/governance/governance.service.js';

describe('governance enterprise metrics', () => {
  it('calcula readiness, velocity, policy risk y bottlenecks', () => {
    const metrics = calculateGovernanceMetrics({
      decisions: [
        { id: 'd1', status: 'approved', priority: 'high' },
        { id: 'd2', status: 'under_review', priority: 'critical', deadlineAt: '2020-01-01', blockingDecision: 1 }
      ],
      boardPacks: [{ id: 'bp1', status: 'final' }],
      committees: [{ id: 'c1', nextMeetingDate: '2099-01-01' }],
      policies: [{ id: 'p1', reviewDate: '2020-01-01', status: 'active' }],
      actions: [{ id: 'a1', dueDate: '2020-01-01', status: 'open' }],
      meetings: []
    });

    expect(metrics.pendingCriticalDecisions).toBe(1);
    expect(metrics.policyReviewRisk).toBe(1);
    expect(metrics.overdueBoardActions).toBe(1);
    expect(metrics.approvalBottlenecks).toBeGreaterThan(0);
    expect(metrics.decisionVelocity).toBe(50);
    expect(metrics.requiresExecutiveAttention).toBe(true);
  });

  it('emite senales governance para ramas conectadas', () => {
    const signals = buildGovernanceBridgeSignals({
      pendingCriticalDecisions: 1,
      policyReviewRisk: 1,
      approvalBottlenecks: 1,
      governanceRisks: 3,
      boardReadinessScore: 80
    });

    expect(signals).toContain('governance.decision_required_for_ma');
    expect(signals).toContain('governance.policy_overdue_affects_compliance');
    expect(signals).toContain('governance.board_approval_required_for_funding');
    expect(signals).toContain('governance.risk_committee_required');
    expect(signals).toContain('governance.board_pack_ready');
  });
});
