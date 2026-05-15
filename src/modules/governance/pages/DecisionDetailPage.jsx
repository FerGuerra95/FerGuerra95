import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ApprovalFlowPanel, DecisionStatusBadge, GovernanceAuditTimeline, governanceCss } from '../components/GovernanceComponents.jsx';
import { governanceApi } from '../services/governanceApi.js';
import { Badge } from '../../../shared/components/ui/Badge.jsx';

export function DecisionDetailPage() {
  const { id } = useParams();
  const [decision, setDecision] = useState(null);

  useEffect(() => {
    governanceApi.getDecision(id).then(setDecision).catch(() => setDecision(null));
  }, [id]);

  return (
    <div className="page">
      <style>{governanceCss}</style>
      <div className="governance-enterprise-page">
        <section className="governance-enterprise-hero ceos-ws-hero">
          <Badge>Decision Memo</Badge>
          <h1 className="governance-enterprise-title">{decision?.title || 'Governance decision'}</h1>
          <p className="governance-enterprise-copy">Owner {decision?.owner || 'not assigned'} · Approver {decision?.approver || 'not assigned'}</p>
          <DecisionStatusBadge status={decision?.status} />
        </section>
        <ApprovalFlowPanel decision={decision} />
        <GovernanceAuditTimeline items={decision?.approvalHistory || []} />
      </div>
    </div>
  );
}
