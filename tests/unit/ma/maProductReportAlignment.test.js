// @vitest-environment jsdom

import { describe, expect, it } from 'vitest';
import { renderHook } from '@testing-library/react';

import { useValuationEngine } from '../../../src/modules/ma/engine/useValuationEngine.js';
import {
  DEFAULT_FINANCIALS,
  DEFAULT_SETTINGS
} from '../../../src/modules/ma/engine/valuationFormulas.js';
import { calculateSimpleEnterpriseValue } from '../../../src/modules/ma/engine/maGoldenFormulas.js';
import formatMAReportData from '../../../src/modules/ma/utils/formatMAReportData.js';
import buildMAReportHtml from '../../../src/modules/ma/utils/buildMAReportHtml.js';

function buildEngineDerived(financials = DEFAULT_FINANCIALS, settings = DEFAULT_SETTINGS) {
  const { result } = renderHook(() =>
    useValuationEngine({
      financials,
      settings
    })
  );

  return result.current;
}

function buildReportFromDerived(derived, overrides = {}) {
  return formatMAReportData({
    financials: DEFAULT_FINANCIALS,
    settings: DEFAULT_SETTINGS,
    derived,
    reportStatus: 'Controlled Draft',
    ...overrides
  });
}

/**
 * Policy mirror for live export vs saved snapshot re-export (C.13.4B / C.13.4D).
 * Not exported from product — documents expected source selection only.
 */
function resolveReportSource({ liveDerived, savedSnapshot, mode = 'live' }) {
  if (mode === 'live') {
    return {
      evBase: liveDerived.evBase,
      equityBase: liveDerived.equityBase,
      netProceeds: liveDerived.netProceeds,
      netDebt: liveDerived.netDebt
    };
  }

  if (mode === 'snapshot') {
    return {
      evBase: savedSnapshot.evBase,
      equityBase: savedSnapshot.equityBase,
      netProceeds: savedSnapshot.netProceeds,
      netDebt: savedSnapshot.netDebt
    };
  }

  throw new Error(`Unknown report source mode: ${mode}`);
}

function assertFiniteMetric(value, label) {
  expect(Number.isFinite(Number(value)), `${label} must be finite`).toBe(true);
}

describe('maProductReportAlignment — formatMAReportData preserves engine derived', () => {
  it('anchors adjusted EV, equity, net proceeds and net debt to useValuationEngine output', () => {
    const derived = buildEngineDerived();
    const report = buildReportFromDerived(derived);

    expect(report.enterpriseValue.base).toBeCloseTo(derived.evBase, 6);
    expect(report.equityValue.base).toBeCloseTo(derived.equityBase, 6);
    expect(report.summary.enterpriseValueBase).toBeCloseTo(derived.evBase, 6);
    expect(report.summary.equityValueBase).toBeCloseTo(derived.equityBase, 6);
    expect(report.summary.netProceeds).toBeCloseTo(derived.netProceeds, 6);

    const netDebtRow = report.financialInputs.find((row) => row.label === 'Net Debt');
    expect(netDebtRow?.value).toBeCloseTo(derived.netDebt, 6);
  });

  it('preserves extended adjusted metrics when present on derived', () => {
    const derived = buildEngineDerived();

    expect(Number.isFinite(Number(derived.dcfEnterpriseValue))).toBe(true);
    expect(Number.isFinite(Number(derived.blendedEnterpriseValue))).toBe(true);
    expect(Number.isFinite(Number(derived.wcAdjustment))).toBe(true);

    const report = buildReportFromDerived(derived);

    assertFiniteMetric(report.summary.enterpriseValueBase, 'enterpriseValueBase');
    assertFiniteMetric(report.summary.equityValueBase, 'equityValueBase');
    assertFiniteMetric(report.summary.netProceeds, 'netProceeds');
    assertFiniteMetric(report.enterpriseValue.base, 'enterpriseValue.base');
    assertFiniteMetric(report.equityValue.base, 'equityValue.base');
  });

  it('does not substitute Golden simple EV for adjusted report enterprise value', () => {
    const derived = buildEngineDerived();
    const report = buildReportFromDerived(derived);

    const goldenSimpleEv = calculateSimpleEnterpriseValue({
      ebitda: 2_000_000,
      multiple: 7
    });

    expect(goldenSimpleEv).toBe(14_000_000);
    expect(report.enterpriseValue.base).toBeCloseTo(derived.evBase, 6);
    expect(report.enterpriseValue.base).not.toBe(goldenSimpleEv);
    expect(Math.abs(report.enterpriseValue.base - goldenSimpleEv)).toBeGreaterThan(1_000_000);
  });
});

