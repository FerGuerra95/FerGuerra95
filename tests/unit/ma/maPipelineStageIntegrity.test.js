import { describe, expect, it } from 'vitest';

import {
  CANONICAL_MA_STAGES,
  getActivePipelinePhase,
  getCanonicalStageFromScore,
  getSavedCaseStage,
  resolveDealStage
} from '../../../src/modules/ma/engine/maDealLifecycle.js';
import { PIPELINE_PHASES } from '../../../src/modules/ma/pages/MADashboardPage.jsx';
import { buildPipelineDeals } from '../../../src/modules/ma/pages/DealPipelinePage.jsx';

const backendAnchor = [
  {
    id: 'server-anchor',
    name: 'Server Anchor',
    stage: 'nda',
    equityValue: 1
  }
];

describe('M&A pipeline stage integrity', () => {
  it('maps persisted closing and due-diligence without using list index', () => {
    expect(
      getSavedCaseStage({
        id: 'close-1',
        name: 'Closed target',
        stage: 'closing',
        snapshot: { qualityScore: 40 }
      })
    ).toBe('closing');
    expect(
      getSavedCaseStage({
        id: 'dd-1',
        name: 'Diligence target',
        snapshot: {
          stage: 'due-diligence',
          qualityScore: 40
        }
      })
    ).toBe('due-diligence');
    expect(PIPELINE_PHASES[getActivePipelinePhase({
      hasDealData: true,
      qualityScore: 40,
      persistedStage: 'closing'
    })]).toBe('Close');
    expect(PIPELINE_PHASES[getActivePipelinePhase({
      hasDealData: true,
      qualityScore: 40,
      persistedStage: 'due-diligence'
    })]).toBe('Diligence');
  });

  it('does not invent closing from array position when stage is unset', () => {
    const savedCases = [
      { id: 'saved-a', name: 'Saved Alpha', snapshot: { qualityScore: 40 } },
      { id: 'saved-b', name: 'Saved Bravo', snapshot: { qualityScore: 40 } },
      { id: 'saved-c', name: 'Saved Charlie', snapshot: { qualityScore: 40 } },
      { id: 'saved-d', name: 'Saved Delta', snapshot: { qualityScore: 40 } },
      { id: 'saved-e', name: 'Saved Echo', snapshot: { qualityScore: 40 } },
      { id: 'saved-f', name: 'Saved Foxtrot', snapshot: { qualityScore: 40 } }
    ];

    expect(savedCases.map((item) => getSavedCaseStage(item))).toEqual(
      Array(6).fill('screening')
    );

    const deals = buildPipelineDeals({
      financials: {},
      derived: {},
      savedCases,
      backendDeals: backendAnchor,
      currency: 'EUR'
    });
    const savedDeals = deals.filter((deal) => deal.id.startsWith('saved-'));

    expect(savedDeals).toHaveLength(6);
    expect(savedDeals.map((deal) => deal.stageId)).toEqual(Array(6).fill('screening'));
    expect(savedDeals.some((deal) => deal.stageId === 'closing')).toBe(false);
  });

  it('keeps the same canonical stage across dashboard, pipeline and detail helpers', () => {
    const savedCase = {
      id: 'case-consistency',
      name: 'Aurora Industrial',
      snapshot: {
        qualityScore: 73
      }
    };
    const stageId = getSavedCaseStage(savedCase);

    expect(stageId).toBe('due-diligence');
    expect(getCanonicalStageFromScore(73)).toBe('due-diligence');
    expect(
      resolveDealStage({
        qualityScore: 73
      })
    ).toBe('due-diligence');
    expect(
      CANONICAL_MA_STAGES[
        getActivePipelinePhase({
          hasDealData: true,
          qualityScore: 73
        })
      ]
    ).toBe('due-diligence');
    expect(
      PIPELINE_PHASES[
        getActivePipelinePhase({
          hasDealData: true,
          qualityScore: 73
        })
      ]
    ).toBe('Diligence');
  });

  it('never maps a quality score to negotiation or closing', () => {
    [null, 0, 40, 51, 52, 67, 68, 81, 82, 100].forEach((score) => {
      expect(['negotiation', 'closing']).not.toContain(
        getCanonicalStageFromScore(score)
      );
    });
  });
});
