/**
 * Operational DSS test harness mirroring backend/services/pmi/pmi.service.js
 * (buildPmiSignal case capture, getLedgerTotals ledger capture).
 *
 * NOT the Golden benchmark (see pmiGoldenFormulas.js).
 * NOT imported by product code — tests and documentation only.
 */

function normalizeNumber(value, fallback = 0) {
  if (value === '' || value === null || value === undefined) return fallback;
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function clampScore(value) {
  return Math.max(0, Math.min(100, Math.round(normalizeNumber(value))));
}

/**
 * operationalPmiCaseCapture — synergyCaptured / synergyTarget (DSS case dashboard).
 * Mirrors buildPmiSignal / hub brief case capture in pmi.service.js.
 */
export function calculateOperationalPmiCaseCapture({ synergyTarget, synergyCaptured } = {}) {
  const target = normalizeNumber(synergyTarget);
  const captured = normalizeNumber(synergyCaptured);
  const captureRatePercent =
    target > 0
      ? Math.max(0, Math.min(100, Math.round((captured / target) * 100)))
      : 0;

  return {
    synergyTarget: target,
    synergyCaptured: captured,
    captureRatePercent,
    captureRateDecimal: target > 0 ? captured / target : null,
    isCalculable: target > 0,
    reason: target > 0 ? null : 'target_zero_or_invalid'
  };
}

/**
 * operationalPmiLedgerCapture — Σcaptured / Σforecast (DSS ledger view).
 * Mirrors getLedgerTotals in pmi.service.js.
 */
export function calculateOperationalPmiLedgerCapture(synergyLedger = []) {
  const items = Array.isArray(synergyLedger) ? synergyLedger : [];
  const forecast = items.reduce((sum, item) => sum + normalizeNumber(item?.forecast), 0);
  const captured = items.reduce((sum, item) => sum + normalizeNumber(item?.captured), 0);
  const captureRatePercent =
    forecast > 0 ? Math.max(0, Math.min(100, Math.round((captured / forecast) * 100))) : 0;

  return {
    ledgerForecast: forecast,
    ledgerCaptured: captured,
    captureRatePercent,
    captureRateDecimal: forecast > 0 ? captured / forecast : null,
    isCalculable: forecast > 0,
    reason: forecast > 0 ? null : 'forecast_zero_or_invalid'
  };
}

/**
 * operationalPmiEnterpriseCapture ratio only — capturedValue / targetValue aggregate.
 * Mirrors synergyCaptureRatio numerator/denominator in calculatePmiEnterpriseMetrics.
 */
export function calculateOperationalPmiEnterpriseCaptureRatio({
  synergies = [],
  cases = [],
  legacyLedger = []
} = {}) {
  const totalSynergyTarget =
    synergies.reduce((sum, item) => sum + normalizeNumber(item.targetValue), 0) ||
    cases.reduce((sum, item) => sum + normalizeNumber(item.synergyTarget), 0) ||
    legacyLedger.reduce((sum, item) => sum + normalizeNumber(item.forecast), 0);

  const capturedSynergy =
    synergies.reduce((sum, item) => sum + normalizeNumber(item.capturedValue), 0) ||
    cases.reduce((sum, item) => sum + normalizeNumber(item.synergyCaptured), 0) ||
    legacyLedger.reduce((sum, item) => sum + normalizeNumber(item.captured), 0);

  const synergyCaptureRatio =
    totalSynergyTarget > 0 ? clampScore((capturedSynergy / totalSynergyTarget) * 100) : 0;

  return {
    totalSynergyTarget,
    capturedSynergy,
    synergyCaptureRatio,
    source:
      synergies.reduce((sum, item) => sum + normalizeNumber(item.targetValue), 0) > 0
        ? 'synergies'
        : cases.reduce((sum, item) => sum + normalizeNumber(item.synergyTarget), 0) > 0
          ? 'cases'
          : legacyLedger.reduce((sum, item) => sum + normalizeNumber(item.forecast), 0) > 0
            ? 'legacyLedger'
            : 'none'
  };
}

export const operationalPmiCaseCapture = calculateOperationalPmiCaseCapture;
export const operationalPmiLedgerCapture = calculateOperationalPmiLedgerCapture;
export const operationalPmiEnterpriseCapture = calculateOperationalPmiEnterpriseCaptureRatio;
