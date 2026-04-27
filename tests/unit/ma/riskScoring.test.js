import { describe, expect, it } from 'vitest';
import {
  DEFAULT_FINANCIALS,
  DEFAULT_SECTOR,
  SECTOR_DATA,
  parseFinancialInputs
} from '../../../src/modules/ma/engine/valuationFormulas.js';
import {
  getRiskModeMultiplier,
  calculateQualityScore,
  buildRiskLevel
} from '../../../src/modules/ma/engine/riskScoring.js';

describe('riskScoring', () => {
  it('devuelve el multiplicador correcto según el modo de riesgo', () => {
    expect(getRiskModeMultiplier('conservative')).toBe(0.93);
    expect(getRiskModeMultiplier('balanced')).toBe(1);
    expect(getRiskModeMultiplier('aggressive')).toBe(1.07);
  });

  it('devuelve balanced como modo por defecto si el modo no existe', () => {
    expect(getRiskModeMultiplier('unknown')).toBe(1);
    expect(getRiskModeMultiplier(undefined)).toBe(1);
  });

  it('calcula correctamente el quality score con los datos base', () => {
    const inputs = parseFinancialInputs(DEFAULT_FINANCIALS);
    const sectorMeta = SECTOR_DATA[DEFAULT_SECTOR];

    const qualityScore = calculateQualityScore({
      inputs,
      sectorMeta
    });

    expect(qualityScore).toBeCloseTo(73.295, 3);
  });

  it('mejora el quality score cuando hay más ingresos recurrentes y menos riesgos', () => {
    const baseInputs = parseFinancialInputs(DEFAULT_FINANCIALS);
    const improvedInputs = parseFinancialInputs({
      ...DEFAULT_FINANCIALS,
      ownerDependency: '10',
      clientConcentration: '10',
      recurringRevenue: '90',
      workingCapitalNeed: '5',
      regionHighRisk: '0',
      growth: '20'
    });

    const sectorMeta = SECTOR_DATA[DEFAULT_SECTOR];

    const baseScore = calculateQualityScore({
      inputs: baseInputs,
      sectorMeta
    });

    const improvedScore = calculateQualityScore({
      inputs: improvedInputs,
      sectorMeta
    });

    expect(improvedScore).toBeGreaterThan(baseScore);
  });

  it('reduce el quality score cuando aumentan dependencia, concentración y riesgo geográfico', () => {
    const baseInputs = parseFinancialInputs(DEFAULT_FINANCIALS);
    const riskierInputs = parseFinancialInputs({
      ...DEFAULT_FINANCIALS,
      ownerDependency: '90',
      clientConcentration: '80',
      recurringRevenue: '10',
      workingCapitalNeed: '70',
      regionHighRisk: '80',
      growth: '0'
    });

    const sectorMeta = SECTOR_DATA[DEFAULT_SECTOR];

    const baseScore = calculateQualityScore({
      inputs: baseInputs,
      sectorMeta
    });

    const riskierScore = calculateQualityScore({
      inputs: riskierInputs,
      sectorMeta
    });

    expect(riskierScore).toBeLessThan(baseScore);
  });

  it('clasifica correctamente el nivel de riesgo según el quality score', () => {
    expect(buildRiskLevel(85).label).toBe('Bajo');
    expect(buildRiskLevel(65).label).toBe('Medio');
    expect(buildRiskLevel(40).label).toBe('Alto');
  });
});