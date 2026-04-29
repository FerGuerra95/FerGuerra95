import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Archive,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronRight,
  Database,
  FileSearch,
  LockKeyhole,
  RefreshCw,
  ShieldCheck,
  Trash2,
  TrendingUp
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../shared/components/ui/Button.jsx';
import { EmptyState } from '../../../shared/components/ui/EmptyState.jsx';
import { Badge } from '../../../shared/components/ui/Badge.jsx';
import { formatDate } from '../../../shared/utils/date.js';
import { formatCurrency } from '../../../shared/utils/formatCurrency.js';
import {
  PERMISSIONS,
  useAuth
} from '../../../app/providers/AuthProvider.jsx';
import { useNotifications } from '../../../app/providers/NotificationsProvider.jsx';
import { useMAStore } from '../store/maStore.jsx';
import { maCasesApi } from '../services/maCasesApi.js';

const dealsRepositoryCss = `
  .deals-page {
    width: min(1540px, 100%);
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 38px;
  }

  .deals-hero {
    position: relative;
    overflow: visible;
    border-radius: 38px;
    padding: 42px 46px 52px;
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

  .deals-hero::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background:
      linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px);
    background-size: 50px 50px;
    mask-image: linear-gradient(to bottom, rgba(0,0,0,0.9), transparent 82%);
    pointer-events: none;
  }

  .deals-hero::after {
    content: "";
    position: absolute;
    inset: auto -90px -120px auto;
    width: 360px;
    height: 360px;
    border-radius: 999px;
    background: radial-gradient(circle, rgba(16, 185, 129, 0.13), transparent 70%);
    pointer-events: none;
  }

  .deals-hero-layout {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(340px, 400px);
    gap: 38px;
    align-items: center;
  }

  .deals-hero-main {
    min-width: 0;
    max-width: 860px;
  }

  .deals-badge-row {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    align-items: center;
    margin-bottom: 26px;
  }

  .deals-title {
    margin: 0;
    max-width: 860px;
    font-size: clamp(38px, 4.4vw, 64px);
    line-height: 0.94;
    letter-spacing: -0.072em;
  }

  .deals-title span {
    display: block;
    margin-top: 8px;
    color: rgba(226, 232, 240, 0.7);
  }

  .deals-copy {
    max-width: 800px;
    margin: 26px 0 0;
    font-size: 17px;
    line-height: 1.82;
    color: rgba(203, 213, 225, 0.86);
  }

  .deals-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
    margin-top: 34px;
  }

  .deals-command-bar {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;
    margin-top: 34px;
    padding-top: 28px;
    border-top: 1px solid rgba(148, 163, 184, 0.16);
  }

  .deals-command-item {
    padding: 18px;
    border-radius: 22px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.078);
    min-width: 0;
  }

  .deals-command-item strong {
    display: block;
    margin-top: 8px;
    line-height: 1.25;
    overflow-wrap: anywhere;
  }

  .deals-signal-card {
    position: relative;
    width: 100%;
    max-width: 400px;
    justify-self: end;
    align-self: center;
    border-radius: 30px;
    padding: 22px;
    margin: 0;
    background:
      linear-gradient(135deg, rgba(255,255,255,0.086), rgba(255,255,255,0.026)),
      rgba(15, 23, 42, 0.76);
    border: 1px solid rgba(148, 163, 184, 0.2);
    backdrop-filter: blur(22px);
    display: flex;
    flex-direction: column;
    gap: 18px;
    box-shadow:
      0 26px 70px rgba(0, 0, 0, 0.24),
      inset 0 1px 0 rgba(255,255,255,0.05);
  }

  .deals-signal-card::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: radial-gradient(circle at 18% 0%, rgba(96, 165, 250, 0.13), transparent 35%);
    pointer-events: none;
  }

  .deals-signal-inner {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: 18px;
    min-width: 0;
  }

  .deals-signal-top {
    display: flex;
    justify-content: space-between;
    gap: 18px;
    align-items: flex-start;
  }

  .deals-icon-box,
  .deals-card-icon,
  .deals-panel-icon {
    flex: 0 0 auto;
    display: grid;
    place-items: center;
    border-radius: 18px;
    background: rgba(37, 99, 235, 0.16);
    border: 1px solid rgba(96, 165, 250, 0.24);
  }

  .deals-icon-box {
    width: 50px;
    height: 50px;
  }

  .deals-card-icon,
  .deals-panel-icon {
    width: 46px;
    height: 46px;
  }

  .deals-signal-title {
    margin-top: 10px;
    font-size: 23px;
    line-height: 1.16;
    letter-spacing: -0.04em;
  }

  .deals-score-module {
    display: grid;
    grid-template-columns: 96px minmax(0, 1fr);
    gap: 16px;
    align-items: center;
    padding: 16px;
    border-radius: 24px;
    background: rgba(255, 255, 255, 0.047);
    border: 1px solid rgba(255, 255, 255, 0.085);
    min-width: 0;
  }

  .deals-score-ring {
    width: 94px;
    height: 94px;
    border-radius: 999px;
    display: grid;
    place-items: center;
    background:
      conic-gradient(rgba(16, 185, 129, 0.96) var(--score-angle), rgba(255,255,255,0.09) 0deg);
    box-shadow:
      0 18px 40px rgba(0, 0, 0, 0.28),
      0 0 34px rgba(16, 185, 129, 0.16);
  }

  .deals-score-core {
    width: 70px;
    height: 70px;
    border-radius: 999px;
    display: grid;
    place-items: center;
    background: rgba(15, 23, 42, 0.97);
    border: 1px solid rgba(255, 255, 255, 0.08);
  }

  .deals-score-core strong {
    font-size: 23px;
    letter-spacing: -0.055em;
  }

  .deals-score-copy {
    min-width: 0;
  }

  .deals-score-copy strong {
    display: block;
    margin-bottom: 8px;
  }

  .deals-score-copy p {
    margin: 0;
    line-height: 1.58;
  }

  .deals-signal-table {
    display: grid;
    gap: 0;
  }

  .deals-signal-row {
    display: grid;
    grid-template-columns: minmax(0, 0.86fr) minmax(0, 1.14fr);
    gap: 14px;
    align-items: center;
    padding: 12px 0;
    border-top: 1px solid rgba(148, 163, 184, 0.14);
  }

  .deals-signal-row strong {
    text-align: right;
    overflow-wrap: anywhere;
  }

  .deals-section {
    display: flex;
    flex-direction: column;
    gap: 26px;
  }

  .deals-section-header {
    display: flex;
    justify-content: space-between;
    gap: 28px;
    align-items: flex-end;
  }

  .deals-kicker {
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

  .deals-section-header h2,
  .deals-section-header h3 {
    margin: 0;
    letter-spacing: -0.045em;
  }

  .deals-section-header p {
    max-width: 820px;
    margin: 11px 0 0;
    line-height: 1.68;
  }

  .deals-grid {
    display: grid;
    gap: 26px;
    align-items: stretch;
  }

  .deals-grid-kpis {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .deals-kpi-card,
  .deals-panel,
  .deals-case-card {
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

  .deals-kpi-card {
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

  .deals-kpi-card:hover {
    transform: translateY(-3px);
    border-color: rgba(96, 165, 250, 0.25);
    background:
      linear-gradient(135deg, rgba(255,255,255,0.078), rgba(255,255,255,0.03)),
      rgba(15, 23, 42, 0.78);
  }

  .deals-kpi-top {
    display: flex;
    justify-content: space-between;
    gap: 18px;
    align-items: flex-start;
  }

  .deals-kpi-value {
    margin-top: 12px;
    font-size: 25px;
    font-weight: 790;
    line-height: 1.12;
    letter-spacing: -0.045em;
    overflow-wrap: anywhere;
  }

  .deals-kpi-card p {
    margin: 0;
    line-height: 1.56;
  }

  .deals-state-card {
    border-radius: 25px;
    padding: 22px;
    border: 1px solid rgba(148, 163, 184, 0.16);
    background:
      linear-gradient(135deg, rgba(255,255,255,0.055), rgba(255,255,255,0.022)),
      rgba(15, 23, 42, 0.6);
    display: grid;
    grid-template-columns: 38px minmax(0, 1fr);
    gap: 16px;
    align-items: flex-start;
  }

  .deals-state-card.warning {
    border-color: rgba(245, 158, 11, 0.26);
    background:
      linear-gradient(135deg, rgba(245,158,11,0.11), rgba(255,255,255,0.022)),
      rgba(15, 23, 42, 0.64);
  }

  .deals-state-card.success {
    border-color: rgba(16, 185, 129, 0.26);
    background:
      linear-gradient(135deg, rgba(16,185,129,0.11), rgba(255,255,255,0.022)),
      rgba(15, 23, 42, 0.64);
  }

  .deals-state-icon {
    width: 38px;
    height: 38px;
    border-radius: 15px;
    display: grid;
    place-items: center;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.08);
  }

  .deals-state-card p {
    margin: 0;
    line-height: 1.62;
  }

  .deals-panel {
    padding: 31px;
    display: flex;
    flex-direction: column;
    gap: 26px;
  }

  .deals-panel-header {
    display: flex;
    justify-content: space-between;
    gap: 24px;
    align-items: flex-start;
  }

  .deals-panel-title {
    margin: 0;
    letter-spacing: -0.045em;
  }

  .deals-panel-description {
    margin: 11px 0 0;
    line-height: 1.66;
  }

  .deals-archive-list {
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  .deals-case-card {
    padding: 26px;
    transition:
      transform .18s ease,
      border-color .18s ease,
      background .18s ease;
  }

  .deals-case-card:hover {
    transform: translateY(-2px);
    border-color: rgba(96, 165, 250, 0.24);
    background:
      linear-gradient(135deg, rgba(255,255,255,0.078), rgba(255,255,255,0.03)),
      rgba(15, 23, 42, 0.78);
  }

  .deals-case-head {
    display: flex;
    justify-content: space-between;
    gap: 24px;
    align-items: flex-start;
  }

  .deals-case-title {
    margin: 0;
    letter-spacing: -0.04em;
  }

  .deals-case-meta {
    margin: 9px 0 0;
    line-height: 1.58;
  }

  .deals-case-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    justify-content: flex-end;
    align-items: center;
  }

  .deals-case-metrics {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 14px;
    margin-top: 22px;
  }

  .deals-case-metric {
    padding: 16px;
    border-radius: 20px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.075);
  }

  .deals-case-metric strong {
    display: block;
    margin-top: 7px;
    overflow-wrap: anywhere;
  }

  .deals-chip-row {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 18px;
  }

  .deals-empty-wrap {
    border-radius: 26px;
    padding: 34px;
    border: 1px dashed rgba(148, 163, 184, 0.24);
    background: rgba(255,255,255,0.025);
  }

  .deals-muted-tight {
    margin-bottom: 0;
  }

  @media (max-width: 1280px) {
    .deals-hero {
      overflow: hidden;
    }

    .deals-hero-layout {
      grid-template-columns: 1fr;
    }

    .deals-signal-card {
      max-width: none;
      justify-self: stretch;
    }

    .deals-grid-kpis,
    .deals-case-metrics {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 920px) {
    .deals-command-bar {
      grid-template-columns: 1fr;
    }

    .deals-section-header,
    .deals-case-head {
      align-items: flex-start;
      flex-direction: column;
    }

    .deals-case-actions {
      justify-content: flex-start;
    }
  }

  @media (max-width: 680px) {
    .deals-page {
      gap: 28px;
    }

    .deals-hero {
      padding: 26px;
      border-radius: 28px;
    }

    .deals-grid-kpis,
    .deals-case-metrics {
      grid-template-columns: 1fr;
    }

    .deals-kpi-card,
    .deals-panel,
    .deals-case-card {
      border-radius: 24px;
    }

    .deals-score-module {
      grid-template-columns: 1fr;
    }

    .deals-signal-row {
      grid-template-columns: 1fr;
      gap: 7px;
    }

    .deals-signal-row strong {
      text-align: left;
    }
  }
`;

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

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [deletingId, setDeletingId] = useState('');

  const safeSavedCases = Array.isArray(savedCases) ? savedCases : [];
  const latestCase = safeSavedCases[0] || null;
  const latestCurrency =
    latestCase?.settings?.reportCurrency || settings?.reportCurrency || 'EUR';
  const latestEquityValue = latestCase
    ? formatCurrency(latestCase.snapshot?.equityBase ?? 0, latestCurrency)
    : 'N/A';

  const syncSignal = getSyncSignal(backendStatus);
  const repositoryScore = getRepositoryScore({
    count: safeSavedCases.length,
    backendStatus
  });
  const scoreAngle = `${repositoryScore * 3.6}deg`;

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

  async function handleDelete(id) {
    if (!canDeleteCase) {
      pushToast('No tienes permisos para eliminar deals');
      return;
    }

    if (!id) return;

    setDeletingId(id);

    try {
      const next = safeSavedCases.filter((item) => item.id !== id);

      await maCasesApi.remove(id);
      updateSavedCases(next);

      pushToast('Deal eliminado');
    } catch {
      const next = safeSavedCases.filter((item) => item.id !== id);
      updateSavedCases(next);

      pushToast('Deal eliminado en local');
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
      <style>{dealsRepositoryCss}</style>

      <div className="deals-page">
        <section className="deals-hero">
          <div className="deals-hero-layout">
            <div className="deals-hero-main">
              <div className="deals-badge-row">
                <Badge>M&A Workspace</Badge>
                <Badge>Private Deal Archive</Badge>
                {isViewer ? <Badge>Modo solo lectura</Badge> : null}
                {canDeleteCase ? (
                  <Badge>Eliminación permitida</Badge>
                ) : (
                  <Badge>Sin permiso de eliminación</Badge>
                )}
              </div>

              <h1 className="deals-title">
                Deals Repository.
                <span>Private continuity for every M&A case.</span>
              </h1>

              <p className="deals-copy">
                Histórico operativo de deals guardados con snapshot de
                valoración, score de calidad, múltiplo ajustado, sincronización
                backend/local y continuidad de análisis por organización.
              </p>

              <div className="deals-actions">
                <Button
                  variant="secondary"
                  onClick={handleRefresh}
                  disabled={isRefreshing || backendStatus?.isLoadingCases}
                >
                  <RefreshCw size={16} />
                  {isRefreshing || backendStatus?.isLoadingCases
                    ? 'Sincronizando...'
                    : 'Refrescar repositorio'}
                </Button>
              </div>

              <div className="deals-command-bar">
                <CommandItem
                  label="Repository size"
                  value={`${safeSavedCases.length} deals`}
                />

                <CommandItem
                  label="Latest deal"
                  value={latestCase?.name || 'N/A'}
                />

                <CommandItem
                  label="Sync posture"
                  value={syncSignal.posture}
                />
              </div>
            </div>

            <aside className="deals-signal-card">
              <div className="deals-signal-inner">
                <div className="deals-signal-top">
                  <div>
                    <div className="kpi-label">Repository Signal</div>
                    <div className="deals-signal-title">
                      {syncSignal.title}
                    </div>
                  </div>

                  <div className="deals-icon-box">
                    <Archive size={21} />
                  </div>
                </div>

                <div className="deals-score-module">
                  <div
                    className="deals-score-ring"
                    style={{ '--score-angle': scoreAngle }}
                  >
                    <div className="deals-score-core">
                      <strong>{repositoryScore}</strong>
                    </div>
                  </div>

                  <div className="deals-score-copy">
                    <strong>{syncSignal.posture}</strong>

                    <p className="muted">
                      {syncSignal.description}
                    </p>
                  </div>
                </div>

                <div className="deals-signal-table">
                  <SignalRow
                    label="Deals stored"
                    value={safeSavedCases.length}
                  />

                  <SignalRow
                    label="Latest equity"
                    value={latestEquityValue}
                  />

                  <SignalRow
                    label="Backend"
                    value={backendStatus?.error ? 'Local fallback' : 'Available'}
                  />

                  <SignalRow
                    label="Access"
                    value={canDeleteCase ? 'Manage' : 'Read-only'}
                  />
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section className="deals-section">
          <SectionHeader
            kicker="Repository overview"
            icon={Database}
            title="Deal archive at a glance"
            description="Resumen rápido del histórico M&A disponible, último caso guardado, snapshot económico y estado de sincronización."
          />

          <div className="deals-grid deals-grid-kpis">
            <KpiCard
              label="Deals guardados"
              value={safeSavedCases.length}
              description="Histórico disponible"
              icon={BriefcaseBusiness}
            />

            <KpiCard
              label="Último deal"
              value={latestCase?.name || 'N/A'}
              description="Caso más reciente"
              icon={FileSearch}
            />

            <KpiCard
              label="Último Equity Value"
              value={latestEquityValue}
              description="Snapshot guardado"
              icon={TrendingUp}
              success
            />

            <KpiCard
              label="Sincronización"
              value={backendStatus?.error ? 'Local' : 'OK'}
              description="Estado backend/local"
              icon={ShieldCheck}
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

        <section className="deals-panel">
          <div className="deals-panel-header">
            <div>
              <div className="deals-kicker">
                <LockKeyhole size={14} />
                Private archive
              </div>

              <h2 className="deals-panel-title">Deal Archive</h2>

              <p className="muted deals-panel-description">
                Carga un deal guardado para continuar el análisis, revisar la
                valoración o exportar el reporte ejecutivo.
              </p>
            </div>

            <div className="deals-panel-icon">
              <Database size={18} />
            </div>
          </div>

          {safeSavedCases.length === 0 ? (
            <div className="deals-empty-wrap">
              <EmptyState
                title="No hay deals guardados"
                description="Guarda un deal desde Valuation Engine para empezar a construir histórico."
              />
            </div>
          ) : (
            <div className="deals-archive-list">
              {safeSavedCases.map((item) => {
                const currency =
                  item.settings?.reportCurrency ||
                  settings?.reportCurrency ||
                  'EUR';
                const equityValue = formatCurrency(
                  item.snapshot?.equityBase ?? 0,
                  currency
                );
                const evBase = formatCurrency(item.snapshot?.evBase ?? 0, currency);
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

                return (
                  <article key={item.id} className="deals-case-card">
                    <div className="deals-case-head">
                      <div>
                        <h3 className="deals-case-title">{item.name}</h3>

                        <p className="muted deals-case-meta">
                          {formatDate(item.createdAt)} · Equity Value {equityValue}
                        </p>

                        <p className="muted deals-case-meta">
                          Quality Score {qualityScore}/100 · Múltiplo x
                          {adjustedMultiple}
                        </p>
                      </div>

                      <div className="deals-case-actions">
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
                            onClick={() => handleDelete(item.id)}
                            disabled={deletingId === item.id}
                          >
                            <Trash2 size={16} />
                            {deletingId === item.id
                              ? 'Eliminando...'
                              : 'Eliminar'}
                          </Button>
                        ) : null}
                      </div>
                    </div>

                    <div className="deals-case-metrics">
                      <CaseMetric label="Enterprise Value" value={evBase} />
                      <CaseMetric label="EBITDA normalizado" value={normalizedEbitda} />
                      <CaseMetric label="Net Debt" value={netDebt} />
                      <CaseMetric label="Quality Score" value={`${qualityScore}/100`} />
                    </div>

                    <div className="deals-chip-row">
                      {item.snapshot?.riskLevel ? (
                        <Badge>{item.snapshot.riskLevel}</Badge>
                      ) : null}

                      <Badge>x{adjustedMultiple} multiple</Badge>
                      <Badge>{currency}</Badge>

                      {!canDeleteCase ? (
                        <Badge>Sin permiso de eliminación</Badge>
                      ) : null}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function CommandItem({ label, value }) {
  return (
    <div className="deals-command-item">
      <div className="kpi-label">{label}</div>
      <strong>{value}</strong>
    </div>
  );
}

function SignalRow({ label, value }) {
  return (
    <div className="deals-signal-row">
      <span className="muted">{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function KpiCard({ label, value, description, icon: Icon, success = false }) {
  return (
    <article className="deals-kpi-card">
      <div className="deals-kpi-top">
        <div>
          <div className="kpi-label">{label}</div>

          <div className={`deals-kpi-value ${success ? 'text-success' : ''}`}>
            {value}
          </div>
        </div>

        <div className="deals-card-icon">
          <Icon size={18} />
        </div>
      </div>

      <p className="muted">{description}</p>
    </article>
  );
}

function CaseMetric({ label, value }) {
  return (
    <div className="deals-case-metric">
      <div className="kpi-label">{label}</div>
      <strong>{value}</strong>
    </div>
  );
}

function SectionHeader({ kicker, icon: Icon, title, description }) {
  return (
    <div className="deals-section-header">
      <div>
        <div className="deals-kicker">
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
    <div className={`deals-state-card ${toneClass}`.trim()}>
      <div className="deals-state-icon">
        <Icon size={18} />
      </div>

      <p className="muted">{children}</p>
    </div>
  );
}

function getSyncSignal(backendStatus) {
  if (backendStatus?.error) {
    return {
      title: 'Local repository mode',
      posture: 'Local fallback',
      description:
        'El repositorio sigue operativo en local, aunque conviene recuperar sincronización backend para persistencia completa.'
    };
  }

  if (backendStatus?.lastSyncAt) {
    return {
      title: 'Repository synchronized',
      posture: 'Synced',
      description:
        'Los deals guardados están sincronizados y disponibles para continuidad de análisis.'
    };
  }

  return {
    title: 'Repository ready',
    posture: 'Ready',
    description:
      'El repositorio está preparado para cargar, consultar y mantener continuidad entre casos M&A.'
  };
}

function getRepositoryScore({ count, backendStatus }) {
  if (backendStatus?.error) return count > 0 ? 55 : 35;
  if (count >= 5) return 92;
  if (count >= 2) return 82;
  if (count === 1) return 72;

  return 45;
}
