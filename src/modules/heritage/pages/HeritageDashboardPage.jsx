import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '../../../shared/components/ui/Badge.jsx';
import { formatCurrency } from '../../../shared/utils/formatCurrency.js';
import { heritageApi } from '../services/heritageApi.js';
import {
  HeritageAssetTable,
  HeritageListPanel,
  HeritageMetricCard,
  HeritageStatusBadge,
  heritageEnterpriseCss
} from '../components/HeritageEnterpriseComponents.jsx';

export function HeritageDashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [status, setStatus] = useState({ loading: true, error: null });

  useEffect(() => {
    heritageApi.getDashboard()
      .then((data) => {
        setDashboard(data);
        setStatus({ loading: false, error: null });
      })
      .catch((error) => setStatus({ loading: false, error }));
  }, []);

  const metrics = dashboard?.metrics || {};

  return (
    <div className="page">
      <style>{heritageEnterpriseCss}</style>
      <div className="heritage-enterprise-page">
        <section className="heritage-enterprise-hero ceos-ws-hero">
          <Badge>Heritage Enterprise</Badge>
          <h1 className="heritage-enterprise-title">Owner continuity command center.</h1>
          <p className="heritage-enterprise-copy">
            Patrimony, succession, protection controls, evidence and board readiness for private ownership continuity.
          </p>
          <div className="heritage-enterprise-toolbar">
            <Link className="heritage-enterprise-button" to="/heritage/assets">Asset Register</Link>
            <Link className="heritage-enterprise-button" to="/heritage/successions">Succession Planning</Link>
            <Link className="heritage-enterprise-button" to="/heritage/reports">Continuity Reports</Link>
            {dashboard ? <HeritageStatusBadge status={dashboard.heritageStatus} /> : null}
          </div>
        </section>

        {status.loading ? <div className="heritage-enterprise-empty">Loading Heritage command center.</div> : null}
        {status.error ? <div className="heritage-enterprise-empty">Heritage data could not be loaded.</div> : null}

        <section className="heritage-enterprise-grid">
          <HeritageMetricCard label="Continuity score" value={metrics.continuityScore ?? dashboard?.continuityScore ?? 0} detail={dashboard?.humanReviewPosture || 'Human review required where applicable.'} />
          <HeritageMetricCard label="Mapped value" value={formatCurrency(metrics.totalAssetValue || 0, 'EUR')} detail="Asset value in the controlled register." />
          <HeritageMetricCard label="Board readiness" value={`${metrics.boardReadinessScore || 0}%`} detail="Evidence, protection and succession readiness." />
          <HeritageMetricCard label="Open succession" value={metrics.openSuccessionItemsCount || 0} detail="Protocols requiring owner or board attention." />
        </section>

        <section className="heritage-enterprise-grid-two">
          <HeritageAssetTable items={dashboard?.assets || []} />
          <HeritageListPanel title="Protection controls" items={dashboard?.protections || []} primary="name" secondary="coverage" />
          <HeritageListPanel title="Succession protocols" items={dashboard?.successions || []} primary="title" secondary="readiness" />
          <HeritageListPanel title="Controlled evidence" items={dashboard?.documents || []} primary="title" secondary="evidenceStatus" />
        </section>
      </div>
    </div>
  );
}
