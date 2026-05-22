import { formatCurrency } from '../../../shared/utils/formatCurrency.js';

function formatRunwayMonthsLabel(value) {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return 'No burn / runway not meaningful';
  }

  return `${value.toFixed(1)} meses`;
}

export function buildInvestorTargets({ inputs, core, readinessScore }) {
  const targets = [];

  if (inputs.stage === 'pre-seed' || inputs.stage === 'seed') {
    targets.push({
      type: 'Angel / Seed VC',
      fit: Math.round(Math.min(92, readinessScore + 8)),
      desc: 'Perfil enfocado en velocidad de cierre, equipo fundador y narrativa de early traction.'
    });
  }

  if (inputs.currentRevenue >= 1000000 && inputs.annualGrowthRate >= 40) {
    targets.push({
      type: 'Early Growth Fund',
      fit: Math.round(Math.min(95, readinessScore + 4)),
      desc: 'Encaje razonable para fondos que buscan crecimiento con métricas ya visibles de escalado.'
    });
  }

  if (
    inputs.debtCapacity > 0 &&
    core.currentRunwayMonths !== null &&
    Number.isFinite(core.currentRunwayMonths) &&
    core.currentRunwayMonths >= 4
  ) {
    targets.push({
      type: 'Venture Debt / Revenue Financing',
      fit: Math.round(Math.min(88, readinessScore)),
      desc: 'Útil para reducir dilución si existe disciplina de caja y visibilidad mínima de ingresos.'
    });
  }

  if (targets.length === 0) {
    targets.push({
      type: 'Strategic Angels',
      fit: Math.round(readinessScore),
      desc: 'Ruta inicial recomendada para reforzar señal de mercado antes de salir a fondos más grandes.'
    });
  }

  return targets;
}

export function buildReadinessChecklist({ inputs, core, readinessLevel }) {
  return [
    {
      label: 'Narrativa de raise clara',
      status: inputs.founderMarketFit >= 70 ? 'ok' : 'attention',
      detail: 'Define problema, timing, moat y por qué esta ronda crea un salto visible en 12-18 meses.'
    },
    {
      label: 'Data room operativo',
      status: inputs.dataRoomCompletion >= 70 ? 'ok' : 'attention',
      detail: `Nivel actual de completitud: ${Math.round(inputs.dataRoomCompletion)}%.`
    },
    {
      label: 'Runway antes de salir al mercado',
      status:
        core.currentRunwayMonths !== null && Number.isFinite(core.currentRunwayMonths)
          ? core.currentRunwayMonths >= 6
            ? 'ok'
            : 'risk'
          : 'attention',
      detail:
        core.currentRunwayMonths !== null && Number.isFinite(core.currentRunwayMonths)
          ? `Runway actual estimado: ${formatRunwayMonthsLabel(core.currentRunwayMonths)}.`
          : 'Runway no significativo con burn cero o negativo.'
    },
    {
      label: 'Dilución controlada',
      status: core.dilutionPct <= 20 ? 'ok' : core.dilutionPct <= 28 ? 'attention' : 'risk',
      detail: `Dilución base estimada: ${core.dilutionPct.toFixed(1)}%.`
    },
    {
      label: 'Señal de mercado',
      status: inputs.investorInterest >= 55 ? 'ok' : 'attention',
      detail: 'Conviene tener lista corta de inversores y outreach ordenado antes de lanzar el proceso.'
    },
    {
      label: 'Readiness score global',
      status: readinessLevel.label === 'Alta' ? 'ok' : readinessLevel.label === 'Media' ? 'attention' : 'risk',
      detail: `Estado actual: ${readinessLevel.label}.`
    }
  ];
}

export function buildDataRoomChecklist(inputs) {
  const completion = inputs.dataRoomCompletion;
  return [
    { category: 'Corporate & legal', status: completion >= 45 ? 'ready' : 'missing', items: ['Cap table actualizado', 'Pactos vigentes', 'Actas societarias clave'] },
    { category: 'Finanzas', status: completion >= 55 ? 'ready' : 'missing', items: ['P&L mensual', 'Cash flow', 'Proyecciones a 24 meses'] },
    { category: 'Producto & GTM', status: completion >= 65 ? 'ready' : 'missing', items: ['Roadmap', 'KPIs comerciales', 'Métricas de conversión o pipeline'] },
    { category: 'People & operations', status: completion >= 75 ? 'ready' : 'missing', items: ['Organigrama', 'Hiring plan', 'Dependencias operativas'] }
  ];
}

export function buildFundingNarrative({ inputs, settings, derived }) {
  const currency = settings.reportCurrency;
  const summary = `${inputs.companyName} prepara una ronda de ${formatCurrency(inputs.targetRaise, currency)} sobre una valoración pre-money de ${formatCurrency(inputs.preMoneyValuation, currency)}. En escenario base, la dilución estimada es del ${derived.dilutionPct.toFixed(1)}% y el runway post-ronda es ${formatRunwayMonthsLabel(derived.runwayAfterRaiseMonths)}.`;
  const thesis = [
    `La caja actual cubre ${formatRunwayMonthsLabel(derived.currentRunwayMonths)} de runway.`,
    `La ronda objetivo extiende el runway a ${formatRunwayMonthsLabel(derived.runwayAfterRaiseMonths)}.`,
    `La preparación documental está al ${Math.round(inputs.dataRoomCompletion)}% y el readiness score se sitúa en ${Math.round(derived.readinessScore)}/100.`,
    `La dilución base estimada es del ${derived.dilutionPct.toFixed(1)}% con una valoración post-money de ${formatCurrency(derived.postMoneyValuation, currency)}.`
  ];
  return { summary, thesis };
}
