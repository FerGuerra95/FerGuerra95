import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, BriefcaseBusiness, FileSearch, Target } from 'lucide-react';
import { Badge } from '../../../shared/components/ui/Badge.jsx';
import { Card } from '../../../shared/components/ui/Card.jsx';
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

export function MADashboardPage() {
  const { can, isViewer } = useAuth();
  const { financials, settings, savedCases } = useMAStore();

  const canEditCases = can(PERMISSIONS.UPDATE_MA_CASE);
  const canExportReports = can(PERMISSIONS.CREATE_MA_REPORT);

  const derived = useValuationEngine({
    financials,
    settings
  });

  const latestCase = savedCases[0] || null;

  return (
    <div className="page">
      <Card>
        <div className="section-title">
          <div>
            <div className="row wrap">
              <Badge>M&A Workspace</Badge>
              {isViewer ? <Badge>Modo solo lectura</Badge> : null}
              {canEditCases ? <Badge>Edición permitida</Badge> : null}
              {canExportReports ? <Badge>Exportación permitida</Badge> : null}
            </div>

            <h2 style={{ marginTop: 10 }}>M&A Command Center</h2>

            <p className="muted" style={{ marginBottom: 0 }}>
              Vista ejecutiva del deal activo: valoración, estructura,
              narrativa de inversión, comparables y continuidad de casos
              guardados.
            </p>
          </div>

          <div className="row wrap">
            <Link to="/ma/valuation">
              <Button>
                <BarChart3 size={16} />
                {isViewer ? 'Ver Valuation Engine' : 'Abrir Valuation Engine'}
              </Button>
            </Link>

            <Link to="/ma/deals">
              <Button variant="secondary">
                <BriefcaseBusiness size={16} />
                Ver deals
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      <div className="grid-4">
        <Card>
          <div className="kpi-label">Empresa activa</div>
          <div className="kpi-value" style={{ fontSize: 22 }}>
            {financials.name || 'Sin caso'}
          </div>
          <p className="muted" style={{ marginBottom: 0 }}>
            Caso cargado en el motor
          </p>
        </Card>

        <Card>
          <div className="kpi-label">Equity Value</div>
          <div className="kpi-value" style={{ fontSize: 22 }}>
            {formatCurrency(derived.equityBase, settings.reportCurrency)}
          </div>
          <p className="muted" style={{ marginBottom: 0 }}>
            Valor base estimado
          </p>
        </Card>

        <Card>
          <div className="kpi-label">Quality Score</div>
          <div className="kpi-value" style={{ fontSize: 22 }}>
            {derived.qualityScore}/100
          </div>
          <p className="muted" style={{ marginBottom: 0 }}>
            Calidad financiera y transferibilidad
          </p>
        </Card>

        <Card>
          <div className="kpi-label">Deals guardados</div>
          <div className="kpi-value" style={{ fontSize: 22 }}>
            {savedCases.length}
          </div>
          <p className="muted" style={{ marginBottom: 0 }}>
            Histórico disponible
          </p>
        </Card>
      </div>

      <EquityHeroCard derived={derived} settings={settings} />

      <div className="grid-2">
        <DealStructureCard derived={derived} />

        <Card>
          <h3>Investment Thesis</h3>

          <p className="muted">
            Narrativa ejecutiva generada a partir de los inputs financieros,
            scoring de calidad, múltiplo ajustado y señales del deal.
          </p>

          <ul className="list-compact">
            {derived.thesis.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="grid-2">
        <Card>
          <div className="section-title">
            <div>
              <h3>Execution Readiness</h3>
              <p className="muted" style={{ marginBottom: 0 }}>
                Accesos rápidos para completar el flujo M&A desde valoración
                hasta exportación ejecutiva.
              </p>
            </div>

            <Target size={20} />
          </div>

          <div className="stack">
            <div className="card" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <strong>1. Valuation Engine</strong>
              <p className="muted" style={{ marginBottom: 0 }}>
                Carga inputs, normaliza EBITDA, ajusta múltiplos y ejecuta el
                análisis base del activo.
              </p>
            </div>

            <div className="card" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <strong>2. Deal Design</strong>
              <p className="muted" style={{ marginBottom: 0 }}>
                Revisa estructura de deuda, caja, net proceeds, waterfall y
                palancas de negociación.
              </p>
            </div>

            <div className="card" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <strong>3. CIM / Export</strong>
              <p className="muted" style={{ marginBottom: 0 }}>
                Convierte la valoración en narrativa ejecutiva y material
                exportable para inversores o comité.
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="section-title">
            <div>
              <h3>Saved Deal Snapshot</h3>
              <p className="muted" style={{ marginBottom: 0 }}>
                Último caso guardado en el repositorio.
              </p>
            </div>

            <FileSearch size={20} />
          </div>

          {latestCase ? (
            <div className="stack">
              <div className="card" style={{ background: 'rgba(255,255,255,0.04)' }}>
                <strong>{latestCase.name}</strong>

                <p className="muted" style={{ marginBottom: 0 }}>
                  Equity base:{' '}
                  {formatCurrency(
                    latestCase.snapshot?.equityBase || 0,
                    settings.reportCurrency
                  )}
                </p>
              </div>

              <Link to="/ma/deals">
                <Button variant="secondary">
                  <BriefcaseBusiness size={16} />
                  Abrir repositorio
                </Button>
              </Link>
            </div>
          ) : (
            <p className="muted">
              Todavía no hay deals guardados. Guarda un caso desde Valuation
              Engine para construir histórico.
            </p>
          )}
        </Card>
      </div>

      <ComparablesGrid comparables={derived.comparables} />
    </div>
  );
}