import { describe, expect, it } from 'vitest';
import {
  getEvidenceForSupplier,
  getEvidenceForAlert,
  assembleEvidenceTimeline,
  buildEvidenceSummary,
  buildSourceCitationList,
  buildEvidenceReportItems
} from '../../../src/modules/compliance/engine/evidenceAssembler.js';

const supplier = {
  id: 'supplier_001',
  name: 'Proveedor Test'
};

const alerts = [
  {
    id: 'alert_001',
    supplierId: 'supplier_001',
    title: 'Alerta de riesgo geografico',
    category: 'Geopolitical Risk',
    severity: 'high',
    status: 'open',
    source: 'Country risk monitor',
    createdAt: '2026-04-21T10:00:00.000Z',
    description: 'Se detecta aumento de riesgo regional.'
  }
];

const evidenceItems = [
  {
    id: 'evidence_001',
    supplierId: 'supplier_001',
    alertId: 'alert_001',
    title: 'Evidencia principal',
    sourceType: 'manual',
    sourceUrl: 'https://example.com/source',
    language: 'es',
    excerpt: 'Extracto original de prueba.',
    translatedExcerpt: 'Resumen traducido de prueba.',
    confidence: 0.8,
    createdAt: '2026-04-22T10:00:00.000Z'
  },
  {
    id: 'evidence_002',
    supplierId: 'supplier_002',
    alertId: '',
    title: 'Evidencia de otro proveedor',
    sourceType: 'document',
    sourceUrl: '',
    language: 'en',
    excerpt: 'Other supplier evidence.',
    translatedExcerpt: '',
    confidence: 0.6,
    createdAt: '2026-04-20T10:00:00.000Z'
  }
];

const reviews = [
  {
    id: 'review_001',
    supplierId: 'supplier_001',
    alertId: 'alert_001',
    status: 'decided',
    reviewer: 'Reviewer',
    decision: 'validated',
    notes: 'Hallazgo validado.',
    createdAt: '2026-04-22T11:00:00.000Z',
    decidedAt: '2026-04-22T12:00:00.000Z'
  }
];

describe('evidenceAssembler', () => {
  it('filtra evidencias por proveedor', () => {
    const result = getEvidenceForSupplier({
      supplierId: 'supplier_001',
      evidenceItems
    });

    expect(result.length).toBe(1);
    expect(result[0].id).toBe('evidence_001');
  });

  it('filtra evidencias por alerta', () => {
    const result = getEvidenceForAlert({
      alertId: 'alert_001',
      evidenceItems
    });

    expect(result.length).toBe(1);
    expect(result[0].alertId).toBe('alert_001');
  });

  it('ensambla timeline con alertas, evidencias y revisiones', () => {
    const timeline = assembleEvidenceTimeline({
      supplier,
      alerts,
      evidenceItems,
      reviews
    });

    expect(Array.isArray(timeline)).toBe(true);
    expect(timeline.length).toBe(3);

    const types = timeline.map((item) => item.type);

    expect(types).toContain('alert');
    expect(types).toContain('evidence');
    expect(types).toContain('review');
  });

  it('genera resumen de evidencia del proveedor con cobertura de citas', () => {
    const summary = buildEvidenceSummary({
      supplier,
      evidenceItems,
      alerts,
      reviews
    });

    expect(summary.supplierId).toBe('supplier_001');
    expect(summary.totalEvidence).toBe(1);
    expect(summary.totalAlerts).toBe(1);
    expect(summary.validatedReviews).toBe(1);
    expect(summary.averageConfidence).toBe(80);
    expect(summary.traceableEvidence).toBe(1);
    expect(summary.citationCoveragePct).toBe(100);
    expect(summary.coverageLabel).toBe('Media');
  });

  it('genera lista de citas de fuentes con estado de trazabilidad', () => {
    const citations = buildSourceCitationList(evidenceItems);

    expect(Array.isArray(citations)).toBe(true);
    expect(citations.length).toBe(2);
    expect(citations[0]).toHaveProperty('title');
    expect(citations[0]).toHaveProperty('label');
    expect(citations[0]).toHaveProperty('excerpt');
    expect(citations[0]).toHaveProperty('traceabilityStatus', 'traceable');
  });

  it('genera items para reporte de evidencia', () => {
    const reportItems = buildEvidenceReportItems({
      supplier,
      alerts,
      evidenceItems,
      reviews
    });

    expect(Array.isArray(reportItems)).toBe(true);
    expect(reportItems.length).toBe(3);

    reportItems.forEach((item) => {
      expect(item).toHaveProperty('type');
      expect(item).toHaveProperty('title');
      expect(item).toHaveProperty('status');
      expect(item).toHaveProperty('description');
      expect(item).toHaveProperty('sourceId');
      expect(item).toHaveProperty('traceabilityStatus');
    });
  });
});
