import React from 'react';
import { AlertTriangle, BarChart3, CheckCircle2, FileText, Gauge, Radar, ShieldAlert } from 'lucide-react';
import { Badge } from '../../../shared/components/ui/Badge.jsx';
import { Card } from '../../../shared/components/ui/Card.jsx';

export const riskEnterpriseCss = `
  .risk-enterprise-page { width: min(1440px, 100%); margin: 0 auto; display: flex; flex-direction: column; gap: 24px; }
  .risk-enterprise-hero { padding: 28px; border: 1px solid rgba(148,163,184,.18); border-radius: 18px; background: linear-gradient(135deg, rgba(15,23,42,.98), rgba(30,41,59,.94)); box-shadow: 0 24px 70px rgba(2,6,23,.28); }
  .risk-enterprise-title { margin: 12px 0 8px; font-size: clamp(1.8rem, 3vw, 3rem); line-height: 1; letter-spacing: 0; color: #f8fafc; }
  .risk-enterprise-copy, .risk-muted { color: rgba(226,232,240,.72); margin: 0; }
  .risk-enterprise-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; }
  .risk-enterprise-grid-two { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 16px; }
  .risk-enterprise-panel { background: rgba(15,23,42,.78); border: 1px solid rgba(148,163,184,.16); border-radius: 8px; color: #e2e8f0; }
  .risk-enterprise-panel h3 { margin: 0 0 10px; color: #f8fafc; letter-spacing: 0; }
  .risk-enterprise-kpi { display: flex; align-items: flex-start; gap: 12px; }
  .risk-enterprise-icon { width: 38px; height: 38px; border-radius: 8px; display: grid; place-items: center; background: rgba(56,189,248,.12); color: #67e8f9; flex: 0 0 auto; }
  .risk-enterprise-value { font-size: 1.7rem; color: #f8fafc; font-weight: 800; line-height: 1; }
  .risk-enterprise-toolbar { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 12px; align-items: end; padding: 16px; border: 1px solid rgba(148,163,184,.14); border-radius: 8px; background: rgba(2,6,23,.32); }
  .risk-enterprise-field { display: grid; gap: 6px; color: rgba(226,232,240,.78); font-size: .78rem; font-weight: 700; }
  .risk-enterprise-input { width: 100%; min-height: 38px; border-radius: 8px; border: 1px solid rgba(148,163,184,.22); background: rgba(15,23,42,.86); color: #f8fafc; padding: 0 10px; }
  .risk-enterprise-button { min-height: 38px; border: 0; border-radius: 8px; padding: 0 14px; background: #e2e8f0; color: #020617; font-weight: 800; cursor: pointer; }
  .risk-enterprise-button:disabled { opacity: .48; cursor: not-allowed; }
  .risk-enterprise-table { width: 100%; border-collapse: collapse; font-size: .86rem; }
  .risk-enterprise-table th, .risk-enterprise-table td { padding: 12px; border-bottom: 1px solid rgba(148,163,184,.12); text-align: left; color: rgba(226,232,240,.84); }
  .risk-enterprise-table th { color: rgba(248,250,252,.92); font-size: .72rem; text-transform: uppercase; letter-spacing: 0; }
  .risk-enterprise-empty { border: 1px dashed rgba(148,163,184,.24); border-radius: 8px; padding: 18px; color: rgba(226,232,240,.68); background: rgba(15,23,42,.42); }
  .risk-heatmap { display: grid; grid-template-columns: repeat(5, minmax(42px, 1fr)); gap: 8px; }
  .risk-heatmap-cell { min-height: 64px; border-radius: 8px; border: 1px solid rgba(148,163,184,.14); background: rgba(15,23,42,.72); padding: 8px; color: #e2e8f0; font-size: .72rem; }
  .risk-heatmap-cell[data-hot="true"] { background: rgba(239,68,68,.18); border-color: rgba(248,113,113,.34); }
  @media (max-width: 760px) { .risk-enterprise-hero { padding: 20px; } .risk-enterprise-table { min-width: 720px; } .risk-table-scroll { overflow-x: auto; } }
`;

export function RiskStatusBadge({ status }) {
  const safe = String(status || 'open').replaceAll('_', ' ');
  return <Badge>{safe}</Badge>;
}

export function RiskKpiCard({ icon: Icon = Gauge, label, value, description }) {
  return (
    <Card className="risk-enterprise-panel">
      <div className="risk-enterprise-kpi">
        <div className="risk-enterprise-icon"><Icon size={18} /></div>
        <div>
          <p className="risk-muted">{label}</p>
          <div className="risk-enterprise-value">{value ?? 0}</div>
          <p className="risk-muted">{description}</p>
        </div>
      </div>
    </Card>
  );
}

export function RiskExecutiveWidget({ summary = {} }) {
  const safeSummary = summary && typeof summary === 'object' ? summary : {};
  const metrics = safeSummary?.metrics || safeSummary || {};
  return (
    <section className="risk-enterprise-grid">
      <RiskKpiCard icon={Gauge} label="Risk readiness" value={`${metrics.riskReadinessScore || safeSummary.riskReadinessScore || 0}%`} description={metrics.riskPosture || 'controlled'} />
      <RiskKpiCard icon={ShieldAlert} label="Critical risks" value={metrics.criticalRiskCount || safeSummary.criticalRiskCount || 0} description="Executive review threshold." />
      <RiskKpiCard icon={AlertTriangle} label="Overdue mitigations" value={metrics.overdueMitigations || safeSummary.overdueMitigations || 0} description="Actions past deadline." />
      <RiskKpiCard icon={Radar} label="Appetite breaches" value={metrics.appetiteBreaches || safeSummary.appetiteBreaches || 0} description="Committee attention." />
    </section>
  );
}

