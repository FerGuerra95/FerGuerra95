import { describe, expect, it } from 'vitest';
import {
  DEFAULT_FUNDING_INPUTS,
  parseFundingInputs,
  calculateFundingCore
} from '../../../src/modules/funding/engine/fundingFormulas.js';

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
    const inputs = parseFundingInputs({
      ...DEFAULT_FUNDING_INPUTS,
      currentCash: '1000000',
      monthlyBurn: '100000',
      targetRaise: '0'
    });
    const core = calculateFundingCore(inputs);

    expect(core.currentRunwayMonths).toBe(10);
    expect(core.runwayAfterRaiseMonths).toBe(10);
  });
});
