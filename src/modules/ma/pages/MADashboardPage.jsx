import React from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  CheckCircle2,
  FileSearch,
  FileText,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp
} from 'lucide-react';
import { Badge } from '../../../shared/components/ui/Badge.jsx';
import { Button } from '../../../shared/components/ui/Button.jsx';
import {
  PERMISSIONS,
  useAuth
} from '../../../app/providers/AuthProvider.jsx';
import { useMAStore } from '../store/maStore.jsx';
import { useValuationEngine } from '../engine/useValuationEngine.js';
import { EquityHeroCard } from '../components/EquityHeroCard.jsx';
import { DealStructureCard } from '../components/DealStructureCard.jsx';
import { ComparablesGrid } from '../components/ComparablesGrid.jsx';
import { formatCurrency } from '../../../shared/utils/formatCurrency.js';

const maDashboardCss = `
  .ma-executive-page {
    width: min(1540px, 100%);
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 38px;
  }

  .ma-hero {
    position: relative;
    overflow: hidden;
    border-radius: 38px;
    padding: 38px;
    border: 1px solid rgba(148, 163, 184, 0.18);
    background:
      radial-gradient(circle at 8% 2%, rgba(37, 99, 235, 0.38), transparent 30%),
      radial-gradient(circle at 88% 8%, rgba(16, 185, 129, 0.18), transparent 27%),
      radial-gradient(circle at 60% 110%, rgba(234, 179, 8, 0.08), transparent 30%),
      linear-gradient(135deg, rgba(2, 6, 23, 0.99), rgba(15, 23, 42, 0.97));
    box-shadow:
      0 38px 120px rgba(0, 0, 0, 0.42),
      inset 0 1px 0 rgba(255, 255, 255, 0.055);
  }

  .ma-hero::before {
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

  .ma-hero::after {
    content: "";
    position: absolute;
    inset: auto -190px -210px auto;
    width: 520px;
    height: 520px;
    border-radius: 999px;
    background: radial-gradient(circle, rgba(16, 185, 129, 0.13), transparent 70%);
    pointer-events: none;
  }

  .ma-hero-layout {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: minmax(0, 1.45fr) minmax(380px, 0.55fr);
    gap: 36px;
    align-items: stretch;
  }

  .ma-eyebrow-row {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    align-items: center;
    margin-bottom: 26px;
  }

  .ma-title {
    margin: 0;
    max-width: 930px;
    font-size: clamp(42px, 5vw, 72px);
    line-height: 0.92;
    letter-spacing: -0.075em;
  }

  .ma-title span {
    display: block;
    margin-top: 8px;
    color: rgba(226, 232, 240, 0.7);
  }

  .ma-hero-copy {
    max-width: 860px;
    margin: 26px 0 0;
    font-size: 17px;
    line-height: 1.82;
    color: rgba(203, 213, 225, 0.86);
  }

  .ma-hero-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
    margin-top: 34px;
  }

  .ma-command-bar {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;
    margin-top: 34px;
    padding-top: 28px;
    border-top: 1px solid rgba(148, 163, 184, 0.16);
  }

  .ma-command-item {
    padding: 18px;
    border-radius: 22px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.078);
  }

  .ma-command-item strong {
    display: block;
    margin-top: 8px;
    line-height: 1.25;
  }

  .ma-signal-card {
    position: relative;
    min-height: 100%;
    border-radius: 32px;
    padding: 28px;
    background:
      linear-gradient(135deg, rgba(255,255,255,0.086), rgba(255,255,255,0.026)),
      rgba(15, 23, 42, 0.76);
    border: 1px solid rgba(148, 163, 184, 0.2);
    backdrop-filter: blur(22px);
    display: flex;
    flex-direction: column;
    gap: 24px;
    box-shadow:
      0 26px 70px rgba(0, 0, 0, 0.24),
      inset 0 1px 0 rgba(255,255,255,0.05);
  }

  .ma-signal-card::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 32px;
    background: radial-gradient(circle at 18% 0%, rgba(96, 165, 250, 0.13), transparent 35%);
    pointer-events: none;
  }

  .ma-signal-inner {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .ma-signal-top {
    display: flex;
    justify-content: space-between;
    gap: 18px;
    align-items: flex-start;
  }

  .ma-icon-box {
    flex: 0 0 auto;
    width: 50px;
    height: 50px;
    border-radius: 19px;
    display: grid;
    place-items: center;
    background: rgba(37, 99, 235, 0.16);
    border: 1px solid rgba(96, 165, 250, 0.24);
  }

  .ma-signal-title {
    margin-top: 10px;
    font-size: 23px;
    line-height: 1.16;
    letter-spacing: -0.04em;
  }

  .ma-score-module {
    display: grid;
    grid-template-columns: 122px minmax(0, 1fr);
    gap: 22px;
    align-items: center;
    padding: 20px;
    border-radius: 26px;
    background: rgba(255, 255, 255, 0.047);
    border: 1px solid rgba(255, 255, 255, 0.085);
  }

  .ma-score-ring {
    width: 112px;
    height: 112px;
    border-radius: 999px;
    display: grid;
    place-items: center;
    background:
      conic-gradient(rgba(16, 185, 129, 0.96) var(--score-angle), rgba(255,255,255,0.09) 0deg);
    box-shadow:
      0 18px 40px rgba(0, 0, 0, 0.28),
      0 0 34px rgba(16, 185, 129, 0.16);
  }

  .ma-score-core {
    width: 84px;
    height: 84px;
    border-radius: 999px;
    display: grid;
    place-items: center;
    background: rgba(15, 23, 42, 0.97);
    border: 1px solid rgba(255, 255, 255, 0.08);
  }

  .ma-score-core strong {
    font-size: 25px;
    letter-spacing: -0.055em;
  }

  .ma-score-core strong.is-empty-score {
    font-size: 30px;
    color: rgba(226, 232, 240, 0.72);
  }

  .ma-score-copy strong {
    display: block;
    margin-bottom: 8px;
  }

  .ma-score-copy p {
    margin: 0;
    line-height: 1.62;
  }

  .ma-signal-table {
    display: grid;
    gap: 0;
  }

  .ma-signal-row {
    display: grid;
    grid-template-columns: minmax(0, 0.86fr) minmax(0, 1.14fr);
    gap: 14px;
    align-items: center;
    padding: 15px 0;
    border-top: 1px solid rgba(148, 163, 184, 0.14);
  }

  .ma-signal-row strong {
    text-align: right;
    overflow-wrap: anywhere;
  }

  .ma-section {
    display: flex;
    flex-direction: column;
    gap: 26px;
  }

  .ma-section-header {
    display: flex;
    justify-content: space-between;
    gap: 28px;
    align-items: flex-end;
  }

  .ma-kicker {
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

  .ma-section-header h2,
  .ma-section-header h3 {
    margin: 0;
    letter-spacing: -0.045em;
  }

  .ma-section-header p {
    max-width: 800px;
    margin: 11px 0 0;
    line-height: 1.68;
  }

  .ma-grid {
    display: grid;
    gap: 26px;
    align-items: stretch;
  }

  .ma-grid-kpis {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .ma-grid-two {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .ma-kpi-card,
  .ma-panel,
  .ma-workflow-card {
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

  .ma-kpi-card {
    min-height: 188px;
    padding: 27px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 22px;
    transition:
      transform .18s ease,
      border-color .18s ease,
      background .18s ease;
  }

  .ma-kpi-card:hover {
    transform: translateY(-3px);
    border-color: rgba(96, 165, 250, 0.25);
    background:
      linear-gradient(135deg, rgba(255,255,255,0.078), rgba(255,255,255,0.03)),
      rgba(15, 23, 42, 0.78);
  }

  .ma-kpi-top {
    display: flex;
    justify-content: space-between;
    gap: 18px;
    align-items: flex-start;
  }

  .ma-card-icon {
    flex: 0 0 auto;
    width: 46px;
    height: 46px;
    border-radius: 18px;
    display: grid;
    place-items: center;
    background: rgba(37, 99, 235, 0.14);
    border: 1px solid rgba(96, 165, 250, 0.22);
  }

  .ma-kpi-value {
    margin-top: 12px;
    font-size: 25px;
    font-weight: 790;
    line-height: 1.12;
    letter-spacing: -0.045em;
    overflow-wrap: anywhere;
  }

  .ma-kpi-card p {
    margin: 0;
    line-height: 1.56;
  }

  .ma-panel {
    padding: 31px;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .ma-panel-header {
    display: flex;
    justify-content: space-between;
    gap: 24px;
    align-items: flex-start;
  }

  .ma-panel-title {
    margin: 0;
    letter-spacing: -0.045em;
  }

  .ma-panel-description {
    margin: 11px 0 0;
    line-height: 1.66;
  }

  .ma-panel-icon {
    flex: 0 0 auto;
    width: 46px;
    height: 46px;
    border-radius: 18px;
    display: grid;
    place-items: center;
    background: rgba(255, 255, 255, 0.048);
    border: 1px solid rgba(255, 255, 255, 0.085);
  }

  .ma-glass-block {
    border-radius: 25px;
    padding: 25px;
    background:
      linear-gradient(135deg, rgba(255,255,255,0.066), rgba(255,255,255,0.026));
    border: 1px solid rgba(255,255,255,0.092);
  }

  .ma-thesis-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .ma-thesis-item {
    display: grid;
    grid-template-columns: 32px minmax(0, 1fr);
    gap: 15px;
    align-items: flex-start;
    padding: 19px;
    border-radius: 21px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.078);
    color: var(--muted);
    line-height: 1.62;
  }

  .ma-thesis-dot {
    width: 32px;
    height: 32px;
    border-radius: 14px;
    display: grid;
    place-items: center;
    background: rgba(16, 185, 129, 0.12);
    border: 1px solid rgba(16, 185, 129, 0.22);
    color: #86efac;
  }

  .ma-workflow-card {
    padding: 27px;
    display: grid;
    grid-template-columns: 48px minmax(0, 1fr) 42px;
    gap: 21px;
    align-items: center;
    transition:
      transform .18s ease,
      border-color .18s ease,
      background .18s ease;
  }

  .ma-workflow-card:hover {
    transform: translateY(-3px);
    border-color: rgba(96, 165, 250, 0.27);
    background:
      linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.032)),
      rgba(15, 23, 42, 0.79);
  }

  .ma-step-number {
    width: 48px;
    height: 48px;
    border-radius: 19px;
    display: grid;
    place-items: center;
    font-size: 12px;
    font-weight: 850;
    color: #dbeafe;
    background: rgba(37, 99, 235, 0.18);
    border: 1px solid rgba(96, 165, 250, 0.24);
  }

  .ma-workflow-card strong {
    display: block;
    margin-bottom: 8px;
  }

  .ma-workflow-card p {
    margin: 0;
    line-height: 1.62;
  }

  .ma-arrow-link {
    width: 42px;
    height: 42px;
    border-radius: 17px;
    display: grid;
    place-items: center;
    color: inherit;
    text-decoration: none;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.08);
    transition:
      transform .16s ease,
      background .16s ease;
  }

  .ma-arrow-link:hover {
    transform: translateX(3px);
    background: rgba(255, 255, 255, 0.075);
  }

  .ma-latest-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
    margin-top: 20px;
  }

  .ma-mini-metric {
    padding: 18px;
    border-radius: 20px;
    background: rgba(255,255,255,0.038);
    border: 1px solid rgba(255,255,255,0.075);
  }

  .ma-mini-metric strong {
    display: block;
    margin-top: 8px;
  }

  .ma-action-row {
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
    align-items: center;
    margin-top: 22px;
  }

  .ma-bridge-panel {
    position: relative;
    overflow: hidden;
    border-radius: 32px;
    padding: 28px;
    border: 1px solid rgba(148, 163, 184, 0.16);
    background:
      radial-gradient(circle at 0% 0%, rgba(59, 130, 246, 0.16), transparent 32%),
      linear-gradient(135deg, rgba(255,255,255,0.055), rgba(255,255,255,0.02)),
      rgba(15, 23, 42, 0.64);
  }

  .ma-bridge-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 14px;
    margin-top: 22px;
  }

  .ma-bridge-step {
    padding: 18px;
    border-radius: 22px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.075);
  }

  .ma-bridge-step strong {
    display: block;
    margin-top: 8px;
  }

  .ma-external-section {
    display: flex;
    flex-direction: column;
    gap: 26px;
  }

  .ma-muted-tight {
    margin-bottom: 0;
  }

  @media (max-width: 1180px) {
    .ma-hero-layout {
      grid-template-columns: 1fr;
    }

    .ma-grid-kpis,
    .ma-bridge-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 920px) {
    .ma-grid-two,
    .ma-command-bar {
      grid-template-columns: 1fr;
    }

    .ma-section-header {
      align-items: flex-start;
      flex-direction: column;
    }
  }

  @media (max-width: 680px) {
    .ma-executive-page {
      gap: 28px;
    }

    .ma-hero {
      padding: 26px;
      border-radius: 28px;
    }

    .ma-grid-kpis,
    .ma-bridge-grid {
      grid-template-columns: 1fr;
    }

    .ma-kpi-card,
    .ma-panel,
    .ma-workflow-card {
      border-radius: 24px;
    }

    .ma-score-module {
      grid-template-columns: 1fr;
    }

    .ma-signal-row {
      grid-template-columns: 1fr;
      gap: 7px;
    }

    .ma-signal-row strong {
      text-align: left;
    }

    .ma-workflow-card {
      grid-template-columns: 48px minmax(0, 1fr);
    }

    .ma-arrow-link {
      display: none;
    }

    .ma-latest-grid {
      grid-template-columns: 1fr;
    }
  }
`;

