import React from 'react';
import { BriefcaseBusiness, Target, Users } from 'lucide-react';
import { Card } from '../../../shared/components/ui/Card.jsx';
import { Badge } from '../../../shared/components/ui/Badge.jsx';
import {
  PERMISSIONS,
  useAuth
} from '../../../app/providers/AuthProvider.jsx';
import { useMAStore } from '../store/maStore.jsx';
import { useValuationEngine } from '../engine/useValuationEngine.js';
import { BuyerMatchGrid } from '../components/BuyerMatchGrid.jsx';

export function BuyerMatchingPage() {
  const { can, isViewer } = useAuth();
  const { financials, settings } = useMAStore();

  const canEditCase = can(PERMISSIONS.UPDATE_MA_CASE);
  const canExportReport = can(PERMISSIONS.CREATE_MA_REPORT);

  const derived = useValuationEngine({
    financials,
    settings
  });

  const buyerMatches = derived.buyerMatches || [];
  const topBuyer = buyerMatches[0] || null;

  const strategicBuyers = buyerMatches.filter((buyer) =>
    String(buyer.type || '').toLowerCase().includes('strategic')
  );

  const financialBuyers = buyerMatches.filter((buyer) =>
    String(buyer.type || '').toLowerCase().includes('financial')
  );

  return (
    <div className="page">
      <Card>
        <div className="section-title">
          <div>
            <div className="row wrap">
              <Badge>M&A Workspace</Badge>
              {isViewer ? <Badge>Modo solo lectura</Badge> : null}
              {canEditCase ? <Badge>Edición M&A permitida</Badge> : null}
              {canExportReport ? <Badge>Exportación permitida</Badge> : null}
            </div>

            <h2 style={{ marginTop: 10 }}>Buyer Matching</h2>

            <p className="muted" style={{ marginBottom: 0 }}>
              Traduce la calidad del activo, la recurrencia de ingresos, el
              riesgo operativo y la estructura financiera en perfiles de
              comprador accionables.
            </p>
          </div>

          <Users size={22} />
        </div>
      </Card>

      <div className="grid-4">
        <Card>
          <div className="kpi-label">Perfiles detectados</div>
          <div className="kpi-value" style={{ fontSize: 22 }}>
            {buyerMatches.length}
          </div>
          <p className="muted" style={{ marginBottom: 0 }}>
            Compradores potenciales
          </p>
        </Card>

        <Card>
          <div className="kpi-label">Strategic Buyers</div>
          <div className="kpi-value" style={{ fontSize: 22 }}>
            {strategicBuyers.length}
          </div>
          <p className="muted" style={{ marginBottom: 0 }}>
            Encaje industrial o sinergias
          </p>
        </Card>

        <Card>
          <div className="kpi-label">Financial Buyers</div>
          <div className="kpi-value" style={{ fontSize: 22 }}>
            {financialBuyers.length}
          </div>
          <p className="muted" style={{ marginBottom: 0 }}>
            Fondos, search funds o inversores
          </p>
        </Card>

        <Card>
          <div className="kpi-label">Top Match</div>
          <div className="kpi-value" style={{ fontSize: 22 }}>
            {topBuyer?.fitScore ? `${topBuyer.fitScore}/100` : 'N/A'}
          </div>
          <p className="muted" style={{ marginBottom: 0 }}>
            Mejor encaje estimado
          </p>
        </Card>
      </div>

      <div className="grid-2">
        <Card>
          <div className="section-title">
            <div>
              <h3>Buyer Fit Score</h3>
              <p className="muted" style={{ marginBottom: 0 }}>
                El matching prioriza compradores según tamaño del deal,
                estabilidad del EBITDA, calidad del activo, riesgo de ejecución
                y capacidad de aportar valor después de la compra.
              </p>
            </div>

            <Target size={20} />
          </div>

          <div className="stack">
            <div className="card" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <strong>Strategic rationale</strong>
              <p className="muted" style={{ marginBottom: 0 }}>
                Compradores industriales pueden pagar mejor si existen sinergias,
                acceso a clientes, tecnología, equipo o expansión geográfica.
              </p>
            </div>

            <div className="card" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <strong>Financial rationale</strong>
              <p className="muted" style={{ marginBottom: 0 }}>
                Fondos e inversores financieros priorizan recurrencia, margen,
                escalabilidad, baja dependencia del fundador y claridad del
                plan de crecimiento.
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="section-title">
            <div>
              <h3>Match Rationale</h3>
              <p className="muted" style={{ marginBottom: 0 }}>
                Lectura ejecutiva del tipo de comprador más adecuado para el
                activo analizado.
              </p>
            </div>

            <BriefcaseBusiness size={20} />
          </div>

          {topBuyer ? (
            <div className="stack">
              <div className="card" style={{ background: 'rgba(255,255,255,0.04)' }}>
                <strong>{topBuyer.name || 'Comprador prioritario'}</strong>
                <p className="muted" style={{ marginBottom: 0 }}>
                  {topBuyer.rationale ||
                    'Perfil con alto encaje según calidad del activo, tamaño de operación y narrativa del deal.'}
                </p>
              </div>

              <div className="row wrap">
                {topBuyer.type ? <Badge>{topBuyer.type}</Badge> : null}
                {topBuyer.fitScore ? <Badge>{topBuyer.fitScore}/100 fit</Badge> : null}
                {isViewer ? <Badge>Solo lectura</Badge> : null}
              </div>
            </div>
          ) : (
            <p className="muted">
              Completa la valoración para generar perfiles de comprador
              accionables.
            </p>
          )}
        </Card>
      </div>

      <BuyerMatchGrid buyers={buyerMatches} />
    </div>
  );
}