import React from 'react';
import {
  Activity,
  Banknote,
  CheckCircle2,
  Clock3,
  Gauge,
  LineChart,
  PieChart,
  ShieldAlert,
  Target,
  TrendingUp
} from 'lucide-react';
import { Card } from '../../../shared/components/ui/Card.jsx';
import { Badge } from '../../../shared/components/ui/Badge.jsx';
import { useFundingStore } from '../store/fundingStore.jsx';
import { useFundingEngine } from '../engine/useFundingEngine.js';
import { ScenarioTable } from '../components/ScenarioTable.jsx';
import { formatCurrency } from '../../../shared/utils/formatCurrency.js';

const fundraisingScenariosCss = `
  .fundraising-page {
    width: min(1540px, 100%);
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 28px;
  }

  .fundraising-hero {
    position: relative;
    overflow: hidden;
    border-radius: 34px;
    padding: 34px;
    border: 1px solid rgba(148, 163, 184, 0.18);
    background:
      radial-gradient(circle at 8% 2%, rgba(37, 99, 235, 0.34), transparent 30%),
      radial-gradient(circle at 88% 8%, rgba(16, 185, 129, 0.16), transparent 27%),
      linear-gradient(135deg, rgba(2, 6, 23, 0.99), rgba(15, 23, 42, 0.97));
    box-shadow:
      0 34px 100px rgba(0, 0, 0, 0.38),
      inset 0 1px 0 rgba(255, 255, 255, 0.055);
  }

  .fundraising-hero::before {
    content: "";
    position: absolute;
    inset: 0;
    background:
      linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
    background-size: 50px 50px;
    mask-image: linear-gradient(to bottom, rgba(0,0,0,0.9), transparent 82%);
    pointer-events: none;
  }

  .fundraising-hero-inner {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: minmax(0, 1.35fr) minmax(320px, 0.65fr);
    gap: 28px;
    align-items: stretch;
  }

  .fundraising-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 22px;
  }

  .fundraising-title {
    margin: 0;
    max-width: 920px;
    font-size: clamp(38px, 4.8vw, 66px);
    line-height: 0.94;
    letter-spacing: -0.07em;
  }

  .fundraising-title span {
    display: block;
    margin-top: 8px;
    color: rgba(226, 232, 240, 0.7);
  }

  .fundraising-copy {
    max-width: 820px;
    margin: 24px 0 0;
    font-size: 16px;
    line-height: 1.78;
    color: rgba(203, 213, 225, 0.86);
  }

  .fundraising-command-bar {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;
    margin-top: 30px;
    padding-top: 24px;
    border-top: 1px solid rgba(148, 163, 184, 0.16);
  }

  .fundraising-command-item {
    padding: 17px;
    border-radius: 21px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.078);
    min-width: 0;
  }

  .fundraising-command-item strong {
    display: block;
    margin-top: 8px;
    line-height: 1.25;
    overflow-wrap: anywhere;
  }

  .fundraising-signal-card {
    position: relative;
    border-radius: 30px;
    padding: 24px;
    background:
      linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.025)),
      rgba(15, 23, 42, 0.76);
    border: 1px solid rgba(148, 163, 184, 0.2);
    box-shadow:
      0 26px 70px rgba(0, 0, 0, 0.24),
      inset 0 1px 0 rgba(255,255,255,0.05);
  }

  .fundraising-signal-top {
    display: flex;
    justify-content: space-between;
    gap: 18px;
    align-items: flex-start;
    margin-bottom: 22px;
  }

  .fundraising-icon-box,
  .fundraising-card-icon {
    flex: 0 0 auto;
    display: grid;
    place-items: center;
    border-radius: 18px;
    background: rgba(37, 99, 235, 0.16);
    border: 1px solid rgba(96, 165, 250, 0.24);
  }

  .fundraising-icon-box {
    width: 50px;
    height: 50px;
  }

  .fundraising-card-icon {
    width: 44px;
    height: 44px;
  }

  .fundraising-signal-title {
    margin-top: 10px;
    font-size: 23px;
    line-height: 1.16;
    letter-spacing: -0.04em;
  }

  .fundraising-score-box {
    padding: 20px;
    border-radius: 24px;
    background: rgba(255,255,255,0.045);
    border: 1px solid rgba(255,255,255,0.08);
  }

  .fundraising-score-box strong {
    display: block;
    margin-bottom: 8px;
  }

  .fundraising-score-box p {
    margin: 0;
    line-height: 1.62;
  }

  .fundraising-signal-row {
    display: grid;
    grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
    gap: 14px;
    align-items: center;
    padding: 14px 0;
    border-top: 1px solid rgba(148, 163, 184, 0.14);
  }

  .fundraising-signal-row strong {
    text-align: right;
    overflow-wrap: anywhere;
  }

  .fundraising-section {
    display: flex;
    flex-direction: column;
    gap: 22px;
  }

  .fundraising-section-header {
    display: flex;
    justify-content: space-between;
    gap: 24px;
    align-items: flex-end;
  }

  .fundraising-kicker {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 11px;
    font-size: 11px;
    line-height: 1;
    text-transform: uppercase;
    letter-spacing: 0.17em;
    color: rgba(148, 163, 184, 0.96);
  }

  .fundraising-section-header h2,
  .fundraising-section-header h3 {
    margin: 0;
    letter-spacing: -0.045em;
  }

  .fundraising-section-header p {
    max-width: 820px;
    margin: 10px 0 0;
    line-height: 1.66;
  }

  .fundraising-grid {
    display: grid;
    gap: 22px;
    align-items: stretch;
  }

  .fundraising-grid-kpis {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .fundraising-grid-two {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .fundraising-grid-three {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .fundraising-kpi-card,
  .fundraising-panel,
  .fundraising-mini-card {
    width: 100%;
    height: 100%;
    border-radius: 29px;
    border: 1px solid rgba(148, 163, 184, 0.16);
    background:
      linear-gradient(135deg, rgba(255,255,255,0.064), rgba(255,255,255,0.022)),
      rgba(15, 23, 42, 0.64);
    box-shadow:
      0 22px 64px rgba(0, 0, 0, 0.2),
      inset 0 1px 0 rgba(255,255,255,0.035);
  }

  .fundraising-kpi-card {
    min-height: 178px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 18px;
    transition:
      transform .18s ease,
      border-color .18s ease,
      background .18s ease;
  }

  .fundraising-kpi-card:hover,
  .fundraising-mini-card:hover {
    transform: translateY(-3px);
    border-color: rgba(96, 165, 250, 0.25);
    background:
      linear-gradient(135deg, rgba(255,255,255,0.078), rgba(255,255,255,0.03)),
      rgba(15, 23, 42, 0.78);
  }

  .fundraising-kpi-top {
    display: flex;
    justify-content: space-between;
    gap: 18px;
    align-items: flex-start;
  }

  .fundraising-kpi-value {
    margin-top: 11px;
    font-size: 24px;
    font-weight: 790;
    line-height: 1.12;
    letter-spacing: -0.045em;
    overflow-wrap: anywhere;
  }

  .fundraising-kpi-card p {
    margin: 0;
    line-height: 1.54;
  }

  .fundraising-panel {
    padding: 28px;
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  .fundraising-panel-head {
    display: flex;
    justify-content: space-between;
    gap: 22px;
    align-items: flex-start;
  }

  .fundraising-panel-head h3 {
    margin: 0;
    letter-spacing: -0.045em;
  }

  .fundraising-panel-head p {
    margin: 10px 0 0;
    line-height: 1.62;
  }

  .fundraising-stack {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .fundraising-mini-card {
    padding: 20px;
    transition:
      transform .18s ease,
      border-color .18s ease,
      background .18s ease;
  }

  .fundraising-mini-card strong {
    display: block;
    margin-bottom: 8px;
  }

  .fundraising-mini-card p {
    margin: 0;
    line-height: 1.62;
  }

  .fundraising-table-panel {
    padding: 28px;
    border-radius: 29px;
    border: 1px solid rgba(148, 163, 184, 0.16);
    background:
      linear-gradient(135deg, rgba(255,255,255,0.064), rgba(255,255,255,0.022)),
      rgba(15, 23, 42, 0.64);
    box-shadow:
      0 22px 64px rgba(0, 0, 0, 0.2),
      inset 0 1px 0 rgba(255,255,255,0.035);
  }

  .fundraising-muted-tight {
    margin-bottom: 0;
  }

  @media (max-width: 1180px) {
    .fundraising-hero-inner,
    .fundraising-grid-two {
      grid-template-columns: 1fr;
    }

    .fundraising-grid-kpis,
    .fundraising-grid-three {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 920px) {
    .fundraising-command-bar {
      grid-template-columns: 1fr;
    }

    .fundraising-section-header {
      align-items: flex-start;
      flex-direction: column;
    }
  }

  @media (max-width: 680px) {
    .fundraising-page {
      gap: 24px;
    }

    .fundraising-hero {
      padding: 24px;
      border-radius: 26px;
    }

    .fundraising-grid-kpis,
    .fundraising-grid-three {
      grid-template-columns: 1fr;
    }

    .fundraising-kpi-card,
    .fundraising-panel,
    .fundraising-mini-card,
    .fundraising-table-panel {
      border-radius: 23px;
    }

    .fundraising-signal-row {
      grid-template-columns: 1fr;
      gap: 6px;
    }

    .fundraising-signal-row strong {
      text-align: left;
    }
  }
`;

function toNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function getSafeArray(value) {
  return Array.isArray(value) ? value : [];
}

function calculateRunwayMonths({ currentCash, raiseAmount, monthlyBurn }) {
  if (monthlyBurn <= 0) return 0;
  return Math.round((currentCash + raiseAmount) / monthlyBurn);
}

function calculateDilution({ raiseAmount, preMoneyValuation }) {
  const postMoney = preMoneyValuation + raiseAmount;

  if (postMoney <= 0) return 0;

  return (raiseAmount / postMoney) * 100;
}

function getScenarioSignal({ targetRaise, baseRunway, baseDilution }) {
  if (targetRaise <= 0) {
    return {
      title: 'Scenario model pending',
      posture: 'Build scenarios',
      description:
        'Completa capital objetivo, valoración, caja y burn para modelizar escenarios low, base y high.'
    };
  }

  if (baseRunway >= 18 && baseDilution <= 20) {
    return {
      title: 'Healthy base scenario',
      posture: 'Present base case',
      description:
        'El escenario base ofrece runway razonable y dilución contenida para defender la ronda.'
    };
  }

  if (baseRunway >= 12 && baseDilution <= 30) {
    return {
      title: 'Workable base scenario',
      posture: 'Refine terms',
      description:
        'El escenario base es viable, aunque conviene revisar valoración, burn o tamaño de ronda.'
    };
  }

  if (baseRunway < 12) {
    return {
      title: 'Runway pressure detected',
      posture: 'Increase runway',
      description:
        'La ronda puede dejar poco margen operativo. Revisa capital objetivo, burn mensual o plan de ejecución.'
    };
  }

  return {
    title: 'Dilution pressure detected',
    posture: 'Review valuation',
    description:
      'La estructura puede generar una dilución elevada. Revisa pre-money, tamaño de ronda o alternativas de financiación.'
  };
}

