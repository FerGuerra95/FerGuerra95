import React from 'react';
import {
  Activity,
  Banknote,
  Gauge,
  Landmark,
  PieChart,
  ShieldCheck,
  Target,
  TrendingDown,
  TrendingUp,
  WalletCards
} from 'lucide-react';
import { Card } from '../../../shared/components/ui/Card.jsx';
import { Badge } from '../../../shared/components/ui/Badge.jsx';
import { useFundingStore } from '../store/fundingStore.jsx';
import { useFundingEngine } from '../engine/useFundingEngine.js';
import { CapitalStructureCard } from '../components/CapitalStructureCard.jsx';
import { formatCurrency } from '../../../shared/utils/formatCurrency.js';

const capitalStructureCss = `
  .capital-page {
    width: min(1540px, 100%);
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 28px;
  }

  .capital-hero {
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

  .capital-hero::before {
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

  .capital-hero-inner {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: minmax(0, 1.35fr) minmax(320px, 0.65fr);
    gap: 28px;
    align-items: stretch;
  }

  .capital-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 22px;
  }

  .capital-title {
    margin: 0;
    max-width: 920px;
    font-size: clamp(38px, 4.8vw, 66px);
    line-height: 0.94;
    letter-spacing: -0.07em;
  }

  .capital-title span {
    display: block;
    margin-top: 8px;
    color: rgba(226, 232, 240, 0.7);
  }

  .capital-copy {
    max-width: 820px;
    margin: 24px 0 0;
    font-size: 16px;
    line-height: 1.78;
    color: rgba(203, 213, 225, 0.86);
  }

  .capital-command-bar {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;
    margin-top: 30px;
    padding-top: 24px;
    border-top: 1px solid rgba(148, 163, 184, 0.16);
  }

  .capital-command-item {
    padding: 17px;
    border-radius: 21px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.078);
    min-width: 0;
  }

  .capital-command-item strong {
    display: block;
    margin-top: 8px;
    line-height: 1.25;
    overflow-wrap: anywhere;
  }

  .capital-signal-card {
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

  .capital-signal-top {
    display: flex;
    justify-content: space-between;
    gap: 18px;
    align-items: flex-start;
    margin-bottom: 22px;
  }

  .capital-icon-box,
  .capital-card-icon {
    flex: 0 0 auto;
    display: grid;
    place-items: center;
    border-radius: 18px;
    background: rgba(37, 99, 235, 0.16);
    border: 1px solid rgba(96, 165, 250, 0.24);
  }

  .capital-icon-box {
    width: 50px;
    height: 50px;
  }

  .capital-card-icon {
    width: 44px;
    height: 44px;
  }

  .capital-signal-title {
    margin-top: 10px;
    font-size: 23px;
    line-height: 1.16;
    letter-spacing: -0.04em;
  }

  .capital-score-box {
    padding: 20px;
    border-radius: 24px;
    background: rgba(255,255,255,0.045);
    border: 1px solid rgba(255,255,255,0.08);
  }

  .capital-score-box strong {
    display: block;
    margin-bottom: 8px;
  }

  .capital-score-box p {
    margin: 0;
    line-height: 1.62;
  }

  .capital-signal-row {
    display: grid;
    grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
    gap: 14px;
    align-items: center;
    padding: 14px 0;
    border-top: 1px solid rgba(148, 163, 184, 0.14);
  }

  .capital-signal-row strong {
    text-align: right;
    overflow-wrap: anywhere;
  }

  .capital-section {
    display: flex;
    flex-direction: column;
    gap: 22px;
  }

  .capital-section-header {
    display: flex;
    justify-content: space-between;
    gap: 24px;
    align-items: flex-end;
  }

  .capital-kicker {
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

  .capital-section-header h2,
  .capital-section-header h3 {
    margin: 0;
    letter-spacing: -0.045em;
  }

  .capital-section-header p {
    max-width: 820px;
    margin: 10px 0 0;
    line-height: 1.66;
  }

  .capital-grid {
    display: grid;
    gap: 22px;
    align-items: stretch;
  }

  .capital-grid-kpis {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .capital-grid-two {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .capital-grid-four {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .capital-kpi-card,
  .capital-panel,
  .capital-mini-card {
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

  .capital-kpi-card {
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

  .capital-kpi-card:hover,
  .capital-mini-card:hover {
    transform: translateY(-3px);
    border-color: rgba(96, 165, 250, 0.25);
    background:
      linear-gradient(135deg, rgba(255,255,255,0.078), rgba(255,255,255,0.03)),
      rgba(15, 23, 42, 0.78);
  }

  .capital-kpi-top {
    display: flex;
    justify-content: space-between;
    gap: 18px;
    align-items: flex-start;
  }

  .capital-kpi-value {
    margin-top: 11px;
    font-size: 24px;
    font-weight: 790;
    line-height: 1.12;
    letter-spacing: -0.045em;
    overflow-wrap: anywhere;
  }

  .capital-kpi-card p {
    margin: 0;
    line-height: 1.54;
  }

  .capital-panel {
    padding: 28px;
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  .capital-panel-head {
    display: flex;
    justify-content: space-between;
    gap: 22px;
    align-items: flex-start;
  }

  .capital-panel-head h3 {
    margin: 0;
    letter-spacing: -0.045em;
  }

  .capital-panel-head p {
    margin: 10px 0 0;
    line-height: 1.62;
  }

  .capital-stack {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .capital-mini-card {
    padding: 20px;
    transition:
      transform .18s ease,
      border-color .18s ease,
      background .18s ease;
  }

  .capital-mini-card strong {
    display: block;
    margin-bottom: 8px;
  }

  .capital-mini-card p {
    margin: 0;
    line-height: 1.62;
  }

  .capital-mini-value {
    display: block;
    margin-top: 8px;
    font-size: 24px;
    font-weight: 800;
    line-height: 1.12;
    letter-spacing: -0.045em;
    overflow-wrap: anywhere;
  }

  .capital-external-panel {
    display: flex;
    flex-direction: column;
    gap: 22px;
  }

  .capital-muted-tight {
    margin-bottom: 0;
  }

  @media (max-width: 1180px) {
    .capital-hero-inner,
    .capital-grid-two {
      grid-template-columns: 1fr;
    }

    .capital-grid-kpis,
    .capital-grid-four {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 920px) {
    .capital-command-bar {
      grid-template-columns: 1fr;
    }

    .capital-section-header {
      align-items: flex-start;
      flex-direction: column;
    }
  }

  @media (max-width: 680px) {
    .capital-page {
      gap: 24px;
    }

    .capital-hero {
      padding: 24px;
      border-radius: 26px;
    }

    .capital-grid-kpis,
    .capital-grid-four {
      grid-template-columns: 1fr;
    }

    .capital-kpi-card,
    .capital-panel,
    .capital-mini-card {
      border-radius: 23px;
    }

    .capital-signal-row {
      grid-template-columns: 1fr;
      gap: 6px;
    }

    .capital-signal-row strong {
      text-align: left;
    }
  }
`;

function toNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function getCapitalSignal({ dilutionPct, debtCapacity, founderOwnership }) {
  if (dilutionPct <= 0) {
    return {
      title: 'Capital structure pending',
      posture: 'Build structure',
      description:
        'Completa valoración, capital objetivo y ownership para analizar la estructura de capital.'
    };
  }

  if (dilutionPct <= 18 && founderOwnership >= 50) {
    return {
      title: 'Balanced capital structure',
      posture: 'Defend terms',
      description:
        'La estructura mantiene una dilución razonable y una posición relevante para fundadores.'
    };
  }

  if (dilutionPct <= 30) {
    return {
      title: 'Workable dilution profile',
      posture: 'Review ownership',
      description:
        'La estructura es viable, aunque conviene revisar impacto sobre fundadores, option pool y condiciones.'
    };
  }

  if (debtCapacity > 0) {
    return {
      title: 'Dilution pressure detected',
      posture: 'Consider debt mix',
      description:
        'La dilución estimada es alta. Puede valorarse deuda como complemento prudente para reducir equity cedido.'
    };
  }

  return {
    title: 'High dilution risk',
    posture: 'Rework terms',
    description:
      'La estructura puede ceder demasiado equity. Revisa valoración pre-money, tamaño de ronda o plan de capital.'
  };
}

function CommandItem({ label, value }) {
  return (
    <div className="capital-command-item">
      <div className="kpi-label">{label}</div>
      <strong>{value}</strong>
    </div>
  );
}

