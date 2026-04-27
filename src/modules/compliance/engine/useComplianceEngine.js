import { useMemo } from 'react';
import {
  calculateSupplierRiskScore,
  buildComplianceRiskLevel,
  calculatePortfolioRisk
} from './complianceScoring.js';
import {
  calculateResilienceScore,
  buildResilienceLevel,
  calculatePortfolioResilience
} from './resilienceScore.js';
import {
  assembleEvidenceTimeline,
  buildEvidenceSummary,
  buildSourceCitationList,
  buildEvidenceReportItems
} from './evidenceAssembler.js';
import {
  buildPendingReviews,
  calculateReviewQueueStats
} from './reviewDecisions.js';

function sortByRiskDesc(items = []) {
  return [...items].sort((a, b) => {
    return (b.riskScore || 0) - (a.riskScore || 0);
  });
}

function sortByDateDesc(items = []) {
  return [...items].sort((a, b) => {
    const dateA = new Date(a.createdAt || 0).getTime();
    const dateB = new Date(b.createdAt || 0).getTime();

    return dateB - dateA;
  });
}

function filterAlertsBySupplier(alerts = [], supplierId = '') {
  if (!supplierId) return alerts;
  return alerts.filter((alert) => alert.supplierId === supplierId);
}

function filterEvidenceBySupplier(evidenceItems = [], supplierId = '') {
  if (!supplierId) return evidenceItems;
  return evidenceItems.filter((item) => item.supplierId === supplierId);
}

function filterReviewsBySupplier(reviews = [], supplierId = '') {
  if (!supplierId) return reviews;
  return reviews.filter((review) => review.supplierId === supplierId);
}

export function useComplianceEngine({
  suppliers = [],
  alerts = [],
  evidenceItems = [],
  reviews = [],
  activeSupplierId = ''
}) {
  return useMemo(() => {
    const activeSupplier =
      suppliers.find((supplier) => supplier.id === activeSupplierId) ||
      suppliers[0] ||
      null;

    const enrichedSuppliers = suppliers.map((supplier) => {
      const riskScore = calculateSupplierRiskScore({
        supplier,
        alerts,
        evidenceItems,
        reviews
      });

      const resilienceScore = calculateResilienceScore({
        supplier,
        alerts,
        evidenceItems,
        reviews
      });

      return {
        ...supplier,
        riskScore,
        resilienceScore,
        riskLevel: buildComplianceRiskLevel(riskScore),
        resilienceLevel: buildResilienceLevel(resilienceScore)
      };
    });

    const enrichedActiveSupplier = activeSupplier
      ? enrichedSuppliers.find((supplier) => supplier.id === activeSupplier.id)
      : null;

    const activeSupplierAlerts = filterAlertsBySupplier(
      alerts,
      enrichedActiveSupplier?.id
    );

    const activeSupplierEvidence = filterEvidenceBySupplier(
      evidenceItems,
      enrichedActiveSupplier?.id
    );

    const activeSupplierReviews = filterReviewsBySupplier(
      reviews,
      enrichedActiveSupplier?.id
    );

    const portfolioRisk = calculatePortfolioRisk({
      suppliers,
      alerts,
      evidenceItems,
      reviews
    });

    const portfolioResilience = calculatePortfolioResilience({
      suppliers,
      alerts,
      evidenceItems,
      reviews
    });

    const pendingReviews = buildPendingReviews({
      alerts,
      reviews,
      suppliers
    });

    const reviewQueueStats = calculateReviewQueueStats({
      alerts,
      reviews
    });

    const evidenceTimeline = assembleEvidenceTimeline({
      supplier: enrichedActiveSupplier,
      alerts,
      evidenceItems,
      reviews
    });

    const evidenceSummary = buildEvidenceSummary({
      supplier: enrichedActiveSupplier,
      evidenceItems,
      alerts,
      reviews
    });

    const sourceCitations = buildSourceCitationList(activeSupplierEvidence);

    const reportItems = buildEvidenceReportItems({
      supplier: enrichedActiveSupplier,
      alerts,
      evidenceItems,
      reviews
    });

    const openAlerts = alerts.filter((alert) =>
      ['open', 'in_review'].includes(alert.status)
    );

    const validatedAlerts = alerts.filter(
      (alert) => alert.status === 'validated'
    );

    const discardedAlerts = alerts.filter(
      (alert) => alert.status === 'discarded'
    );

    const highSeverityAlerts = alerts.filter((alert) =>
      ['high', 'critical'].includes(String(alert.severity).toLowerCase())
    );

    const highRiskSuppliers = enrichedSuppliers.filter(
      (supplier) => supplier.riskScore >= 55
    );

    const criticalSuppliers = enrichedSuppliers.filter(
      (supplier) => supplier.riskScore >= 75
    );

    const lowResilienceSuppliers = enrichedSuppliers.filter(
      (supplier) => supplier.resilienceScore < 50
    );

    const topRiskSuppliers = sortByRiskDesc(enrichedSuppliers).slice(0, 5);

    const latestAlerts = sortByDateDesc(alerts).slice(0, 5);

    const dashboardCards = [
      {
        label: 'Proveedores monitorizados',
        value: suppliers.length,
        helper: 'Total de proveedores en cartera'
      },
      {
        label: 'Riesgo medio',
        value: `${portfolioRisk.averageRiskScore}/100`,
        helper: 'Scoring agregado de cartera'
      },
      {
        label: 'Alertas abiertas',
        value: portfolioRisk.openAlerts,
        helper: 'Open + in review'
      },
      {
        label: 'Cobertura evidencia',
        value: `${portfolioRisk.evidenceCoverage}%`,
        helper: 'Proveedores con evidencia registrada'
      }
    ];

    const executiveSummary = enrichedActiveSupplier
      ? `${enrichedActiveSupplier.name} presenta un nivel de riesgo ${enrichedActiveSupplier.riskLevel.label.toLowerCase()} con un score de ${enrichedActiveSupplier.riskScore}/100 y una resiliencia ${enrichedActiveSupplier.resilienceLevel.label.toLowerCase()} de ${enrichedActiveSupplier.resilienceScore}/100.`
      : 'No hay proveedor activo seleccionado.';

    return {
      activeSupplier: enrichedActiveSupplier,
      suppliers: enrichedSuppliers,
      alerts,
      evidenceItems,
      reviews,

      activeSupplierAlerts,
      activeSupplierEvidence,
      activeSupplierReviews,

      portfolioRisk,
      portfolioResilience,

      pendingReviews,
      reviewQueueStats,

      evidenceTimeline,
      evidenceSummary,
      sourceCitations,
      reportItems,

      openAlerts,
      validatedAlerts,
      discardedAlerts,
      highSeverityAlerts,
      highRiskSuppliers,
      criticalSuppliers,
      lowResilienceSuppliers,
      topRiskSuppliers,
      latestAlerts,

      dashboardCards,
      executiveSummary
    };
  }, [suppliers, alerts, evidenceItems, reviews, activeSupplierId]);
}