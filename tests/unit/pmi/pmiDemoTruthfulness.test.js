import { describe, expect, it } from 'vitest';

import {
  buildDemoPreviewCase,
  buildEmptyFallbackCase,
  buildTemplateCase,
  DEMO_PMI_CASE,
  normalizePersistedPmiCase
} from '../../../src/modules/pmi/store/pmiStore.jsx';

describe('PMI demo/fallback truthfulness — store normalization', () => {
  it('does not inject DEMO_PMI_CASE metrics into a persisted incomplete case', () => {
    const normalized = normalizePersistedPmiCase({
      id: 'pmi-case-1',
      dealName: 'Real persisted deal'
    });

    expect(normalized.dataSource).toBe('persisted');
    expect(normalized.isDemo).toBe(false);
    expect(normalized.hasPersistedData).toBe(true);
    expect(normalized.synergyTarget).toBe(0);
    expect(normalized.synergyCaptured).toBe(0);
    expect(normalized.workstreams).toEqual([]);
    expect(normalized.synergyTarget).not.toBe(DEMO_PMI_CASE.synergyTarget);
  });

  it('marks demo preview explicitly and keeps demo financials only in demo layer', () => {
    const demo = buildDemoPreviewCase();

    expect(demo.isDemo).toBe(true);
    expect(demo.dataSource).toBe('demo');
    expect(demo.truthfulnessStatus).toBe('demo_template');
    expect(demo.humanReviewRequired).toBe(true);
    expect(demo.synergyTarget).toBe(DEMO_PMI_CASE.synergyTarget);
  });

  it('marks template cases separately from persisted data', () => {
    const template = buildTemplateCase('industrial');

    expect(template.isTemplate).toBe(true);
    expect(template.dataSource).toBe('template');
    expect(template.hasPersistedData).toBe(false);
    expect(template.humanReviewRequired).toBe(true);
    expect(template.id).toBeUndefined();
  });

  it('marks API fallback and empty states for human review', () => {
    const empty = buildEmptyFallbackCase();
    const fallback = buildEmptyFallbackCase({ isApiFallback: true });

    expect(empty.dataSource).toBe('empty');
    expect(empty.truthfulnessStatus).toBe('insufficient_data');
    expect(fallback.dataSource).toBe('fallback');
    expect(fallback.isFallback).toBe(true);
    expect(fallback.humanReviewRequired).toBe(true);
  });

  it('accepts numeric strings on persisted cases without NaN capture rates', () => {
    const normalized = normalizePersistedPmiCase({
      id: 'pmi-case-2',
      synergyTarget: '4000000',
      synergyCaptured: '1000000'
    });

    expect(normalized.synergyTarget).toBe(4000000);
    expect(normalized.synergyCaptured).toBe(1000000);
    expect(Number.isFinite(normalized.synergyTarget)).toBe(true);
  });
});
