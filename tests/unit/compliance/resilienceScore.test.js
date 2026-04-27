import { describe, expect, it } from 'vitest';
import {
  calculateResilienceScore,
  buildResilienceLevel,
  calculatePortfolioResilience
} from '../../../src/modules/compliance/engine/resilienceScore.js';

const supplierBase = {
  id: 'supplier_test_001',
  name: 'Proveedor Test',
  country: 'España',
  region: 'Europa',
  tier: 'Tier 1',
  sector: 'Industrial',
  criticality: 'Alta',
  spend: 420000,
  status: 'active'
};

describe('resilienceScore', () => {
  it('calcula la resiliencia base de un proveedor', () => {
    const score = calculateResilienceScore({
      supplier: supplierBase,
      alerts: [],
      evidenceItems: [],
      reviews: []
    });

    expect(score).toBe(51);
  });

  it('reduce la resiliencia si existen alertas high o critical abiertas', () => {
    const scoreWithoutAlerts = calculateResilienceScore({
      supplier: supplierBase,
      alerts: [],
      evidenceItems: [],
      reviews: []
    });

    const scoreWithHighAlert = calculateResilienceScore({
      supplier: supplierBase,
      alerts: [
        {
          id: 'alert_001',
          supplierId: supplierBase.id,
          severity: 'high',
          status: 'open'
        }
      ],
      evidenceItems: [],
      reviews: []
    });

    expect(scoreWithHighAlert).toBeLessThan(scoreWithoutAlerts);
  });

  it('mejora la resiliencia cuando hay evidencias y revisiones validadas', () => {
    const baseScore = calculateResilienceScore({
      supplier: supplierBase,
      alerts: [],
      evidenceItems: [],
      reviews: []
    });

    const improvedScore = calculateResilienceScore({
      supplier: supplierBase,
      alerts: [],
      evidenceItems: [
        { id: 'evidence_001', supplierId: supplierBase.id },
        { id: 'evidence_002', supplierId: supplierBase.id },
        { id: 'evidence_003', supplierId: supplierBase.id }
      ],
      reviews: [
        {
          id: 'review_001',
          supplierId: supplierBase.id,
          decision: 'validated'
        }
      ]
    });

    expect(improvedScore).toBeGreaterThan(baseScore);
  });

  it('penaliza más a proveedores críticos y de mayor spend', () => {
    const lowCriticalSupplier = {
      ...supplierBase,
      criticality: 'Baja',
      tier: 'Tier 3',
      spend: 50000
    };

    const criticalSupplier = {
      ...supplierBase,
      criticality: 'Crítica',
      tier: 'Tier 1',
      spend: 700000
    };

    const lowScore = calculateResilienceScore({
      supplier: lowCriticalSupplier,
      alerts: [],
      evidenceItems: [],
      reviews: []
    });

    const criticalScore = calculateResilienceScore({
      supplier: criticalSupplier,
      alerts: [],
      evidenceItems: [],
      reviews: []
    });

    expect(criticalScore).toBeLessThan(lowScore);
  });

  it('clasifica correctamente el nivel de resiliencia', () => {
    expect(buildResilienceLevel(85).label).toBe('Alta');
    expect(buildResilienceLevel(65).label).toBe('Media');
    expect(buildResilienceLevel(45).label).toBe('Baja');
    expect(buildResilienceLevel(25).label).toBe('Crítica');
  });

  it('calcula correctamente la resiliencia agregada de cartera', () => {
    const suppliers = [
      supplierBase,
      {
        id: 'supplier_test_002',
        name: 'Proveedor Resiliente',
        country: 'España',
        region: 'Europa',
        tier: 'Tier 3',
        sector: 'Servicios',
        criticality: 'Baja',
        spend: 40000,
        status: 'active'
      }
    ];

    const portfolio = calculatePortfolioResilience({
      suppliers,
      alerts: [],
      evidenceItems: [],
      reviews: []
    });

    expect(portfolio.averageResilienceScore).toBeGreaterThan(0);
    expect(portfolio.lowResilienceSuppliers).toBeGreaterThanOrEqual(0);
    expect(portfolio.resilientSuppliers).toBeGreaterThanOrEqual(0);
  });
});