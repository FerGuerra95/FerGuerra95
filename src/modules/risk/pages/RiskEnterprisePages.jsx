import React, { useEffect, useMemo, useState } from 'react';
import { Badge } from '../../../shared/components/ui/Badge.jsx';
import { PERMISSIONS, useAuth } from '../../../app/providers/AuthProvider.jsx';
import { riskApi } from '../services/riskApi.js';
import { prepareRiskRegisterPayload } from '../utils/riskRegisterPayload.js';
import {
  BoardRiskReadinessPanel,
  ControlsLibraryPanel,
  IncidentLogPanel,
  KriTrackerPanel,
  MitigationPlansPanel,
  RiskAppetitePanel,
  RiskCommitteeReviewPanel,
  RiskEvidencePanel,
  RiskExecutiveWidget,
  RiskHeatmap,
  RiskRegisterTable,
  RiskReportsPanel,
  RiskNotificationPanel,
  riskEnterpriseCss
} from '../components/RiskEnterpriseComponents.jsx';

const EMPTY_RISK_FILTERS = { status: '', owner: '', category: '' };

function normalizeFieldConfig(field) {
  if (typeof field === 'string') {
    return { key: field, label: field, type: 'text' };
  }
  return {
    key: field.key,
    label: field.label || field.key,
    type: field.type || 'text',
    min: field.min,
    max: field.max,
    help: field.help
  };
}

function EntityPage({
  badge,
  title,
  copy,
  load,
  create,
  defaults = {},
  fields = [],
  transformPayload,
  render,
  permission = PERMISSIONS.CREATE_RISK
}) {
  const { can } = useAuth();
  const canCreate = can(permission);
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(defaults);
  const [status, setStatus] = useState({ loading: true, error: null });
  const [filters, setFilters] = useState(EMPTY_RISK_FILTERS);

  async function refresh() {
    try {
      setItems(await load());
      setStatus({ loading: false, error: null });
    } catch (error) {
      setStatus({ loading: false, error });
    }
  }

  useEffect(() => { refresh(); }, []);

  async function submit(event) {
    event.preventDefault();
    if (!canCreate || !create) return;
    const payload = transformPayload ? transformPayload(form) : form;
    await create(payload);
    setForm(defaults);
    await refresh();
  }

  const filtered = useMemo(() => items.filter((item) => {
    const statusOk = !filters.status || String(item.status || '').toLowerCase().includes(filters.status.toLowerCase());
    const ownerOk = !filters.owner || String(item.owner || '').toLowerCase().includes(filters.owner.toLowerCase());
    const categoryOk = !filters.category || String(item.category || item.controlType || item.metric || '').toLowerCase().includes(filters.category.toLowerCase());
    return statusOk && ownerOk && categoryOk;
  }), [items, filters]);

  const hasActiveFilters = Boolean(
    filters.status || filters.owner || filters.category
  );

  return (
    <div className="page">
      <style>{riskEnterpriseCss}</style>
      <div className="risk-enterprise-page">
        <section className="risk-enterprise-hero ceos-ws-hero">
          <Badge>{badge}</Badge>
          <h1 className="risk-enterprise-title">{title}</h1>
          <p className="risk-enterprise-copy">{copy}</p>
        </section>
        <div className="risk-enterprise-toolbar ceos-enterprise-filter-toolbar">
          <label className="risk-enterprise-field"><span>Status filter</span><input aria-label="Status filter" className="risk-enterprise-input" value={filters.status} onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))} /></label>
          <label className="risk-enterprise-field"><span>Owner filter</span><input aria-label="Owner filter" className="risk-enterprise-input" value={filters.owner} onChange={(event) => setFilters((current) => ({ ...current, owner: event.target.value }))} /></label>
          <label className="risk-enterprise-field"><span>Category filter</span><input aria-label="Category filter" className="risk-enterprise-input" value={filters.category} onChange={(event) => setFilters((current) => ({ ...current, category: event.target.value }))} /></label>
          <button
            type="button"
            className="risk-enterprise-button ceos-enterprise-filter-clear"
            onClick={() => setFilters(EMPTY_RISK_FILTERS)}
            disabled={!hasActiveFilters}
          >
            Limpiar filtros
          </button>
        </div>
        {create ? (
          <form className="risk-enterprise-toolbar" onSubmit={submit}>
            {fields.map((fieldConfig) => {
              const field = normalizeFieldConfig(fieldConfig);
              return (
                <label className="risk-enterprise-field" key={field.key}>
                  <span>{field.label}</span>
                  <input
                    aria-label={field.label}
                    className="risk-enterprise-input"
                    disabled={!canCreate}
                    type={field.type}
                    min={field.min}
                    max={field.max}
                    value={form[field.key] ?? ''}
                    onChange={(event) => setForm((current) => ({ ...current, [field.key]: event.target.value }))}
                  />
                  {field.help ? <span className="risk-muted">{field.help}</span> : null}
                </label>
              );
            })}
            <button className="risk-enterprise-button" disabled={!canCreate}>{canCreate ? 'Create' : 'Read only'}</button>
          </form>
        ) : null}
        {status.loading ? <div className="risk-enterprise-empty">Loading records.</div> : null}
        {status.error ? <div className="risk-enterprise-empty">Records could not be loaded.</div> : null}
        {render(filtered)}
      </div>
    </div>
  );
}

