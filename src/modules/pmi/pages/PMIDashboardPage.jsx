import React from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  Gauge,
  Layers3,
  Milestone,
  ShieldAlert,
  Sparkles,
  Target,
  TrendingUp,
  Users
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '../../../shared/components/ui/Card.jsx';
import { Badge } from '../../../shared/components/ui/Badge.jsx';
import { usePMIStore } from '../store/pmiStore.jsx';
import { usePMIEngine } from '../engine/usePMIEngine.js';
import { formatCurrency } from '../../../shared/utils/formatCurrency.js';

const pmiDashboardCss = `
  .pmi-page {
    width: min(1540px, 100%);
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 38px;
  }

  .pmi-hero {
    position: relative;
    overflow: hidden;
    min-height: 560px;
    border-radius: 38px;
    padding: 44px;
    border: 1px solid rgba(148, 163, 184, 0.18);
    background:
      radial-gradient(circle at 8% 2%, rgba(37, 99, 235, 0.38), transparent 30%),
      radial-gradient(circle at 88% 8%, rgba(16, 185, 129, 0.18), transparent 27%),
      radial-gradient(circle at 60% 110%, rgba(245, 158, 11, 0.10), transparent 30%),
      linear-gradient(135deg, rgba(2, 6, 23, 0.99), rgba(15, 23, 42, 0.97));
    box-shadow:
      0 38px 120px rgba(0, 0, 0, 0.42),
      inset 0 1px 0 rgba(255, 255, 255, 0.055);
  }

  .pmi-hero::before {
    content: "";
    position: absolute;
    inset: 0;
    background:
      linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px);
    background-size: 50px 50px;
    mask-image: linear-gradient(to bottom, rgba(0,0,0,0.9), transparent 82%);
    pointer-events: none;
  }

  .pmi-hero::after {
    content: "";
    position: absolute;
    inset: auto -190px -210px auto;
    width: 520px;
    height: 520px;
    border-radius: 999px;
    background: radial-gradient(circle, rgba(16, 185, 129, 0.13), transparent 70%);
    pointer-events: none;
  }

  .pmi-hero-layout {
    position: relative;
    z-index: 1;
    min-height: 470px;
    display: grid;
    grid-template-columns: minmax(0, 1.08fr) minmax(360px, 0.92fr);
    gap: 38px;
    align-items: center;
  }

  .pmi-badge-row {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    align-items: center;
    margin-bottom: 26px;
  }

  .pmi-title {
    margin: 0;
    max-width: 940px;
    font-size: clamp(40px, 4.8vw, 68px);
    line-height: 0.94;
    letter-spacing: -0.075em;
  }

  .pmi-title span {
    display: block;
    margin-top: 9px;
    color: rgba(226, 232, 240, 0.7);
  }

  .pmi-copy {
    max-width: 850px;
    margin: 28px 0 0;
    font-size: 17px;
    line-height: 1.82;
    color: rgba(203, 213, 225, 0.86);
  }

  .pmi-command-bar {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;
    margin-top: 34px;
    padding-top: 28px;
    border-top: 1px solid rgba(148, 163, 184, 0.16);
  }

  .pmi-command-item {
    padding: 18px;
    border-radius: 22px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.078);
    min-width: 0;
  }

  .pmi-command-item strong {
    display: block;
    margin-top: 8px;
    line-height: 1.25;
    overflow-wrap: anywhere;
  }

  .pmi-signal-card {
    position: relative;
    width: 100%;
    max-width: 460px;
    justify-self: end;
    border-radius: 32px;
    padding: 26px;
    background:
      linear-gradient(135deg, rgba(255,255,255,0.086), rgba(255,255,255,0.026)),
      rgba(15, 23, 42, 0.76);
    border: 1px solid rgba(148, 163, 184, 0.2);
    backdrop-filter: blur(22px);
    box-shadow:
      0 26px 70px rgba(0, 0, 0, 0.24),
      inset 0 1px 0 rgba(255,255,255,0.05);
    overflow: hidden;
  }

  .pmi-signal-card::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 32px;
    background: radial-gradient(circle at 18% 0%, rgba(96, 165, 250, 0.13), transparent 35%);
    pointer-events: none;
  }

  .pmi-signal-inner {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .pmi-signal-top {
    display: flex;
    justify-content: space-between;
    gap: 18px;
    align-items: flex-start;
  }

  .pmi-icon-box,
  .pmi-card-icon,
  .pmi-panel-icon {
    flex: 0 0 auto;
    display: grid;
    place-items: center;
    border-radius: 18px;
    background: rgba(37, 99, 235, 0.16);
    border: 1px solid rgba(96, 165, 250, 0.24);
  }

  .pmi-icon-box {
    width: 50px;
    height: 50px;
  }

  .pmi-card-icon,
  .pmi-panel-icon {
    width: 46px;
    height: 46px;
  }

  .pmi-signal-title {
    margin-top: 10px;
    font-size: 23px;
    line-height: 1.16;
    letter-spacing: -0.04em;
  }

  .pmi-score-module {
    display: grid;
    grid-template-columns: 104px minmax(0, 1fr);
    gap: 18px;
    align-items: center;
    padding: 18px;
    border-radius: 26px;
    background: rgba(255,255,255,0.047);
    border: 1px solid rgba(255,255,255,0.085);
  }

  .pmi-score-ring {
    width: 96px;
    height: 96px;
    border-radius: 999px;
    display: grid;
    place-items: center;
    background:
      conic-gradient(rgba(16, 185, 129, 0.96) var(--score-angle), rgba(255,255,255,0.09) 0deg);
    box-shadow:
      0 18px 40px rgba(0, 0, 0, 0.28),
      0 0 34px rgba(16, 185, 129, 0.16);
  }

  .pmi-score-core {
    width: 72px;
    height: 72px;
    border-radius: 999px;
    display: grid;
    place-items: center;
    background: rgba(15, 23, 42, 0.97);
    border: 1px solid rgba(255,255,255,0.08);
  }

  .pmi-score-core strong {
    font-size: 23px;
    letter-spacing: -0.055em;
  }

  .pmi-score-copy strong {
    display: block;
    margin-bottom: 8px;
  }

  .pmi-score-copy p {
    margin: 0;
    line-height: 1.58;
  }

  .pmi-signal-table {
    display: grid;
  }

  .pmi-signal-row {
    display: grid;
    grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
    gap: 14px;
    align-items: center;
    padding: 12px 0;
    border-top: 1px solid rgba(148, 163, 184, 0.14);
  }

  .pmi-signal-row strong {
    text-align: right;
    overflow-wrap: anywhere;
  }

  .pmi-section {
    display: flex;
    flex-direction: column;
    gap: 26px;
  }

  .pmi-section-header {
    display: flex;
    justify-content: space-between;
    gap: 28px;
    align-items: flex-end;
  }

  .pmi-kicker {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
    font-size: 11px;
    line-height: 1;
    text-transform: uppercase;
    letter-spacing: 0.17em;
    color: rgba(148, 163, 184, 0.96);
  }

  .pmi-section-header h2,
  .pmi-section-header h3 {
    margin: 0;
    letter-spacing: -0.045em;
  }

  .pmi-section-header p {
    max-width: 820px;
    margin: 11px 0 0;
    line-height: 1.68;
  }

  .pmi-grid {
    display: grid;
    gap: 26px;
    align-items: stretch;
  }

  .pmi-grid-kpis {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .pmi-grid-two {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .pmi-grid-three {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .pmi-kpi-card,
  .pmi-panel,
  .pmi-workstream-card,
  .pmi-risk-card,
  .pmi-milestone-card {
    width: 100%;
    height: 100%;
    border-radius: 31px;
    border: 1px solid rgba(148, 163, 184, 0.16);
    background:
      linear-gradient(135deg, rgba(255,255,255,0.064), rgba(255,255,255,0.022)),
      rgba(15, 23, 42, 0.64);
    box-shadow:
      0 24px 70px rgba(0, 0, 0, 0.21),
      inset 0 1px 0 rgba(255,255,255,0.035);
  }

  .pmi-kpi-card {
    min-height: 188px;
    padding: 27px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 22px;
  }

  .pmi-kpi-top,
  .pmi-card-head,
  .pmi-panel-head {
    display: flex;
    justify-content: space-between;
    gap: 18px;
    align-items: flex-start;
  }

  .pmi-kpi-value {
    margin-top: 12px;
    font-size: 25px;
    font-weight: 790;
    line-height: 1.12;
    letter-spacing: -0.045em;
    overflow-wrap: anywhere;
  }

  .pmi-kpi-card p {
    margin: 0;
    line-height: 1.56;
  }

  .pmi-panel,
  .pmi-workstream-card,
  .pmi-risk-card,
  .pmi-milestone-card {
    padding: 28px;
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  .pmi-card-title,
  .pmi-panel-title {
    margin: 0;
    letter-spacing: -0.04em;
  }

  .pmi-card-copy,
  .pmi-panel-copy {
    margin: 10px 0 0;
    line-height: 1.62;
  }

  .pmi-progress-track {
    overflow: hidden;
    height: 10px;
    border-radius: 999px;
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.08);
  }

  .pmi-progress-fill {
    height: 100%;
    border-radius: 999px;
    background: linear-gradient(90deg, rgba(37, 99, 235, 0.95), rgba(16, 185, 129, 0.95));
  }

  .pmi-mini-row {
    display: flex;
    justify-content: space-between;
    gap: 14px;
    padding: 12px 0;
    border-top: 1px solid rgba(148, 163, 184, 0.13);
  }

  .pmi-mini-row strong {
    text-align: right;
    overflow-wrap: anywhere;
  }

  .pmi-list {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .pmi-link-row {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: auto;
  }

  .pmi-link {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    width: fit-content;
    border-radius: 999px;
    padding: 10px 13px;
    color: rgba(226, 232, 240, 0.94);
    background: rgba(37, 99, 235, 0.16);
    border: 1px solid rgba(96, 165, 250, 0.24);
    text-decoration: none;
    font-size: 13px;
    font-weight: 800;
  }

  .pmi-muted-tight {
    margin-bottom: 0;
  }

  @media (max-width: 1180px) {
    .pmi-hero {
      min-height: auto;
      padding: 34px;
    }

    .pmi-hero-layout,
    .pmi-grid-three,
    .pmi-grid-two {
      grid-template-columns: 1fr;
    }

    .pmi-signal-card {
      max-width: none;
      justify-self: stretch;
    }

    .pmi-grid-kpis {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 780px) {
    .pmi-command-bar,
    .pmi-grid-kpis {
      grid-template-columns: 1fr;
    }

    .pmi-title {
      font-size: clamp(36px, 11vw, 54px);
    }

    .pmi-section-header {
      align-items: flex-start;
      flex-direction: column;
    }

    .pmi-score-module {
      grid-template-columns: 1fr;
    }

    .pmi-signal-row {
      grid-template-columns: 1fr;
      gap: 7px;
    }

    .pmi-signal-row strong {
      text-align: left;
    }
  }
`;

