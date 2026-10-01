import { describe, expect, it } from 'vitest';

import { buildRiskLevel } from '../../../src/modules/ma/engine/riskScoring.js';
import {
  SYNCHRONIZED_REPOSITORY_SCORE,
  formatRepositoryDealCount,
  getDealPostureLabel,
  getDealUpdatedAt,
  getRepositoryAccessLabel,
  getRepositoryHealth
} from '../../../src/modules/ma/engine/maRepositoryCoherence.js';

describe('M&A deal repository coherence', () => {
  it('treats the ring score as sync completeness, not a count heuristic', () => {
    const synced = getRepositoryHealth({
      count: 1,
      backendStatus: { lastSyncAt: '2026-09-17T10:00:00.000Z', error: null }
    });

    expect(synced.score).toBe(SYNCHRONIZED_REPOSITORY_SCORE);
    expect(synced.score).toBe(100);
    expect(synced.title).toBe('Repository synchronized');
    expect(synced.posture).toBe('Synced');
    expect(synced.description).toMatch(/sincronización completada/i);
    expect(synced.description).not.toMatch(
      /Los deals guardados están sincronizados/
    );

    const manySynced = getRepositoryHealth({
      count: 8,
      backendStatus: { lastSyncAt: '2026-09-17T10:00:00.000Z', error: null }
    });
    expect(manySynced.score).toBe(100);

    const fallback = getRepositoryHealth({
      count: 1,
      backendStatus: { error: 'backend down', lastSyncAt: null }
    });
    expect(fallback.score).toBeNull();
    expect(fallback.posture).toBe('Local fallback');
    expect(fallback.title).toBe('Local repository mode');

    const ready = getRepositoryHealth({
      count: 2,
      backendStatus: { lastSyncAt: null, error: null }
    });
    expect(ready.score).toBeNull();
    expect(ready.title).toBe('Repository ready');
  });

  it('keeps last sync ownership independent from persisted case updatedAt', () => {
    const lastSyncAt = '2026-09-17T12:00:00.000Z';
    const item = {
      createdAt: '2026-09-01T08:00:00.000Z',
      updatedAt: '2026-09-10T09:30:00.000Z'
    };

    expect(getDealUpdatedAt(item)).toBe('2026-09-10T09:30:00.000Z');
    expect(getDealUpdatedAt(item)).not.toBe(lastSyncAt);
    expect(getDealUpdatedAt({ createdAt: item.createdAt })).toBe(
      item.createdAt
    );
    expect(getDealUpdatedAt(item)).not.toBe(item.createdAt);
  });

  it('maps Access from real RBAC capability, not a hardcoded Manage label', () => {
    expect(
      getRepositoryAccessLabel({ canDeleteCase: true, canEditCase: true })
    ).toBe('Manage');
    expect(
      getRepositoryAccessLabel({ canDeleteCase: false, canEditCase: true })
    ).toBe('Edit');
    expect(
      getRepositoryAccessLabel({ canDeleteCase: false, canEditCase: false })
    ).toBe('Read-only');
  });

  it('uses canonical saved risk posture instead of a quality-score fallback string', () => {
    expect(
      getDealPostureLabel({ snapshot: { riskLevel: 'Medio', qualityScore: 70 } })
    ).toBe('Medio');
    expect(
      getDealPostureLabel({
        snapshot: { riskLevel: { label: 'Alto' }, qualityScore: 40 }
      })
    ).toBe('Alto');

    const derived = buildRiskLevel(70);
    expect(derived.label).toBe('Medio');
    expect(getDealPostureLabel({ snapshot: { qualityScore: 70 } })).toBe(
      derived.label
    );
    expect(getDealPostureLabel({ snapshot: { qualityScore: 70 } })).not.toBe(
      'Q 70'
    );
  });

  it('formats singular and plural deal counts', () => {
    expect(formatRepositoryDealCount(1)).toBe('1 deal');
    expect(formatRepositoryDealCount(2)).toBe('2 deals');
    expect(formatRepositoryDealCount(0)).toBe('0 deals');
  });
});
