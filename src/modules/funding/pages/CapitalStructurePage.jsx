import React from 'react';
import { Landmark, PieChart, ShieldCheck, TrendingDown } from 'lucide-react';
import { Card } from '../../../shared/components/ui/Card.jsx';
import { Badge } from '../../../shared/components/ui/Badge.jsx';
import { useFundingStore } from '../store/fundingStore.jsx';
import { useFundingEngine } from '../engine/useFundingEngine.js';
import { CapitalStructureCard } from '../components/CapitalStructureCard.jsx';
import { formatCurrency } from '../../../shared/utils/formatCurrency.js';

function toNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function CapitalStructurePage() {
  const { fundingInputs, fundingSettings } = useFundingStore();

  const derived = useFundingEngine({
    fundingInputs,
    fundingSettings
  });

  const founderOwnership = toNumber(fundingInputs.founderOwnership);
  const existingInvestorOwnership = toNumber(
    fundingInputs.existingInvestorOwnership
  );
  const optionPool = toNumber(fundingInputs.optionPool);
  const debtCapacity = toNumber(fundingInputs.debtCapacity);

  const totalCurrentOwnership =
    founderOwnership + existingInvestorOwnership + optionPool;

  const unallocatedOwnership = Math.max(0, 100 - totalCurrentOwnership);

  return (
    <div className="page">
      <Card>
        <div className="section-title">
          <div>
            <Badge>Funding Workspace</Badge>

            <h2 style={{ marginTop: 10 }}>Capital Structure</h2>

            <p className="muted" style={{ marginBottom: 0 }}>
              Vista ejecutiva de pre-money, post-money, dilución, ownership,
              option pool y capacidad de deuda antes de salir al mercado.
            </p>
          </div>

          <PieChart size={22} />
        </div>
      </Card>

      <div className="grid-4">
        <Card>
          <div className="kpi-label">Pre-money</div>
          <div className="kpi-value" style={{ fontSize: 22 }}>
            {formatCurrency(
              derived.preMoneyValuation,
              fundingSettings.reportCurrency
            )}
          </div>
          <p className="muted" style={{ marginBottom: 0 }}>
            Valoración antes de la ronda
          </p>
        </Card>

        <Card>
          <div className="kpi-label">Post-money</div>
          <div className="kpi-value text-success" style={{ fontSize: 22 }}>
            {formatCurrency(
              derived.postMoneyValuation,
              fundingSettings.reportCurrency
            )}
          </div>
          <p className="muted" style={{ marginBottom: 0 }}>
            Valoración tras la ronda
          </p>
        </Card>

        <Card>
          <div className="kpi-label">Dilución estimada</div>
          <div className="kpi-value text-danger" style={{ fontSize: 22 }}>
            {Number(derived.dilutionPct || 0).toFixed(1)}%
          </div>
          <p className="muted" style={{ marginBottom: 0 }}>
            Participación cedida
          </p>
        </Card>

        <Card>
          <div className="kpi-label">Capacidad de deuda</div>
          <div className="kpi-value" style={{ fontSize: 22 }}>
            {formatCurrency(debtCapacity, fundingSettings.reportCurrency)}
          </div>
          <p className="muted" style={{ marginBottom: 0 }}>
            Alternativa no dilutiva
          </p>
        </Card>
      </div>

      <div className="grid-2">
        <CapitalStructureCard derived={derived} />

        <Card>
          <div className="section-title">
            <div>
              <h3>Ownership Overview</h3>
              <p className="muted" style={{ marginBottom: 0 }}>
                Lectura rápida del reparto actual y margen no asignado antes de
                simular la ronda.
              </p>
            </div>

            <Landmark size={20} />
          </div>

          <div className="stack">
            <div className="card" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <div className="kpi-label">Fundadores</div>
              <div className="kpi-value text-success">{founderOwnership}%</div>
            </div>

            <div className="card" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <div className="kpi-label">Inversores actuales</div>
              <div className="kpi-value">{existingInvestorOwnership}%</div>
            </div>

            <div className="card" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <div className="kpi-label">Option pool / equipo</div>
              <div className="kpi-value">{optionPool}%</div>
            </div>

            <div className="card" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <div className="kpi-label">No asignado / ajuste</div>
              <div className="kpi-value">{unallocatedOwnership}%</div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid-2">
        <Card>
          <div className="section-title">
            <div>
              <h3>Dilution Analysis</h3>
              <p className="muted" style={{ marginBottom: 0 }}>
                Impacto estimado de la ronda sobre la estructura de capital.
              </p>
            </div>

            <TrendingDown size={20} />
          </div>

          <div className="stack">
            <div className="card" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <strong>Capital nuevo</strong>
              <p className="muted" style={{ marginBottom: 0 }}>
                La ronda introduce capital para extender runway, ejecutar el plan
                comercial y financiar el crecimiento.
              </p>
            </div>

            <div className="card" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <strong>Dilución esperada</strong>
              <p className="muted" style={{ marginBottom: 0 }}>
                La dilución debe ser coherente con el tamaño de la ronda, la
                valoración pre-money y la ambición del plan de crecimiento.
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="section-title">
            <div>
              <h3>Debt Capacity</h3>
              <p className="muted" style={{ marginBottom: 0 }}>
                Lectura de deuda como complemento o alternativa parcial a equity.
              </p>
            </div>

            <ShieldCheck size={20} />
          </div>

          <p className="muted">
            La capacidad de deuda puede reducir dilución, pero exige capacidad de
            repago, visibilidad de ingresos y control del burn. Debe usarse como
            palanca prudente, no como sustituto automático de equity.
          </p>

          <div className="row wrap">
            <Badge>
              Debt capacity{' '}
              {formatCurrency(debtCapacity, fundingSettings.reportCurrency)}
            </Badge>

            <Badge>{fundingSettings.scenarioMode}</Badge>
          </div>
        </Card>
      </div>
    </div>
  );
}