import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Archive,
  CheckCircle2,
  ChevronRight,
  Clock,
  Database,
  LockKeyhole,
  RefreshCw,
  ShieldCheck,
  Trash2,
  TrendingUp
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../shared/components/ui/Button.jsx';
import { EmptyState } from '../../../shared/components/ui/EmptyState.jsx';
import { Modal } from '../../../shared/components/ui/Modal.jsx';
import { formatDate } from '../../../shared/utils/date.js';
import { formatCurrency } from '../../../shared/utils/formatCurrency.js';
import {
  PERMISSIONS,
  useAuth
} from '../../../app/providers/AuthProvider.jsx';
import { useNotifications } from '../../../app/providers/NotificationsProvider.jsx';
import { useMAStore } from '../store/maStore.jsx';
import { maCasesApi } from '../services/maCasesApi.js';
import {
  formatRepositoryDealCount,
  getDealPostureLabel,
  getDealUpdatedAt,
  getRepositoryAccessLabel,
  getRepositoryHealth
} from '../engine/maRepositoryCoherence.js';
import {
  ValuationContextStrip,
  ValuationHero,
  ValuationUpperSuite
} from '../components/valuation/ValuationPageLayout.jsx';
import { RepositoryStreamFieldVisual } from '../components/RepositoryStreamFieldVisual.jsx';
import { MAScoreRing } from '../components/MAScoreRing.jsx';

