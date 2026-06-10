import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from '@testing-library/react';

import {
  BOARD_PACK_DRAFT_BADGE,
  BOARD_PACK_HUMAN_REVIEW_BADGE,
  BOARD_PACK_NO_PRINT_CLASS,
  BOARD_PACK_NOT_CERTIFIED_BADGE,
  BOARD_PACK_PREMIUM_TITLE,
  BOARD_PACK_PRINT_BUTTON_LABEL,
  BOARD_PACK_PRINT_DOCUMENT_CLASS,
  BOARD_PACK_PRINT_HIDDEN_APP_CHROME_MARKERS,
  BOARD_PACK_PRINT_ROOT_CLASS,
  BOARD_PACK_PRINTING_BODY_CLASS,
  BoardPackModal,
  formatBoardPackScore100
} from '../../../src/modules/ceo-overview/components/BoardPackModal.jsx';
import { BRIEFING_PACK_STATUS_ONLY_NOTE } from '../../../src/modules/ceo-overview/utils/ceoOverviewTruthfulness.js';

const sampleBoardPack = {
  score: null,
  generatedAt: '2026-06-01T10:00:00.000Z',
  executiveSummary: 'Reporting-linked draft summary.',
  recommendations: [],
  branches: {}
};

afterEach(() => {
  cleanup();
});

describe('Board pack modal print preview safety', () => {
  it('uses print draft preview label and print root class', () => {
    expect(BOARD_PACK_PRINT_BUTTON_LABEL).toMatch(/print draft preview/i);
    expect(BOARD_PACK_PRINT_BUTTON_LABEL).not.toMatch(/export pdf/i);
    expect(BOARD_PACK_PRINT_ROOT_CLASS).toBe('board-pack-print-root');
    expect(BOARD_PACK_PRINTING_BODY_CLASS).toBe('printing-board-pack');
  });

  it('keeps null board pack metrics as N/A for print output', () => {
    expect(formatBoardPackScore100(null)).toBe('N/A');
  });

  it('renders premium print root with draft badges and status-only briefing language', () => {
    render(
      React.createElement(BoardPackModal, {
        boardPack: sampleBoardPack,
        onClose: () => {}
      })
    );

    const printRoot = document.querySelector(`.${BOARD_PACK_PRINT_ROOT_CLASS}`);
    expect(printRoot).toBeTruthy();
    expect(printRoot.textContent).toContain(BOARD_PACK_PREMIUM_TITLE);
    expect(printRoot.textContent).toContain(BOARD_PACK_DRAFT_BADGE);
    expect(printRoot.textContent).toContain(BOARD_PACK_HUMAN_REVIEW_BADGE);
    expect(printRoot.textContent).toContain(BOARD_PACK_NOT_CERTIFIED_BADGE);
    expect(printRoot.textContent).toContain(BRIEFING_PACK_STATUS_ONLY_NOTE);
    expect(printRoot.textContent).toMatch(/N\/A/);
    expect(printRoot.textContent).not.toMatch(/export pdf|certified pdf|approved pack|final report/i);
    expect(printRoot.textContent).toMatch(/not certified/i);
    expect(printRoot.textContent).toMatch(/not board-approved/i);
    expect(document.querySelector(`.${BOARD_PACK_PRINT_DOCUMENT_CLASS}`)).toBeTruthy();
    expect(printRoot.textContent).toContain('Core Metrics');
    expect(printRoot.textContent).toContain('Board Recommendations');
    expect(document.querySelector(`.board-pack-footer.${BOARD_PACK_NO_PRINT_CLASS}`)).toBeTruthy();

    const styleText = document.querySelector('.board-pack-backdrop style')?.textContent || '';
    expect(BOARD_PACK_PRINT_HIDDEN_APP_CHROME_MARKERS).toContain('ceos-main-build-strip');
    expect(styleText).toContain('ceos-main-build-strip');
    expect(printRoot.textContent).not.toMatch(/BACKEND ACTIVO|Cerrar sesión/i);
  });
});
