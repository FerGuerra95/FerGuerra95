import React from 'react';
import { Card } from '../../../shared/components/ui/Card.jsx';
import { Badge } from '../../../shared/components/ui/Badge.jsx';
import { formatCurrency } from '../../../shared/utils/formatCurrency.js';

function Stat({ label, value, color = '' }) {
  return (
    <div className="kpi-card">
      <div className="kpi-label">{label}</div>
      <div className={`kpi-value ${color}`.trim()} style={{ fontSize: 24 }}>{value}</div>
    </div>
  );
}

export function FundingHeroCard({ derived, settings }) {
  return (
    <Card light className="hero">
      <div className="section-title">
        <div>
          <div className="kpi-label">Funding target</div>
          <div className="kpi-value" style={{ color: 'var(--light-text)', fontSize: 54 }}>{formatCurrency(derived.targetRaise, settings.reportCurrency)}</div>
        </div>
        <Badge>{derived.readinessLevel.label} readiness</Badge>
      </div>
      <div className="grid-4" style={{ marginTop: 28 }}>
        <Stat label="Pre-money" value={formatCurrency(derived.preMoneyValuation, settings.reportCurrency)} />
        <Stat label="Post-money" value={formatCurrency(derived.postMoneyValuation, settings.reportCurrency)} />
        <Stat label="Dilution" value={`${derived.dilutionPct.toFixed(1)}%`} color="text-danger" />
        <Stat label="Runway post-raise" value={`${derived.runwayAfterRaiseMonths.toFixed(1)}m`} color={derived.readinessLevel.color} />
      </div>
    </Card>
  );
}
