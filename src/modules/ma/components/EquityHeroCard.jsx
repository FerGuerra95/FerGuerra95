import React from 'react';
import { Card } from '../../../shared/components/ui/Card.jsx';
import { Badge } from '../../../shared/components/ui/Badge.jsx';
import { formatCurrency } from '../../../shared/utils/formatCurrency.js';

function Stat({ label, value, color = '' }) {
  return (
    <div className="kpi-card">
      <div className="kpi-label">{label}</div>
      <div
        className={`kpi-value ${color}`.trim()}
        style={{ fontSize: 24 }}
      >
        {value}
      </div>
    </div>
  );
}

export function EquityHeroCard({ derived, settings }) {
  const riskBadgeColor =
    derived?.riskLevel?.label === 'Bajo'
      ? 'success'
      : derived?.riskLevel?.label === 'Medio'
        ? 'warning'
        : 'danger';

  return (
    <Card light className="hero">
      <div className="section-title">
        <div>
          <div className="kpi-label">Valor de acciones (equity base)</div>
          <div
            className="kpi-value"
            style={{ color: 'var(--light-text)', fontSize: 58 }}
          >
            {formatCurrency(derived.equityBase, settings.reportCurrency)}
          </div>
        </div>

        <Badge variant={riskBadgeColor}>
          {derived.riskLevel.label} riesgo
        </Badge>
      </div>

      <div className="grid-4" style={{ marginTop: 28 }}>
        <Stat
          label="Enterprise Value"
          value={formatCurrency(derived.evBase, settings.reportCurrency)}
        />
        <Stat
          label="Deuda neta"
          value={formatCurrency(derived.netDebt, settings.reportCurrency)}
          color="text-danger"
        />
        <Stat
          label="Múltiplo"
          value={`x${derived.adjustedMultiple.toFixed(2)}`}
        />
        <Stat
          label="Score"
          value={`${Math.round(derived.qualityScore)}/100`}
          color={derived.riskLevel.color}
        />
      </div>
    </Card>
  );
}