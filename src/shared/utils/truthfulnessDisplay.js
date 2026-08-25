/**
 * Display-only truthfulness helpers — do not use for business calculations or persistence.
 * C.24.14A: avoid fake zeros / 0% / 0/100 when source data is missing.
 */

export const DISPLAY_NA = 'N/A';
export const PENDING_SUPPLIER_INPUTS = 'Pending supplier inputs';
export const INSUFFICIENT_COMPLIANCE_INPUTS = 'Insufficient compliance inputs';
export const PENDING_HERITAGE_INPUTS = 'Pending inputs';

export function isFiniteNumber(value) {
  return typeof value === 'number' && Number.isFinite(value);
}

export function parseDisplayScore(value) {
  if (isFiniteNumber(value)) {
    return Math.max(0, Math.min(100, Math.round(value)));
  }

  const match = String(value ?? '').match(/-?\d+(\.\d+)?/);
  const parsed = match ? Number(match[0]) : NaN;

  if (!Number.isFinite(parsed)) {
    return null;
  }

  return Math.max(0, Math.min(100, Math.round(parsed)));
}

export function formatHeritageContinuityScore(metrics = {}, dashboard = null) {
  const raw = metrics.continuityScore ?? dashboard?.continuityScore;
  return isFiniteNumber(raw) ? raw : DISPLAY_NA;
}

export function formatHeritageBoardReadinessPercent(metrics = {}) {
  const raw = metrics.boardReadinessScore;
  return isFiniteNumber(raw) ? `${raw}%` : DISPLAY_NA;
}

export function formatHeritageMappedValue(metrics = {}, assets = []) {
  const raw = metrics.totalAssetValue;
  if (isFiniteNumber(raw)) {
    return raw;
  }

  if (!Array.isArray(assets) || assets.length === 0) {
    return null;
  }

  return null;
}

export function formatHeritageOpenSuccessionCount(metrics = {}) {
  const raw = metrics.openSuccessionItemsCount;
  return isFiniteNumber(raw) ? raw : DISPLAY_NA;
}

/**
 * @param {{ suppliers: unknown[], dashboardCards: Array<{ value?: unknown }>, openAlerts: number }} input
 */
export function buildComplianceDashboardKpiDisplay({ suppliers, dashboardCards, openAlerts }) {
  const safeSuppliers = Array.isArray(suppliers) ? suppliers : [];
  const cards = Array.isArray(dashboardCards) ? dashboardCards : [];
  const hasSupplierBase = safeSuppliers.length > 0;

  const supplierCount = hasSupplierBase
    ? (cards[0]?.value ?? safeSuppliers.length)
    : safeSuppliers.length;

  const rawRisk = cards[1]?.value;
  const rawEvidence = cards[3]?.value;
  const alertValue = cards[2]?.value ?? openAlerts;

  if (!hasSupplierBase) {
    return {
      hasSupplierBase,
      supplierCount,
      riskValueDisplay: PENDING_SUPPLIER_INPUTS,
      evidenceValueDisplay: INSUFFICIENT_COMPLIANCE_INPUTS,
      alertValue,
      riskScoreForSignal: null,
      evidenceCoverageForSignal: null
    };
  }

  const riskScoreForSignal = parseDisplayScore(rawRisk);
  const evidenceCoverageForSignal = parseDisplayScore(rawEvidence);

  return {
    hasSupplierBase,
    supplierCount,
    riskValueDisplay:
      riskScoreForSignal !== null ? `${riskScoreForSignal}/100` : DISPLAY_NA,
    evidenceValueDisplay:
      evidenceCoverageForSignal !== null ? `${evidenceCoverageForSignal}%` : DISPLAY_NA,
    alertValue,
    riskScoreForSignal,
    evidenceCoverageForSignal
  };
}
