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
  .ma-equity-hero-card {
    position: relative;
    overflow: hidden;
    border-radius: 34px;
    padding: 32px;
    border: 1px solid rgba(148, 163, 184, 0.18);
    background:
      radial-gradient(circle at 8% 0%, rgba(16, 185, 129, 0.18), transparent 30%),
      radial-gradient(circle at 88% 12%, rgba(37, 99, 235, 0.18), transparent 30%),
      linear-gradient(135deg, rgba(2, 6, 23, 0.98), rgba(15, 23, 42, 0.96));
    box-shadow:
      0 28px 90px rgba(0, 0, 0, 0.32),
      inset 0 1px 0 rgba(255,255,255,0.055);
  }

  .ma-equity-hero-card::before {
    content: "";
    position: absolute;
    inset: 0;
    background:
      linear-gradient(rgba(255,255,255,0.026) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.026) 1px, transparent 1px);
    background-size: 48px 48px;
    mask-image: linear-gradient(to bottom, rgba(0,0,0,0.75), transparent 82%);
    pointer-events: none;
  }

  .ma-equity-hero-card::after {
    content: "";
    position: absolute;
    inset: auto -130px -160px auto;
    width: 360px;
    height: 360px;
    border-radius: 999px;
    background: radial-gradient(circle, rgba(16, 185, 129, 0.14), transparent 70%);
    pointer-events: none;
  }

  .ma-equity-hero-inner {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: 28px;
  }

  .ma-equity-hero-top {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(280px, 360px);
    gap: 28px;
    align-items: center;
  }

  .ma-equity-kicker {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 14px;
    font-size: 11px;
    line-height: 1;
    text-transform: uppercase;
    letter-spacing: 0.17em;
    color: rgba(148, 163, 184, 0.96);
  }

  .ma-equity-title-row {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    align-items: center;
    margin-bottom: 16px;
  }

  .ma-equity-value {
    margin: 0;
    font-size: clamp(42px, 5.8vw, 76px);
    line-height: 0.92;
    letter-spacing: -0.075em;
    color: #f8fafc;
  }

  .ma-equity-value.is-pending {
    color: rgba(226, 232, 240, 0.72);
  }

  .ma-equity-subcopy {
    max-width: 760px;
    margin: 18px 0 0;
    color: rgba(203, 213, 225, 0.82);
    line-height: 1.7;
  }

  .ma-equity-signal-card {
    border-radius: 28px;
    padding: 22px;
    background:
      linear-gradient(135deg, rgba(255,255,255,0.075), rgba(255,255,255,0.026)),
      rgba(15, 23, 42, 0.72);
    border: 1px solid rgba(148, 163, 184, 0.18);
    box-shadow:
      0 22px 60px rgba(0, 0, 0, 0.22),
      inset 0 1px 0 rgba(255,255,255,0.045);
  }

  .ma-equity-signal-head {
    display: flex;
    justify-content: space-between;
    gap: 18px;
    align-items: flex-start;
    margin-bottom: 20px;
  }

  .ma-equity-signal-title {
    margin-top: 8px;
    font-size: 20px;
    line-height: 1.18;
    letter-spacing: -0.04em;
  }

  .ma-equity-icon-box,
  .ma-equity-stat-icon {
    flex: 0 0 auto;
    display: grid;
    place-items: center;
    border-radius: 18px;
    background: rgba(16, 185, 129, 0.12);
    border: 1px solid rgba(16, 185, 129, 0.24);
    color: #86efac;
  }

  .ma-equity-icon-box {
    width: 48px;
    height: 48px;
  }

  .ma-equity-score-row {
    display: grid;
    grid-template-columns: 96px minmax(0, 1fr);
    gap: 18px;
    align-items: center;
  }

  .ma-equity-score-ring {
    width: 94px;
    height: 94px;
    border-radius: 999px;
    display: grid;
    place-items: center;
    background:
      conic-gradient(rgba(16, 185, 129, 0.96) var(--score-angle), rgba(255,255,255,0.09) 0deg);
    box-shadow:
      0 18px 40px rgba(0, 0, 0, 0.28),
      0 0 34px rgba(16, 185, 129, 0.16);
  }

  .ma-equity-score-core {
    width: 70px;
    height: 70px;
    border-radius: 999px;
    display: grid;
    place-items: center;
    background: rgba(15, 23, 42, 0.97);
    border: 1px solid rgba(255, 255, 255, 0.08);
  }

  .ma-equity-score-core strong {
    font-size: 22px;
    letter-spacing: -0.055em;
  }

  .ma-equity-score-core strong.is-empty-score {
    font-size: 28px;
    color: rgba(226, 232, 240, 0.72);
  }

  .ma-equity-score-copy strong {
    display: block;
    margin-bottom: 8px;
  }

  .ma-equity-score-copy p {
    margin: 0;
    color: rgba(203, 213, 225, 0.78);
    line-height: 1.55;
  }

  .ma-equity-stats-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 16px;
  }

  .ma-equity-stat {
    min-height: 142px;
    padding: 20px;
    border-radius: 24px;
    background:
      linear-gradient(135deg, rgba(255,255,255,0.058), rgba(255,255,255,0.022));
    border: 1px solid rgba(255,255,255,0.085);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 18px;
  }

  .ma-equity-stat-head {
    display: flex;
    justify-content: space-between;
    gap: 14px;
    align-items: flex-start;
  }

  .ma-equity-stat-icon {
    width: 40px;
    height: 40px;
    border-radius: 16px;
  }

  .ma-equity-stat-value {
    margin-top: 10px;
    font-size: 22px;
    font-weight: 800;
    line-height: 1.12;
    letter-spacing: -0.045em;
    overflow-wrap: anywhere;
  }

  .ma-equity-stat p {
    margin: 0;
    color: rgba(148, 163, 184, 0.84);
    line-height: 1.5;
  }

  @media (max-width: 1180px) {
    .ma-equity-hero-top {
      grid-template-columns: 1fr;
    }

    .ma-equity-stats-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 680px) {
    .ma-equity-hero-card {
      border-radius: 26px;
      padding: 24px;
    }

    .ma-equity-stats-grid {
      grid-template-columns: 1fr;
    }

    .ma-equity-score-row {
      grid-template-columns: 1fr;
    }
  }
