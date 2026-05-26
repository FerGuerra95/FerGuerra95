import { describe, expect, it } from 'vitest';

import { formatDilutionValue } from '../../../src/modules/funding/utils/fundingDisplayFormat.js';

describe('formatDilutionValue', () => {
  it('returns N/A for missing or non-finite dilution', () => {
    expect(formatDilutionValue(null)).toBe('N/A');
    expect(formatDilutionValue(undefined)).toBe('N/A');
    expect(formatDilutionValue('')).toBe('N/A');
    expect(formatDilutionValue(Number.NaN)).toBe('N/A');
    expect(formatDilutionValue(Number.POSITIVE_INFINITY)).toBe('N/A');
  });

  it('formats percentage-scale dilution with one decimal', () => {
    expect(formatDilutionValue(25)).toBe('25.0%');
    expect(formatDilutionValue(25.46)).toBe('25.5%');
    expect(formatDilutionValue(0)).toBe('0.0%');
  });

  it('normalizes ratio-style dilution for display only', () => {
    expect(formatDilutionValue(0.15)).toBe('15.0%');
    expect(formatDilutionValue(0.256)).toBe('25.6%');
  });

  it('does not throw for any input', () => {
    expect(() => formatDilutionValue(null)).not.toThrow();
    expect(() => formatDilutionValue({})).not.toThrow();
  });
});
