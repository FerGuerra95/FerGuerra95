import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  Clock3,
  Filter,
  Globe2,
  Layers3,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Users
} from 'lucide-react';
import { Button } from '../../../shared/components/ui/Button.jsx';
import {
  PERMISSIONS,
  useAuth
} from '../../../app/providers/AuthProvider.jsx';
import { useMAStore } from '../store/maStore.jsx';
import { maDealsApi } from '../services/maDealsApi.js';
import { useValuationEngine } from '../engine/useValuationEngine.js';
import {
  buildPipelineDeals,
  getPipelineSummary,
  pipelineDealExists
} from '../engine/maPipelineDataset.js';
import { PipelineOrchestrationNetworkVisual } from '../components/PipelineOrchestrationNetworkVisual.jsx';

export { buildPipelineDeals, getPipelineSummary };

const PIPELINE_STAGES = [
  {
    id: 'screening',
    label: 'Screening',
    description: 'Initial fit, mandate logic and preliminary target review.'
  },
  {
    id: 'nda',
    label: 'NDA',
    description: 'Confidentiality, access control and buyer/seller perimeter.'
  },
  {
    id: 'due-diligence',
    label: 'Due Diligence',
    description: 'Financial, legal, commercial and operational diligence.'
  },
  {
    id: 'ic-review',
    label: 'IC Review',
    description: 'Investment committee review, memo and decision discipline.'
  },
  {
    id: 'negotiation',
    label: 'Negotiation',
    description: 'LOI, SPA perimeter, bridge items and closing conditions.'
  },
  {
    id: 'closing',
    label: 'Closing',
    description: 'Final approvals, signing, completion and archive.'
  }
];

const PRIORITY_FILTERS = [
  { value: 'all', label: 'All priorities' },
  { value: 'high', label: 'High' },
  { value: 'review', label: 'Review' },
  { value: 'watch', label: 'Watch' },
  { value: 'build', label: 'Build' }
];

const pipelineCss = `
  /* Layout-only. Materials: maPipelineMaterial.css (injected after this block). */
  .ma-pipeline-page {
    display: flex;
    flex-direction: column;
    gap: 26px;
  }

  .ma-pipeline-hero-inner {
    display: grid;
    grid-template-columns: minmax(0, 2.08fr) minmax(260px, 1fr);
    gap: clamp(20px, 2.2vw, 28px) clamp(24px, 2.8vw, 34px);
    align-items: start;
  }

  .ma-pipeline-actions {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-auto-rows: 1fr;
    gap: 12px 14px;
    margin-top: 0;
    align-items: stretch;
    justify-items: stretch;
    width: 100%;
    max-width: none;
  }

  .ma-pipeline-actions > a,
  .ma-pipeline-actions > .button {
    display: flex;
    width: 100%;
    min-width: 0;
    height: 100%;
    text-decoration: none;
  }

  .ma-pipeline-actions > a > .button,
  .ma-pipeline-actions > .button {
    display: inline-flex;
    width: 100%;
    min-width: 0;
    height: 100%;
    min-height: 44px;
    box-sizing: border-box;
    justify-content: center;
    align-items: center;
  }

  .ma-pipeline-command-bar {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;
    margin-top: 36px;
    padding-top: 0;
    width: 100%;
    max-width: none;
  }

  .ma-pipeline-command-item strong {
    display: block;
    margin-top: 8px;
    line-height: 1.25;
    overflow-wrap: anywhere;
  }

  .ma-pipeline-signal-top {
    display: flex;
    justify-content: space-between;
    gap: 18px;
    align-items: flex-start;
  }

  .ma-pipeline-signal-box strong {
    display: block;
    margin-bottom: 8px;
  }

  .ma-pipeline-signal-box p {
    margin: 0;
    line-height: 1.62;
  }

  .ma-pipeline-summary-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 18px;
  }

  .ma-pipeline-summary-top {
    display: flex;
    justify-content: space-between;
    gap: 14px;
    align-items: flex-start;
    margin-bottom: 12px;
  }

  .ma-pipeline-summary-card strong {
    display: block;
    margin-top: 6px;
    font-size: 28px;
    line-height: 1.1;
    letter-spacing: -0.03em;
  }

  .ma-pipeline-toolbar {
    display: grid;
    grid-template-columns: minmax(0, 1.4fr) minmax(160px, 0.45fr) minmax(160px, 0.45fr);
    gap: var(--ma-toolbar-gap, 14px);
    align-items: center;
    padding: 0 var(--ma-surface-padding-x, 28px);
    border-radius: 18px;
  }

  .ma-pipeline-search {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0 14px;
    border-radius: 14px;
    border: 1px solid transparent;
    min-height: 44px;
  }

  .ma-pipeline-search input {
    width: 100%;
    border: 0;
    outline: none;
    background: transparent;
    color: inherit;
    font: inherit;
  }

  .ma-pipeline-select {
    width: 100%;
    min-height: 44px;
    padding: 0 12px;
    border-radius: 14px;
    border: 1px solid transparent;
    color: inherit;
    font: inherit;
  }

  .ma-pipeline-board-header {
    display: flex;
    justify-content: space-between;
    gap: 24px;
    align-items: flex-start;
    margin-bottom: 20px;
  }

  .ma-pipeline-board {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: minmax(328px, 348px);
    gap: 16px;
    align-items: start;
    overflow-x: auto;
    padding-bottom: 8px;
  }

  .ma-pipeline-column-header {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    align-items: flex-start;
    padding-bottom: 12px;
    margin-bottom: 12px;
  }

  .ma-pipeline-deal-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .ma-deal-record-head {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    align-items: flex-start;
  }

  .ma-deal-meta {
    margin-top: 14px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .ma-deal-meta-row {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    align-items: baseline;
  }

  .ma-deal-footer {
    margin-top: 14px;
    padding-top: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
  }

  .ma-deal-owner {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  @media (max-width: 1180px) {
    .ma-pipeline-hero-inner {
      grid-template-columns: 1fr;
    }

    .ma-pipeline-summary-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .ma-pipeline-toolbar {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 680px) {
    .ma-pipeline-summary-grid,
    .ma-pipeline-command-bar,
    .ma-pipeline-actions {
      grid-template-columns: 1fr;
    }
  }
`;

