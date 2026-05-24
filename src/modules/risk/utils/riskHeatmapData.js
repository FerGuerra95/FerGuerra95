/**
 * Normalizes Risk heatmap payload for UI display.
 * Prefers backend-enriched `dashboard.heatmap` (operational scores from API).
 * Does not compute operationalEnterpriseRiskScore on the client.
 */

function toFiniteNumber(value) {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function normalizeRiskHeatmapData({ heatmap = [], risks = [] } = {}) {
  if (Array.isArray(heatmap) && heatmap.length > 0) {
    return heatmap.map((item) => ({
      id: item.id,
      title: item.title,
      category: item.category,
      owner: item.owner,
      status: item.status,
      likelihood: toFiniteNumber(item.likelihood),
      impact: toFiniteNumber(item.impact),
      residualScore: toFiniteNumber(item.residualScore),
      inherentScore: toFiniteNumber(item.inherentScore),
      source: 'heatmap'
    }));
  }

  if (Array.isArray(risks) && risks.length > 0) {
    return risks.map((item) => ({
      id: item.id,
      title: item.title,
      category: item.category,
      owner: item.owner,
      status: item.status,
      likelihood: toFiniteNumber(item.likelihood),
      impact: toFiniteNumber(item.impact),
      residualScore: null,
      inherentScore: null,
      source: 'risks'
    }));
  }

  return [];
}

export function goldenMatrixReference(likelihood, impact) {
  const normalizedLikelihood = toFiniteNumber(likelihood);
  const normalizedImpact = toFiniteNumber(impact);

  if (normalizedLikelihood === null || normalizedImpact === null) {
    return null;
  }

  if (normalizedLikelihood < 1 || normalizedLikelihood > 5 || normalizedImpact < 1 || normalizedImpact > 5) {
    return null;
  }

  return normalizedLikelihood * normalizedImpact;
}

export function maxOperationalScoreInCell(items = []) {
  const scores = items
    .map((item) => item.residualScore)
    .filter((value) => value !== null && value !== undefined);

  if (scores.length === 0) {
    return null;
  }

  return Math.max(...scores);
}
