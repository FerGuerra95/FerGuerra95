// @vitest-environment jsdom

import { describe, expect, it } from 'vitest';
import { renderHook } from '@testing-library/react';

import { useValuationEngine } from '../../../src/modules/ma/engine/useValuationEngine.js';
import {
  DEFAULT_FINANCIALS,
  DEFAULT_SETTINGS,
  PRIMARY_VALUATION_METHOD,
  reconstructAdjustedEquityValue
} from '../../../src/modules/ma/engine/valuationFormulas.js';
import {
  VALUATION_LEDGER_TITLE,
  getValuationEquityBridgeRows
} from '../../../src/modules/ma/components/valuation/ValuationWorkspacePanels.jsx';
import {
  formatAnalysisDisplayLabel,
  getEngineStatusLabel,
  getReadinessTitle
} from '../../../src/modules/ma/pages/ValuationPage.jsx';

describe('M&A valuation method and equity bridge coherence', () => {
  it('treats headline equity as EBITDA × multiple, not DCF', () => {
    const { result } = renderHook(() =>
      useValuationEngine({
        financials: DEFAULT_FINANCIALS,
        settings: DEFAULT_SETTINGS
      })
    );

    expect(PRIMARY_VALUATION_METHOD.id).toBe('adjusted_ebitda_multiple');
    expect(PRIMARY_VALUATION_METHOD.kicker).toBe(
      'Adjusted equity value — multiple view'
    );
    expect(PRIMARY_VALUATION_METHOD.kicker).not.toMatch(/dcf/i);

    expect(result.current.evBase).toBeCloseTo(
      result.current.normalizedEbitda * result.current.adjustedMultiple,
      6
    );
    expect(result.current.equityBase).not.toBe(result.current.dcfEnterpriseValue);
    expect(result.current.evBase).not.toBe(result.current.blendedEnterpriseValue);
    expect(result.current.dcfEnterpriseValue).toBeGreaterThan(0);
  });

  it('reconciles EV → net debt → working capital → equity with no hidden adjustment', () => {
    const { result } = renderHook(() =>
      useValuationEngine({
        financials: DEFAULT_FINANCIALS,
        settings: DEFAULT_SETTINGS
      })
    );

    expect(result.current.wcAdjustment).toBe(-10000);
    expect(
      reconstructAdjustedEquityValue({
        enterpriseValue: result.current.evBase,
        netDebt: result.current.netDebt,
        workingCapitalAdjustment: result.current.wcAdjustment
      })
    ).toBeCloseTo(result.current.equityBase, 6);
    expect(result.current.evBase - result.current.netDebt).not.toBeCloseTo(
      result.current.equityBase,
      0
    );
  });

  it('exposes working capital as a ledger row in the equity bridge', () => {
    const { result } = renderHook(() =>
      useValuationEngine({
        financials: DEFAULT_FINANCIALS,
        settings: DEFAULT_SETTINGS
      })
    );

    const rows = getValuationEquityBridgeRows(result.current);
    const wcRow = rows.find((row) => row.id === 'workingCapital');
    const equityRow = rows.find((row) => row.id === 'equity');

    expect(VALUATION_LEDGER_TITLE).toBe('Value ledger — equity bridge');
    expect(VALUATION_LEDGER_TITLE).not.toMatch(/closing structure/i);
    expect(wcRow.title).toBe('Working capital adjustment');
    expect(wcRow.numericValue).toBe(-10000);
    expect(equityRow.numericValue).toBeCloseTo(result.current.equityBase, 6);
  });

  it('keeps calculation readiness distinct from committee evidence coverage', () => {
    expect(
      getReadinessTitle({
        canAnalyze: true,
        isAnalyzing: false,
        hasValidationErrors: false
      })
    ).toBe('Ready for valuation');
    expect(
      getEngineStatusLabel({ showResults: true, isAnalyzing: false }, false)
    ).toBe('Results ready');
    expect(formatAnalysisDisplayLabel('Valoración lista')).toBe('Results ready');
    expect(formatAnalysisDisplayLabel('Listo para auditoría')).toBe(
      'Calculation ready'
    );
    expect(formatAnalysisDisplayLabel('Listo para auditoría')).not.toBe(
      'Ready for audit'
    );

    const { result } = renderHook(() =>
      useValuationEngine({
        financials: DEFAULT_FINANCIALS,
        settings: DEFAULT_SETTINGS
      })
    );

    expect(result.current.decisionSourceSummary.coverage).toBe(0);
    expect(result.current.equityBase).toBeGreaterThan(0);
  });
});
