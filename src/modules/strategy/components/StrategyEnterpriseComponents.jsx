import React from 'react';
import { Badge } from '../../../shared/components/ui/Badge.jsx';
import { Card } from '../../../shared/components/ui/Card.jsx';

export const strategyEnterpriseCss = `
  .strategy-page { width: min(1440px,100%); margin: 0 auto; display: flex; flex-direction: column; gap: 24px; }
  .strategy-hero { padding: 28px; border: 1px solid rgba(148,163,184,.18); border-radius: 18px; background: linear-gradient(135deg, rgba(15,23,42,.98), rgba(30,41,59,.94)); color: #f8fafc; }
  .strategy-title { margin: 12px 0 8px; font-size: clamp(1.8rem,3vw,3rem); line-height: 1; letter-spacing: 0; }
  .strategy-copy,.strategy-muted { color: rgba(226,232,240,.72); margin: 0; }
  .strategy-grid { display: grid; grid-template-columns: repeat(auto-fit,minmax(220px,1fr)); gap: 16px; }
  .strategy-grid-two { display: grid; grid-template-columns: repeat(auto-fit,minmax(320px,1fr)); gap: 16px; }
  .strategy-panel { position: relative; isolation: isolate; overflow: hidden; background: radial-gradient(circle at 0% 0%, rgba(59,130,246,.105), transparent 36%), radial-gradient(circle at 100% 8%, rgba(16,185,129,.072), transparent 42%), linear-gradient(115deg, rgba(59,130,246,.052), rgba(255,255,255,.012) 46%, rgba(16,185,129,.040)), rgba(15,23,42,.58); border: 1px solid rgba(255,255,255,.034); border-radius: 18px; color: #e2e8f0; box-shadow: 0 24px 72px rgba(0,0,0,.24), 0 0 36px rgba(59,130,246,.078), inset 0 1px 0 rgba(255,255,255,.052); backdrop-filter: blur(18px) saturate(130%); -webkit-backdrop-filter: blur(18px) saturate(130%); }
  .strategy-panel::before { content: ""; position: absolute; inset: -30%; z-index: 0; pointer-events: none; background: radial-gradient(circle at 0% 10%, rgba(59,130,246,.092), transparent 34%), radial-gradient(circle at 100% 8%, rgba(16,185,129,.072), transparent 38%), radial-gradient(circle at 54% 120%, rgba(255,255,255,.030), transparent 42%); filter: blur(26px); opacity: .58; mix-blend-mode: screen; }
  .strategy-panel::after { content: ""; position: absolute; inset: 1px; z-index: 0; pointer-events: none; border-radius: inherit; background: linear-gradient(135deg, rgba(255,255,255,.060), rgba(255,255,255,.012) 32%, transparent 58%, rgba(255,255,255,.020)); opacity: .30; }
  .strategy-panel > * { position: relative; z-index: 1; }
  .strategy-panel h3 { margin: 0 0 10px; color: #f8fafc; letter-spacing: 0; }
  .strategy-value { font-size: 1.7rem; color: #f8fafc; font-weight: 800; line-height: 1; }
  .strategy-toolbar { display: grid; grid-template-columns: repeat(auto-fit,minmax(160px,1fr)); gap: 12px; align-items: end; padding: 16px; border: 1px solid rgba(148,163,184,.1); border-radius: 8px; background: rgba(2,6,23,.16); }
  .strategy-field { display: grid; gap: 6px; color: rgba(226,232,240,.78); font-size: .78rem; font-weight: 700; }
  .strategy-input { width: 100%; min-height: 38px; border-radius: 8px; border: 1px solid rgba(148,163,184,.22); background: rgba(15,23,42,.86); color: #f8fafc; padding: 0 10px; }
  .strategy-button { min-height: 38px; border: 0; border-radius: 8px; padding: 0 14px; background: #e2e8f0; color: #020617; font-weight: 800; cursor: pointer; }
  .strategy-button:disabled { opacity: .48; cursor: not-allowed; }
  .strategy-empty { border: 1px dashed rgba(148,163,184,.24); border-radius: 8px; padding: 18px; color: rgba(226,232,240,.68); background: rgba(15,23,42,.42); }
  .strategy-table { width: 100%; border-collapse: collapse; font-size: .86rem; }
  .strategy-table th,.strategy-table td { padding: 12px; border-bottom: 1px solid rgba(148,163,184,.12); text-align: left; color: rgba(226,232,240,.84); }
  .strategy-table th { color: rgba(248,250,252,.92); font-size: .72rem; text-transform: uppercase; letter-spacing: 0; }
  @media (max-width: 760px) { .strategy-hero { padding: 20px; } .strategy-table { min-width: 720px; } .strategy-scroll { overflow-x: auto; } }
`;

