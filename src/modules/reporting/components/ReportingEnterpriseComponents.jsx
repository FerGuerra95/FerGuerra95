import React from 'react';
import { Badge } from '../../../shared/components/ui/Badge.jsx';
import { Card } from '../../../shared/components/ui/Card.jsx';
import { ensureNoInvalidNumber } from '../utils/reportSanitizers.js';

export const reportingEnterpriseCss = `
  .reporting-page { width: min(1440px,100%); margin: 0 auto; display: flex; flex-direction: column; gap: 24px; }
  .reporting-hero { padding: 28px; border: 1px solid rgba(148,163,184,.18); border-radius: 18px; background: linear-gradient(135deg, rgba(15,23,42,.98), rgba(31,41,55,.94)); color: #f8fafc; }
  .reporting-title { margin: 12px 0 8px; font-size: clamp(1.8rem,3vw,3rem); line-height: 1; letter-spacing: 0; }
  .reporting-copy,.reporting-muted { color: rgba(226,232,240,.72); margin: 0; }
  .reporting-grid { display: grid; grid-template-columns: repeat(auto-fit,minmax(220px,1fr)); gap: 16px; }
  .reporting-grid-two { display: grid; grid-template-columns: repeat(auto-fit,minmax(320px,1fr)); gap: 16px; }
  .reporting-panel { position: relative; isolation: isolate; overflow: hidden; background: radial-gradient(circle at 0% 0%, rgba(59,130,246,.105), transparent 36%), radial-gradient(circle at 100% 8%, rgba(16,185,129,.072), transparent 42%), linear-gradient(115deg, rgba(59,130,246,.052), rgba(255,255,255,.012) 46%, rgba(16,185,129,.040)), rgba(15,23,42,.58); border: 1px solid rgba(255,255,255,.034); border-radius: 18px; color: #e2e8f0; box-shadow: 0 24px 72px rgba(0,0,0,.24), 0 0 36px rgba(59,130,246,.078), inset 0 1px 0 rgba(255,255,255,.052); backdrop-filter: blur(18px) saturate(130%); -webkit-backdrop-filter: blur(18px) saturate(130%); }
  .reporting-panel::before { content: ""; position: absolute; inset: -30%; z-index: 0; pointer-events: none; background: radial-gradient(circle at 0% 10%, rgba(59,130,246,.092), transparent 34%), radial-gradient(circle at 100% 8%, rgba(16,185,129,.072), transparent 38%), radial-gradient(circle at 54% 120%, rgba(255,255,255,.030), transparent 42%); filter: blur(26px); opacity: .58; mix-blend-mode: screen; }
  .reporting-panel::after { content: ""; position: absolute; inset: 1px; z-index: 0; pointer-events: none; border-radius: inherit; background: linear-gradient(135deg, rgba(255,255,255,.060), rgba(255,255,255,.012) 32%, transparent 58%, rgba(255,255,255,.020)); opacity: .30; }
  .reporting-panel > * { position: relative; z-index: 1; }
  .reporting-panel h3 { margin: 0 0 10px; color: #f8fafc; letter-spacing: 0; }
  .reporting-panel > .reporting-scroll,
  .reporting-panel > .ceos-enterprise-table-wrap { margin-top: 14px; }
  .reporting-value { font-size: 1.7rem; color: #f8fafc; font-weight: 800; line-height: 1; }
  .reporting-toolbar { display: grid; grid-template-columns: repeat(auto-fit,minmax(160px,1fr)); gap: 12px; align-items: end; padding: 16px; border: 1px solid rgba(148,163,184,.1); border-radius: 8px; background: rgba(2,6,23,.16); }
  .reporting-field { display: grid; gap: 6px; color: rgba(226,232,240,.78); font-size: .78rem; font-weight: 700; }
  .reporting-input { width: 100%; min-height: 38px; border-radius: 8px; border: 1px solid rgba(148,163,184,.22); background: rgba(15,23,42,.86); color: #f8fafc; padding: 0 10px; }
  .reporting-button { min-height: 38px; border: 0; border-radius: 8px; padding: 0 14px; background: #e2e8f0; color: #020617; font-weight: 800; cursor: pointer; }
  .reporting-button:disabled { opacity: .48; cursor: not-allowed; }
  .ceos-enterprise-filter-toolbar { display: flex; flex-wrap: wrap; gap: 12px; align-items: flex-end; padding: 16px; border: 1px solid rgba(148,163,184,.1); border-radius: 8px; background: rgba(2,6,23,.16); }
  .ceos-enterprise-filter-toolbar .reporting-field { flex: 1 1 160px; min-width: 140px; }
  .ceos-enterprise-filter-clear { flex: 0 0 auto; min-height: 38px; border-radius: 8px; padding: 0 14px; border: 1px solid rgba(148,163,184,.28); background: rgba(15,23,42,.86); color: #f8fafc; font-weight: 800; cursor: pointer; }
  .ceos-enterprise-filter-clear:hover:not(:disabled) { border-color: rgba(226,232,240,.42); background: rgba(30,41,59,.92); }
  .ceos-enterprise-filter-clear:disabled { opacity: .42; cursor: not-allowed; }
  .reporting-empty { border: 1px dashed rgba(148,163,184,.24); border-radius: 8px; padding: 18px; color: rgba(226,232,240,.68); background: rgba(15,23,42,.42); }
  .reporting-scroll { overflow-x: auto; border-radius: 8px; }
  .reporting-table { width: 100%; border-collapse: collapse; font-size: .86rem; table-layout: fixed; min-width: 760px; }
  .reporting-table th,.reporting-table td { padding: 13px 14px; border-bottom: 1px solid rgba(148,163,184,.12); text-align: left; color: rgba(226,232,240,.84); vertical-align: top; overflow-wrap: anywhere; }
  .reporting-table th { color: rgba(248,250,252,.92); font-size: .72rem; text-transform: uppercase; letter-spacing: 0; background: rgba(15,23,42,.48); }
  .reporting-table tbody tr:hover td { background: rgba(148,163,184,.045); }
  .reporting-table-action { min-height: 34px; border: 1px solid rgba(148,163,184,.26); border-radius: 8px; padding: 0 12px; background: rgba(15,23,42,.62); color: #f8fafc; font-weight: 800; cursor: pointer; white-space: nowrap; }
  .reporting-table-action:hover:not(:disabled) { border-color: rgba(226,232,240,.38); background: rgba(30,41,59,.76); }
  .reporting-table-action:disabled { opacity: .5; cursor: not-allowed; }
  .reporting-table-link { border: 0; padding: 0; background: transparent; color: #f8fafc; font: inherit; font-weight: 800; text-align: left; cursor: pointer; }
  .reporting-preview-note { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; margin-top: 10px; color: rgba(226,232,240,.74); font-size: .82rem; }
  .reporting-preview-message { margin: 0 0 14px; border: 1px solid rgba(148,163,184,.18); border-radius: 8px; padding: 12px; color: rgba(226,232,240,.78); background: rgba(2,6,23,.28); }
  .reporting-snapshot-area { display: grid; gap: 14px; }
  .reporting-snapshot-actions { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; border: 1px solid rgba(148,163,184,.1); border-radius: 8px; padding: 14px; background: rgba(2,6,23,.12); }
  .reporting-snapshot-actions .reporting-muted { flex: 1 1 260px; }
  @media (max-width: 760px) { .reporting-hero { padding: 20px; } .reporting-table { min-width: 720px; } }
`;

