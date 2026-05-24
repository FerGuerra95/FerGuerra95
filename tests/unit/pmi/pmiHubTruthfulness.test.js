import { describe, expect, it } from 'vitest';

import {
  buildPmiSignal,
  resolvePmiExecutiveHubTruthfulness
} from '../../../backend/services/pmi/pmi.service.js';

describe('PMI executive hub truthfulness — buildPmiSignal', () => {
  it('returns null score and insufficient_data when no persisted case exists', () => {
    const signal = buildPmiSignal(null);

    expect(signal.score).toBeNull();
    expect(signal.truthfulnessStatus).toBe('insufficient_data');
    expect(signal.dataSource).toBe('empty');
    expect(signal.humanReviewRequired).toBe(true);
    expect(signal.executiveSignalEligible).toBe(false);
    expect(signal.title).toBe('PMI data pending');
  });

  it('computes operational signal when a persisted case is present', () => {
    const signal = buildPmiSignal({
      id: 'case-1',
      synergyTarget: 4_000_000,
      synergyCaptured: 1_000_000,
      workstreams: [{ progress: 80 }],
      milestones: [{ progress: 70 }],
      risks: [],
      synergyLedger: [],
      playbooks: [],
      dependencies: []
    });

    expect(signal.score).toBeGreaterThan(0);
    expect(signal.executiveSignalEligible).not.toBe(false);
  });
});

describe('PMI executive hub truthfulness — resolvePmiExecutiveHubTruthfulness', () => {
  it('blocks executive signal eligibility when there is no persisted case', () => {
    const truthfulness = resolvePmiExecutiveHubTruthfulness({
      cases: [],
      latestCase: null,
      signal: buildPmiSignal(null)
    });

    expect(truthfulness.executiveSignalEligible).toBe(false);
    expect(truthfulness.dataSource).toBe('empty');
    expect(truthfulness.demoDataIncluded).toBe(false);
    expect(truthfulness.humanReviewRequired).toBe(true);
  });

  it('allows executive signal when a persisted latest case exists', () => {
    const truthfulness = resolvePmiExecutiveHubTruthfulness({
      cases: [{ id: 'case-1' }],
      latestCase: { id: 'case-1', dealName: 'Persisted PMI' },
      signal: { score: 72, humanReviewRequired: false },
      enterpriseMetrics: { requiresExecutiveAttention: false }
    });

    expect(truthfulness.executiveSignalEligible).toBe(true);
    expect(truthfulness.dataSource).toBe('persisted');
    expect(truthfulness.demoDataIncluded).toBe(false);
  });
});
