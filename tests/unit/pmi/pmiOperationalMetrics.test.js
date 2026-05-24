import { describe, expect, it } from 'vitest';

import { calculatePmiCaptureRateGolden } from '../../../backend/services/pmi/pmiGoldenFormulas.js';
import {
  calculateOperationalPmiCaseCapture,
  calculateOperationalPmiEnterpriseCaptureRatio,
  calculateOperationalPmiLedgerCapture
} from '../../../backend/services/pmi/pmiOperationalFormulas.js';
import { calculatePmiEnterpriseMetrics } from '../../../backend/services/pmi/pmi.service.js';

describe('operationalPmiCaseCapture — synergyCaptured / synergyTarget (DSS case)', () => {
  it('returns 25% when target is 4M and captured is 1M', () => {
    const result = calculateOperationalPmiCaseCapture({
      synergyTarget: 4_000_000,
      synergyCaptured: 1_000_000
    });

    expect(result.captureRatePercent).toBe(25);
    expect(result.captureRateDecimal).toBe(0.25);
    expect(result.isCalculable).toBe(true);
  });

  it('returns 0% when captured is zero and target is valid', () => {
    const result = calculateOperationalPmiCaseCapture({
      synergyTarget: 4_000_000,
      synergyCaptured: 0
    });

    expect(result.captureRatePercent).toBe(0);
    expect(result.isCalculable).toBe(true);
  });

  it('returns null when target is zero (aligned with Golden null semantics)', () => {
    const result = calculateOperationalPmiCaseCapture({
      synergyTarget: 0,
      synergyCaptured: 100_000
    });

    expect(result.captureRatePercent).toBeNull();
    expect(result.isCalculable).toBe(false);
    expect(result.reason).toBe('target_zero_or_invalid');
  });

  it('accepts numeric strings via normalizeNumber', () => {
    const result = calculateOperationalPmiCaseCapture({
      synergyTarget: '4000000',
      synergyCaptured: '1000000'
    });

    expect(result.captureRatePercent).toBe(25);
  });

  it('returns null for invalid target string (normalizes to zero denominator)', () => {
    const result = calculateOperationalPmiCaseCapture({
      synergyTarget: 'bad',
      synergyCaptured: 1_000_000
    });

    expect(result.captureRatePercent).toBeNull();
    expect(result.isCalculable).toBe(false);
  });
});

describe('operationalPmiLedgerCapture — Σcaptured / Σforecast (DSS ledger)', () => {
  it('returns 30% for multi-line ledger totals', () => {
    const result = calculateOperationalPmiLedgerCapture([
      { forecast: 2_000_000, captured: 500_000 },
      { forecast: 3_000_000, captured: 1_000_000 }
    ]);

    expect(result.ledgerForecast).toBe(5_000_000);
    expect(result.ledgerCaptured).toBe(1_500_000);
    expect(result.captureRatePercent).toBe(30);
  });

  it('returns null when forecast sum is zero (aligned with Golden zero forecast)', () => {
    const result = calculateOperationalPmiLedgerCapture([
      { forecast: 0, captured: 100_000 }
    ]);

    expect(result.captureRatePercent).toBeNull();
    expect(result.isCalculable).toBe(false);
  });

  it('returns null for empty ledger without NaN', () => {
    const result = calculateOperationalPmiLedgerCapture([]);

    expect(result.captureRatePercent).toBeNull();
    expect(result.ledgerForecast).toBe(0);
    expect(result.ledgerCaptured).toBe(0);
    expect(Number.isNaN(result.captureRatePercent)).toBe(false);
  });

  it('does not propagate NaN or Infinity from line items', () => {
    const result = calculateOperationalPmiLedgerCapture([
      { forecast: NaN, captured: 100 },
      { forecast: 1_000, captured: Infinity }
    ]);

    expect(Number.isFinite(result.captureRatePercent)).toBe(true);
  });
});

describe('operationalPmiEnterpriseCapture — capturedValue / targetValue (DSS enterprise)', () => {
  it('returns 62% when enterprise initiatives sum to 1M target and 620k captured', () => {
    const result = calculateOperationalPmiEnterpriseCaptureRatio({
      synergies: [{ targetValue: 1_000_000, capturedValue: 620_000 }]
    });

    expect(result.synergyCaptureRatio).toBe(62);
    expect(result.source).toBe('synergies');
  });

  it('returns null when total targetValue is zero', () => {
    const result = calculateOperationalPmiEnterpriseCaptureRatio({
      synergies: [{ targetValue: 0, capturedValue: 620_000 }]
    });

    expect(result.synergyCaptureRatio).toBeNull();
  });

  it('calculatePmiEnterpriseMetrics sets not_calculable when enterprise target is zero', () => {
    const metrics = calculatePmiEnterpriseMetrics({
      synergies: [{ targetValue: 0, capturedValue: 620_000, status: 'in_progress' }]
    });

    expect(metrics.synergyCaptureRatio).toBeNull();
    expect(metrics.valueCaptureStatus).toBe('not_calculable');
  });

  it('prefers enterprise synergies over case targets when synergy sums are positive', () => {
    const result = calculateOperationalPmiEnterpriseCaptureRatio({
      synergies: [{ targetValue: 1_000_000, capturedValue: 500_000 }],
      cases: [{ synergyTarget: 10_000_000, synergyCaptured: 9_000_000 }]
    });

    expect(result.synergyCaptureRatio).toBe(50);
    expect(result.source).toBe('synergies');
  });

  it('matches calculatePmiEnterpriseMetrics synergyCaptureRatio for the same inputs', () => {
    const input = {
      synergies: [{ targetValue: 1_000_000, capturedValue: 620_000, status: 'in_progress' }]
    };
    const harness = calculateOperationalPmiEnterpriseCaptureRatio(input);
    const metrics = calculatePmiEnterpriseMetrics(input);

    expect(metrics.synergyCaptureRatio).toBe(harness.synergyCaptureRatio);
    expect(metrics.synergyCaptureRatio).toBe(62);
  });
});

