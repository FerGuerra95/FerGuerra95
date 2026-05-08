import { describe, expect, it } from 'vitest';

import {
  applyComplianceValuationImpact,
  calculateComplianceMultipleAdjustment,
  normalizeComplianceRiskImpact
} from '../../../src/modules/ma/engine/complianceValuationBridge.js';

describe('complianceValuationBridge', () => {
  it('calcula ajustes deterministas al multiplo EBITDA por riesgo legal', () => {
    expect(
      calculateComplianceMultipleAdjustment({
        legalRiskScore: 20,
        criticalFindings: 0
      })
    ).toBe(0);
    expect(
      calculateComplianceMultipleAdjustment({
        legalRiskScore: 58,
        criticalFindings: 1
      })
    ).toBe(-0.45);
    expect(
      calculateComplianceMultipleAdjustment({
        legalRiskScore: 86,
        criticalFindings: 1
      })
    ).toBe(-1.25);
    expect(
      calculateComplianceMultipleAdjustment({
        legalRiskScore: 60,
        criticalFindings: 3
      })
    ).toBe(-1.25);
  });

  it('normaliza el impacto y lo aplica sin subir el multiplo por compliance', () => {
    const impact = normalizeComplianceRiskImpact({
      auditRunId: 'audit_001',
      legalRiskScore: 72,
      criticalFindings: 1,
      evidenceCoverage: 40
    });
    const result = applyComplianceValuationImpact(5.2, impact);

    expect(impact.ebitdaMultipleDelta).toBe(-0.8);
    expect(result.adjustedMultiple).toBe(4.4);
    expect(result.complianceRiskImpact.auditRunId).toBe('audit_001');
  });
});
