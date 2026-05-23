import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import {
  DEFAULT_FUNDING_INPUTS,
  parseFundingInputs,
  calculateFundingCore
} from '../../../src/modules/funding/engine/fundingFormulas.js';

const GOLDEN_PATH = path.join(process.cwd(), 'docs/testing/golden_inputs.json');
const GOLDEN_POST_MONEY_ID = 'funding_post_money_and_dilution_basic';
const GOLDEN_RUNWAY_ZERO_BURN_ID = 'funding_runway_zero_burn';
const GOLDEN_RUNWAY_BASIC_ID = 'funding_runway_basic';

function loadGoldenJson() {
  return JSON.parse(fs.readFileSync(GOLDEN_PATH, 'utf8'));
}

function goldenInputsToFundingInputs(datasetInputs) {
  return parseFundingInputs({
    ...DEFAULT_FUNDING_INPUTS,
    preMoneyValuation: String(datasetInputs.preMoneyValuation ?? 0),
    targetRaise: String(datasetInputs.newInvestment ?? datasetInputs.targetRaise ?? 0),
    currentCash: String(datasetInputs.currentCash ?? DEFAULT_FUNDING_INPUTS.currentCash),
    monthlyBurn: String(datasetInputs.monthlyBurn ?? DEFAULT_FUNDING_INPUTS.monthlyBurn)
  });
}

describe('fundingFormulas runway (golden funding_runway_zero_burn)', () => {
  it('returns null currentRunwayMonths when monthlyBurn is 0', () => {
    const inputs = parseFundingInputs({
      ...DEFAULT_FUNDING_INPUTS,
      currentCash: '1000000',
      monthlyBurn: '0'
    });
    const core = calculateFundingCore(inputs);

    expect(core.currentRunwayMonths).toBeNull();
    expect(core.runwayAfterRaiseMonths).toBeNull();
    expect(core.bufferVsTargetMonths).toBeNull();
  });

  it('returns null runway after raise when monthlyBurn is 0', () => {
    const inputs = parseFundingInputs({
      ...DEFAULT_FUNDING_INPUTS,
      currentCash: '1000000',
      monthlyBurn: '0',
      targetRaise: '500000'
    });
    const core = calculateFundingCore(inputs);

    expect(core.runwayAfterRaiseMonths).toBeNull();
  });

  it('calculates runway when monthlyBurn is positive (golden funding_runway_basic)', () => {
    const golden = loadGoldenJson();
    const dataset = golden.datasets[GOLDEN_RUNWAY_BASIC_ID];
    const inputs = parseFundingInputs({
      ...DEFAULT_FUNDING_INPUTS,
      currentCash: String(dataset.inputs.cashBalance),
      monthlyBurn: String(dataset.inputs.monthlyBurn),
      targetRaise: '0'
    });
    const core = calculateFundingCore(inputs);

    expect(core.currentRunwayMonths).toBe(dataset.expected.runwayMonths);
    expect(core.runwayAfterRaiseMonths).toBe(dataset.expected.runwayMonths);
  });

  it('zero-burn regression: never 0, 999, NaN, or Infinity on runway fields', () => {
    const inputs = parseFundingInputs({
      ...DEFAULT_FUNDING_INPUTS,
      currentCash: '1000000',
      monthlyBurn: '0',
      targetRaise: '2000000'
    });
    const core = calculateFundingCore(inputs);
    const runwayValues = [core.currentRunwayMonths, core.runwayAfterRaiseMonths];

    for (const value of runwayValues) {
      expect(value).toBeNull();
      expect(value).not.toBe(0);
      expect(value).not.toBe(999);
      if (value !== null) {
        expect(Number.isNaN(value)).toBe(false);
        expect(Number.isFinite(value)).toBe(true);
      }
    }
  });
});

describe('fundingFormulas post-money and ownership (golden funding_post_money_and_dilution_basic)', () => {
  const golden = loadGoldenJson();
  const dataset = golden.datasets[GOLDEN_POST_MONEY_ID];
  const tolerance = dataset.tolerance ?? golden.globalRules?.toleranceDefault ?? 0.000001;

  it('matches golden POST_MONEY: preMoney + newInvestment = postMoneyValuation', () => {
    const inputs = goldenInputsToFundingInputs(dataset.inputs);
    const core = calculateFundingCore(inputs);
    const expected = dataset.expected.postMoneyValuation;

    expect(core.postMoneyValuation).toBe(expected);
    expect(core.postMoneyValuation).toBe(10_000_000);
  });

  it('matches golden INVESTOR_OWNERSHIP: dilutionPct = 20% (0.2 decimal)', () => {
    const inputs = goldenInputsToFundingInputs(dataset.inputs);
    const core = calculateFundingCore(inputs);
    const expectedPercent = dataset.expected.newInvestorOwnershipPercent;
    const expectedDecimal = dataset.expected.newInvestorOwnershipDecimal;

    expect(core.dilutionPct).toBe(expectedPercent);
    expect(core.dilutionPct).toBe(20);
    expect(Math.abs(core.dilutionPct / 100 - expectedDecimal)).toBeLessThanOrEqual(tolerance);
  });

  it('maps new investor slice to postRoundOwnership.newInvestors (FE percent field)', () => {
    const inputs = goldenInputsToFundingInputs(dataset.inputs);
    const core = calculateFundingCore(inputs);

    expect(core.postRoundOwnership.newInvestors).toBe(core.dilutionPct);
    expect(core.postRoundOwnership.newInvestors).toBe(20);
  });

  it('postMoney <= 0 => dilutionPct and ownership null (C.13.3D)', () => {
    const inputs = parseFundingInputs({
      ...DEFAULT_FUNDING_INPUTS,
      preMoneyValuation: '0',
      targetRaise: '0'
    });
    const core = calculateFundingCore(inputs);

    expect(core.postMoneyValuation).toBe(0);
    expect(core.dilutionPct).toBeNull();
    expect(core.postRoundOwnership.newInvestors).toBeNull();
    expect(core.postRoundOwnership.founders).toBeNull();
  });
});
