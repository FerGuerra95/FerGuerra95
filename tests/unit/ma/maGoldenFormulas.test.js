import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

import {
  calculateNetDebt,
  calculateSimpleEnterpriseValue,
  calculateSimpleEquityValue,
  calculateWaterfallSimple
} from '../../../src/modules/ma/engine/maGoldenFormulas.js';

const GOLDEN_PATH = path.join(process.cwd(), 'docs/testing/golden_inputs.json');
const GOLDEN_EV_EBITDA_ID = 'ma_valuation_ebitda_multiple_basic';
const GOLDEN_EQUITY_VALUE_ID = 'ma_valuation_equity_value_basic';
const GOLDEN_WATERFALL_SIMPLE_ID = 'ma_waterfall_simple_distribution';

function loadGoldenJson() {
  return JSON.parse(fs.readFileSync(GOLDEN_PATH, 'utf8'));
}

describe('maGoldenFormulas — EV_EBITDA (golden ma_valuation_ebitda_multiple_basic)', () => {
  it('matches golden enterpriseValue = ebitda * multiple', () => {
    const golden = loadGoldenJson();
    const dataset = golden.datasets[GOLDEN_EV_EBITDA_ID];
    const result = calculateSimpleEnterpriseValue(dataset.inputs);

    expect(result).toBe(dataset.expected.enterpriseValue);
  });
});

describe('maGoldenFormulas — NET_DEBT (golden ma_valuation_equity_value_basic)', () => {
  it('matches golden netDebt = debt - cash', () => {
    const golden = loadGoldenJson();
    const dataset = golden.datasets[GOLDEN_EQUITY_VALUE_ID];
    const result = calculateNetDebt({
      debt: dataset.inputs.debt,
      cash: dataset.inputs.cash
    });

    expect(result).toBe(dataset.expected.netDebt);
  });
});

describe('maGoldenFormulas — EQUITY_VALUE simple (golden ma_valuation_equity_value_basic)', () => {
  it('matches golden equityValue = enterpriseValue - netDebt', () => {
    const golden = loadGoldenJson();
    const dataset = golden.datasets[GOLDEN_EQUITY_VALUE_ID];
    const result = calculateSimpleEquityValue({
      enterpriseValue: dataset.inputs.enterpriseValue,
      netDebt: dataset.expected.netDebt
    });

    expect(result).toBe(dataset.expected.equityValue);
  });

  it('does not include working capital adjustment in simple equity', () => {
    const golden = loadGoldenJson();
    const dataset = golden.datasets[GOLDEN_EQUITY_VALUE_ID];
    const wcAdjustment = -10000;
    const withWorkingCapital =
      dataset.expected.equityValue + wcAdjustment;

    expect(
      calculateSimpleEquityValue({
        enterpriseValue: dataset.inputs.enterpriseValue,
        netDebt: dataset.expected.netDebt
      })
    ).not.toBe(withWorkingCapital);
  });
});

describe('maGoldenFormulas — WATERFALL_SIMPLE (golden ma_waterfall_simple_distribution)', () => {
  it('matches golden netCashToSeller seller cash bridge', () => {
    const golden = loadGoldenJson();
    const dataset = golden.datasets[GOLDEN_WATERFALL_SIMPLE_ID];
    const result = calculateWaterfallSimple(dataset.inputs);

    expect(result).toBe(dataset.expected.netCashToSeller);
  });

  it('does not use product waterfall fields (EV, netDebt, fees%, taxes%)', () => {
    const golden = loadGoldenJson();
    const dataset = golden.datasets[GOLDEN_WATERFALL_SIMPLE_ID];

    expect(calculateWaterfallSimple(dataset.inputs)).toBe(8700000);
    expect(
      calculateWaterfallSimple({
        grossProceeds: 12000000,
        transactionCosts: 300000,
        debtRepayment: 2000000,
        sellerRollover: 1000000,
        enterpriseValue: 14000000,
        netDebt: 2000000,
        feesPercent: 3,
        taxRate: 21
      })
    ).toBe(8700000);
  });
});

describe('maGoldenFormulas — edge cases', () => {
  it('returns null when required inputs are missing', () => {
    expect(calculateSimpleEnterpriseValue({ ebitda: 2000000 })).toBeNull();
    expect(calculateNetDebt({ debt: 100 })).toBeNull();
    expect(calculateSimpleEquityValue({ enterpriseValue: 100 })).toBeNull();
    expect(
      calculateWaterfallSimple({
        grossProceeds: 100,
        transactionCosts: 10,
        debtRepayment: 5
      })
    ).toBeNull();
  });

  it('returns null for non-finite inputs', () => {
    expect(calculateSimpleEnterpriseValue({ ebitda: NaN, multiple: 7 })).toBeNull();
    expect(calculateSimpleEnterpriseValue({ ebitda: 'bad', multiple: 7 })).toBeNull();
    expect(calculateNetDebt({ debt: Infinity, cash: 1 })).toBeNull();
    expect(
      calculateSimpleEquityValue({ enterpriseValue: 100, netDebt: 'bad' })
    ).toBeNull();
    expect(
      calculateWaterfallSimple({
        grossProceeds: 100,
        transactionCosts: NaN,
        debtRepayment: 1,
        sellerRollover: 1
      })
    ).toBeNull();
  });

  it('returns null for negative EBITDA in simple enterprise value', () => {
    expect(calculateSimpleEnterpriseValue({ ebitda: -1, multiple: 7 })).toBeNull();
  });

  it('allows negative net debt when cash exceeds debt', () => {
    expect(calculateNetDebt({ debt: 500000, cash: 2500000 })).toBe(-2000000);
  });
});
