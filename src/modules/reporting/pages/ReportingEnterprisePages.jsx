import React, { useEffect, useMemo, useState } from 'react';
import { Badge } from '../../../shared/components/ui/Badge.jsx';
import { PERMISSIONS, useAuth } from '../../../app/providers/AuthProvider.jsx';
import { reportingApi } from '../services/reportingApi.js';
import { buildBoardReviewDraftHtml } from '../renderers/boardReviewDraftHtml.js';
import {
  BoardPackTable,
  ReportLibraryTable,
  ReportingExecutiveWidget,
  ReportingStatusBadge,
  ReportingTable,
  reportingEnterpriseCss
} from '../components/ReportingEnterpriseComponents.jsx';
import { BoardReviewWorkflowPanel } from '../components/BoardReviewWorkflowPanel.jsx';
import { toBoardReviewDraftInput } from '../utils/boardReviewDraftAdapter.js';
import { openBoardReviewDraftWindow } from '../utils/openBoardReviewDraftWindow.js';

const EMPTY_REPORTING_FILTERS = { module: '', status: '', owner: '' };
const BOARD_REVIEW_PREVIEW_REQUIRED = 'Board Review Draft preview requires a selected board pack or report snapshot.';

function EntityPage({ badge, title, copy, load, create, defaults = {}, fields = [], render, permission = PERMISSIONS.CREATE_REPORTING }) {
  const { can } = useAuth();
  const canCreate = can(permission);
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(defaults);
  const [filters, setFilters] = useState(EMPTY_REPORTING_FILTERS);
  const [state, setState] = useState({ loading: true, error: null });

  async function refresh() {
    try {
      setItems(await load());
      setState({ loading: false, error: null });
    } catch (error) {
      setState({ loading: false, error });
    }
  }

  useEffect(() => { refresh(); }, []);

  async function submit(event) {
    event.preventDefault();
    if (!canCreate || !create) return;
    await create(form);
    setForm(defaults);
    await refresh();
  }

  const filtered = useMemo(() => items.filter((item) => {
    const moduleOk = !filters.module || String(item.module || item.sourceModule || '').toLowerCase().includes(filters.module.toLowerCase());
    const statusOk = !filters.status || String(item.status || item.evidenceStatus || '').toLowerCase().includes(filters.status.toLowerCase());
    const ownerOk = !filters.owner || String(item.owner || item.exportedBy || '').toLowerCase().includes(filters.owner.toLowerCase());
    return moduleOk && statusOk && ownerOk;
  }), [items, filters]);

  const hasActiveFilters = Boolean(
    filters.module || filters.status || filters.owner
  );

  return (
    <div className="page">
      <style>{reportingEnterpriseCss}</style>
      <div className="reporting-page">
        <section className="reporting-hero ceos-ws-hero">
          <Badge>{badge}</Badge>
          <h1 className="reporting-title">{title}</h1>
          <p className="reporting-copy">{copy}</p>
        </section>
        <div className="reporting-toolbar ceos-enterprise-filter-toolbar">
          <label className="reporting-field"><span>Module filter</span><input aria-label="Module filter" className="reporting-input" value={filters.module} onChange={(event) => setFilters((current) => ({ ...current, module: event.target.value }))} /></label>
          <label className="reporting-field"><span>Status filter</span><input aria-label="Status filter" className="reporting-input" value={filters.status} onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))} /></label>
          <label className="reporting-field"><span>Owner filter</span><input aria-label="Owner filter" className="reporting-input" value={filters.owner} onChange={(event) => setFilters((current) => ({ ...current, owner: event.target.value }))} /></label>
          <button
            type="button"
            className="reporting-button ceos-enterprise-filter-clear"
            onClick={() => setFilters(EMPTY_REPORTING_FILTERS)}
            disabled={!hasActiveFilters}
          >
            Limpiar filtros
          </button>
        </div>
        {create ? (
          <form className="reporting-toolbar" onSubmit={submit}>
            {fields.map((field) => <label className="reporting-field" key={field}><span>{field}</span><input aria-label={field} className="reporting-input" disabled={!canCreate} value={form[field] || ''} onChange={(event) => setForm((current) => ({ ...current, [field]: event.target.value }))} /></label>)}
            <button className="reporting-button" disabled={!canCreate}>{canCreate ? 'Create' : 'Read only'}</button>
          </form>
        ) : null}
        {state.loading ? <div className="reporting-empty">Loading reporting records.</div> : null}
        {state.error ? <div className="reporting-empty">Reporting records could not be loaded.</div> : null}
        {render(filtered)}
      </div>
    </div>
  );
}