export function RiskRegisterTable({ items = [] }) {
  return (
    <EnterpriseRiskTable
      title="Enterprise risk register"
      items={items}
      columns={[
        { key: 'title', label: 'Risk' },
        { key: 'category', label: 'Category' },
        { key: 'residualRisk', label: 'Residual', render: (item) => <RiskStatusBadge status={item.residualRisk} /> },
        { key: 'owner', label: 'Owner' },
        { key: 'status', label: 'Status', render: (item) => <RiskStatusBadge status={item.status} /> },
        { key: 'reviewDate', label: 'Review' }
      ]}
    />
  );
}

export function EnterpriseRiskTable({ title, items = [], columns = [] }) {
  return (
    <Card className="risk-enterprise-panel">
      <h3>{title}</h3>
      {items.length === 0 ? <div className="risk-enterprise-empty">No records available.</div> : null}
      {items.length > 0 ? (
        <div className="risk-table-scroll">
          <table className="risk-enterprise-table">
            <thead><tr>{columns.map((column) => <th key={column.key}>{column.label}</th>)}</tr></thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  {columns.map((column) => <td key={column.key}>{column.render ? column.render(item) : item[column.key] || 'N/A'}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </Card>
  );
}

export function RiskHeatmap({ items = [] }) {
  const cells = Array.from({ length: 25 }, (_, index) => ({ likelihood: (index % 5) + 1, impact: Math.floor(index / 5) + 1 }));
  return (
    <Card className="risk-enterprise-panel">
      <h3>Risk heatmap</h3>
      <div className="risk-heatmap">
        {cells.map((cell) => {
          const matches = items.filter((item) => Number(item.likelihood) === cell.likelihood && Number(item.impact) === cell.impact);
          return (
            <div className="risk-heatmap-cell" data-hot={matches.length > 0 ? 'true' : 'false'} key={`${cell.likelihood}-${cell.impact}`}>
              <strong>{cell.impact}x{cell.likelihood}</strong>
              <div>{matches.length} risk(s)</div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

export function ControlsLibraryPanel({ items = [] }) {
  return <EnterpriseRiskTable title="Controls library" items={items} columns={[
    { key: 'title', label: 'Control' },
    { key: 'controlType', label: 'Type' },
    { key: 'owner', label: 'Owner' },
    { key: 'frequency', label: 'Frequency' },
    { key: 'effectiveness', label: 'Effectiveness', render: (item) => `${item.effectiveness || 0}%` }
  ]} />;
}

export function MitigationPlansPanel({ items = [] }) {
  return <EnterpriseRiskTable title="Mitigation plans" items={items} columns={[
    { key: 'action', label: 'Action' },
    { key: 'owner', label: 'Owner' },
    { key: 'dueDate', label: 'Due date' },
    { key: 'progress', label: 'Progress', render: (item) => `${item.progress || 0}%` },
    { key: 'status', label: 'Status', render: (item) => <RiskStatusBadge status={item.status} /> }
  ]} />;
}

export function IncidentLogPanel({ items = [] }) {
  return <EnterpriseRiskTable title="Incident and issue log" items={items} columns={[
    { key: 'incidentDate', label: 'Date' },
    { key: 'severity', label: 'Severity', render: (item) => <RiskStatusBadge status={item.severity} /> },
    { key: 'description', label: 'Description' },
    { key: 'impactedArea', label: 'Area' },
    { key: 'status', label: 'Status', render: (item) => <RiskStatusBadge status={item.status} /> }
  ]} />;
}

export function KriTrackerPanel({ items = [] }) {
  return <EnterpriseRiskTable title="KRI tracker" items={items} columns={[
    { key: 'metric', label: 'Metric' },
    { key: 'threshold', label: 'Threshold' },
    { key: 'actualValue', label: 'Actual' },
    { key: 'breachFlag', label: 'Breach', render: (item) => item.breachFlag ? 'Yes' : 'No' },
    { key: 'trend', label: 'Trend' }
  ]} />;
}

export function RiskAppetitePanel({ items = [] }) {
  return <EnterpriseRiskTable title="Risk appetite" items={items} columns={[
    { key: 'appetiteStatement', label: 'Statement' },
    { key: 'metric', label: 'Metric' },
    { key: 'threshold', label: 'Threshold' },
    { key: 'owner', label: 'Owner' },
    { key: 'breachFlag', label: 'Breach', render: (item) => item.breachFlag ? 'Yes' : 'No' }
  ]} />;
}

export function RiskReportsPanel({ items = [] }) {
  return <EnterpriseRiskTable title="Risk reports" items={items} columns={[
    { key: 'title', label: 'Report' },
    { key: 'reportType', label: 'Type' },
    { key: 'status', label: 'Status', render: (item) => <RiskStatusBadge status={item.status} /> },
    { key: 'createdAt', label: 'Generated' }
  ]} />;
}

export function BoardRiskReadinessPanel({ metrics = {} }) {
  return (
    <Card className="risk-enterprise-panel">
      <h3>Board risk readiness</h3>
      <p className="risk-muted">Enterprise Risk is a decision-support system. CRO, audit committee and legal review remain required.</p>
      <div className="risk-enterprise-grid">
        <RiskKpiCard icon={CheckCircle2} label="Control coverage" value={`${metrics.controlCoverage || 0}%`} description="Mapped controls." />
        <RiskKpiCard icon={BarChart3} label="Residual risk" value={`${metrics.residualRisk || 0}/100`} description="Portfolio average." />
        <RiskKpiCard icon={FileText} label="Human review" value="Required" description="No automated decisioning." />
      </div>
    </Card>
  );
}
