import React, { useEffect, useState } from 'react';
import { AlertTriangle, CalendarDays, FileText, Scale } from 'lucide-react';
import { governanceApi } from '../services/governanceApi.js';
import {
  BoardReadinessPanel,
  GovernanceAuditTimeline,
  GovernanceExecutiveWidget,
  GovernanceRiskPanel,
  MetricCard,
  governanceCss
} from '../components/GovernanceComponents.jsx';
import { Badge } from '../../../shared/components/ui/Badge.jsx';

export function GovernanceDashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [status, setStatus] = useState({ loading: true, error: null });

  useEffect(() => {
    let cancelled = false;
    governanceApi.getDashboard()
      .then((data) => {
        if (!cancelled) {
          setDashboard(data);
          setStatus({ loading: false, error: null });
        }
      })
      .catch((error) => !cancelled && setStatus({ loading: false, error }));
    return () => { cancelled = true; };
  }, []);

  const metrics = dashboard?.metrics || {};

  return (
    <div className="page">
      <style>{governanceCss}</style>
      <div className="governance-enterprise-page">
        <section className="governance-enterprise-hero">
          <Badge>Governance Enterprise</Badge>
          <h1 className="governance-enterprise-title">Governance Command Center.</h1>
          <p className="governance-enterprise-copy">
            Board operations, decisions, policies, committees, action tracking and reporting. DSS only; human review remains mandatory.
          </p>
        </section>
        {status.loading ? <div className="governance-enterprise-empty">Loading Governance dashboard.</div> : null}
        {status.error ? <div className="governance-enterprise-empty">Governance dashboard could not be loaded.</div> : null}
        <GovernanceExecutiveWidget summary={dashboard} />
        <section className="governance-enterprise-grid">
          <MetricCard icon={Scale} label="Status" value={metrics.governanceStatus || 'insufficient_data'} />
          <MetricCard icon={AlertTriangle} label="Overdue actions" value={metrics.overdueBoardActions || 0} />
          <MetricCard icon={CalendarDays} label="Upcoming committees" value={metrics.upcomingCommittees || 0} />
          <MetricCard icon={FileText} label="Board packs in review" value={metrics.boardPacksReview || 0} />
        </section>
        <section className="governance-enterprise-grid-two">
          <GovernanceRiskPanel metrics={metrics} />
          <BoardReadinessPanel metrics={metrics} />
        </section>
        <GovernanceAuditTimeline items={dashboard?.auditEvents || []} />
      </div>
    </div>
  );
}