export function DealsRepositoryPage() {
  const { can, isViewer } = useAuth();

  const {
    savedCases,
    updateSavedCases,
    refreshSavedCases,
    backendStatus,
    setFinancials,
    setSettings,
    settings
  } = useMAStore();

  const { pushToast } = useNotifications();
  const navigate = useNavigate();

  const canDeleteCase = can(PERMISSIONS.DELETE_MA_CASE);
  const canEditCase = can(PERMISSIONS.UPDATE_MA_CASE);
  const accessLabel = getRepositoryAccessLabel({
    canDeleteCase,
    canEditCase
  });

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [deletingId, setDeletingId] = useState('');
  const [pendingArchiveId, setPendingArchiveId] = useState('');

  const safeSavedCases = Array.isArray(savedCases) ? savedCases : [];
  const latestCase = safeSavedCases[0] || null;
  const latestCurrency =
    latestCase?.settings?.reportCurrency || settings?.reportCurrency || 'EUR';
  const latestEquityValue = latestCase
    ? formatCurrency(latestCase.snapshot?.equityBase ?? 0, latestCurrency)
    : 'N/A';

  const repositoryHealth = getRepositoryHealth({
    count: safeSavedCases.length,
    backendStatus
  });

  const hasRepositoryScore = repositoryHealth.score !== null;
  const repositoryRingSize = 120;

  function handleLoadCase(item) {
    if (!item?.financials) {
      pushToast('No se pudieron cargar los datos financieros del caso');
      return;
    }

    setFinancials(item.financials);

    if (item.settings) {
      setSettings(item.settings);
    }

    pushToast(isViewer ? 'Deal cargado en modo consulta' : 'Deal cargado');
    navigate('/ma/valuation');
  }

  async function handleArchive(id) {
    if (!canDeleteCase) {
      pushToast('No tienes permisos para archivar deals');
      return;
    }

    if (!id) return;

    setDeletingId(id);

    try {
      await maCasesApi.remove(id);
      updateSavedCases(safeSavedCases.filter((item) => item.id !== id));
      setPendingArchiveId('');
      pushToast('Deal archivado. El histórico interno permanece recuperable.');
    } catch {
      pushToast('No se pudo archivar el deal. El registro sigue visible.');
    } finally {
      setDeletingId('');
    }
  }

  async function handleRefresh() {
    setIsRefreshing(true);

    try {
      await refreshSavedCases();
      pushToast('Deals sincronizados');
    } catch {
      pushToast('No se pudo sincronizar con backend');
    } finally {
      setIsRefreshing(false);
    }
  }

  return (
    <div className="page">
      <div className="ma-executive-page ma-repository-premium ma-repository-page ma-valuation-premium-page">
        <ValuationUpperSuite>
          <ValuationHero titleId="ma-repository-title">
            <div
              className="ma-val-ref-scene-atmo ma-repository-stream-atmo"
              aria-hidden="true"
            >
              <div className="ma-repository-stream-stage" aria-hidden="true">
                <RepositoryStreamFieldVisual />
              </div>
            </div>

            <div className="ma-val-ref-scene-layout">
              <div className="ma-val-ref-scene-intro">
                <p className="ma-val-ref-kicker">M&A Private Archive</p>

                <h1 id="ma-repository-title" className="ma-val-ref-title">
                  <span className="ma-val-ref-title-line ma-repository-title-unified">
                    Deals Repository.
                  </span>
                </h1>

                <p className="ma-val-ref-subtitle">
                  Private continuity for every M&A case.
                </p>

                <p className="ma-val-ref-lead muted">
                  Histórico operativo de deals guardados con snapshot de
                  valoración, score de calidad, múltiplo ajustado,
                  sincronización backend/local y continuidad de análisis por
                  organización.
                </p>

                <p className="ma-val-ref-dss muted">
                  Decision support only · Human review required · Saved
                  snapshots · Not live engine
                </p>

                <div className="ma-valuation-actions">
                  <Button
                    onClick={handleRefresh}
                    disabled={isRefreshing || backendStatus?.isLoadingCases}
                    loading={isRefreshing || backendStatus?.isLoadingCases}
                  >
                    <RefreshCw size={16} />
                    {isRefreshing || backendStatus?.isLoadingCases
                      ? 'Sincronizando...'
                      : 'Refrescar repositorio'}
                  </Button>
                </div>
              </div>

              <aside
                className="ma-repository-signal ma-valuation-status-card ma-valuation-surface"
                aria-label="Repository status"
              >
                <div className="ma-repository-signal-inner">
                  <div className="ma-repository-signal-top">
                    <div>
                      <div className="kpi-label">Repository Status</div>
                      <div className="ma-repository-signal-title">
                        {repositoryHealth.title}
                      </div>
                    </div>

                    <div className="ma-repository-icon-box" aria-hidden="true">
                      <Archive size={21} strokeWidth={1.6} />
                    </div>
                  </div>

                  <div className="ma-repository-score-module">
                    <MAScoreRing
                      value={hasRepositoryScore ? repositoryHealth.score : null}
                      size={repositoryRingSize}
                      variant="repository"
                      ringClassName="ma-repository-score-ring"
                      svgClassName="ma-score-ring-svg"
                      coreClassName="ma-repository-score-core"
                      figureClassName="ma-repository-score-figure"
                      emptyClassName="is-empty-score"
                      figureAs="strong"
                    />

                    <div className="ma-repository-score-copy">
                      <strong>{repositoryHealth.posture}</strong>
                      <p>{repositoryHealth.description}</p>
                    </div>
                  </div>

                  <div className="ma-repository-signal-table">
                    <SignalRow
                      label="Deals stored"
                      value={safeSavedCases.length}
                    />
                    <SignalRow
                      label="Saved snapshot: adjusted equity"
                      value={latestEquityValue}
                    />
                    <SignalRow
                      label="Backend"
                      value={
                        backendStatus?.error ? 'Local fallback' : 'Available'
                      }
                    />
                    <SignalRow
                      label="Access"
                      value={accessLabel}
                    />
                  </div>
                </div>
              </aside>
            </div>
          </ValuationHero>

          <ValuationContextStrip>
            <div
              className="ma-valuation-command-bar ma-valuation-command-strip ma-valuation-surface"
              aria-label="Repository metrics strip"
            >
              <CommandItem
                label="Repository size"
                value={formatRepositoryDealCount(safeSavedCases.length)}
              />

              <CommandItem
                label="Latest deal"
                value={latestCase?.name || 'N/A'}
                multiline
              />

              <CommandItem
                label="Repository posture"
                value={repositoryHealth.posture}
              />
            </div>
          </ValuationContextStrip>
        </ValuationUpperSuite>

        <section className="ma-repository-section">
          <SectionHeader
            kicker="Repository overview"
            icon={Database}
            title="Deal archive at a glance"
            description="Histórico privado de operaciones, último snapshot económico y estado de continuidad del repositorio."
          />

          <div className="ma-repository-kpi-grid">
            <KpiCard
              label="Deals guardados"
              value={safeSavedCases.length}
              description="Histórico disponible"
              footIcon={Archive}
            />
            <KpiCard
              label="Último deal"
              value={formatDealKpiLines(latestCase?.name || 'N/A')}
              description="Caso más reciente"
              footIcon={Clock}
              multilineValue
            />
            <KpiCard
              label="Saved adjusted equity"
              value={latestEquityValue}
              description="Saved valuation snapshot — not live engine"
              footIcon={TrendingUp}
            />
            <KpiCard
              label="Sincronización"
              value={backendStatus?.error ? 'Local' : 'OK'}
              description="Estado backend/local"
              cornerIcon={ShieldCheck}
              statusDot
            />
          </div>
        </section>

        {backendStatus?.error ? (
          <StateCard tone="warning" icon={AlertTriangle}>
            Backend no disponible. El repositorio sigue funcionando con guardado
            local.
          </StateCard>
        ) : null}

        {backendStatus?.lastSyncAt ? (
          <StateCard tone="success" icon={CheckCircle2}>
            Última sincronización:{' '}
            {new Date(backendStatus.lastSyncAt).toLocaleString('es-ES')}
          </StateCard>
        ) : null}

        <section
          className="ma-repository-archive ma-valuation-surface"
          style={{
            backdropFilter: 'blur(18px) saturate(135%)',
            WebkitBackdropFilter: 'blur(18px) saturate(135%)'
          }}
        >
          <div className="ma-ma-panel-ambient" aria-hidden="true" />

          <div className="ma-repository-archive-header">
            <div>
              <div className="ma-repository-kicker">
                <LockKeyhole size={14} />
                Private archive
              </div>
              <h2>Private Deal Archive</h2>
              <p className="muted">
                Consulta casos guardados, recupera snapshots y conserva
                continuidad ejecutiva entre sesiones.
              </p>
            </div>

            <div className="ma-repository-archive-count">
              <span className="kpi-label">Visible cases</span>
              <strong>{safeSavedCases.length}</strong>
            </div>
          </div>

          {safeSavedCases.length === 0 ? (
            <div className="ma-repository-empty">
              <EmptyState
                title="Repositorio sin deals guardados"
                description="Guarda un deal desde valoración para activar histórico y continuidad de análisis."
              />
            </div>
          ) : (
            <div className="ma-repository-record-list">
              {safeSavedCases.map((item) => {
                const currency =
                  item.settings?.reportCurrency ||
                  settings?.reportCurrency ||
                  'EUR';
                const equityValue = formatCurrency(
                  item.snapshot?.equityBase ?? 0,
                  currency
                );
                const evBase = formatCurrency(
                  item.snapshot?.evBase ?? 0,
                  currency
                );
                const normalizedEbitda = formatCurrency(
                  item.snapshot?.normalizedEbitda ?? 0,
                  currency
                );
                const netDebt = formatCurrency(
                  item.snapshot?.netDebt ?? 0,
                  currency
                );
                const qualityScore = Math.round(
                  item.snapshot?.qualityScore ?? 0
                );
                const adjustedMultiple = Number(
                  item.snapshot?.adjustedMultiple ?? 0
                ).toFixed(2);
                const rowAccessLabel = accessLabel;
                const postureLabel = getDealPostureLabel(item);
                const updatedAt = getDealUpdatedAt(item);

                return (
                  <article key={item.id} className="ma-repository-record">
                    <div className="ma-repository-record-accent" aria-hidden="true" />

                    <div className="ma-repository-record-grid">
                      <div className="ma-repository-record-case">
                        <h3 className="ma-repository-case-name">{item.name}</h3>
                        <p className="ma-repository-case-meta">
                          EV {evBase} · EBITDA {normalizedEbitda} · Quality{' '}
                          {qualityScore}/100 · {currency} · x{adjustedMultiple}
                          {!canDeleteCase
                            ? ' · Sin permiso de archivo'
                            : ''}
                        </p>
                        {item.id ? (
                          <p className="ma-repository-case-id" title={item.id}>
                            {item.id}
                          </p>
                        ) : null}
                      </div>

                      <div className="ma-repository-record-field">
                        <span className="ma-repository-field-label">
                          Saved equity
                        </span>
                        <span
                          className={
                            Number(item.snapshot?.equityBase ?? 0) === 0
                              ? 'ma-repository-field-value ma-repository-field-value--quiet'
                              : 'ma-repository-field-value'
                          }
                        >
                          {equityValue}
                        </span>
                      </div>

                      <div className="ma-repository-record-field">
                        <span className="ma-repository-field-label">
                          Net debt
                        </span>
                        <span
                          className={
                            Number(item.snapshot?.netDebt ?? 0) === 0
                              ? 'ma-repository-field-value ma-repository-field-value--quiet'
                              : 'ma-repository-field-value'
                          }
                        >
                          {netDebt}
                        </span>
                      </div>

                      <div className="ma-repository-record-field">
                        <span className="ma-repository-field-label">
                          Updated
                        </span>
                        <span className="ma-repository-field-value">
                          {formatDate(updatedAt)}
                        </span>
                      </div>

                      <div className="ma-repository-record-field">
                        <span className="ma-repository-field-label">
                          Access / risk
                        </span>
                        <span className="ma-repository-field-value">
                          {rowAccessLabel}
                        </span>
                        <span className="ma-repository-field-sub">
                          {postureLabel}
                        </span>
                      </div>

                      <div className="ma-repository-record-actions">
                        <Button
                          variant="secondary"
                          onClick={() => handleLoadCase(item)}
                        >
                          <ChevronRight size={16} />
                          {isViewer ? 'Ver deal' : 'Cargar deal'}
                        </Button>

                        {canDeleteCase ? (
                          <Button
                            variant="danger"
                            className="ma-repository-delete"
                            onClick={() => setPendingArchiveId(item.id)}
                            disabled={deletingId === item.id}
                          >
                            <Trash2 size={14} />
                            {deletingId === item.id
                              ? 'Archivando...'
                              : 'Archivar'}
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <Modal
          open={Boolean(pendingArchiveId)}
          title="Archivar deal"
          onClose={() => {
            if (!deletingId) setPendingArchiveId('');
          }}
        >
          <p className="muted">
            El deal saldrá del repositorio activo y quedará archivado. Reports,
            secure shares y documentos del Data Room siguen vinculados. No es un
            borrado destructivo.
          </p>
          <div className="ma-valuation-actions">
            <Button
              variant="danger"
              onClick={() => handleArchive(pendingArchiveId)}
              disabled={!pendingArchiveId || Boolean(deletingId)}
              loading={Boolean(deletingId)}
            >
              Confirmar archivo
            </Button>
            <Button
              variant="secondary"
              onClick={() => setPendingArchiveId('')}
              disabled={Boolean(deletingId)}
            >
              Cancelar
            </Button>
          </div>
        </Modal>
      </div>
    </div>
  );
}

function CommandItem({ label, value, multiline = false }) {
  return (
    <div
      className={`ma-valuation-strip-cell${multiline ? ' is-value-multiline' : ''}`}
    >
      <div className="kpi-label">{label}</div>
      <strong>{value}</strong>
    </div>
  );
}

function SignalRow({ label, value }) {
  return (
    <div className="ma-repository-signal-row">
      <span className="muted">{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function formatDealKpiLines(name) {
  if (!name || name === 'N/A') return name;
  const words = String(name).trim().split(/\s+/).filter(Boolean);
  if (words.length <= 1) return words[0] ?? name;
  if (words.length === 2) return `${words[0]}\n${words[1]}`;
  if (words.length === 3) return words.join('\n');
  if (words.length === 4) {
    return `${words[0]} ${words[1]}\n${words[2]}\n${words[3]}`;
  }
  const line1 = words.slice(0, 2).join(' ');
  const line2 = words.slice(2, -1).join(' ');
  const line3 = words[words.length - 1];
  return `${line1}\n${line2}\n${line3}`;
}

function KpiCard({
  label,
  value,
  description,
  footIcon: FootIcon,
  cornerIcon: CornerIcon,
  multilineValue = false,
  statusDot = false
}) {
  return (
    <article className="ma-repository-kpi ma-valuation-surface">
      <div className="ma-repository-kpi-spark" aria-hidden="true" />
      <div className="ma-repository-kpi-label-row">
        <div className="kpi-label">{label}</div>
        {CornerIcon ? (
          <div className="ma-repository-kpi-corner-icon" aria-hidden="true">
            <CornerIcon size={16} strokeWidth={1.6} />
          </div>
        ) : null}
      </div>
      <div
        className={`ma-repository-kpi-value-slot${
          multilineValue ? ' is-multiline' : ''
        }`}
      >
        <div className="ma-repository-kpi-value">{value}</div>
      </div>
      <footer className="ma-repository-kpi-footer">
        <div className="ma-repository-kpi-divider" aria-hidden="true" />
        <div className="ma-repository-kpi-footnote">
          {statusDot ? (
            <span className="ma-repository-kpi-status-dot" aria-hidden="true" />
          ) : FootIcon ? (
            <FootIcon
              className="ma-repository-kpi-foot-icon"
              size={12}
              strokeWidth={1.8}
              aria-hidden="true"
            />
          ) : null}
          <span>{description}</span>
        </div>
      </footer>
    </article>
  );
}

function SectionHeader({ kicker, icon: Icon, title, description }) {
  return (
    <div className="ma-repository-section-header">
      <div>
        <div className="ma-repository-kicker">
          <Icon size={14} />
          {kicker}
        </div>
        <h2>{title}</h2>
        <p className="muted">{description}</p>
      </div>
    </div>
  );
}

function StateCard({ children, tone = 'neutral', icon: Icon = Activity }) {
  const toneClass = tone === 'neutral' ? '' : tone;

  return (
    <div
      className={`ma-repository-state ${toneClass}`.trim()}
      style={{
        backdropFilter: 'blur(14px) saturate(140%)',
        WebkitBackdropFilter: 'blur(14px) saturate(140%)'
      }}
    >
      <div className="ma-repository-state-icon">
        <Icon size={15} strokeWidth={1.7} />
      </div>
      <p className="muted">{children}</p>
    </div>
  );
}

