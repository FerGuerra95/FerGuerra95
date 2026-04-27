import { describe, expect, it } from 'vitest';
import {
  REVIEW_DECISIONS,
  REVIEW_STATUS,
  normalizeReviewDecision,
  buildReviewDecisionLabel,
  getNextAlertStatusFromDecision,
  buildPendingReviews,
  calculateReviewQueueStats,
  buildReviewAuditEntry
} from '../../../src/modules/compliance/engine/reviewDecisions.js';

const suppliers = [
  {
    id: 'supplier_001',
    name: 'Proveedor Test'
  }
];

const alerts = [
  {
    id: 'alert_001',
    supplierId: 'supplier_001',
    title: 'Alerta pendiente',
    severity: 'high',
    status: 'open',
    category: 'Operational Risk',
    createdAt: '2026-04-21T10:00:00.000Z'
  },
  {
    id: 'alert_002',
    supplierId: 'supplier_001',
    title: 'Alerta descartada',
    severity: 'low',
    status: 'discarded',
    category: 'Evidence Gap',
    createdAt: '2026-04-20T10:00:00.000Z'
  }
];

const reviews = [
  {
    id: 'review_001',
    alertId: 'alert_002',
    supplierId: 'supplier_001',
    status: REVIEW_STATUS.DECIDED,
    decision: REVIEW_DECISIONS.DISCARDED
  }
];

describe('reviewDecisions', () => {
  it('normaliza correctamente decisiones de revisión', () => {
    expect(normalizeReviewDecision('validated')).toBe(REVIEW_DECISIONS.VALIDATED);
    expect(normalizeReviewDecision('discarded')).toBe(REVIEW_DECISIONS.DISCARDED);
    expect(normalizeReviewDecision('needs_more_evidence')).toBe(
      REVIEW_DECISIONS.NEEDS_MORE_EVIDENCE
    );
    expect(normalizeReviewDecision('unknown')).toBe(
      REVIEW_DECISIONS.NEEDS_MORE_EVIDENCE
    );
  });

  it('construye etiquetas de decisión', () => {
    expect(buildReviewDecisionLabel('validated').label).toBe('Validado');
    expect(buildReviewDecisionLabel('discarded').label).toBe('Descartado');
    expect(buildReviewDecisionLabel('needs_more_evidence').label).toBe(
      'Requiere más evidencia'
    );
  });

  it('devuelve el siguiente estado de alerta según decisión', () => {
    expect(getNextAlertStatusFromDecision('validated')).toBe('validated');
    expect(getNextAlertStatusFromDecision('discarded')).toBe('discarded');
    expect(getNextAlertStatusFromDecision('needs_more_evidence')).toBe('in_review');
    expect(getNextAlertStatusFromDecision('invalid')).toBe('in_review');
  });

  it('construye revisiones pendientes a partir de alertas abiertas', () => {
    const pendingReviews = buildPendingReviews({
      alerts,
      reviews,
      suppliers
    });

    expect(Array.isArray(pendingReviews)).toBe(true);
    expect(pendingReviews.length).toBe(1);
    expect(pendingReviews[0].alertId).toBe('alert_001');
    expect(pendingReviews[0].supplierName).toBe('Proveedor Test');
  });

  it('calcula estadísticas de la cola de revisión', () => {
    const stats = calculateReviewQueueStats({
      alerts,
      reviews
    });

    expect(stats.pendingReviews).toBe(1);
    expect(stats.decidedReviews).toBe(1);
    expect(stats.validatedReviews).toBe(0);
    expect(stats.discardedReviews).toBe(1);
    expect(stats.needsEvidenceReviews).toBe(0);
  });

  it('construye una entrada auditable de revisión', () => {
    const auditEntry = buildReviewAuditEntry({
      reviewId: 'review_001',
      alertId: 'alert_001',
      supplierId: 'supplier_001',
      reviewer: 'Fernando',
      decision: 'validated',
      notes: 'Hallazgo validado tras revisar evidencia.'
    });

    expect(auditEntry).toHaveProperty('id');
    expect(auditEntry.reviewId).toBe('review_001');
    expect(auditEntry.alertId).toBe('alert_001');
    expect(auditEntry.supplierId).toBe('supplier_001');
    expect(auditEntry.reviewer).toBe('Fernando');
    expect(auditEntry.decision).toBe('validated');
    expect(auditEntry.decisionLabel).toBe('Validado');
    expect(auditEntry.notes).toContain('Hallazgo validado');
    expect(auditEntry).toHaveProperty('createdAt');
  });
});