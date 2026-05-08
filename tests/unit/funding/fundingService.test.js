import { describe, expect, it } from 'vitest';

import {
  calculateCashRunway,
  calculateDilution
} from '../../../backend/services/funding/funding.service.js';

describe('funding service calculations', () => {
  it('calculateCashRunway calcula meses sin NaN ni Infinity', () => {
    const result = calculateCashRunway({
      currentCash: 120000,
      amountRaised: 80000,
      monthlyBurnRate: 10000
    });

    expect(result.status).toBe('ok');
    expect(result.projectedRunwayMonths).toBe(20);
    expect(Number.isNaN(result.projectedRunwayMonths)).toBe(false);
    expect(Number.isFinite(result.projectedRunwayMonths)).toBe(true);
  });

  it('calculateCashRunway devuelve insufficient_data cuando burn es invalido', () => {
    const zeroBurn = calculateCashRunway({
      currentCash: 120000,
      amountRaised: 80000,
      monthlyBurnRate: 0
    });
    const nullBurn = calculateCashRunway({
      currentCash: 120000,
      amountRaised: 80000,
      monthlyBurnRate: null
    });
    const invalidBurn = calculateCashRunway({
      currentCash: 120000,
      amountRaised: 80000,
      monthlyBurnRate: 'nope'
    });

    [zeroBurn, nullBurn, invalidBurn].forEach((result) => {
      expect(result.status).toBe('insufficient_data');
      expect(result.projectedRunwayMonths).toBeNull();
    });
  });

  it('calculateDilution calcula porcentaje sin NaN ni Infinity', () => {
    const dilution = calculateDilution({
      amountRaised: 250000,
      valuationPostMoney: 1000000
    });

    expect(dilution).toBe(25);
    expect(Number.isNaN(dilution)).toBe(false);
    expect(Number.isFinite(dilution)).toBe(true);
  });

  it('calculateDilution devuelve null si faltan datos', () => {
    expect(
      calculateDilution({
        amountRaised: 250000,
        valuationPostMoney: 0
      })
    ).toBeNull();
    expect(
      calculateDilution({
        amountRaised: null,
        valuationPostMoney: 1000000
      })
    ).toBeNull();
    expect(
      calculateDilution({
        amountRaised: 250000,
        valuationPostMoney: null
      })
    ).toBeNull();
  });
});
