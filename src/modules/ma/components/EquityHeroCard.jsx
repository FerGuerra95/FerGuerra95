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

const equityHeroCss = `
  .ma-equity-safe-card {
    position: relative;
    width: 100%;
    overflow: hidden;
    border-radius: 32px;
    padding: 32px;
    border: 1px solid rgba(148, 163, 184, 0.18);
    background:
      radial-gradient(circle at 8% 0%, rgba(16, 185, 129, 0.16), transparent 30%),
      radial-gradient(circle at 90% 8%, rgba(37, 99, 235, 0.16), transparent 30%),
      linear-gradient(135deg, rgba(2, 6, 23, 0.98), rgba(15, 23, 42, 0.96));
    box-shadow:
      0 28px 90px rgba(0, 0, 0, 0.32),
      inset 0 1px 0 rgba(255,255,255,0.055);
  }

  .ma-equity-safe-card::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background:
      linear-gradient(rgba(255,255,255,0.024) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.024) 1px, transparent 1px);
    background-size: 48px 48px;
    mask-image: linear-gradient(to bottom, rgba(0,0,0,0.8), transparent 84%);
    pointer-events: none;
  }

  .ma-equity-safe-inner {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: 26px;
    min-width: 0;
  }

  .ma-equity-safe-header {
    display: flex;
    flex-direction: column;
    gap: 16px;
    min-width: 0;
  }

  .ma-equity-safe-kicker {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    width: fit-content;
    font-size: 11px;
    line-height: 1;
    text-transform: uppercase;
    letter-spacing: 0.17em;
    color: rgba(148, 163, 184, 0.96);
  }

  .ma-equity-safe-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    align-items: center;
  }

  .ma-equity-safe-value {
    margin: 0;
    color: #f8fafc;
    font-size: clamp(42px, 6.4vw, 78px);
    line-height: 1.05;
    font-weight: 850;
    letter-spacing: -0.06em;
    overflow-wrap: anywhere;
    word-break: normal;
    font-variant-numeric: tabular-nums;
    text-rendering: geometricPrecision;
  }

  .ma-equity-safe-copy {
    max-width: 900px;
    margin: 0;
    color: rgba(203, 213, 225, 0.84);
    line-height: 1.68;
    font-size: 17px;
  }

  .ma-equity-safe-signal {
    width: 100%;
    border-radius: 26px;
    padding: 24px;
    border: 1px solid rgba(148, 163, 184, 0.18);
    background:
      linear-gradient(135deg, rgba(255,255,255,0.07), rgba(255,255,255,0.024)),
      rgba(15, 23, 42, 0.74);
    box-shadow:
      0 22px 60px rgba(0, 0, 0, 0.22),
      inset 0 1px 0 rgba(255,255,255,0.045);
    min-width: 0;
  }

  .ma-equity-safe-signal-grid {
    display: grid;
    grid-template-columns: minmax(220px, 0.8fr) minmax(0, 1.2fr);
    gap: 24px;
    align-items: center;
    min-width: 0;
  }

  .ma-equity-safe-signal-head {
    display: flex;
    justify-content: space-between;
    gap: 18px;
    align-items: flex-start;
    min-width: 0;
  }

  .ma-equity-safe-signal-head > div:first-child {
    min-width: 0;
  }

  .ma-equity-safe-signal-title {
    margin-top: 8px;
    font-size: 24px;
    line-height: 1.22;
    font-weight: 800;
    letter-spacing: -0.035em;
    color: #f8fafc;
    overflow-wrap: anywhere;
  }

  .ma-equity-safe-icon,
  .ma-equity-safe-metric-icon {
    flex: 0 0 auto;
    display: grid;
    place-items: center;
    border-radius: 18px;
    background: rgba(16, 185, 129, 0.12);
    border: 1px solid rgba(16, 185, 129, 0.24);
    color: #86efac;
  }

  .ma-equity-safe-icon {
    width: 48px;
    height: 48px;
  }

  .ma-equity-safe-score {
    display: grid;
    grid-template-columns: 102px minmax(0, 1fr);
    gap: 20px;
    align-items: center;
    min-width: 0;
  }

  .ma-equity-safe-ring {
    width: 98px;
    height: 98px;
    border-radius: 999px;
    display: grid;
    place-items: center;
    background:
      conic-gradient(rgba(16, 185, 129, 0.96) var(--score-angle), rgba(255,255,255,0.09) 0deg);
    box-shadow:
      0 18px 40px rgba(0, 0, 0, 0.28),
      0 0 34px rgba(16, 185, 129, 0.16);
  }

  .ma-equity-safe-ring-core {
    width: 72px;
    height: 72px;
    border-radius: 999px;
    display: grid;
    place-items: center;
    background: rgba(15, 23, 42, 0.97);
    border: 1px solid rgba(255, 255, 255, 0.08);
  }

  .ma-equity-safe-ring-core strong {
    color: #f8fafc;
    font-size: 23px;
    font-weight: 850;
    letter-spacing: -0.045em;
    font-variant-numeric: tabular-nums;
  }

  .ma-equity-safe-score-copy {
    min-width: 0;
  }

  .ma-equity-safe-score-copy strong {
    display: block;
    margin-bottom: 8px;
    color: #f8fafc;
    line-height: 1.26;
    overflow-wrap: anywhere;
  }

  .ma-equity-safe-score-copy p {
    margin: 0;
    color: rgba(203, 213, 225, 0.78);
    line-height: 1.58;
    overflow-wrap: anywhere;
  }

  .ma-equity-safe-metrics {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(255px, 1fr));
    gap: 16px;
    min-width: 0;
  }

  .ma-equity-safe-metric {
    min-width: 0;
    min-height: 158px;
    padding: 20px;
    border-radius: 24px;
    background:
      linear-gradient(135deg, rgba(255,255,255,0.058), rgba(255,255,255,0.022));
    border: 1px solid rgba(255,255,255,0.085);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 16px;
    overflow: hidden;
  }

  .ma-equity-safe-metric-head {
    display: flex;
    justify-content: space-between;
    gap: 14px;
    align-items: flex-start;
    min-width: 0;
  }

  .ma-equity-safe-metric-head > div:first-child {
    min-width: 0;
    flex: 1;
  }

  .ma-equity-safe-metric-icon {
    width: 40px;
    height: 40px;
    border-radius: 16px;
  }

  .ma-equity-safe-metric-value {
    margin-top: 10px;
    color: #f8fafc;
    font-size: clamp(23px, 2.4vw, 34px);
    font-weight: 820;
    line-height: 1.12;
    letter-spacing: -0.035em;
    overflow-wrap: anywhere;
    word-break: normal;
    font-variant-numeric: tabular-nums;
    text-rendering: geometricPrecision;
  }

  .ma-equity-safe-metric-description {
    margin: 0;
    color: rgba(148, 163, 184, 0.84);
    line-height: 1.52;
  }

  @media (max-width: 900px) {
    .ma-equity-safe-signal-grid {
      grid-template-columns: 1fr;
    }

    .ma-equity-safe-score {
      grid-template-columns: 102px minmax(0, 1fr);
    }
  }

  @media (max-width: 680px) {
    .ma-equity-safe-card {
      padding: 24px;
      border-radius: 26px;
    }

    .ma-equity-safe-value {
      font-size: clamp(38px, 13vw, 58px);
      letter-spacing: -0.05em;
    }

    .ma-equity-safe-score {
      grid-template-columns: 1fr;
      justify-items: start;
    }

    .ma-equity-safe-metrics {
      grid-template-columns: 1fr;
    }
  }

  .ma-equity-safe-card,
  .ma-equity-safe-signal,
  .ma-equity-safe-score,
  .ma-equity-safe-score-copy,
  .ma-equity-safe-metric {
    background: rgba(15, 23, 42, 0.72) !important;
    background-image: none !important;
    border-color: rgba(148, 163, 184, 0.14) !important;
    box-shadow: none !important;
  }

  .ma-equity-safe-card::before {
    content: none !important;
    display: none !important;
  }

  .ma-equity-safe-inner,
  .ma-equity-safe-signal-grid,
  .ma-equity-safe-score-copy,
  .ma-equity-safe-metrics,
  .ma-equity-safe-metric-head,
  .ma-equity-safe-metric-description {
    background: transparent !important;
    background-image: none !important;
    border-color: transparent !important;
    box-shadow: none !important;
  }

  .ma-equity-safe-value,
  .ma-equity-safe-metric-value,
  .ma-equity-safe-kicker,
  .ma-equity-safe-signal-title {
    letter-spacing: 0 !important;
    text-shadow: none !important;
  }
`;

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
    <article className="ma-equity-safe-metric">
      <div className="ma-equity-safe-metric-head">
        <div>
          <div className="kpi-label">{label}</div>

          <div className={`ma-equity-safe-metric-value ${color}`.trim()}>
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
    <section className="ma-equity-safe-card">
      <style>{equityHeroCss}</style>

      <div className="ma-equity-safe-inner">
        <header className="ma-equity-safe-header">
          <div className="ma-equity-safe-kicker">
            <TrendingUp size={14} />
            Adjusted equity value — DSS view
          </div>

          <div className="ma-equity-safe-badges">
            <Badge variant={riskBadgeVariant}>
              {riskLabel} riesgo
            </Badge>
          </div>

          <h2 className="ma-equity-safe-value">
            {formatCurrencyTight(equityBase, reportCurrency)}
          </h2>

          <p className="ma-equity-safe-copy">
            Live engine estimate: adjusted multiple on normalized EBITDA, net
            debt and working capital adjustment. Indicative DSS only — not a
            fairness opinion or certified valuation.
          </p>
        </header>

        <aside className="ma-equity-safe-signal">
          <div className="ma-equity-safe-signal-grid">
            <div className="ma-equity-safe-signal-head">
              <div>
                <div className="kpi-label">Quality Signal</div>
                <div className="ma-equity-safe-signal-title">
                  {riskSignal.title}
                </div>
              </div>

              <div className="ma-equity-safe-icon">
                <ShieldCheck size={20} />
              </div>
            </div>

            <div className="ma-equity-safe-score">
              <div
                className="ma-equity-safe-ring"
                style={{ '--score-angle': scoreAngle }}
              >
                <div className="ma-equity-safe-ring-core">
                  <strong>{normalizedScore}</strong>
                </div>
              </div>

              <div className="ma-equity-safe-score-copy">
                <strong>{normalizedScore}/100 quality score</strong>

                <p>{riskSignal.description}</p>
              </div>
            </div>
          </div>
        </aside>

        <div className="ma-equity-safe-metrics">
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
