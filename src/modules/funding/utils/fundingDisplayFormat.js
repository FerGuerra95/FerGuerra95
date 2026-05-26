/**
 * Display-only formatting for Funding dashboards and exports.
 * Does not calculate dilution — values are expected on a 0–100 percentage scale
 * (see fundingFormulas.dilutionPct). Ratios in (0, 1] are normalized for display.
 */
export function formatDilutionValue(value) {
  if (value === null || value === undefined || value === '') {
    return 'N/A';
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return 'N/A';
  }

  const normalized =
    Math.abs(parsed) > 0 && Math.abs(parsed) <= 1 ? parsed * 100 : parsed;

  return `${normalized.toFixed(1)}%`;
}
