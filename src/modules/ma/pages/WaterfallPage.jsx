import React from 'react';
import { ArrowDownUp, Calculator, PieChart } from 'lucide-react';
import { Card } from '../../../shared/components/ui/Card.jsx';
import { Badge } from '../../../shared/components/ui/Badge.jsx';
import {
  PERMISSIONS,
  useAuth
} from '../../../app/providers/AuthProvider.jsx';
import { formatCurrency } from '../../../shared/utils/formatCurrency.js';
import { useMAStore } from '../store/maStore.jsx';
import { useValuationEngine } from '../engine/useValuationEngine.js';
import { WaterfallPanel } from '../components/WaterfallPanel.jsx';
import { SensitivityMatrix } from '../components/SensitivityMatrix.jsx';

export function WaterfallPage() {
  const { can, isViewer } = useAuth();
  const { financials, settings } = useMAStore();

  const canEditCase = can(PERMISSIONS.UPDATE_MA_CASE);

  const derived = useValuationEngine({
    financials,
    settings
  });

  const foundersEquity = Number(financials.foundersEquity) || 0;
  const investorsEquity = 100 - foundersEquity;

  return (
    <div className="page">
      <Card>
        <div className="section-title">
          <div>
            <div className="row wrap">
              <Badge>M&A Workspace</Badge>
              {isViewer ? <Badge>Modo solo lectura</Badge> : null}
              {canEditCase ? <Badge>Edición M&A permitida</Badge> : null}
            </div>

            <h2 style={{ marginTop: 10 }}>Deal Waterfall</h2>

            <p className="muted" style={{ marginBottom: 0 }}>
              Bridge ejecutivo desde Enterprise Value hasta Equity Value y Net
              Proceeds, incorporando deuda, caja, ajustes de operación y reparto
              económico entre accionistas.
            </p>
          </div>

          <ArrowDownUp size={22} />
        </div>
      </Card>

      <div className="grid-4">
        <Card>
          <div className="kpi-label">Enterprise Value</div>
          <div className="kpi-value" style={{ fontSize: 22 }}>
            {formatCurrency(derived.evBase, settings.reportCurrency)}
          </div>
          <p className="muted" style={{ marginBottom: 0 }}>
            Valor antes de deuda y caja
          </p>
        </Card>

        <Card>
          <div className="kpi-label">Net Debt</div>
          <div className="kpi-value" style={{ fontSize: 22 }}>
            {formatCurrency(derived.netDebt, settings.reportCurrency)}
          </div>
          <p className="muted" style={{ marginBottom: 0 }}>
            Deuda neta estimada
          </p>
        </Card>

        <Card>
          <div className="kpi-label">Equity Value</div>
          <div className="kpi-value text-success" style={{ fontSize: 22 }}>
            {formatCurrency(derived.equityBase, settings.reportCurrency)}
          </div>
          <p className="muted" style={{ marginBottom: 0 }}>
            Valor atribuible al equity
          </p>
        </Card>

        <Card>
          <div className="kpi-label">Net Proceeds</div>
          <div className="kpi-value" style={{ fontSize: 22 }}>
            {formatCurrency(derived.netProceeds, settings.reportCurrency)}
          </div>
          <p className="muted" style={{ marginBottom: 0 }}>
            Caja estimada tras ajustes
          </p>
        </Card>
      </div>

      <div className="grid-2">
        <WaterfallPanel
          derived={derived}
          financials={financials}
          settings={settings}
        />

        <Card>
          <div className="section-title">
            <div>
              <h3>Cap Table Distribution</h3>
              <p className="muted" style={{ marginBottom: 0 }}>
                Reparto estimado de proceeds entre fundadores e inversores
                según la estructura de equity indicada.
              </p>
            </div>

            <PieChart size={20} />
          </div>

          <div className="grid-2">
            <div
              className="card"
              style={{ background: 'rgba(255,255,255,0.04)' }}
            >
              <div className="kpi-label">Fundadores ({foundersEquity}%)</div>
              <div className="kpi-value text-success">
                {formatCurrency(derived.foundersCash, settings.reportCurrency)}
              </div>
            </div>

            <div
              className="card"
              style={{ background: 'rgba(255,255,255,0.04)' }}
            >
              <div className="kpi-label">Inversores ({investorsEquity}%)</div>
              <div className="kpi-value">
                {formatCurrency(derived.investorsCash, settings.reportCurrency)}
              </div>
            </div>
          </div>

          <div
            className="card"
            style={{
              background: 'rgba(255,255,255,0.04)',
              marginTop: 16
            }}
          >
            <div className="row">
              <Calculator size={18} />
              <div>
                <strong>Transaction Adjustments</strong>
                <p className="muted" style={{ marginBottom: 0 }}>
                  El waterfall ayuda a explicar cómo cada ajuste transforma la
                  valoración bruta en caja final recibida por las partes.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <div className="section-title">
          <div>
            <h3>Sensitivity Analysis</h3>
            <p className="muted" style={{ marginBottom: 0 }}>
              Lectura de sensibilidad del valor ante cambios de múltiplo y
              EBITDA normalizado.
            </p>
          </div>

          <Badge>{derived.adjustedMultiple}x múltiplo ajustado</Badge>
        </div>

        <SensitivityMatrix
          matrix={derived.sensitivityMatrix}
          adjustedMultiple={derived.adjustedMultiple}
        />
      </Card>
    </div>
  );
}