export function ReportingDashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [state, setState] = useState({ loading: true, error: null });
  useEffect(() => {
    reportingApi.getDashboard()
      .then((data) => { setDashboard(data); setState({ loading: false, error: null }); })
      .catch((error) => setState({ loading: false, error }));
  }, []);
  return (
    <div className="page">
      <style>{reportingEnterpriseCss}</style>
      <div className="reporting-page">
        <section className="reporting-hero ceos-ws-hero">
          <Badge>Enterprise Reporting</Badge>
          <h1 className="reporting-title">Board packs and executive reporting.</h1>
          <p className="reporting-copy">Report library, templates, board packs, export ledger, versioning, schedules and evidence-backed reporting. Human review required.</p>
        </section>
        {state.loading ? <div className="reporting-empty">Loading Reporting dashboard.</div> : null}
        {state.error ? <div className="reporting-empty">Reporting dashboard could not be loaded.</div> : null}
        <ReportingExecutiveWidget summary={dashboard} />
        <section className="reporting-grid-two">
          <ReportLibraryTable items={dashboard?.reports || []} />
          <BoardPackTable items={dashboard?.boardPacks || []} />
        </section>
      </div>
    </div>
  );
}

export const ReportingLibraryPage = () => <EntityPage badge="Library" title="Report library." copy="Module, type, owner, version, export freshness and evidence completeness." load={reportingApi.listReports} create={reportingApi.createReport} defaults={{ title: '', module: 'M&A', reportType: 'M&A Executive Report', status: 'draft', owner: 'Executive Office', evidenceCompleteness: 75 }} fields={['title', 'module', 'reportType', 'status', 'owner', 'evidenceCompleteness']} render={(items) => <ReportLibraryTable items={items} />} />;
export const ReportingTemplatesPage = () => <EntityPage badge="Templates" title="Template manager." copy="Template structure, required sections, required evidence and status by module." load={reportingApi.listTemplates} create={reportingApi.createTemplate} defaults={{ templateKey: '', module: 'enterprise', status: 'active' }} fields={['templateKey', 'module', 'status']} permission={PERMISSIONS.UPDATE_REPORTING} render={(items) => <ReportingTable title="Templates" items={items} columns={[{ key: 'templateKey', label: 'Template' }, { key: 'module', label: 'Module' }, { key: 'status', label: 'Status', render: (item) => <ReportingStatusBadge status={item.status} /> }]} />} />;
function BoardPackPreviewIntegration({ items = [] }) {
  const [previewMessage, setPreviewMessage] = useState(items.length === 0 ? BOARD_REVIEW_PREVIEW_REQUIRED : '');
  const [activeSnapshot, setActiveSnapshot] = useState(null);

  const workflowPreviewInput = useMemo(() => {
    if (activeSnapshot) {
      return { snapshot: activeSnapshot };
    }
    if (items.length === 0) {
      return toBoardReviewDraftInput({ includeSnapshot: true });
    }
    return toBoardReviewDraftInput({
      boardPack: items[0],
      generatedAt: new Date(),
      fallbackScope: 'Reporting / Board Packs',
      includeSnapshot: true,
      statusInput: { status: items[0]?.status || 'human_review_required' }
    });
  }, [activeSnapshot, items]);

  useEffect(() => {
    if (items.length > 0 && previewMessage === BOARD_REVIEW_PREVIEW_REQUIRED) {
      setPreviewMessage('');
    }
    if (items.length === 0) {
      setPreviewMessage(BOARD_REVIEW_PREVIEW_REQUIRED);
    }
  }, [items.length, previewMessage]);

  function handlePreviewBoardReviewDraft(boardPack) {
    if (!boardPack?.id && !boardPack?.title) {
      setPreviewMessage(BOARD_REVIEW_PREVIEW_REQUIRED);
      return;
    }

    const input = toBoardReviewDraftInput({
      boardPack,
      generatedAt: new Date(),
      fallbackScope: 'Reporting / Board Packs',
      includeSnapshot: true,
      statusInput: { status: boardPack.status || 'human_review_required' }
    });
    setActiveSnapshot(input.snapshot);
    const html = buildBoardReviewDraftHtml(input);
    const result = openBoardReviewDraftWindow(html);

    if (!result.ok) {
      setPreviewMessage('Board Review Draft preview window was blocked. Enable popups for this app to preview the draft.');
      return;
    }

    setPreviewMessage('Board Review Draft preview opened. Human review required before circulation.');
  }

  return (
    <>
      {previewMessage ? <div className="reporting-preview-message">{previewMessage}</div> : null}
      <div className="reporting-preview-note" aria-label="Board Review Draft preview truthfulness labels">
        <span>Board Review Draft</span>
        <span>Confidential</span>
        <span>Human Review Required</span>
        <span>Based on DSS Signals</span>
        <span>Not Legal Advice</span>
        <span>Not Investment Advice</span>
        <span>Not Board Approved</span>
      </div>
      <BoardReviewWorkflowPanel snapshot={workflowPreviewInput.snapshot} />
      <BoardPackTable items={items} onPreviewBoardReviewDraft={handlePreviewBoardReviewDraft} />
    </>
  );
}

