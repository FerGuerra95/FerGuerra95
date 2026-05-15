import React from 'react';
import { AlertTriangle, CheckCircle2, Clock, GitBranch, Layers, Link2, RadioTower, ShieldCheck } from 'lucide-react';
import { Badge } from '../../../shared/components/ui/Badge.jsx';
import { Card } from '../../../shared/components/ui/Card.jsx';

export const bridgeEnterpriseCss = `
  .bridge-enterprise-page { width: min(1540px, 100%); margin: 0 auto; display: grid; gap: 24px; }
  .bridge-enterprise-hero { border: 1px solid rgba(148,163,184,0.18); border-radius: 24px; padding: 28px; background: linear-gradient(135deg, rgba(45,212,191,0.14), rgba(15,23,42,0.9)); }
  .bridge-enterprise-title { margin: 8px 0 10px; font-size: clamp(30px, 4vw, 52px); line-height: 1; letter-spacing: 0; }
  .bridge-enterprise-copy { max-width: 920px; color: rgba(203,213,225,0.86); line-height: 1.65; margin: 0; }
  .bridge-enterprise-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px; }
  .bridge-enterprise-grid-two { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
  .bridge-enterprise-panel { border: 1px solid rgba(148,163,184,0.16); border-radius: 18px; padding: 18px; background: rgba(15,23,42,0.68); }
  .bridge-enterprise-kpi strong { display: block; font-size: 30px; line-height: 1; letter-spacing: 0; margin-top: 10px; }
  .bridge-enterprise-toolbar { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; }
  .bridge-enterprise-field { display: grid; gap: 6px; min-width: 180px; color: rgba(203,213,225,0.78); font-size: 0.78rem; font-weight: 800; text-transform: uppercase; }
  .bridge-enterprise-input { min-height: 40px; border-radius: 12px; border: 1px solid rgba(148,163,184,0.18); background: rgba(15,23,42,0.78); color: rgba(226,232,240,0.94); padding: 8px 10px; }
  .bridge-enterprise-button { min-height: 40px; border-radius: 12px; border: 1px solid rgba(94,234,212,0.28); background: rgba(20,184,166,0.16); color: rgba(226,232,240,0.96); font-weight: 850; padding: 8px 12px; cursor: pointer; }
  .bridge-enterprise-button:disabled, .bridge-enterprise-input:disabled { opacity: 0.55; cursor: not-allowed; }
  .bridge-enterprise-empty { padding: 24px; border: 1px dashed rgba(148,163,184,0.22); border-radius: 18px; color: rgba(203,213,225,0.78); }
  .bridge-enterprise-row { display: grid; grid-template-columns: minmax(220px, 1fr) repeat(4, minmax(90px, 0.5fr)); gap: 12px; align-items: center; padding: 12px 0; border-top: 1px solid rgba(148,163,184,0.12); }
  .bridge-enterprise-table-head { color: rgba(148,163,184,0.92); font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; font-weight: 850; }
  @media (max-width: 1080px) { .bridge-enterprise-grid, .bridge-enterprise-grid-two { grid-template-columns: 1fr; } .bridge-enterprise-row { grid-template-columns: 1fr; } }
`;

const n = (value) => Number.isFinite(Number(value)) ? Math.round(Number(value)) : 0;

export function ConflictSeverityBadge({ severity }) {
  return <Badge>{String(severity || 'watch').replace(/_/g, ' ')}</Badge>;
}

export function BridgeHealthCard({ label, value, icon: Icon = RadioTower, description = '' }) {
  return (
    <Card className="bridge-enterprise-panel bridge-enterprise-kpi">
      <div className="bridge-enterprise-toolbar"><Icon size={18} /><span className="kpi-label">{label}</span></div>
      <strong>{value}</strong>
      {description ? <p className="muted">{description}</p> : null}
    </Card>
  );
}

export function BridgeExecutiveWidget({ summary }) {
  const metrics = summary?.metrics || {};
  return (
    <section className="bridge-enterprise-grid">
      <BridgeHealthCard label="Cross-module readiness" value={`${n(metrics.crossModuleReadiness)}/100`} icon={ShieldCheck} />
      <BridgeHealthCard label="Critical signals" value={n(metrics.criticalCrossModuleSignals)} icon={AlertTriangle} />
      <BridgeHealthCard label="Blocked dependencies" value={n(metrics.blockedDependencies)} icon={GitBranch} />
      <BridgeHealthCard label="Attention queue" value={n(metrics.executiveAttentionCount)} icon={Clock} />
    </section>
  );
}

