import { describe, expect, it } from 'vitest';

import { ENTERPRISE_MA_PIPELINE_DEALS } from '../../../src/shared/config/demoData.js';
import {
  buildPipelineDeals,
  formatPipelineUpdatedLabel,
  getPipelineSummary,
  pipelineDealExists,
  pipelineIdentitiesOverlap
} from '../../../src/modules/ma/engine/maPipelineDataset.js';

const liveFinancials = {
  name: 'Industrial Systems S.A.',
  sector: 'Industrial'
};

const liveDerived = {
  qualityScore: 73,
  equityBase: 3184778.65,
  normalizedEbitda: 425000,
  riskLevel: 'Medio'
};

const industrialSavedCase = {
  id: 'case-industrial-1',
  name: 'Industrial Systems S.A.',
  snapshot: {
    qualityScore: 73,
    equityBase: 3184778.65,
    riskLevel: 'Medio'
  },
  updatedAt: '2026-09-17T12:58:30.000Z'
};

const industrialBackendDeal = {
  id: 'deal-industrial-1',
  name: 'Industrial Systems S.A.',
  stage: 'due-diligence',
  equityValue: 3184778.65,
  qualityScore: 73,
  originalId: 'active-deal',
  payload: { originalId: 'active-deal' },
  updatedAt: '2026-05-08T00:00:00.000Z',
  priority: 'review',
  riskLevel: 'medium'
};

function countByName(deals, name) {
  return deals.filter((deal) => deal.name === name).length;
}