export function DealPipelinePage() {
  const { can, isViewer } = useAuth();
  const { financials, settings, savedCases } = useMAStore();

  const canEditCases = can(PERMISSIONS.UPDATE_MA_CASE);
  const canExportReports = can(PERMISSIONS.CREATE_MA_REPORT);
  const canCreateDeal = can(PERMISSIONS.CREATE_MA_DEAL);

  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [backendDeals, setBackendDeals] = useState([]);
  const [isBackendLoading, setIsBackendLoading] = useState(true);
  const [isSyncingPipeline, setIsSyncingPipeline] = useState(false);
  const [pipelineError, setPipelineError] = useState('');

  const derived = useValuationEngine({
    financials,
    settings
  });

  const reportCurrency = settings?.reportCurrency || financials?.currency || 'EUR';
  const safeSavedCases = Array.isArray(savedCases) ? savedCases : [];

  async function loadBackendDeals() {
    setIsBackendLoading(true);
    setPipelineError('');

    try {
      setBackendDeals(await maDealsApi.list());
    } catch (error) {
      setPipelineError(error.message || 'No se pudo cargar el pipeline.');
      setBackendDeals([]);
    } finally {
      setIsBackendLoading(false);
    }
  }

  React.useEffect(() => {
    loadBackendDeals();
  }, []);

  const pipelineDeals = useMemo(
    () =>
      buildPipelineDeals({
        financials,
        derived,
        savedCases: safeSavedCases,
        backendDeals,
        currency: reportCurrency
      }),
    [financials, derived, safeSavedCases, backendDeals, reportCurrency]
  );

  const filteredDeals = useMemo(
    () =>
      filterPipelineDeals({
        deals: pipelineDeals,
        searchTerm,
        stageFilter,
        priorityFilter
      }),
    [pipelineDeals, searchTerm, stageFilter, priorityFilter]
  );

  const pipelineSummary = getPipelineSummary(filteredDeals, reportCurrency);
  const totalSummary = getPipelineSummary(pipelineDeals, reportCurrency);

  /* One board column only: stage holding highest priorityTone in current view. */
  const executiveFocusStageId = useMemo(
    () => resolveExecutiveFocusStageId(filteredDeals, pipelineDeals),
    [filteredDeals, pipelineDeals]
  );

  async function handleSyncPipeline() {
    if (!canCreateDeal || isSyncingPipeline) return;

    setIsSyncingPipeline(true);
    setPipelineError('');

    try {
      const candidates = pipelineDeals
        .filter((deal) => !pipelineDealExists(backendDeals, deal))
        .slice(0, 6);

      for (const deal of candidates) {
        await maDealsApi.create(toBackendDealPayload(deal));
      }

      await loadBackendDeals();
    } catch (error) {
      setPipelineError(error.message || 'No se pudo sincronizar el pipeline.');
    } finally {
      setIsSyncingPipeline(false);
    }
  }

  return (
    <div className="page">
      <style>{pipelineCss}</style>

      <div className="ma-executive-page ma-pipeline-page ma-pipeline-premium">
        <section className="ma-pipeline-hero" aria-labelledby="ma-pipeline-title">
          <div className="ma-pipeline-scene-atmo" aria-hidden="true">
            <div className="ma-pipeline-scene-glow" />
            <div className="ma-pipeline-scene-mesh" />
          </div>

          <div className="ma-pipeline-hero-inner ma-valuation-surface">
            <div className="ma-pipeline-scene-intro">
              <p className="ma-pipeline-kicker-hero">M&A Execution Board</p>

              <h1 id="ma-pipeline-title" className="ma-pipeline-title">
                <span className="ma-pipeline-title-line">M&A Deal Pipeline</span>
              </h1>

              <p className="ma-val-ref-subtitle ma-pipeline-title-sub">
                From screening to closing discipline.
              </p>

              <p className="ma-pipeline-copy">
                Vista enterprise para seguir operaciones por fase, prioridad,
                valor potencial, riesgo, responsable y siguiente paso. El
                tablero sincroniza el pipeline operativo, conserva continuidad
                de casos guardados y mantiene permisos, audit trail y revisión
                humana.
              </p>

              <p className="ma-val-ref-dss muted ma-pipeline-hero-post-band" aria-hidden="true">
                {'\u200b'}
              </p>

              <div className="ma-pipeline-execution-map" aria-hidden="true">
                <PipelineOrchestrationNetworkVisual />
              </div>

              <div className="ma-pipeline-actions">
                <Link to="/ma/valuation" className="ma-pipeline-cta-primary">
                  <Button>
                    <BarChart3 size={16} />
                    Abrir Valuation Engine
                  </Button>
                </Link>

                <Link to="/ma/deals">
                  <Button variant="secondary">
                    <BriefcaseBusiness size={16} />
                    Abrir Deal Repository
                  </Button>
                </Link>

                <Button
                  variant="secondary"
                  disabled={!canCreateDeal}
                  loading={isSyncingPipeline}
                  onClick={handleSyncPipeline}
                >
                  <RefreshCw size={16} />
                  Sincronizar pipeline
                </Button>

                <Link to="/ma/cim">
                  <Button variant="secondary">
                    <ShieldCheck size={16} />
                    Preparar report
                  </Button>
                </Link>
              </div>

              <div className="ma-pipeline-command-bar">
                <CommandItem
                  label="Pipeline model"
                  value="Screening · NDA · DD · IC · Negotiation · Closing"
                />

                <CommandItem
                  label="Tracked deals"
                  value={totalSummary.totalDeals}
                />

                <CommandItem
                  label="Data posture"
                  value={
                    backendDeals.length > 0
                      ? 'Synchronized deal pipeline'
                      : isBackendLoading
                        ? 'Loading pipeline'
                        : 'Saved deal continuity'
                  }
                />
              </div>

              {pipelineError ? (
                <div className="ma-pipeline-empty" style={{ marginTop: 18 }}>
                  <div>
                    <strong>Pipeline notice</strong>
                    <p>{pipelineError}</p>
                  </div>
                </div>
              ) : null}
            </div>

            <aside
              className="ma-pipeline-signal-card ma-valuation-status-card ma-valuation-surface"
              aria-label="Pipeline signal"
            >
              <div className="ma-pipeline-signal-inner">
                <div className="ma-pipeline-signal-top">
                  <div>
                    <div className="kpi-label">Pipeline Signal</div>
                    <div className="ma-pipeline-signal-title">
                      {getPipelineSignal(totalSummary)}
                    </div>
                  </div>

                  <div className="ma-pipeline-icon-box ma-valuation-icon-box" aria-hidden="true">
                    <span className="ma-pipeline-signal-live" />
                    <Sparkles size={18} strokeWidth={1.6} />
                  </div>
                </div>

                <div className="ma-pipeline-signal-box">
                  <strong>{getPipelineHeadline(totalSummary)}</strong>

                  <p className="muted">
                    {getPipelineDescription(totalSummary)}
                  </p>
                </div>

                <div className="ma-pipeline-signal-list">
                  <SignalRow
                    label="Total pipeline value"
                    value={totalSummary.totalEquityLabel}
                  />

                  <SignalRow
                    label="Active stages"
                    value={totalSummary.activeStages}
                  />

                  <SignalRow
                    label="Priority posture"
                    value={totalSummary.priorityLabel}
                  />
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section className="ma-pipeline-summary-grid" aria-label="Pipeline summary">
          <SummaryCard
            label="Deals visibles"
            value={pipelineSummary.totalDeals}
            description="Operaciones que cumplen los filtros actuales."
            icon={Layers3}
          />

          <SummaryCard
            label="Pipeline value"
            value={pipelineSummary.totalEquityLabel}
            description="Valor agregado estimado de los deals visibles."
            icon={TrendingUp}
          />

          <SummaryCard
            label="Fases activas"
            value={pipelineSummary.activeStages}
            description="Etapas con al menos una operación asociada."
            icon={Target}
          />

          <SummaryCard
            label="Prioridad"
            value={pipelineSummary.priorityLabel}
            description="Señal ejecutiva agregada del pipeline."
            icon={AlertTriangle}
          />
        </section>

        <section className="ma-pipeline-toolbar">
          <div className="ma-pipeline-search">
            <Search size={16} />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Buscar por target, sector, mercado o responsable..."
            />
          </div>

          <select
            className="ma-pipeline-select"
            value={stageFilter}
            onChange={(event) => setStageFilter(event.target.value)}
          >
            <option value="all">All stages</option>
            {PIPELINE_STAGES.map((stage) => (
              <option key={stage.id} value={stage.id}>
                {stage.label}
              </option>
            ))}
          </select>

          <select
            className="ma-pipeline-select"
            value={priorityFilter}
            onChange={(event) => setPriorityFilter(event.target.value)}
          >
            {PRIORITY_FILTERS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </section>

        <section className="ma-pipeline-board-shell ma-valuation-surface">
          <div className="ma-pipeline-board-header">
            <div>
              <div className="ma-pipeline-kicker">
                <Filter size={14} />
                Enterprise deal board
              </div>

              <h2>Pipeline por fases</h2>

              <p className="muted">
                Board ejecutivo de operaciones del pipeline sincronizado.
                Cada tarjeta puede evolucionar con owner, permisos, audit
                trail, data room e IC memo.
              </p>
            </div>

            <Link to="/ma/dashboard" className="ma-val-ref-cta-ghost">
              Volver al dashboard
            </Link>
          </div>

          <div className="ma-pipeline-board">
            {PIPELINE_STAGES.map((stage) => {
              const stageDeals = filteredDeals.filter(
                (deal) => deal.stageId === stage.id
              );

              return (
                <PipelineColumn
                  key={stage.id}
                  stage={stage}
                  deals={stageDeals}
                  executiveFocus={stage.id === executiveFocusStageId}
                />
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

function CommandItem({ label, value }) {
  return (
    <div className="ma-pipeline-command-item ma-valuation-surface">
      <div className="kpi-label">{label}</div>
      <strong>{value}</strong>
    </div>
  );
}

function SignalRow({ label, value }) {
  return (
    <div className="ma-pipeline-signal-row">
      <div className="kpi-label">{label}</div>
      <strong>{value}</strong>
    </div>
  );
}

function SummaryCard({ label, value, description, icon: Icon }) {
  return (
    <article className="ma-pipeline-summary-card ma-valuation-surface">
      <div className="ma-pipeline-summary-top">
        <div>
          <div className="kpi-label">{label}</div>
          <strong>{value}</strong>
        </div>

        <div className="ma-pipeline-summary-icon ma-valuation-icon-box" aria-hidden="true">
          <Icon size={18} strokeWidth={1.5} />
        </div>
      </div>

      <p className="muted">{description}</p>
    </article>
  );
}

function PipelineColumn({ stage, deals, executiveFocus = false }) {
  return (
    <section
      className={
        executiveFocus
          ? 'ma-pipeline-column is-executive-focus'
          : 'ma-pipeline-column'
      }
      data-executive-focus={executiveFocus ? 'true' : undefined}
    >
      <div className="ma-pipeline-column-header">
        <div>
          <strong>{stage.label}</strong>
          <p className="muted">{stage.description}</p>
        </div>

        <div className="ma-pipeline-count">{deals.length}</div>
      </div>

      <div className="ma-pipeline-deal-list">
        {deals.length > 0 ? (
          deals.map((deal) => (
            <PipelineDealCard key={deal.id} deal={deal} />
          ))
        ) : (
          <div className="ma-pipeline-empty">
            <div>
              <strong>No active deal</strong>
              <p>Sin operaciones en esta fase con los filtros actuales.</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function PipelineDealCard({ deal }) {
  return (
    <article className="ma-deal-card">
      {/* Dashboard left ambient + top hairline accent (board deal cards) */}
      <div className="ma-ma-panel-ambient" aria-hidden="true" />
      <div className="ma-deal-top-accent" aria-hidden="true" />

      <div className="ma-deal-record-head">
        <div className="ma-deal-record-title">
          <h3>{deal.name}</h3>
          <p className="muted ma-deal-record-sector">
            {deal.sector}
          </p>
        </div>

        <span className={`ma-deal-priority ${deal.priorityTone}`}>
          {deal.priority}
        </span>
      </div>

      <div className="ma-deal-meta">
        <DealMetaRow
          icon={Globe2}
          label="Market"
          value={deal.market}
        />

        <DealMetaRow
          icon={TrendingUp}
          label="Equity"
          value={deal.equityLabel}
        />

        <DealMetaRow
          icon={AlertTriangle}
          label="Risk"
          value={deal.riskLabel}
        />

        <DealMetaRow
          icon={Clock3}
          label="Updated"
          value={deal.updatedLabel}
        />
      </div>

      <div className="ma-deal-footer">
        <div className="ma-deal-owner">
          <Users size={13} />
          {deal.owner}
        </div>

        <Link
          to={deal.href}
          className="ma-deal-open"
          aria-label={`Abrir ${deal.name}`}
        >
          <ArrowRight size={15} />
        </Link>
      </div>
    </article>
  );
}

function DealMetaRow({ icon: Icon, label, value }) {
  return (
    <div className="ma-deal-meta-row">
      <span>
        <Icon size={12} /> {label}
      </span>
      <strong>{value}</strong>
    </div>
  );
}

function filterPipelineDeals({
  deals,
  searchTerm,
  stageFilter,
  priorityFilter
}) {
  const safeDeals = Array.isArray(deals) ? deals : [];
  const normalizedSearch = String(searchTerm || '').trim().toLowerCase();

  return safeDeals.filter((deal) => {
    const matchesStage =
      stageFilter === 'all' || deal.stageId === stageFilter;

    const matchesPriority =
      priorityFilter === 'all' || deal.priorityTone === priorityFilter;

    const searchable = [
      deal.name,
      deal.sector,
      deal.market,
      deal.owner,
      deal.priority,
      deal.riskLabel
    ]
      .join(' ')
      .toLowerCase();

    const matchesSearch =
      !normalizedSearch || searchable.includes(normalizedSearch);

    return matchesStage && matchesPriority && matchesSearch;
  });
}

function toBackendDealPayload(deal) {
  return {
    name: deal.name,
    stage: deal.stageId,
    ownerName: deal.owner,
    priority: deal.priorityTone,
    riskLevel: normalizeRiskValue(deal.riskLabel),
    status: 'active',
    nextStep: 'Review next action before IC memo',
    icMemoStatus: deal.stageId === 'ic-review' ? 'draft' : 'not_started',
    sector: deal.sector,
    market: deal.market,
    equityValue: deal.equityValue || 0,
    payload: {
      source: 'pipeline_sync',
      originalId: deal.originalId || deal.id,
      caseId: deal.caseId || '',
      equityValue: deal.equityValue || 0,
      sector: deal.sector,
      market: deal.market
    }
  };
}

function normalizeRiskValue(value) {
  const normalized = String(value || '').toLowerCase();

  if (normalized.includes('control')) return 'controlled';
  if (normalized.includes('elev')) return 'elevated';
  if (normalized.includes('mod')) return 'moderate';
  if (['low', 'medium', 'high'].includes(normalized)) return normalized;

  return 'medium';
}

/**
 * Executive focus column: stage that holds the highest existing priorityTone
 * among visible deals (high > review > watch > build). Tie-break: more deals
 * at that tone, then later pipeline stage. Falls back to fullest stage when
 * filters hide all deals. Does not invent a new business state.
 */
function resolveExecutiveFocusStageId(visibleDeals, allDeals) {
  const toneRank = { high: 4, review: 3, watch: 2, build: 1 };
  const stageIndex = Object.fromEntries(
    PIPELINE_STAGES.map((stage, index) => [stage.id, index])
  );

  const visible = Array.isArray(visibleDeals) ? visibleDeals : [];
  const all = Array.isArray(allDeals) ? allDeals : [];
  const pool = visible.length > 0 ? visible : all;

  if (pool.length === 0) return null;

  let bestTone = 0;
  const byStage = new Map();

  for (const deal of pool) {
    const stageId = deal?.stageId;
    if (!stageId || !(stageId in stageIndex)) continue;

    const tone = toneRank[deal.priorityTone] || 0;
    if (tone > bestTone) bestTone = tone;

    const prev = byStage.get(stageId) || {
      maxTone: 0,
      countAtBest: 0,
      count: 0
    };
    prev.count += 1;
    if (tone > prev.maxTone) {
      prev.maxTone = tone;
      prev.countAtBest = 1;
    } else if (tone === prev.maxTone) {
      prev.countAtBest += 1;
    }
    byStage.set(stageId, prev);
  }

  if (byStage.size === 0) return null;

  if (bestTone <= 0) {
    let focus = null;
    for (const [stageId, meta] of byStage) {
      const idx = stageIndex[stageId] ?? -1;
      if (
        !focus ||
        meta.count > focus.count ||
        (meta.count === focus.count && idx > focus.idx)
      ) {
        focus = { id: stageId, count: meta.count, idx };
      }
    }
    return focus?.id ?? null;
  }

  let focus = null;
  for (const [stageId, meta] of byStage) {
    if (meta.maxTone !== bestTone) continue;
    const idx = stageIndex[stageId] ?? -1;
    if (
      !focus ||
      meta.countAtBest > focus.countAtBest ||
      (meta.countAtBest === focus.countAtBest && idx > focus.idx)
    ) {
      focus = { id: stageId, countAtBest: meta.countAtBest, idx };
    }
  }

  return focus?.id ?? null;
}

function getPipelineSignal(summary) {
  if (!summary || summary.totalDeals === 0) return 'Pipeline not started';
  if (summary.priorityLabel === 'High') return 'High-priority pipeline';
  if (summary.activeStages >= 3) return 'Multi-stage active pipeline';

  return 'Pipeline under review';
}

function getPipelineHeadline(summary) {
  if (!summary || summary.totalDeals === 0) {
    return 'Create or save a deal to activate the enterprise pipeline.';
  }

  if (summary.priorityLabel === 'High') {
    return 'At least one deal shows high-priority execution signal.';
  }

  return 'Pipeline visible and ready for executive review.';
}

function getPipelineDescription(summary) {
  if (!summary || summary.totalDeals === 0) {
    return 'El pipeline se alimenta del caso activo y de los deals guardados. Carga un target o guarda un caso para empezar a ver operaciones por fase.';
  }

  return 'Revisa fase, prioridad, valor estimado, riesgo y responsable antes de avanzar a reporting, IC review o negociación.';
}

export default DealPipelinePage;











