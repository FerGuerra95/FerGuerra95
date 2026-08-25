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
        <span>Low</span>
        <span>High</span>
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
  className = '',
  surfaceAtmo = false
}) {
  return (
    <Card className={`ma-input-card ${className}`.trim()}>
      {surfaceAtmo ? (
        <div className="ma-fb-surface-atmo" aria-hidden="true" />
      ) : null}
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
    <div className={`ma-input-cockpit-shell ma-valuation-sidebar-premium ma-valuation-surface ma-valuation-underwriting-rail ${isDisabled ? 'is-readonly' : ''}`}>
      <header
        className="ma-valuation-input-cockpit-band"
        aria-label="Inputs and assumptions"
      >
        <div className="ma-valuation-input-cockpit-band-icon" aria-hidden="true">
          <SlidersHorizontal size={18} />
        </div>

        <div className="ma-valuation-input-cockpit-band-copy">
          <div className="ma-valuation-input-cockpit-band-kicker">Valuation cockpit</div>
          <h2 className="ma-valuation-input-cockpit-band-title">Inputs & assumptions</h2>
          <p className="muted ma-valuation-input-cockpit-band-lead">
            Financial baseline, risk posture and valuation settings for this case.
          </p>
        </div>
      </header>

      <div className={`ma-input-panel ${isDisabled ? 'is-readonly' : ''}`}>

      <PanelSection
        className="ma-valuation-input-section ma-financial-baseline-block"
        kicker="Financial baseline"
        title="Base financials"
        description="Core asset data to calculate normalized EBITDA, enterprise value, net debt and equity value."
        icon={Calculator}
        surfaceAtmo
      >
        <div className="ma-input-stack">
          <Input
            label="Legal name"
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
              className="ma-fb-numeric-capsule"
              label="EBITDA (€)"
              inputMode="decimal"
              value={financials.reportedEbitda}
              disabled={isDisabled}
              readOnly={isDisabled}
              onChange={(e) => onFieldChange('reportedEbitda', e.target.value)}
            />

            <Input
              className="ma-fb-numeric-capsule"
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
              className="ma-fb-numeric-capsule"
              label="Debt (€)"
              inputMode="decimal"
              value={financials.debt}
              disabled={isDisabled}
              readOnly={isDisabled}
              onChange={(e) => onFieldChange('debt', e.target.value)}
            />

            <Input
              className="ma-fb-numeric-capsule"
              label="Cash (€)"
              inputMode="decimal"
              value={financials.cash}
              disabled={isDisabled}
              readOnly={isDisabled}
              onChange={(e) => onFieldChange('cash', e.target.value)}
            />
          </div>

          <div className="ma-input-grid">
            <Input
              className="ma-fb-numeric-capsule"
              label="Target WC (€)"
              inputMode="decimal"
              value={financials.targetWC}
              disabled={isDisabled}
              readOnly={isDisabled}
              onChange={(e) => onFieldChange('targetWC', e.target.value)}
            />

            <Input
              className="ma-fb-numeric-capsule"
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
              className="ma-fb-numeric-capsule"
              label="Growth (%)"
              inputMode="decimal"
              value={financials.growth}
              disabled={isDisabled}
              readOnly={isDisabled}
              onChange={(e) => onFieldChange('growth', e.target.value)}
            />

            <Input
              className="ma-fb-numeric-capsule"
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
              className="ma-fb-numeric-capsule"
              label="Cost synergies (€)"
              inputMode="decimal"
              value={financials.synergiesCost}
              disabled={isDisabled}
              readOnly={isDisabled}
              onChange={(e) => onFieldChange('synergiesCost', e.target.value)}
            />

            <Input
              className="ma-fb-numeric-capsule"
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
              className="ma-fb-numeric-capsule"
              label="Tax rate (%)"
              inputMode="decimal"
              value={financials.taxRate}
              disabled={isDisabled}
              readOnly={isDisabled}
              onChange={(e) => onFieldChange('taxRate', e.target.value)}
            />

            <Input
              className="ma-fb-numeric-capsule"
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
        className="ma-valuation-input-section"
        kicker="Risk profile"
        title="Risk & operations"
        description="Qualitative variables that adjust deal quality, transferability, operating risk and executive read."
        icon={ShieldAlert}
      >
        <div className="ma-slider-list">
          <SliderField
            label="Owner dependency"
            value={financials.ownerDependency}
            disabled={isDisabled}
            onChange={(value) => onFieldChange('ownerDependency', value)}
          />

          <SliderField
            label="Client concentration"
            value={financials.clientConcentration}
            disabled={isDisabled}
            onChange={(value) => onFieldChange('clientConcentration', value)}
          />

          <SliderField
            label="Recurring revenue"
            value={financials.recurringRevenue}
            disabled={isDisabled}
            onChange={(value) => onFieldChange('recurringRevenue', value)}
          />

          <SliderField
            label="Working capital need"
            value={financials.workingCapitalNeed}
            disabled={isDisabled}
            onChange={(value) => onFieldChange('workingCapitalNeed', value)}
          />

          <SliderField
            label="CSDDD geographic risk"
            value={financials.regionHighRisk}
            disabled={isDisabled}
            onChange={(value) => onFieldChange('regionHighRisk', value)}
          />

          <SliderField
            label="Founder equity"
            value={financials.foundersEquity}
            disabled={isDisabled}
            onChange={(value) => onFieldChange('foundersEquity', value)}
          />
        </div>
      </PanelSection>

      <PanelSection
        className="ma-valuation-input-section"
        kicker="Valuation settings"
        title="Settings"
        description="Presentation currency and risk profile applied to the analysis."
        icon={Settings2}
      >
        <div className="ma-input-stack">
          <div className="ma-input-grid">
            <Select
              label="Currency"
              value={settings.reportCurrency}
              disabled={isDisabled}
              onChange={(e) => onSettingsChange('reportCurrency', e.target.value)}
              options={['EUR', 'USD']}
            />

            <Select
              label="Risk mode"
              value={settings.riskMode}
              disabled={isDisabled}
              onChange={(e) => onSettingsChange('riskMode', e.target.value)}
              options={['conservative', 'balanced', 'aggressive']}
            />
          </div>

          <div className="ma-config-note">
            <strong>Executive valuation posture</strong>

            <p className="muted">
              Settings affect report currency and the prudence level applied to
              risks, multiples and final deal read.
            </p>
          </div>
        </div>
      </PanelSection>
    </div>
    </div>
  );
}
