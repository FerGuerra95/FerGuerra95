const DEFAULT_METRIC_FALLBACK = 'Insufficient data';

export function safeNumber(value, fallback = 0) {
  if (value === '' || value === null || value === undefined) return fallback;

  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

export function safeRatio(numerator, denominator, fallback = 0) {
  const safeNumerator = safeNumber(numerator, 0);
  const safeDenominator = safeNumber(denominator, 0);

  if (safeDenominator === 0) return fallback;

  const ratio = safeNumerator / safeDenominator;
  return Number.isFinite(ratio) ? ratio : fallback;
}

export function safeScore(value, fallback = 0) {
  return Math.max(0, Math.min(100, Math.round(safeNumber(value, fallback))));
}

export function safePercent(value, digits = 0, fallback = DEFAULT_METRIC_FALLBACK) {
  const number = Number(value);

  if (!Number.isFinite(number)) return fallback;

  return `${number.toFixed(digits)}%`;
}

export function formatNullableMetric(value, formatter = (item) => item, fallback = DEFAULT_METRIC_FALLBACK) {
  if (value === '' || value === null || value === undefined) return fallback;

  const formatted = formatter(value);
  const text = String(formatted ?? '').trim();

  if (!text || /^(nan|undefined|null|infinity|-infinity|\[object object\])$/i.test(text)) {
    return fallback;
  }

  return text;
}

export function getMetricFallback(label = '') {
  const normalized = String(label || '').toLowerCase();

  if (normalized.includes('signal')) return 'Pending enterprise signal';
  if (normalized.includes('review')) return 'Human review required';
  if (normalized.includes('data')) return 'Pending data';

  return DEFAULT_METRIC_FALLBACK;
}
