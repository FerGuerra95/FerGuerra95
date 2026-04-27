import React from 'react';
import { Card } from '../../../shared/components/ui/Card.jsx';
import { formatCurrency } from '../../../shared/utils/formatCurrency.js';

function WaterfallRow({
  label,
  value,
  currency,
  highlight = false
}) {
  const safeValue = Number.isFinite(value) ? value : 0;

  let className = '';
  if (highlight) className = 'text-success';
  else if (safeValue < 0) className = 'text-danger';

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: 16,
        padding: '12px 0',
        borderBottom: '1px solid var(--border)',
        fontWeight: highlight ? 800 : 600
      }}
    >
      <span>{label}</span>
      <span className={className}>
        {formatCurrency(safeValue, currency)}
      </span>
    </div>
  );
}

export function WaterfallPanel({ derived, financials, settings }) {
  const currency = settings?.reportCurrency || 'EUR';

  return (
    <Card>
      <h3>Waterfall de salida</h3>

      <WaterfallRow
        label="Enterprise Value"
        value={derived?.evBase}
        currency={currency}
      />

      <WaterfallRow
        label="Deuda neta"
        value={-derived?.netDebt}
        currency={currency}
      />

      <WaterfallRow
        label="Ajuste capital circulante"
        value={derived?.wcAdjustment}
        currency={currency}
      />

      <WaterfallRow
        label="Equity Value"
        value={derived?.equityBase}
        currency={currency}
        highlight
      />

      <WaterfallRow
        label={`Fees (${financials?.transactionFees ?? 0}%)`}
        value={-derived?.feesVal}
        currency={currency}
      />

      <WaterfallRow
        label={`Impuestos (${financials?.taxRate ?? 0}%)`}
        value={-derived?.taxesVal}
        currency={currency}
      />

      <WaterfallRow
        label="Net Proceeds"
        value={derived?.netProceeds}
        currency={currency}
        highlight
      />
    </Card>
  );
}