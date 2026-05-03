function toNumber(value) {
  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : 0;
}

function clampScore(value) {
  return Math.max(0, Math.min(100, Math.round(value)));
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

export function usePMIEngine({ pmiCase }) {
  const workstreams = Array.isArray(pmiCase?.workstreams)
    ? pmiCase.workstreams
    : [];
  const risks = Array.isArray(pmiCase?.risks)
    ? pmiCase.risks
    : [];
  const milestones = Array.isArray(pmiCase?.milestones)
    ? pmiCase.milestones
    : [];
  const boardActions = Array.isArray(pmiCase?.boardActions)
    ? pmiCase.boardActions
    : [];

  const synergyTarget = toNumber(pmiCase?.synergyTarget);
  const synergyCaptured = toNumber(pmiCase?.synergyCaptured);
  const integrationBudget = toNumber(pmiCase?.integrationBudget);
  const integrationCostUsed = toNumber(pmiCase?.integrationCostUsed);

  const synergyCaptureRate =
    synergyTarget > 0 ? clampScore((synergyCaptured / synergyTarget) * 100) : 0;

  const budgetUsedRate =
    integrationBudget > 0 ? clampScore((integrationCostUsed / integrationBudget) * 100) : 0;

  const workstreamProgress = getAverageProgress(workstreams);
  const milestoneProgress = getAverageProgress(milestones);
  const highRiskCount = getHighRiskCount(risks);

  const integrationScore = clampScore(
    workstreamProgress * 0.34 +
      milestoneProgress * 0.26 +
      synergyCaptureRate * 0.26 +
      Math.max(0, 100 - highRiskCount * 18) * 0.14
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
    synergyTarget,
    synergyCaptured,
    synergyCaptureRate,
    integrationBudget,
    integrationCostUsed,
    budgetUsedRate,
    workstreamProgress,
    milestoneProgress,
    highRiskCount,
    integrationScore,
    signalTitle,
    signalPosture,
    signalDescription
  };
}
