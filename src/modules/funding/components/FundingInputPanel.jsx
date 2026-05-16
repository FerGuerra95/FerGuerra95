import React from 'react';
import { Card } from '../../../shared/components/ui/Card.jsx';
import { Input } from '../../../shared/components/ui/Input.jsx';
import { Select } from '../../../shared/components/ui/Select.jsx';
import { STAGE_OPTIONS } from '../engine/fundingFormulas.js';

const SCENARIO_MODE_OPTIONS = [
  { label: 'Conservador', value: 'conservative' },
  { label: 'Equilibrado', value: 'balanced' },
  { label: 'Agresivo', value: 'aggressive' }
];

function SliderField({ label, value, onChange }) {
  return (
    <div className="slider-row">
      <div className="deal-row-head">
        <span>{label}</span>
        <span>{value}%</span>
      </div>

      <input
        type="range"
        min="0"
        max="100"
        step="5"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function FieldShell({ children, className = '' }) {
  return (
    <div className={`funding-field-shell ${className}`.trim()}>
      {children}
    </div>
  );
}

export function FundingInputPanel({
  fundingInputs,
  fundingSettings,
  onFieldChange,
  onSettingsChange
}) {
  return (
    <div className="stack funding-input-rail ceos-ws-panel">
      <style>
        {`
          .funding-form-grid-2,
          .funding-capital-grid {
            display: grid;
            gap: 16px;
            align-items: start;
          }

          .funding-form-grid-2 {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .funding-capital-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }

          .funding-field-shell {
            width: 100%;
            min-width: 0;
          }

          .funding-field-shell > * {
            width: 100%;
            min-width: 0;
          }

          .funding-field-shell input,
          .funding-field-shell select {
            width: 100%;
          }

          /*
            FIX 1 — Preparación para inversores
          */
          .funding-team-grid-fix {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 16px;
            align-items: start;
          }

          .funding-team-field-shell {
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            min-width: 0;
          }

          .funding-team-field-shell > * {
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            width: 100%;
            min-width: 0;
          }

          .funding-team-field-shell label {
            display: flex;
            align-items: flex-start;
            line-height: 1.2;
            min-height: 42px;
            margin-bottom: 8px;
          }

          .funding-team-field-shell input {
            width: 100%;
            min-height: 52px;
          }

          /*
            FIX 2 — Estructura de capital
          */
          .funding-capital-field-shell {
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            min-width: 0;
          }

          .funding-capital-field-shell > * {
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            width: 100%;
            min-width: 0;
          }

          .funding-capital-field-shell label {
            display: flex;
            align-items: flex-start;
            line-height: 1.2;
            min-height: 64px;
            margin-bottom: 8px;
          }

          .funding-capital-field-shell input {
            width: 100%;
            min-height: 54px;
          }

          /*
            FIX 3 — SOLO para:
            Crecimiento anual (%) / Margen bruto (%)
          */
          .funding-growth-grid-fix {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 16px;
            align-items: start;
          }

          .funding-growth-field-shell {
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            min-width: 0;
          }

          .funding-growth-field-shell > * {
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            width: 100%;
            min-width: 0;
          }

          .funding-growth-field-shell label {
            display: flex;
            align-items: flex-start;
            line-height: 1.2;
            min-height: 42px;
            margin-bottom: 8px;
          }

          .funding-growth-field-shell input {
            width: 100%;
            min-height: 52px;
          }

          @media (max-width: 980px) {
            .funding-capital-grid {
              grid-template-columns: 1fr;
            }

            .funding-capital-field-shell label {
              min-height: auto;
              margin-bottom: 6px;
            }
          }

          @media (max-width: 760px) {
            .funding-form-grid-2,
            .funding-team-grid-fix,
            .funding-growth-grid-fix {
              grid-template-columns: 1fr;
            }

            .funding-team-field-shell label,
            .funding-growth-field-shell label {
              min-height: auto;
              margin-bottom: 6px;
            }
          }
        `}
      </style>

      <Card>
        <h3>Base de financiación</h3>

        <div className="stack">
          <FieldShell>
            <Input
              label="Compañía"
              value={fundingInputs.companyName}
              onChange={(e) => onFieldChange('companyName', e.target.value)}
            />
          </FieldShell>

          <FieldShell>
            <Select
              label="Fase"
              value={fundingInputs.stage}
              onChange={(e) => onFieldChange('stage', e.target.value)}
              options={STAGE_OPTIONS}
            />
          </FieldShell>

          <div className="funding-form-grid-2">
            <FieldShell>
              <Input
                label="Ingresos actuales"
                inputMode="decimal"
                value={fundingInputs.currentRevenue}
                onChange={(e) => onFieldChange('currentRevenue', e.target.value)}
              />
            </FieldShell>

            <FieldShell>
              <Input
                label="Burn mensual"
                inputMode="decimal"
                value={fundingInputs.monthlyBurn}
                onChange={(e) => onFieldChange('monthlyBurn', e.target.value)}
              />
            </FieldShell>
          </div>

          <div className="funding-form-grid-2">
            <FieldShell>
              <Input
                label="Caja actual"
                inputMode="decimal"
                value={fundingInputs.currentCash}
                onChange={(e) => onFieldChange('currentCash', e.target.value)}
              />
            </FieldShell>

            <FieldShell>
              <Input
                label="Capital objetivo"
                inputMode="decimal"
                value={fundingInputs.targetRaise}
                onChange={(e) => onFieldChange('targetRaise', e.target.value)}
              />
            </FieldShell>
          </div>

          <div className="funding-form-grid-2">
            <FieldShell>
              <Input
                label="Valoración pre-money"
                inputMode="decimal"
                value={fundingInputs.preMoneyValuation}
                onChange={(e) =>
                  onFieldChange('preMoneyValuation', e.target.value)
                }
              />
            </FieldShell>

            <FieldShell>
              <Input
                label="Runway objetivo (meses)"
                inputMode="decimal"
                value={fundingInputs.runwayMonthsTarget}
                onChange={(e) =>
                  onFieldChange('runwayMonthsTarget', e.target.value)
                }
              />
            </FieldShell>
          </div>

          <div className="funding-growth-grid-fix">
            <FieldShell className="funding-growth-field-shell">
              <Input
                label="Crecimiento anual (%)"
                inputMode="decimal"
                value={fundingInputs.annualGrowthRate}
                onChange={(e) =>
                  onFieldChange('annualGrowthRate', e.target.value)
                }
              />
            </FieldShell>

            <FieldShell className="funding-growth-field-shell">
              <Input
                label="Margen bruto (%)"
                inputMode="decimal"
                value={fundingInputs.grossMargin}
                onChange={(e) => onFieldChange('grossMargin', e.target.value)}
              />
            </FieldShell>
          </div>
        </div>
      </Card>

      <Card>
        <h3>Preparación para inversores</h3>

        <div className="stack">
          <SliderField
            label="Data room completado"
            value={fundingInputs.dataRoomCompletion}
            onChange={(value) => onFieldChange('dataRoomCompletion', value)}
          />

          <SliderField
            label="Encaje fundador-mercado"
            value={fundingInputs.founderMarketFit}
            onChange={(value) => onFieldChange('founderMarketFit', value)}
          />

          <SliderField
            label="Interés inversor"
            value={fundingInputs.investorInterest}
            onChange={(value) => onFieldChange('investorInterest', value)}
          />

          <div className="funding-team-grid-fix">
            <FieldShell className="funding-team-field-shell">
              <Input
                label="Tamaño del equipo"
                inputMode="decimal"
                value={fundingInputs.teamSize}
                onChange={(e) => onFieldChange('teamSize', e.target.value)}
              />
            </FieldShell>

            <FieldShell className="funding-team-field-shell">
              <Input
                label="Plan de contrataciones"
                inputMode="decimal"
                value={fundingInputs.hiringPlan}
                onChange={(e) => onFieldChange('hiringPlan', e.target.value)}
              />
            </FieldShell>
          </div>

          <FieldShell>
            <Input
              label="Capacidad de deuda"
              inputMode="decimal"
              value={fundingInputs.debtCapacity}
              onChange={(e) => onFieldChange('debtCapacity', e.target.value)}
            />
          </FieldShell>
        </div>
      </Card>

      <Card>
        <h3>Estructura de capital</h3>

        <div className="stack">
          <div className="funding-capital-grid">
            <FieldShell className="funding-capital-field-shell">
              <Input
                label="Participación fundador (%)"
                inputMode="decimal"
                value={fundingInputs.founderOwnership}
                onChange={(e) =>
                  onFieldChange('founderOwnership', e.target.value)
                }
              />
            </FieldShell>

            <FieldShell className="funding-capital-field-shell">
              <Input
                label="Inversores actuales (%)"
                inputMode="decimal"
                value={fundingInputs.existingInvestorOwnership}
                onChange={(e) =>
                  onFieldChange('existingInvestorOwnership', e.target.value)
                }
              />
            </FieldShell>

            <FieldShell className="funding-capital-field-shell">
              <Input
                label="Option pool / equipo (%)"
                inputMode="decimal"
                value={fundingInputs.optionPool}
                onChange={(e) => onFieldChange('optionPool', e.target.value)}
              />
            </FieldShell>
          </div>

          <FieldShell>
            <Select
              label="Divisa"
              value={fundingSettings.reportCurrency}
              onChange={(e) =>
                onSettingsChange('reportCurrency', e.target.value)
              }
              options={['EUR', 'USD']}
            />
          </FieldShell>

          <FieldShell>
            <Select
              label="Modo de escenario"
              value={fundingSettings.scenarioMode}
              onChange={(e) => onSettingsChange('scenarioMode', e.target.value)}
              options={SCENARIO_MODE_OPTIONS}
            />
          </FieldShell>
        </div>
      </Card>
    </div>
  );
}