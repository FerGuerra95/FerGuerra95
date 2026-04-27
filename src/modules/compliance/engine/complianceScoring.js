import { clamp } from '../../../shared/utils/validators.js';

export const SEVERITY_WEIGHTS = {
  low: 10,
  medium: 25,
  high: 45,
  critical: 65
};

export const STATUS_WEIGHTS = {
  open: 1,
  in_review: 0.75,
  validated: 1.15,
  discarded: 0,
  closed: 0.25
};

export const CRITICALITY_WEIGHTS = {
  Baja: 4,
  Media: 10,
  Alta: 18,
  Crítica: 25
};

export const TIER_WEIGHTS = {
  'Tier 1': 18,
  'Tier 2': 12,
  'Tier 3': 7,
  Unknown: 8
};

export const REGION_RISK_WEIGHTS = {
  Europa: 6,
  'África Norte': 18,
  África: 24,
  Asia: 20,
  América: 12,
  Global: 16,
  'Sin región': 10
};

function toNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function normalizeSeverity(severity = 'medium') {
  const value = String(severity).toLowerCase();

  if (value === 'critical') return 'critical';
  if (value === 'high') return 'high';
  if (value === 'medium') return 'medium';
  if (value === 'low') return 'low';

  return 'medium';
}

export function normalizeStatus(status = 'open') {
  const value = String(status).toLowerCase();

  if (value === 'open') return 'open';
  if (value === 'in_review') return 'in_review';
  if (value === 'validated') return 'validated';
  if (value === 'discarded') return 'discarded';
  if (value === 'closed') return 'closed';

  return 'open';
}

export function getSeverityScore(severity) {
  return SEVERITY_WEIGHTS[normalizeSeverity(severity)] ?? SEVERITY_WEIGHTS.medium;
}

export function getStatusMultiplier(status) {
  return STATUS_WEIGHTS[normalizeStatus(status)] ?? STATUS_WEIGHTS.open;
}

export function getCriticalityScore(criticality = 'Media') {
  return CRITICALITY_WEIGHTS[criticality] ?? CRITICALITY_WEIGHTS.Media;
}

export function getTierScore(tier = 'Unknown') {
  return TIER_WEIGHTS[tier] ?? TIER_WEIGHTS.Unknown;
}

export function getRegionRiskScore(region = 'Sin región') {
  return REGION_RISK_WEIGHTS[region] ?? REGION_RISK_WEIGHTS['Sin región'];
}

export function calculateAlertRisk(alert) {
  if (!alert) return 0;

  const severityScore = getSeverityScore(alert.severity);
  const statusMultiplier = getStatusMultiplier(alert.status);

  return clamp(Math.round(severityScore * statusMultiplier), 0, 100);
}

export function calculateEvidenceConfidenceScore(evidenceItems = []) {
  if (!Array.isArray(evidenceItems) || evidenceItems.length === 0) {
    return 35;
  }

  const totalConfidence = evidenceItems.reduce((sum, item) => {
    return sum + clamp(toNumber(item.confidence, 0.7) * 100, 0, 100);
  }, 0);

  return clamp(Math.round(totalConfidence / evidenceItems.length), 0, 100);
}

export function calculateSupplierRiskScore({
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

  const alertRisk =
    supplierAlerts.length === 0
      ? 12
      : supplierAlerts.reduce((sum, alert) => sum + calculateAlertRisk(alert), 0) /
        supplierAlerts.length;

  const validatedReviews = supplierReviews.filter(
    (review) => review.decision === 'validated'
  ).length;

  const discardedReviews = supplierReviews.filter(
    (review) => review.decision === 'discarded'
  ).length;

  const reviewAdjustment = validatedReviews * 6 - discardedReviews * 8;

  const evidenceConfidence = calculateEvidenceConfidenceScore(supplierEvidence);
  const evidenceGapPenalty = supplierEvidence.length === 0 ? 12 : 0;
  const lowConfidencePenalty = evidenceConfidence < 55 ? 8 : 0;

  const baseRisk =
    getCriticalityScore(supplier.criticality) +
    getTierScore(supplier.tier) +
    getRegionRiskScore(supplier.region) +
    alertRisk +
    evidenceGapPenalty +
    lowConfidencePenalty +
    reviewAdjustment;

  return clamp(Math.round(baseRisk), 0, 100);
}

export function buildComplianceRiskLevel(score) {
  const safeScore = clamp(toNumber(score, 0), 0, 100);

  if (safeScore >= 75) {
    return {
      label: 'Crítico',
      color: 'text-danger',
      severity: 'critical',
      description: 'Riesgo elevado. Requiere revisión prioritaria y medidas de mitigación.'
    };
  }

  if (safeScore >= 55) {
    return {
      label: 'Alto',
      color: 'text-warning',
      severity: 'high',
      description: 'Riesgo relevante. Requiere seguimiento y evidencia adicional.'
    };
  }

  if (safeScore >= 35) {
    return {
      label: 'Medio',
      color: 'text-info',
      severity: 'medium',
      description: 'Riesgo controlable con revisión periódica.'
    };
  }

  return {
    label: 'Bajo',
    color: 'text-success',
    severity: 'low',
    description: 'Riesgo bajo según las señales disponibles.'
  };
}

export function calculatePortfolioRisk({
  suppliers = [],
  alerts = [],
  evidenceItems = [],
  reviews = []
}) {
  if (!Array.isArray(suppliers) || suppliers.length === 0) {
    return {
      averageRiskScore: 0,
      highRiskSuppliers: 0,
      openAlerts: 0,
      evidenceCoverage: 0
    };
  }

  const scores = suppliers.map((supplier) =>
    calculateSupplierRiskScore({
      supplier,
      alerts,
      evidenceItems,
      reviews
    })
  );

  const averageRiskScore = Math.round(
    scores.reduce((sum, score) => sum + score, 0) / scores.length
  );

  const highRiskSuppliers = scores.filter((score) => score >= 55).length;
  const openAlerts = alerts.filter((alert) =>
    ['open', 'in_review'].includes(normalizeStatus(alert.status))
  ).length;

  const suppliersWithEvidence = suppliers.filter((supplier) =>
    evidenceItems.some((item) => item.supplierId === supplier.id)
  ).length;

  const evidenceCoverage = Math.round(
    (suppliersWithEvidence / suppliers.length) * 100
  );

  return {
    averageRiskScore,
    highRiskSuppliers,
    openAlerts,
    evidenceCoverage
  };
}