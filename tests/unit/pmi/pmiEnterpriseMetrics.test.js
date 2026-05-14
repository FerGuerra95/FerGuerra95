import { describe, expect, it } from 'vitest';

import {
  buildPmiBridgeSignals,
  calculatePmiEnterpriseMetrics
} from '../../../backend/services/pmi/pmi.service.js';

describe('PMI enterprise metrics', () => {
  it('calcula readiness, captura de sinergias y riesgos enterprise', () => {
    const metrics = calculatePmiEnterpriseMetrics({
      programs: [{ integrationPhase: 'day_60' }],
      synergies: [
        { targetValue: 1000, capturedValue: 500, status: 'in_progress', valueLeakageRisk: 'medium' },
        { targetValue: 1000, capturedValue: 250, status: 'at_risk', valueLeakageRisk: 'high' }
      ],
      milestones: [
        { progress: 80, status: 'in_progress', dueDate: '2099-01-01' },
        { progress: 20, status: 'delayed', criticalPathFlag: true, blockers: ['TSA dependency'] }
      ],
      risks: [{ severity: 'critical', status: 'open' }],
      dayOneItems: [{ readinessScore: 80 }, { readinessScore: 60 }],
      hundredDayItems: [
        { period: 'day_30', valueCaptureProgress: 75 },
        { period: 'day_60', valueCaptureProgress: 40 }
      ],
      transitionServices: [{ risk: 'high', endDate: '2099-01-01' }],
      peopleCultureItems: [{ keyPeopleRisk: 'medium' }],
      technologyItems: [{ dataMigrationRisk: 'high' }]
    });

    expect(metrics.synergyCaptureRatio).toBe(38);
    expect(metrics.day1ReadinessScore).toBe(70);
    expect(metrics.day30Progress).toBe(75);
    expect(metrics.delayedMilestones).toBe(1);
    expect(metrics.criticalIntegrationRisks).toBe(1);
    expect(metrics.blockedSynergies).toBe(1);
    expect(metrics.tsaRisk).toBe(1);
    expect(metrics.technologyRisk).toBe(1);
    expect(metrics.requiresExecutiveAttention).toBe(true);
    expect(metrics.pmiReadinessScore).toBeGreaterThan(0);
  });

  it('emite senales Bridge cuando el valor o Day 1 estan en riesgo', () => {
    const signals = buildPmiBridgeSignals({
      synergyCaptureRatio: 30,
      delayedMilestones: 1,
      criticalBlockers: 1,
      criticalIntegrationRisks: 1,
      blockedSynergies: 1,
      tsaRisk: 1,
      day1ReadinessScore: 55,
      integrationRisks: 1,
      valueCaptureStatus: 'at_risk',
      requiresExecutiveAttention: true
    });

    expect(signals).toContain('pmi.synergy_delay_affects_ma_value');
    expect(signals).toContain('pmi.governance_decision_required');
    expect(signals).toContain('pmi.integration_risk_critical');
    expect(signals).toContain('pmi.value_capture_at_risk');
    expect(signals).toContain('pmi.tsa_exit_risk');
    expect(signals).toContain('pmi.day1_not_ready');
  });
});
