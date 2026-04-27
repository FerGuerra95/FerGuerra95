import { clamp } from '../../../shared/utils/validators.js';

function toNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function calculateResilienceScore({
  supplier,
  alerts = [],
  evidenceItems = [],
  reviews = []
}) {
  if (!supplier) return 0;

  const supplierAlerts = alerts.filter(
    (alert) => alert.supplierId === supplier.id
  );

  const supplierEvidence = evidenceItems.filter(
    (item) => item.supplierId === supplier.id
  );

  const supplierReviews = reviews.filter(
    (review) => review.supplierId === supplier.id
  );

  const base = 72;

  const criticalityPenalty =
    supplier.criticality === 'Crítica'
      ? 18
      : supplier.criticality === 'Alta'
        ? 10
        : supplier.criticality === 'Media'
          ? 5
          : 2;

  const tierPenalty =
    supplier.tier === 'Tier 1'
      ? 5
      : supplier.tier === 'Tier 2'
        ? 8
        : supplier.tier === 'Tier 3'
          ? 12
          : 7;

  const openHighAlerts = supplierAlerts.filter((alert) =>
    ['high', 'critical'].includes(String(alert.severity).toLowerCase()) &&
    ['open', 'in_review'].includes(String(alert.status).toLowerCase())
  ).length;

  const alertPenalty = openHighAlerts * 9;

  const evidenceBonus = clamp(supplierEvidence.length * 6, 0, 18);

  const validatedReviews = supplierReviews.filter(
    (review) => review.decision === 'validated'
  ).length;

  const discardedReviews = supplierReviews.filter(
    (review) => review.decision === 'discarded'
  ).length;

  const reviewBonus = validatedReviews * 5 + discardedReviews * 2;

  const spend = toNumber(supplier.spend, 0);
  const concentrationPenalty =
    spend >= 600000
      ? 10
      : spend >= 350000
        ? 6
        : spend >= 150000
          ? 3
          : 1;

  const score =
    base -
    criticalityPenalty -
    tierPenalty -
    alertPenalty -
    concentrationPenalty +
    evidenceBonus +
    reviewBonus;

  return clamp(Math.round(score), 0, 100);
}

export function buildResilienceLevel(score) {
  const safeScore = clamp(toNumber(score, 0), 0, 100);

  if (safeScore >= 80) {
    return {
      label: 'Alta',
      color: 'text-success',
      description: 'Proveedor con buena resiliencia y bajo riesgo operativo inmediato.'
    };
  }

  if (safeScore >= 60) {
    return {
      label: 'Media',
      color: 'text-info',
      description: 'Proveedor razonablemente estable, aunque requiere seguimiento.'
    };
  }

  if (safeScore >= 40) {
    return {
      label: 'Baja',
      color: 'text-warning',
      description: 'Proveedor sensible. Conviene reforzar evidencia y alternativas.'
    };
  }

  return {
    label: 'Crítica',
    color: 'text-danger',
    description: 'Proveedor con resiliencia débil. Requiere plan de mitigación.'
  };
}

export function calculatePortfolioResilience({
  suppliers = [],
  alerts = [],
  evidenceItems = [],
  reviews = []
}) {
  if (!Array.isArray(suppliers) || suppliers.length === 0) {
    return {
      averageResilienceScore: 0,
      lowResilienceSuppliers: 0,
      resilientSuppliers: 0
    };
  }

  const scores = suppliers.map((supplier) =>
    calculateResilienceScore({
      supplier,
      alerts,
      evidenceItems,
      reviews
    })
  );

  const averageResilienceScore = Math.round(
    scores.reduce((sum, score) => sum + score, 0) / scores.length
  );

  const lowResilienceSuppliers = scores.filter((score) => score < 50).length;
  const resilientSuppliers = scores.filter((score) => score >= 70).length;

  return {
    averageResilienceScore,
    lowResilienceSuppliers,
    resilientSuppliers
  };
}