`;

function getSafeNumber(value, fallback = 0) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) return fallback;

  return parsed;
}

function hasValuationData(derived) {
  const normalizedEbitda = Number(derived?.normalizedEbitda);
  const equityBase = Number(derived?.equityBase);
  const evBase = Number(derived?.evBase);
  const adjustedMultiple = Number(derived?.adjustedMultiple);

  return (
    Number.isFinite(normalizedEbitda) &&
    normalizedEbitda > 0 &&
    Number.isFinite(equityBase) &&
    equityBase > 0 &&
    Number.isFinite(evBase) &&
    evBase > 0 &&
    Number.isFinite(adjustedMultiple) &&
    adjustedMultiple > 0
  );
}

function getRiskBadgeVariant(label, hasData) {
  if (!hasData) return 'secondary';
  if (label === 'Bajo') return 'success';
  if (label === 'Medio') return 'warning';

  return 'danger';
}

function getRiskSignal(label, hasData) {
  if (!hasData) {
    return {
      title: 'Valuation pending',
      description:
        'Completa los inputs mínimos para generar una valoración, un score de calidad y una lectura de riesgo defendible.'
    };
  }

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

function formatMetric(value, formatter, hasData) {
  if (!hasData) return 'N/A';

  return formatter(value);
}

function Stat({ label, value, description, icon: Icon, color = '' }) {
  return (
    <article className="ma-equity-stat">
      <div className="ma-equity-stat-head">
        <div>
          <div className="kpi-label">{label}</div>

          <div className={`ma-equity-stat-value ${color}`.trim()}>
            {value}
          </div>
        </div>

        <div className="ma-equity-stat-icon">
          <Icon size={17} />
        </div>
      </div>

      <p>{description}</p>
    </article>
  );
}

export function EquityHeroCard({ derived, settings }) {
  const reportCurrency = settings?.reportCurrency || 'EUR';
  const hasData = hasValuationData(derived);

  const riskLabel = hasData ? derived?.riskLevel?.label || 'N/A' : 'Pendiente';
  const riskBadgeVariant = getRiskBadgeVariant(riskLabel, hasData);
  const riskSignal = getRiskSignal(riskLabel, hasData);

  const equityBase = getSafeNumber(derived?.equityBase);
  const evBase = getSafeNumber(derived?.evBase);
  const netDebt = getSafeNumber(derived?.netDebt);
  const adjustedMultiple = getSafeNumber(derived?.adjustedMultiple);

  const qualityScore = hasData
    ? Math.max(0, Math.min(100, Math.round(getSafeNumber(derived?.qualityScore))))
    : null;

  const scoreAngle = `${(qualityScore ?? 0) * 3.6}deg`;

  return (
    <section className="ma-equity-hero-card">
      <style>{equityHeroCss}</style>

      <div className="ma-equity-hero-inner">
        <div className="ma-equity-hero-top">
          <div>
            <div className="ma-equity-kicker">
              <TrendingUp size={14} />
              Equity base valuation
            </div>

            <div className="ma-equity-title-row">
              <Badge variant={riskBadgeVariant}>
                {riskLabel}
                {hasData ? ' riesgo' : ''}
              </Badge>
            </div>

            <h2 className={`ma-equity-value ${hasData ? '' : 'is-pending'}`.trim()}>
              {hasData ? formatCurrency(equityBase, reportCurrency) : 'Pendiente'}
            </h2>

            <p className="ma-equity-subcopy">
              {hasData
                ? 'Valor atribuible al equity después de aplicar múltiplo ajustado, deuda neta, calidad del activo y señales principales del deal.'
                : 'La valoración aparecerá cuando el caso tenga datos suficientes para calcular EBITDA normalizado, múltiplo ajustado, Enterprise Value y Equity Value.'}
            </p>
          </div>

          <aside className="ma-equity-signal-card">
            <div className="ma-equity-signal-head">
              <div>
                <div className="kpi-label">Quality Signal</div>
                <div className="ma-equity-signal-title">
                  {riskSignal.title}
                </div>
              </div>

              <div className="ma-equity-icon-box">
                <ShieldCheck size={20} />
              </div>
            </div>

            <div className="ma-equity-score-row">
              <div
                className="ma-equity-score-ring"
                style={{ '--score-angle': scoreAngle }}
              >
                <div className="ma-equity-score-core">
                  <strong className={qualityScore === null ? 'is-empty-score' : ''}>
                    {qualityScore === null ? '—' : qualityScore}
                  </strong>
                </div>
              </div>

              <div className="ma-equity-score-copy">
                <strong>
                  {qualityScore === null ? 'Quality score pending' : `${qualityScore}/100 quality score`}
                </strong>

                <p>{riskSignal.description}</p>
              </div>
            </div>
          </aside>
        </div>

        <div className="ma-equity-stats-grid">
          <Stat
            label="Enterprise Value"
            value={formatMetric(
              evBase,
              (value) => formatCurrency(value, reportCurrency),
              hasData
            )}
            description="Valor antes de deuda, caja y ajustes finales."
            icon={BarChart3}
          />

          <Stat
            label="Deuda neta"
            value={formatMetric(
              netDebt,
              (value) => formatCurrency(value, reportCurrency),
              hasData
            )}
            description="Impacto de deuda y caja sobre el equity."
            icon={ArrowDownRight}
            color={hasData ? 'text-danger' : ''}
          />

          <Stat
            label="Múltiplo"
            value={formatMetric(
              adjustedMultiple,
              (value) => `x${value.toFixed(2)}`,
              hasData
            )}
            description="Múltiplo ajustado aplicado al EBITDA normalizado."
            icon={Gauge}
          />

          <Stat
            label="Score"
            value={qualityScore === null ? 'N/A' : `${qualityScore}/100`}
            description="Calidad financiera, riesgo y transferibilidad."
            icon={Activity}
            color={hasData ? derived?.riskLevel?.color || '' : ''}
          />
        </div>
      </div>
    </section>
  );
}