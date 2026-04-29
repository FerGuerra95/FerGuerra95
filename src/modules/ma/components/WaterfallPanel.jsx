import React from 'react';
import {
  ArrowDownUp,
  Calculator,
  CheckCircle2,
  Landmark,
  MinusCircle,
  PlusCircle,
  Receipt,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';
import { Card } from '../../../shared/components/ui/Card.jsx';
import { formatCurrency } from '../../../shared/utils/formatCurrency.js';

const waterfallPanelCss = `
  .ma-waterfall-card {
    position: relative;
    overflow: hidden;
    border-radius: 31px;
    border: 1px solid rgba(148, 163, 184, 0.16);
    background:
      radial-gradient(circle at 0% 0%, rgba(59, 130, 246, 0.14), transparent 32%),
      radial-gradient(circle at 100% 0%, rgba(16, 185, 129, 0.10), transparent 30%),
      linear-gradient(135deg, rgba(255,255,255,0.064), rgba(255,255,255,0.022)),
      rgba(15, 23, 42, 0.68);
    box-shadow:
      0 24px 70px rgba(0, 0, 0, 0.21),
      inset 0 1px 0 rgba(255,255,255,0.035);
  }

  .ma-waterfall-card::before {
    content: "";
    position: absolute;
    inset: 0;
    background:
      linear-gradient(rgba(255,255,255,0.024) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.024) 1px, transparent 1px);
    background-size: 44px 44px;
    mask-image: linear-gradient(to bottom, rgba(0,0,0,0.62), transparent 85%);
    pointer-events: none;
  }

  .ma-waterfall-inner {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .ma-waterfall-header {
    display: flex;
    justify-content: space-between;
    gap: 22px;
    align-items: flex-start;
    padding-bottom: 20px;
    border-bottom: 1px solid rgba(148, 163, 184, 0.14);
  }

  .ma-waterfall-kicker {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
    font-size: 11px;
    line-height: 1;
    text-transform: uppercase;
    letter-spacing: 0.17em;
    color: rgba(148, 163, 184, 0.96);
  }

  .ma-waterfall-header h3 {
    margin: 0;
    letter-spacing: -0.045em;
  }

  .ma-waterfall-header p {
    max-width: 680px;
    margin: 11px 0 0;
    line-height: 1.66;
  }

  .ma-waterfall-icon-box {
    flex: 0 0 auto;
    width: 48px;
    height: 48px;
    border-radius: 18px;
    display: grid;
    place-items: center;
    background: rgba(37, 99, 235, 0.16);
    border: 1px solid rgba(96, 165, 250, 0.24);
  }

  .ma-waterfall-summary {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;
  }

  .ma-waterfall-summary-card {
    min-width: 0;
    padding: 18px;
    border-radius: 22px;
    background: rgba(255,255,255,0.045);
    border: 1px solid rgba(255,255,255,0.078);
  }

  .ma-waterfall-summary-card strong {
    display: block;
    margin-top: 8px;
    font-size: 21px;
    line-height: 1.12;
    letter-spacing: -0.045em;
    overflow-wrap: anywhere;
  }

  .ma-waterfall-rows {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .ma-waterfall-row {
    position: relative;
    overflow: hidden;
    border-radius: 22px;
    padding: 18px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.075);
  }

  .ma-waterfall-row.is-highlight {
    border-color: rgba(16, 185, 129, 0.24);
    background:
      linear-gradient(135deg, rgba(16, 185, 129, 0.115), rgba(59, 130, 246, 0.045)),
      rgba(255,255,255,0.04);
  }

  .ma-waterfall-row-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 18px;
  }

  .ma-waterfall-row-left {
    display: flex;
    align-items: center;
    gap: 14px;
    min-width: 0;
  }

  .ma-waterfall-row-icon {
    flex: 0 0 auto;
    width: 38px;
    height: 38px;
    border-radius: 15px;
    display: grid;
    place-items: center;
    background: rgba(255,255,255,0.052);
    border: 1px solid rgba(255,255,255,0.08);
    color: rgba(226, 232, 240, 0.9);
  }

  .ma-waterfall-row.is-positive .ma-waterfall-row-icon,
  .ma-waterfall-row.is-highlight .ma-waterfall-row-icon {
    background: rgba(16, 185, 129, 0.12);
    border-color: rgba(16, 185, 129, 0.22);
    color: #86efac;
  }

  .ma-waterfall-row.is-negative .ma-waterfall-row-icon {
    background: rgba(239, 68, 68, 0.12);
    border-color: rgba(239, 68, 68, 0.22);
    color: #fb7185;
  }

  .ma-waterfall-row-title {
    min-width: 0;
  }

  .ma-waterfall-row-title strong {
    display: block;
    line-height: 1.2;
  }

  .ma-waterfall-row-title span {
    display: block;
    margin-top: 5px;
    color: rgba(148, 163, 184, 0.84);
    font-size: 13px;
    line-height: 1.45;
  }

  .ma-waterfall-row-value {
    flex: 0 0 auto;
    text-align: right;
    font-size: 16px;
    font-weight: 850;
    letter-spacing: -0.025em;
    white-space: nowrap;
  }

  .ma-waterfall-row.is-positive .ma-waterfall-row-value,
  .ma-waterfall-row.is-highlight .ma-waterfall-row-value {
    color: #34d399;
  }

  .ma-waterfall-row.is-negative .ma-waterfall-row-value {
    color: #fb7185;
  }

  .ma-waterfall-bar {
    height: 9px;
    margin-top: 16px;
    border-radius: 999px;
    overflow: hidden;
    background: rgba(255,255,255,0.075);
  }

  .ma-waterfall-bar-fill {
    width: var(--waterfall-width);
    height: 100%;
    border-radius: 999px;
    background: linear-gradient(90deg, rgba(59, 130, 246, 0.9), rgba(96, 165, 250, 0.95));
    transition: width .25s ease;
  }

  .ma-waterfall-row.is-positive .ma-waterfall-bar-fill,
  .ma-waterfall-row.is-highlight .ma-waterfall-bar-fill {
    background: linear-gradient(90deg, #10b981, #34d399);
  }

  .ma-waterfall-row.is-negative .ma-waterfall-bar-fill {
    background: linear-gradient(90deg, #ef4444, #fb7185);
  }

  .ma-waterfall-note {
    padding: 18px;
    border-radius: 22px;
    background:
      linear-gradient(135deg, rgba(16, 185, 129, 0.09), rgba(59, 130, 246, 0.055));
    border: 1px solid rgba(148, 163, 184, 0.14);
  }

  .ma-waterfall-note strong {
    display: block;
    margin-bottom: 8px;
  }

  .ma-waterfall-note p {
    margin: 0;
    color: var(--muted);
    line-height: 1.65;
  }

  @media (max-width: 860px) {
    .ma-waterfall-header {
      flex-direction: column;
    }

    .ma-waterfall-summary {
      grid-template-columns: 1fr;
    }

    .ma-waterfall-row-top {
      flex-direction: column;
      align-items: flex-start;
    }

    .ma-waterfall-row-value {
      text-align: left;
      white-space: normal;
    }
  }
`;

function getSafeNumber(value) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) return 0;

  return parsed;
}

