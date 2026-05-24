import { describe, expect, it } from 'vitest';

import { buildBoardViewSnapshot } from '../../../backend/services/executive/boardView.service.js';

describe('board view truthfulness', () => {
  it('preserves null readiness instead of coercing to zero', () => {
    const board = buildBoardViewSnapshot({
      moduleSummaries: {},
      signals: [],
      decisionQueue: [],
      readiness: { score: null, confidence: null }
    });

    expect(board.readinessScore).toBeNull();
    expect(board.readinessScore).not.toBe(0);
    expect(board.readinessStatus).toBe('insufficient_data');
    expect(board.humanReviewRequired).toBe(true);
    expect(board.dataSource).toBe('insufficient_data');
  });

  it('keeps operational readiness when score is provided', () => {
    const board = buildBoardViewSnapshot({
      moduleSummaries: {},
      signals: [],
      decisionQueue: [],
      readiness: { score: 72, confidence: 88 }
    });

    expect(board.readinessScore).toBe(72);
    expect(board.readinessStatus).toBe('operational_dss');
    expect(board.dataSource).toBe('operational_dss');
  });
});