export function RiskDashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [status, setStatus] = useState({ loading: true, error: null });
  useEffect(() => {
    riskApi.getDashboard()
      .then((data) => { setDashboard(data); setStatus({ loading: false, error: null }); })
      .catch((error) => setStatus({ loading: false, error }));
  }, []);
  const metrics = dashboard?.metrics || {};
  return (
    <div className="page">
      <style>{riskEnterpriseCss}</style>
      <div className="risk-enterprise-page">
        <section className="risk-enterprise-hero ceos-ws-hero">
          <Badge>Enterprise Risk</Badge>
          <h1 className="risk-enterprise-title">Risk command center.</h1>
          <p className="risk-enterprise-copy">Risk register, heatmap, controls, mitigations, incidents, KRIs, risk appetite, reporting and executive signals. Human review required.</p>
        </section>
        {status.loading ? <div className="risk-enterprise-empty">Loading Risk dashboard.</div> : null}
        {status.error ? <div className="risk-enterprise-empty">Risk dashboard could not be loaded.</div> : null}
        <RiskExecutiveWidget summary={dashboard} />
        <section className="risk-enterprise-grid-two">
          <RiskHeatmap heatmap={dashboard?.heatmap || []} risks={dashboard?.risks || []} />
          <BoardRiskReadinessPanel metrics={metrics} />
        </section>
        <RiskRegisterTable items={dashboard?.risks || []} />
        <MitigationPlansPanel items={dashboard?.mitigations || []} />
        <section className="risk-enterprise-grid-two">
          <RiskCommitteeReviewPanel items={dashboard?.committeeReviews || []} />
          <RiskEvidencePanel items={dashboard?.evidenceLinks || []} />
        </section>
      </div>
    </div>
  );
}

export function RiskRegisterPage() {
  return (
    <EntityPage
      badge="Register"
      title="Enterprise risk register."
      copy="Capture likelihood, impact, inherent severity and residual posture. Scores are decision-support signals — not certified risk ratings. Human review required."
      load={riskApi.listRegister}
      create={riskApi.createRisk}
      transformPayload={prepareRiskRegisterPayload}
      defaults={{
        title: '',
        category: 'operational',
        inherentSeverity: 'high',
        likelihood: 3,
        impact: 3,
        residualRisk: 'medium',
        owner: 'Risk Owner',
        status: 'open'
      }}
      fields={[
        'title',
        'category',
        'inherentSeverity',
        {
          key: 'likelihood',
          label: 'Likelihood',
          type: 'number',
          min: 1,
          max: 5,
          help: 'Used to position the risk in the operational DSS matrix (1–5).'
        },
        {
          key: 'impact',
          label: 'Impact',
          type: 'number',
          min: 1,
          max: 5,
          help: 'Used to position the risk in the operational DSS matrix (1–5).'
        },
        'residualRisk',
        'owner',
        'status'
      ]}
      render={(items) => <RiskRegisterTable items={items} />}
    />
  );
}

export function RiskHeatmapPage() {
  return (
    <EntityPage
      badge="Heatmap"
      title="Risk heatmap."
      copy="Likelihood × impact portfolio distribution with category and owner filters. Operational DSS posture — human review required."
      load={riskApi.listRegister}
      create={null}
      render={(items) => <RiskHeatmap risks={items} />}
    />
  );
}

export function RiskControlsPage() {
  return <EntityPage badge="Controls" title="Controls library." copy="Control title, type, owner, frequency, evidence, test date and effectiveness." load={riskApi.listControls} create={riskApi.createControl} defaults={{ title: '', controlType: 'preventive', owner: 'Control Owner', frequency: 'quarterly', effectiveness: 75 }} fields={['title', 'controlType', 'owner', 'frequency', 'effectiveness']} permission={PERMISSIONS.MANAGE_RISK_CONTROL} render={(items) => <ControlsLibraryPanel items={items} />} />;
}

