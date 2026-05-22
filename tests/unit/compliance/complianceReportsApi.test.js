import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import {
  OPERATIONAL_RISK_LABEL,
  OPERATIONAL_RESILIENCE_LABEL,
  WEIGHTED_RISK_LABEL,
  buildComplianceReportBoardRows,
  complianceReportsApi,
  resolveWeightedRiskScoreForSupplier,
  supplierHasExplicitWeightedRiskInputs
} from '../../../src/modules/compliance/services/complianceReportsApi.js';

const supplierBase = {
  id: 'supplier_weighted_test',
  name: 'Weighted Test Supplier',
  country: 'España',
  region: 'Europa',
  tier: 'Tier 1',
  criticality: 'Alta',
  spend: 100000,
  riskScore: 42,
  resilienceScore: 76
};

describe('complianceReportsApi weightedRiskScore', () => {
  describe('resolveWeightedRiskScoreForSupplier', () => {
    it('returns 68 when explicit golden inputs are present', () => {
      const score = resolveWeightedRiskScoreForSupplier({
        ...supplierBase,
        financialRisk: 70,
        jurisdictionRisk: 80,
        evidenceRisk: 40
      });

      expect(score).toBe(68);
    });

    it('returns null when weighted inputs are missing', () => {
      expect(resolveWeightedRiskScoreForSupplier(supplierBase)).toBeNull();
      expect(
        resolveWeightedRiskScoreForSupplier({
          ...supplierBase,
          region: 'Asia',
          tier: 'Tier 2',
          spend: 500000
        })
      ).toBeNull();
    });

    it('does not treat region/tier/spend as weighted inputs', () => {
      expect(supplierHasExplicitWeightedRiskInputs(supplierBase)).toBe(false);
      expect(
        supplierHasExplicitWeightedRiskInputs({
          ...supplierBase,
          region: 'Asia',
          tier: 'Tier 2',
          spend: 999999
        })
      ).toBe(false);
    });
  });

  describe('buildSupplierReport', () => {
    it('includes weightedRiskScore when explicit inputs exist', () => {
      const report = complianceReportsApi.buildSupplierReport({
        supplier: {
          ...supplierBase,
          financialRisk: 70,
          jurisdictionRisk: 80,
          evidenceRisk: 40
        },
        riskScore: 42,
        resilienceScore: 76,
        riskLevel: { label: 'Medio' },
        resilienceLevel: { label: 'Alta' }
      });

      expect(report.weightedRiskScore).toBe(68);
      expect(report.riskScore).toBe(42);
      expect(report.resilienceScore).toBe(76);
    });

    it('omits weightedRiskScore when explicit inputs are absent', () => {
      const report = complianceReportsApi.buildSupplierReport({
        supplier: supplierBase,
        riskScore: 42,
        resilienceScore: 76,
        riskLevel: { label: 'Medio' },
        resilienceLevel: { label: 'Alta' }
      });

      expect(report.weightedRiskScore).toBeUndefined();
      expect(report.riskScore).toBe(42);
    });
  });

  describe('buildComplianceReportBoardRows / export', () => {
    let writeSpy;

    beforeEach(() => {
      writeSpy = vi.fn();
      vi.stubGlobal('window', {
        open: vi.fn(() => ({
          document: {
            open: vi.fn(),
            write: writeSpy,
            close: vi.fn()
          },
          focus: vi.fn(),
          print: vi.fn()
        }))
      });
      vi.stubGlobal('setTimeout', (fn) => {
        fn();
        return 0;
      });
    });

    afterEach(() => {
      vi.unstubAllGlobals();
    });

    it('includes Weighted risk (explicable) and 68 in export HTML', () => {
      const rows = buildComplianceReportBoardRows({
        riskScore: 42,
        resilienceScore: 76,
        riskLevel: 'Medio',
        resilienceLevel: 'Alta',
        weightedRiskScore: 68,
        evidenceSummary: { coverageLabel: 'Media' }
      });

      expect(rows.some(([label]) => label === WEIGHTED_RISK_LABEL)).toBe(true);
      expect(rows.find(([label]) => label === WEIGHTED_RISK_LABEL)?.[1]).toBe(
        '68/100'
      );
      expect(rows.some(([label]) => label === OPERATIONAL_RISK_LABEL)).toBe(true);
      expect(rows.some(([label]) => label === OPERATIONAL_RESILIENCE_LABEL)).toBe(
        true
      );
      expect(rows.find(([label]) => label === OPERATIONAL_RESILIENCE_LABEL)?.[1]).toBe(
        '76/100'
      );

      complianceReportsApi.exportReport({
        supplierName: 'Weighted Test Supplier',
        riskScore: 42,
        resilienceScore: 76,
        riskLevel: 'Medio',
        resilienceLevel: 'Alta',
        weightedRiskScore: 68,
        evidenceSummary: { coverageLabel: 'Media' },
        items: [],
        recommendations: [],
        summary: 'Test summary',
        scope: 'supplier',
        createdAt: new Date().toISOString()
      });

      const html = writeSpy.mock.calls.map((call) => call[0]).join('');
      expect(html).toContain('Weighted risk (explicable)');
      expect(html).toContain('68/100');
      expect(html).toContain(OPERATIONAL_RISK_LABEL);
      expect(html).not.toContain('999/100');
      expect(html).not.toContain('NaN');
      expect(html).not.toContain('Infinity');
    });

    it('omits weighted label from board rows when weightedRiskScore is null', () => {
      const rows = buildComplianceReportBoardRows({
        riskScore: 42,
        resilienceScore: 76,
        riskLevel: 'Medio',
        resilienceLevel: 'Alta',
        evidenceSummary: { coverageLabel: 'Media' }
      });

      expect(rows.some(([label]) => label === WEIGHTED_RISK_LABEL)).toBe(false);

      complianceReportsApi.exportReport({
        supplierName: 'Operational Only Supplier',
        riskScore: 42,
        resilienceScore: 76,
        riskLevel: 'Medio',
        resilienceLevel: 'Alta',
        evidenceSummary: { coverageLabel: 'Media' },
        items: [],
        recommendations: [],
        summary: 'Test summary',
        scope: 'supplier',
        createdAt: new Date().toISOString()
      });

      const html = writeSpy.mock.calls.map((call) => call[0]).join('');
      expect(html).not.toContain('Weighted risk (explicable)');
      expect(html).toContain(OPERATIONAL_RISK_LABEL);
      expect(html).toContain(OPERATIONAL_RESILIENCE_LABEL);
    });
  });
});
