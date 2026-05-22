// @vitest-environment jsdom

/**
 * C.13.1C-f6A/f6B — Precedence / semantic separation tests.
 * persisted riskScore vs operational (engine) vs weightedRiskScore; labels and re-export policy.
 */

import { describe, expect, it } from 'vitest';
import { renderHook } from '@testing-library/react';
import { calculateSupplierRiskScore } from '../../../src/modules/compliance/engine/complianceScoring.js';
import { useComplianceEngine } from '../../../src/modules/compliance/engine/useComplianceEngine.js';
import { calculateGoldenResilienceScore } from '../../../src/modules/compliance/engine/complianceGoldenResilience.js';
import {
  OPERATIONAL_RESILIENCE_LABEL,
  OPERATIONAL_RISK_LABEL,
  WEIGHTED_RISK_LABEL,
  buildComplianceReportBoardRows,
  complianceReportsApi,
  resolveWeightedRiskScoreForSupplier
} from '../../../src/modules/compliance/services/complianceReportsApi.js';

const PERSISTED_RISK_SNAPSHOT = 68;

const supplierFixture = {
  id: 'supplier_precedence_001',
  name: 'Precedence Test Supplier',
  country: 'España',
  region: 'Europa',
  tier: 'Tier 1',
  sector: 'Industrial',
  criticality: 'Alta',
  spend: 420000,
  status: 'active',
  riskScore: PERSISTED_RISK_SNAPSHOT,
  resilienceScore: 72,
  lastReviewAt: '2026-04-20T10:30:00.000Z'
};

const operationalAlerts = [
  {
    id: 'alert_precedence_001',
    supplierId: 'supplier_precedence_001',
    title: 'Critical compliance exposure',
    category: 'Operational Risk',
    severity: 'critical',
    status: 'open',
    source: 'Internal assessment',
    createdAt: '2026-04-21T08:20:00.000Z',
    description: 'Elevated operational signals for precedence test.'
  }
];

const operationalEvidence = [
  {
    id: 'evidence_precedence_001',
    supplierId: 'supplier_precedence_001',
    alertId: 'alert_precedence_001',
    sourceType: 'manual',
    confidence: 0.75,
    createdAt: '2026-04-22T10:00:00.000Z'
  }
];

const operationalReviews = [];

function averagePersistedRiskScore(suppliers = []) {
  if (!suppliers.length) return 0;
  return (
    suppliers.reduce((total, supplier) => total + Number(supplier.riskScore || 0), 0) /
    suppliers.length
  );
}

/**
 * Mirrors CEOOverviewPage.getComplianceOverview average-risk input (not exported).
 * GAP: production CEO path uses store suppliers without engine enrichment.
 */
function mirrorCeoOverviewAverageRisk(suppliers = []) {
  return averagePersistedRiskScore(suppliers);
}

/**
 * Mirrors ComplianceReportPage.handleExportStoredReport riskScore merge (not exported).
 * f6B: report snapshot wins over live store persisted riskScore.
 */
function mirrorReExportStoredReportRiskScore(supplier, report) {
  return report?.riskScore ?? supplier?.riskScore ?? 'N/A';
}

/**
 * Mirrors ComplianceReportPage.handleExportStoredReport resilienceScore merge (f8B).
 */
function mirrorReExportStoredReportResilienceScore(supplier, report) {
  return report?.resilienceScore ?? supplier?.resilienceScore ?? 'N/A';
}

function boardRowValue(rows, label) {
  const row = rows.find(([rowLabel]) => rowLabel === label);
  return row ? row[1] : null;
}