export function RiskMitigationsPage() {
  return <EntityPage badge="Mitigations" title="Mitigation plans." copy="Risk actions, owners, due dates, status, progress and blockers." load={riskApi.listMitigations} create={riskApi.createMitigation} defaults={{ action: '', owner: 'Risk Owner', dueDate: '', status: 'open', progress: 0 }} fields={['action', 'owner', 'dueDate', 'status', 'progress']} permission={PERMISSIONS.MANAGE_RISK_MITIGATION} render={(items) => <MitigationPlansPanel items={items} />} />;
}

export function RiskIncidentsPage() {
  return <EntityPage badge="Incidents" title="Incident and issue log." copy="Incident severity, impacted area, resolution, root cause and linked risk." load={riskApi.listIncidents} create={riskApi.createIncident} defaults={{ incidentDate: '', severity: 'medium', description: '', impactedArea: '', status: 'open' }} fields={['incidentDate', 'severity', 'description', 'impactedArea', 'status']} permission={PERMISSIONS.MANAGE_RISK_INCIDENT} render={(items) => <IncidentLogPanel items={items} />} />;
}

export function RiskKriPage() {
  return <EntityPage badge="KRI" title="KRI tracker." copy="Key risk indicators with thresholds, actual values, breach flags, trend and owner." load={riskApi.listKri} create={riskApi.createKri} defaults={{ metric: '', threshold: 10, actualValue: 0, trend: 'stable', owner: 'Risk Owner' }} fields={['metric', 'threshold', 'actualValue', 'trend', 'owner']} permission={PERMISSIONS.MANAGE_RISK_KRI} render={(items) => <KriTrackerPanel items={items} />} />;
}

export function RiskAppetitePage() {
  return <EntityPage badge="Appetite" title="Risk appetite." copy="Appetite statements, metrics, thresholds, breach handling and owners." load={riskApi.listAppetite} create={riskApi.createAppetite} defaults={{ appetiteStatement: '', metric: '', threshold: 0, breachHandling: 'Escalate to risk committee', owner: 'Risk Committee' }} fields={['appetiteStatement', 'metric', 'threshold', 'breachHandling', 'owner']} permission={PERMISSIONS.MANAGE_RISK_APPETITE} render={(items) => <RiskAppetitePanel items={items} />} />;
}

export function RiskReportsPage() {
  return <EntityPage badge="Reports" title="Risk reports." copy="Enterprise Risk Brief, Risk Committee Pack, Control Effectiveness Report, Incident Summary and Appetite Breach Report." load={riskApi.listReports} create={riskApi.createReport} defaults={{ title: 'Enterprise Risk Brief', reportType: 'enterprise_risk_brief' }} fields={['title', 'reportType']} permission={PERMISSIONS.EXPORT_RISK_REPORT} render={(items) => <RiskReportsPanel items={items} />} />;
}

export function RiskCommitteeReviewsPage() {
  return <EntityPage badge="Committee" title="Risk committee reviews." copy="Formal committee review packets, agendas, linked risks, decisions and minutes for board-ready governance." load={riskApi.listCommitteeReviews} create={riskApi.createCommitteeReview} defaults={{ reviewTitle: '', committeeName: 'Risk Committee', meetingDate: '', chair: 'CRO', status: 'draft' }} fields={['reviewTitle', 'committeeName', 'meetingDate', 'chair', 'status']} permission={PERMISSIONS.UPDATE_RISK} render={(items) => <RiskCommitteeReviewPanel items={items} />} />;
}

export function RiskEvidencePage() {
  return <EntityPage badge="Evidence" title="Risk evidence links." copy="Evidence quality, source module, reviewer, review status and human review notes attached to enterprise risks." load={riskApi.listEvidenceLinks} create={riskApi.createEvidenceLink} defaults={{ evidenceTitle: '', evidenceType: 'document', evidenceQuality: 'high', sourceModule: 'Risk', reviewer: 'CRO', reviewStatus: 'reviewed' }} fields={['evidenceTitle', 'evidenceType', 'evidenceQuality', 'sourceModule', 'reviewer', 'reviewStatus']} permission={PERMISSIONS.UPDATE_RISK} render={(items) => <RiskEvidencePanel items={items} />} />;
}

export function RiskNotificationsPage() {
  return <EntityPage badge="Notifications" title="Executive risk notifications." copy="Queued executive updates for critical risks, appetite breaches, KRI breaches and board attention items." load={riskApi.listNotifications} create={riskApi.createNotification} defaults={{ title: '', targetRole: 'executive', severity: 'watch', status: 'queued' }} fields={['title', 'targetRole', 'severity', 'status']} permission={PERMISSIONS.UPDATE_RISK} render={(items) => <RiskNotificationPanel items={items} />} />;
}
