import React from 'react';
import { AlertTriangle, CheckCircle2, Clock, FileText, GitBranch, Layers, ShieldCheck, TrendingUp } from 'lucide-react';
import { Badge } from '../../../shared/components/ui/Badge.jsx';
import { Card } from '../../../shared/components/ui/Card.jsx';

export const pmiEnterpriseCss = `
  .pmi-enterprise-page { width: min(1540px, 100%); margin: 0 auto; display: grid; gap: 24px; }
  .pmi-enterprise-hero { border: 1px solid rgba(148,163,184,0.18); border-radius: 24px; padding: 28px; background: linear-gradient(135deg, rgba(20,184,166,0.14), rgba(15,23,42,0.9)); }
  .pmi-enterprise-title { margin: 8px 0 10px; font-size: clamp(30px, 4vw, 52px); line-height: 1; letter-spacing: 0; }
  .pmi-enterprise-copy { max-width: 920px; color: rgba(203,213,225,0.86); line-height: 1.65; margin: 0; }
  .pmi-enterprise-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px; }
  .pmi-enterprise-grid-two { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
  .pmi-enterprise-panel { border: 1px solid rgba(148,163,184,0.16); border-radius: 18px; padding: 18px; background: rgba(15,23,42,0.68); }
  .pmi-enterprise-kpi strong { display: block; font-size: 30px; line-height: 1; letter-spacing: 0; margin-top: 10px; }
  .pmi-enterprise-toolbar { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; }
  .pmi-enterprise-field { display: grid; gap: 6px; min-width: 180px; color: rgba(203,213,225,0.78); font-size: 0.78rem; font-weight: 800; text-transform: uppercase; }
  .pmi-enterprise-input, .pmi-enterprise-select { min-height: 40px; border-radius: 12px; border: 1px solid rgba(148,163,184,0.18); background: rgba(15,23,42,0.78); color: rgba(226,232,240,0.94); padding: 8px 10px; }
  .pmi-enterprise-button { min-height: 40px; border-radius: 12px; border: 1px solid rgba(94,234,212,0.28); background: rgba(20,184,166,0.16); color: rgba(226,232,240,0.96); font-weight: 850; padding: 8px 12px; cursor: pointer; }
  .pmi-enterprise-button:disabled, .pmi-enterprise-input:disabled { opacity: 0.55; cursor: not-allowed; }
  .pmi-enterprise-empty { padding: 24px; border: 1px dashed rgba(148,163,184,0.22); border-radius: 18px; color: rgba(203,213,225,0.78); }
  .pmi-enterprise-row { display: grid; grid-template-columns: minmax(210px, 1fr) repeat(4, minmax(90px, 0.5fr)); gap: 12px; align-items: center; padding: 12px 0; border-top: 1px solid rgba(148,163,184,0.12); }
  .pmi-enterprise-table-head { color: rgba(148,163,184,0.92); font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; font-weight: 850; }
  @media (max-width: 1080px) { .pmi-enterprise-grid, .pmi-enterprise-grid-two { grid-template-columns: 1fr; } .pmi-enterprise-row { grid-template-columns: 1fr; } }
`;

function safeNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

export function DecisionStatusBadge({ status }) {
  return <Badge>{String(status || 'draft').replace(/_/g, ' ')}</Badge>;
}

export function PMIExecutiveWidget({ summary }) {
  const metrics = summary?.metrics || {};
  return (
    <section className="pmi-enterprise-grid">
      <SynergyCaptureCard label="PMI readiness" value={`${safeNumber(metrics.pmiReadinessScore)}/100`} icon={ShieldCheck} />
      <SynergyCaptureCard label="Synergy capture" value={`${safeNumber(metrics.synergyCaptureRatio)}%`} icon={TrendingUp} />
      <SynergyCaptureCard label="Delayed milestones" value={safeNumber(metrics.delayedMilestones)} icon={Clock} />
      <SynergyCaptureCard label="Critical risks" value={safeNumber(metrics.criticalIntegrationRisks)} icon={AlertTriangle} />
    </section>
  );
}

export function SynergyCaptureCard({ label, value, icon: Icon = TrendingUp, description = '' }) {
  return (
    <Card className="pmi-enterprise-panel pmi-enterprise-kpi">
      <div className="pmi-enterprise-toolbar">
        <Icon size={18} />
        <span className="kpi-label">{label}</span>
      </div>
      <strong>{value}</strong>
      {description ? <p className="muted">{description}</p> : null}
    </Card>
  );
}