function getRowTone(value, highlight) {
  if (highlight) return 'is-highlight';
  if (value < 0) return 'is-negative';
  if (value > 0) return 'is-positive';

  return 'is-neutral';
}

function getRowIcon(value, highlight) {
  if (highlight) return CheckCircle2;
  if (value < 0) return MinusCircle;
  if (value > 0) return PlusCircle;

  return Calculator;
}

function getBarWidth(value, maxAbs) {
  const absValue = Math.abs(value);

  if (!maxAbs || absValue === 0) return '0%';

  return `${Math.max(7, Math.min(100, (absValue / maxAbs) * 100))}%`;
}

function WaterfallRow({
  label,
  description,
  value,
  currency,
  highlight = false,
  maxAbs
}) {
  const safeValue = getSafeNumber(value);
  const tone = getRowTone(safeValue, highlight);
  const Icon = getRowIcon(safeValue, highlight);
  const width = getBarWidth(safeValue, maxAbs);

  return (
    <div
      className={`ma-waterfall-row ${tone}`.trim()}
      style={{ '--waterfall-width': width }}
    >
      <div className="ma-waterfall-row-top">
        <div className="ma-waterfall-row-left">
          <div className="ma-waterfall-row-icon">
            <Icon size={17} />
          </div>

          <div className="ma-waterfall-row-title">
            <strong>{label}</strong>
            {description ? <span>{description}</span> : null}
          </div>
        </div>

        <div className="ma-waterfall-row-value">
          {formatCurrency(safeValue, currency)}
        </div>
      </div>

      <div className="ma-waterfall-bar">
        <div className="ma-waterfall-bar-fill" />
      </div>
    </div>
  );
}

