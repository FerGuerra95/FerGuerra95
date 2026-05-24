function toNumber(value) {
  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : 0;
}

function clampScore(value) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

/** Operational DSS capture % — null when denominator ≤ 0 (aligned with backend operationalCapturePercent). */
function operationalCapturePercent(captured, denominator) {
  const cap = toNumber(captured);
  const denom = toNumber(denominator);

  if (denom <= 0) {
    return null;
  }

  return clampScore((cap / denom) * 100);
}

export function formatOperationalCapturePercent(value) {
  return value === null || value === undefined ? 'N/A' : `${value}%`;
}

function getAverageProgress(items = []) {
  if (!Array.isArray(items) || items.length === 0) return 0;

  const total = items.reduce((sum, item) => sum + toNumber(item.progress), 0);

  return clampScore(total / items.length);
}

function getHighRiskCount(risks = []) {
  if (!Array.isArray(risks)) return 0;

  return risks.filter((risk) => {
    const severity = String(risk?.severity || '').toLowerCase();

    return severity.includes('high') || severity.includes('critical');
  }).length;
}

function getOpenRiskCount(risks = []) {
  if (!Array.isArray(risks)) return 0;

  return risks.filter((risk) => {
    const status = String(risk?.status || 'open').toLowerCase();

    return status !== 'closed' && status !== 'mitigated';
  }).length;
}

function getBlockedWorkstreams(workstreams = []) {
  if (!Array.isArray(workstreams)) return [];

  return workstreams.filter((item) => {
    const risk = String(item?.risk || '').toLowerCase();
    const progress = toNumber(item?.progress);

    return risk.includes('high') || progress < 45;
  });
}

function getSafeArray(value) {
  return Array.isArray(value) ? value : [];
}

function getLedgerTotals(synergyLedger = []) {
  const items = getSafeArray(synergyLedger);
  const forecast = items.reduce((sum, item) => sum + toNumber(item?.forecast), 0);
  const captured = items.reduce((sum, item) => sum + toNumber(item?.captured), 0);
  const confidenceTotal = items.reduce((sum, item) => sum + toNumber(item?.confidence), 0);

  return {
    ledgerForecast: forecast,
    ledgerCaptured: captured,
    ledgerCaptureRate: operationalCapturePercent(captured, forecast),
    ledgerConfidenceScore: items.length > 0 ? clampScore(confidenceTotal / items.length) : 0
  };
}

function getPlaybookProgress(playbooks = []) {
  const checks = getSafeArray(playbooks).flatMap((item) => getSafeArray(item?.checklist));
  if (checks.length > 0) {
    const done = checks.filter((item) => Boolean(item?.done)).length;
    return clampScore((done / checks.length) * 100);
  }

  return getAverageProgress(playbooks);
}

function getBlockedDependencies(dependencies = []) {
  return getSafeArray(dependencies).filter((item) => {
    const status = String(item?.status || '').toLowerCase();
    const severity = String(item?.severity || '').toLowerCase();

    return status.includes('block') || severity.includes('high') || severity.includes('critical');
  });
}

export function usePMIEngine({ pmiCase }) {
  const workstreams = getSafeArray(pmiCase?.workstreams);
  const risks = getSafeArray(pmiCase?.risks);
  const milestones = getSafeArray(pmiCase?.milestones);
  const boardActions = getSafeArray(pmiCase?.boardActions);
  const synergyLedger = getSafeArray(pmiCase?.synergyLedger);
  const playbooks = getSafeArray(pmiCase?.playbooks);
  const dependencies = getSafeArray(pmiCase?.dependencies);

  const synergyTarget = toNumber(pmiCase?.synergyTarget);
  const synergyCaptured = toNumber(pmiCase?.synergyCaptured);
  const integrationBudget = toNumber(pmiCase?.integrationBudget);
  const integrationCostUsed = toNumber(pmiCase?.integrationCostUsed);

  const synergyCaptureRate = operationalCapturePercent(synergyCaptured, synergyTarget);

  const budgetUsedRate =
    integrationBudget > 0 ? clampScore((integrationCostUsed / integrationBudget) * 100) : 0;

  const workstreamProgress = getAverageProgress(workstreams);
  const milestoneProgress = getAverageProgress(milestones);
  const highRiskCount = getHighRiskCount(risks);
  const openRiskCount = getOpenRiskCount(risks);
  const blockedWorkstreams = getBlockedWorkstreams(workstreams);
  const synergyGap = Math.max(0, synergyTarget - synergyCaptured);
  const budgetRemaining = Math.max(0, integrationBudget - integrationCostUsed);
  const ledgerMetrics = getLedgerTotals(synergyLedger);
  const playbookProgress = getPlaybookProgress(playbooks);
  const blockedDependencies = getBlockedDependencies(dependencies);
  const dependencyRiskScore = clampScore(
    100 - blockedDependencies.length * 22 - dependencies.length * 3
  );
  const executionVelocity = clampScore(
    workstreamProgress * 0.45 +
      milestoneProgress * 0.35 +
      Math.max(0, 100 - blockedWorkstreams.length * 16) * 0.14 +
      dependencyRiskScore * 0.06
  );

  const integrationScore = clampScore(
    workstreamProgress * 0.24 +
      milestoneProgress * 0.18 +
      (synergyCaptureRate ?? 0) * 0.18 +
      (ledgerMetrics.ledgerCaptureRate ?? 0) * 0.12 +
      playbookProgress * 0.12 +
      dependencyRiskScore * 0.08 +
      Math.max(0, 100 - highRiskCount * 18) * 0.08
  );

  let signalTitle = 'Integration plan in progress';
  let signalPosture = 'Manage execution';
  let signalDescription =
    'La integración ya tiene workstreams, hitos, riesgos y sinergias trazadas para seguimiento ejecutivo.';

  if (integrationScore >= 82) {
    signalTitle = 'Integration on track';
    signalPosture = 'Accelerate synergy capture';
    signalDescription =
      'El plan post-cierre muestra buena ejecución, riesgos controlados y captura de sinergias avanzada.';
  } else if (integrationScore < 58 || highRiskCount > 0) {
    signalTitle = 'Integration risk requires attention';
    signalPosture = 'Prioritize risk mitigation';
    signalDescription =
      'Existen riesgos relevantes o avance insuficiente. Conviene elevar prioridades, owners y mitigantes a comité.';
  }

  return {
    workstreams,
    risks,
    milestones,
    boardActions,
    synergyLedger,
    playbooks,
    dependencies,
    synergyTarget,
    synergyCaptured,
    synergyGap,
    synergyCaptureRate,
    ...ledgerMetrics,
    playbookProgress,
    blockedDependencies,
    dependencyRiskScore,
    integrationBudget,
    integrationCostUsed,
    budgetRemaining,
    budgetUsedRate,
    workstreamProgress,
    milestoneProgress,
    highRiskCount,
    openRiskCount,
    blockedWorkstreams,
    executionVelocity,
    integrationScore,
    signalTitle,
    signalPosture,
    signalDescription
  };
}
