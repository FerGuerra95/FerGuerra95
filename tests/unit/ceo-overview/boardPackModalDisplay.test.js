import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';

import {
  BOARD_PACK_DRAFT_BADGE,
  BOARD_PACK_HUMAN_REVIEW_BADGE,
  BOARD_PACK_NO_PRINT_CLASS,
  BOARD_PACK_NOT_CERTIFIED_BADGE,
  BOARD_PACK_PREMIUM_TITLE,
  BOARD_PACK_PRINT_BUTTON_LABEL,
  BOARD_PACK_PRINT_DRAFT_BANNER,
  BOARD_PACK_PRINT_ROOT_CLASS,
  BOARD_PACK_PRINTING_BODY_CLASS,
  BoardPackModal,
  formatBoardPackCount,
  formatBoardPackCurrency,
  formatBoardPackMonths,
  formatBoardPackPercent,
  formatBoardPackScore100,
  runBoardPackPrintPreview,
  softenBoardPackRecommendation
} from '../../../src/modules/ceo-overview/components/BoardPackModal.jsx';
import {
  BOARD_PACK_PRINT_DRAFT_HINT,
  BRIEFING_PACK_STATUS_ONLY_NOTE
} from '../../../src/modules/ceo-overview/utils/ceoOverviewTruthfulness.js';

const sampleBoardPack = {
  score: 72,
  generatedAt: '2026-06-01T10:00:00.000Z',
  executiveSummary: 'Draft executive summary for human review.',
  recommendations: [
    'Escalate blocked PMI dependencies with named owners and board-level due dates.',
    'Validate funding runway assumptions before board circulation.'
  ],
  branches: {
    ma: { score: 70, valuation: 1200000, multipleLabel: '8x' },
    compliance: { score: null, healthScore: null, criticalFindings: 0 },
    funding: { score: 65, runwayMonths: 8.5, capitalRaised: 500000 },
    pmi: { score: 55, integrationProgress: 0 },
    bridge: { score: 60 },
    governance: { score: 68 },
    heritage: { score: 50 }
  }
};

afterEach(() => {
  cleanup();
  document.body.classList.remove(BOARD_PACK_PRINTING_BODY_CLASS);
});

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
    expect(BOARD_PACK_PRINTING_BODY_CLASS).toBe('printing-board-pack');
  });

  it('softens recommendations that imply named owners or board-level due dates', () => {
    expect(
      softenBoardPackRecommendation(
        'Escalate blocked PMI dependencies with named owners and board-level due dates.'
      )
    ).toBe('Confirm owners and timing before external circulation.');
    expect(softenBoardPackRecommendation('Assign remediation owners before cycle.')).toMatch(
      /confirm remediation owners/i
    );
  });

  it('renders premium print root with draft badges, status-only language, and no-print actions', () => {
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
    expect(printRoot.textContent).toContain(BOARD_PACK_NOT_CERTIFIED_BADGE);
    expect(printRoot.textContent).toContain(BOARD_PACK_HUMAN_REVIEW_BADGE);
    expect(printRoot.textContent).toMatch(/draft executive summary/i);
    expect(printRoot.textContent).toContain(BRIEFING_PACK_STATUS_ONLY_NOTE);
    expect(printRoot.textContent).toMatch(/N\/A/);
    expect(printRoot.textContent).toMatch(/0%/);
    expect(printRoot.textContent).not.toMatch(/export pdf/i);
    expect(printRoot.textContent).not.toMatch(/named owners/i);
    expect(printRoot.textContent).not.toMatch(/board-level due dates/i);
    expect(printRoot.textContent).not.toMatch(/export pdf|certified pdf|board-approved pack/i);
    expect(printRoot.textContent).toMatch(/not certified/i);
    expect(printRoot.textContent).toMatch(/not board-approved/i);

    const printButton = screen.getByRole('button', { name: BOARD_PACK_PRINT_BUTTON_LABEL });
    expect(printButton.classList.contains(BOARD_PACK_NO_PRINT_CLASS)).toBe(true);
  });

  it('adds and removes the printing body class around browser print', () => {
    const printSpy = vi.spyOn(window, 'print').mockImplementation(() => {});

    runBoardPackPrintPreview();

    expect(document.body.classList.contains(BOARD_PACK_PRINTING_BODY_CLASS)).toBe(true);

    window.dispatchEvent(new Event('afterprint'));

    expect(document.body.classList.contains(BOARD_PACK_PRINTING_BODY_CLASS)).toBe(false);
    expect(printSpy).toHaveBeenCalledTimes(1);

    printSpy.mockRestore();
  });
});
