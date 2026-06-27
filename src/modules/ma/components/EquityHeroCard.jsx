import React from 'react';
import {
  Activity,
  ArrowDownRight,
  BarChart3,
  Gauge,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';
import { Badge } from '../../../shared/components/ui/Badge.jsx';
import { formatCurrency } from '../../../shared/utils/formatCurrency.js';

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

function getRiskSignal(label) {
  if (label === 'Bajo') {
    return {
      title: 'Low-risk equity profile',
      description:
        'La lectura actual muestra un perfil más limpio para defender valoración y avanzar en análisis.'
    };
  }

  if (label === 'Medio') {
    return {
      title: 'Balanced risk profile',
      description:
        'El caso presenta base de análisis, aunque conviene revisar riesgos y supuestos antes de presentar conclusiones.'
    };
  }

  return {
    title: 'High-risk equity profile',
    description:
      'El caso requiere validación adicional antes de usar la valoración como base de decisión ejecutiva.'
  };
}

function MetricCard({ label, value, description, icon: Icon, color = '' }) {
  return (
    <article className="ma-equity-safe-metric ma-equity-safe-metric-premium ma-valuation-kpi">
      <div className="ma-equity-safe-metric-head">
        <div>
          <div className="kpi-label">{label}</div>

          <div className={`ma-equity-safe-metric-value ma-val-financial-figure ${color}`.trim()}>
            {value}
          </div>
        </div>

        <div className="ma-equity-safe-metric-icon">
          <Icon size={17} />
        </div>
      </div>

      <p className="ma-equity-safe-metric-description">{description}</p>
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
  const scoreAngle = `${normalizedScore * 3.6}deg`;

  return (
    <section className="ma-equity-safe-card ma-valuation-executive-summary ma-valuation-surface">

      <div className="ma-equity-safe-inner">
        <div className="ma-equity-safe-hero-band">
          <header className="ma-equity-safe-primary">
            <div className="ma-equity-safe-kicker">
              <TrendingUp size={14} />
              Adjusted equity value — DSS view
            </div>

            <div className="ma-equity-safe-badges">
              <Badge variant={riskBadgeVariant}>
                {riskLabel} riesgo
              </Badge>
            </div>

            <h2 className="ma-equity-safe-value ma-val-financial-figure">
              {formatCurrencyTight(equityBase, reportCurrency)}
            </h2>

            <p className="ma-equity-safe-copy">
              Live engine estimate: adjusted multiple on normalized EBITDA, net
              debt and working capital adjustment. Indicative DSS only — not a
              fairness opinion or certified valuation.
            </p>
          </header>

          <aside className="ma-equity-safe-quality-panel" aria-label="Quality score">
            <div className="kpi-label">Quality score</div>
            <div
              className="ma-equity-safe-ring"
              style={{ '--score-angle': scoreAngle }}
            >
              <div className="ma-equity-safe-ring-core">
                <strong className="ma-val-financial-figure">{normalizedScore}</strong>
              </div>
            </div>
            <div className="ma-equity-safe-score-copy">
              <strong className="ma-val-financial-figure">{normalizedScore}/100</strong>
              <p>{riskSignal.title}</p>
            </div>
          </aside>
        </div>

        <div className="ma-equity-safe-secondary-band">
          <aside className="ma-equity-safe-signal">
            <div className="ma-equity-safe-signal-head">
              <div>
                <div className="kpi-label">Risk posture</div>
                <div className="ma-equity-safe-signal-title">
                  {riskSignal.title}
                </div>
              </div>

              <div className="ma-equity-safe-icon">
                <ShieldCheck size={20} />
              </div>
            </div>

            <p className="ma-equity-safe-signal-note muted">{riskSignal.description}</p>
          </aside>
        </div>

        <div className="ma-equity-safe-metrics ma-val-integrated-metrics">
          <MetricCard
            label="Adjusted DSS enterprise value"
            value={formatCurrencyTight(evBase, reportCurrency)}
            description="Normalized EBITDA × adjusted multiple (sector, risk, quality, compliance)."
            icon={BarChart3}
          />

          <MetricCard
            label="Deuda neta"
            value={formatCurrencyTight(netDebt, reportCurrency)}
            description="Impacto de deuda y caja sobre el equity."
            icon={ArrowDownRight}
            color="text-danger"
          />

          <MetricCard
            label="Múltiplo"
            value={`x${adjustedMultiple.toFixed(2)}`}
            description="Múltiplo ajustado aplicado al EBITDA normalizado."
            icon={Gauge}
          />

          <MetricCard
            label="Score"
            value={`${normalizedScore}/100`}
            description="Calidad financiera, riesgo y transferibilidad."
            icon={Activity}
            color={derived?.riskLevel?.color || ''}
          />
        </div>
      </div>
    </section>
  );
}