export const ReportingBoardPackPage = () => <EntityPage badge="Board Pack" title="Board pack builder." copy="Sections, source modules, executive summary, decisions, risks and cross-module highlights." load={reportingApi.listBoardPacks} create={reportingApi.createBoardPack} defaults={{ title: 'Board Executive Snapshot', status: 'draft', completenessScore: 82 }} fields={['title', 'status', 'completenessScore']} permission={PERMISSIONS.EXPORT_REPORTING} render={(items) => <BoardPackPreviewIntegration items={items} />} />;
export const ReportingExportsPage = () => <EntityPage badge="Exports" title="Export ledger." copy="Export type, owner, timestamp, checksum, destination note and confidentiality level." load={reportingApi.listExports} create={reportingApi.createExport} defaults={{ reportId: '', exportType: 'pdf', confidentialityLevel: 'confidential', destinationNote: 'Board portal' }} fields={['reportId', 'exportType', 'confidentialityLevel', 'destinationNote']} permission={PERMISSIONS.EXPORT_REPORTING} render={(items) => <ReportingTable title="Export ledger" items={items} columns={[{ key: 'reportId', label: 'Report' }, { key: 'exportType', label: 'Type' }, { key: 'exportedBy', label: 'By' }, { key: 'checksum', label: 'Checksum' }, { key: 'confidentialityLevel', label: 'Confidentiality' }]} />} />;
export const ReportingSchedulesPage = () => <EntityPage badge="Schedules" title="Scheduled reports." copy="Basic reporting cadence, owner, next run, status and template link." load={reportingApi.listSchedules} create={reportingApi.createSchedule} defaults={{ title: '', schedule: 'monthly', owner: 'Executive Office', nextRun: '', status: 'active' }} fields={['title', 'schedule', 'owner', 'nextRun', 'status']} permission={PERMISSIONS.UPDATE_REPORTING} render={(items) => <ReportingTable title="Schedules" items={items} columns={[{ key: 'title', label: 'Schedule' }, { key: 'schedule', label: 'Cadence' }, { key: 'owner', label: 'Owner' }, { key: 'nextRun', label: 'Next run' }, { key: 'status', label: 'Status', render: (item) => <ReportingStatusBadge status={item.status} /> }]} />} />;
export const ReportingEvidencePage = () => <EntityPage badge="Evidence" title="Evidence-backed reports." copy="Evidence links, missing evidence, quality and human review requirements." load={reportingApi.listEvidence} create={reportingApi.createEvidence} defaults={{ reportId: '', sourceModule: 'Compliance', evidenceTitle: '', evidenceStatus: 'missing', evidenceQuality: 'medium' }} fields={['reportId', 'sourceModule', 'evidenceTitle', 'evidenceStatus', 'evidenceQuality']} permission={PERMISSIONS.UPDATE_REPORTING} render={(items) => <ReportingTable title="Report evidence" items={items} columns={[{ key: 'evidenceTitle', label: 'Evidence' }, { key: 'sourceModule', label: 'Source' }, { key: 'evidenceStatus', label: 'Status', render: (item) => <ReportingStatusBadge status={item.evidenceStatus} /> }, { key: 'evidenceQuality', label: 'Quality' }]} />} />;
