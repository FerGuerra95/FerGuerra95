import React from 'react';
import {
  CheckCircle2,
  FileText,
  Sparkles,
  Target,
  TrendingUp,
  Users
} from 'lucide-react';
import { Badge } from '../../../shared/components/ui/Badge.jsx';
import { useFundingStore } from '../store/fundingStore.jsx';
import { useFundingEngine } from '../engine/useFundingEngine.js';
import { ReadinessChecklistCard } from '../components/ReadinessChecklistCard.jsx';

const investorReadinessCss = `
  .investor-page {
    width: min(1540px, 100%);
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 30px;
    min-width: 0;
  }

  .investor-page * {
    box-sizing: border-box;
  }

  .investor-hero {
    position: relative;
    overflow: visible;
    border-radius: 34px;
    padding: 38px;
    border: 1px solid rgba(148, 163, 184, 0.18);
    background:
      radial-gradient(circle at 8% 2%, rgba(37, 99, 235, 0.34), transparent 30%),
      radial-gradient(circle at 88% 8%, rgba(16, 185, 129, 0.16), transparent 27%),
      linear-gradient(135deg, rgba(2, 6, 23, 0.99), rgba(15, 23, 42, 0.97));
    box-shadow:
      0 34px 100px rgba(0, 0, 0, 0.38),
      inset 0 1px 0 rgba(255, 255, 255, 0.055);
  }

  .investor-hero::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background:
      linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
    background-size: 50px 50px;
    mask-image: linear-gradient(to bottom, rgba(0,0,0,0.9), transparent 82%);
    pointer-events: none;
  }

  .investor-hero-inner {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: minmax(0, 1.28fr) minmax(320px, 0.72fr);
    gap: 34px;
    align-items: start;
    min-width: 0;
  }

  .investor-hero-main {
    min-width: 0;
  }

  .investor-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 24px;
  }

  .investor-title {
    margin: 0;
    max-width: 900px;
    font-size: clamp(34px, 4.1vw, 58px);
    line-height: 1.08;
    letter-spacing: -0.055em;
    overflow-wrap: anywhere;
    padding-bottom: 4px;
  }

  .investor-title span {
    display: block;
    margin-top: 8px;
    color: rgba(226, 232, 240, 0.72);
  }

  .investor-copy {
    max-width: 820px;
    margin: 24px 0 0;
    font-size: 16px;
    line-height: 1.78;
    color: rgba(203, 213, 225, 0.86);
  }

  .investor-signal-card,
  .investor-kpi-card,
  .investor-panel,
  .investor-mini-card {
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
    min-width: 0;
  }

  .investor-signal-card {
    padding: 24px;
  }

  .investor-signal-head,
  .investor-panel-head,
  .investor-kpi-top {
    display: flex;
    justify-content: space-between;
    gap: 18px;
    align-items: flex-start;
    min-width: 0;
  }

  .investor-icon-box,
  .investor-card-icon {
    flex: 0 0 auto;
    display: grid;
    place-items: center;
    border-radius: 18px;
    background: rgba(37, 99, 235, 0.16);
    border: 1px solid rgba(96, 165, 250, 0.24);
  }

  .investor-icon-box {
    width: 50px;
    height: 50px;
  }

  .investor-card-icon {
    width: 44px;
    height: 44px;
  }

  .investor-signal-title {
    margin-top: 10px;
    font-size: 23px;
    line-height: 1.2;
    letter-spacing: -0.035em;
    overflow-wrap: anywhere;
  }

  .investor-score-box {
    margin-top: 22px;
    padding: 20px;
    border-radius: 24px;
    background: rgba(255,255,255,0.045);
    border: 1px solid rgba(255,255,255,0.08);
  }

  .investor-score-box strong {
    display: block;
    margin-bottom: 8px;
  }

  .investor-score-box p {
    margin: 0;
    line-height: 1.62;
  }

  .investor-grid {
    display: grid;
    gap: 22px;
    align-items: stretch;
    min-width: 0;
  }

  .investor-grid > * {
    min-width: 0;
  }

  .investor-grid-kpis {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .investor-grid-two {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .investor-grid-three {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .investor-kpi-card {
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

  .investor-kpi-card:hover,
  .investor-mini-card:hover,
  .investor-target-card:hover {
    transform: translateY(-3px);
    border-color: rgba(96, 165, 250, 0.25);
    background:
      linear-gradient(135deg, rgba(255,255,255,0.078), rgba(255,255,255,0.03)),
      rgba(15, 23, 42, 0.78);
  }

  .investor-kpi-value {
    margin-top: 11px;
    font-size: 24px;
    font-weight: 790;
    line-height: 1.16;
    letter-spacing: -0.035em;
    overflow-wrap: anywhere;
  }

  .investor-kpi-card p {
    margin: 0;
    line-height: 1.54;
  }

  .investor-panel {
    padding: 28px;
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  .investor-panel-head h3 {
    margin: 0;
    letter-spacing: -0.035em;
    line-height: 1.2;
  }

  .investor-panel-head p {
    margin: 10px 0 0;
    line-height: 1.62;
  }

  .investor-stack {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .investor-mini-card {
    padding: 20px;
    transition:
      transform .18s ease,
      border-color .18s ease,
      background .18s ease;
  }

  .investor-mini-card strong {
    display: block;
    margin-bottom: 8px;
  }

  .investor-mini-card p {
    margin: 0;
    line-height: 1.62;
  }

  .investor-target-card {
    padding: 20px;
    border-radius: 24px;
    background:
      linear-gradient(135deg, rgba(255,255,255,0.065), rgba(255,255,255,0.024)),
      rgba(15, 23, 42, 0.68);
    border: 1px solid rgba(148, 163, 184, 0.15);
    transition:
      transform .18s ease,
      border-color .18s ease,
      background .18s ease;
  }

  .investor-target-head {
    display: flex;
    justify-content: space-between;
    gap: 14px;
    align-items: center;
    margin-bottom: 10px;
  }

  .investor-panel .card,
  .investor-panel .funding-readiness-card,
  .investor-panel li {
    background:
      linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.022)),
      rgba(15, 23, 42, 0.68) !important;
    border-color: rgba(148, 163, 184, 0.14) !important;
    color: rgba(226, 232, 240, 0.96);
  }

  @media (max-width: 1180px) {
    .investor-hero-inner,
    .investor-grid-two {
      grid-template-columns: 1fr;
    }

    .investor-grid-kpis,
    .investor-grid-three {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 680px) {
    .investor-grid-kpis,
    .investor-grid-three {
      grid-template-columns: 1fr;
    }

    .investor-hero {
      padding: 24px;
      border-radius: 26px;
    }
  }
`;

function toNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatMoney(value, currency = 'EUR') {
  const safeValue = toNumber(value);

  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0
  }).format(safeValue);
}

function calculateReadinessScore(fundingInputs) {
  const dataRoom = toNumber(fundingInputs.dataRoomCompletion);
  const founderMarketFit = toNumber(fundingInputs.founderMarketFit);
  const investorInterest = toNumber(fundingInputs.investorInterest);

  return Math.round((dataRoom + founderMarketFit + investorInterest) / 3);
}

function getReadinessLevel(score) {
  if (score >= 80) {
    return {
      label: 'Alta',
      color: 'text-success',
      description:
        'La compañía presenta una preparación sólida para iniciar conversaciones con inversores.'
    };
  }

  if (score >= 60) {
    return {
      label: 'Media',
      color: 'text-warning',
      description:
        'La compañía puede iniciar preparación comercial, pero conviene reforzar data room, narrativa y señales de tracción.'
    };
  }

  return {
    label: 'Baja',
    color: 'text-danger',
    description:
      'Conviene completar documentación, narrativa y señales de tracción antes de salir al mercado.'
  };
}

function getReadinessSignal(score) {
  if (score >= 80) {
    return {
      title: 'Investor-ready profile',
      posture: 'Start outreach',
      description:
        'El caso muestra un nivel alto de preparación para abrir conversaciones con inversores.'
    };
  }

  if (score >= 60) {
    return {
      title: 'Qualified but improvable',
      posture: 'Refine materials',
      description:
        'La base es suficiente, pero hay margen para reforzar data room, narrativa y señales de mercado.'
    };
  }

  if (score >= 40) {
    return {
      title: 'Readiness in progress',
      posture: 'Build proof points',
      description:
        'Antes de salir al mercado conviene mejorar documentación, tracción y credibilidad del caso.'
    };
  }

  return {
    title: 'Not ready for market',
    posture: 'Delay outreach',
    description:
      'La compañía necesita preparar mejor la base documental y comercial antes de hablar con inversores.'
  };
}

