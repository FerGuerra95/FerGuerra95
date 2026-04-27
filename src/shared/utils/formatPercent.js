export function formatPercent(value, digits = 0) {
  const safeValue = Number.isFinite(value) ? value : 0;
  return `${safeValue.toFixed(digits)}%`;
}
