import React from 'react';
import {
  Building2,
  Calculator,
  Gauge,
  Settings2,
  ShieldAlert,
  SlidersHorizontal,
  Target,
  TrendingUp
} from 'lucide-react';
import { Card } from '../../../shared/components/ui/Card.jsx';
import { Input } from '../../../shared/components/ui/Input.jsx';
import { Select } from '../../../shared/components/ui/Select.jsx';
import { SECTOR_DATA } from '../engine/valuationFormulas.js';

const financialInputCss = `
  .ma-input-panel {
    display: flex;
    flex-direction: column;
    gap: 22px;
  }

  .ma-input-card {
    position: relative;
    overflow: hidden;
    border-radius: 30px;
    padding: 26px;
    background:
      radial-gradient(circle at 0% 0%, rgba(59, 130, 246, 0.12), transparent 34%),
      linear-gradient(135deg, rgba(255,255,255,0.068), rgba(255,255,255,0.024)),
      rgba(15, 23, 42, 0.72);
    border: 1px solid rgba(148, 163, 184, 0.16);
    box-shadow:
      0 22px 62px rgba(0, 0, 0, 0.20),
      inset 0 1px 0 rgba(255,255,255,0.04);
  }

  .ma-input-card::before {
    content: "";
    position: absolute;
    inset: 0;
    background:
      linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px);
    background-size: 42px 42px;
    mask-image: linear-gradient(to bottom, rgba(0,0,0,0.62), transparent 85%);
    pointer-events: none;
  }

  .ma-input-card-inner {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: 22px;
  }

  .ma-input-header {
    display: flex;
    justify-content: space-between;
    gap: 18px;
    align-items: flex-start;
    padding-bottom: 18px;
    border-bottom: 1px solid rgba(148, 163, 184, 0.14);
  }

  .ma-input-kicker {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
    font-size: 11px;
    line-height: 1;
    text-transform: uppercase;
    letter-spacing: 0.16em;
    color: rgba(148, 163, 184, 0.96);
  }

  .ma-input-header h3 {
    margin: 0;
    letter-spacing: -0.045em;
  }

  .ma-input-header p {
    margin: 10px 0 0;
    line-height: 1.6;
  }

  .ma-input-icon {
    flex: 0 0 auto;
    width: 46px;
    height: 46px;
    border-radius: 18px;
    display: grid;
    place-items: center;
    background: rgba(37, 99, 235, 0.15);
    border: 1px solid rgba(96, 165, 250, 0.22);
  }

  .ma-input-stack {
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  .ma-input-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
  }

  .ma-input-divider {
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(148, 163, 184, 0.18),
      transparent
    );
    margin: 2px 0;
  }

  .ma-slider-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .ma-slider-field {
    border-radius: 22px;
    padding: 18px;
    background: rgba(255, 255, 255, 0.042);
    border: 1px solid rgba(255, 255, 255, 0.078);
  }

  .ma-slider-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    margin-bottom: 14px;
  }

  .ma-slider-label {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
    color: rgba(226, 232, 240, 0.94);
    font-size: 13px;
    font-weight: 760;
  }

  .ma-slider-label span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .ma-slider-dot {
    width: 30px;
    height: 30px;
    flex: 0 0 auto;
    border-radius: 12px;
    display: grid;
    place-items: center;
    background: rgba(16, 185, 129, 0.12);
    border: 1px solid rgba(16, 185, 129, 0.22);
    color: #86efac;
  }

  .ma-slider-value {
    flex: 0 0 auto;
    min-width: 54px;
    text-align: right;
    color: #d1fae5;
    font-size: 13px;
    font-weight: 820;
  }

  .ma-slider-track-row {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
  }

  .ma-slider-field input[type="range"] {
    width: 100%;
    accent-color: var(--accent);
  }

  .ma-slider-foot {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    margin-top: 8px;
    color: rgba(148, 163, 184, 0.78);
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.12em;
  }

  .ma-config-note {
    border-radius: 22px;
    padding: 18px;
    background: rgba(16, 185, 129, 0.075);
    border: 1px solid rgba(16, 185, 129, 0.18);
  }

  .ma-config-note strong {
    display: block;
    margin-bottom: 8px;
  }

  .ma-config-note p {
    margin: 0;
    line-height: 1.6;
  }

  .ma-input-panel.is-readonly {
    opacity: 0.92;
  }

  .ma-input-panel.is-readonly .ma-input-card {
    border-color: rgba(148, 163, 184, 0.12);
  }

  @media (max-width: 680px) {
    .ma-input-card {
      border-radius: 24px;
      padding: 22px;
    }

    .ma-input-header {
      flex-direction: column;
    }

    .ma-input-grid {
      grid-template-columns: 1fr;
    }
  }

  .ma-input-card,
  .ma-slider-field,
  .ma-config-note {
    background: rgba(15, 23, 42, 0.72) !important;
    background-image: none !important;
    border-color: rgba(148, 163, 184, 0.14) !important;
    box-shadow: none !important;
  }

  .ma-input-card::before {
    content: none !important;
    display: none !important;
  }

  .ma-input-card-inner,
  .ma-input-stack,
  .ma-input-grid,
  .ma-slider-list,
  .ma-slider-head,
  .ma-slider-track-row {
    background: transparent !important;
    background-image: none !important;
    border-color: transparent !important;
    box-shadow: none !important;
  }

  .ma-input-kicker,
  .ma-input-header h3,
  .ma-slider-value,
  .ma-slider-foot {
    letter-spacing: 0 !important;
    text-shadow: none !important;
  }
`;

