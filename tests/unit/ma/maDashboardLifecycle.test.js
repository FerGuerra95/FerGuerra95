import { describe, expect, it } from 'vitest';
import {
  PIPELINE_PHASES,
  getActivePipelinePhase,
  getCanonicalStageFromScore,
  getRecommendedAction
} from '../../../src/modules/ma/pages/MADashboardPage.jsx';

const savedCase = { id: 'case-1', name: 'Aurora Industrial' };

function phaseName(score, extras = {}) {
  const index = getActivePipelinePhase({
    hasDealData: true,
    qualityScore: score,
    ...extras
  });
  return PIPELINE_PHASES[index];
}

function recommendation(score, extras = {}) {
  const phaseIndex = getActivePipelinePhase({
    hasDealData: true,
    qualityScore: score,
    ...extras
  });
  return getRecommendedAction({
    score,
    latestCase: savedCase,
    phaseIndex
  });
}

describe('M&A dashboard lifecycle coherence', () => {
  it('maps quality scores to the canonical pipeline stages', () => {
    expect(getCanonicalStageFromScore(null)).toBe('screening');
    expect(getCanonicalStageFromScore(40)).toBe('screening');
    expect(getCanonicalStageFromScore(52)).toBe('nda');
    expect(getCanonicalStageFromScore(68)).toBe('due-diligence');
    expect(getCanonicalStageFromScore(73)).toBe('due-diligence');
    expect(getCanonicalStageFromScore(82)).toBe('ic-review');
  });

  it('does not treat a saved case as Close', () => {
    expect(
      getActivePipelinePhase({
        hasDealData: true,
        qualityScore: 73,
        persistedStage: undefined
      })
    ).toBe(2);
    expect(phaseName(73)).toBe('Diligence');
  });

  it('uses persisted closing stage instead of score heuristics', () => {
    expect(phaseName(73, { persistedStage: 'closing' })).toBe('Close');
    expect(recommendation(73, { persistedStage: 'closing' })).toMatch(/cierre|handoff|PMI/i);
  });

  it('early-stage case recommends data/qualification work, not CIM', () => {
    expect(phaseName(40)).toBe('Screen');
    expect(recommendation(40)).toMatch(/Reforzar datos financieros/i);
    expect(recommendation(40)).not.toMatch(/CIM/i);
  });

  it('mid-stage diligence/IC can recommend CIM presentation', () => {
    expect(phaseName(73)).toBe('Diligence');
    expect(recommendation(73)).toMatch(/CIM \/ Executive Report/i);
    expect(phaseName(82)).toBe('Structure');
    expect(recommendation(82)).toMatch(/CIM \/ Executive Report/i);
  });

  it('negotiation recommends signing work, not CIM', () => {
    expect(phaseName(90, { persistedStage: 'negotiation' })).toBe('Negotiate');
    expect(recommendation(90, { persistedStage: 'negotiation' })).toMatch(/LOI|SPA|signing/i);
    expect(recommendation(90, { persistedStage: 'negotiation' })).not.toMatch(/CIM/i);
  });

  it('closed/closing case recommends post-close handoff, not CIM', () => {
    expect(recommendation(90, { persistedStage: 'closing' })).not.toMatch(/CIM/i);
    expect(recommendation(90, { persistedStage: 'closing' })).toMatch(/cierre|handoff|PMI/i);
  });

  it('incomplete cases stay in Screen without a presentation recommendation', () => {
    expect(getActivePipelinePhase({ hasDealData: false, qualityScore: 90 })).toBe(0);
    expect(
      getRecommendedAction({ score: null, latestCase: savedCase, phaseIndex: 0 })
    ).toMatch(/datos mínimos/i);
  });
});