export function ReportingKpi({ label, value, description }) {
  return <Card className="reporting-panel ceos-executive-inner-surface"><p className="reporting-muted">{label}</p><div className="reporting-value">{value ?? 0}</div><p className="reporting-muted">{description}</p></Card>;
}

export function ReportingExecutiveWidget({ summary = {} }) {
  const safeSummary = summary && typeof summary === 'object' ? summary : {};
  const metrics = safeSummary?.metrics || safeSummary || {};
  return (
    <section className="reporting-grid">
      <ReportingKpi label="Reporting readiness" value={metrics.reportingReadinessScore ?? safeSummary.reportingReadinessScore ?? 'N/A'} description={metrics.executiveReportingStatus || safeSummary.executiveReportingStatus || 'insufficient_data'} />
      <ReportingKpi label="Board pack completeness" value={`${metrics.boardPackCompleteness ?? safeSummary.boardPackCompleteness ?? 'N/A'}${metrics.boardPackCompleteness != null || safeSummary.boardPackCompleteness != null ? '%' : ''}`} description="Board review draft coverage." />
      <ReportingKpi label="Evidence gaps" value={metrics.missingEvidenceCount || safeSummary.missingEvidenceCount || 0} description="Human review required." />
      <ReportingKpi label="Outdated reports" value={metrics.outdatedReports || safeSummary.outdatedReports || 0} description="Refresh queue." />
    </section>
  );
}