export function IntegrationPhaseTimeline({ phase = 'planning' }) {
  const phases = ['planning', 'signing_to_close', 'day_1', 'day_30', 'day_60', 'day_90', 'day_100', 'stabilization', 'value_capture', 'completed'];
  const currentIndex = Math.max(0, phases.indexOf(String(phase || 'planning')));
  return (
    <Card className="pmi-enterprise-panel">
      <h3>Integration phase</h3>
      <div className="pmi-enterprise-toolbar">
        {phases.map((item, index) => (
          <Badge key={item}>{index <= currentIndex ? item.replace(/_/g, ' ') : `Next ${item.replace(/_/g, ' ')}`}</Badge>
        ))}
      </div>
    </Card>
  );
}

export function EnterpriseTable({ title, items = [], columns = [] }) {
  return (
    <Card className="pmi-enterprise-panel">
      <h3>{title}</h3>
      {items.length === 0 ? (
        <div className="pmi-enterprise-empty ceos-enterprise-table-empty">
          Insufficient validated data · Human review required
        </div>
      ) : null}
      {items.length > 0 ? (
        <div className="ceos-enterprise-table-wrap ceos-enterprise-div-table">
          <div className="pmi-enterprise-row pmi-enterprise-table-head">
            {columns.map((column) => <span key={column.key}>{column.label}</span>)}
          </div>
          {items.map((item) => (
            <div className="pmi-enterprise-row" key={item.id || item.title}>
              {columns.map((column) => <span key={column.key}>{column.render ? column.render(item) : item[column.key] || 'Not set'}</span>)}
            </div>
          ))}
        </div>
      ) : null}
    </Card>
  );
}

export const SynergyInitiativesTable = ({ items }) => (
  <EnterpriseTable title="Synergy initiatives" items={items} columns={[
    { key: 'title', label: 'Initiative' },
    { key: 'status', label: 'Status', render: (item) => <DecisionStatusBadge status={item.status} /> },
    { key: 'targetValue', label: 'Target', render: (item) => safeNumber(item.targetValue).toLocaleString() },
    { key: 'capturedValue', label: 'Captured', render: (item) => safeNumber(item.capturedValue).toLocaleString() },
    { key: 'owner', label: 'Owner' }
  ]} />
);

export const MilestoneTracker = ({ items }) => (
  <EnterpriseTable title="Integration milestones" items={items} columns={[
    { key: 'title', label: 'Milestone' },
    { key: 'category', label: 'Category' },
    { key: 'status', label: 'Status', render: (item) => <DecisionStatusBadge status={item.status} /> },
    { key: 'progress', label: 'Progress', render: (item) => `${safeNumber(item.progress)}%` },
    { key: 'owner', label: 'Owner' }
  ]} />
);

export const IntegrationRiskMatrix = ({ items }) => (
  <EnterpriseTable title="Integration risk matrix" items={items} columns={[
    { key: 'title', label: 'Risk' },
    { key: 'riskArea', label: 'Area' },
    { key: 'severity', label: 'Severity', render: (item) => <DecisionStatusBadge status={item.severity} /> },
    { key: 'status', label: 'Status' },
    { key: 'owner', label: 'Owner' }
  ]} />
);

export const DayOneReadinessPanel = ({ items }) => <SimplePanel title="Day 1 readiness" items={items} icon={CheckCircle2} valueKey="readinessScore" suffix="/100" />;
export const HundredDayPlanTimeline = ({ items }) => <SimplePanel title="30-60-90-100 plan" items={items} icon={GitBranch} valueKey="period" />;
export const TransitionServicesTable = ({ items }) => <SimplePanel title="Transition services" items={items} icon={Layers} valueKey="risk" />;
export const OperatingModelPanel = ({ items }) => <SimplePanel title="Operating model" items={items} icon={GitBranch} valueKey="status" />;
export const PeopleCulturePanel = ({ items }) => <SimplePanel title="People and culture" items={items} icon={ShieldCheck} valueKey="keyPeopleRisk" />;
export const TechnologyIntegrationPanel = ({ items }) => <SimplePanel title="Technology integration" items={items} icon={Layers} valueKey="dataMigrationRisk" />;
export const IntegrationCommitteePack = ({ items }) => <SimplePanel title="Integration committee pack" items={items} icon={FileText} valueKey="reportType" />;

function SimplePanel({ title, items = [], icon: Icon = FileText, valueKey = 'status', suffix = '' }) {
  return (
    <Card className="pmi-enterprise-panel">
      <div className="pmi-enterprise-toolbar"><Icon size={18} /><h3>{title}</h3></div>
      {items.length === 0 ? <div className="pmi-enterprise-empty">No records available.</div> : items.map((item) => (
        <div className="pmi-enterprise-row" key={item.id || item.title}>
          <strong>{item.title || item.reportType || item.id}</strong>
          <span className="muted">{item[valueKey] ?? 'Not set'}{suffix}</span>
          <span className="muted">{item.owner || item.status || 'Human review required'}</span>
          <span />
          <span />
        </div>
      ))}
    </Card>
  );
}