describe('operationalPmiReadinessScore — DSS composite (calculatePmiEnterpriseMetrics)', () => {
  const healthyBaseline = {
    synergies: [{ targetValue: 2_000_000, capturedValue: 1_500_000, status: 'in_progress', valueLeakageRisk: 'low' }],
    milestones: [{ progress: 90, status: 'in_progress', dueDate: '2099-01-01' }],
    risks: [{ severity: 'low', status: 'mitigated' }],
    dayOneItems: [{ readinessScore: 95 }, { readinessScore: 90 }],
    hundredDayItems: [{ period: 'day_30', valueCaptureProgress: 85 }]
  };

  const stressedBaseline = {
    synergies: [
      { targetValue: 2_000_000, capturedValue: 200_000, status: 'at_risk', valueLeakageRisk: 'high' },
      { targetValue: 1_000_000, capturedValue: 0, status: 'delayed', valueLeakageRisk: 'critical' }
    ],
    milestones: [
      { progress: 20, status: 'delayed', dueDate: '2000-01-01', criticalPathFlag: true, blockers: ['TSA'] }
    ],
    risks: [{ severity: 'critical', status: 'open' }],
    dayOneItems: [{ readinessScore: 40 }],
    transitionServices: [{ risk: 'high', endDate: '2000-01-01' }],
    technologyItems: [{ dataMigrationRisk: 'high', status: 'blocked' }]
  };

  it('returns finite readiness scores bounded 0–100', () => {
    const metrics = calculatePmiEnterpriseMetrics(healthyBaseline);

    expect(metrics.pmiReadinessScore).toBeGreaterThanOrEqual(0);
    expect(metrics.pmiReadinessScore).toBeLessThanOrEqual(100);
    expect(metrics.integrationReadinessScore).toBe(metrics.pmiReadinessScore);
    expect(Number.isFinite(metrics.pmiReadinessScore)).toBe(true);
  });

  it('scores lower under day1 delay, low capture, delayed milestones, risks, and blocked synergies', () => {
    const healthy = calculatePmiEnterpriseMetrics(healthyBaseline);
    const stressed = calculatePmiEnterpriseMetrics(stressedBaseline);

    expect(stressed.pmiReadinessScore).toBeLessThan(healthy.pmiReadinessScore);
    expect(stressed.blockedSynergies).toBeGreaterThan(0);
    expect(stressed.criticalIntegrationRisks).toBeGreaterThan(0);
    expect(stressed.delayedMilestones).toBeGreaterThan(0);
  });

  it('scores higher when day1 readiness, capture, and milestones improve', () => {
    const lowCapture = calculatePmiEnterpriseMetrics({
      ...healthyBaseline,
      synergies: [{ targetValue: 2_000_000, capturedValue: 200_000, status: 'in_progress', valueLeakageRisk: 'low' }]
    });
    const highCapture = calculatePmiEnterpriseMetrics(healthyBaseline);

    expect(highCapture.pmiReadinessScore).toBeGreaterThan(lowCapture.pmiReadinessScore);
  });

  it('is not PMI_CAPTURE_RATE Golden and does not substitute Golden capture', () => {
    const metrics = calculatePmiEnterpriseMetrics({
      synergies: [{ targetValue: 5_000_000, capturedValue: 1_500_000, status: 'in_progress' }]
    });
    const golden = calculatePmiCaptureRateGolden({
      forecastSynergy: 5_000_000,
      capturedSynergy: 1_500_000
    });

    expect(metrics.synergyCaptureRatio).toBe(30);
    expect(golden.captureRatePercent).toBe(30);
    expect(metrics.pmiReadinessScore).not.toBe(golden.captureRatePercent);
    expect(typeof metrics.pmiReadinessScore).toBe('number');
  });
});

describe('PMI dual-layer truthfulness — Golden vs operational DSS', () => {
  it('case capture uses target; Golden uses forecast — same captured can yield different rates', () => {
    const operational = calculateOperationalPmiCaseCapture({
      synergyTarget: 3_000_000,
      synergyCaptured: 1_500_000
    });
    const golden = calculatePmiCaptureRateGolden({
      forecastSynergy: 5_000_000,
      capturedSynergy: 1_500_000
    });

    expect(operational.captureRatePercent).toBe(50);
    expect(golden.captureRatePercent).toBe(30);
    expect(operational.captureRatePercent).not.toBe(golden.captureRatePercent);
  });

  it('ledger operational zero forecast returns null; Golden returns null', () => {
    const operational = calculateOperationalPmiLedgerCapture([{ forecast: 0, captured: 100_000 }]);
    const golden = calculatePmiCaptureRateGolden({ forecastSynergy: 0, capturedSynergy: 100_000 });

    expect(operational.captureRatePercent).toBeNull();
    expect(golden.captureRatePercent).toBeNull();
    expect(golden.isCalculable).toBe(false);
  });

  it('readiness score is a DSS heuristic, not a certified Golden formula', () => {
    const metrics = calculatePmiEnterpriseMetrics({
      dayOneItems: [{ readinessScore: 80 }]
    });

    expect(metrics.pmiReadinessScore).toBeGreaterThanOrEqual(0);
    expect(metrics.humanReviewPosture).toBeDefined();
    expect(metrics).not.toHaveProperty('captureRateDecimal');
  });
});