export function ReportingStatusBadge({ status }) {
  return <Badge>{String(status || 'draft').replaceAll('_', ' ')}</Badge>;
}

export function ReportingTable({ title, items = [], columns = [] }) {
  function renderCell(item, column) {
    if (column.render) return column.render(item);
    const value = item[column.key];
    return value === null || value === undefined || value === '' ? 'N/A' : value;
  }

  return (
    <Card className="reporting-panel ceos-executive-inner-surface">
      <h3>{title}</h3>
      {items.length === 0 ? (
        <div className="reporting-empty ceos-enterprise-table-empty">
          Insufficient persisted evidence · Human review required
        </div>
      ) : null}
      {items.length > 0 ? (
        <div className="reporting-scroll ceos-enterprise-table-wrap">
          <table className="reporting-table ceos-enterprise-table">
            <thead><tr>{columns.map((column) => <th key={column.key}>{column.label}</th>)}</tr></thead>
            <tbody>{items.map((item) => <tr key={item.id}>{columns.map((column) => <td key={column.key}>{renderCell(item, column)}</td>)}</tr>)}</tbody>
          </table>
        </div>
      ) : null}
    </Card>
  );
}

export function ReportLibraryTable({ items = [] }) {
  return <ReportingTable title="Report library" items={items} columns={[
    { key: 'title', label: 'Report' },
    { key: 'module', label: 'Module' },
    { key: 'reportType', label: 'Type' },
    { key: 'version', label: 'Version' },
    { key: 'evidenceCompleteness', label: 'Evidence', render: (item) => `${item.evidenceCompleteness || 0}%` },
    { key: 'status', label: 'Status', render: (item) => <ReportingStatusBadge status={item.status} /> }
  ]} />;
}

function renderCompleteness(item) {
  const value = ensureNoInvalidNumber(item?.completenessScore);
  return value === 'N/A' ? 'N/A' : `${value}%`;
}

export function BoardPackTable({ items = [], onPreviewBoardReviewDraft }) {
  return <ReportingTable title="Board packs" items={items} columns={[
    { key: 'title', label: 'Board pack' },
    { key: 'status', label: 'Status', render: (item) => <ReportingStatusBadge status={item.status} /> },
    { key: 'completenessScore', label: 'Completeness', render: renderCompleteness },
    { key: 'executiveSummary', label: 'Summary' },
    ...(onPreviewBoardReviewDraft ? [{
      key: 'preview',
      label: 'Preview',
      render: (item) => (
        <button
          type="button"
          className="reporting-table-action"
          onClick={() => onPreviewBoardReviewDraft(item)}
        >
          Preview Board Review Draft
        </button>
      )
    }] : [])
  ]} />;
}
