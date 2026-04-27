import React, { useState } from 'react';
import {
  ChevronRight,
  Database,
  RefreshCw,
  ShieldCheck,
  Trash2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../shared/components/ui/Button.jsx';
import { Card } from '../../../shared/components/ui/Card.jsx';
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

  const latestCase = savedCases[0] || null;

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
      const next = savedCases.filter((item) => item.id !== id);

      await maCasesApi.remove(id);
      updateSavedCases(next);

      pushToast('Deal eliminado');
    } catch {
      const next = savedCases.filter((item) => item.id !== id);
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
      <Card>
        <div className="section-title">
          <div>
            <div className="row wrap">
              <Badge>M&A Workspace</Badge>
              {isViewer ? <Badge>Modo solo lectura</Badge> : null}
              {canDeleteCase ? <Badge>Eliminación permitida</Badge> : null}
            </div>

            <h2 style={{ marginTop: 10 }}>Deals Repository</h2>

            <p className="muted" style={{ marginBottom: 0 }}>
              Histórico operativo de deals M&A guardados, con snapshot de
              valoración, score de calidad, múltiplo ajustado y sincronización
              backend/local.
            </p>
          </div>

          <div className="row wrap">
            <Badge>{savedCases.length} deals</Badge>

            <Button
              variant="secondary"
              onClick={handleRefresh}
              disabled={isRefreshing || backendStatus?.isLoadingCases}
            >
              <RefreshCw size={16} />
              {isRefreshing || backendStatus?.isLoadingCases
                ? 'Sincronizando...'
                : 'Refrescar'}
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid-4">
        <Card>
          <div className="kpi-label">Deals guardados</div>
          <div className="kpi-value" style={{ fontSize: 22 }}>
            {savedCases.length}
          </div>
          <p className="muted" style={{ marginBottom: 0 }}>
            Histórico disponible
          </p>
        </Card>

        <Card>
          <div className="kpi-label">Último deal</div>
          <div className="kpi-value" style={{ fontSize: 22 }}>
            {latestCase?.name || 'N/A'}
          </div>
          <p className="muted" style={{ marginBottom: 0 }}>
            Caso más reciente
          </p>
        </Card>

        <Card>
          <div className="kpi-label">Último Equity Value</div>
          <div className="kpi-value text-success" style={{ fontSize: 22 }}>
            {latestCase
              ? formatCurrency(
                  latestCase.snapshot?.equityBase ?? 0,
                  latestCase.settings?.reportCurrency || settings.reportCurrency
                )
              : 'N/A'}
          </div>
          <p className="muted" style={{ marginBottom: 0 }}>
            Snapshot guardado
          </p>
        </Card>

        <Card>
          <div className="kpi-label">Sincronización</div>
          <div className="kpi-value" style={{ fontSize: 22 }}>
            {backendStatus?.error ? 'Local' : 'OK'}
          </div>
          <p className="muted" style={{ marginBottom: 0 }}>
            Estado backend/local
          </p>
        </Card>
      </div>

      {backendStatus?.error ? (
        <Card>
          <div className="row">
            <Database size={18} />
            <p className="muted" style={{ marginBottom: 0 }}>
              Backend no disponible. El repositorio sigue funcionando con
              guardado local.
            </p>
          </div>
        </Card>
      ) : null}

      {backendStatus?.lastSyncAt ? (
        <Card>
          <div className="row">
            <ShieldCheck size={18} />
            <p className="muted" style={{ marginBottom: 0 }}>
              Última sincronización:{' '}
              {new Date(backendStatus.lastSyncAt).toLocaleString('es-ES')}
            </p>
          </div>
        </Card>
      ) : null}

      <Card>
        <div className="section-title">
          <div>
            <h3>Deal Archive</h3>
            <p className="muted" style={{ marginBottom: 0 }}>
              Carga un deal guardado para continuar el análisis, revisar la
              valoración o exportar el reporte ejecutivo.
            </p>
          </div>

          <Database size={20} />
        </div>

        {savedCases.length === 0 ? (
          <EmptyState
            title="No hay deals guardados"
            description="Guarda un deal desde Valuation Engine para empezar a construir histórico."
          />
        ) : (
          <div className="stack">
            {savedCases.map((item) => {
              const currency =
                item.settings?.reportCurrency || settings.reportCurrency;

              return (
                <div
                  key={item.id}
                  className="card"
                  style={{ background: 'rgba(255,255,255,0.04)' }}
                >
                  <div className="section-title">
                    <div>
                      <h3 style={{ marginBottom: 6 }}>{item.name}</h3>

                      <p className="muted" style={{ marginBottom: 0 }}>
                        {formatDate(item.createdAt)} · Equity Value{' '}
                        {formatCurrency(item.snapshot?.equityBase ?? 0, currency)}
                      </p>

                      <p
                        className="muted"
                        style={{ marginBottom: 0, marginTop: 6 }}
                      >
                        Quality Score{' '}
                        {Math.round(item.snapshot?.qualityScore ?? 0)}/100 ·
                        Múltiplo x
                        {Number(item.snapshot?.adjustedMultiple ?? 0).toFixed(2)}
                      </p>
                    </div>

                    <div className="row wrap">
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
                          {deletingId === item.id ? 'Eliminando...' : 'Eliminar'}
                        </Button>
                      ) : null}
                    </div>
                  </div>

                  <div className="row wrap" style={{ marginTop: 14 }}>
                    <Badge>
                      EV {formatCurrency(item.snapshot?.evBase ?? 0, currency)}
                    </Badge>

                    <Badge>
                      EBITDA{' '}
                      {formatCurrency(
                        item.snapshot?.normalizedEbitda ?? 0,
                        currency
                      )}
                    </Badge>

                    <Badge>
                      Net Debt{' '}
                      {formatCurrency(item.snapshot?.netDebt ?? 0, currency)}
                    </Badge>

                    {item.snapshot?.riskLevel ? (
                      <Badge>{item.snapshot.riskLevel}</Badge>
                    ) : null}

                    {!canDeleteCase ? <Badge>Sin permiso de eliminación</Badge> : null}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}