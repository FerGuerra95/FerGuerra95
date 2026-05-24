import React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { RiskHeatmap } from '../../../src/modules/risk/components/RiskEnterpriseComponents.jsx';

describe('RiskHeatmap UI alignment', () => {
  it('uses truthful operational DSS copy and likelihood × impact label', () => {
    render(
      <RiskHeatmap
        heatmap={[{ id: 'r1', likelihood: 4, impact: 5, residualScore: 87 }]}
      />
    );

    expect(screen.getByText('Likelihood × impact matrix')).toBeTruthy();
    expect(screen.getByText(/Operational residual scores are DSS decision-support signals/i)).toBeTruthy();
    expect(screen.getByText(/Golden benchmark uses L×I for validation only/i)).toBeTruthy();
    expect(screen.queryByText(/severity vs likelihood/i)).toBeNull();
    expect(screen.queryByText(/Golden score/i)).toBeNull();
    expect(screen.queryByText(/NaN/i)).toBeNull();
    expect(screen.queryByText(/Infinity/i)).toBeNull();
  });

  it('prefers enriched heatmap payload and shows operational residual max', () => {
    render(
      <RiskHeatmap
        heatmap={[{ id: 'r1', likelihood: 4, impact: 5, residualScore: 87 }]}
        risks={[{ id: 'r2', likelihood: 4, impact: 5 }]}
      />
    );

    expect(screen.getByText(/Op\. residual max 87/)).toBeTruthy();
    expect(screen.getByText(/L×I ref 20/)).toBeTruthy();
  });

  it('falls back to risks without breaking empty cells', () => {
    render(
      <RiskHeatmap
        heatmap={[]}
        risks={[{ id: 'r1', likelihood: 2, impact: 2 }]}
      />
    );

    expect(screen.getByText(/1 risk\(s\)/)).toBeTruthy();
    expect(screen.queryByText(/NaN/i)).toBeNull();
  });
});
