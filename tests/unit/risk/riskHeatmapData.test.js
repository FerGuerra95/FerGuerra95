import { describe, expect, it } from 'vitest';

import {
  goldenMatrixReference,
  maxOperationalScoreInCell,
  normalizeRiskHeatmapData
} from '../../../src/modules/risk/utils/riskHeatmapData.js';

describe('normalizeRiskHeatmapData', () => {
  it('prefers enriched dashboard.heatmap over raw risks', () => {
    const heatmap = [
      {
        id: 'r1',
        title: 'Supply disruption',
        likelihood: 4,
        impact: 5,
        residualScore: 87,
        inherentScore: 93
      }
    ];
    const risks = [{ id: 'r2', title: 'Legacy row', likelihood: 2, impact: 2 }];

    const rows = normalizeRiskHeatmapData({ heatmap, risks });

    expect(rows).toHaveLength(1);
    expect(rows[0].source).toBe('heatmap');
    expect(rows[0].likelihood).toBe(4);
    expect(rows[0].impact).toBe(5);
    expect(rows[0].residualScore).toBe(87);
    expect(rows[0].inherentScore).toBe(93);
  });

  it('falls back to dashboard.risks when heatmap is empty', () => {
    const rows = normalizeRiskHeatmapData({
      heatmap: [],
      risks: [{ id: 'r1', likelihood: 3, impact: 4 }]
    });

    expect(rows).toHaveLength(1);
    expect(rows[0].source).toBe('risks');
    expect(rows[0].likelihood).toBe(3);
    expect(rows[0].impact).toBe(4);
    expect(rows[0].residualScore).toBeNull();
  });

  it('returns empty array without NaN or Infinity', () => {
    const rows = normalizeRiskHeatmapData({
      heatmap: [{ likelihood: 'bad', impact: null, residualScore: Infinity }],
      risks: []
    });

    expect(rows).toHaveLength(1);
    expect(rows[0].likelihood).toBeNull();
    expect(rows[0].impact).toBeNull();
    expect(rows[0].residualScore).toBeNull();
  });
});

describe('goldenMatrixReference', () => {
  it('returns a Golden L×I benchmark reference for valid cells', () => {
    expect(goldenMatrixReference(4, 5)).toBe(20);
    expect(goldenMatrixReference(1, 1)).toBe(1);
  });

  it('returns null for invalid scale values', () => {
    expect(goldenMatrixReference(0, 5)).toBeNull();
    expect(goldenMatrixReference(4, 6)).toBeNull();
    expect(goldenMatrixReference('x', 3)).toBeNull();
  });
});

describe('maxOperationalScoreInCell', () => {
  it('returns highest residual operational score in a cell', () => {
    expect(
      maxOperationalScoreInCell([
        { residualScore: 40 },
        { residualScore: 87 },
        { residualScore: 60 }
      ])
    ).toBe(87);
  });

  it('returns null when no operational scores exist', () => {
    expect(maxOperationalScoreInCell([{ residualScore: null }])).toBeNull();
    expect(maxOperationalScoreInCell([])).toBeNull();
  });
});
