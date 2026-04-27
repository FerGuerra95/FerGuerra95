// @vitest-environment jsdom

import { describe, expect, it } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useComplianceEngine } from '../../../src/modules/compliance/engine/useComplianceEngine.js';

const suppliers = [
  {
    id: 'supplier_001',
    name: 'IberTextile Manufacturing',
    country: 'España',
    region: 'Europa',
    tier: 'Tier 1',
    sector: 'Textil',
    criticality: 'Alta',
    spend: 420000,
    status: 'active',
    lastReviewAt: '2026-04-20T10:30:00.000Z'
  },
  {
    id: 'supplier_002',
    name: 'MetalWorks Components',
    country: 'Marruecos',
    region: 'África Norte',
    tier: 'Tier 2',
    sector: 'Industrial',
    criticality: 'Media',
    spend: 260000,
    status: 'watchlist',
    lastReviewAt: '2026-04-18T09:15:00.000Z'
  }
];

const alerts = [
  {
    id: 'alert_001',
    supplierId: 'supplier_001',
    title: 'Dependencia crítica de proveedor',
    category: 'Operational Risk',
    severity: 'high',
    status: 'open',
    source: 'Internal assessment',
    createdAt: '2026-04-21T08:20:00.000Z',
    description: 'El proveedor concentra parte relevante del suministro.'
  },
  {
    id: 'alert_002',
    supplierId: 'supplier_002',
    title: 'Incremento de riesgo geográfico',
    category: 'Geopolitical Risk',
    severity: 'medium',
    status: 'in_review',
    source: 'Country risk monitor',
    createdAt: '2026-04-22T11:10:00.000Z',
    description: 'Se detecta aumento de riesgo regional.'
  }
];

const evidenceItems = [
  {
    id: 'evidence_001',
    supplierId: 'supplier_001',
    alertId: 'alert_001',
    title: 'Evidencia documental',
    sourceType: 'manual',
    sourceUrl: 'https://example.com/evidence',
    language: 'es',
    excerpt: 'Extracto de evidencia.',
    translatedExcerpt: '',
    confidence: 0.8,
    createdAt: '2026-04-22T10:00:00.000Z'
  }
];

const reviews = [
  {
    id: 'review_001',
    alertId: 'alert_001',
    supplierId: 'supplier_001',
    status: 'pending',
    reviewer: '',
    decision: '',
    notes: '',
    createdAt: '2026-04-22T12:30:00.000Z',
    decidedAt: ''
  }
];

