import { describe, expect, it } from 'vitest';

import {
  clampRiskMatrixScale,
  prepareRiskRegisterPayload
} from '../../../src/modules/risk/utils/riskRegisterPayload.js';

describe('prepareRiskRegisterPayload', () => {
  it('clamps likelihood and impact to 1–5', () => {
    expect(
      prepareRiskRegisterPayload({ title: 'Test', likelihood: 0, impact: 9 })
    ).toEqual(
      expect.objectContaining({ likelihood: 1, impact: 5 })
    );
  });

  it('uses visible defaults when values are missing', () => {
    expect(prepareRiskRegisterPayload({ title: 'Test' })).toEqual(
      expect.objectContaining({ likelihood: 3, impact: 3 })
    );
  });

  it('rounds decimal matrix inputs defensively', () => {
    expect(clampRiskMatrixScale(2.6)).toBe(3);
    expect(clampRiskMatrixScale('4.2')).toBe(4);
  });
});
