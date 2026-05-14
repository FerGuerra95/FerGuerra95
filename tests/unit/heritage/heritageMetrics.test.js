import { describe, expect, it } from 'vitest';

import {
  buildHeritageBridgeSignals,
  summarizeHeritage
} from '../../../backend/services/heritage/heritage.service.js';

describe('heritage enterprise metrics', () => {
  it('calcula continuidad patrimonial sin NaN ni valores fuera de rango', () => {
    const metrics = summarizeHeritage({
      assets: [
        { protectionStatus: 'protected', liquidityProfile: 'medium', riskLevel: 'medium', estimatedValue: 5000000 },
        { protectionStatus: 'mapped', liquidityProfile: 'low', riskLevel: 'high', estimatedValue: 1500000 }
      ],
      successions: [
        { status: 'active', readiness: 82, evidenceStatus: 'ready' },
        { status: 'draft', readiness: 40, evidenceStatus: 'pending' }
      ],
      protections: [
        { coverage: 90 },
        { coverage: 42 }
      ]
    });

    expect(metrics.totalAssetValue).toBe(6500000);
    expect(metrics.liquidityRiskCount).toBe(1);
    expect(metrics.weakProtectionsCount).toBe(1);
    expect(metrics.openSuccessionItemsCount).toBe(1);
    expect(metrics.score).toBeGreaterThanOrEqual(0);
    expect(metrics.score).toBeLessThanOrEqual(100);
  });

  it('emite señales bridge cuando hay riesgo de sucesion, proteccion o liquidez', () => {
    const signals = buildHeritageBridgeSignals({
      metrics: {
        openSuccessionItemsCount: 1,
        successionReadiness: 55,
        liquidityRiskCount: 1,
        weakProtectionsCount: 1,
        protectionCoverage: 58,
        boardReadinessScore: 60
      }
    });

    expect(signals.map((signal) => signal.type)).toEqual(
      expect.arrayContaining([
        'heritage.succession_risk_affects_governance',
        'heritage.asset_liquidity_risk_affects_funding',
        'heritage.protection_gap_affects_compliance',
        'heritage.board_review_required'
      ])
    );
  });
});
