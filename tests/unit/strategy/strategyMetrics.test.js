import { describe, expect, it } from 'vitest';

import { calculateStrategyMetrics } from '../../../backend/services/strategy/strategy.service.js';

describe('enterprise strategy metrics', () => {
  it('calcula readiness, dependencias de capital, bloqueos y riesgo estrategico', () => {
    const metrics = calculateStrategyMetrics({
      objectives: [
        { title: 'Enter US market', status: 'active', targetMetric: 100, currentMetric: 40, linkedBoardDecisionId: 'decision_1' }
      ],
      initiatives: [
        { title: 'US GTM', status: 'blocked', progress: 35, capitalNeed: 500000, blockers: ['Board approval'], dependencies: ['board decision'] }
      ],
      scenarios: [{ confidence: 75 }],
      marketNotes: [{ market: 'US' }],
      risks: [{ impact: 'high', status: 'open' }]
    });

    expect(metrics.blockedStrategicInitiatives).toBe(1);
    expect(metrics.capitalDependencyCount).toBe(1);
    expect(metrics.boardDecisionsRequired).toBe(2);
    expect(metrics.strategicRiskLevel).toBe('high');
    expect(metrics.requiresExecutiveAttention).toBe(true);
    expect(metrics.strategyReadinessScore).toBeLessThan(80);
  });
});