function SummaryCard({ label, value, currency, success = false }) {
  return (
    <div className="ma-waterfall-summary-card">
      <div className="kpi-label">{label}</div>

      <strong className={success ? 'text-success' : ''}>
        {formatCurrency(value, currency)}
      </strong>
    </div>
  );
}

export function WaterfallPanel({ derived, financials, settings }) {
  const currency = settings?.reportCurrency || 'EUR';

  const evBase = getSafeNumber(derived?.evBase);
  const netDebtImpact = -getSafeNumber(derived?.netDebt);
  const wcAdjustment = getSafeNumber(derived?.wcAdjustment);
  const equityBase = getSafeNumber(derived?.equityBase);
  const feesVal = -getSafeNumber(derived?.feesVal);
  const taxesVal = -getSafeNumber(derived?.taxesVal);
  const netProceeds = getSafeNumber(derived?.netProceeds);

  const rows = [
    {
      label: 'Enterprise Value',
      description: 'Valor económico inicial antes de deuda, caja y ajustes.',
      value: evBase
    },
    {
      label: 'Deuda neta',
      description: 'Impacto de deuda financiera neta sobre el valor del equity.',
      value: netDebtImpact
    },
    {
      label: 'Ajuste capital circulante',
      description: 'Diferencia entre working capital objetivo y real.',
      value: wcAdjustment
    },
    {
      label: 'Equity Value',
      description: 'Valor atribuible al equity después del puente económico.',
      value: equityBase,
      highlight: true
    },
    {
      label: `Fees (${financials?.transactionFees ?? 0}%)`,
      description: 'Costes estimados de transacción aplicados al cierre.',
      value: feesVal
    },
    {
      label: `Impuestos (${financials?.taxRate ?? 0}%)`,
      description: 'Impacto fiscal estimado sobre el resultado económico.',
      value: taxesVal
    },
    {
      label: 'Net Proceeds',
      description: 'Caja final estimada recibida tras ajustes y costes.',
      value: netProceeds,
      highlight: true
    }
  ];

  const maxAbs = Math.max(...rows.map((row) => Math.abs(getSafeNumber(row.value))), 1);
  const totalAdjustments = netDebtImpact + wcAdjustment + feesVal + taxesVal;

  return (
    <Card className="ma-waterfall-card">
      <style>{waterfallPanelCss}</style>

      <div className="ma-waterfall-inner">
        <div className="ma-waterfall-header">
          <div>
            <div className="ma-waterfall-kicker">
              <ArrowDownUp size={14} />
              Exit waterfall
            </div>

            <h3>Waterfall de salida</h3>

            <p className="muted">
              Puente económico desde Enterprise Value hasta Net Proceeds,
              mostrando cómo deuda, capital circulante, fees e impuestos afectan
              a la caja final de la operación.
            </p>
          </div>

          <div className="ma-waterfall-icon-box">
            <Landmark size={20} />
          </div>
        </div>

        <div className="ma-waterfall-summary">
          <SummaryCard
            label="Enterprise Value"
            value={evBase}
            currency={currency}
          />

          <SummaryCard
            label="Ajustes totales"
            value={totalAdjustments}
            currency={currency}
          />

          <SummaryCard
            label="Net Proceeds"
            value={netProceeds}
            currency={currency}
            success
          />
        </div>

        <div className="ma-waterfall-rows">
          {rows.map((row) => (
            <WaterfallRow
              key={row.label}
              label={row.label}
              description={row.description}
              value={row.value}
              currency={currency}
              highlight={row.highlight}
              maxAbs={maxAbs}
            />
          ))}
        </div>

        <div className="ma-waterfall-note">
          <strong>Lectura ejecutiva</strong>

          <p>
            Este waterfall permite explicar de forma defendible cómo una
            valoración inicial se convierte en equity value y finalmente en caja
            neta estimada para la operación.
          </p>
        </div>
      </div>
    </Card>
  );
}