describe('maProductReportAlignment — report HTML DSS disclaimers', () => {
  it('includes decision-support and anti-fairness-opinion language in HTML output', () => {
    const derived = buildEngineDerived();
    const reportData = buildReportFromDerived(derived);
    const html = buildMAReportHtml(reportData);
    const normalizedHtml = html.toLowerCase();

    expect(normalizedHtml).toMatch(/fairness opinion/);
    expect(normalizedHtml).toMatch(/human review/);
    expect(normalizedHtml).toMatch(/decision-support|decision support/);
    expect(normalizedHtml).toMatch(/indicative/);
    expect(reportData.disclaimer.toLowerCase()).toMatch(/fairness opinion/);
  });
});

describe('maProductReportAlignment — Golden simple vs product adjusted (expected divergence)', () => {
  it('documents that product adjusted EV differs from Golden simple benchmark by design', () => {
    const derived = buildEngineDerived({
      ...DEFAULT_FINANCIALS,
      reportedEbitda: '2000000',
      addBacks: '0'
    });

    const goldenSimpleEv = calculateSimpleEnterpriseValue({
      ebitda: 2_000_000,
      multiple: 7
    });

    expect(goldenSimpleEv).toBe(14_000_000);
    expect(derived.evBase).not.toBe(goldenSimpleEv);
    expect(derived.evBase).toBeLessThan(goldenSimpleEv);
  });
});

describe('maProductReportAlignment — live engine vs saved snapshot policy mirror', () => {
  const liveDerived = {
    evBase: 10_000_000,
    equityBase: 8_000_000,
    netProceeds: 7_000_000,
    netDebt: 2_000_000
  };

  const savedSnapshot = {
    evBase: 6_000_000,
    equityBase: 5_000_000,
    netProceeds: 4_000_000,
    netDebt: 1_000_000
  };

  it('uses live engine values for live export mode', () => {
    const source = resolveReportSource({ liveDerived, savedSnapshot, mode: 'live' });

    expect(source.evBase).toBe(liveDerived.evBase);
    expect(source.equityBase).toBe(liveDerived.equityBase);
    expect(source.netProceeds).toBe(liveDerived.netProceeds);
    expect(source.netDebt).toBe(liveDerived.netDebt);
  });

  it('preserves saved snapshot values for snapshot re-export mode', () => {
    const source = resolveReportSource({
      liveDerived,
      savedSnapshot,
      mode: 'snapshot'
    });

    expect(source.evBase).toBe(savedSnapshot.evBase);
    expect(source.equityBase).toBe(savedSnapshot.equityBase);
    expect(source.netProceeds).toBe(savedSnapshot.netProceeds);
    expect(source.netDebt).toBe(savedSnapshot.netDebt);
    expect(source.evBase).not.toBe(liveDerived.evBase);
  });

  it('does not silently merge snapshot with live engine in policy mirror', () => {
    const liveSource = resolveReportSource({ liveDerived, savedSnapshot, mode: 'live' });
    const snapshotSource = resolveReportSource({
      liveDerived,
      savedSnapshot,
      mode: 'snapshot'
    });

    expect(liveSource).not.toEqual(snapshotSource);
  });
});

describe('maProductReportAlignment — netProceeds fallback behavior (documented GAP if misleading)', () => {
  it('uses derived.netProceeds when present', () => {
    const derived = buildEngineDerived();
    const report = buildReportFromDerived(derived);

    expect(report.summary.netProceeds).toBeCloseTo(derived.netProceeds, 6);
    expect(report.summary.netProceeds).not.toBeCloseTo(derived.equityBase, 6);
  });

  it('falls back to equityBase when derived.netProceeds is missing (current behavior — GAP C.13.4G candidate)', () => {
    const derived = buildEngineDerived();
    const { netProceeds: _removed, ...derivedWithoutNetProceeds } = derived;

    const report = buildReportFromDerived(derivedWithoutNetProceeds);

    expect(report.summary.netProceeds).toBeCloseTo(derived.equityBase, 6);
    expect(report.summary.netProceeds).not.toBeCloseTo(derived.netProceeds, 6);
  });
});

describe('maProductReportAlignment — finite metrics and HTML safety', () => {
  it('keeps primary report metrics finite', () => {
    const derived = buildEngineDerived();
    const report = buildReportFromDerived(derived);

    const numericFields = [
      report.summary.enterpriseValueBase,
      report.summary.equityValueBase,
      report.summary.netProceeds,
      report.enterpriseValue.base,
      report.equityValue.base,
      report.enterpriseValue.low,
      report.enterpriseValue.high
    ];

    for (const value of numericFields) {
      assertFiniteMetric(value, 'report metric');
    }
  });

  it('does not render NaN, Infinity or sentinel 999 in HTML output', () => {
    const derived = buildEngineDerived();
    const reportData = buildReportFromDerived(derived);
    const html = buildMAReportHtml(reportData);

    expect(html).not.toMatch(/\bNaN\b/i);
    expect(html).not.toMatch(/\bInfinity\b/i);
    expect(html).not.toMatch(/\b999\b/);
  });
});
