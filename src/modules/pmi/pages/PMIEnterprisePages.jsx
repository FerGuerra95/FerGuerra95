import React, { useEffect, useState } from 'react';
import { Badge } from '../../../shared/components/ui/Badge.jsx';
import { Card } from '../../../shared/components/ui/Card.jsx';
import { PERMISSIONS, useAuth } from '../../../app/providers/AuthProvider.jsx';
import { pmiApi } from '../services/pmiApi.js';
import {
  DayOneReadinessPanel,
  EnterpriseTable,
  HundredDayPlanTimeline,
  IntegrationCommitteePack,
  IntegrationPhaseTimeline,
  IntegrationRiskMatrix,
  MilestoneTracker,
  OperatingModelPanel,
  PMIExecutiveWidget,
  PeopleCulturePanel,
  SynergyInitiativesTable,
  TechnologyIntegrationPanel,
  TransitionServicesTable,
  pmiEnterpriseCss
} from '../components/PMIEnterpriseComponents.jsx';

function EntityPage({
  badge,
  title,
  copy,
  load,
  create,
  defaults = {},
  fields = [],
  render,
  permission = PERMISSIONS.CREATE_PMI
}) {
  const { can } = useAuth();
  const canCreate = can(permission);
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(defaults);
  const [status, setStatus] = useState({ loading: true, error: null });

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
    if (!canCreate) return;
    await create(form);
    setForm(defaults);
    await refresh();
  }

  return (
    <div className="page">
      <style>{pmiEnterpriseCss}</style>
      <div className="pmi-enterprise-page">
        <section className="pmi-enterprise-hero">
          <Badge>{badge}</Badge>
          <h1 className="pmi-enterprise-title">{title}</h1>
          <p className="pmi-enterprise-copy">{copy}</p>
        </section>
        <form className="pmi-enterprise-toolbar" onSubmit={submit}>
          {fields.map((field) => (
            <label className="pmi-enterprise-field" key={field}>
              <span>{field}</span>
              <input
                aria-label={field}
                className="pmi-enterprise-input"
                disabled={!canCreate}
                value={form[field] || ''}
                onChange={(event) => setForm((current) => ({ ...current, [field]: event.target.value }))}
              />
            </label>
          ))}
          <button className="pmi-enterprise-button" disabled={!canCreate}>
            {canCreate ? 'Create' : 'Read only'}
          </button>
        </form>
        {status.loading ? <div className="pmi-enterprise-empty">Loading records.</div> : null}
        {status.error ? <div className="pmi-enterprise-empty">Records could not be loaded.</div> : null}
        {render ? render(items) : <SimpleCards items={items} />}
      </div>
    </div>
  );
}

function SimpleCards({ items }) {
  if (items.length === 0) return <div className="pmi-enterprise-empty">No records available.</div>;
  return (
    <section className="pmi-enterprise-grid-two">
      {items.map((item) => (
        <Card className="pmi-enterprise-panel" key={item.id}>
          <h3>{item.title || item.id}</h3>
          <p className="muted">{item.status || item.owner || 'active'}</p>
        </Card>
      ))}
    </section>
  );
}

