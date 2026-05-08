export function toSafeNumber(value) {
  if (value === null || value === undefined || value === '') return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

export function classifyRunwayStatus(projectedRunwayMonths) {
  const months = toSafeNumber(projectedRunwayMonths);

  if (months === null) return 'insufficient_data';
  if (months >= 18) return 'healthy';
  if (months >= 9) return 'watch';
  return 'critical';
}

export function getRunwayStatusLabel(projectedRunwayMonths) {
  const status = classifyRunwayStatus(projectedRunwayMonths);

  if (status === 'healthy') return 'Healthy';
  if (status === 'watch') return 'Watch';
  if (status === 'critical') return 'Critical';
  return 'Insufficient data';
}

export function getDisplayText(value, fallback = 'Pending data') {
  const text = String(value ?? '').trim();
  return text || fallback;
}

export function getOptimalFundingWindowLabel(status) {
  const normalized = String(status || '').trim().toLowerCase();
  if (normalized === 'open') return 'Open';
  if (normalized === 'watch') return 'Watch';
  if (normalized === 'blocked') return 'Blocked';
  return 'Insufficient data';
}
