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
import { MAIntelligenceFieldVisual } from '../components/MAIntelligenceFieldVisual.jsx';
import { MAScoreRing } from '../components/MAScoreRing.jsx';
import {
  getActivePipelinePhase,
  getCanonicalStageFromScore
} from '../engine/maDealLifecycle.js';
import '../styles/maDashboardMaterial.css';

export { getActivePipelinePhase, getCanonicalStageFromScore };

export const PIPELINE_PHASES = [
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
    qualityScore
  });

  const activePhaseName = PIPELINE_PHASES[activePipelinePhase] || PIPELINE_PHASES[0];
  const activePhaseDescription = getPhaseDescription(activePipelinePhase);
  const recommendedAction = getRecommendedAction({
    score: qualityScore,
    latestCase,
    phaseIndex: activePipelinePhase
  });
  const recommendedCta = getRecommendedCta({
    qualityScore,
    latestCase,
    isViewer,
    phaseIndex: activePipelinePhase
  });

  return (
    <div className="page">
      <div className="ma-executive-page ma-dashboard-premium">
        <div className="ma-reference-page">
          <section className="ma-reference-scene" aria-labelledby="ma-reference-title">
            <div className="ma-reference-scene-atmo" aria-hidden="true">
              <div className="ma-reference-scene-glow" />
              <div className="ma-reference-scene-mesh" />
            </div>

            <div className="ma-reference-scene-stage" aria-hidden="true">
              <MAIntelligenceFieldVisual />
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

                <MAScoreRing
                  value={qualityScore}
                  size={224}
                  variant="executive"
                  showDenom
                  ringClassName="ma-reference-signal-ring"
                  svgClassName="ma-reference-signal-ring-svg"
                  coreClassName="ma-reference-signal-ring-core"
                  figureClassName="ma-reference-signal-figure"
                  denomClassName="ma-reference-signal-denom"
                />

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
                <BriefcaseBusiness size={22} strokeWidth={1.5} />
              </div>
              <div className="ma-reference-strip-focus-copy">
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
                <p>{recommendedAction}</p>
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
              meta={
                latestCase ? (
                  <strong className="ma-reference-bottom-highlight" title={latestCase.name}>
                    {latestCase.name}
                  </strong>
                ) : (
                  <strong className="ma-reference-bottom-highlight">Sin casos guardados</strong>
                )
              }
              readout={
                latestCase ? (
                  <div className="ma-reference-snapshot-readout">
                    <ReadoutRow caption="Saved equity" data={latestEquityLabel} />
                    <ReadoutRow caption="Status" data="Disponible" />
                  </div>
                ) : (
                  <div className="ma-reference-snapshot-readout">
                    <ReadoutRow caption="Saved equity" data="—" />
                    <ReadoutRow caption="Status" data="Vacío" />
                  </div>
                )
              }
              action={
                latestCase ? (
                  <Link to="/ma/deals">
                    <Button variant="secondary">
                      <BriefcaseBusiness size={16} />
                      Abrir repositorio
                    </Button>
                  </Link>
                ) : (
                  <Link to="/ma/valuation">
                    <Button variant="secondary">
                      <BarChart3 size={16} />
                      Crear primer caso
                    </Button>
                  </Link>
                )
              }
            />

            <BottomSlab
              kicker="Private Repository"
              title="M&A archive"
              note="Saved snapshots and recoverable deal history."
              readout={
                <div className="ma-reference-snapshot-readout">
                  <ReadoutRow caption="Saved cases" data={String(safeSavedCases.length)} />
                  <ReadoutRow caption="Access" data={latestCase ? 'Disponible' : 'Vacío'} />
                </div>
              }
              action={
                latestCase ? (
                  <Link to="/ma/deals" className="ma-reference-inline-link">
                    Ver repositorio
                    <ArrowRight size={14} />
                  </Link>
                ) : (
                  <p className="muted ma-reference-inline-note">Sin snapshots guardados todavía.</p>
                )
              }
            />

            <BottomSlab
              kicker="Deal posture"
              title="Executive context"
              note="Live posture — not a directive."
              readout={
                <div className="ma-reference-snapshot-readout">
                  <ReadoutRow caption="Priority" data={pipelinePriority} />
                  <ReadoutRow caption="Phase" data={activePhaseName} />
                  <ReadoutRow caption="Signal" data={`${qualitySignal.posture} recommended`} />
                </div>
              }
            />
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
      <div className="ma-reference-workbench-copy">
        <strong className="ma-reference-workbench-title">{title}</strong>
        <p className="ma-reference-workbench-desc muted">{description}</p>
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

function BottomSlab({ kicker, title, note, meta = null, readout = null, action = null }) {
  return (
    <article className="ma-reference-bottom-slab ma-valuation-surface">
      <p className="ma-reference-kicker">{kicker}</p>
      <h3 className="ma-reference-bottom-title">{title}</h3>
      <p className="muted ma-reference-bottom-note">{note}</p>
      <div className="ma-reference-bottom-meta">{meta}</div>
      <div className="ma-reference-bottom-readout-slot">{readout}</div>
      <div className="ma-reference-bottom-action">{action}</div>
    </article>
  );
}

function getRecommendedCta({ qualityScore, latestCase, isViewer, phaseIndex = 0 }) {
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
  if (phaseIndex >= 5) {
    return {
      to: '/ma/pipeline',
      label: 'Revisar cierre',
      icon: Layers3
    };
  }
  if (phaseIndex >= 4) {
    return {
      to: '/ma/pipeline',
      label: 'Revisar pipeline',
      icon: Layers3
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

export function getRecommendedAction({ score, latestCase, phaseIndex = 0 }) {
  if (score === null) return 'Cerrar los datos mínimos del caso antes de interpretar el score ejecutivo.';
  if (!latestCase) return 'Crear y guardar un primer caso para construir histórico de análisis.';
  if (phaseIndex >= 5) {
    return 'Resolver condiciones de cierre, validar documentación final y preparar el handoff post-close / PMI.';
  }
  if (phaseIndex >= 4) {
    return 'Alinear LOI, perímetro SPA y condiciones de cierre antes de signing.';
  }
  if (score >= 70) return 'Preparar CIM / Executive Report y revisar el caso para presentación.';
  if (score >= 45) return 'Cerrar inputs críticos y validar riesgos antes de exportar conclusiones.';
  return 'Reforzar datos financieros antes de avanzar a valoración o reporte.';
}

export default MADashboardPage;