export function StrategyStatusBadge({ status }) {
  const normalized = String(status || 'active').toLowerCase();
  const label =
    normalized === 'generated'
      ? 'draft metadata'
      : normalized === 'not_assessed'
        ? 'not assessed'
        : normalized === 'insufficient_data'
          ? 'insufficient data'
          : normalized.replaceAll('_', ' ');
  return <Badge>{label}</Badge>;
}

function formatStrategyScore(value) {
  if (value === null || value === undefined || !Number.isFinite(Number(value))) {
    return 'N/A';
  }
  return `${value}%`;
}

function formatStrategicRiskLevel(value) {
  const normalized = String(value || 'not_assessed').toLowerCase();
  if (normalized === 'controlled') return 'not assessed';
  return normalized.replaceAll('_', ' ');
}

export function StrategyKpi({ label, value, description }) {
  return <Card className="strategy-panel"><p className="strategy-muted">{label}</p><div className="strategy-value">{value ?? 0}</div><p className="strategy-muted">{description}</p></Card>;
}

export function StrategyExecutiveWidget({ summary = {} }) {
  const safe = summary && typeof summary === 'object' ? summary : {};
  const metrics = safe.metrics || safe || {};
  const readinessScore = metrics.strategyReadinessScore ?? safe.strategyReadinessScore;
  const riskLevel = metrics.strategicRiskLevel ?? safe.strategicRiskLevel ?? 'not_assessed';
  return (
    <section className="strategy-grid">
      <StrategyKpi label="Operational readiness signal" value={formatStrategyScore(readinessScore)} description="DSS heuristic — human review required." />
      <StrategyKpi label="Blocked initiatives" value={metrics.blockedStrategicInitiatives || safe.blockedStrategicInitiatives || 0} description="Executive attention." />
      <StrategyKpi label="Capital dependencies" value={metrics.capitalDependencyCount || safe.capitalDependencyCount || 0} description="Funding linkage." />
      <StrategyKpi label="Strategic risk posture" value={formatStrategicRiskLevel(riskLevel)} description="Not a certified risk rating." />
    </section>
  );
}

export function StrategyTable({ title, items = [], columns = [] }) {
  return (
    <Card className="strategy-panel">
      <h3>{title}</h3>
      {items.length === 0 ? (
        <div className="strategy-empty ceos-enterprise-table-empty">
          Insufficient validated data · Human review required
        </div>
      ) : null}
      {items.length > 0 ? (
        <div className="strategy-scroll ceos-enterprise-table-wrap">
          <table className="strategy-table ceos-enterprise-table">
            <thead><tr>{columns.map((column) => <th key={column.key}>{column.label}</th>)}</tr></thead>
            <tbody>{items.map((item) => <tr key={item.id}>{columns.map((column) => <td key={column.key}>{column.render ? column.render(item) : item[column.key] || 'N/A'}</td>)}</tr>)}</tbody>
          </table>
        </div>
      ) : null}
    </Card>
  );
}

export function ObjectivesTable({ items = [] }) {
  return <StrategyTable title="Strategic objectives" items={items} columns={[
    { key: 'title', label: 'Objective' },
    { key: 'owner', label: 'Owner' },
    { key: 'horizon', label: 'Horizon' },
    { key: 'priority', label: 'Priority' },
    { key: 'status', label: 'Status', render: (item) => <StrategyStatusBadge status={item.status} /> },
    { key: 'linkedModule', label: 'Module' }
  ]} />;
}

export function InitiativesTable({ items = [] }) {
  return <StrategyTable title="Strategic initiatives" items={items} columns={[
    { key: 'title', label: 'Initiative' },
    { key: 'owner', label: 'Owner' },
    { key: 'dueDate', label: 'Due date' },
    { key: 'progress', label: 'Progress', render: (item) => `${item.progress || 0}%` },
    { key: 'capitalNeed', label: 'Capital need' },
    { key: 'status', label: 'Status', render: (item) => <StrategyStatusBadge status={item.status} /> }
  ]} />;
}
