import React from 'react';
import {
  Banknote,
  Gauge,
  PieChart,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';
import { Badge } from '../../../shared/components/ui/Badge.jsx';
import { formatCurrency } from '../../../shared/utils/formatCurrency.js';

const fundingHeroCss = `
  .funding-hero-card {
    position: relative;
    overflow: hidden;
    border-radius: 34px;
    padding: 32px;
    border: 1px solid rgba(148, 163, 184, 0.18);
    background:
      radial-gradient(circle at 8% 0%, rgba(16, 185, 129, 0.16), transparent 30%),
      radial-gradient(circle at 88% 12%, rgba(37, 99, 235, 0.20), transparent 30%),
      linear-gradient(135deg, rgba(2, 6, 23, 0.98), rgba(15, 23, 42, 0.96));
    box-shadow:
      0 28px 90px rgba(0, 0, 0, 0.32),
      inset 0 1px 0 rgba(255,255,255,0.055);
  }

  .funding-hero-card::before {
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

  .funding-hero-card::after {
    content: "";
    position: absolute;
    inset: auto -130px -160px auto;
    width: 360px;
    height: 360px;
    border-radius: 999px;
    background: radial-gradient(circle, rgba(16, 185, 129, 0.14), transparent 70%);
    pointer-events: none;
  }

  .funding-hero-inner {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: 28px;
  }

  .funding-hero-top {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(280px, 360px);
    gap: 28px;
    align-items: center;
  }

  .funding-hero-kicker {
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

  .funding-hero-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 16px;
  }

  .funding-hero-value {
    margin: 0;
    font-size: clamp(42px, 5.8vw, 76px);
    line-height: 0.92;
    letter-spacing: -0.075em;
    color: #f8fafc;
    overflow-wrap: anywhere;
  }

  .funding-hero-subcopy {
    max-width: 760px;
    margin: 18px 0 0;
    color: rgba(203, 213, 225, 0.82);
    line-height: 1.7;
  }

  .funding-signal-card {
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

  .funding-signal-head {
    display: flex;
    justify-content: space-between;
    gap: 18px;
    align-items: flex-start;
    margin-bottom: 20px;
  }

  .funding-signal-title {
    margin-top: 8px;
    font-size: 20px;
    line-height: 1.18;
    letter-spacing: -0.04em;
  }

  .funding-icon-box,
  .funding-stat-icon {
    flex: 0 0 auto;
    display: grid;
    place-items: center;
    border-radius: 18px;
    background: rgba(16, 185, 129, 0.12);
    border: 1px solid rgba(16, 185, 129, 0.24);
    color: #86efac;
  }

  .funding-icon-box {
    width: 48px;
    height: 48px;
  }

  .funding-signal-body {
    padding: 18px;
    border-radius: 22px;
    background: rgba(255,255,255,0.045);
    border: 1px solid rgba(255,255,255,0.08);
  }

  .funding-signal-body strong {
    display: block;
    margin-bottom: 8px;
  }

  .funding-signal-body p {
    margin: 0;
    color: rgba(203, 213, 225, 0.78);
    line-height: 1.55;
  }

  .funding-stats-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 16px;
  }

  .funding-stat {
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

  .funding-stat-head {
    display: flex;
    justify-content: space-between;
    gap: 14px;
    align-items: flex-start;
  }

  .funding-stat-icon {
    width: 40px;
    height: 40px;
    border-radius: 16px;
  }

  .funding-stat-value {
    margin-top: 10px;
    font-size: 22px;
    font-weight: 800;
    line-height: 1.12;
    letter-spacing: -0.045em;
    overflow-wrap: anywhere;
  }

  .funding-stat p {
    margin: 0;
    color: rgba(148, 163, 184, 0.84);
    line-height: 1.5;
  }

  @media (max-width: 1180px) {
    .funding-hero-top {
      grid-template-columns: 1fr;
    }

    .funding-stats-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 680px) {
    .funding-hero-card {
      border-radius: 26px;
      padding: 24px;
    }

    .funding-stats-grid {
      grid-template-columns: 1fr;
    }
  }
`;

function toNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function getDerivedNumber(derived, keys, fallback = 0) {
  for (const key of keys) {
    const value = derived?.[key];

    if (Number.isFinite(Number(value))) {
      return Number(value);
    }
  }

  return fallback;
}

function getReadinessLabel(derived) {
  const raw =
    derived?.readinessLevel?.label ||
    derived?.readinessLabel ||
    derived?.riskLevel?.label ||
    '';

  if (raw) return raw;

  const score = getDerivedNumber(
    derived,
    ['readinessScore', 'investorReadinessScore', 'qualityScore'],
    0
  );

  if (score >= 80) return 'Alta readiness';
  if (score >= 60) return 'Media readiness';

  return 'Baja readiness';
}

function getFundingSignal(derived) {
  const dilution = getDerivedNumber(derived, ['dilutionPct', 'dilution'], 0);

  const runway = getDerivedNumber(
    derived,
    ['runwayAfterRaise', 'postRaiseRunway', 'runwayMonths'],
    0
  );

  if (runway >= 18 && dilution <= 20) {
    return {
      title: 'Healthy funding profile',
      posture: 'Proceed with raise',
      description:
        'La ronda ofrece runway razonable y una dilución defendible para avanzar con inversores.'
    };
  }

  if (runway >= 12 && dilution <= 30) {
    return {
      title: 'Workable funding profile',
      posture: 'Refine terms',
      description:
        'La estructura es viable, aunque conviene revisar valoración, burn y narrativa de ejecución.'
    };
  }

  return {
    title: 'Funding profile needs work',
    posture: 'Strengthen case',
    description:
      'Conviene reforzar runway, valoración o preparación inversora antes de presentar la ronda.'
  };
}

function Stat({ label, value, description, icon: Icon, color = '' }) {
  return (
    <article className="funding-stat">
      <div className="funding-stat-head">
        <div>
          <div className="kpi-label">{label}</div>

          <div className={`funding-stat-value ${color}`.trim()}>
            {value}
          </div>
        </div>

        <div className="funding-stat-icon">
          <Icon size={17} />
        </div>
      </div>

      <p>{description}</p>
    </article>
  );
}

export function FundingHeroCard({ derived, settings }) {
  const currency = settings?.reportCurrency || 'EUR';

  const targetRaise = getDerivedNumber(
    derived,
    ['targetRaise', 'fundingTarget', 'raiseAmount'],
    0
  );

  const preMoney = getDerivedNumber(
    derived,
    ['preMoneyValuation', 'preMoney'],
    0
  );

  const postMoney = getDerivedNumber(
    derived,
    ['postMoneyValuation', 'postMoney'],
    preMoney + targetRaise
  );

  const dilution = getDerivedNumber(
    derived,
    ['dilutionPct', 'dilution'],
    postMoney > 0 ? (targetRaise / postMoney) * 100 : 0
  );

  const runway = getDerivedNumber(
    derived,
    ['runwayAfterRaise', 'postRaiseRunway', 'runwayMonths'],
    0
  );

  const readinessLabel = getReadinessLabel(derived);
  const signal = getFundingSignal(derived);

  return (
    <section className="funding-hero-card">
      <style>{fundingHeroCss}</style>

      <div className="funding-hero-inner">
        <div className="funding-hero-top">
          <div>
            <div className="funding-hero-kicker">
              <TrendingUp size={14} />
              Funding economics (scenario draft)
            </div>

            <div className="funding-hero-badges">
              <Badge>Scenario draft workspace</Badge>
              <Badge>{readinessLabel}</Badge>
              <Badge>{signal.posture}</Badge>
            </div>

            <h2 className="funding-hero-value">
              {formatCurrency(targetRaise, currency)}
            </h2>

            <p className="funding-hero-subcopy">
              Based on current workspace inputs. Not persisted as an official funding round.
              Capital target, valuation, dilution, runway and readiness are scenario estimates.
            </p>
          </div>

          <aside className="funding-signal-card ceos-executive-inner-surface">
            <div className="funding-signal-head">
              <div>
                <div className="kpi-label">Funding Signal</div>
                <div className="funding-signal-title">
                  {signal.title}
                </div>
              </div>

              <div className="funding-icon-box">
                <ShieldCheck size={20} />
              </div>
            </div>

            <div className="funding-signal-body">
              <strong>{signal.posture}</strong>
              <p>{signal.description}</p>
            </div>
          </aside>
        </div>

        <div className="funding-stats-grid">
          <Stat
            label="Pre-money"
            value={formatCurrency(preMoney, currency)}
            description="Valoración antes de la ronda."
            icon={Banknote}
          />

          <Stat
            label="Post-money"
            value={formatCurrency(postMoney, currency)}
            description="Valoración estimada tras la ronda."
            icon={TrendingUp}
            color="text-success"
          />

          <Stat
            label="Dilution"
            value={`${toNumber(dilution).toFixed(1)}%`}
            description="Participación estimada cedida."
            icon={PieChart}
            color="text-danger"
          />

          <Stat
            label="Runway post-raise"
            value={`${toNumber(runway).toFixed(1)}m`}
            description="Meses estimados de caja tras la ronda."
            icon={Gauge}
          />
        </div>
      </div>
    </section>
  );
}