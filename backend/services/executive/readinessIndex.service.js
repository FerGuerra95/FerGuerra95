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

function scoreFrom(moduleSummary, paths = []) {
  if (!available(moduleSummary)) return null;
  const eligibility =
    moduleSummary.data?.metrics?.executiveSignalEligible ?? moduleSummary.data?.executiveSignalEligible;
  if (eligibility === false) return null;
  for (const path of paths) {
    const value = path.split('.').reduce((current, key) => current?.[key], moduleSummary.data);
    if (value !== undefined && value !== null && Number.isFinite(Number(value))) {
      return clampScore(value);
    }
  }
  return null;
}

export function calculateExecutiveReadinessIndex(moduleSummaries = {}) {
  const scores = {
    ma: scoreFrom(moduleSummaries.ma, ['score', 'readinessScore', 'metrics.readinessScore']),
    compliance: scoreFrom(moduleSummaries.compliance, ['legalHealthScore', 'score', 'metrics.healthScore']),
    funding: scoreFrom(moduleSummaries.funding, ['readinessScore', 'capitalEfficiencyScore', 'summary.readinessScore']),
    governance: scoreFrom(moduleSummaries.governance, ['metrics.governanceReadinessScore', 'metrics.boardReadinessScore', 'governanceReadinessScore']),
    pmi: scoreFrom(moduleSummaries.pmi, ['metrics.pmiReadinessScore', 'pmiReadinessScore']),
    risk: scoreFrom(moduleSummaries.risk, ['metrics.riskReadinessScore', 'riskReadinessScore']),
    reporting: scoreFrom(moduleSummaries.reporting, ['metrics.reportingReadinessScore', 'reportingReadinessScore']),
    strategy: scoreFrom(moduleSummaries.strategy, ['metrics.strategyReadinessScore', 'strategyReadinessScore'])
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
  const insufficientModules = Object.entries(moduleSummaries)
    .filter(([, envelope]) => envelope?.status === 'insufficient_data')
    .map(([key]) => key);
  const weighted = availableScores.reduce((sum, [key, value]) => sum + value * weights[key], 0);
  const weightTotal = availableScores.reduce((sum, [key]) => sum + weights[key], 0);
  const score = weightTotal > 0 ? clampScore(weighted / weightTotal) : null;
  const confidence = clampScore((availableScores.length / Object.keys(scores).length) * 100);
  const lowScores = availableScores.filter(([, value]) => value < 65).length;
  const trend =
    availableScores.length === 0
      ? 'insufficient_data'
      : lowScores >= 3
        ? 'watch'
        : score !== null && score >= 78
          ? 'positive'
          : 'stable';

  return {
    score,
    trend,
    confidence,
    missingData,
    insufficientModules,
    dataCompleteness: confidence,
    moduleScores: scores,
    executiveSignalEligible: availableScores.length > 0 && missingData.length < Object.keys(scores).length,
    dataSource: availableScores.length === 0 ? 'empty' : missingData.length > 0 ? 'partial_operational_dss' : 'operational_dss',
    humanReviewPosture: 'human_review_required',
    humanReviewRequired: true
  };
}

export default {
  calculateExecutiveReadinessIndex,
  clampScore
};
