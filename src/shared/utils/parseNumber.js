export function parseNumber(value, fallback = 0) {
  if (value === '' || value === null || value === undefined) return fallback;

  let normalized = String(value).trim().replace(/\s/g, '');
  const hasComma = normalized.includes(',');
  const hasDot = normalized.includes('.');

  if (hasComma && hasDot) {
    if (normalized.lastIndexOf(',') > normalized.lastIndexOf('.')) {
      normalized = normalized.replace(/\./g, '').replace(',', '.');
    } else {
      normalized = normalized.replace(/,/g, '');
    }
  } else if (hasComma) {
    normalized = normalized.replace(/\./g, '').replace(',', '.');
  } else if (hasDot) {
    const parts = normalized.split('.');
    if (parts.length > 2 || (parts.length === 2 && parts[1].length === 3)) {
      normalized = normalized.replace(/\./g, '');
    }
  }

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : fallback;
}
