// @vitest-environment jsdom

import { describe, expect, it } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useValuationEngine } from '../../../src/modules/ma/engine/useValuationEngine.js';
import {
  DEFAULT_FINANCIALS,
  DEFAULT_SETTINGS
} from '../../../src/modules/ma/engine/valuationFormulas.js';

describe('useValuationEngine', () => {
  it('calcula correctamente las métricas principales con los datos base', () => {
    const { result } = renderHook(() =>
      useValuationEngine({
        financials: DEFAULT_FINANCIALS,
        settings: DEFAULT_SETTINGS
      })
    );

    expect(result.current.normalizedEbitda).toBe(535000);
    expect(result.current.netDebt).toBe(70000);
    expect(result.current.wcAdjustment).toBe(-10000);

    expect(result.current.qualityScore).toBeCloseTo(73.295, 3);
    expect(result.current.adjustedMultiple).toBeCloseTo(6.10239, 4);

    expect(result.current.evBase).toBeCloseTo(3264778.65, 1);
    expect(result.current.equityBase).toBeCloseTo(3184778.65, 1);
    expect(result.current.netProceeds).toBeCloseTo(2440495.88, 1);
  });

  it('genera arrays de salida para sensibilidad, comparables y compradores', () => {
    const { result } = renderHook(() =>
      useValuationEngine({
        financials: DEFAULT_FINANCIALS,
        settings: DEFAULT_SETTINGS
      })
    );

    expect(Array.isArray(result.current.sensitivityMatrix)).toBe(true);
    expect(result.current.sensitivityMatrix.length).toBe(5);
    expect(result.current.sensitivityMatrix[0].length).toBe(5);

    expect(Array.isArray(result.current.comparables)).toBe(true);
    expect(result.current.comparables.length).toBe(3);

    expect(Array.isArray(result.current.buyerMatches)).toBe(true);
    expect(result.current.buyerMatches.length).toBe(3);
  });

  it('expone triangulacion DCF para control de comite', () => {
    const { result } = renderHook(() =>
      useValuationEngine({
        financials: DEFAULT_FINANCIALS,
        settings: DEFAULT_SETTINGS
      })
    );

    expect(result.current.dcfEnterpriseValue).toBeGreaterThan(0);
    expect(result.current.dcfAnnualCashFlows).toHaveLength(5);
    expect(result.current.blendedEnterpriseValue).toBeGreaterThan(0);
    expect(result.current.pretty.dcfEnterpriseValue).toContain('€');
  });


  it('genera narrativa ejecutiva y tesis de inversión', () => {
    const { result } = renderHook(() =>
      useValuationEngine({
        financials: DEFAULT_FINANCIALS,
        settings: DEFAULT_SETTINGS
      })
    );

    expect(typeof result.current.execSummary).toBe('string');
    expect(result.current.execSummary.length).toBeGreaterThan(40);

    expect(Array.isArray(result.current.thesis)).toBe(true);
    expect(result.current.thesis.length).toBeGreaterThan(0);
  });

  it('vincula conclusiones M&A con documentos de evidencia cuando existen', () => {
    const { result } = renderHook(() =>
      useValuationEngine({
        financials: DEFAULT_FINANCIALS,
        settings: {
          ...DEFAULT_SETTINGS,
          evidenceDocuments: [
            {
              id: 'doc_management_accounts',
              title: 'Management accounts',
              status: 'verified',
              sourceIds: ['ma.financials.normalizedEbitda']
            }
          ]
        }
      })
    );

    expect(Array.isArray(result.current.decisionSourcePack)).toBe(true);
    expect(result.current.decisionSourceSummary.total).toBeGreaterThan(0);
    expect(result.current.decisionSourceSummary.linked).toBeGreaterThan(0);

    const ebitdaSource = result.current.decisionSourcePack.find(
      (item) => item.sourceId === 'ma.financials.normalizedEbitda'
    );

    expect(ebitdaSource.documentCount).toBe(1);
    expect(ebitdaSource.documents[0].title).toBe('Management accounts');
  });

  it('recalcula la valoración si cambia el EBITDA', () => {
    const higherFinancials = {
      ...DEFAULT_FINANCIALS,
      reportedEbitda: '600000',
      addBacks: '100000'
    };

    const { result: baseResult } = renderHook(() =>
      useValuationEngine({
        financials: DEFAULT_FINANCIALS,
        settings: DEFAULT_SETTINGS
      })
    );

    const { result: higherResult } = renderHook(() =>
      useValuationEngine({
        financials: higherFinancials,
        settings: DEFAULT_SETTINGS
      })
    );

    expect(higherResult.current.normalizedEbitda).toBeGreaterThan(
      baseResult.current.normalizedEbitda
    );

    expect(higherResult.current.equityBase).toBeGreaterThan(
      baseResult.current.equityBase
    );
  });

  it('aplica correctamente el modo de riesgo conservador y agresivo', () => {
    const { result: conservativeResult } = renderHook(() =>
      useValuationEngine({
        financials: DEFAULT_FINANCIALS,
        settings: {
          ...DEFAULT_SETTINGS,
          riskMode: 'conservative'
        }
      })
    );

    const { result: aggressiveResult } = renderHook(() =>
      useValuationEngine({
        financials: DEFAULT_FINANCIALS,
        settings: {
          ...DEFAULT_SETTINGS,
          riskMode: 'aggressive'
        }
      })
    );

    expect(aggressiveResult.current.adjustedMultiple).toBeGreaterThan(
      conservativeResult.current.adjustedMultiple
    );

    expect(aggressiveResult.current.equityBase).toBeGreaterThan(
      conservativeResult.current.equityBase
    );
  });
});