function toPercent(value) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) return 0;

  return Math.max(0, Math.min(100, parsed));
}

function SliderField({ label, value, onChange, disabled = false }) {
  const safeValue = toPercent(value);

  return (
    <div className="ma-slider-field">
      <div className="ma-slider-head">
        <div className="ma-slider-label">
          <span className="ma-slider-dot">
            <SlidersHorizontal size={14} />
          </span>

          <span>{label}</span>
        </div>

        <div className="ma-slider-value">{safeValue}%</div>
      </div>

      <div className="ma-slider-track-row">
        <input
          type="range"
          min="0"
          max="100"
          step="5"
          value={safeValue}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>

      <div className="ma-slider-foot">
        <span>Bajo</span>
        <span>Alto</span>
      </div>
    </div>
  );
}

function PanelSection({
  kicker,
  title,
  description,
  icon: Icon,
  children,
  className = ''
}) {
  return (
    <Card className={`ma-input-card ${className}`.trim()}>
      <div className="ma-input-card-inner">
        <div className="ma-input-header">
          <div>
            <div className="ma-input-kicker">
              <Icon size={14} />
              {kicker}
            </div>

            <h3>{title}</h3>

            {description ? (
              <p className="muted">{description}</p>
            ) : null}
          </div>

          <div className="ma-input-icon">
            <Icon size={18} />
          </div>
        </div>

        {children}
      </div>
    </Card>
  );
}