function CommandItem({ label, value }) {
  return (
    <div className="pmi-command-item">
      <div className="kpi-label">{label}</div>
      <strong>{value}</strong>
    </div>
  );
}

function SignalRow({ label, value }) {
  return (
    <div className="pmi-signal-row">
      <span className="muted">{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function SectionHeader({ kicker, icon: Icon, title, description }) {
  return (
    <div className="pmi-section-header">
      <div>
        <div className="pmi-kicker">
          <Icon size={14} />
          {kicker}
        </div>

        <h2>{title}</h2>

        <p className="muted">{description}</p>
      </div>
    </div>
  );
}

function KpiCard({ label, value, description, icon: Icon, tone = '' }) {
  return (
    <article className="pmi-kpi-card">
      <div className="pmi-kpi-top">
        <div>
          <div className="kpi-label">{label}</div>

          <div className={`pmi-kpi-value ${tone}`.trim()}>
            {value}
          </div>
        </div>

        <div className="pmi-card-icon">
          <Icon size={18} />
        </div>
      </div>

      <p className="muted">{description}</p>
    </article>
  );
}

function MiniRow({ label, value }) {
  return (
    <div className="pmi-mini-row">
      <span className="muted">{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function ProgressBar({ value }) {
  return (
    <div className="pmi-progress-track">
      <div
        className="pmi-progress-fill"
        style={{ width: `${Math.max(0, Math.min(100, Number(value) || 0))}%` }}
      />
    </div>
  );
}

function WorkstreamCard({ item }) {
  return (
    <article className="pmi-workstream-card">
      <div className="pmi-card-head">
        <div>
          <h3 className="pmi-card-title">{item.name}</h3>
          <p className="muted pmi-card-copy">{item.summary}</p>
        </div>

        <Badge>{item.risk}</Badge>
      </div>

      <ProgressBar value={item.progress} />

      <div>
        <MiniRow label="Owner" value={item.owner} />
        <MiniRow label="Progress" value={`${item.progress}%`} />
        <MiniRow label="Priority" value={item.priority} />
      </div>
    </article>
  );
}

function RiskCard({ item }) {
  return (
    <article className="pmi-risk-card">
      <div className="pmi-card-head">
        <div>
          <h3 className="pmi-card-title">{item.title}</h3>
          <p className="muted pmi-card-copy">{item.mitigation}</p>
        </div>

        <Badge>{item.severity}</Badge>
      </div>

      <MiniRow label="Owner" value={item.owner} />
    </article>
  );
}

function MilestoneCard({ item }) {
  return (
    <article className="pmi-milestone-card">
      <div className="pmi-card-head">
        <div>
          <div className="pmi-kicker">
            <Milestone size={14} />
            {item.label}
          </div>

          <h3 className="pmi-card-title">{item.title}</h3>
          <p className="muted pmi-card-copy">{item.summary}</p>
        </div>

        <Badge>{item.status}</Badge>
      </div>

      <ProgressBar value={item.progress} />
      <MiniRow label="Progress" value={`${item.progress}%`} />
    </article>
  );
}

export function PMIDashboardPage() {
  const { pmiCase } = usePMIStore();
  const engine = usePMIEngine({ pmiCase });

  const scoreAngle = `${engine.integrationScore * 3.6}deg`;

  return (
    <div className="page">
      <style>{pmiDashboardCss}</style>

      <div className="pmi-page">
        <section className="pmi-hero">
          <div className="pmi-hero-layout">
            <div>
              <div className="pmi-badge-row">
                <Badge>PMI & Synergies</Badge>
                <Badge>Post-Merger Integration</Badge>
                <Badge>Execution Layer</Badge>
                <Badge>{pmiCase.status}</Badge>
              </div>

              <h1 className="pmi-title">
                PMI & Synergies Command Center.
                <span>Turn deal thesis into captured value.</span>
              </h1>

              <p className="pmi-copy">
                Capa post-operación para convertir una adquisición en ejecución:
                plan 30-60-90, workstreams, sinergias, riesgos, owners,
                presupuesto y memo ejecutivo para comité.
              </p>

              <div className="pmi-command-bar">
                <CommandItem label="Deal" value={pmiCase.dealName} />
                <CommandItem label="Integration day" value={`Day ${pmiCase.integrationDay}`} />
                <CommandItem label="Current posture" value={engine.signalPosture} />
              </div>
            </div>

            <aside className="pmi-signal-card">
              <div className="pmi-signal-inner">
                <div className="pmi-signal-top">
                  <div>
                    <div className="kpi-label">Integration Signal</div>
                    <div className="pmi-signal-title">
                      {engine.signalTitle}
                    </div>
                  </div>

                  <div className="pmi-icon-box">
                    <Sparkles size={21} />
                  </div>
                </div>

                <div className="pmi-score-module">
                  <div
                    className="pmi-score-ring"
                    style={{ '--score-angle': scoreAngle }}
                  >
                    <div className="pmi-score-core">
                      <strong>{engine.integrationScore}</strong>
                    </div>
                  </div>

                  <div className="pmi-score-copy">
                    <strong>{engine.signalPosture}</strong>

                    <p className="muted">
                      {engine.signalDescription}
                    </p>
                  </div>
                </div>

                <div className="pmi-signal-table">
                  <SignalRow label="Synergy capture" value={`${engine.synergyCaptureRate}%`} />
                  <SignalRow label="Workstream progress" value={`${engine.workstreamProgress}%`} />
                  <SignalRow label="Milestone progress" value={`${engine.milestoneProgress}%`} />
                  <SignalRow label="High risks" value={engine.highRiskCount} />
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section className="pmi-section">
          <SectionHeader
            kicker="Executive snapshot"
            icon={Activity}
            title="Integration at a glance"
            description="Vista ejecutiva de sinergias, presupuesto, workstreams, riesgos y progreso post-cierre."
          />

          <div className="pmi-grid pmi-grid-kpis">
            <KpiCard
              label="Synergies captured"
              value={formatCurrency(engine.synergyCaptured, pmiCase.currency)}
              description={`Objetivo: ${formatCurrency(engine.synergyTarget, pmiCase.currency)}`}
              icon={TrendingUp}
              tone="text-success"
            />

            <KpiCard
              label="Capture rate"
              value={`${engine.synergyCaptureRate}%`}
              description="Porcentaje de sinergias capturadas frente al objetivo."
              icon={Target}
            />

            <KpiCard
              label="Budget used"
              value={`${engine.budgetUsedRate}%`}
              description={`Usado: ${formatCurrency(engine.integrationCostUsed, pmiCase.currency)}`}
              icon={Gauge}
            />

            <KpiCard
              label="Integration risks"
              value={engine.risks.length}
              description={`${engine.highRiskCount} de alta severidad.`}
              icon={ShieldAlert}
              tone={engine.highRiskCount > 0 ? 'text-warning' : 'text-success'}
            />
          </div>
        </section>

        <section className="pmi-grid pmi-grid-two">
          <Card className="pmi-panel">
            <div className="pmi-panel-head">
              <div>
                <div className="pmi-kicker">
                  <BriefcaseBusiness size={14} />
                  Deal context
                </div>

                <h3 className="pmi-panel-title">Post-close integration file</h3>

                <p className="muted pmi-panel-copy">
                  Contexto ejecutivo de la operación y del plan de integración.
                </p>
              </div>

              <div className="pmi-panel-icon">
                <FileText size={18} />
              </div>
            </div>

            <div>
              <MiniRow label="Buyer" value={pmiCase.buyerName} />
              <MiniRow label="Target" value={pmiCase.targetName} />
              <MiniRow label="Closing date" value={pmiCase.closingDate} />
              <MiniRow label="Status" value={pmiCase.status} />
            </div>
          </Card>

          <Card className="pmi-panel">
            <div className="pmi-panel-head">
              <div>
                <div className="pmi-kicker">
                  <ClipboardCheck size={14} />
                  Board actions
                </div>

                <h3 className="pmi-panel-title">Executive priorities</h3>

                <p className="muted pmi-panel-copy">
                  Acciones prioritarias para mantener el plan post-adquisición bajo control.
                </p>
              </div>

              <div className="pmi-panel-icon">
                <CheckCircle2 size={18} />
              </div>
            </div>

            <div className="pmi-list">
              {engine.boardActions.map((action) => (
                <MiniRow key={action} label={action} value="Open" />
              ))}
            </div>
          </Card>
        </section>

        <section className="pmi-section">
          <SectionHeader
            kicker="30-60-90 plan"
            icon={CalendarDays}
            title="Integration roadmap"
            description="Plan ejecutivo para convertir el cierre de la operación en ejecución, control y captura de valor."
          />

          <div className="pmi-grid pmi-grid-kpis">
            {engine.milestones.map((item) => (
              <MilestoneCard key={item.id} item={item} />
            ))}
          </div>
        </section>

        <section className="pmi-section">
          <SectionHeader
            kicker="Workstreams"
            icon={Layers3}
            title="Integration workstreams"
            description="Frentes de integración con owner, progreso, prioridad y riesgo asociado."
          />

          <div className="pmi-grid pmi-grid-two">
            {engine.workstreams.map((item) => (
              <WorkstreamCard key={item.id} item={item} />
            ))}
          </div>
        </section>

        <section className="pmi-section">
          <SectionHeader
            kicker="Risk control"
            icon={AlertTriangle}
            title="Integration risks & mitigants"
            description="Riesgos principales post-cierre y mitigantes para elevar a comité o responsables de integración."
          />

          <div className="pmi-grid pmi-grid-three">
            {engine.risks.map((item) => (
              <RiskCard key={item.id} item={item} />
            ))}
          </div>
        </section>

        <section className="pmi-grid pmi-grid-two">
          <Card className="pmi-panel">
            <div className="pmi-panel-head">
              <div>
                <div className="pmi-kicker">
                  <FileText size={14} />
                  Board memo
                </div>

                <h3 className="pmi-panel-title">Board Integration Memo</h3>

                <p className="muted pmi-panel-copy">
                  Próximo entregable premium: resumen para comité con sinergias,
                  riesgos, owners, costes y decisiones pendientes.
                </p>
              </div>

              <div className="pmi-panel-icon">
                <FileText size={18} />
              </div>
            </div>

            <div>
              <MiniRow label="Memo status" value="Draft-ready" />
              <MiniRow label="Inputs" value="Workstreams + risks + synergies" />
              <MiniRow label="Next version" value="Export premium" />
            </div>
          </Card>

          <Card className="pmi-panel">
            <div className="pmi-panel-head">
              <div>
                <div className="pmi-kicker">
                  <ArrowRight size={14} />
                  Connected OS
                </div>

                <h3 className="pmi-panel-title">Connected to M&A thesis</h3>

                <p className="muted pmi-panel-copy">
                  PMI cierra el ciclo: M&A analiza la operación; PMI controla
                  si la tesis se convierte en valor real post-cierre.
                </p>
              </div>

              <div className="pmi-panel-icon">
                <Users size={18} />
              </div>
            </div>

            <div className="pmi-link-row">
              <Link className="pmi-link" to="/overview">
                Back to Executive Overview
                <ArrowRight size={14} />
              </Link>

              <Link className="pmi-link" to="/ma/dashboard">
                Open M&A
                <ArrowRight size={14} />
              </Link>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}
