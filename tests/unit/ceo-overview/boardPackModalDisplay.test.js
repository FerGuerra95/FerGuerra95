import { describe, expect, it } from 'vitest';

import {
  BOARD_PACK_NO_PRINT_CLASS,
  BOARD_PACK_PRINT_BUTTON_LABEL,
  BOARD_PACK_PRINT_DRAFT_BANNER,
  BOARD_PACK_PRINT_ROOT_CLASS,
  formatBoardPackCount,
  formatBoardPackCurrency,
  formatBoardPackMonths,
  formatBoardPackPercent,
  formatBoardPackScore100
} from '../../../src/modules/ceo-overview/components/BoardPackModal.jsx';
import { BOARD_PACK_PRINT_DRAFT_HINT } from '../../../src/modules/ceo-overview/utils/ceoOverviewTruthfulness.js';

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

  it('exposes print draft labels without export PDF or certified claims', () => {
    expect(BOARD_PACK_PRINT_BUTTON_LABEL).toBe('Print draft preview');
    expect(BOARD_PACK_PRINT_BUTTON_LABEL).not.toMatch(/export pdf|exportar a pdf/i);
    expect(BOARD_PACK_PRINT_DRAFT_HINT).toMatch(/browser print/i);
    expect(BOARD_PACK_PRINT_DRAFT_HINT).toMatch(/draft only/i);
    expect(BOARD_PACK_PRINT_DRAFT_HINT).toMatch(/layout may vary/i);
    expect(BOARD_PACK_PRINT_DRAFT_BANNER).toMatch(/human review required/i);
    expect(BOARD_PACK_PRINT_DRAFT_BANNER).toMatch(/not board-approved/i);
    expect(BOARD_PACK_PRINT_DRAFT_BANNER).not.toMatch(/certified/i);
  });

  it('defines print root and no-print classes for scoped browser print', () => {
    expect(BOARD_PACK_PRINT_ROOT_CLASS).toBe('board-pack-print-root');
    expect(BOARD_PACK_NO_PRINT_CLASS).toBe('board-pack-no-print');
  });
});