export function EnterpriseTable({ title, items = [], columns = [] }) {
  return (
    <Card className="bridge-enterprise-panel">
      <h3>{title}</h3>
      {items.length === 0 ? (
        <div className="bridge-enterprise-empty ceos-enterprise-table-empty">
          Insufficient validated data · Human review required
        </div>
      ) : null}
      {items.length > 0 ? (
        <div className="ceos-enterprise-table-wrap ceos-enterprise-div-table">
          <div className="bridge-enterprise-row bridge-enterprise-table-head">
            {columns.map((column) => (
              <span key={column.key}>{column.label}</span>
            ))}
          </div>
          {items.map((item) => (
            <div className="bridge-enterprise-row" key={item.id || item.title}>
              {columns.map((column) => (
                <span key={column.key}>
                  {column.render ? column.render(item) : item[column.key] || 'Not set'}
                </span>
              ))}
            </div>
          ))}
        </div>
      ) : null}
    </Card>
  );
}

export const CrossModuleSignalFeed = ({ items = [], onAcknowledge, onResolve, onDismiss, readOnly = false }) => (
  <EnterpriseTable title="Cross-module signals" items={items} columns={[
    { key: 'title', label: 'Signal' },
    { key: 'severity', label: 'Severity', render: (item) => <ConflictSeverityBadge severity={item.severity} /> },
    { key: 'sourceModule', label: 'Source' },
    { key: 'targetModule', label: 'Target' },
    { key: 'actions', label: 'Actions', render: (item) => (
      <div className="bridge-enterprise-toolbar">
        <button className="bridge-enterprise-button" disabled={readOnly} onClick={() => onAcknowledge?.(item)}>Ack</button>
        <button className="bridge-enterprise-button" disabled={readOnly} onClick={() => onResolve?.(item)}>Resolve</button>
        <button className="bridge-enterprise-button" disabled={readOnly} onClick={() => onDismiss?.(item)}>Dismiss</button>
      </div>
    ) }
  ]} />
);

export const DependencyMapGraph = ({ items = [] }) => (
  <EnterpriseTable title="Dependency map" items={items} columns={[
    { key: 'sourceModule', label: 'Source' },
    { key: 'targetModule', label: 'Target' },
    { key: 'dependencyType', label: 'Type' },
    { key: 'status', label: 'Status' },
    { key: 'owner', label: 'Owner' }
  ]} />
);

export const AttentionQueueTable = ({ items = [] }) => (
  <EnterpriseTable title="Executive attention queue" items={items} columns={[
    { key: 'title', label: 'Item' },
    { key: 'severity', label: 'Severity', render: (item) => <ConflictSeverityBadge severity={item.severity} /> },
    { key: 'priorityScore', label: 'Priority', render: (item) => `${n(item.priorityScore)}/100` },
    { key: 'owner', label: 'Owner' },
    { key: 'status', label: 'Status' }
  ]} />
);

export const EvidenceLinkPanel = ({ items = [] }) => <SimplePanel title="Evidence links" items={items} icon={Link2} valueKey="evidenceQuality" />;
export const SignalLifecyclePanel = ({ item }) => <SimplePanel title="Signal lifecycle" items={item ? [item] : []} icon={CheckCircle2} valueKey="humanReviewStatus" />;
export const ModuleHealthMap = ({ metrics = {} }) => {
  const entries = Object.entries(metrics.moduleHealthMap || {});
  return <SimplePanel title="Module health map" items={entries.map(([title, status]) => ({ title, status }))} icon={Layers} valueKey="status" />;
};

function SimplePanel({ title, items = [], icon: Icon = RadioTower, valueKey = 'status' }) {
  return (
    <Card className="bridge-enterprise-panel">
      <div className="bridge-enterprise-toolbar"><Icon size={18} /><h3>{title}</h3></div>
      {items.length === 0 ? (
        <div className="bridge-enterprise-empty ceos-enterprise-table-empty">
          Insufficient validated data · Human review required
        </div>
      ) : (
        items.map((item) => (
          <div className="bridge-enterprise-row" key={item.id || item.title}>
            <strong>{item.title || item.linkLabel || item.id}</strong>
            <span className="muted">{item[valueKey] ?? 'Not set'}</span>
            <span className="muted">{item.sourceModule || item.owner || 'Human review required'}</span>
            <span />
            <span />
          </div>
        ))
      )}
    </Card>
  );
}
