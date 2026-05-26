import { describe, expect, it } from 'vitest';

import {
  ensureNoInvalidNumber,
  normalizeMissingData,
  safeDate,
  safeList,
  safeStatus,
  safeText
} from '../../../src/modules/reporting/utils/reportSanitizers.js';

describe('reportSanitizers', () => {
  it('safeText avoids nullish and invalid display strings', () => {
    expect(safeText(null)).toBe('N/A');
    expect(safeText(undefined)).toBe('N/A');
    expect(safeText('')).toBe('N/A');
    expect(safeText('NaN')).toBe('N/A');
    expect(safeText('Infinity')).toBe('N/A');
    expect(safeText('Board Review Draft')).toBe('Board Review Draft');
  });

  it('safeList normalizes values', () => {
    expect(safeList(null)).toEqual([]);
    expect(safeList('risk')).toEqual(['risk']);
    expect(safeList(['risk'])).toEqual(['risk']);
  });

  it('safeDate returns ISO or fallback', () => {
    expect(safeDate('2026-05-26T10:00:00.000Z')).toBe('2026-05-26T10:00:00.000Z');
    expect(safeDate('bad-date')).toBe('N/A');
  });

  it('safeStatus formats underscore state', () => {
    expect(safeStatus('human_review_required')).toBe('human review required');
  });

  it('normalizeMissingData preserves insufficient_data', () => {
    expect(normalizeMissingData(['insufficient_data'])).toEqual(['insufficient_data']);
    expect(normalizeMissingData([])).toEqual(['insufficient_data']);
  });

  it('ensureNoInvalidNumber does not convert missing score to 0', () => {
    expect(ensureNoInvalidNumber(null)).toBe('N/A');
    expect(ensureNoInvalidNumber(undefined)).toBe('N/A');
    expect(ensureNoInvalidNumber(NaN)).toBe('N/A');
    expect(ensureNoInvalidNumber(Infinity)).toBe('N/A');
    expect(ensureNoInvalidNumber(0)).toBe(0);
  });
});
