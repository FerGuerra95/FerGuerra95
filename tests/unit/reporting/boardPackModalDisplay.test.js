import { describe, expect, it } from 'vitest';

import {
  BOARD_PACK_PRINT_BUTTON_LABEL,
  BOARD_PACK_PRINT_ROOT_CLASS,
  formatBoardPackScore100
} from '../../../src/modules/ceo-overview/components/BoardPackModal.jsx';

describe('Board pack modal print preview safety', () => {
  it('uses print draft preview label and print root class', () => {
    expect(BOARD_PACK_PRINT_BUTTON_LABEL).toMatch(/print draft preview/i);
    expect(BOARD_PACK_PRINT_ROOT_CLASS).toBe('board-pack-print-root');
  });

  it('keeps null board pack metrics as N/A for print output', () => {
    expect(formatBoardPackScore100(null)).toBe('N/A');
  });
});