function SignalRow({ label, value }) {
  return (
    <div className="capital-signal-row">
      <span className="muted">{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function SectionHeader({ kicker, icon: Icon, title, description, right }) {
  return (
    <div className="capital-section-header">
      <div>
        <div className="capital-kicker">
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
    <article className="capital-kpi-card">
      <div className="capital-kpi-top">
        <div>
          <div className="kpi-label">{label}</div>
          <div className={`capital-kpi-value ${color}`.trim()}>
            {value}
          </div>
        </div>

        <div className="capital-card-icon">
          <Icon size={18} />
        </div>
      </div>

      <p className="muted">{description}</p>
    </article>
  );
}

function MiniCard({ title, value, text, color = '' }) {
  return (
    <div className="capital-mini-card">
      <strong>{title}</strong>

      {value !== undefined ? (
        <span className={`capital-mini-value ${color}`.trim()}>
          {value}
        </span>
      ) : null}

      {text ? (
        <p className="muted" style={{ marginTop: value !== undefined ? 10 : 0 }}>
          {text}
        </p>
      ) : null}
    </div>
  );
}

export function CapitalStructurePage() {
  const { fundingInputs, fundingSettings } = useFundingStore();

  const derived = useFundingEngine({
    fundingInputs,
    fundingSettings
  });

  const currency = fundingSettings?.reportCurrency || 'EUR';
  const scenarioMode = fundingSettings?.scenarioMode || 'balanced';

  const founderOwnership = toNumber(fundingInputs.founderOwnership);
  const existingInvestorOwnership = toNumber(
    fundingInputs.existingInvestorOwnership
  );
  const optionPool = toNumber(fundingInputs.optionPool);
  const debtCapacity = toNumber(fundingInputs.debtCapacity);
  const companyName = fundingInputs?.companyName?.trim() || 'Sin compañía activa';
  const stage = fundingInputs?.stage || 'Seed';

  const totalCurrentOwnership =
    founderOwnership + existingInvestorOwnership + optionPool;

  const unallocatedOwnership = Math.max(0, 100 - totalCurrentOwnership);

  const preMoneyValuation = toNumber(derived.preMoneyValuation);
  const postMoneyValuation = toNumber(derived.postMoneyValuation);
  const dilutionPct = toNumber(derived.dilutionPct);

  const capitalSignal = getCapitalSignal({
    dilutionPct,
    debtCapacity,
    founderOwnership
  });

  return (
    <div className="page">
      <style>{capitalStructureCss}</style>

      <div className="capital-page">
        <section className="capital-hero">
          <div className="capital-hero-inner">
            <div>
              <div className="capital-badges">
                <Badge>Funding Workspace</Badge>
                <Badge>Capital Structure</Badge>
                <Badge>{stage}</Badge>
                <Badge>{scenarioMode}</Badge>
              </div>

              <h1 className="capital-title">
                Capital Structure.
                <span>Understand dilution before signing the round.</span>
              </h1>

              <p className="capital-copy">
                Vista ejecutiva de pre-money, post-money, dilución, ownership,
                option pool y capacidad de deuda antes de salir al mercado.
              </p>

              <div className="capital-command-bar">
                <CommandItem label="Company" value={companyName} />
                <CommandItem
                  label="Post-money"
                  value={formatCurrency(postMoneyValuation, currency)}
                />
                <CommandItem
                  label="Capital posture"
                  value={capitalSignal.posture}
                />
              </div>
            </div>

            <aside className="capital-signal-card">
              <div className="capital-signal-top">
                <div>
                  <div className="kpi-label">Capital Signal</div>
                  <div className="capital-signal-title">
                    {capitalSignal.title}
                  </div>
                </div>

                <div className="capital-icon-box">
                  <PieChart size={21} />
                </div>
              </div>

              <div className="capital-score-box">
                <strong>{capitalSignal.posture}</strong>
                <p className="muted">{capitalSignal.description}</p>
              </div>

              <div>
                <SignalRow
                  label="Pre-money"
                  value={formatCurrency(preMoneyValuation, currency)}
                />

                <SignalRow
                  label="Post-money"
                  value={formatCurrency(postMoneyValuation, currency)}
                />

                <SignalRow
                  label="Dilution"
                  value={`${dilutionPct.toFixed(1)}%`}
                />

                <SignalRow
                  label="Debt capacity"
                  value={formatCurrency(debtCapacity, currency)}
                />
              </div>
            </aside>
          </div>
        </section>

        <section className="capital-section">
          <SectionHeader
            kicker="Capital overview"
            icon={Activity}
            title="Valuation, dilution and debt capacity"
            description="Resumen rápido de los principales indicadores que afectan a la estructura de capital antes y después de la ronda."
          />

          <div className="capital-grid capital-grid-kpis">
            <KpiCard
              label="Pre-money"
              value={formatCurrency(preMoneyValuation, currency)}
              description="Valoración antes de la ronda"
              icon={Banknote}
            />

            <KpiCard
              label="Post-money"
              value={formatCurrency(postMoneyValuation, currency)}
              description="Valoración tras la ronda"
              icon={TrendingUp}
              color="text-success"
            />

            <KpiCard
              label="Dilución estimada"
              value={`${dilutionPct.toFixed(1)}%`}
              description="Participación cedida"
              icon={TrendingDown}
              color="text-danger"
            />

            <KpiCard
              label="Capacidad de deuda"
              value={formatCurrency(debtCapacity, currency)}
              description="Alternativa no dilutiva"
              icon={ShieldCheck}
            />
          </div>
        </section>

        <section className="capital-grid capital-grid-two">
          <div className="capital-external-panel">
            <SectionHeader
              kicker="Cap table"
              icon={PieChart}
              title="Round ownership model"
              description="Vista de estructura de capital generada por el motor Funding."
            />

            <CapitalStructureCard derived={derived} />
          </div>

          <div className="capital-panel">
            <div className="capital-panel-head">
              <div>
                <h3>Ownership Overview</h3>
                <p className="muted capital-muted-tight">
                  Lectura rápida del reparto actual y margen no asignado antes
                  de simular la ronda.
                </p>
              </div>

              <div className="capital-card-icon">
                <Landmark size={18} />
              </div>
            </div>

            <div className="capital-grid capital-grid-four">
              <MiniCard
                title="Fundadores"
                value={`${founderOwnership}%`}
                color="text-success"
              />

              <MiniCard
                title="Inversores actuales"
                value={`${existingInvestorOwnership}%`}
              />

              <MiniCard
                title="Option pool / equipo"
                value={`${optionPool}%`}
              />

              <MiniCard
                title="No asignado / ajuste"
                value={`${unallocatedOwnership}%`}
              />
            </div>
          </div>
        </section>

        <section className="capital-grid capital-grid-two">
          <div className="capital-panel">
            <div className="capital-panel-head">
              <div>
                <h3>Dilution Analysis</h3>
                <p className="muted capital-muted-tight">
                  Impacto estimado de la ronda sobre la estructura de capital.
                </p>
              </div>

              <div className="capital-card-icon">
                <TrendingDown size={18} />
              </div>
            </div>

            <div className="capital-stack">
              <MiniCard
                title="Capital nuevo"
                text="La ronda introduce capital para extender runway, ejecutar el plan comercial y financiar el crecimiento."
              />

              <MiniCard
                title="Dilución esperada"
                text="La dilución debe ser coherente con el tamaño de la ronda, la valoración pre-money y la ambición del plan de crecimiento."
              />

              <MiniCard
                title="Control de ownership"
                text="Conviene vigilar que fundadores, equipo e inversores mantengan una estructura alineada con la siguiente fase de crecimiento."
              />
            </div>
          </div>

          <div className="capital-panel">
            <div className="capital-panel-head">
              <div>
                <h3>Debt Capacity</h3>
                <p className="muted capital-muted-tight">
                  Lectura de deuda como complemento o alternativa parcial a
                  equity.
                </p>
              </div>

              <div className="capital-card-icon">
                <WalletCards size={18} />
              </div>
            </div>

            <p className="muted">
              La capacidad de deuda puede reducir dilución, pero exige capacidad
              de repago, visibilidad de ingresos y control del burn. Debe usarse
              como palanca prudente, no como sustituto automático de equity.
            </p>

            <div className="row wrap">
              <Badge>
                Debt capacity {formatCurrency(debtCapacity, currency)}
              </Badge>

              <Badge>{scenarioMode}</Badge>

              <Badge>{capitalSignal.posture}</Badge>
            </div>
          </div>
        </section>

        <section className="capital-section">
          <SectionHeader
            kicker="Decision notes"
            icon={Gauge}
            title="Capital structure decision base"
            description="Puntos clave para explicar la ronda, defender la valoración y controlar la pérdida de equity."
          />

          <div className="capital-grid capital-grid-kpis">
            <KpiCard
              label="Ownership declarado"
              value={`${totalCurrentOwnership}%`}
              description="Fundadores + inversores + option pool"
              icon={PieChart}
            />

            <KpiCard
              label="No asignado"
              value={`${unallocatedOwnership}%`}
              description="Margen disponible o ajuste"
              icon={Target}
            />

            <KpiCard
              label="Dilución"
              value={`${dilutionPct.toFixed(1)}%`}
              description="Impacto de la ronda"
              icon={TrendingDown}
              color={dilutionPct > 30 ? 'text-danger' : ''}
            />

            <KpiCard
              label="Estado"
              value={capitalSignal.posture}
              description="Siguiente acción recomendada"
              icon={ShieldCheck}
            />
          </div>
        </section>
      </div>
    </div>
  );
}