describe('M&A pipeline dataset integrity', () => {
  it('renders one canonical deal when demo/live/backend represent the same identity', () => {
    const deals = buildPipelineDeals({
      financials: liveFinancials,
      derived: liveDerived,
      savedCases: [industrialSavedCase],
      backendDeals: [industrialBackendDeal],
      currency: 'EUR'
    });

    const industrial = deals.filter(
      (deal) => deal.name === 'Industrial Systems S.A.'
    );

    expect(industrial).toHaveLength(1);
    expect(industrial[0].id).toBe('deal-industrial-1');
    expect(industrial[0].originalId).toBe('active-deal');
    expect(industrial[0].caseId).toBe('case-industrial-1');
    expect(industrial[0].stageId).toBe('due-diligence');
    expect(industrial[0].updatedLabel).not.toBe('Live case');
    expect(industrial[0].updatedLabel).toBe(
      formatPipelineUpdatedLabel('2026-09-17T12:58:30.000Z')
    );
  });

  it('keeps distinct same-name deals when IDs do not overlap', () => {
    const deals = buildPipelineDeals({
      financials: {},
      derived: {},
      savedCases: [],
      backendDeals: [
        {
          id: 'deal-twin-a',
          name: 'Industrial Systems S.A.',
          stage: 'nda',
          equityValue: 1000000,
          updatedAt: '2026-04-01T00:00:00.000Z'
        },
        {
          id: 'deal-twin-b',
          name: 'Industrial Systems S.A.',
          stage: 'ic-review',
          equityValue: 2000000,
          updatedAt: '2026-04-02T00:00:00.000Z'
        }
      ],
      currency: 'EUR'
    });

    expect(countByName(deals, 'Industrial Systems S.A.')).toBe(2);
    expect(deals.map((deal) => deal.id).sort()).toEqual([
      'deal-twin-a',
      'deal-twin-b'
    ]);
  });

  it('does not use display name as identity', () => {
    expect(
      pipelineIdentitiesOverlap(
        { id: 'deal-a', name: 'Industrial Systems S.A.' },
        { id: 'deal-b', name: 'Industrial Systems S.A.' }
      )
    ).toBe(false);
    expect(
      pipelineIdentitiesOverlap(
        { id: 'deal-industrial-1', originalId: 'active-deal' },
        { id: 'active-deal', source: 'live' }
      )
    ).toBe(true);
  });

  it('recomputes aggregates from the deduped dataset without double-counting equity', () => {
    const beforeDeals = [
      {
        id: 'deal-industrial-1',
        name: 'Industrial Systems S.A.',
        stageId: 'due-diligence',
        equityValue: 3184778.65,
        priorityTone: 'review'
      },
      {
        id: 'active-deal',
        name: 'Industrial Systems S.A.',
        stageId: 'due-diligence',
        equityValue: 3184778.65,
        priorityTone: 'review'
      },
      {
        id: 'demo_ma_nordic_saas_platform',
        name: 'Nordic SaaS Platform',
        stageId: 'nda',
        equityValue: 37400000,
        priorityTone: 'high'
      }
    ];

    const afterDeals = buildPipelineDeals({
      financials: liveFinancials,
      derived: liveDerived,
      savedCases: [industrialSavedCase],
      backendDeals: [
        industrialBackendDeal,
        {
          id: 'deal-nordic-1',
          name: 'Nordic SaaS Platform',
          stage: 'nda',
          equityValue: 37400000,
          originalId: 'demo_ma_nordic_saas_platform',
          payload: { originalId: 'demo_ma_nordic_saas_platform' },
          priority: 'high'
        }
      ],
      currency: 'EUR'
    });

    const beforeSummary = getPipelineSummary(beforeDeals, 'EUR');
    const afterSummary = getPipelineSummary(afterDeals, 'EUR');

    expect(beforeSummary.totalDeals).toBe(3);
    expect(beforeSummary.totalEquity).toBeCloseTo(43769557.3, 2);
    expect(afterSummary.totalDeals).toBe(2);
    expect(afterSummary.totalEquity).toBeCloseTo(40584778.65, 2);
    expect(afterSummary.activeStages).toBe(2);
    expect(afterSummary.priorityLabel).toBe('High');
    expect(afterSummary.highDealCount).toBe(1);
    expect(countByName(afterDeals, 'Industrial Systems S.A.')).toBe(1);
  });

  it('uses demo/saved fallback only when the operational pipeline is empty', () => {
    const fallbackBoard = buildPipelineDeals({
      financials: liveFinancials,
      derived: liveDerived,
      savedCases: [industrialSavedCase],
      backendDeals: [],
      currency: 'EUR'
    });
    const liveBoard = buildPipelineDeals({
      financials: liveFinancials,
      derived: liveDerived,
      savedCases: [industrialSavedCase],
      backendDeals: [industrialBackendDeal],
      currency: 'EUR'
    });

    const fallbackIndustrial = fallbackBoard.filter(
      (deal) => deal.name === 'Industrial Systems S.A.'
    );

    expect(fallbackIndustrial).toHaveLength(1);
    expect(fallbackBoard.some((deal) => deal.source === 'demo')).toBe(true);
    expect(fallbackBoard).toHaveLength(1 + ENTERPRISE_MA_PIPELINE_DEALS.length);
    expect(liveBoard.some((deal) => deal.source === 'demo')).toBe(false);
    expect(liveBoard).toHaveLength(1);
  });

  it('shows a persisted timestamp for live continuity instead of a status string', () => {
    const deals = buildPipelineDeals({
      financials: liveFinancials,
      derived: liveDerived,
      savedCases: [industrialSavedCase],
      backendDeals: [],
      currency: 'EUR'
    });
    const industrial = deals.find(
      (deal) => deal.name === 'Industrial Systems S.A.'
    );

    expect(industrial.updatedLabel).toBe(
      formatPipelineUpdatedLabel(industrialSavedCase.updatedAt)
    );
    expect(industrial.updatedLabel).not.toBe('Live case');
    expect(Number.isNaN(Date.parse(industrial.updatedAt))).toBe(false);
  });

  it('keeps quality 73 in due-diligence when no persisted closing stage exists', () => {
    const deals = buildPipelineDeals({
      financials: liveFinancials,
      derived: liveDerived,
      savedCases: [industrialSavedCase],
      backendDeals: [],
      currency: 'EUR'
    });
    const industrial = deals.find(
      (deal) => deal.name === 'Industrial Systems S.A.'
    );

    expect(industrial.stageId).toBe('due-diligence');
    expect(industrial.stageId).not.toBe('closing');
  });

  it('excludes origin=e2e rows from the board and aggregates without name matching', () => {
    const deals = buildPipelineDeals({
      financials: liveFinancials,
      derived: liveDerived,
      savedCases: [
        {
          id: 'case-e2e-1',
          name: 'Visible Operating Target',
          origin: 'e2e',
          snapshot: { qualityScore: 73, equityBase: 999999 }
        },
        industrialSavedCase
      ],
      backendDeals: [
        {
          id: 'deal-e2e-1',
          name: 'Visible Operating Target',
          stage: 'nda',
          equityValue: 500000,
          origin: 'e2e',
          payload: { origin: 'e2e' }
        },
        industrialBackendDeal
      ],
      currency: 'EUR'
    });
    const summary = getPipelineSummary(deals, 'EUR');

    expect(deals.some((deal) => deal.origin === 'e2e')).toBe(false);
    expect(deals.some((deal) => deal.id === 'deal-e2e-1')).toBe(false);
    expect(deals.some((deal) => deal.id === 'case-e2e-1')).toBe(false);
    expect(countByName(deals, 'Industrial Systems S.A.')).toBe(1);
    expect(summary.totalDeals).toBe(1);
  });

  it('does not treat a later sync candidate as existing just because the name matches', () => {
    expect(
      pipelineDealExists(
        [industrialBackendDeal],
        {
          id: 'saved-other',
          name: 'Industrial Systems S.A.',
          equityValue: 111,
          qualityScore: 10
        }
      )
    ).toBe(false);
    expect(
      pipelineDealExists([industrialBackendDeal], {
        id: 'active-deal',
        source: 'live',
        originalId: 'active-deal'
      })
    ).toBe(true);
  });
});