export function PMIDashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [status, setStatus] = useState({ loading: true, error: null });

  useEffect(() => {
    pmiApi.getDashboard()
      .then((data) => {
        setDashboard(data);
        setStatus({ loading: false, error: null });
      })
      .catch((error) => setStatus({ loading: false, error }));
  }, []);

  const metrics = dashboard?.metrics || {};
  return (
    <div className="page">
      <style>{pmiEnterpriseCss}</style>
      <div className="pmi-enterprise-page">
        <section className="pmi-enterprise-hero">
          <Badge>PMI & Synergies Enterprise</Badge>
          <h1 className="pmi-enterprise-title">Post-merger integration command layer.</h1>
          <p className="pmi-enterprise-copy">Programs, synergy capture, Day 1 readiness, 30-60-90 execution, risks, TSA, operating model, people, technology and committee reporting.</p>
        </section>
        {status.loading ? <div className="pmi-enterprise-empty">Loading PMI dashboard.</div> : null}
        {status.error ? <div className="pmi-enterprise-empty">PMI dashboard could not be loaded.</div> : null}
        <PMIExecutiveWidget summary={dashboard} />
        <IntegrationPhaseTimeline phase={metrics.integrationPhase} />
        <section className="pmi-enterprise-grid-two">
          <Card className="pmi-enterprise-panel">
            <h3>Executive posture</h3>
            <p className="muted">{metrics.requiresExecutiveAttention ? 'Executive attention required. Human review should validate blockers, value leakage and committee decisions.' : 'Integration posture is within operating tolerance. Human review remains required before formal committee use.'}</p>
            <Badge>{metrics.pmiStatus || 'insufficient_data'}</Badge>
          </Card>
          <Card className="pmi-enterprise-panel">
            <h3>Value capture</h3>
            <p className="muted">Captured {Number(metrics.capturedSynergy || 0).toLocaleString()} against target {Number(metrics.totalSynergyTarget || 0).toLocaleString()}.</p>
            <Badge>{metrics.valueCaptureStatus || 'building'}</Badge>
          </Card>
        </section>
      </div>
    </div>
  );
}

export function PMIProgramsPage() {
  return (
    <EntityPage
      badge="Programs"
      title="Integration programs."
      copy="Program ownership, acquisition linkage, strategic rationale, integration phase, target operating model and value creation thesis."
      load={pmiApi.listPrograms}
      create={pmiApi.createProgram}
      defaults={{ title: '', acquisitionName: '', owner: '', integrationPhase: 'planning' }}
      fields={['title', 'acquisitionName', 'owner', 'integrationPhase']}
      render={(items) => <EnterpriseTable title="Programs" items={items} columns={[
        { key: 'title', label: 'Program' },
        { key: 'integrationPhase', label: 'Phase' },
        { key: 'owner', label: 'Owner' },
        { key: 'status', label: 'Status' },
        { key: 'targetCompletionDate', label: 'Target' }
      ]} />}
    />
  );
}

export function PMIProgramDetailPage() {
  return <PMIProgramsPage />;
}

export function SynergyTrackerPage() {
  return (
    <EntityPage
      badge="Synergies"
      title="Synergy capture tracker."
      copy="Target, captured and annualized value, finance validation, dependencies and value leakage risk."
      load={pmiApi.listSynergies}
      create={pmiApi.createSynergy}
      defaults={{ title: '', synergyType: 'cost', targetValue: 0, owner: '' }}
      fields={['title', 'synergyType', 'targetValue', 'owner']}
      permission={PERMISSIONS.MANAGE_PMI_SYNERGY}
      render={(items) => <SynergyInitiativesTable items={items} />}
    />
  );
}

export function IntegrationMilestonesPage() {
  return (
    <EntityPage
      badge="Milestones"
      title="Integration milestone tracker."
      copy="Category, owner, due date, blockers, escalation and critical path control."
      load={pmiApi.listMilestones}
      create={pmiApi.createMilestone}
      defaults={{ title: '', category: 'operations', owner: '', dueDate: '' }}
      fields={['title', 'category', 'owner', 'dueDate']}
      render={(items) => <MilestoneTracker items={items} />}
    />
  );
}

export function IntegrationRisksPage() {
  return (
    <EntityPage
      badge="Risks"
      title="Integration risk register."
      copy="Risk area, severity, likelihood, impact, mitigation, residual risk and escalation status."
      load={pmiApi.listRisks}
      create={pmiApi.createRisk}
      defaults={{ title: '', riskArea: 'operations', severity: 'medium', owner: '' }}
      fields={['title', 'riskArea', 'severity', 'owner']}
      permission={PERMISSIONS.MANAGE_PMI_RISK}
      render={(items) => <IntegrationRiskMatrix items={items} />}
    />
  );
}

