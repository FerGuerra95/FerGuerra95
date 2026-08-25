import React from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  ChevronRight,
  FileSearch,
  FileText,
  Layers3,
  Target,
  TrendingUp
} from 'lucide-react';
import { Button } from '../../../shared/components/ui/Button.jsx';
import { useAuth } from '../../../app/providers/AuthProvider.jsx';
import { useMAStore } from '../store/maStore.jsx';
import { useValuationEngine } from '../engine/useValuationEngine.js';
import { formatCurrency } from '../../../shared/utils/formatCurrency.js';
import '../styles/maDashboardMaterial.css';

const PIPELINE_PHASES = [
  'Screen',
  'Qualify',
  'Diligence',
  'Structure',
  'Negotiate',
  'Close'
];

const OPERATING_STEPS = [
  { title: 'Value', text: 'Valoración base, sensibilidad y señales críticas.', icon: BarChart3 },
  { title: 'Pipeline', text: 'Fases, prioridad, valor y riesgo ejecutivo.', icon: Layers3 },
  { title: 'Structure', text: 'Deuda, caja, equity y waterfall económico.', icon: TrendingUp },
  { title: 'Report', text: 'Narrativa ejecutiva, CIM y material exportable.', icon: FileText }
];

const WORKBENCH_LINKS = [
  { title: 'Valuation', description: 'Valor base, sensibilidad, DCF de control y calidad del activo.', to: '/ma/valuation', icon: BarChart3 },
  { title: 'Deal Pipeline', description: 'Fases, prioridad, valor, riesgo y foco ejecutivo.', to: '/ma/pipeline', icon: Layers3 },
  { title: 'Deal Waterfall', description: 'Enterprise Value, deuda neta, equity y reparto económico.', to: '/ma/waterfall', icon: TrendingUp },
  { title: 'CIM / Executive Report', description: 'Narrativa ejecutiva, tesis, riesgos y material de comité.', to: '/ma/cim', icon: FileText },
  { title: 'Buyer Matching', description: 'Encaje de compradores estratégicos, financieros y capital paciente.', to: '/ma/matching', icon: Target },
  { title: 'Deals Repository', description: 'Snapshots guardados e histórico M&A recuperable.', to: '/ma/deals', icon: BriefcaseBusiness }
];