function CommandItem({ label, value }) {
  return (
    <div className="fundraising-command-item">
      <div className="kpi-label">{label}</div>
      <strong>{value}</strong>
    </div>
  );
}

function SignalRow({ label, value }) {
  return (
    <div className="fundraising-signal-row">
      <span className="muted">{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function SectionHeader({ kicker, icon: Icon, title, description, right }) {
  return (
    <div className="fundraising-section-header">
      <div>
        <div className="fundraising-kicker">
          <Icon size={14} />
          {kicker}
        </div>

        <h2>{title}</h2>

        <p className="muted">{description}</p>
      </div>

      {right ? <div>{right}</div> : null}
    </div>
  );
}

function KpiCard({ label, value, description, icon: Icon, color = '' }) {
  return (
    <article className="fundraising-kpi-card">
      <div className="fundraising-kpi-top">
        <div>
          <div className="kpi-label">{label}</div>
          <div className={`fundraising-kpi-value ${color}`.trim()}>
            {value}
          </div>
        </div>

        <div className="fundraising-card-icon">
          <Icon size={18} />
        </div>
      </div>

      <p className="muted">{description}</p>
    </article>
  );
}

function MiniCard({ title, text }) {
  return (
    <div className="fundraising-mini-card">
      <strong>{title}</strong>
      <p className="muted">{text}</p>
    </div>
  );
}

export function FundraisingScenariosPage() {
  const { fundingInputs, fundingSettings } = useFundingStore();

  const derived = useFundingEngine({
    fundingInputs,
    fundingSettings
  });

  const currency = fundingSettings?.reportCurrency || 'EUR';

  const currentCash = toNumber(fundingInputs.currentCash);
  const targetRaise = toNumber(fundingInputs.targetRaise);
  const monthlyBurn = toNumber(fundingInputs.monthlyBurn);
  const preMoneyValuation = toNumber(fundingInputs.preMoneyValuation);
  const companyName = fundingInputs?.companyName?.trim() || 'Sin compañía activa';
  const stage = fundingInputs?.stage || 'Seed';

  const lowCaseRaise = targetRaise * 0.75;
  const baseCaseRaise = targetRaise;
  const highCaseRaise = targetRaise * 1.25;

  const baseRunway = calculateRunwayMonths({
    currentCash,
    raiseAmount: baseCaseRaise,
    monthlyBurn
  });

  const baseDilution = calculateDilution({
    raiseAmount: baseCaseRaise,
    preMoneyValuation
  });

  const lowRunway = calculateRunwayMonths({
    currentCash,
    raiseAmount: lowCaseRaise,
    monthlyBurn
  });

  const highRunway = calculateRunwayMonths({
    currentCash,
    raiseAmount: highCaseRaise,
    monthlyBurn
  });

  const lowDilution = calculateDilution({
    raiseAmount: lowCaseRaise,
    preMoneyValuation
  });

  const highDilution = calculateDilution({
    raiseAmount: highCaseRaise,
    preMoneyValuation
  });

  const scenarioRows = getSafeArray(derived.scenarioRows);

  const scenarioSignal = getScenarioSignal({
    targetRaise,
    baseRunway,
    baseDilution
  });

  return (
    <div className="page ceos-page-shell">
      <style>{fundraisingScenariosCss}</style>

      <div className="fundraising-page">
        <section className="fundraising-hero ceos-ws-hero">
          <div className="fundraising-hero-inner">
            <div>
              <div className="fundraising-badges">
                <Badge>Funding Workspace</Badge>
                <Badge>Fundraising Scenarios</Badge>
                <Badge>{stage}</Badge>
              </div>

              <h1 className="fundraising-title">
                Fundraising Scenarios.
                <span>Choose the raise case before investors do.</span>
              </h1>

              <p className="fundraising-copy">
                Modelización de escenarios low, base y high para analizar capital
                objetivo, runway, dilución estimada y sensibilidad antes de salir
                al mercado.
              </p>

              <div className="fundraising-command-bar">
                <CommandItem label="Company" value={companyName} />
                <CommandItem
                  label="Base raise"
                  value={formatCurrency(baseCaseRaise, currency)}
                />
                <CommandItem
                  label="Scenario posture"
                  value={scenarioSignal.posture}
                />
              </div>
            </div>

            <aside className="fundraising-signal-card">
              <div className="fundraising-signal-top">
                <div>
                  <div className="kpi-label">Scenario Signal</div>
                  <div className="fundraising-signal-title">
                    {scenarioSignal.title}
                  </div>
                </div>

                <div className="fundraising-icon-box">
                  <LineChart size={21} />
                </div>
              </div>

              <div className="fundraising-score-box">
                <strong>{scenarioSignal.posture}</strong>
                <p className="muted">{scenarioSignal.description}</p>
              </div>

              <div>
                <SignalRow label="Base runway" value={`${baseRunway} meses`} />
                <SignalRow label="Base dilution" value={`${baseDilution.toFixed(1)}%`} />
                <SignalRow label="Low case" value={formatCurrency(lowCaseRaise, currency)} />
                <SignalRow label="High case" value={formatCurrency(highCaseRaise, currency)} />
              </div>
            </aside>
          </div>
        </section>

        <section className="fundraising-section">
          <SectionHeader
            kicker="Scenario overview"
            icon={Activity}
            title="Low, base and high case at a glance"
            description="Comparativa rápida de tamaño de ronda, runway y dilución para decidir qué narrativa presentar al mercado."
          />

          <div className="fundraising-grid fundraising-grid-kpis">
            <KpiCard
              label="Low Case"
              value={formatCurrency(lowCaseRaise, currency)}
              description="Raise conservador"
              icon={Banknote}
            />

            <KpiCard
              label="Base Case"
              value={formatCurrency(baseCaseRaise, currency)}
              description="Capital objetivo actual"
              icon={Target}
              color="text-success"
            />

            <KpiCard
              label="High Case"
              value={formatCurrency(highCaseRaise, currency)}
              description="Raise expansivo"
              icon={TrendingUp}
            />

            <KpiCard
              label="Runway Base"
              value={`${baseRunway} meses`}
              description="Caja actual + ronda"
              icon={Clock3}
            />
          </div>
        </section>

        <section className="fundraising-grid fundraising-grid-three">
          <KpiCard
            label="Low runway"
            value={`${lowRunway} meses`}
            description={`Dilución estimada ${lowDilution.toFixed(1)}%`}
            icon={Gauge}
          />

          <KpiCard
            label="Base runway"
            value={`${baseRunway} meses`}
            description={`Dilución estimada ${baseDilution.toFixed(1)}%`}
            icon={CheckCircle2}
            color="text-success"
          />

          <KpiCard
            label="High runway"
            value={`${highRunway} meses`}
            description={`Dilución estimada ${highDilution.toFixed(1)}%`}
            icon={PieChart}
          />
        </section>

        <section className="fundraising-grid fundraising-grid-two">
          <div className="fundraising-panel">
            <div className="fundraising-panel-head">
              <div>
                <h3>Scenario Overview</h3>
                <p className="muted fundraising-muted-tight">
                  Lectura ejecutiva del escenario base y su impacto sobre runway,
                  dilución y capacidad de ejecución.
                </p>
              </div>

              <div className="fundraising-card-icon">
                <Gauge size={18} />
              </div>
            </div>

            <div className="fundraising-stack">
              <MiniCard
                title="Runway impact"
                text={`Con el escenario base, la compañía alcanzaría aproximadamente ${baseRunway} meses de runway, asumiendo el burn mensual indicado.`}
              />

              <MiniCard
                title="Dilution impact"
                text={`La dilución estimada del escenario base sería de aproximadamente ${baseDilution.toFixed(1)}% sobre post-money.`}
              />

              <MiniCard
                title="Decision posture"
                text={scenarioSignal.description}
              />
            </div>
          </div>

          <div className="fundraising-panel">
            <div className="fundraising-panel-head">
              <div>
                <h3>Scenario Logic</h3>
                <p className="muted fundraising-muted-tight">
                  Criterio para comparar escenarios antes de presentar la ronda
                  a inversores.
                </p>
              </div>

              <div className="fundraising-card-icon">
                <TrendingUp size={18} />
              </div>
            </div>

            <div className="fundraising-stack">
              <MiniCard
                title="Low case"
                text="Escenario prudente para cerrar una ronda menor, reducir riesgo de ejecución y validar tracción."
              />

              <MiniCard
                title="Base case"
                text="Escenario recomendado según los inputs actuales de capital, valoración, burn y runway objetivo."
              />

              <MiniCard
                title="High case"
                text="Escenario expansivo para acelerar crecimiento, contratación o desarrollo de producto."
              />
            </div>
          </div>
        </section>

        <section className="fundraising-table-panel">
          <SectionHeader
            kicker="Scenario table"
            icon={ShieldAlert}
            title="Low / Base / High Case"
            description="Tabla comparativa de raise, dilución y runway para decidir qué escenario presentar como narrativa principal."
            right={<Badge>{scenarioRows.length} escenarios</Badge>}
          />

          <ScenarioTable
            scenarioRows={scenarioRows}
            currency={currency}
          />
        </section>
      </div>
    </div>
  );
}