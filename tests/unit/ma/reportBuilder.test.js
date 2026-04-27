import { describe, expect, it } from 'vitest';
import {
  DEFAULT_FINANCIALS,
  DEFAULT_SETTINGS,
  DEFAULT_SECTOR,
  SECTOR_DATA,
  parseFinancialInputs,
  calculateCoreMetrics
} from '../../../src/modules/ma/engine/valuationFormulas.js';
import {
  calculateQualityScore,
  getRiskModeMultiplier,
  buildRiskLevel
} from '../../../src/modules/ma/engine/riskScoring.js';
import {
  buildComparables,
  buildBuyerMatches,
  buildNarrative
} from '../../../src/modules/ma/engine/reportBuilder.js';
import { clamp } from '../../../src/shared/utils/validators.js';

function buildDerivedBase() {
  const sectorMeta = SECTOR_DATA[DEFAULT_SECTOR];
  const inputs = parseFinancialInputs(DEFAULT_FINANCIALS);
  const core = calculateCoreMetrics(inputs);

  const qualityScore = calculateQualityScore({
    inputs,
    sectorMeta
  });

  const adjustedMultiple = clamp(
    sectorMeta.mult *
      getRiskModeMultiplier(DEFAULT_SETTINGS.riskMode) *
      (0.72 + qualityScore / 100),
    1.6,
    12
  );

  const evBase = core.normalizedEbitda * adjustedMultiple;
  const equityBase = evBase - core.netDebt + core.wcAdjustment;

  const feesVal = equityBase * (inputs.transactionFees / 100);
  const taxableAmount = Math.max(0, equityBase - feesVal);
  const taxesVal = taxableAmount * (inputs.taxRate / 100);
  const netProceeds = equityBase - feesVal - taxesVal;

  return {
    ...inputs,
    ...core,
    sectorMeta,
    qualityScore,
    adjustedMultiple,
    evBase,
    equityBase,
    feesVal,
    taxesVal,
    netProceeds,
    riskLevel: buildRiskLevel(qualityScore)
  };
}

describe('reportBuilder', () => {
  it('genera comparables para el sector base', () => {
    const comparables = buildComparables(DEFAULT_SECTOR, 6.1);

    expect(Array.isArray(comparables)).toBe(true);
    expect(comparables.length).toBe(3);

    expect(comparables[0]).toHaveProperty('name');
    expect(comparables[0]).toHaveProperty('multiple');
    expect(comparables[0]).toHaveProperty('note');

    expect(comparables[1].multiple).toBeCloseTo(6.1, 2);
  });

  it('limita los múltiplos comparables dentro de un rango razonable', () => {
    const lowComparables = buildComparables(DEFAULT_SECTOR, 0.5);
    const highComparables = buildComparables(DEFAULT_SECTOR, 20);

    lowComparables.forEach((peer) => {
      expect(peer.multiple).toBeGreaterThanOrEqual(1.5);
    });

    highComparables.forEach((peer) => {
      expect(peer.multiple).toBeLessThanOrEqual(12);
    });
  });

  it('genera perfiles de comprador accionables', () => {
    const buyers = buildBuyerMatches({
      sector: DEFAULT_FINANCIALS.sector,
      qualityScore: 73,
      leverageRatio: 0.13,
      recurringRevenue: 55,
      ownerDependency: 35,
      clientConcentration: 25
    });

    expect(Array.isArray(buyers)).toBe(true);
    expect(buyers.length).toBe(3);

    buyers.forEach((buyer) => {
      expect(buyer).toHaveProperty('type');
      expect(buyer).toHaveProperty('title');
      expect(buyer).toHaveProperty('fit');
      expect(buyer).toHaveProperty('desc');

      expect(buyer.fit).toBeGreaterThanOrEqual(0);
      expect(buyer.fit).toBeLessThanOrEqual(100);
    });
  });

  it('mejora el match estratégico con mayor recurrencia y menor dependencia del dueño', () => {
    const baseBuyers = buildBuyerMatches({
      sector: DEFAULT_FINANCIALS.sector,
      qualityScore: 70,
      leverageRatio: 0.2,
      recurringRevenue: 40,
      ownerDependency: 60,
      clientConcentration: 30
    });

    const improvedBuyers = buildBuyerMatches({
      sector: DEFAULT_FINANCIALS.sector,
      qualityScore: 85,
      leverageRatio: 0.1,
      recurringRevenue: 90,
      ownerDependency: 10,
      clientConcentration: 10
    });

    const baseStrategic = baseBuyers.find((buyer) => buyer.type === 'Estratégico');
    const improvedStrategic = improvedBuyers.find((buyer) => buyer.type === 'Estratégico');

    expect(improvedStrategic.fit).toBeGreaterThan(baseStrategic.fit);
  });

  it('genera narrativa ejecutiva y tesis de inversión', () => {
    const derived = buildDerivedBase();

    const narrative = buildNarrative({
      financials: DEFAULT_FINANCIALS,
      settings: DEFAULT_SETTINGS,
      derived
    });

    expect(narrative).toHaveProperty('execSummary');
    expect(narrative).toHaveProperty('thesis');

    expect(typeof narrative.execSummary).toBe('string');
    expect(narrative.execSummary.length).toBeGreaterThan(40);

    expect(Array.isArray(narrative.thesis)).toBe(true);
    expect(narrative.thesis.length).toBeGreaterThan(0);
  });
});