function KpiCard({ label, value, description, color = '', icon: Icon = Target }) {
  return (
    <article className="investor-kpi-card">
      <div className="investor-kpi-top">
        <div>
          <div className="kpi-label">{label}</div>

          <div className={`investor-kpi-value ${color}`.trim()}>
            {value}
          </div>
        </div>

        <div className="investor-card-icon">
          <Icon size={18} />
        </div>
      </div>

      <p className="muted">{description}</p>
    </article>
  );
}

function InfoBlock({ title, text }) {
  return (
    <div className="investor-mini-card">
      <strong>{title}</strong>
      <p className="muted">{text}</p>
    </div>
  );
}

function ThesisList({ items }) {
  if (!items || items.length === 0) {
    return (
      <p className="muted">
        Completa los inputs de financiación para generar una tesis de inversión.
      </p>
    );
  }

  return (
    <ul className="list-compact">
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}

function InvestorTargetCard({ target }) {
  return (
    <div className="investor-target-card">
      <div className="investor-target-head">
        <strong>{target.type}</strong>
        <span className="badge">{target.fit}% fit</span>
      </div>

      <p className="muted" style={{ marginBottom: 0 }}>
        {target.desc}
      </p>
    </div>
  );
}

export function InvestorReadinessPage() {
  const { fundingInputs, fundingSettings } = useFundingStore();

  const derived = useFundingEngine({
    fundingInputs,
    fundingSettings
  });

  const readinessChecklist = Array.isArray(derived.readinessChecklist)
    ? derived.readinessChecklist
    : [];

  const investorTargets = Array.isArray(derived.investorTargets)
    ? derived.investorTargets
    : [];

  const thesisItems = Array.isArray(derived.thesis) ? derived.thesis : [];

  const readinessScore = calculateReadinessScore(fundingInputs);
  const readinessLevel = getReadinessLevel(readinessScore);
  const readinessSignal = getReadinessSignal(readinessScore);

  const dataRoomCompletion = toNumber(fundingInputs.dataRoomCompletion);
  const founderMarketFit = toNumber(fundingInputs.founderMarketFit);
  const investorInterest = toNumber(fundingInputs.investorInterest);
  const targetRaise = toNumber(fundingInputs.targetRaise);

  const companyName = fundingInputs?.companyName?.trim() || 'Sin compañía activa';
  const stage = fundingInputs?.stage || 'Seed';
  const currency = fundingSettings?.reportCurrency || 'EUR';

  return (
    <div className="page ceos-page-shell">
      <style>{investorReadinessCss}</style>

      <div className="investor-page">
        <section className="investor-hero ceos-ws-hero">
          <div className="investor-hero-inner">
            <div className="investor-hero-main">
              <div className="investor-badges">
                <Badge>Funding Workspace</Badge>
                <Badge>Investor Readiness</Badge>
                <Badge>{stage}</Badge>
                <Badge>{readinessLevel.label}</Badge>
              </div>

              <h1 className="investor-title">
                Investor Readiness.
                <span>Prepare the company before the market.</span>
              </h1>

              <p className="investor-copy">
                Evaluación ejecutiva de preparación para inversores: data room,
                encaje fundador-mercado, interés inversor, narrativa y checklist
                de salida al mercado.
              </p>
            </div>

            <aside className="investor-signal-card">
              <div className="investor-signal-head">
                <div>
                  <div className="kpi-label">Readiness Signal</div>
                  <div className="investor-signal-title">
                    {readinessSignal.title}
                  </div>
                </div>

                <div className="investor-icon-box">
                  <Sparkles size={21} />
                </div>
              </div>

              <div className="investor-score-box">
                <strong>{readinessSignal.posture}</strong>
                <p className="muted">{readinessSignal.description}</p>
              </div>
            </aside>
          </div>
        </section>

        <div className="investor-grid investor-grid-kpis">
          <KpiCard
            label="Compañía"
            value={companyName}
            description="Caso activo"
            icon={Target}
          />

          <KpiCard
            label="Capital objetivo"
            value={formatMoney(targetRaise, currency)}
            description="Ronda prevista"
            icon={TrendingUp}
          />

          <KpiCard
            label="Readiness Score"
            value={`${readinessScore}/100`}
            description={`Preparación ${readinessLevel.label}`}
            color={readinessLevel.color}
            icon={CheckCircle2}
          />

          <KpiCard
            label="Postura"
            value={readinessSignal.posture}
            description="Siguiente acción"
            icon={Sparkles}
          />
        </div>

        <div className="investor-grid investor-grid-kpis">
          <KpiCard
            label="Data Room"
            value={`${dataRoomCompletion}%`}
            description="Documentación preparada"
            icon={FileText}
          />

          <KpiCard
            label="Founder-Market Fit"
            value={`${founderMarketFit}%`}
            description="Credibilidad del equipo"
            icon={Users}
          />

          <KpiCard
            label="Investor Interest"
            value={`${investorInterest}%`}
            description="Señales de mercado"
            icon={TrendingUp}
          />

          <KpiCard
            label="Investor Targets"
            value={investorTargets.length}
            description="Perfiles generados"
            icon={Target}
          />
        </div>

        <section className="investor-grid investor-grid-two">
          <div className="investor-panel">
            <div className="investor-panel-head">
              <div>
                <h3>Readiness Assessment</h3>
                <p className="muted">
                  Lectura ejecutiva del estado actual antes de iniciar
                  conversaciones formales.
                </p>
              </div>

              <div className="investor-card-icon">
                <CheckCircle2 size={18} />
              </div>
            </div>

            <p>{readinessLevel.description}</p>

            <div className="investor-stack">
              <InfoBlock
                title="Data room readiness"
                text="El inversor debe poder revisar métricas, documentación societaria, equipo, finanzas, producto, clientes y plan de uso de fondos sin fricción."
              />

              <InfoBlock
                title="Market narrative"
                text="La ronda debe explicarse con una narrativa clara: problema, solución, tracción, equipo, mercado, capital necesario y retorno esperado."
              />

              <InfoBlock
                title="Readiness signal"
                text={readinessSignal.description}
              />
            </div>
          </div>

          <div className="investor-panel">
            <div className="investor-panel-head">
              <div>
                <h3>Market Narrative</h3>
                <p className="muted">
                  Tesis de financiación basada en los inputs actuales.
                </p>
              </div>

              <div className="investor-card-icon">
                <TrendingUp size={18} />
              </div>
            </div>

            <p>{derived.summary}</p>

            <ThesisList items={thesisItems} />
          </div>
        </section>

        <section className="investor-grid investor-grid-two">
          <div className="investor-panel">
            <div className="investor-panel-head">
              <div>
                <h3>Execution Checklist</h3>
                <p className="muted">
                  Checklist operativo para preparar la salida al mercado.
                </p>
              </div>

              <div className="investor-card-icon">
                <FileText size={18} />
              </div>
            </div>

            <ReadinessChecklistCard readinessChecklist={readinessChecklist} />
          </div>

          <div className="investor-panel">
            <div className="investor-panel-head">
              <div>
                <h3>Target Investor Fit</h3>
                <p className="muted">
                  Perfiles de inversor más adecuados según fase, tracción,
                  capital objetivo y narrativa.
                </p>
              </div>

              <div className="investor-card-icon">
                <Users size={18} />
              </div>
            </div>

            {investorTargets.length === 0 ? (
              <p className="muted">
                Completa los inputs de financiación para generar perfiles de
                inversor.
              </p>
            ) : (
              <div className="investor-stack">
                {investorTargets.map((target) => (
                  <InvestorTargetCard key={target.type} target={target} />
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="investor-panel">
          <div className="investor-panel-head">
            <div>
              <h3>Investor Preparation Notes</h3>
              <p className="muted">
                Puntos que conviene reforzar antes de enviar materiales o abrir
                conversaciones.
              </p>
            </div>

            <Badge>{stage}</Badge>
          </div>

          <div className="investor-grid investor-grid-three">
            <InfoBlock
              title="1. Claridad del uso de fondos"
              text="Explicar cómo el capital se transforma en crecimiento, producto, ventas, equipo o runway adicional."
            />

            <InfoBlock
              title="2. Prueba de tracción"
              text="Preparar métricas, clientes, pipeline, crecimiento, margen y señales que justifiquen la valoración."
            />

            <InfoBlock
              title="3. Riesgo y mitigación"
              text="Anticipar objeciones sobre burn, competencia, dependencia de clientes, equipo o ejecución."
            />
          </div>
        </section>
      </div>
    </div>
  );
}