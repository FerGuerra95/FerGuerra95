import React from 'react';
import {
  ArrowDownRight,
  Banknote,
  Calculator,
  CheckCircle2,
  Coins,
  Landmark,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';
import { formatCurrency } from '../../../shared/utils/formatCurrency.js';

const dealStructureCss = `
  .deal-clean-shell {
    width: 100%;
    min-width: 0;
  }

  .deal-clean-card {
    position: relative;
    width: 100%;
    overflow: hidden;
    border-radius: 36px;
    padding: 34px;
    border: 1px solid rgba(148, 163, 184, 0.18);
    background:
      radial-gradient(circle at 8% 0%, rgba(59, 130, 246, 0.18), transparent 34%),
      radial-gradient(circle at 92% 6%, rgba(16, 185, 129, 0.16), transparent 32%),
      linear-gradient(135deg, rgba(255,255,255,0.07), rgba(255,255,255,0.024)),
      rgba(15, 23, 42, 0.74);
    box-shadow:
      0 30px 90px rgba(0, 0, 0, 0.28),
      inset 0 1px 0 rgba(255,255,255,0.05);
  }

  .deal-clean-card::before {
    content: "";
    position: absolute;
    inset: 0;
    background:
      linear-gradient(rgba(255,255,255,0.024) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.024) 1px, transparent 1px);
    background-size: 48px 48px;
    mask-image: linear-gradient(to bottom, rgba(0,0,0,0.72), transparent 82%);
    pointer-events: none;
  }

  .deal-clean-inner {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: 28px;
    min-width: 0;
  }

  .deal-clean-header {
    display: flex;
    justify-content: space-between;
    gap: 24px;
    align-items: flex-start;
  }

  .deal-clean-kicker {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 13px;
    font-size: 11px;
    line-height: 1;
    text-transform: uppercase;
    letter-spacing: 0.17em;
    color: rgba(148, 163, 184, 0.96);
  }

  .deal-clean-title {
    margin: 0;
    font-size: clamp(28px, 3vw, 40px);
    line-height: 1.06;
    letter-spacing: -0.055em;
  }

  .deal-clean-description {
    max-width: 880px;
    margin: 14px 0 0;
    font-size: 15.5px;
    line-height: 1.72;
    color: rgba(203, 213, 225, 0.82);
  }

  .deal-clean-icon {
    flex: 0 0 auto;
    width: 56px;
    height: 56px;
    border-radius: 22px;
    display: grid;
    place-items: center;
    background: rgba(37, 99, 235, 0.15);
    border: 1px solid rgba(96, 165, 250, 0.24);
  }

  .deal-clean-hero {
    min-height: 220px;
    border-radius: 32px;
    padding: 32px;
    display: grid;
    place-items: center;
    text-align: center;
    background:
      radial-gradient(circle at 50% 0%, rgba(16, 185, 129, 0.18), transparent 42%),
      linear-gradient(135deg, rgba(16,185,129,0.12), rgba(255,255,255,0.026)),
      rgba(15, 23, 42, 0.68);
    border: 1px solid rgba(16, 185, 129, 0.26);
    box-shadow:
      0 24px 70px rgba(0, 0, 0, 0.22),
      inset 0 1px 0 rgba(255,255,255,0.045);
  }

  .deal-clean-hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
    padding: 10px 14px;
    border-radius: 999px;
    font-size: 11px;
    line-height: 1;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: #bbf7d0;
    background: rgba(16, 185, 129, 0.12);
    border: 1px solid rgba(16, 185, 129, 0.22);
  }

  .deal-clean-main-value {
    color: #f8fafc;
    font-size: clamp(44px, 5vw, 72px);
    font-weight: 880;
    line-height: 0.95;
    letter-spacing: -0.07em;
    font-variant-numeric: tabular-nums;
    overflow-wrap: anywhere;
  }

  .deal-clean-main-full {
    margin-top: 13px;
    color: rgba(203, 213, 225, 0.72);
    font-size: 14px;
    overflow-wrap: anywhere;
  }

  .deal-clean-main-label {
    max-width: 720px;
    margin: 17px auto 0;
    color: rgba(203, 213, 225, 0.84);
    font-size: 15px;
    line-height: 1.62;
  }

  .deal-clean-main-label strong {
    color: #f8fafc;
  }

  .deal-closing-box {
    border-radius: 32px;
    padding: 28px;
    background:
      linear-gradient(135deg, rgba(255,255,255,0.064), rgba(255,255,255,0.024)),
      rgba(2, 6, 23, 0.34);
    border: 1px solid rgba(255,255,255,0.09);
    box-shadow:
      0 22px 60px rgba(0,0,0,0.18),
      inset 0 1px 0 rgba(255,255,255,0.04);
  }

  .deal-closing-head {
    display: flex;
    justify-content: space-between;
    gap: 24px;
    align-items: flex-start;
    margin-bottom: 24px;
  }

  .deal-closing-head h4 {
    margin: 0;
    font-size: 24px;
    line-height: 1.16;
    letter-spacing: -0.045em;
  }

  .deal-closing-head p {
    max-width: 760px;
    margin: 10px 0 0;
    color: rgba(203, 213, 225, 0.8);
    line-height: 1.66;
  }

  .deal-closing-pill {
    flex: 0 0 auto;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 11px 14px;
    border-radius: 999px;
    color: #bfdbfe;
    background: rgba(37, 99, 235, 0.12);
    border: 1px solid rgba(96, 165, 250, 0.2);
    font-size: 12px;
    font-weight: 760;
    white-space: nowrap;
  }

  .deal-flow-list {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .deal-flow-row {
    display: grid;
    grid-template-columns: 60px minmax(0, 1fr) minmax(220px, 0.42fr);
    gap: 20px;
    align-items: center;
    min-height: 118px;
    padding: 22px;
    border-radius: 26px;
    background:
      linear-gradient(135deg, rgba(255,255,255,0.052), rgba(255,255,255,0.02)),
      rgba(15, 23, 42, 0.54);
    border: 1px solid rgba(255,255,255,0.082);
  }

  .deal-flow-row.is-positive {
    border-color: rgba(16, 185, 129, 0.24);
    background:
      linear-gradient(135deg, rgba(16,185,129,0.10), rgba(255,255,255,0.024)),
      rgba(15, 23, 42, 0.58);
  }

  .deal-flow-row.is-warning {
    border-color: rgba(245, 158, 11, 0.22);
    background:
      linear-gradient(135deg, rgba(245,158,11,0.09), rgba(255,255,255,0.022)),
      rgba(15, 23, 42, 0.58);
  }

  .deal-flow-number {
    width: 60px;
    height: 60px;
    border-radius: 22px;
    display: grid;
    place-items: center;
    color: #bfdbfe;
    background: rgba(37, 99, 235, 0.14);
    border: 1px solid rgba(96, 165, 250, 0.22);
    font-weight: 850;
    font-size: 14px;
  }

  .deal-flow-copy {
    min-width: 0;
  }

  .deal-flow-label {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: rgba(148, 163, 184, 0.96);
  }

  .deal-flow-copy strong {
    display: block;
    color: #f8fafc;
    font-size: 19px;
    line-height: 1.2;
    letter-spacing: -0.025em;
  }

  .deal-flow-copy p {
    margin: 9px 0 0;
    color: rgba(203, 213, 225, 0.76);
    line-height: 1.58;
  }

  .deal-flow-value {
    min-width: 0;
    text-align: right;
  }

  .deal-flow-value strong {
    display: block;
    color: #f8fafc;
    font-size: clamp(26px, 3vw, 38px);
    line-height: 1;
    letter-spacing: -0.06em;
    font-weight: 880;
    font-variant-numeric: tabular-nums;
    overflow-wrap: anywhere;
  }

  .deal-flow-value span {
    display: block;
    margin-top: 9px;
    color: rgba(203, 213, 225, 0.62);
    font-size: 12.5px;
    line-height: 1.35;
    overflow-wrap: anywhere;
  }

  .deal-clean-support {
    border-radius: 30px;
    padding: 26px;
    background:
      linear-gradient(135deg, rgba(255,255,255,0.055), rgba(255,255,255,0.022)),
      rgba(15, 23, 42, 0.56);
    border: 1px solid rgba(255,255,255,0.085);
  }

  .deal-clean-support-head {
    display: flex;
    justify-content: space-between;
    gap: 20px;
    align-items: flex-start;
    margin-bottom: 20px;
  }

  .deal-clean-support-head h4 {
    margin: 0;
    font-size: 21px;
    letter-spacing: -0.04em;
  }

  .deal-clean-support-head p {
    margin: 9px 0 0;
    color: rgba(203, 213, 225, 0.8);
    line-height: 1.62;
  }

  .deal-clean-score-pill {
    flex: 0 0 auto;
    min-width: 122px;
    padding: 13px 14px;
    border-radius: 20px;
    text-align: center;
    background: rgba(37, 99, 235, 0.10);
    border: 1px solid rgba(96, 165, 250, 0.16);
  }

  .deal-clean-score-pill span {
    display: block;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    color: rgba(148, 163, 184, 0.94);
  }

  .deal-clean-score-pill strong {
    display: block;
    margin-top: 7px;
    color: #f8fafc;
    font-size: 23px;
    line-height: 1;
    white-space: nowrap;
  }

  .deal-clean-support-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 14px;
  }

  .deal-clean-support-item {
    min-width: 0;
    min-height: 116px;
    padding: 18px;
    border-radius: 22px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.074);
  }

  .deal-clean-support-item strong {
    display: block;
    margin-top: 10px;
    color: #f8fafc;
    font-size: 21px;
    line-height: 1.14;
    letter-spacing: -0.035em;
    font-variant-numeric: tabular-nums;
    overflow-wrap: anywhere;
  }

  .deal-clean-support-item small {
    display: block;
    margin-top: 7px;
    color: rgba(203, 213, 225, 0.62);
    overflow-wrap: anywhere;
  }

  .deal-clean-summary {
    border-radius: 26px;
    padding: 22px;
    background: rgba(37, 99, 235, 0.08);
    border: 1px solid rgba(96, 165, 250, 0.14);
  }

  .deal-clean-summary strong {
    display: block;
    margin-bottom: 8px;
    color: #f8fafc;
  }

  .deal-clean-summary p {
    margin: 0;
    color: rgba(203, 213, 225, 0.84);
    line-height: 1.66;
  }

  @media (max-width: 1280px) {
    .deal-clean-support-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .deal-flow-row {
      grid-template-columns: 60px minmax(0, 1fr);
    }

    .deal-flow-value {
      grid-column: 2 / -1;
      text-align: left;
    }
  }

  @media (max-width: 780px) {
    .deal-clean-card {
      border-radius: 28px;
      padding: 24px;
    }

    .deal-clean-header,
    .deal-closing-head,
    .deal-clean-support-head {
      flex-direction: column;
    }

    .deal-clean-hero {
      border-radius: 26px;
      padding: 26px 20px;
    }

    .deal-closing-box,
    .deal-clean-support {
      border-radius: 26px;
      padding: 20px;
    }

    .deal-flow-row {
      grid-template-columns: 1fr;
      min-height: auto;
      padding: 20px;
    }

    .deal-flow-number {
      width: 52px;
      height: 52px;
      border-radius: 19px;
    }

    .deal-flow-value {
      grid-column: auto;
      text-align: left;
    }

    .deal-clean-support-grid {
      grid-template-columns: 1fr;
    }
  }
`;

function getSafeNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function getCurrency(derived, settings) {
  return (
    settings?.reportCurrency ||
    derived?.reportCurrency ||
    derived?.currency ||
    'EUR'
  );
}

function formatFullMoney(value, currency) {
  return formatCurrency(getSafeNumber(value), currency);
}

function formatCompactMoney(value, currency) {
  const number = getSafeNumber(value);
  const abs = Math.abs(number);

  if (abs >= 1000000) {
    return `${(number / 1000000).toLocaleString('es-ES', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })} M€`;
  }

  if (abs >= 1000) {
    return `${(number / 1000).toLocaleString('es-ES', {
      maximumFractionDigits: 0
    })} k€`;
  }

  return formatCurrency(number, currency);
}

function getWorkingCapitalAdjustment(derived) {
  return getSafeNumber(
    derived?.workingCapitalAdjustment ??
      derived?.wcAdjustment ??
      derived?.netWorkingCapitalAdjustment ??
      0
  );
}

function getTransactionCosts(derived) {
  return getSafeNumber(
    derived?.transactionCosts ??
      derived?.transactionFeesAmount ??
      derived?.feesAmount ??
      0
  );
}

function getTaxLeakage(derived) {
  return getSafeNumber(
    derived?.taxLeakage ??
      derived?.taxCashImpact ??
      derived?.taxesAmount ??
      0
  );
}

function getNetProceeds(derived, equityBase, transactionCosts, taxLeakage) {
  const explicitValue = Number(derived?.netProceeds);

  if (Number.isFinite(explicitValue)) return explicitValue;

  return Math.max(0, equityBase - transactionCosts - taxLeakage);
}

function FlowRow({
  number,
  label,
  title,
  description,
  value,
  fullValue,
  icon: Icon,
  tone = '',
  currency
}) {
  return (
    <article className={`deal-flow-row ${tone}`.trim()}>
      <div className="deal-flow-number">{number}</div>

      <div className="deal-flow-copy">
        <div className="deal-flow-label">
          <Icon size={14} />
          {label}
        </div>

        <strong>{title}</strong>

        <p>{description}</p>
      </div>

      <div className="deal-flow-value">
        <strong>{formatCompactMoney(value, currency)}</strong>
        <span>{fullValue || formatFullMoney(value, currency)}</span>
      </div>
    </article>
  );
}

function SupportItem({ label, value, currency, isMultiple = false }) {
  return (
    <div className="deal-clean-support-item">
      <div className="kpi-label">{label}</div>

      <strong>
        {isMultiple
          ? `x${getSafeNumber(value).toFixed(2)}`
          : formatCompactMoney(value, currency)}
      </strong>

      {!isMultiple ? <small>{formatFullMoney(value, currency)}</small> : null}
    </div>
  );
}

export function DealStructureCard({ derived, settings }) {
  const currency = getCurrency(derived, settings);

  const enterpriseValue = getSafeNumber(derived?.evBase);
  const equityBase = getSafeNumber(derived?.equityBase);
  const netDebt = getSafeNumber(derived?.netDebt);
  const normalizedEbitda = getSafeNumber(derived?.normalizedEbitda);
  const adjustedMultiple = getSafeNumber(derived?.adjustedMultiple);
  const qualityScore = Math.round(getSafeNumber(derived?.qualityScore));

  const workingCapitalAdjustment = getWorkingCapitalAdjustment(derived);
  const transactionCosts = getTransactionCosts(derived);
  const taxLeakage = getTaxLeakage(derived);
  const closingCosts = transactionCosts + taxLeakage;

  const netProceeds = getNetProceeds(
    derived,
    equityBase,
    transactionCosts,
    taxLeakage
  );

  return (
    <section className="deal-clean-shell">
      <style>{dealStructureCss}</style>

      <div className="deal-clean-card">
        <div className="deal-clean-inner">
          <header className="deal-clean-header">
            <div>
              <div className="deal-clean-kicker">
                <Calculator size={14} />
                Deal closing structure
              </div>

              <h3 className="deal-clean-title">Estructura de cierre</h3>

              <p className="deal-clean-description">
                Vista ejecutiva para entender de forma clara el puente entre
                Enterprise Value, deuda neta, Equity Value y caja final estimada.
                El objetivo es que el cierre se pueda explicar en comité sin
                ruido visual ni columnas forzadas.
              </p>
            </div>

            <div className="deal-clean-icon">
              <ShieldCheck size={22} />
            </div>
          </header>

          <section className="deal-clean-hero">
            <div>
              <div className="deal-clean-hero-badge">
                <Coins size={14} />
                Resultado estimado de cierre
              </div>

              <div className="deal-clean-main-value">
                {formatCompactMoney(netProceeds, currency)}
              </div>

              <div className="deal-clean-main-full">
                {formatFullMoney(netProceeds, currency)}
              </div>

              <p className="deal-clean-main-label">
                <strong>Net Proceeds</strong> estimados después de deuda neta,
                ajustes de cierre, costes e impacto fiscal estimado.
              </p>
            </div>
          </section>

          <section className="deal-closing-box">
            <div className="deal-closing-head">
              <div>
                <h4>Puente económico del deal</h4>

                <p>
                  Esta es la parte clave: un único bloque amplio y ordenado para
                  explicar cómo se pasa del valor operativo de la empresa a la
                  caja estimada para el vendedor.
                </p>
              </div>

              <div className="deal-closing-pill">
                <CheckCircle2 size={14} />
                Executive view
              </div>
            </div>

            <div className="deal-flow-list">
              <FlowRow
                number="01"
                label="Valor operativo"
                title="Enterprise Value"
                description="Valor de la compañía antes de deuda, caja y ajustes. Es la base económica de la operación."
                value={enterpriseValue}
                fullValue={`${formatFullMoney(normalizedEbitda, currency)} × x${adjustedMultiple.toFixed(2)}`}
                icon={Landmark}
                currency={currency}
              />

              <FlowRow
                number="02"
                label="Ajuste financiero"
                title="Deuda neta"
                description="Impacto de la deuda y caja sobre el valor atribuible a los accionistas."
                value={netDebt}
                icon={ArrowDownRight}
                tone={netDebt > 0 ? 'is-warning' : 'is-positive'}
                currency={currency}
              />

              <FlowRow
                number="03"
                label="Valor accionarial"
                title="Equity Value"
                description="Valor estimado de las participaciones después de ajustar deuda y caja."
                value={equityBase}
                icon={Banknote}
                tone="is-positive"
                currency={currency}
              />

              <FlowRow
                number="04"
                label="Caja de cierre"
                title="Net Proceeds"
                description="Caja final estimada para el vendedor después de los ajustes económicos del cierre."
                value={netProceeds}
                icon={Coins}
                tone="is-positive"
                currency={currency}
              />
            </div>
          </section>

          <section className="deal-clean-support">
            <div className="deal-clean-support-head">
              <div>
                <div className="deal-clean-kicker">
                  <TrendingUp size={14} />
                  Supporting assumptions
                </div>

                <h4>Métricas que explican el cierre</h4>

                <p>
                  Estos datos ayudan a interpretar si la valoración y la caja
                  final son coherentes con la calidad financiera del activo.
                </p>
              </div>

              <div className="deal-clean-score-pill">
                <span>Quality</span>
                <strong>{qualityScore}/100</strong>
              </div>
            </div>

            <div className="deal-clean-support-grid">
              <SupportItem
                label="EBITDA normalizado"
                value={normalizedEbitda}
                currency={currency}
              />

              <SupportItem
                label="Múltiplo ajustado"
                value={adjustedMultiple}
                currency={currency}
                isMultiple
              />

              <SupportItem
                label="Working capital"
                value={workingCapitalAdjustment}
                currency={currency}
              />

              <SupportItem
                label="Costes / impuestos"
                value={closingCosts}
                currency={currency}
              />
            </div>
          </section>

          <section className="deal-clean-summary">
            <strong>Lectura ejecutiva</strong>

            <p>
              Este bloque resume el cierre de forma defendible: primero se parte
              del valor operativo, después se ajusta por deuda, caja y costes, y
              finalmente se obtiene la caja estimada que recibiría el vendedor.
            </p>
          </section>
        </div>
      </div>
    </section>
  );
}