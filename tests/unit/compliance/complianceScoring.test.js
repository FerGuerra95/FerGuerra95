import { describe, expect, it } from 'vitest';
import {
  normalizeSeverity,
  normalizeStatus,
  getSeverityScore,
  getStatusMultiplier,
  calculateAlertRisk,
  calculateEvidenceConfidenceScore,
  calculateSupplierRiskScore,
  buildComplianceRiskLevel,
  calculatePortfolioRisk
} from '../../../src/modules/compliance/engine/complianceScoring.js';

const supplierBase = {
  id: 'supplier_test_001',
  name: 'Proveedor Test',
  country: 'España',
  region: 'Europa',
  tier: 'Tier 1',
  sector: 'Industrial',
  criticality: 'Alta',
  spend: 500000,
  status: 'active'
};

describe('complianceScoring', () => {
  it('normaliza correctamente severidad y estado', () => {
    expect(normalizeSeverity('critical')).toBe('critical');
    expect(normalizeSeverity('high')).toBe('high');
    expect(normalizeSeverity('medium')).toBe('medium');
    expect(normalizeSeverity('low')).toBe('low');
    expect(normalizeSeverity('unknown')).toBe('medium');

    expect(normalizeStatus('open')).toBe('open');
    expect(normalizeStatus('in_review')).toBe('in_review');
    expect(normalizeStatus('validated')).toBe('validated');
    expect(normalizeStatus('discarded')).toBe('discarded');
    expect(normalizeStatus('closed')).toBe('closed');
    expect(normalizeStatus('unknown')).toBe('open');
  });

  it('devuelve el score correcto por severidad', () => {
    expect(getSeverityScore('low')).toBe(10);
    expect(getSeverityScore('medium')).toBe(25);
    expect(getSeverityScore('high')).toBe(45);
    expect(getSeverityScore('critical')).toBe(65);
    expect(getSeverityScore('invalid')).toBe(25);
  });

  it('devuelve el multiplicador correcto por estado', () => {
    expect(getStatusMultiplier('open')).toBe(1);
    expect(getStatusMultiplier('in_review')).toBe(0.75);
    expect(getStatusMultiplier('validated')).toBe(1.15);
    expect(getStatusMultiplier('discarded')).toBe(0);
    expect(getStatusMultiplier('closed')).toBe(0.25);
    expect(getStatusMultiplier('invalid')).toBe(1);
  });

  it('calcula correctamente el riesgo de una alerta', () => {
    expect(
      calculateAlertRisk({
        severity: 'high',
        status: 'open'
      })
    ).toBe(45);

    expect(
      calculateAlertRisk({
        severity: 'high',
        status: 'in_review'
      })
    ).toBe(34);

    expect(
      calculateAlertRisk({
        severity: 'medium',
        status: 'validated'
      })
    ).toBe(29);

    expect(
      calculateAlertRisk({
        severity: 'critical',
        status: 'discarded'
      })
    ).toBe(0);
  });

  it('calcula correctamente la confianza media de evidencias', () => {
    expect(calculateEvidenceConfidenceScore([])).toBe(35);

    const evidenceItems = [
      {
        id: 'evidence_001',
        supplierId: 'supplier_test_001',
        confidence: 0.8
      },
      {
        id: 'evidence_002',
        supplierId: 'supplier_test_001',
        confidence: 0.6
      }
    ];

    expect(calculateEvidenceConfidenceScore(evidenceItems)).toBe(70);
  });

  it('calcula correctamente el risk score de un proveedor', () => {
    const alerts = [
      {
        id: 'alert_001',
        supplierId: 'supplier_test_001',
        severity: 'medium',
        status: 'open'
      }
    ];

    const evidenceItems = [
      {
        id: 'evidence_001',
        supplierId: 'supplier_test_001',
        confidence: 0.8
      }
    ];

    const riskScore = calculateSupplierRiskScore({
      supplier: supplierBase,
      alerts,
      evidenceItems,
      reviews: []
    });

    expect(riskScore).toBe(67);
  });

  it('aumenta el riesgo si no hay evidencia suficiente', () => {
    const alerts = [
      {
        id: 'alert_001',
        supplierId: 'supplier_test_001',
        severity: 'medium',
        status: 'open'
      }
    ];

    const riskWithEvidence = calculateSupplierRiskScore({
      supplier: supplierBase,
      alerts,
      evidenceItems: [
        {
          id: 'evidence_001',
          supplierId: 'supplier_test_001',
          confidence: 0.85
        }
      ],
      reviews: []
    });

    const riskWithoutEvidence = calculateSupplierRiskScore({
      supplier: supplierBase,
      alerts,
      evidenceItems: [],
      reviews: []
    });

    expect(riskWithoutEvidence).toBeGreaterThan(riskWithEvidence);
  });

  it('clasifica correctamente el nivel de riesgo', () => {
    expect(buildComplianceRiskLevel(80).label).toBe('Crítico');
    expect(buildComplianceRiskLevel(60).label).toBe('Alto');
    expect(buildComplianceRiskLevel(40).label).toBe('Medio');
    expect(buildComplianceRiskLevel(20).label).toBe('Bajo');
  });

  it('calcula correctamente el riesgo agregado de cartera', () => {
    const suppliers = [
      supplierBase,
      {
        id: 'supplier_test_002',
        name: 'Proveedor Bajo Riesgo',
        country: 'España',
        region: 'Europa',
        tier: 'Tier 3',
        sector: 'Servicios',
        criticality: 'Baja',
        spend: 50000,
        status: 'active'
      }
    ];

    const alerts = [
      {
        id: 'alert_001',
        supplierId: 'supplier_test_001',
        severity: 'high',
        status: 'open'
      },
      {
        id: 'alert_002',
        supplierId: 'supplier_test_002',
        severity: 'low',
        status: 'closed'
      }
    ];

    const evidenceItems = [
      {
        id: 'evidence_001',
        supplierId: 'supplier_test_001',
        confidence: 0.8
      }
    ];

    const portfolio = calculatePortfolioRisk({
      suppliers,
      alerts,
      evidenceItems,
      reviews: []
    });

    expect(portfolio.averageRiskScore).toBeGreaterThan(0);
    expect(portfolio.highRiskSuppliers).toBeGreaterThanOrEqual(1);
    expect(portfolio.openAlerts).toBe(1);
    expect(portfolio.evidenceCoverage).toBe(50);
  });
});