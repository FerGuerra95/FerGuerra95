import React from 'react';
import { AlertTriangle, CheckCircle2, Clock, FileText, Scale } from 'lucide-react';
import { Card } from '../../../shared/components/ui/Card.jsx';
import { Badge } from '../../../shared/components/ui/Badge.jsx';

export const governanceCss = `
  .governance-enterprise-page { width: min(1540px, 100%); margin: 0 auto; display: grid; gap: 24px; }
  .governance-enterprise-hero { border: 1px solid rgba(148,163,184,0.18); border-radius: 28px; padding: 28px; background: linear-gradient(135deg, rgba(14,165,233,0.14), rgba(15,23,42,0.88)); }
  .governance-enterprise-title { margin: 8px 0 10px; font-size: clamp(32px, 4vw, 54px); line-height: 1; letter-spacing: 0; }
  .governance-enterprise-copy { max-width: 900px; color: rgba(203,213,225,0.86); line-height: 1.65; margin: 0; }
  .governance-enterprise-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px; }
  .governance-enterprise-grid-two { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
  .governance-enterprise-panel { border: 1px solid rgba(148,163,184,0.16); border-radius: 18px; padding: 18px; background: rgba(15,23,42,0.68); }
  .governance-enterprise-row { display: grid; grid-template-columns: minmax(180px, 1fr) repeat(3, minmax(90px, 0.45fr)); gap: 12px; align-items: center; padding: 12px 0; border-top: 1px solid rgba(148,163,184,0.12); }
  .governance-enterprise-table-head { color: rgba(148,163,184,0.92); font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; font-weight: 850; }
  .governance-enterprise-kpi strong { display: block; font-size: 30px; line-height: 1; letter-spacing: 0; }
  .governance-enterprise-toolbar { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; }
  .governance-enterprise-field { display: grid; gap: 6px; min-width: 180px; color: rgba(203,213,225,0.78); font-size: 0.78rem; font-weight: 800; text-transform: uppercase; }
  .governance-enterprise-input, .governance-enterprise-select { min-height: 40px; border-radius: 12px; border: 1px solid rgba(148,163,184,0.18); background: rgba(15,23,42,0.78); color: rgba(226,232,240,0.94); padding: 8px 10px; }
  .governance-enterprise-input:disabled, .governance-enterprise-select:disabled { opacity: 0.62; cursor: not-allowed; }
  .governance-enterprise-button { min-height: 40px; border-radius: 12px; border: 1px solid rgba(125,211,252,0.28); background: rgba(14,165,233,0.16); color: rgba(226,232,240,0.96); font-weight: 850; padding: 8px 12px; cursor: pointer; }
  .governance-enterprise-button:disabled { opacity: 0.55; cursor: not-allowed; }
  .governance-enterprise-empty { padding: 24px; border: 1px dashed rgba(148,163,184,0.22); border-radius: 18px; color: rgba(203,213,225,0.78); }
  @media (max-width: 1080px) { .governance-enterprise-grid, .governance-enterprise-grid-two { grid-template-columns: 1fr; } .governance-enterprise-row { grid-template-columns: 1fr; } }
`;

export function DecisionStatusBadge({ status }) {
  return <Badge>{String(status || 'draft').replace(/_/g, ' ')}</Badge>;
}

function formatGovernanceScore(value) {
  return Number.isFinite(Number(value)) ? `${Math.round(Number(value))}/100` : 'N/A';
}

export function GovernanceReadinessScore({ value = null, label = 'Governance readiness (DSS)' }) {
  return (
    <Card className="governance-enterprise-panel governance-enterprise-kpi">
      <div className="kpi-label">{label}</div>
      <strong>{formatGovernanceScore(value)}</strong>
      <p className="muted">Operational DSS heuristic. Not a certified governance rating. Human review required.</p>
    </Card>
  );
}

export function GovernanceExecutiveWidget({ summary }) {
  const metrics = summary?.metrics || {};
  return (
    <section className="governance-enterprise-grid">
      <GovernanceReadinessScore value={metrics.governanceReadinessScore} />
      <MetricCard icon={Clock} label="Pending critical" value={metrics.pendingCriticalDecisions || 0} />
      <MetricCard icon={AlertTriangle} label="Approval bottlenecks" value={metrics.approvalBottlenecks || 0} />
      <MetricCard icon={CheckCircle2} label="Board review draft signal" value={formatGovernanceScore(metrics.boardReadinessScore)} description="Operational DSS — not certified board approval." />
    </section>
  );
}

