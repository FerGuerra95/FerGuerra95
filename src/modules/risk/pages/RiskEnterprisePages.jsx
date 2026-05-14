import React, { useEffect, useMemo, useState } from 'react';
import { Badge } from '../../../shared/components/ui/Badge.jsx';
import { PERMISSIONS, useAuth } from '../../../app/providers/AuthProvider.jsx';
import { riskApi } from '../services/riskApi.js';
import {
  BoardRiskReadinessPanel,
  ControlsLibraryPanel,
  IncidentLogPanel,
  KriTrackerPanel,
  MitigationPlansPanel,
  RiskAppetitePanel,
  RiskExecutiveWidget,
  RiskHeatmap,
  RiskRegisterTable,
  RiskReportsPanel,
  riskEnterpriseCss
} from '../components/RiskEnterpriseComponents.jsx';

function EntityPage({ badge, title, copy, load, create, defaults = {}, fields = [], render, permission = PERMISSIONS.CREATE_RISK }) {
  const { can } = useAuth();
  const canCreate = can(permission);
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(defaults);
  const [status, setStatus] = useState({ loading: true, error: null });
  const [filters, setFilters] = useState({ status: '', owner: '', category: '' });

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
    await create(form);
    setForm(defaults);
    await refresh();
  }

  const filtered = useMemo(() => items.filter((item) => {
    const statusOk = !filters.status || String(item.status || '').toLowerCase().includes(filters.status.toLowerCase());
    const ownerOk = !filters.owner || String(item.owner || '').toLowerCase().includes(filters.owner.toLowerCase());
    const categoryOk = !filters.category || String(item.category || item.controlType || item.metric || '').toLowerCase().includes(filters.category.toLowerCase());
    return statusOk && ownerOk && categoryOk;
  }), [items, filters]);

  return (
    <div className="page">
      <style>{riskEnterpriseCss}</style>
      <div className="risk-enterprise-page">
        <section className="risk-enterprise-hero">
          <Badge>{badge}</Badge>
          <h1 className="risk-enterprise-title">{title}</h1>
          <p className="risk-enterprise-copy">{copy}</p>
        </section>
        <div className="risk-enterprise-toolbar">
          <label className="risk-enterprise-field"><span>Status filter</span><input aria-label="Status filter" className="risk-enterprise-input" value={filters.status} onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))} /></label>
          <label className="risk-enterprise-field"><span>Owner filter</span><input aria-label="Owner filter" className="risk-enterprise-input" value={filters.owner} onChange={(event) => setFilters((current) => ({ ...current, owner: event.target.value }))} /></label>
          <label className="risk-enterprise-field"><span>Category filter</span><input aria-label="Category filter" className="risk-enterprise-input" value={filters.category} onChange={(event) => setFilters((current) => ({ ...current, category: event.target.value }))} /></label>
        </div>
        {create ? (
          <form className="risk-enterprise-toolbar" onSubmit={submit}>
            {fields.map((field) => (
              <label className="risk-enterprise-field" key={field}>
                <span>{field}</span>
                <input aria-label={field} className="risk-enterprise-input" disabled={!canCreate} value={form[field] || ''} onChange={(event) => setForm((current) => ({ ...current, [field]: event.target.value }))} />
              </label>
            ))}
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
        <section className="risk-enterprise-hero">
          <Badge>Enterprise Risk</Badge>
          <h1 className="risk-enterprise-title">Risk command center.</h1>
          <p className="risk-enterprise-copy">Risk register, heatmap, controls, mitigations, incidents, KRIs, risk appetite, reporting and executive signals. Human review required.</p>
        </section>
        {status.loading ? <div className="risk-enterprise-empty">Loading Risk dashboard.</div> : null}
        {status.error ? <div className="risk-enterprise-empty">Risk dashboard could not be loaded.</div> : null}
        <RiskExecutiveWidget summary={dashboard} />
        <section className="risk-enterprise-grid-two">
          <RiskHeatmap items={dashboard?.risks || []} />
          <BoardRiskReadinessPanel metrics={metrics} />
        </section>
        <RiskRegisterTable items={dashboard?.risks || []} />
        <MitigationPlansPanel items={dashboard?.mitigations || []} />
      </div>
    </div>
  );
}

export function RiskRegisterPage() {
  return <EntityPage badge="Register" title="Enterprise risk register." copy="Inherent severity, likelihood, impact, residual risk, owners, status, mitigations, linked module and review date." load={riskApi.listRegister} create={riskApi.createRisk} defaults={{ title: '', category: 'operational', inherentSeverity: 'high', residualRisk: 'medium', owner: 'Risk Owner', status: 'open' }} fields={['title', 'category', 'inherentSeverity', 'residualRisk', 'owner', 'status']} render={(items) => <RiskRegisterTable items={items} />} />;
}

export function RiskHeatmapPage() {
  return <EntityPage badge="Heatmap" title="Risk heatmap." copy="Severity vs likelihood with category and owner filters, showing inherent and residual posture." load={riskApi.listRegister} create={null} render={(items) => <RiskHeatmap items={items} />} />;
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
