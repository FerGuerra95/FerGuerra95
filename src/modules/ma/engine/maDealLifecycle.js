export const CANONICAL_MA_STAGES = [
  'screening',
  'nda',
  'due-diligence',
  'ic-review',
  'negotiation',
  'closing'
];

export function isCanonicalMaStage(stageId) {
  return CANONICAL_MA_STAGES.includes(stageId);
}

export function toQualityScore(score) {
  if (score === null || score === undefined || score === '') return null;

  const parsed = Number(score);

  if (!Number.isFinite(parsed)) return null;

  return Math.max(0, Math.min(100, Math.round(parsed)));
}

export function getCanonicalStageFromScore(score) {
  if (score === null || score === undefined || score === '') return 'screening';

  const qualityScore = toQualityScore(score);

  if (qualityScore === null) return 'screening';
  if (qualityScore >= 82) return 'ic-review';
  if (qualityScore >= 68) return 'due-diligence';
  if (qualityScore >= 52) return 'nda';

  return 'screening';
}

export function getPersistedCaseStage(item) {
  const candidates = [
    item?.stage,
    item?.stageId,
    item?.snapshot?.stage,
    item?.snapshot?.stageId,
    item?.settings?.stage
  ];

  return candidates.find((value) => isCanonicalMaStage(value)) || '';
}

export function resolveDealStage({ persistedStage, qualityScore } = {}) {
  if (isCanonicalMaStage(persistedStage)) return persistedStage;

  return getCanonicalStageFromScore(qualityScore ?? null);
}

export function getSavedCaseStage(item) {
  return resolveDealStage({
    persistedStage: getPersistedCaseStage(item),
    qualityScore: toQualityScore(item?.snapshot?.qualityScore)
  });
}

export function getPhaseIndexFromStage(stageId) {
  const index = CANONICAL_MA_STAGES.indexOf(stageId);

  return index >= 0 ? index : 0;
}

export function getActivePipelinePhase({
  hasDealData,
  qualityScore,
  persistedStage
} = {}) {
  if (!hasDealData) return 0;

  return getPhaseIndexFromStage(
    resolveDealStage({
      persistedStage,
      qualityScore
    })
  );
}
