/**
 * Pure Bridge benchmark/oracle helpers aligned to Golden Dataset BRIDGE_PRIORITY.
 * Not the product operational priority model (see calculateSignalPriority in bridge.service.js).
 */

const DEFAULT_WEIGHTS = {
  impact: 0.5,
  urgency: 0.3,
  confidence: 0.2
};

function toFiniteNumber(value) {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function requireFiniteNumbers(values) {
  const parsed = values.map((value) => toFiniteNumber(value));

  if (parsed.some((value) => value === null)) {
    return null;
  }

  return parsed;
}

function clampScore(value) {
  return Math.max(0, Math.min(100, value));
}

export function calculateBridgePriorityGolden({
  impact,
  urgency,
  confidence,
  weights = DEFAULT_WEIGHTS
} = {}) {
  const numbers = requireFiniteNumbers([impact, urgency, confidence]);

  if (!numbers) {
    return null;
  }

  const [normalizedImpact, normalizedUrgency, normalizedConfidence] = numbers;
  const impactWeight = toFiniteNumber(weights?.impact) ?? DEFAULT_WEIGHTS.impact;
  const urgencyWeight = toFiniteNumber(weights?.urgency) ?? DEFAULT_WEIGHTS.urgency;
  const confidenceWeight = toFiniteNumber(weights?.confidence) ?? DEFAULT_WEIGHTS.confidence;

  if ([impactWeight, urgencyWeight, confidenceWeight].some((value) => value === null)) {
    return null;
  }

  const priorityScore =
    normalizedImpact * impactWeight +
    normalizedUrgency * urgencyWeight +
    normalizedConfidence * confidenceWeight;

  return clampScore(priorityScore);
}

export default calculateBridgePriorityGolden;