export function MADashboardPage() {
  const { isViewer } = useAuth();
  const { financials, settings, savedCases } = useMAStore();

  const derived = useValuationEngine({ financials, settings });

  const safeSavedCases = Array.isArray(savedCases) ? savedCases : [];
  const latestCase = safeSavedCases[0] || null;
  const reportCurrency = settings?.reportCurrency || financials?.currency || 'EUR';

  const hasDealData = hasSufficientDealData(financials, derived);
  const activeCompanyName = financials?.name?.trim() || 'Sin caso activo';
  const sectorLabel = financials?.sector?.trim() || 'N/A';
  const qualityScore = hasDealData ? getSafeQualityScore(derived.qualityScore) : null;
  const scoreAngle = `${(qualityScore ?? 0) * 3.6}deg`;

  const equityBase =
    hasDealData && Number.isFinite(Number(derived.equityBase)) ? Number(derived.equityBase) : 0;

  const enterpriseValue =
    hasDealData && Number.isFinite(Number(derived.evBase))
      ? Number(derived.evBase)
      : hasDealData && Number.isFinite(Number(derived.blendedEnterpriseValue))
        ? Number(derived.blendedEnterpriseValue)
        : 0;

  const adjustedMultiple =
    hasDealData && Number.isFinite(Number(derived.adjustedMultiple))
      ? Number(derived.adjustedMultiple).toFixed(2)
      : 'N/A';

  const netDebt =
    hasDealData && Number.isFinite(Number(derived.netDebt)) ? Number(derived.netDebt) : 0;

  const equityLabel = hasDealData ? formatCurrency(equityBase, reportCurrency) : 'N/A';
  const enterpriseLabel = hasDealData ? formatCurrency(enterpriseValue, reportCurrency) : 'N/A';
  const netDebtLabel = hasDealData ? formatCurrency(netDebt, reportCurrency) : 'N/A';

  const latestEquityLabel = latestCase?.snapshot?.equityBase
    ? formatCurrency(latestCase.snapshot.equityBase, reportCurrency)
    : 'N/A';

  const qualitySignal = getQualitySignal(qualityScore);
  const signalTitle = formatSignalTitle(qualitySignal.title);

  const pipelineDealCount = getPipelineDealCount({ hasDealData, savedCases: safeSavedCases });

  const pipelineValueLabel = getPipelineValueLabel({
    hasDealData,
    activeEquityValue: equityBase,
    savedCases: safeSavedCases,
    currency: reportCurrency
  });

  const pipelineStatus = pipelineDealCount > 0 ? 'Activo' : 'Pendiente';
  const pipelinePriority =
    qualityScore !== null && qualityScore >= 80
      ? 'High'
      : qualityScore !== null && qualityScore >= 55
        ? 'Review'
        : pipelineDealCount > 0
          ? 'Watchlist'
          : 'N/A';

  const activePipelinePhase = getActivePipelinePhase({
    hasDealData,
    qualityScore,
    hasSavedCase: Boolean(latestCase)
  });

  const activePhaseName = PIPELINE_PHASES[activePipelinePhase] || PIPELINE_PHASES[0];
  const activePhaseDescription = getPhaseDescription(activePipelinePhase);
  const recommendedCta = getRecommendedCta({ qualityScore, latestCase, isViewer });

  return (
    <div className="page">
      <div className="ma-executive-page ma-dashboard-premium">
        <div className="ma-reference-page">
          <section className="ma-reference-scene" aria-labelledby="ma-reference-title">
            <div className="ma-reference-scene-atmo" aria-hidden="true">
              <div className="ma-reference-scene-glow" />
              <div className="ma-reference-scene-mesh" />
              <div className="ma-reference-scene-stage">
                <HeroGlobeVisual />
              </div>
            </div>

            <div className="ma-reference-scene-layout">
              <div className="ma-reference-scene-intro">
                <p className="ma-reference-kicker">
                  Private M&A Intelligence{isViewer ? ' · Read-only' : ''}
                </p>

                <h1 id="ma-reference-title" className="ma-reference-title">
                  <span className="ma-reference-title-line">Private M&A</span>
                  <span className="ma-reference-title-line">Intelligence.</span>
                </h1>

                <p className="ma-reference-subtitle">Built for high-stakes deal decisions.</p>

                <p className="ma-reference-lead muted">
                  Executive surface for live deal review, valuation discipline and private portfolio
                  control.
                </p>

                <p className="ma-reference-dss muted">
                  Decision support only · Human review required · Not investment advice
                </p>

                <div className="ma-reference-cta-stack">
                  <div className="ma-reference-cta-row">
                    <Link to="/ma/valuation" className="ma-reference-cta-primary">
                      <Button>
                        <BarChart3 size={16} />
                        {isViewer ? 'Ver valoración' : 'Abrir valoración'}
                      </Button>
                    </Link>
                    <Link to="/ma/pipeline" className="ma-reference-cta-ghost">
                      Ver pipeline
                    </Link>
                  </div>
                </div>
              </div>

              <aside
                className="ma-reference-signal ma-valuation-status-card ma-valuation-surface"
                aria-label="Executive signal"
              >
                <div className="ma-reference-signal-badge ma-valuation-icon-box" aria-hidden="true">
                  <Activity size={18} strokeWidth={1.6} />
                </div>
                <p className="ma-reference-kicker">Executive Signal</p>
                <h2 className="ma-reference-signal-headline">{signalTitle}</h2>

                <div
                  className="ma-reference-signal-ring"
                  style={{ '--ma-ref-score': scoreAngle }}
                  aria-hidden="true"
                >
                  <div className="ma-reference-signal-ring-core">
                    <span className="ma-reference-signal-figure">
                      {qualityScore === null ? '—' : qualityScore}
                    </span>
                    <span className="ma-reference-signal-denom">/ 100</span>
                  </div>
                </div>

                <p className="ma-reference-signal-status">
                  {qualitySignal.posture} Recommended
                </p>
                <p className="ma-reference-signal-note muted">{qualitySignal.description}</p>
              </aside>
            </div>
          </section>

          <section className="ma-reference-strip ma-valuation-surface ma-valuation-command-strip" aria-label="Active deal">
            <div className="ma-reference-strip-focus">
              <div className="ma-reference-strip-glyph" aria-hidden="true">
                <BriefcaseBusiness size={20} strokeWidth={1.5} />
              </div>
              <div>
                <span className="ma-reference-caption">Active Deal</span>
                <strong>{activeCompanyName}</strong>
              </div>
            </div>

            <div className="ma-reference-strip-divider" aria-hidden="true" />

            <StripFact caption="Status" data={pipelineStatus} />
            <div className="ma-reference-strip-divider" aria-hidden="true" />
            <StripFact caption="Priority" data={pipelinePriority} />
            <div className="ma-reference-strip-divider" aria-hidden="true" />
            <StripFact caption="Sector" data={sectorLabel} />
            <div className="ma-reference-strip-divider" aria-hidden="true" />
            <StripFact caption="Enterprise Value" data={enterpriseLabel} />
            <div className="ma-reference-strip-divider" aria-hidden="true" />
            <StripFact caption="Net Debt" data={netDebtLabel} />
            <div className="ma-reference-strip-divider" aria-hidden="true" />
            <StripFact caption="Adj. Equity" data={equityLabel} />
          </section>

          <section className="ma-reference-stat-row" aria-label="Executive KPIs">
            <StatSlab
              figure={equityLabel}
              caption="Adjusted Equity"
              note="Live engine — not a saved snapshot"
              icon={TrendingUp}
              spark={qualityScore ?? 0}
            />
            <StatSlab
              figure={qualityScore === null ? 'N/A' : `${qualityScore}/100`}
              caption="Quality Score"
              note="Financial quality and transferability"
              icon={Activity}
              spark={qualityScore ?? 0}
            />
            <StatSlab
              figure={String(pipelineDealCount)}
              caption="Deals Tracked"
              note="Active case plus saved portfolio"
              icon={Layers3}
              spark={Math.min(pipelineDealCount * 20, 100)}
            />
            <StatSlab
              figure={pipelineValueLabel}
              caption="Pipeline Value"
              note="Indicative DSS aggregate"
              icon={FileSearch}
              spark={hasDealData ? 65 : 0}
            />
          </section>

          <section className="ma-reference-duo">
            <div className="ma-reference-pipeline ma-valuation-surface">
              <p className="ma-reference-kicker">M&A Deal Pipeline</p>
              <h2 className="ma-reference-section-title">Portfolio flow</h2>

              <div className="ma-reference-pipeline-track" aria-hidden="true">
                {PIPELINE_PHASES.map((phase, index) => (
                  <React.Fragment key={phase}>
                    <PipelineNode
                      name={phase}
                      active={index === activePipelinePhase}
                      done={index < activePipelinePhase}
                    />
                    {index < PIPELINE_PHASES.length - 1 ? (
                      <ChevronRight className="ma-reference-pipeline-arrow" size={14} />
                    ) : null}
                  </React.Fragment>
                ))}
              </div>

              <div className="ma-reference-pipeline-detail">
                <span className="ma-reference-caption">Current phase</span>
                <strong>{activePhaseName}</strong>
                <p className="muted">{activePhaseDescription}</p>
              </div>

              <Link to="/ma/pipeline" className="ma-reference-cta-primary">
                <Button>
                  <Layers3 size={16} />
                  Abrir pipeline
                </Button>
              </Link>
            </div>

            <div className="ma-reference-operating ma-valuation-surface">
              <p className="ma-reference-kicker">Operating Model</p>
              <h2 className="ma-reference-section-title">Executive framework</h2>

              <div className="ma-reference-operating-track">
                {OPERATING_STEPS.map((step) => (
                  <div key={step.title} className="ma-reference-operating-step">
                    <div className="ma-reference-operating-glyph">
                      <step.icon size={20} strokeWidth={1.4} aria-hidden="true" />
                    </div>
                    <strong>{step.title}</strong>
                    <p className="muted">{step.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="ma-reference-workbench" aria-label="M&A workbench">
            <p className="ma-reference-kicker">M&A Workbench — Accesos directos</p>
            <h2 className="ma-reference-section-title">Decision workbench</h2>

            <div className="ma-reference-workbench-deck">
              {WORKBENCH_LINKS.map((link) => (
                <WorkbenchTile key={link.to} {...link} />
              ))}
            </div>
          </section>

          <section className="ma-reference-duo-snap">
            <div className="ma-reference-snapshot ma-valuation-surface">
              <p className="ma-reference-kicker">Active case summary</p>
              <h2 className="ma-reference-section-title">Current Deal Snapshot</h2>
              <p className="muted">Executive readout — decision support only.</p>

              <div className="ma-reference-snapshot-body">
                <div className="ma-reference-snapshot-readout">
                  <ReadoutRow caption="Current phase" data={activePhaseName} />
                  <ReadoutRow
                    caption="Multiple"
                    data={adjustedMultiple === 'N/A' ? 'N/A' : `x${adjustedMultiple}`}
                  />
                  <ReadoutRow caption="Posture" data={qualitySignal.posture} />
                  <ReadoutRow
                    caption="Quality"
                    data={qualityScore === null ? 'N/A' : `${qualityScore}/100`}
                  />
                </div>
                <div className="ma-reference-snapshot-viz" aria-hidden="true">
                  <div
                    className="ma-reference-snapshot-bar"
                    style={{ '--ma-ref-bar': `${qualityScore ?? 0}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="ma-reference-next ma-valuation-surface">
              <p className="ma-reference-kicker">Decision discipline</p>
              <h2 className="ma-reference-section-title">Recommended Next Step</h2>
              <p className="muted">Suggested path based on current case quality — not a directive.</p>

              <div className="ma-reference-next-callout">
                <span className="ma-reference-caption">Suggested action</span>
                <p>{getRecommendedAction(qualityScore, latestCase)}</p>
              </div>

              <div className="ma-reference-cta-row">
                <Link to={recommendedCta.to}>
                  <Button variant="secondary">
                    {React.createElement(recommendedCta.icon, { size: 16 })}
                    {recommendedCta.label}
                  </Button>
                </Link>
              </div>
            </div>
          </section>

          <section className="ma-reference-bottom">
            <BottomSlab
              kicker="Saved Valuation Snapshot"
              title="Latest saved case"
              note="Snapshot at save time — not the live engine."
            >
              {latestCase ? (
                <>
                  <strong className="ma-reference-bottom-highlight" title={latestCase.name}>
                    {latestCase.name}
                  </strong>
                  <div className="ma-reference-snapshot-readout">
                    <ReadoutRow caption="Saved equity" data={latestEquityLabel} />
                    <ReadoutRow caption="Status" data="Disponible" />
                  </div>
                  <Link to="/ma/deals">
                    <Button variant="secondary">
                      <BriefcaseBusiness size={16} />
                      Abrir repositorio
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <strong className="ma-reference-bottom-highlight">Sin casos guardados</strong>
                  <p className="muted">Guarda un caso desde valoración para construir histórico.</p>
                  <Link to="/ma/valuation">
                    <Button variant="secondary">
                      <BarChart3 size={16} />
                      Crear primer caso
                    </Button>
                  </Link>
                </>
              )}
            </BottomSlab>

            <BottomSlab
              kicker="Private Repository"
              title="M&A archive"
              note="Saved snapshots and recoverable deal history."
            >
              <div className="ma-reference-snapshot-readout">
                <ReadoutRow caption="Saved cases" data={String(safeSavedCases.length)} />
                <ReadoutRow caption="Access" data={latestCase ? 'Disponible' : 'Vacío'} />
              </div>
              {latestCase ? (
                <Link to="/ma/deals" className="ma-reference-inline-link">
                  Ver repositorio
                  <ArrowRight size={14} />
                </Link>
              ) : (
                <p className="muted ma-reference-inline-note">Sin snapshots guardados todavía.</p>
              )}
            </BottomSlab>

            <BottomSlab
              kicker="Deal posture"
              title="Executive context"
              note="Live posture — not a directive."
            >
              <div className="ma-reference-snapshot-readout">
                <ReadoutRow caption="Priority" data={pipelinePriority} />
                <ReadoutRow caption="Phase" data={activePhaseName} />
                <ReadoutRow caption="Signal" data={`${qualitySignal.posture} recommended`} />
              </div>
            </BottomSlab>
          </section>
        </div>
      </div>
    </div>
  );
}

function StripFact({ caption, data }) {
  return (
    <div className="ma-reference-strip-fact">
      <span className="ma-reference-caption">{caption}</span>
      <strong>{data}</strong>
    </div>
  );
}

function StatSlab({ figure, caption, note, icon: Icon, spark }) {
  return (
    <article className="ma-reference-stat-slab ma-valuation-surface">
      <div className="ma-reference-stat-spark" style={{ '--ma-ref-spark': `${spark}%` }} aria-hidden="true" />
      <Icon className="ma-reference-stat-glyph" size={36} strokeWidth={1.2} aria-hidden="true" />
      <div className="ma-reference-stat-mini-bars" aria-hidden="true">
        <span style={{ '--ma-ref-h': `${Math.max(20, spark * 0.5)}%` }} />
        <span style={{ '--ma-ref-h': `${Math.max(30, spark * 0.7)}%` }} />
        <span style={{ '--ma-ref-h': `${Math.max(40, spark * 0.85)}%` }} />
        <span style={{ '--ma-ref-h': `${spark}%` }} />
      </div>
      <div className="ma-reference-stat-figure">{figure}</div>
      <div className="ma-reference-caption">{caption}</div>
      <p className="muted">{note}</p>
    </article>
  );
}

function PipelineNode({ name, active, done }) {
  const state = active ? ' is-active' : done ? ' is-done' : '';
  return (
    <div className={`ma-reference-pipeline-node${state}`}>
      <span className="ma-reference-pipeline-dot" />
      <span className="ma-reference-pipeline-name">{name}</span>
    </div>
  );
}

function WorkbenchTile({ title, description, to, icon: Icon }) {
  return (
    <Link to={to} className="ma-reference-workbench-tile ma-valuation-surface">
      <div className="ma-reference-workbench-glyph" aria-hidden="true">
        <Icon size={22} strokeWidth={1.5} />
      </div>
      <div>
        <strong>{title}</strong>
        <p className="muted">{description}</p>
      </div>
      <ArrowRight className="ma-reference-workbench-arrow" size={18} aria-hidden="true" />
    </Link>
  );
}

function ReadoutRow({ caption, data }) {
  const titleText = data == null || data === '' ? undefined : String(data);
  return (
    <div className="ma-reference-readout-row">
      <span className="ma-reference-caption">{caption}</span>
      <strong title={titleText}>{data}</strong>
    </div>
  );
}

function BottomSlab({ kicker, title, note, children }) {
  return (
    <article className="ma-reference-bottom-slab ma-valuation-surface">
      <p className="ma-reference-kicker">{kicker}</p>
      <h3 className="ma-reference-bottom-title">{title}</h3>
      <p className="muted">{note}</p>
      {children}
    </article>
  );
}

function HeroGlobeVisual() {
  return (
    <div className="ma-reference-scene-globe">
      <div className="ma-reference-globe-flare" aria-hidden="true" />
      <div className="ma-reference-globe-halo" aria-hidden="true" />
      <svg className="ma-reference-globe-svg" viewBox="0 0 400 400" aria-hidden="true">
        <defs>
          <radialGradient id="ma-ref-globe-sphere" cx="38%" cy="34%" r="70%">
            <stop offset="0%" stopColor="rgba(167, 243, 232, 0.16)" />
            <stop offset="42%" stopColor="rgba(45, 212, 191, 0.1)" />
            <stop offset="72%" stopColor="rgba(20, 184, 166, 0.06)" />
            <stop offset="100%" stopColor="rgba(13, 148, 136, 0.02)" />
          </radialGradient>
          <radialGradient id="ma-ref-globe-rim" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(45, 212, 191, 0)" />
            <stop offset="72%" stopColor="rgba(45, 212, 191, 0)" />
            <stop offset="100%" stopColor="rgba(15, 118, 110, 0.12)" />
          </radialGradient>
          <radialGradient id="ma-ref-globe-specular" cx="30%" cy="26%" r="32%">
            <stop offset="0%" stopColor="rgba(204, 251, 241, 0.14)" />
            <stop offset="100%" stopColor="rgba(204, 251, 241, 0)" />
          </radialGradient>
          <radialGradient id="ma-ref-grid-fade" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="white" stopOpacity="0.55" />
            <stop offset="55%" stopColor="white" stopOpacity="0.82" />
            <stop offset="100%" stopColor="white" stopOpacity="1" />
          </radialGradient>
          <mask id="ma-ref-grid-mask">
            <circle cx="200" cy="200" r="146" fill="url(#ma-ref-grid-fade)" />
          </mask>
          <filter id="ma-ref-node-glow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <clipPath id="ma-ref-globe-clip">
            <circle cx="200" cy="200" r="146" />
          </clipPath>
        </defs>

        <circle cx="200" cy="200" r="154" fill="none" stroke="rgba(94, 234, 212, 0.08)" strokeWidth="5" opacity="0.65" />

        <g className="ma-reference-globe-body">
          <circle cx="200" cy="200" r="148" fill="url(#ma-ref-globe-sphere)" />
          <circle cx="200" cy="200" r="148" fill="url(#ma-ref-globe-rim)" />
          <circle cx="200" cy="200" r="148" fill="url(#ma-ref-globe-specular)" />
          <circle cx="200" cy="200" r="148" fill="none" stroke="rgba(94, 234, 212, 0.18)" strokeWidth="1" />
        </g>

        <g className="ma-reference-globe-grid" clipPath="url(#ma-ref-globe-clip)" mask="url(#ma-ref-grid-mask)">
          <ellipse cx="200" cy="200" rx="146" ry="32" fill="none" stroke="rgba(94, 234, 212, 0.16)" strokeWidth="0.75" />
          <ellipse cx="200" cy="200" rx="146" ry="44" fill="none" stroke="rgba(94, 234, 212, 0.14)" strokeWidth="0.75" />
          <ellipse cx="200" cy="200" rx="146" ry="64" fill="none" stroke="rgba(94, 234, 212, 0.12)" strokeWidth="0.7" />
          <ellipse cx="200" cy="200" rx="146" ry="86" fill="none" stroke="rgba(94, 234, 212, 0.11)" strokeWidth="0.7" />
          <ellipse cx="200" cy="200" rx="146" ry="108" fill="none" stroke="rgba(94, 234, 212, 0.1)" strokeWidth="0.65" />
          <ellipse cx="200" cy="200" rx="146" ry="128" fill="none" stroke="rgba(94, 234, 212, 0.08)" strokeWidth="0.65" />
          <ellipse cx="200" cy="200" rx="32" ry="146" fill="none" stroke="rgba(94, 234, 212, 0.14)" strokeWidth="0.75" />
          <ellipse cx="200" cy="200" rx="64" ry="146" fill="none" stroke="rgba(94, 234, 212, 0.11)" strokeWidth="0.7" />
          <ellipse cx="200" cy="200" rx="96" ry="146" fill="none" stroke="rgba(94, 234, 212, 0.1)" strokeWidth="0.65" />
          <ellipse cx="200" cy="200" rx="124" ry="146" fill="none" stroke="rgba(94, 234, 212, 0.08)" strokeWidth="0.65" />
          <path
            d="M78 170c26-14 54-22 86-22s62 10 88 26M64 208c32 18 70 30 112 30s84-12 118-34M86 246c28 14 60 22 94 22s70-10 100-24"
            fill="none"
            stroke="rgba(94, 234, 212, 0.18)"
            strokeWidth="0.85"
          />
          <path
            d="M124 98c20 6 40 8 62 6s46-8 66-20M102 124c16 12 36 18 60 20s52-2 74-14"
            fill="none"
            stroke="rgba(94, 234, 212, 0.14)"
            strokeWidth="0.75"
          />
          <path
            d="M156 138c12-4 24-6 36-4s22 6 30 14M170 248c10 6 22 10 36 8s26-6 36-16"
            fill="none"
            stroke="rgba(94, 234, 212, 0.11)"
            strokeWidth="0.7"
          />
        </g>

        <g className="ma-reference-globe-orbit-svg" fill="none" stroke="rgba(94, 234, 212, 0.2)" strokeWidth="0.85">
          <ellipse cx="200" cy="200" rx="176" ry="58" transform="rotate(-18 200 200)" />
          <ellipse cx="200" cy="200" rx="184" ry="50" transform="rotate(24 200 200)" />
          <ellipse cx="200" cy="200" rx="168" ry="72" transform="rotate(62 200 200)" opacity="0.7" />
          <ellipse cx="200" cy="200" rx="190" ry="44" transform="rotate(-48 200 200)" opacity="0.45" />
        </g>

        <g className="ma-reference-globe-network" filter="url(#ma-ref-node-glow)">
          <g fill="none" stroke="rgba(45, 212, 191, 0.28)" strokeWidth="0.85">
            <path d="M148 158 Q188 128 214 124 T268 154" />
            <path d="M268 154 Q286 188 278 218 T246 266" />
            <path d="M246 266 Q204 286 166 272 T118 226" />
            <path d="M118 226 Q126 188 148 158" />
            <path d="M214 124 Q232 168 228 204 T246 266" opacity="0.75" />
            <path d="M148 158 Q178 204 200 228 T166 272" opacity="0.7" />
            <path d="M268 154 Q248 196 228 204 T118 226" opacity="0.65" />
            <path d="M200 228 Q236 210 278 218" opacity="0.6" />
          </g>
          <g className="ma-reference-globe-nodes">
            <circle cx="148" cy="158" r="2.8" fill="#99f6e4" />
            <circle cx="214" cy="124" r="2.5" fill="#5eead4" />
            <circle cx="268" cy="154" r="2.8" fill="#5eead4" />
            <circle cx="278" cy="218" r="2.5" fill="#2dd4bf" />
            <circle cx="246" cy="266" r="2.8" fill="#5eead4" />
            <circle cx="166" cy="272" r="2.5" fill="#99f6e4" />
            <circle cx="118" cy="226" r="2.4" fill="#2dd4bf" />
            <circle cx="200" cy="228" r="2.2" fill="#ccfbf1" opacity="0.85" />
            <circle cx="232" cy="168" r="2" fill="#5eead4" opacity="0.9" />
            <circle cx="188" cy="196" r="1.8" fill="#99f6e4" opacity="0.8" />
            <circle cx="256" cy="208" r="2" fill="#2dd4bf" opacity="0.85" />
            <circle cx="134" cy="194" r="1.8" fill="#5eead4" opacity="0.75" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function getRecommendedCta({ qualityScore, latestCase, isViewer }) {
  if (qualityScore === null) {
    return {
      to: '/ma/valuation',
      label: isViewer ? 'Ver valoración' : 'Completar valoración',
      icon: BarChart3
    };
  }
  if (!latestCase) {
    return {
      to: '/ma/valuation',
      label: isViewer ? 'Ver valoración' : 'Crear primer caso',
      icon: BarChart3
    };
  }
  if (qualityScore >= 70) {
    return {
      to: '/ma/cim',
      label: isViewer ? 'Ver report' : 'Preparar report',
      icon: FileText
    };
  }
  if (qualityScore >= 45) {
    return {
      to: '/ma/pipeline',
      label: 'Revisar pipeline',
      icon: Layers3
    };
  }
  return {
    to: '/ma/valuation',
    label: isViewer ? 'Ver valoración' : 'Reforzar valoración',
    icon: BarChart3
  };
}

function formatSignalTitle(title) {
  if (!title) return 'Incomplete Deal Picture';
  return title
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function getPhaseDescription(phaseIndex) {
  const descriptions = [
    'Filtra oportunidades iniciales y encaje estratégico.',
    'Valida calidad de información y señales financieras.',
    'Profundiza en due diligence y riesgos materiales.',
    'Define estructura económica, deuda y equity.',
    'Negocia términos y condiciones con contraparte.',
    'Cierra operación y prepara integración.'
  ];
  return descriptions[phaseIndex] || descriptions[0];
}

function getActivePipelinePhase({ hasDealData, qualityScore, hasSavedCase }) {
  if (!hasDealData) return 0;
  if (hasSavedCase) return 5;
  if (qualityScore !== null && qualityScore >= 70) return 4;
  if (qualityScore !== null && qualityScore >= 60) return 3;
  if (qualityScore !== null && qualityScore >= 55) return 2;
  if (qualityScore !== null && qualityScore >= 40) return 1;
  return 0;
}

function getPipelineDealCount({ hasDealData, savedCases }) {
  const savedCount = Array.isArray(savedCases) ? savedCases.length : 0;
  return savedCount + (hasDealData ? 1 : 0);
}

function getPipelineValueLabel({ hasDealData, activeEquityValue, savedCases, currency }) {
  const activeValue =
    hasDealData && Number.isFinite(Number(activeEquityValue)) ? Number(activeEquityValue) : 0;
  const savedValue = Array.isArray(savedCases)
    ? savedCases.reduce((sum, item) => {
        const v = Number(item?.snapshot?.equityBase);
        return Number.isFinite(v) ? sum + v : sum;
      }, 0)
    : 0;
  const total = activeValue + savedValue;
  return total !== 0 ? formatCurrency(total, currency) : 'N/A';
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
      description: 'El caso necesita razón social, sector y EBITDA normalizado antes de presentar conclusiones.'
    };
  }
  if (score >= 80) {
    return {
      title: 'Strong opportunity signal',
      posture: 'Advance',
      description: 'El deal presenta señales sólidas para avanzar a revisión profunda, manteniendo validación financiera, legal y operativa.'
    };
  }
  if (score >= 60) {
    return {
      title: 'Qualified opportunity',
      posture: 'Review',
      description: 'El deal tiene base suficiente para análisis, aunque conviene revisar riesgos, calidad de beneficios y dependencias clave.'
    };
  }
  if (score >= 40) {
    return {
      title: 'Watchlist opportunity',
      posture: 'Validate',
      description: 'El deal requiere validación adicional antes de avanzar. Prioriza calidad de información, riesgos y consistencia financiera.'
    };
  }
  return {
    title: 'Incomplete deal picture',
    posture: 'Build case',
    description: 'El caso necesita información financiera suficiente antes de presentar conclusiones.'
  };
}

function getRecommendedAction(score, latestCase) {
  if (score === null) return 'Cerrar los datos mínimos del caso antes de interpretar el score ejecutivo.';
  if (!latestCase) return 'Crear y guardar un primer caso para construir histórico de análisis.';
  if (score >= 70) return 'Preparar CIM / Executive Report y revisar el caso para presentación.';
  if (score >= 45) return 'Cerrar inputs críticos y validar riesgos antes de exportar conclusiones.';
  return 'Reforzar datos financieros antes de avanzar a valoración o reporte.';
}

export default MADashboardPage;