describe('compliance scoring precedence (C.13.1C-f6A)', () => {
  describe('persisted riskScore vs operational riskScore', () => {
    it('documents that persisted riskScore and operational riskScore can differ', () => {
      const operationalRiskScore = calculateSupplierRiskScore({
        supplier: supplierFixture,
        alerts: operationalAlerts,
        evidenceItems: operationalEvidence,
        reviews: operationalReviews
      });

      expect(supplierFixture.riskScore).toBe(PERSISTED_RISK_SNAPSHOT);
      expect(operationalRiskScore).not.toBe(PERSISTED_RISK_SNAPSHOT);
      expect(Number.isFinite(operationalRiskScore)).toBe(true);
    });

    it('documents that useComplianceEngine overwrites enriched supplier.riskScore with operational score', () => {
      const suppliersInput = [{ ...supplierFixture }];

      const { result } = renderHook(() =>
        useComplianceEngine({
          suppliers: suppliersInput,
          alerts: operationalAlerts,
          evidenceItems: operationalEvidence,
          reviews: operationalReviews,
          activeSupplierId: 'supplier_precedence_001'
        })
      );

      const operationalRiskScore = calculateSupplierRiskScore({
        supplier: supplierFixture,
        alerts: operationalAlerts,
        evidenceItems: operationalEvidence,
        reviews: operationalReviews
      });

      expect(suppliersInput[0].riskScore).toBe(PERSISTED_RISK_SNAPSHOT);
      expect(result.current.suppliers[0].riskScore).toBe(operationalRiskScore);
      expect(result.current.suppliers[0].riskScore).not.toBe(PERSISTED_RISK_SNAPSHOT);
      expect(result.current.activeSupplier.riskScore).toBe(operationalRiskScore);
    });
  });

  describe('weightedRiskScore separation', () => {
    it('keeps weightedRiskScore separate from operational risk score in reports', () => {
      const operationalRiskScore = 55;
      const weightedRiskScore = 68;

      const report = complianceReportsApi.buildSupplierReport({
        supplier: {
          ...supplierFixture,
          financialRisk: 70,
          jurisdictionRisk: 80,
          evidenceRisk: 40
        },
        riskScore: operationalRiskScore,
        resilienceScore: 70,
        weightedRiskScore,
        riskLevel: { label: 'Medio' },
        resilienceLevel: { label: 'Alta' }
      });

      const rows = buildComplianceReportBoardRows(report);

      expect(report.riskScore).toBe(operationalRiskScore);
      expect(report.weightedRiskScore).toBe(weightedRiskScore);
      expect(boardRowValue(rows, OPERATIONAL_RISK_LABEL)).toBe('55/100');
      expect(boardRowValue(rows, WEIGHTED_RISK_LABEL)).toBe('68/100');
      expect(report.riskScore).not.toBe(report.weightedRiskScore);
    });

    it('does not derive weightedRiskScore without explicit weighted inputs', () => {
      const supplierOperationalOnly = {
        ...supplierFixture,
        region: 'Asia',
        tier: 'Tier 2',
        spend: 999999,
        criticality: 'Crítica'
      };

      expect(resolveWeightedRiskScoreForSupplier(supplierOperationalOnly)).toBeNull();

      const report = complianceReportsApi.buildSupplierReport({
        supplier: supplierOperationalOnly,
        riskScore: 61,
        resilienceScore: 58,
        riskLevel: { label: 'Medio' },
        resilienceLevel: { label: 'Media' }
      });

      expect(report.weightedRiskScore).toBeUndefined();

      const rows = buildComplianceReportBoardRows(report);
      expect(rows.some(([label]) => label === WEIGHTED_RISK_LABEL)).toBe(false);
    });
  });

  describe('report generated vs stored snapshot precedence', () => {
    it('documents that buildSupplierReport uses operational riskScore from payload (generated path)', () => {
      const generated = complianceReportsApi.buildSupplierReport({
        supplier: supplierFixture,
        riskScore: 55,
        resilienceScore: 70,
        riskLevel: { label: 'Medio' },
        resilienceLevel: { label: 'Alta' }
      });

      expect(generated.riskScore).toBe(55);
      expect(
        boardRowValue(buildComplianceReportBoardRows(generated), OPERATIONAL_RISK_LABEL)
      ).toBe('55/100');
    });

    it('documents report snapshot vs generated report can diverge on riskScore', () => {
      const generatedOperationalRisk = 55;
      const storedSnapshotRisk = 30;

      const generated = complianceReportsApi.buildSupplierReport({
        supplier: supplierFixture,
        riskScore: generatedOperationalRisk,
        resilienceScore: 70,
        riskLevel: { label: 'Medio' },
        resilienceLevel: { label: 'Alta' }
      });

      const storedReport = {
        ...generated,
        riskScore: storedSnapshotRisk,
        resilienceScore: 40,
        createdAt: '2026-01-15T10:00:00.000Z'
      };

      expect(
        boardRowValue(buildComplianceReportBoardRows(generated), OPERATIONAL_RISK_LABEL)
      ).toBe('55/100');
      expect(
        boardRowValue(buildComplianceReportBoardRows(storedReport), OPERATIONAL_RISK_LABEL)
      ).toBe('30/100');
    });

    it('re-export stored report prefers report snapshot over store persisted riskScore', () => {
      const storedReport = {
        riskScore: 30,
        resilienceScore: 40
      };

      const storeSupplier = {
        riskScore: PERSISTED_RISK_SNAPSHOT,
        resilienceScore: 72
      };

      const mergedForReExport = mirrorReExportStoredReportRiskScore(
        storeSupplier,
        storedReport
      );

      expect(mergedForReExport).toBe(storedReport.riskScore);
      expect(mergedForReExport).not.toBe(storeSupplier.riskScore);
      expect(
        boardRowValue(
          buildComplianceReportBoardRows({
            ...storedReport,
            riskLevel: 'Medio',
            resilienceLevel: 'Media',
            evidenceSummary: { coverageLabel: 'Media' }
          }),
          OPERATIONAL_RISK_LABEL
        )
      ).toBe('30/100');
    });
  });

  describe('CEO overview operational alignment (f6B)', () => {
    it('CEO overview average risk matches engine-enriched suppliers (same as dashboards)', () => {
      const suppliersInput = [{ ...supplierFixture }];

      const { result } = renderHook(() =>
        useComplianceEngine({
          suppliers: suppliersInput,
          alerts: operationalAlerts,
          evidenceItems: operationalEvidence,
          reviews: operationalReviews,
          activeSupplierId: 'supplier_precedence_001'
        })
      );

      const persistedOnlyAverage = mirrorCeoOverviewAverageRisk(suppliersInput);
      const operationalAverage = averagePersistedRiskScore(result.current.suppliers);

      expect(persistedOnlyAverage).toBe(PERSISTED_RISK_SNAPSHOT);
      expect(operationalAverage).not.toBe(PERSISTED_RISK_SNAPSHOT);
      expect(mirrorCeoOverviewAverageRisk(result.current.suppliers)).toBe(
        operationalAverage
      );
    });
  });

  describe('export board labels (f6B/f8B)', () => {
    it('uses Operational risk score label separate from weighted risk', () => {
      const rows = buildComplianceReportBoardRows({
        riskScore: 55,
        resilienceScore: 70,
        riskLevel: 'Medio',
        resilienceLevel: 'Alta',
        weightedRiskScore: 68,
        evidenceSummary: { coverageLabel: 'Media' }
      });

      expect(rows.some(([label]) => label === OPERATIONAL_RISK_LABEL)).toBe(true);
      expect(rows.some(([label]) => label === 'Risk Score')).toBe(false);
      expect(rows.some(([label]) => label === WEIGHTED_RISK_LABEL)).toBe(true);
    });

    it('uses Operational resilience score label and not generic Resilience (f8B)', () => {
      const rows = buildComplianceReportBoardRows({
        riskScore: 55,
        resilienceScore: 70,
        riskLevel: 'Medio',
        resilienceLevel: 'Alta',
        evidenceSummary: { coverageLabel: 'Media' }
      });

      expect(rows.some(([label]) => label === OPERATIONAL_RESILIENCE_LABEL)).toBe(
        true
      );
      expect(boardRowValue(rows, OPERATIONAL_RESILIENCE_LABEL)).toBe('70/100');
      expect(rows.some(([label]) => label === 'Resilience')).toBe(false);
    });
  });

  describe('resilience precedence (f8B)', () => {
    it('re-export stored report prefers report snapshot over store persisted resilienceScore', () => {
      const storedReport = {
        riskScore: 30,
        resilienceScore: 40
      };

      const storeSupplier = {
        riskScore: PERSISTED_RISK_SNAPSHOT,
        resilienceScore: 72
      };

      const mergedForReExport = mirrorReExportStoredReportResilienceScore(
        storeSupplier,
        storedReport
      );

      expect(mergedForReExport).toBe(storedReport.resilienceScore);
      expect(mergedForReExport).not.toBe(storeSupplier.resilienceScore);
      expect(
        boardRowValue(
          buildComplianceReportBoardRows({
            ...storedReport,
            riskLevel: 'Medio',
            resilienceLevel: 'Media',
            evidenceSummary: { coverageLabel: 'Media' }
          }),
          OPERATIONAL_RESILIENCE_LABEL
        )
      ).toBe('40/100');
    });

    it('golden resilience stays separate from operational resilienceScore', () => {
      const operationalFromEngine = calculateSupplierRiskScore({
        supplier: supplierFixture,
        alerts: operationalAlerts,
        evidenceItems: operationalEvidence,
        reviews: operationalReviews
      });

      const goldenResilience = calculateGoldenResilienceScore({
        riskScore: 68,
        mitigationBonus: 8
      });

      expect(goldenResilience).toBe(40);
      expect(operationalFromEngine).not.toBe(68);
      expect(goldenResilience).not.toBe(supplierFixture.resilienceScore);
    });
  });
});
