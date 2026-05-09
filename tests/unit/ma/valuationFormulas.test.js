import { describe, expect, it } from 'vitest';
import {
  DEFAULT_FINANCIALS,
  parseFinancialInputs,
  calculateCoreMetrics,
  calculateDcfEnterpriseValue
} from '../../../src/modules/ma/engine/valuationFormulas.js';

describe('valuationFormulas', () => {
  it('calcula correctamente EBITDA normalizado, deuda neta y ajuste de working capital', () => {
    const inputs = parseFinancialInputs(DEFAULT_FINANCIALS);
    const core = calculateCoreMetrics(inputs);

    expect(core.normalizedEbitda).toBe(535000);
    expect(core.netDebt).toBe(70000);
    expect(core.wcAdjustment).toBe(-10000);
  });

  it('calcula correctamente el leverage ratio', () => {
    const inputs = parseFinancialInputs(DEFAULT_FINANCIALS);
    const core = calculateCoreMetrics(inputs);

    expect(core.leverageRatio).toBeCloseTo(70000 / 535000, 5);
  });

  it('convierte correctamente inputs de texto a numeros', () => {
    const inputs = parseFinancialInputs({
      ...DEFAULT_FINANCIALS,
      reportedEbitda: '450000',
      addBacks: '85000',
      debt: '120000',
      cash: '50000',
      targetWC: '100000',
      actualWC: '90000'
    });

    expect(inputs.reportedEbitda).toBe(450000);
    expect(inputs.addBacks).toBe(85000);
    expect(inputs.debt).toBe(120000);
    expect(inputs.cash).toBe(50000);
    expect(inputs.targetWC).toBe(100000);
    expect(inputs.actualWC).toBe(90000);
  });

  it('limita porcentajes clave dentro de 0 y 100', () => {
    const inputs = parseFinancialInputs({
      ...DEFAULT_FINANCIALS,
      ownerDependency: '150',
      clientConcentration: '-20',
      recurringRevenue: '120'
    });

    expect(inputs.ownerDependency).toBe(100);
    expect(inputs.clientConcentration).toBe(0);
    expect(inputs.recurringRevenue).toBe(100);
  });

  it('calcula DCF con WACC, crecimiento terminal y flujos descontados', () => {
    const inputs = parseFinancialInputs(DEFAULT_FINANCIALS);
    const core = calculateCoreMetrics(inputs);
    const dcf = calculateDcfEnterpriseValue({
      normalizedEbitda: core.normalizedEbitda,
      growthPct: inputs.growth,
      taxRatePct: inputs.taxRate,
      waccPct: inputs.wacc,
      terminalGrowthPct: inputs.terminalGrowth,
      projectionYears: inputs.projectionYears,
      depreciationAmortization: inputs.depreciationAmortization,
      capex: inputs.capex,
      changeInWorkingCapital: inputs.changeInWorkingCapital
    });

    expect(dcf.warnings).toEqual([]);
    expect(dcf.annualCashFlows).toHaveLength(5);
    expect(dcf.enterpriseValue).toBeGreaterThan(0);
    expect(dcf.terminalPresentValue).toBeGreaterThan(0);
  });

  it('bloquea DCF cuando WACC no supera el crecimiento terminal', () => {
    const dcf = calculateDcfEnterpriseValue({
      normalizedEbitda: 500000,
      waccPct: 2,
      terminalGrowthPct: 3
    });

    expect(dcf.enterpriseValue).toBeNull();
    expect(dcf.warnings).toContain('DCF requires WACC above terminal growth.');
  });
});
