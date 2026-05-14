function number(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function clampScore(value) {
  return Math.max(0, Math.min(100, Math.round(number(value))));
}

function available(moduleSummary) {
  return moduleSummary?.status === 'available' && moduleSummary.data;
}

function scoreFrom(moduleSummary, paths = [], fallback = null) {
  if (!available(moduleSummary)) return null;
  for (const path of paths) {
    const value = path.split('.').reduce((current, key) => current?.[key], moduleSummary.data);
    if (value !== undefined && value !== null && Number.isFinite(Number(value))) {
      return clampScore(value);
    }
  }
  return fallback === null ? null : clampScore(fallback);
}

export function calculateExecutiveReadinessIndex(moduleSummaries = {}) {
  const scores = {
    ma: scoreFrom(moduleSummaries.ma, ['score', 'readinessScore', 'metrics.readinessScore'], 65),
    compliance: scoreFrom(moduleSummaries.compliance, ['legalHealthScore', 'score', 'metrics.healthScore'], 60),
    funding: scoreFrom(moduleSummaries.funding, ['readinessScore', 'capitalEfficiencyScore', 'summary.readinessScore'], 58),
    governance: scoreFrom(moduleSummaries.governance, ['metrics.governanceReadinessScore', 'metrics.boardReadinessScore', 'governanceReadinessScore'], 60),
    pmi: scoreFrom(moduleSummaries.pmi, ['metrics.pmiReadinessScore', 'pmiReadinessScore'], 60),
    risk: scoreFrom(moduleSummaries.risk, ['metrics.riskReadinessScore', 'riskReadinessScore'], 62),
    reporting: scoreFrom(moduleSummaries.reporting, ['metrics.reportingReadinessScore', 'reportingReadinessScore'], 65),
    strategy: scoreFrom(moduleSummaries.strategy, ['metrics.strategyReadinessScore', 'strategyReadinessScore'], 60)
  };

  const weights = {
    ma: 0.12,
    compliance: 0.15,
    funding: 0.12,
    governance: 0.12,
    pmi: 0.1,
    risk: 0.14,
    reporting: 0.12,
    strategy: 0.13
  };
  const availableScores = Object.entries(scores).filter(([, value]) => value !== null);
  const missingData = Object.entries(scores)
    .filter(([, value]) => value === null)
    .map(([key]) => key);
  const weighted = availableScores.reduce((sum, [key, value]) => sum + value * weights[key], 0);
  const weightTotal = availableScores.reduce((sum, [key]) => sum + weights[key], 0);
  const score = weightTotal > 0 ? clampScore(weighted / weightTotal) : 0;
  const confidence = clampScore((availableScores.length / Object.keys(scores).length) * 100);
  const lowScores = availableScores.filter(([, value]) => value < 65).length;
  const trend = lowScores >= 3 ? 'watch' : score >= 78 ? 'positive' : 'stable';

  return {
    score,
    trend,
    confidence,
    missingData,
    dataCompleteness: confidence,
    moduleScores: scores,
    humanReviewPosture: 'human_review_required'
  };
}

export default {
  calculateExecutiveReadinessIndex,
  clampScore
};
