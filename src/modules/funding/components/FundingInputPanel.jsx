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

export function FundingInputPanel({
  fundingInputs,
  fundingSettings,
  onFieldChange,
  onSettingsChange
}) {
  return (
    <div className="stack">
      <style>
        {`
          .funding-capital-grid {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 16px;
            align-items: end;
          }

          .funding-capital-field {
            display: flex;
            flex-direction: column;
            min-width: 0;
          }

          .funding-capital-field label {
            min-height: 58px;
            display: flex;
            align-items: flex-start;
            line-height: 1.25;
          }

          .funding-capital-field input {
            width: 100%;
            min-height: 58px;
          }

          @media (max-width: 980px) {
            .funding-capital-grid {
              grid-template-columns: 1fr;
            }

            .funding-capital-field label {
              min-height: auto;
            }
          }
        `}
      </style>

      <Card>
        <h3>Base de financiación</h3>

        <div className="stack">
          <Input
            label="Compañía"
            value={fundingInputs.companyName}
            onChange={(e) => onFieldChange('companyName', e.target.value)}
          />

          <Select
            label="Fase"
            value={fundingInputs.stage}
            onChange={(e) => onFieldChange('stage', e.target.value)}
            options={STAGE_OPTIONS}
          />

          <div className="grid-2">
            <Input
              label="Ingresos actuales"
              inputMode="decimal"
              value={fundingInputs.currentRevenue}
              onChange={(e) => onFieldChange('currentRevenue', e.target.value)}
            />

            <Input
              label="Burn mensual"
              inputMode="decimal"
              value={fundingInputs.monthlyBurn}
              onChange={(e) => onFieldChange('monthlyBurn', e.target.value)}
            />
          </div>

          <div className="grid-2">
            <Input
              label="Caja actual"
              inputMode="decimal"
              value={fundingInputs.currentCash}
              onChange={(e) => onFieldChange('currentCash', e.target.value)}
            />

            <Input
              label="Capital objetivo"
              inputMode="decimal"
              value={fundingInputs.targetRaise}
              onChange={(e) => onFieldChange('targetRaise', e.target.value)}
            />
          </div>

          <div className="grid-2">
            <Input
              label="Valoración pre-money"
              inputMode="decimal"
              value={fundingInputs.preMoneyValuation}
              onChange={(e) =>
                onFieldChange('preMoneyValuation', e.target.value)
              }
            />

            <Input
              label="Runway objetivo (meses)"
              inputMode="decimal"
              value={fundingInputs.runwayMonthsTarget}
              onChange={(e) =>
                onFieldChange('runwayMonthsTarget', e.target.value)
              }
            />
          </div>

          <div className="grid-2">
            <Input
              label="Crecimiento anual (%)"
              inputMode="decimal"
              value={fundingInputs.annualGrowthRate}
              onChange={(e) =>
                onFieldChange('annualGrowthRate', e.target.value)
              }
            />

            <Input
              label="Margen bruto (%)"
              inputMode="decimal"
              value={fundingInputs.grossMargin}
              onChange={(e) => onFieldChange('grossMargin', e.target.value)}
            />
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

          <div className="grid-2">
            <Input
              label="Tamaño del equipo"
              inputMode="decimal"
              value={fundingInputs.teamSize}
              onChange={(e) => onFieldChange('teamSize', e.target.value)}
            />

            <Input
              label="Plan de contrataciones"
              inputMode="decimal"
              value={fundingInputs.hiringPlan}
              onChange={(e) => onFieldChange('hiringPlan', e.target.value)}
            />
          </div>

          <Input
            label="Capacidad de deuda"
            inputMode="decimal"
            value={fundingInputs.debtCapacity}
            onChange={(e) => onFieldChange('debtCapacity', e.target.value)}
          />
        </div>
      </Card>

      <Card>
        <h3>Estructura de capital</h3>

        <div className="stack">
          <div className="funding-capital-grid">
            <div className="funding-capital-field">
              <Input
                label="Participación fundador (%)"
                inputMode="decimal"
                value={fundingInputs.founderOwnership}
                onChange={(e) =>
                  onFieldChange('founderOwnership', e.target.value)
                }
              />
            </div>

            <div className="funding-capital-field">
              <Input
                label="Inversores actuales (%)"
                inputMode="decimal"
                value={fundingInputs.existingInvestorOwnership}
                onChange={(e) =>
                  onFieldChange('existingInvestorOwnership', e.target.value)
                }
              />
            </div>

            <div className="funding-capital-field">
              <Input
                label="Option pool / equipo (%)"
                inputMode="decimal"
                value={fundingInputs.optionPool}
                onChange={(e) => onFieldChange('optionPool', e.target.value)}
              />
            </div>
          </div>

          <Select
            label="Divisa"
            value={fundingSettings.reportCurrency}
            onChange={(e) =>
              onSettingsChange('reportCurrency', e.target.value)
            }
            options={['EUR', 'USD']}
          />

          <Select
            label="Modo de escenario"
            value={fundingSettings.scenarioMode}
            onChange={(e) => onSettingsChange('scenarioMode', e.target.value)}
            options={SCENARIO_MODE_OPTIONS}
          />
        </div>
      </Card>
    </div>
  );
}