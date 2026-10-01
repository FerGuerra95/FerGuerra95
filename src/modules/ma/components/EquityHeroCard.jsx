import React from 'react';
import {
  Activity,
  ArrowDownRight,
  BarChart3,
  Gauge,
  TrendingUp
} from 'lucide-react';
import { Badge } from '../../../shared/components/ui/Badge.jsx';
import { formatCurrency } from '../../../shared/utils/formatCurrency.js';
import { PRIMARY_VALUATION_METHOD } from '../engine/valuationFormulas.js';
import { MAScoreRing } from './MAScoreRing.jsx';

function getSafeNumber(value, fallback = 0) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) return fallback;

  return parsed;
}

function formatCurrencyTight(value, currency) {
  return formatCurrency(value, currency).replace(/\s(?=\S+$)/, '\u00A0');
}

function getRiskBadgeVariant(label) {
  if (label === 'Bajo') return 'success';
  if (label === 'Medio') return 'warning';

  return 'danger';
}

function formatRiskBadge(label) {
  if (label === 'Bajo') return 'Low risk';
  if (label === 'Medio') return 'Medium risk';
  if (label === 'Alto') return 'High risk';

  return label ? `${label} risk` : 'Risk n/a';
}

function getRiskSignal(label) {
  if (label === 'Bajo') {
    return {
      title: 'Low-risk equity profile',
      description:
        'Current read supports a cleaner profile for defending valuation and advancing diligence.'
    };
  }

  if (label === 'Medio') {
    return {
      title: 'Balanced risk profile',
      description:
        'The case has analytical footing, but assumptions and risk drivers should be reviewed before committee use.'
    };
  }

  return {
    title: 'High-risk equity profile',
    description:
      'Additional validation is required before using this valuation as an executive decision input.'
  };
}

function MetricCard({ label, value, description, icon: Icon, color = '' }) {
  return (
    <article className="ma-equity-safe-stat ma-equity-safe-stat-premium">
      <div className="ma-equity-safe-stat-head">
        <div>
          <div className="kpi-label">{label}</div>

          <div className={`ma-equity-safe-stat-value ma-val-financial-figure ${color}`.trim()}>
            {value}
          </div>
        </div>

        <div className="ma-equity-safe-stat-glyph" aria-hidden="true">
          <Icon size={17} />
        </div>
      </div>

      <p className="ma-equity-safe-stat-note">{description}</p>
    </article>
  );
}

export function EquityHeroCard({ derived, settings }) {
  const reportCurrency = settings?.reportCurrency || 'EUR';
  const riskLabel = derived?.riskLevel?.label || 'N/A';
  const riskBadgeVariant = getRiskBadgeVariant(riskLabel);
  const riskSignal = getRiskSignal(riskLabel);

  const equityBase = getSafeNumber(derived?.equityBase);
  const evBase = getSafeNumber(derived?.evBase);
  const netDebt = getSafeNumber(derived?.netDebt);
  const adjustedMultiple = getSafeNumber(derived?.adjustedMultiple);
  const qualityScore = Math.round(getSafeNumber(derived?.qualityScore));
  const normalizedScore = Math.max(0, Math.min(100, qualityScore));

  return (
    <section className="ma-equity-safe-card ma-valuation-executive-summary ma-valuation-surface">
      <div className="ma-ma-panel-ambient" aria-hidden="true" />

      <div className="ma-equity-safe-inner">
        <div className="ma-equity-safe-hero-band">
          <header className="ma-equity-safe-primary">
            <div className="ma-equity-safe-kicker">
              <TrendingUp size={14} />
              {PRIMARY_VALUATION_METHOD.kicker}
            </div>

            <div className="ma-equity-safe-badges">
              <Badge variant={riskBadgeVariant}>{formatRiskBadge(riskLabel)}</Badge>
            </div>

            <p className="ma-equity-safe-caption">Adjusted equity value</p>

            <h2 className="ma-equity-safe-value ma-val-financial-figure">
              {formatCurrencyTight(equityBase, reportCurrency)}
            </h2>

            <p className="ma-equity-safe-copy">
              Live engine headline is {PRIMARY_VALUATION_METHOD.label}:
              normalized EBITDA × adjusted multiple, then net debt and working
              capital. DCF is a control triangulation only — not this headline.
              Indicative DSS only — not a fairness opinion or certified valuation.
            </p>
          </header>

          <aside className="ma-equity-safe-quality-readout" aria-label="Quality score">
            <div className="kpi-label">Quality score</div>
            <MAScoreRing
              value={normalizedScore}
              size={160}
              variant="executive"
              showDenom
              figureAs="strong"
              aria-hidden={false}
              ringClassName="ma-equity-safe-ring ma-score-ring"
              svgClassName="ma-equity-safe-ring-svg ma-score-ring-svg"
              coreClassName="ma-equity-safe-ring-core ma-score-ring-core"
              figureClassName="ma-equity-safe-score-main ma-score-ring-figure ma-val-financial-figure"
              denomClassName="ma-equity-safe-score-denom ma-score-ring-denom"
            />
            <p className="ma-equity-safe-score-note">{riskSignal.title}</p>
          </aside>
        </div>

        <div className="ma-equity-safe-risk-row">
          <div className="ma-equity-safe-risk-copy">
            <div className="kpi-label">Risk posture</div>
            <div className="ma-equity-safe-risk-title">
              {riskSignal.title}
            </div>
            <p className="ma-equity-safe-risk-note muted">{riskSignal.description}</p>
          </div>
        </div>

        <div className="ma-equity-safe-stats ma-val-integrated-stats">
          <MetricCard
            label="Adjusted DSS enterprise value"
            value={formatCurrencyTight(evBase, reportCurrency)}
            description="Normalized EBITDA × adjusted multiple (sector, risk, quality, compliance)."
            icon={BarChart3}
          />

          <MetricCard
            label="Net debt"
            value={formatCurrencyTight(netDebt, reportCurrency)}
            description="Debt minus cash impact on the equity bridge."
            icon={ArrowDownRight}
            color="text-danger"
          />

          <MetricCard
            label="Adjusted multiple"
            value={`x${adjustedMultiple.toFixed(2)}`}
            description="Multiple applied to normalized EBITDA."
            icon={Gauge}
          />

          <MetricCard
            label="Quality score"
            value={`${normalizedScore}/100`}
            description="Financial quality, risk and transferability read."
            icon={Activity}
            color={derived?.riskLevel?.color || ''}
          />
        </div>
      </div>
    </section>
  );
}
