import { describe, expect, it } from 'vitest';

import { calculateBridgePriorityGolden } from '../../../backend/services/bridge/bridgeGoldenFormulas.js';
import {
  calculateBridgeSummary,
  calculateSignalPriority
} from '../../../backend/services/bridge/bridge.service.js';

/**
 * operationalSignalPriority — product DSS heuristic for Bridge attention ordering.
 * Implemented today as `calculateSignalPriority()` in bridge.service.js (C.13.5E Option C).
 * Not the Golden benchmark (`bridgePriorityGolden` / calculateBridgePriorityGolden).
 */
const operationalSignalPriority = calculateSignalPriority;

function expectOperationalPriority(signal, expectedScore) {
  expect(operationalSignalPriority(signal)).toBe(expectedScore);
}

describe('operationalSignalPriority — Bridge DSS heuristic (calculateSignalPriority)', () => {
  it('uses severity rank as primary driver (blocked > critical > risk > watch)', () => {
    expectOperationalPriority({ severity: 'blocked', confidenceLevel: 0 }, 100);
    expectOperationalPriority({ severity: 'critical', confidenceLevel: 0 }, 72);
    expectOperationalPriority({ severity: 'risk', confidenceLevel: 0 }, 54);
    expectOperationalPriority({ severity: 'watch', confidenceLevel: 0 }, 36);
    expectOperationalPriority({ severity: 'info', confidenceLevel: 0 }, 18);
  });

  it('adds confidenceLevel contribution (clamped 0–100, weight 0.2)', () => {
    expectOperationalPriority({ severity: 'watch', confidenceLevel: 50 }, 46);
    expectOperationalPriority({ severity: 'risk', confidenceLevel: 60 }, 66);
  });

  it('applies blocking bonus when severity is blocked', () => {
    const withoutBonusBaseline = operationalSignalPriority({
      severity: 'critical',
      confidenceLevel: 80
    });

    expectOperationalPriority({ severity: 'blocked', confidenceLevel: 80 }, 100);
    expect(withoutBonusBaseline).toBeLessThan(100);
  });

  it('applies stale penalty when staleFlag is set', () => {
    const fresh = operationalSignalPriority({
      severity: 'risk',
      confidenceLevel: 50,
      staleFlag: false
    });
    const stale = operationalSignalPriority({
      severity: 'risk',
      confidenceLevel: 50,
      staleFlag: true
    });

    expect(stale).toBe(fresh - 8);
  });

  it('clamps operational priority to 0–100', () => {
    expectOperationalPriority(
      { severity: 'blocked', confidenceLevel: 100, staleFlag: false },
      100
    );
    expectOperationalPriority(
      { severity: 'info', confidenceLevel: 0, staleFlag: true },
      10
    );
  });

  it('defaults unknown severity to watch rank and missing confidence to zero', () => {
    expectOperationalPriority({ severity: 'unknown-severity' }, 36);
    expectOperationalPriority({ severity: 'watch' }, 36);
  });

  it('is not equivalent to bridgePriorityGolden (dual-layer Option C)', () => {
    const goldenPriority = calculateBridgePriorityGolden({
      impact: 80,
      urgency: 70,
      confidence: 60
    });

    expect(goldenPriority).toBe(73);

    const operationalPriority = operationalSignalPriority({
      severity: 'blocked',
      confidenceLevel: 80
    });

    expect(operationalPriority).not.toBe(goldenPriority);
    expect(operationalPriority).toBe(100);
  });
});

describe('operationalSignalPriority — Bridge summary integration', () => {
  it('orders topRecommendedActions by operational priority, not Golden weights', () => {
    const summary = calculateBridgeSummary({
      signals: [
        {
          severity: 'watch',
          status: 'open',
          confidenceLevel: 90,
          recommendedAction: 'Watch action'
        },
        {
          severity: 'blocked',
          status: 'open',
          confidenceLevel: 40,
          recommendedAction: 'Blocked action'
        }
      ],
      dependencies: [],
      conflicts: [],
      attentionQueue: []
    });

    expect(summary.topRecommendedActions[0]).toBe('Blocked action');
    expect(summary.topRecommendedActions[1]).toBe('Watch action');
  });
});
