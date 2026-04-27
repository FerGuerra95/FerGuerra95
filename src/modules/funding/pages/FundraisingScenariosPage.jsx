import React from 'react';
import { Gauge, LineChart, ShieldAlert, TrendingUp } from 'lucide-react';
import { Card } from '../../../shared/components/ui/Card.jsx';
import { Badge } from '../../../shared/components/ui/Badge.jsx';
import { useFundingStore } from '../store/fundingStore.jsx';
import { useFundingEngine } from '../engine/useFundingEngine.js';
import { ScenarioTable } from '../components/ScenarioTable.jsx';
import { formatCurrency } from '../../../shared/utils/formatCurrency.js';

function toNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function calculateRunwayMonths({ currentCash, raiseAmount, monthlyBurn }) {
  if (monthlyBurn <= 0) return 0;
  return Math.round((currentCash + raiseAmount) / monthlyBurn);
}

function calculateDilution({ raiseAmount, preMoneyValuation }) {
  const postMoney = preMoneyValuation + raiseAmount;

  if (postMoney <= 0) return 0;

  return (raiseAmount / postMoney) * 100;
}

export function FundraisingScenariosPage() {
  const { fundingInputs, fundingSettings } = useFundingStore();

  const derived = useFundingEngine({
    fundingInputs,
    fundingSettings
  });

  const currency = fundingSettings.reportCurrency;

  const currentCash = toNumber(fundingInputs.currentCash);
  const targetRaise = toNumber(fundingInputs.targetRaise);
  const monthlyBurn = toNumber(fundingInputs.monthlyBurn);
  const preMoneyValuation = toNumber(fundingInputs.preMoneyValuation);

  const lowCaseRaise = targetRaise * 0.75;
  const baseCaseRaise = targetRaise;
  const highCaseRaise = targetRaise * 1.25;

  const baseRunway = calculateRunwayMonths({
    currentCash,
    raiseAmount: baseCaseRaise,
    monthlyBurn
  });

  const baseDilution = calculateDilution({
    raiseAmount: baseCaseRaise,
    preMoneyValuation
  });

  return (
    <div className="page">
      <Card>
        <div className="section-title">
          <div>
            <Badge>Funding Workspace</Badge>

            <h2 style={{ marginTop: 10 }}>Fundraising Scenarios</h2>

            <p className="muted" style={{ marginBottom: 0 }}>
              Modelización de escenarios low, base y high para analizar capital
              objetivo, runway, dilución estimada y sensibilidad antes de salir
              al mercado.
            </p>
          </div>

          <LineChart size={22} />
        </div>
      </Card>

      <div className="grid-4">
        <Card>
          <div className="kpi-label">Low Case</div>
          <div className="kpi-value" style={{ fontSize: 22 }}>
            {formatCurrency(lowCaseRaise, currency)}
          </div>
          <p className="muted" style={{ marginBottom: 0 }}>
            Raise conservador
          </p>
        </Card>

        <Card>
          <div className="kpi-label">Base Case</div>
          <div className="kpi-value text-success" style={{ fontSize: 22 }}>
            {formatCurrency(baseCaseRaise, currency)}
          </div>
          <p className="muted" style={{ marginBottom: 0 }}>
            Capital objetivo actual
          </p>
        </Card>

        <Card>
          <div className="kpi-label">High Case</div>
          <div className="kpi-value" style={{ fontSize: 22 }}>
            {formatCurrency(highCaseRaise, currency)}
          </div>
          <p className="muted" style={{ marginBottom: 0 }}>
            Raise expansivo
          </p>
        </Card>

        <Card>
          <div className="kpi-label">Runway Base</div>
          <div className="kpi-value" style={{ fontSize: 22 }}>
            {baseRunway} meses
          </div>
          <p className="muted" style={{ marginBottom: 0 }}>
            Caja actual + ronda
          </p>
        </Card>
      </div>

      <div className="grid-2">
        <Card>
          <div className="section-title">
            <div>
              <h3>Scenario Overview</h3>
              <p className="muted" style={{ marginBottom: 0 }}>
                Lectura ejecutiva del escenario base y su impacto sobre runway,
                dilución y capacidad de ejecución.
              </p>
            </div>

            <Gauge size={20} />
          </div>

          <div className="stack">
            <div className="card" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <strong>Runway impact</strong>
              <p className="muted" style={{ marginBottom: 0 }}>
                Con el escenario base, la compañía alcanzaría aproximadamente{' '}
                <strong>{baseRunway} meses</strong> de runway, asumiendo el burn
                mensual indicado.
              </p>
            </div>

            <div className="card" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <strong>Dilution impact</strong>
              <p className="muted" style={{ marginBottom: 0 }}>
                La dilución estimada del escenario base sería de aproximadamente{' '}
                <strong>{baseDilution.toFixed(1)}%</strong> sobre post-money.
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="section-title">
            <div>
              <h3>Scenario Logic</h3>
              <p className="muted" style={{ marginBottom: 0 }}>
                Criterio para comparar escenarios antes de presentar la ronda a
                inversores.
              </p>
            </div>

            <TrendingUp size={20} />
          </div>

          <div className="stack">
            <div className="card" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <strong>Low case</strong>
              <p className="muted" style={{ marginBottom: 0 }}>
                Escenario prudente para cerrar una ronda menor, reducir riesgo
                de ejecución y validar tracción.
              </p>
            </div>

            <div className="card" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <strong>Base case</strong>
              <p className="muted" style={{ marginBottom: 0 }}>
                Escenario recomendado según los inputs actuales de capital,
                valoración, burn y runway objetivo.
              </p>
            </div>

            <div className="card" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <strong>High case</strong>
              <p className="muted" style={{ marginBottom: 0 }}>
                Escenario expansivo para acelerar crecimiento, contratación o
                desarrollo de producto.
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <div className="section-title">
          <div>
            <h3>Low / Base / High Case</h3>
            <p className="muted" style={{ marginBottom: 0 }}>
              Tabla comparativa de raise, dilución y runway para decidir qué
              escenario presentar como narrativa principal.
            </p>
          </div>

          <ShieldAlert size={20} />
        </div>

        <ScenarioTable
          scenarioRows={derived.scenarioRows}
          currency={fundingSettings.reportCurrency}
        />
      </Card>
    </div>
  );
}