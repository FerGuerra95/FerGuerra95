import { describe, expect, it } from 'vitest';

import { calculateRiskMetrics } from '../../../backend/services/risk/risk.service.js';

describe('enterprise risk metrics', () => {
  it('calcula readiness, residual risk, breaches y atencion ejecutiva', () => {
    const metrics = calculateRiskMetrics({
      risks: [
        { title: 'Cyber outage', inherentSeverity: 'critical', residualRisk: 'critical', likelihood: 5, impact: 5, status: 'open', category: 'technology' },
        { title: 'Supplier exposure', inherentSeverity: 'high', residualRisk: 'medium', likelihood: 3, impact: 4, status: 'open', category: 'operational' }
      ],
      controls: [{ riskId: 'risk_1', status: 'active', effectiveness: 82 }],
      mitigations: [{ dueDate: '2000-01-01', status: 'open' }],
      incidents: [{ severity: 'high', status: 'open' }],
      kri: [{ threshold: 10, actualValue: 14 }],
      appetite: [{ breachFlag: 1 }]
    });

    expect(metrics.criticalRiskCount).toBe(1);
    expect(metrics.overdueMitigations).toBe(1);
    expect(metrics.kriBreaches).toBe(1);
    expect(metrics.appetiteBreaches).toBe(1);
    expect(metrics.requiresExecutiveAttention).toBe(true);
    expect(metrics.riskReadinessScore).toBeLessThan(80);
  });
});
