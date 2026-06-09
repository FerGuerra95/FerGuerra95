import { describe, expect, it } from 'vitest';

import {
  formatBoardPackCount,
  formatBoardPackCurrency,
  formatBoardPackMonths,
  formatBoardPackPercent,
  formatBoardPackScore100
} from '../../../src/modules/ceo-overview/components/BoardPackModal.jsx';

describe('BoardPackModal display formatting', () => {
  it('renders null metrics as N/A instead of fake zero', () => {
    expect(formatBoardPackScore100(null)).toBe('N/A');
    expect(formatBoardPackPercent(undefined)).toBe('N/A');
    expect(formatBoardPackCount(null)).toBe('N/A');
    expect(formatBoardPackCurrency(null, 'EUR')).toBe('N/A');
    expect(formatBoardPackMonths(null)).toBe('N/A');
  });

  it('preserves explicit zero values from real sources', () => {
    expect(formatBoardPackCount(0)).toBe('0');
    expect(formatBoardPackScore100(0)).toBe('0/100');
    expect(formatBoardPackPercent(0)).toBe('0%');
    expect(formatBoardPackCurrency(0, 'EUR')).toMatch(/€|EUR|0/);
  });

  it('formats present numeric values without coercing null to zero', () => {
    expect(formatBoardPackScore100(72)).toBe('72/100');
    expect(formatBoardPackPercent(41)).toBe('41%');
    expect(formatBoardPackMonths(8.5)).toBe('8.5 months');
  });
});
