import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

import { calculateBridgePriorityGolden } from '../../../backend/services/bridge/bridgeGoldenFormulas.js';
import { calculateSignalPriority } from '../../../backend/services/bridge/bridge.service.js';

const GOLDEN_PATH = path.join(process.cwd(), 'docs/testing/golden_inputs.json');
const GOLDEN_BRIDGE_PRIORITY_ID = 'bridge_priority_score_basic';

function loadGoldenJson() {
  return JSON.parse(fs.readFileSync(GOLDEN_PATH, 'utf8'));
}

describe('bridgeGoldenFormulas — BRIDGE_PRIORITY (golden bridge_priority_score_basic)', () => {
  it('matches golden priorityScore = impact*0.5 + urgency*0.3 + confidence*0.2', () => {
    const golden = loadGoldenJson();
    const dataset = golden.datasets[GOLDEN_BRIDGE_PRIORITY_ID];
    const result = calculateBridgePriorityGolden(dataset.inputs);

    expect(result).toBeCloseTo(dataset.expected.priorityScore, 6);
    expect(result).toBe(73);
  });

  it('accepts numeric string inputs (same policy as maGoldenFormulas)', () => {
    expect(
      calculateBridgePriorityGolden({
        impact: '80',
        urgency: '70',
        confidence: '60'
      })
    ).toBe(73);
  });

  it('returns null when impact, urgency or confidence is missing', () => {
    expect(calculateBridgePriorityGolden({ urgency: 70, confidence: 60 })).toBeNull();
    expect(calculateBridgePriorityGolden({ impact: 80, confidence: 60 })).toBeNull();
    expect(calculateBridgePriorityGolden({ impact: 80, urgency: 70 })).toBeNull();
  });

  it('returns null for non-finite inputs', () => {
    expect(
      calculateBridgePriorityGolden({ impact: NaN, urgency: 70, confidence: 60 })
    ).toBeNull();
    expect(
      calculateBridgePriorityGolden({ impact: 80, urgency: Infinity, confidence: 60 })
    ).toBeNull();
    expect(
      calculateBridgePriorityGolden({ impact: 80, urgency: 70, confidence: 'bad' })
    ).toBeNull();
  });

  it('clamps priorityScore to 0–100', () => {
    expect(
      calculateBridgePriorityGolden({
        impact: 150,
        urgency: 120,
        confidence: 110
      })
    ).toBe(100);

    expect(
      calculateBridgePriorityGolden({
        impact: -20,
        urgency: 0,
        confidence: 0
      })
    ).toBe(0);
  });

  it('documents product calculateSignalPriority uses a different operational model (C13-P1-07)', () => {
    const goldenPriority = calculateBridgePriorityGolden({
      impact: 80,
      urgency: 70,
      confidence: 60
    });

    expect(goldenPriority).toBe(73);

    // Product uses severity/confidence/stale/blocking — not golden impact/urgency/confidence weights.
    const productPriority = calculateSignalPriority({
      severity: 'blocked',
      confidenceLevel: 80
    });

    expect(productPriority).not.toBe(goldenPriority);
    expect(productPriority).toBeGreaterThan(80);
  });
});
