import React from 'react';
import { AlertTriangle, Gauge, WalletCards } from 'lucide-react';

import { Badge } from '../../../shared/components/ui/Badge.jsx';
import { Card } from '../../../shared/components/ui/Card.jsx';
import { formatCurrency } from '../../../shared/utils/formatCurrency.js';
import {
  getOptimalFundingWindowLabel,
  getRunwayStatusLabel,
  getDisplayText,
  toSafeNumber
} from '../utils/fundingExecutiveMetrics.js';

function formatMonths(value) {
  const number = toSafeNumber(value);
  if (number === null) return 'Insufficient data';
  return `${Math.round(number)} months`;
}

export function FundingExecutiveWidget({
  summary = {},
  currency = 'EUR',
  title = 'Liquidity and runway',
  className = '',
  sourceBadge = 'Funding rounds summary',
  sourceHint = 'From enterprise funding rounds and stored round records.'
}) {
  const runwayStatus = getRunwayStatusLabel(summary.projectedRunwayMonths);
  const monthlyBurnRate = toSafeNumber(summary.monthlyBurnRate);
  const totalRaised = toSafeNumber(summary.totalAmountRaised ?? summary.totalRaised);
  const windowStatus = getOptimalFundingWindowLabel(summary.optimalFundingWindowStatus);
  const complianceStatus = getDisplayText(summary.complianceStatus, 'Not available');
  const updateStatus = summary.requiresExecutiveUpdate ? 'Requires update' : 'Synced';
  const reviewStatus = summary.humanReviewRequired ? 'Required' : 'Recommended';

  return (
    <Card className={className}>
      <div className="funding-badge-row" style={{ marginBottom: 10 }}>
        <Badge>{sourceBadge}</Badge>
      </div>

      <p className="muted" style={{ marginTop: 0, marginBottom: 12, fontSize: 12, lineHeight: 1.5 }}>
        {sourceHint}
      </p>

      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <div className="kpi-label">{title}</div>
          <strong style={{ display: 'block', marginTop: 8, fontSize: 20 }}>
            {formatMonths(summary.projectedRunwayMonths)}
          </strong>
        </div>
        <div className="ceo-panel-icon">
          <Gauge size={18} />
        </div>
      </div>

      <div style={{ marginTop: 14 }}>
        <div className="ceo-mini-row">
          <span className="muted">Runway status</span>
          <strong>{runwayStatus}</strong>
        </div>
        <div className="ceo-mini-row">
          <span className="muted">Monthly burn rate</span>
          <strong>
            {monthlyBurnRate === null
              ? 'Insufficient data'
              : formatCurrency(monthlyBurnRate, currency)}
          </strong>
        </div>
        <div className="ceo-mini-row">
          <span className="muted">Capital raised</span>
          <strong>
            {totalRaised === null ? 'Pending data' : formatCurrency(totalRaised, currency)}
          </strong>
        </div>
        <div className="ceo-mini-row">
          <span className="muted">Compliance status</span>
          <strong>{complianceStatus}</strong>
        </div>
        <div className="ceo-mini-row">
          <span className="muted">Funding window</span>
          <strong>{windowStatus}</strong>
        </div>
        <div className="ceo-mini-row">
          <span className="muted">Executive sync</span>
          <strong>{updateStatus}</strong>
        </div>
      </div>

      <div
        style={{
          marginTop: 14,
          padding: 12,
          borderRadius: 12,
          border: '1px solid rgba(148,163,184,0.2)',
          background: 'rgba(148,163,184,0.08)',
          display: 'flex',
          gap: 8,
          alignItems: 'flex-start'
        }}
      >
        <AlertTriangle size={14} />
        <span className="muted" style={{ fontSize: 12, lineHeight: 1.5 }}>
          Funding signals are decision-support indicators. Human review: {reviewStatus}.
        </span>
      </div>
    </Card>
  );
}

export default FundingExecutiveWidget;