export function MADashboardPage() {
  const { can, isViewer } = useAuth();
  const { financials, settings, savedCases } = useMAStore();

  const canEditCases = can(PERMISSIONS.UPDATE_MA_CASE);
  const canExportReports = can(PERMISSIONS.CREATE_MA_REPORT);

  const derived = useValuationEngine({
    financials,
    settings
  });

  const safeSavedCases = Array.isArray(savedCases) ? savedCases : [];
  const latestCase = safeSavedCases[0] || null;
  const reportCurrency = settings?.reportCurrency || 'EUR';

  const hasDealData = hasSufficientDealData(financials, derived);
  const activeCompanyName = financials?.name?.trim() || 'Sin caso activo';
  const qualityScore = hasDealData ? getSafeQualityScore(derived.qualityScore) : null;
  const scoreAngle = `${(qualityScore ?? 0) * 3.6}deg`;
  const equityBase = Number.isFinite(derived.equityBase)
    ? derived.equityBase
    : 0;

  const thesisItems = Array.isArray(derived.thesis) ? derived.thesis : [];
  const comparables = Array.isArray(derived.comparables)
    ? derived.comparables
    : [];

  const qualitySignal = getQualitySignal(qualityScore);

  return (
    <div className="page">
      <style>{maDashboardCss}</style>

      <div className="ma-executive-page">
        <section className="ma-hero">
          <div className="ma-hero-layout">
            <div>
              <div className="ma-eyebrow-row">
                <Badge>M&A Intelligence</Badge>
                <Badge>Executive Command Center</Badge>
                {isViewer ? <Badge>Modo solo lectura</Badge> : null}
                {canEditCases ? <Badge>Edición permitida</Badge> : null}
                {canExportReports ? <Badge>Exportación permitida</Badge> : null}
              </div>

              <h1 className="ma-title">
                Private M&A Intelligence.
                <span>Built for high-stakes deal decisions.</span>
              </h1>

              <p className="ma-hero-copy">
                Centraliza valoración, estructura, tesis de inversión,
                comparables, continuidad de casos y reporting ejecutivo en un
                workspace privado diseñado para analizar, defender y decidir.
              </p>

              <div className="ma-hero-actions">
                <Link to="/ma/valuation">
                  <Button>
                    <BarChart3 size={16} />
                    {isViewer
                      ? 'Ver Valuation Engine'
                      : 'Abrir Valuation Engine'}
                  </Button>
                </Link>

                <Link to="/ma/cim">
                  <Button variant="secondary">
                    <FileText size={16} />
                    Ver CIM / Report
                  </Button>
                </Link>

                <Link to="/ma/deals">
                  <Button variant="secondary">
                    <BriefcaseBusiness size={16} />
                    Deals Repository
                  </Button>
                </Link>
              </div>

              <div className="ma-command-bar">
                <CommandItem
                  label="Workspace"
                  value="Private M&A Intelligence"
                />

                <CommandItem
                  label="Operating loop"
                  value="Analyze · Structure · Report"
                />

                <CommandItem
                  label="Data posture"
                  value="Organization-scoped"
                />
              </div>
            </div>

            <aside className="ma-signal-card">
              <div className="ma-signal-inner">
                <div className="ma-signal-top">
                  <div>
                    <div className="kpi-label">Executive Signal</div>
                    <div className="ma-signal-title">
                      {qualitySignal.title}
                    </div>
                  </div>

                  <div className="ma-icon-box">
                    <Sparkles size={21} />
                  </div>
                </div>

                <div className="ma-score-module">
                  <div
                    className="ma-score-ring"
                    style={{ '--score-angle': scoreAngle }}
                  >
                    <div className="ma-score-core">
                      <strong className={qualityScore === null ? 'is-empty-score' : ''}>
                        {qualityScore === null ? '—' : qualityScore}
                      </strong>
                    </div>
                  </div>

                  <div className="ma-score-copy">
                    <strong>{qualitySignal.posture}</strong>

                    <p className="muted">
                      {qualitySignal.description}
                    </p>
                  </div>
                </div>

                <div className="ma-signal-table">
                  <SignalRow label="Active target" value={activeCompanyName} />

                  <SignalRow
                    label="Equity base"
                    value={formatCurrency(equityBase, reportCurrency)}
                  />

                  <SignalRow
                    label="Quality score"
                    value={qualityScore === null ? 'N/A' : `${qualityScore}/100`}
                  />

                  <SignalRow
                    label="Decision posture"
                    value={qualitySignal.posture}
                  />
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section className="ma-section">
          <SectionHeader
            kicker="Live deal overview"
            icon={Activity}
            title="Deal intelligence at a glance"
            description="Una lectura rápida del caso activo para entender valor, calidad, continuidad y estado del análisis antes de entrar en profundidad."
          />

          <div className="ma-grid ma-grid-kpis">
            <KpiCard
              label="Empresa activa"
              value={activeCompanyName}
              description="Caso cargado en el motor"
              icon={BriefcaseBusiness}
            />

            <KpiCard
              label="Equity Value"
              value={formatCurrency(equityBase, reportCurrency)}
              description="Valor base estimado"
              icon={TrendingUp}
            />

            <KpiCard
              label="Quality Score"
              value={qualityScore === null ? 'N/A' : `${qualityScore}/100`}
              description="Calidad financiera y transferibilidad"
              icon={Activity}
            />

            <KpiCard
              label="Deals guardados"
              value={safeSavedCases.length}
              description="Histórico disponible"
              icon={FileSearch}
            />
          </div>
        </section>

        <section className="ma-bridge-panel">
          <SectionHeader
            kicker="Operating system logic"
            icon={Target}
            title="Analyze, structure, document and decide"
            description="CEO’s OS organiza el ciclo M&A en una secuencia clara: entender el activo, valorar, diseñar la operación y convertir el análisis en material ejecutivo."
          />

          <div className="ma-bridge-grid">
            <BridgeStep
              number="01"
              title="Analyze"
              text="Lectura financiera, calidad del activo y señales críticas."
            />

            <BridgeStep
              number="02"
              title="Value"
              text="Rango de valoración, múltiplos y sensibilidad del deal."
            />

            <BridgeStep
              number="03"
              title="Structure"
              text="Deuda, caja, proceeds, waterfall y palancas de negociación."
            />

            <BridgeStep
              number="04"
              title="Report"
              text="Narrativa, tesis, riesgos y output para comité o inversores."
            />
          </div>
        </section>

        <section className="ma-external-section">
          <SectionHeader
            kicker="Valuation cockpit"
            icon={BarChart3}
            title="From financial inputs to valuation posture"
            description="El motor de valoración convierte los datos financieros en una lectura ejecutiva del valor, sensibilidad y calidad del deal."
          />

          <EquityHeroCard derived={derived} settings={settings} />
        </section>

        <section className="ma-grid ma-grid-two">
          <div className="ma-external-section">
            <SectionHeader
              kicker="Deal structure"
              icon={Target}
              title="Deal mechanics"
              description="Lectura de la estructura económica de la operación y sus principales palancas."
            />

            <DealStructureCard derived={derived} />
          </div>

          <section className="ma-panel">
            <PanelHeader
              kicker="Investment logic"
              icon={Sparkles}
              title="Investment Thesis"
              description="Narrativa ejecutiva generada a partir de los inputs financieros, scoring de calidad, múltiplo ajustado y señales críticas del deal."
            />

            {thesisItems.length > 0 ? (
              <ul className="ma-thesis-list">
                {thesisItems.map((item, index) => (
                  <li className="ma-thesis-item" key={index}>
                    <span className="ma-thesis-dot">
                      <CheckCircle2 size={14} />
                    </span>

                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="ma-glass-block">
                <strong>Sin tesis suficiente todavía</strong>

                <p className="muted ma-muted-tight" style={{ marginTop: 10 }}>
                  Completa los principales inputs financieros en Valuation
                  Engine para generar una lectura ejecutiva más sólida.
                </p>
              </div>
            )}
          </section>
        </section>

        <section className="ma-section">
          <SectionHeader
            kicker="Execution path"
            icon={Target}
            title="From analysis to board-ready output"
            description="Un flujo simple para pasar de inputs financieros a valoración, estructura de operación, narrativa ejecutiva y repositorio de casos."
          />

          <div className="ma-grid ma-grid-two">
            <WorkflowCard
              number="01"
              title="Valuation Engine"
              description="Carga inputs, normaliza EBITDA, ajusta múltiplos y ejecuta el análisis base del activo."
              to="/ma/valuation"
            />

            <WorkflowCard
              number="02"
              title="Deal Design"
              description="Revisa estructura de deuda, caja, net proceeds, waterfall y palancas de negociación."
              to="/ma/waterfall"
            />

            <WorkflowCard
              number="03"
              title="CIM / Executive Report"
              description="Convierte la valoración en narrativa ejecutiva y material exportable para inversores o comité."
              to="/ma/cim"
            />

            <WorkflowCard
              number="04"
              title="Deals Repository"
              description="Guarda snapshots, recupera casos y conserva continuidad en el análisis de oportunidades."
              to="/ma/deals"
            />
          </div>
        </section>

        <section className="ma-grid ma-grid-two">
          <section className="ma-panel">
            <PanelHeader
              kicker="Private repository"
              icon={LockKeyhole}
              title="Saved Deal Snapshot"
              description="Último caso guardado en el repositorio privado de M&A."
            />

            {latestCase ? (
              <div>
                <div className="ma-glass-block">
                  <div className="ma-panel-header">
                    <div>
                      <strong>{latestCase.name}</strong>

                      <p className="muted ma-muted-tight" style={{ marginTop: 10 }}>
                        Último snapshot disponible para continuidad de análisis.
                      </p>
                    </div>

                    <div className="ma-panel-icon">
                      <CheckCircle2 size={18} />
                    </div>
                  </div>

                  <div className="ma-latest-grid">
                    <div className="ma-mini-metric">
                      <div className="kpi-label">Equity base</div>
                      <strong>
                        {formatCurrency(
                          latestCase.snapshot?.equityBase || 0,
                          reportCurrency
                        )}
                      </strong>
                    </div>

                    <div className="ma-mini-metric">
                      <div className="kpi-label">Repository status</div>
                      <strong>Disponible</strong>
                    </div>
                  </div>
                </div>

                <div className="ma-action-row">
                  <Link to="/ma/deals">
                    <Button variant="secondary">
                      <BriefcaseBusiness size={16} />
                      Abrir repositorio
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="ma-glass-block">
                <strong>No hay deals guardados todavía</strong>

                <p className="muted" style={{ marginTop: 10 }}>
                  Guarda un caso desde Valuation Engine para construir
                  histórico, recuperar análisis y preparar una demo completa de
                  M&A.
                </p>

                <div className="ma-action-row">
                  <Link to="/ma/valuation">
                    <Button variant="secondary">
                      <BarChart3 size={16} />
                      Crear primer caso
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </section>

          <section className="ma-panel">
            <PanelHeader
              kicker="Decision discipline"
              icon={ShieldCheck}
              title="Recommended Next Step"
              description="Siguiente acción sugerida para completar la demo y dejar el caso preparado para presentación."
            />

            <div className="ma-glass-block">
              <strong>{getRecommendedAction(qualityScore, latestCase)}</strong>

              <p className="muted" style={{ marginTop: 10 }}>
                El objetivo del workspace no es solo calcular una valoración.
                Es convertir el análisis en una decisión ejecutiva defendible.
              </p>

              <div className="ma-action-row">
                <Link to="/ma/valuation">
                  <Button variant="secondary">
                    <BarChart3 size={16} />
                    Revisar valoración
                  </Button>
                </Link>

                <Link to="/ma/cim">
                  <Button variant="secondary">
                    <FileText size={16} />
                    Preparar report
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        </section>

        <section className="ma-external-section">
          <SectionHeader
            kicker="Market context"
            icon={TrendingUp}
            title="Comparable intelligence"
            description="Una lectura comparativa para entender el rango de mercado y reforzar la narrativa de valoración."
          />

          <ComparablesGrid comparables={comparables} />
        </section>
      </div>
    </div>
  );
}

function CommandItem({ label, value }) {
  return (
    <div className="ma-command-item">
      <div className="kpi-label">{label}</div>
      <strong>{value}</strong>
    </div>
  );
}

function BridgeStep({ number, title, text }) {
  return (
    <div className="ma-bridge-step">
      <div className="kpi-label">{number}</div>
      <strong>{title}</strong>

      <p className="muted ma-muted-tight" style={{ marginTop: 8 }}>
        {text}
      </p>
    </div>
  );
}

function KpiCard({ label, value, description, icon: Icon }) {
  return (
    <article className="ma-kpi-card">
      <div className="ma-kpi-top">
        <div>
          <div className="kpi-label">{label}</div>
          <div className="ma-kpi-value">{value}</div>
        </div>

        <div className="ma-card-icon">
          <Icon size={18} />
        </div>
      </div>

      <p className="muted">{description}</p>
    </article>
  );
}

function SectionHeader({ kicker, icon: Icon, title, description }) {
  return (
    <div className="ma-section-header">
      <div>
        <div className="ma-kicker">
          <Icon size={14} />
          {kicker}
        </div>

        <h2>{title}</h2>

        <p className="muted">{description}</p>
      </div>
    </div>
  );
}

function PanelHeader({ kicker, icon: Icon, title, description }) {
  return (
    <div className="ma-panel-header">
      <div>
        <div className="ma-kicker">
          <Icon size={14} />
          {kicker}
        </div>

        <h3 className="ma-panel-title">{title}</h3>

        <p className="muted ma-panel-description">{description}</p>
      </div>

      <div className="ma-panel-icon">
        <Icon size={18} />
      </div>
    </div>
  );
}

function WorkflowCard({ number, title, description, to }) {
  return (
    <article className="ma-workflow-card">
      <div className="ma-step-number">{number}</div>

      <div>
        <strong>{title}</strong>
        <p className="muted">{description}</p>
      </div>

      <Link to={to} className="ma-arrow-link" aria-label={`Abrir ${title}`}>
        <ArrowRight size={16} />
      </Link>
    </article>
  );
}

function SignalRow({ label, value }) {
  return (
    <div className="ma-signal-row">
      <span className="muted">{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function hasSufficientDealData(financials, derived) {
  const hasName = Boolean(financials?.name?.trim());
  const hasSector = Boolean(financials?.sector);
  const normalizedEbitda = Number(derived?.normalizedEbitda);

  return hasName && hasSector && Number.isFinite(normalizedEbitda) && normalizedEbitda > 0;
}

function getSafeQualityScore(score) {
  const parsed = Number(score);

  if (!Number.isFinite(parsed)) return null;

  return Math.max(0, Math.min(100, Math.round(parsed)));
}

function getQualitySignal(score) {
  if (score === null) {
    return {
      title: 'Incomplete deal picture',
      posture: 'Build case',
      description:
        'Faltan datos suficientes para una lectura ejecutiva sólida. Completa razón social, sector y EBITDA normalizado antes de presentar conclusiones.'
    };
  }

  if (score >= 80) {
    return {
      title: 'High-conviction opportunity',
      posture: 'Advance',
      description:
        'El deal presenta señales sólidas para avanzar a revisión profunda, manteniendo validación financiera, legal y operativa.'
    };
  }

  if (score >= 60) {
    return {
      title: 'Qualified opportunity',
      posture: 'Review',
      description:
        'El deal tiene base suficiente para análisis, aunque conviene revisar riesgos, calidad de beneficios y dependencias clave.'
    };
  }

  if (score >= 40) {
    return {
      title: 'Watchlist opportunity',
      posture: 'Validate',
      description:
        'El deal requiere validación adicional antes de avanzar. Prioriza calidad de información, riesgos y consistencia financiera.'
    };
  }

  return {
    title: 'Incomplete deal picture',
    posture: 'Build case',
    description:
      'Faltan datos suficientes para una lectura ejecutiva sólida. Completa inputs financieros antes de presentar conclusiones.'
  };
}

function getRecommendedAction(score, latestCase) {
  if (score === null) {
    return 'Completar los datos mínimos del caso antes de interpretar el score ejecutivo.';
  }

  if (!latestCase) {
    return 'Crear y guardar un primer caso para construir histórico de análisis.';
  }

  if (score >= 70) {
    return 'Preparar CIM / Executive Report y revisar el caso para presentación.';
  }

  if (score >= 45) {
    return 'Completar inputs críticos y validar riesgos antes de exportar conclusiones.';
  }

  return 'Reforzar datos financieros antes de avanzar a valoración o reporte.';
}