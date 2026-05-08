import { describe, expect, it } from 'vitest';

import {
  classifyRunwayStatus,
  getDisplayText,
  getOptimalFundingWindowLabel,
  getRunwayStatusLabel,
  toSafeNumber
} from '../../../src/modules/funding/utils/fundingExecutiveMetrics.js';

describe('funding executive metrics', () => {
  it('normalizes finite numbers and rejects NaN/Infinity', () => {
    expect(toSafeNumber('12.5')).toBe(12.5);
    expect(toSafeNumber('NaN')).toBeNull();
    expect(toSafeNumber(Number.POSITIVE_INFINITY)).toBeNull();
    expect(toSafeNumber(undefined)).toBeNull();
  });

  it('classifies runway status according to policy', () => {
    expect(classifyRunwayStatus(null)).toBe('insufficient_data');
    expect(classifyRunwayStatus('bad')).toBe('insufficient_data');
    expect(classifyRunwayStatus(24)).toBe('healthy');
    expect(classifyRunwayStatus(12)).toBe('watch');
    expect(classifyRunwayStatus(6)).toBe('critical');
    expect(classifyRunwayStatus(0)).toBe('critical');
  });

  it('maps runway status to display labels', () => {
    expect(getRunwayStatusLabel(null)).toBe('Insufficient data');
    expect(getRunwayStatusLabel(20)).toBe('Healthy');
    expect(getRunwayStatusLabel(10)).toBe('Watch');
    expect(getRunwayStatusLabel(2)).toBe('Critical');
  });

  it('maps optimal window states to safe labels', () => {
    expect(getOptimalFundingWindowLabel('open')).toBe('Open');
    expect(getOptimalFundingWindowLabel('watch')).toBe('Watch');
    expect(getOptimalFundingWindowLabel('blocked')).toBe('Blocked');
    expect(getOptimalFundingWindowLabel('')).toBe('Insufficient data');
    expect(getOptimalFundingWindowLabel(undefined)).toBe('Insufficient data');
  });

  it('returns safe display fallback text', () => {
    expect(getDisplayText('validated')).toBe('validated');
    expect(getDisplayText('')).toBe('Pending data');
    expect(getDisplayText(null, 'Not available')).toBe('Not available');
  });
});
