import { describe, expect, it } from 'vitest';

import { calculateRiskMetrics } from '../../../backend/services/risk/risk.service.js';

describe('risk empty org truthfulness', () => {
  it('does not produce default readiness scores when no risks exist', () => {
    const metrics = calculateRiskMetrics({
      risks: [],
      controls: [],
      mitigations: [],
      incidents: [],
      kri: [],
      appetite: [],
      committeeReviews: [],
      evidenceLinks: []
    });

    expect(metrics.riskReadinessScore).toBeNull();
    expect(metrics.riskPosture).toBe('not_assessed');
    expect(metrics.dataSource).toBe('insufficient_data');
    expect(metrics.executiveSignalEligible).toBe(false);
    expect(metrics.riskReadinessScore).not.toBe(30);
    expect(metrics.riskReadinessScore).not.toBe(70);
    expect(metrics.riskReadinessScore).not.toBe(100);
  });
});
