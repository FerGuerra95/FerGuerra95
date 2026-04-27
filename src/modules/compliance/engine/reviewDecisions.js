export const REVIEW_DECISIONS = {
  VALIDATED: 'validated',
  DISCARDED: 'discarded',
  NEEDS_MORE_EVIDENCE: 'needs_more_evidence'
};

export const REVIEW_STATUS = {
  PENDING: 'pending',
  DECIDED: 'decided'
};

export function normalizeReviewDecision(decision = '') {
  const value = String(decision).toLowerCase();

  if (value === REVIEW_DECISIONS.VALIDATED) {
    return REVIEW_DECISIONS.VALIDATED;
  }

  if (value === REVIEW_DECISIONS.DISCARDED) {
    return REVIEW_DECISIONS.DISCARDED;
  }

  if (value === REVIEW_DECISIONS.NEEDS_MORE_EVIDENCE) {
    return REVIEW_DECISIONS.NEEDS_MORE_EVIDENCE;
  }

  return REVIEW_DECISIONS.NEEDS_MORE_EVIDENCE;
}

export function buildReviewDecisionLabel(decision = '') {
  const normalized = normalizeReviewDecision(decision);

  if (normalized === REVIEW_DECISIONS.VALIDATED) {
    return {
      label: 'Validado',
      color: 'text-danger',
      description:
        'La alerta queda confirmada y debe formar parte del expediente de riesgo.'
    };
  }

  if (normalized === REVIEW_DECISIONS.DISCARDED) {
    return {
      label: 'Descartado',
      color: 'text-success',
      description:
        'La alerta se considera no relevante o no suficientemente sustentada.'
    };
  }

  return {
    label: 'Requiere más evidencia',
    color: 'text-warning',
    description:
      'La alerta no puede cerrarse todavía y requiere documentación adicional.'
  };
}

export function getNextAlertStatusFromDecision(decision = '') {
  const normalized = normalizeReviewDecision(decision);

  if (normalized === REVIEW_DECISIONS.VALIDATED) {
    return 'validated';
  }

  if (normalized === REVIEW_DECISIONS.DISCARDED) {
    return 'discarded';
  }

  return 'in_review';
}

export function buildPendingReviews({
  alerts = [],
  reviews = [],
  suppliers = []
}) {
  const reviewedAlertIds = new Set(
    reviews
      .filter((review) => review.status === REVIEW_STATUS.DECIDED)
      .map((review) => review.alertId)
  );

  return alerts
    .filter((alert) => {
      const isOpen =
        alert.status === 'open' ||
        alert.status === 'in_review' ||
        alert.status === 'validated';

      return isOpen && !reviewedAlertIds.has(alert.id);
    })
    .map((alert) => {
      const supplier = suppliers.find((item) => item.id === alert.supplierId);

      return {
        id: `pending_${alert.id}`,
        alertId: alert.id,
        supplierId: alert.supplierId,
        supplierName: supplier?.name || 'Proveedor no identificado',
        title: alert.title,
        severity: alert.severity,
        status: alert.status,
        category: alert.category,
        createdAt: alert.createdAt,
        recommendedAction:
          alert.severity === 'high' || alert.severity === 'critical'
            ? 'Revisar con prioridad y exigir evidencia adicional.'
            : 'Revisar en ciclo ordinario de compliance.'
      };
    });
}

export function calculateReviewQueueStats({
  alerts = [],
  reviews = []
}) {
  const pendingReviews = alerts.filter((alert) =>
    ['open', 'in_review'].includes(alert.status)
  ).length;

  const decidedReviews = reviews.filter(
    (review) => review.status === REVIEW_STATUS.DECIDED
  ).length;

  const validatedReviews = reviews.filter(
    (review) => review.decision === REVIEW_DECISIONS.VALIDATED
  ).length;

  const discardedReviews = reviews.filter(
    (review) => review.decision === REVIEW_DECISIONS.DISCARDED
  ).length;

  const needsEvidenceReviews = reviews.filter(
    (review) => review.decision === REVIEW_DECISIONS.NEEDS_MORE_EVIDENCE
  ).length;

  return {
    pendingReviews,
    decidedReviews,
    validatedReviews,
    discardedReviews,
    needsEvidenceReviews
  };
}

export function buildReviewAuditEntry({
  reviewId,
  alertId,
  supplierId,
  reviewer,
  decision,
  notes
}) {
  const normalizedDecision = normalizeReviewDecision(decision);

  return {
    id: `audit_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`,
    reviewId,
    alertId,
    supplierId,
    reviewer: reviewer || 'Reviewer',
    decision: normalizedDecision,
    decisionLabel: buildReviewDecisionLabel(normalizedDecision).label,
    notes: notes || '',
    createdAt: new Date().toISOString()
  };
}