export function DayOneReadinessPage() {
  return (
    <EntityPage
      badge="Day 1"
      title="Day 1 readiness."
      copy="Legal close, communications, finance handover, HR, IT access, suppliers, compliance, governance and operating continuity."
      load={pmiApi.listDayOne}
      create={pmiApi.createDayOne}
      defaults={{ title: '', checklistArea: 'governance', owner: '', readinessScore: 0 }}
      fields={['title', 'checklistArea', 'owner', 'readinessScore']}
      permission={PERMISSIONS.MANAGE_PMI_DAY1}
      render={(items) => <DayOneReadinessPanel items={items} />}
    />
  );
}

export function HundredDayPlanPage() {
  return (
    <EntityPage
      badge="100-Day"
      title="30-60-90-100 integration plan."
      copy="Priorities, completed actions, delayed actions, blockers, value capture progress and committee decisions required."
      load={pmiApi.listHundredDay}
      create={pmiApi.createHundredDay}
      defaults={{ title: '', period: 'day_30', owner: '', valueCaptureProgress: 0 }}
      fields={['title', 'period', 'owner', 'valueCaptureProgress']}
      render={(items) => <HundredDayPlanTimeline items={items} />}
    />
  );
}

export function TransitionServicesPage() {
  return (
    <EntityPage
      badge="TSA"
      title="Transition services."
      copy="Provider, receiver, service area, dates, cost, risk, owner, exit plan and status."
      load={pmiApi.listTransitionServices}
      create={pmiApi.createTransitionService}
      defaults={{ title: '', provider: '', receiver: '', risk: 'medium' }}
      fields={['title', 'provider', 'receiver', 'risk']}
      render={(items) => <TransitionServicesTable items={items} />}
    />
  );
}

export function OperatingModelPage() {
  return (
    <EntityPage
      badge="Operating Model"
      title="Target operating model."
      copy="Org dependencies, systems dependencies, process harmonization, reporting lines, decision rights and governance cadence."
      load={pmiApi.listOperatingModel}
      create={pmiApi.createOperatingModel}
      defaults={{ title: '', owner: '', governanceCadence: '' }}
      fields={['title', 'owner', 'governanceCadence']}
      render={(items) => <OperatingModelPanel items={items} />}
    />
  );
}

export function PeopleCulturePage() {
  return (
    <EntityPage
      badge="People"
      title="People and culture."
      copy="Key people risk, retention, communications, labor dependencies and leadership alignment."
      load={pmiApi.listPeopleCulture}
      create={pmiApi.createPeopleCulture}
      defaults={{ title: '', owner: '', keyPeopleRisk: 'medium' }}
      fields={['title', 'owner', 'keyPeopleRisk']}
      render={(items) => <PeopleCulturePanel items={items} />}
    />
  );
}

export function TechnologyIntegrationPage() {
  return (
    <EntityPage
      badge="Technology"
      title="Technology integration."
      copy="Systems inventory, integration approach, cyber dependencies, data migration risk and TSA technology dependency."
      load={pmiApi.listTechnology}
      create={pmiApi.createTechnology}
      defaults={{ title: '', owner: 'Technology Lead', dataMigrationRisk: 'medium' }}
      fields={['title', 'owner', 'dataMigrationRisk']}
      render={(items) => <TechnologyIntegrationPanel items={items} />}
    />
  );
}

export function PMIReportsPage() {
  return (
    <EntityPage
      badge="Reports"
      title="PMI executive reporting."
      copy="Executive integration memo, Day 1 pack, 30-60-90 plan, value capture report, risk brief, committee pack and TSA exit summary."
      load={pmiApi.listReports}
      create={pmiApi.createReport}
      defaults={{ title: '', reportType: 'pmi_executive_integration_memo' }}
      fields={['title', 'reportType']}
      permission={PERMISSIONS.EXPORT_PMI_REPORT}
      render={(items) => <IntegrationCommitteePack items={items} />}
    />
  );
}