export function FinancialInputPanel({
  financials,
  settings,
  onFieldChange,
  onSettingsChange,
  disabled = false,
  readOnly = false,
  isReadOnly = false
}) {
  const isDisabled = disabled || readOnly || isReadOnly;

  return (
    <div className={`ma-input-panel ${isDisabled ? 'is-readonly' : ''}`}>
      <style>{financialInputCss}</style>

      <PanelSection
        kicker="Financial baseline"
        title="Finanzas base"
        description="Datos principales del activo para calcular EBITDA normalizado, valor empresa, deuda neta y equity value."
        icon={Calculator}
      >
        <div className="ma-input-stack">
          <Input
            label="Razón social"
            value={financials.name}
            disabled={isDisabled}
            readOnly={isDisabled}
            onChange={(e) => onFieldChange('name', e.target.value)}
          />

          <Select
            label="Sector"
            value={financials.sector}
            disabled={isDisabled}
            onChange={(e) => onFieldChange('sector', e.target.value)}
            options={Object.keys(SECTOR_DATA)}
          />

          <div className="ma-input-divider" />

          <div className="ma-input-grid">
            <Input
              label="EBITDA (€)"
              inputMode="decimal"
              value={financials.reportedEbitda}
              disabled={isDisabled}
              readOnly={isDisabled}
              onChange={(e) => onFieldChange('reportedEbitda', e.target.value)}
            />

            <Input
              label="Add-backs (€)"
              inputMode="decimal"
              value={financials.addBacks}
              disabled={isDisabled}
              readOnly={isDisabled}
              onChange={(e) => onFieldChange('addBacks', e.target.value)}
            />
          </div>

          <div className="ma-input-grid">
            <Input
              label="Deuda (€)"
              inputMode="decimal"
              value={financials.debt}
              disabled={isDisabled}
              readOnly={isDisabled}
              onChange={(e) => onFieldChange('debt', e.target.value)}
            />

            <Input
              label="Caja (€)"
              inputMode="decimal"
              value={financials.cash}
              disabled={isDisabled}
              readOnly={isDisabled}
              onChange={(e) => onFieldChange('cash', e.target.value)}
            />
          </div>

          <div className="ma-input-grid">
            <Input
              label="Target WC (€)"
              inputMode="decimal"
              value={financials.targetWC}
              disabled={isDisabled}
              readOnly={isDisabled}
              onChange={(e) => onFieldChange('targetWC', e.target.value)}
            />

            <Input
              label="WC real (€)"
              inputMode="decimal"
              value={financials.actualWC}
              disabled={isDisabled}
              readOnly={isDisabled}
              onChange={(e) => onFieldChange('actualWC', e.target.value)}
            />
          </div>

          <div className="ma-input-divider" />

          <div className="ma-input-grid">
            <Input
              label="Growth (%)"
              inputMode="decimal"
              value={financials.growth}
              disabled={isDisabled}
              readOnly={isDisabled}
              onChange={(e) => onFieldChange('growth', e.target.value)}
            />

            <Input
              label="Leverage ratio"
              inputMode="decimal"
              value={financials.leverageRatio}
              disabled={isDisabled}
              readOnly={isDisabled}
              onChange={(e) => onFieldChange('leverageRatio', e.target.value)}
            />
          </div>

          <div className="ma-input-grid">
            <Input
              label="Cost synergies (€)"
              inputMode="decimal"
              value={financials.synergiesCost}
              disabled={isDisabled}
              readOnly={isDisabled}
              onChange={(e) => onFieldChange('synergiesCost', e.target.value)}
            />

            <Input
              label="Rev synergies (€)"
              inputMode="decimal"
              value={financials.synergiesRev}
              disabled={isDisabled}
              readOnly={isDisabled}
              onChange={(e) => onFieldChange('synergiesRev', e.target.value)}
            />
          </div>

          <div className="ma-input-grid">
            <Input
              label="Impuestos (%)"
              inputMode="decimal"
              value={financials.taxRate}
              disabled={isDisabled}
              readOnly={isDisabled}
              onChange={(e) => onFieldChange('taxRate', e.target.value)}
            />

            <Input
              label="Fees M&A (%)"
              inputMode="decimal"
              value={financials.transactionFees}
              disabled={isDisabled}
              readOnly={isDisabled}
              onChange={(e) => onFieldChange('transactionFees', e.target.value)}
            />
          </div>
        </div>
      </PanelSection>

      <PanelSection
        kicker="Risk profile"
        title="Riesgos y operaciones"
        description="Variables cualitativas que ajustan la calidad del deal, transferibilidad, riesgo operativo y lectura ejecutiva."
        icon={ShieldAlert}
      >
        <div className="ma-slider-list">
          <SliderField
            label="Dependencia del dueño"
            value={financials.ownerDependency}
            disabled={isDisabled}
            onChange={(value) => onFieldChange('ownerDependency', value)}
          />

          <SliderField
            label="Concentración de clientes"
            value={financials.clientConcentration}
            disabled={isDisabled}
            onChange={(value) => onFieldChange('clientConcentration', value)}
          />

          <SliderField
            label="Ingresos recurrentes"
            value={financials.recurringRevenue}
            disabled={isDisabled}
            onChange={(value) => onFieldChange('recurringRevenue', value)}
          />

          <SliderField
            label="Capital circulante"
            value={financials.workingCapitalNeed}
            disabled={isDisabled}
            onChange={(value) => onFieldChange('workingCapitalNeed', value)}
          />

          <SliderField
            label="Riesgo geográfico CSDDD"
            value={financials.regionHighRisk}
            disabled={isDisabled}
            onChange={(value) => onFieldChange('regionHighRisk', value)}
          />

          <SliderField
            label="Equity fundadores"
            value={financials.foundersEquity}
            disabled={isDisabled}
            onChange={(value) => onFieldChange('foundersEquity', value)}
          />
        </div>
      </PanelSection>

      <PanelSection
        kicker="Valuation settings"
        title="Configuración"
        description="Ajustes de presentación, divisa y perfil de riesgo aplicado al análisis."
        icon={Settings2}
      >
        <div className="ma-input-stack">
          <div className="ma-input-grid">
            <Select
              label="Divisa"
              value={settings.reportCurrency}
              disabled={isDisabled}
              onChange={(e) => onSettingsChange('reportCurrency', e.target.value)}
              options={['EUR', 'USD']}
            />

            <Select
              label="Modo riesgo"
              value={settings.riskMode}
              disabled={isDisabled}
              onChange={(e) => onSettingsChange('riskMode', e.target.value)}
              options={['conservative', 'balanced', 'aggressive']}
            />
          </div>

          <div className="ma-config-note">
            <strong>Executive valuation posture</strong>

            <p className="muted">
              La configuración afecta a la divisa del reporte y al nivel de
              prudencia aplicado sobre riesgos, múltiplos y lectura final del
              deal.
            </p>
          </div>
        </div>
      </PanelSection>
    </div>
  );
}