describe('useComplianceEngine', () => {
  it('selecciona el proveedor activo y enriquece proveedores con scoring', () => {
    const { result } = renderHook(() =>
      useComplianceEngine({
        suppliers,
        alerts,
        evidenceItems,
        reviews,
        activeSupplierId: 'supplier_001'
      })
    );

    expect(result.current.activeSupplier.id).toBe('supplier_001');
    expect(result.current.activeSupplier.name).toBe('IberTextile Manufacturing');

    expect(result.current.suppliers.length).toBe(2);

    result.current.suppliers.forEach((supplier) => {
      expect(supplier).toHaveProperty('riskScore');
      expect(supplier).toHaveProperty('resilienceScore');
      expect(supplier).toHaveProperty('riskLevel');
      expect(supplier).toHaveProperty('resilienceLevel');

      expect(supplier.riskScore).toBeGreaterThanOrEqual(0);
      expect(supplier.riskScore).toBeLessThanOrEqual(100);

      expect(supplier.resilienceScore).toBeGreaterThanOrEqual(0);
      expect(supplier.resilienceScore).toBeLessThanOrEqual(100);
    });
  });

  it('filtra alertas, evidencias y revisiones del proveedor activo', () => {
    const { result } = renderHook(() =>
      useComplianceEngine({
        suppliers,
        alerts,
        evidenceItems,
        reviews,
        activeSupplierId: 'supplier_001'
      })
    );

    expect(result.current.activeSupplierAlerts.length).toBe(1);
    expect(result.current.activeSupplierAlerts[0].id).toBe('alert_001');

    expect(result.current.activeSupplierEvidence.length).toBe(1);
    expect(result.current.activeSupplierEvidence[0].id).toBe('evidence_001');

    expect(result.current.activeSupplierReviews.length).toBe(1);
    expect(result.current.activeSupplierReviews[0].id).toBe('review_001');
  });

  it('calcula métricas de cartera y tarjetas de dashboard', () => {
    const { result } = renderHook(() =>
      useComplianceEngine({
        suppliers,
        alerts,
        evidenceItems,
        reviews,
        activeSupplierId: 'supplier_001'
      })
    );

    expect(result.current.portfolioRisk).toHaveProperty('averageRiskScore');
    expect(result.current.portfolioRisk).toHaveProperty('highRiskSuppliers');
    expect(result.current.portfolioRisk).toHaveProperty('openAlerts');
    expect(result.current.portfolioRisk).toHaveProperty('evidenceCoverage');

    expect(result.current.portfolioResilience).toHaveProperty(
      'averageResilienceScore'
    );

    expect(Array.isArray(result.current.dashboardCards)).toBe(true);
    expect(result.current.dashboardCards.length).toBe(4);

    expect(result.current.dashboardCards[0].value).toBe(2);
  });

  it('construye timeline, resumen de evidencia, citas y report items', () => {
    const { result } = renderHook(() =>
      useComplianceEngine({
        suppliers,
        alerts,
        evidenceItems,
        reviews,
        activeSupplierId: 'supplier_001'
      })
    );

    expect(Array.isArray(result.current.evidenceTimeline)).toBe(true);
    expect(result.current.evidenceTimeline.length).toBeGreaterThan(0);

    expect(result.current.evidenceSummary.supplierId).toBe('supplier_001');
    expect(result.current.evidenceSummary.totalEvidence).toBe(1);
    expect(result.current.evidenceSummary.totalAlerts).toBe(1);

    expect(Array.isArray(result.current.sourceCitations)).toBe(true);
    expect(result.current.sourceCitations.length).toBe(1);

    expect(Array.isArray(result.current.reportItems)).toBe(true);
    expect(result.current.reportItems.length).toBeGreaterThan(0);
  });

  it('detecta alertas abiertas, alertas severas y proveedores de riesgo', () => {
    const { result } = renderHook(() =>
      useComplianceEngine({
        suppliers,
        alerts,
        evidenceItems,
        reviews,
        activeSupplierId: 'supplier_001'
      })
    );

    expect(result.current.openAlerts.length).toBe(2);
    expect(result.current.highSeverityAlerts.length).toBe(1);

    expect(Array.isArray(result.current.highRiskSuppliers)).toBe(true);
    expect(Array.isArray(result.current.criticalSuppliers)).toBe(true);
    expect(Array.isArray(result.current.lowResilienceSuppliers)).toBe(true);

    expect(Array.isArray(result.current.topRiskSuppliers)).toBe(true);
    expect(result.current.topRiskSuppliers.length).toBeGreaterThan(0);

    expect(Array.isArray(result.current.latestAlerts)).toBe(true);
    expect(result.current.latestAlerts.length).toBeGreaterThan(0);
  });

  it('cambia el proveedor activo si cambia activeSupplierId', () => {
    const { result } = renderHook(() =>
      useComplianceEngine({
        suppliers,
        alerts,
        evidenceItems,
        reviews,
        activeSupplierId: 'supplier_002'
      })
    );

    expect(result.current.activeSupplier.id).toBe('supplier_002');
    expect(result.current.activeSupplier.name).toBe('MetalWorks Components');

    expect(result.current.activeSupplierAlerts.length).toBe(1);
    expect(result.current.activeSupplierAlerts[0].id).toBe('alert_002');

    expect(result.current.activeSupplierEvidence.length).toBe(0);
    expect(result.current.activeSupplierReviews.length).toBe(0);
  });

  it('genera resumen ejecutivo del proveedor activo', () => {
    const { result } = renderHook(() =>
      useComplianceEngine({
        suppliers,
        alerts,
        evidenceItems,
        reviews,
        activeSupplierId: 'supplier_001'
      })
    );

    expect(typeof result.current.executiveSummary).toBe('string');
    expect(result.current.executiveSummary.length).toBeGreaterThan(40);
    expect(result.current.executiveSummary).toContain('IberTextile Manufacturing');
  });
});