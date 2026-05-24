/**
 * Clamps Risk register likelihood/impact to operational/Golden matrix scale 1–5.
 */

export function clampRiskMatrixScale(value, fallback = 3) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return Math.max(1, Math.min(5, Math.round(parsed)));
}

export function prepareRiskRegisterPayload(form = {}) {
  return {
    ...form,
    likelihood: clampRiskMatrixScale(form.likelihood, 3),
    impact: clampRiskMatrixScale(form.impact, 3)
  };
}