export function MetricCard({ icon: Icon = Scale, label, value, description = '' }) {
  return (
    <Card className="governance-enterprise-panel governance-enterprise-kpi">
      <div className="governance-enterprise-toolbar">
        <Icon size={18} />
        <span className="kpi-label">{label}</span>
      </div>
      <strong>{value}</strong>
      {description ? <p className="muted">{description}</p> : null}
    </Card>
  );
}

export function DecisionRegisterTable({ items = [], onSelect, onSubmit, onApprove, onEscalate, readOnly = false, canApprove = false }) {
  if (items.length === 0) {
    return (
      <div className="governance-enterprise-empty ceos-enterprise-table-empty">
        Insufficient validated data · Human review required
      </div>
    );
  }
  return (
    <Card className="governance-enterprise-panel">
      <div className="ceos-enterprise-table-wrap ceos-enterprise-div-table">
        <div className="governance-enterprise-row governance-enterprise-table-head">
          <span>Decision</span><span>Status</span><span>Owner</span><span>Actions</span>
        </div>
        {items.map((item) => (
          <div className="governance-enterprise-row" key={item.id}>
            <button type="button" className="governance-enterprise-button" onClick={() => onSelect?.(item)}>{item.title}</button>
            <DecisionStatusBadge status={item.status} />
            <span className="muted">{item.owner || 'Board Secretary'}</span>
            <div className="governance-enterprise-toolbar">
              <button className="governance-enterprise-button" type="button" disabled={readOnly} onClick={() => onSubmit?.(item)}>Submit</button>
              <button className="governance-enterprise-button" type="button" disabled={!canApprove} onClick={() => onApprove?.(item)}>Approve</button>
              <button className="governance-enterprise-button" type="button" disabled={readOnly} onClick={() => onEscalate?.(item)}>Escalate</button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function ApprovalFlowPanel({ decision }) {
  return (
    <Card className="governance-enterprise-panel">
      <div className="governance-enterprise-toolbar"><Scale size={18} /><h3>Approval flow</h3></div>
      <p className="muted">Current status: {decision?.status || 'draft'}. Approved decisions are locked for direct editing.</p>
    </Card>
  );
}

export function BoardPackCard({ item }) { return <MetricCard icon={FileText} label={item.title} value={item.status || 'draft'} description={`DSS pack draft · readiness ${formatGovernanceScore(item.readinessScore)}`} />; }
export function CommitteeCalendar({ items = [] }) { return <SimpleList title="Committee calendar" items={items} labelKey="committeeName" valueKey="nextMeetingDate" />; }
export function PolicyReviewPanel({ items = [] }) { return <SimpleList title="Policy review" items={items} labelKey="title" valueKey="reviewDate" />; }
export function ActionItemsTable({ items = [] }) { return <SimpleList title="Action tracker" items={items} labelKey="title" valueKey="status" />; }
export function GovernanceRiskPanel({ metrics = {} }) { return <MetricCard icon={AlertTriangle} label="Governance risks" value={metrics.governanceRisks || 0} description={metrics.requiresExecutiveAttention ? 'Executive attention required.' : 'No immediate escalation.'} />; }
export function BoardReadinessPanel({ metrics = {} }) { return <MetricCard icon={CheckCircle2} label="Board review draft signal" value={formatGovernanceScore(metrics.boardReadinessScore)} description="Operational DSS — not certified board approval." />; }
export function GovernanceAuditTimeline({ items = [] }) { return <SimpleList title="Audit timeline" items={items} labelKey="action" valueKey="createdAt" />; }

function SimpleList({ title, items, labelKey, valueKey }) {
  return (
    <Card className="governance-enterprise-panel">
      <h3>{title}</h3>
      {items.length === 0 ? (
        <div className="governance-enterprise-empty ceos-enterprise-table-empty">
          Insufficient validated data · Human review required
        </div>
      ) : (
        <div className="ceos-enterprise-table-wrap ceos-enterprise-div-table">
          {items.map((item) => (
            <div className="governance-enterprise-row" key={item.id || item[labelKey]}>
              <strong>{item[labelKey] || item.title || item.id}</strong>
              <span className="muted">{item[valueKey] || 'Not set'}</span>
              <span />
              <span />
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
