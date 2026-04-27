import React from 'react';
import { Card } from '../../../shared/components/ui/Card.jsx';
import { Input } from '../../../shared/components/ui/Input.jsx';
import { Select } from '../../../shared/components/ui/Select.jsx';
import { SECTOR_DATA } from '../engine/valuationFormulas.js';

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

export function FinancialInputPanel({
  financials,
  settings,
  onFieldChange,
  onSettingsChange
}) {
  return (
    <div className="stack">
      <Card>
        <h3>Finanzas base</h3>

        <div className="stack">
          <Input
            label="Razón social"
            value={financials.name}
            onChange={(e) => onFieldChange('name', e.target.value)}
          />

          <Select
            label="Sector"
            value={financials.sector}
            onChange={(e) => onFieldChange('sector', e.target.value)}
            options={Object.keys(SECTOR_DATA)}
          />

          <div className="grid-2">
            <Input
              label="EBITDA (€)"
              inputMode="decimal"
              value={financials.reportedEbitda}
              onChange={(e) => onFieldChange('reportedEbitda', e.target.value)}
            />
            <Input
              label="Add-backs (€)"
              inputMode="decimal"
              value={financials.addBacks}
              onChange={(e) => onFieldChange('addBacks', e.target.value)}
            />
          </div>

          <div className="grid-2">
            <Input
              label="Deuda (€)"
              inputMode="decimal"
              value={financials.debt}
              onChange={(e) => onFieldChange('debt', e.target.value)}
            />
            <Input
              label="Caja (€)"
              inputMode="decimal"
              value={financials.cash}
              onChange={(e) => onFieldChange('cash', e.target.value)}
            />
          </div>

          <div className="grid-2">
            <Input
              label="Target WC (€)"
              inputMode="decimal"
              value={financials.targetWC}
              onChange={(e) => onFieldChange('targetWC', e.target.value)}
            />
            <Input
              label="WC real (€)"
              inputMode="decimal"
              value={financials.actualWC}
              onChange={(e) => onFieldChange('actualWC', e.target.value)}
            />
          </div>

          <div className="grid-2">
            <Input
              label="Growth (%)"
              inputMode="decimal"
              value={financials.growth}
              onChange={(e) => onFieldChange('growth', e.target.value)}
            />
            <Input
              label="Leverage ratio"
              inputMode="decimal"
              value={financials.leverageRatio}
              onChange={(e) => onFieldChange('leverageRatio', e.target.value)}
            />
          </div>

          <div className="grid-2">
            <Input
              label="Cost synergies (€)"
              inputMode="decimal"
              value={financials.synergiesCost}
              onChange={(e) => onFieldChange('synergiesCost', e.target.value)}
            />
            <Input
              label="Rev synergies (€)"
              inputMode="decimal"
              value={financials.synergiesRev}
              onChange={(e) => onFieldChange('synergiesRev', e.target.value)}
            />
          </div>

          <div className="grid-2">
            <Input
              label="Impuestos (%)"
              inputMode="decimal"
              value={financials.taxRate}
              onChange={(e) => onFieldChange('taxRate', e.target.value)}
            />
            <Input
              label="Fees M&A (%)"
              inputMode="decimal"
              value={financials.transactionFees}
              onChange={(e) => onFieldChange('transactionFees', e.target.value)}
            />
          </div>
        </div>
      </Card>

      <Card>
        <h3>Riesgos y operaciones</h3>

        <div className="stack">
          <SliderField
            label="Dependencia del dueño"
            value={financials.ownerDependency}
            onChange={(value) => onFieldChange('ownerDependency', value)}
          />
          <SliderField
            label="Concentración de clientes"
            value={financials.clientConcentration}
            onChange={(value) => onFieldChange('clientConcentration', value)}
          />
          <SliderField
            label="Ingresos recurrentes"
            value={financials.recurringRevenue}
            onChange={(value) => onFieldChange('recurringRevenue', value)}
          />
          <SliderField
            label="Capital circulante"
            value={financials.workingCapitalNeed}
            onChange={(value) => onFieldChange('workingCapitalNeed', value)}
          />
          <SliderField
            label="Riesgo geográfico CSDDD"
            value={financials.regionHighRisk}
            onChange={(value) => onFieldChange('regionHighRisk', value)}
          />
          <SliderField
            label="Equity fundadores"
            value={financials.foundersEquity}
            onChange={(value) => onFieldChange('foundersEquity', value)}
          />
        </div>
      </Card>

      <Card>
        <h3>Configuración</h3>

        <div className="grid-2">
          <Select
            label="Divisa"
            value={settings.reportCurrency}
            onChange={(e) => onSettingsChange('reportCurrency', e.target.value)}
            options={['EUR', 'USD']}
          />
          <Select
            label="Modo riesgo"
            value={settings.riskMode}
            onChange={(e) => onSettingsChange('riskMode', e.target.value)}
            options={['conservative', 'balanced', 'aggressive']}
          />
        </div>
      </Card>
    </div>
  );
}