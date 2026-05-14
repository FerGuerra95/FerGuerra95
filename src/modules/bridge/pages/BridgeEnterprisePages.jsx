import React, { useEffect, useState } from 'react';
import { Badge } from '../../../shared/components/ui/Badge.jsx';
import { Card } from '../../../shared/components/ui/Card.jsx';
import { PERMISSIONS, useAuth } from '../../../app/providers/AuthProvider.jsx';
import { bridgeApi } from '../services/bridgeApi.js';
import {
  AttentionQueueTable,
  BridgeExecutiveWidget,
  ConflictSeverityBadge,
  CrossModuleSignalFeed,
  DependencyMapGraph,
  EnterpriseTable,
  EvidenceLinkPanel,
  ModuleHealthMap,
  bridgeEnterpriseCss
} from '../components/BridgeEnterpriseComponents.jsx';

function EntityPage({ badge, title, copy, load, create, defaults = {}, fields = [], render, permission = PERMISSIONS.CREATE_BRIDGE_SIGNAL }) {
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
    if (!canCreate || !create) return;
    await create(form);
    setForm(defaults);
    await refresh();
  }

  return (
    <div className="page">
      <style>{bridgeEnterpriseCss}</style>
      <div className="bridge-enterprise-page">
        <section className="bridge-enterprise-hero">
          <Badge>{badge}</Badge>
          <h1 className="bridge-enterprise-title">{title}</h1>
          <p className="bridge-enterprise-copy">{copy}</p>
        </section>
        {create ? (
          <form className="bridge-enterprise-toolbar" onSubmit={submit}>
            {fields.map((field) => (
              <label className="bridge-enterprise-field" key={field}>
                <span>{field}</span>
                <input
                  aria-label={field}
                  className="bridge-enterprise-input"
                  disabled={!canCreate}
                  value={form[field] || ''}
                  onChange={(event) => setForm((current) => ({ ...current, [field]: event.target.value }))}
                />
              </label>
            ))}
            <button className="bridge-enterprise-button" disabled={!canCreate}>
              {canCreate ? 'Create' : 'Read only'}
            </button>
          </form>
        ) : null}
        {status.loading ? <div className="bridge-enterprise-empty">Loading records.</div> : null}
        {status.error ? <div className="bridge-enterprise-empty">Records could not be loaded.</div> : null}
        {render ? render(items, refresh) : <SimpleCards items={items} />}
      </div>
    </div>
  );
}

function SimpleCards({ items }) {
  if (items.length === 0) return <div className="bridge-enterprise-empty">No records available.</div>;
  return (
    <section className="bridge-enterprise-grid-two">
      {items.map((item) => (
        <Card className="bridge-enterprise-panel" key={item.id}>
          <h3>{item.title || item.id}</h3>
          <p className="muted">{item.status || item.owner || 'active'}</p>
        </Card>
      ))}
    </section>
  );
}

export function BridgeDashboardPage() {
  const { can } = useAuth();
  const canUpdate = can(PERMISSIONS.UPDATE_BRIDGE_SIGNAL);
  const [dashboard, setDashboard] = useState(null);
  const [status, setStatus] = useState({ loading: true, error: null });

  async function refresh() {
    try {
      setDashboard(await bridgeApi.getDashboard());
      setStatus({ loading: false, error: null });
    } catch (error) {
      setStatus({ loading: false, error });
    }
  }

  useEffect(() => { refresh(); }, []);

  async function recalculate() {
    if (!canUpdate) return;
    await bridgeApi.recalculate();
    await refresh();
  }

  const metrics = dashboard?.metrics || {};
  return (
    <div className="page">
      <style>{bridgeEnterpriseCss}</style>
      <div className="bridge-enterprise-page">
        <section className="bridge-enterprise-hero">
          <Badge>Enterprise Bridge</Badge>
          <h1 className="bridge-enterprise-title">Cross-module intelligence layer.</h1>
          <p className="bridge-enterprise-copy">Signals, dependencies, conflicts, evidence links and executive attention queue across M&A, Compliance, Funding, Governance, PMI, Risk, Reporting, Strategy and CEO Overview.</p>
          <div className="bridge-enterprise-toolbar" style={{ marginTop: 16 }}>
            <button className="bridge-enterprise-button" disabled={!canUpdate} onClick={recalculate}>Recalculate signals</button>
            <Badge>{metrics.humanReviewPosture || 'human_review_required'}</Badge>
          </div>
        </section>
        {status.loading ? <div className="bridge-enterprise-empty">Loading Bridge dashboard.</div> : null}
        {status.error ? <div className="bridge-enterprise-empty">Bridge dashboard could not be loaded.</div> : null}
        <BridgeExecutiveWidget summary={dashboard} />
        <section className="bridge-enterprise-grid-two">
          <ModuleHealthMap metrics={metrics} />
          <Card className="bridge-enterprise-panel">
            <h3>Recommended actions</h3>
            {(metrics.topRecommendedActions || []).length === 0 ? <div className="bridge-enterprise-empty">No executive actions currently queued.</div> : null}
            {(metrics.topRecommendedActions || []).map((item) => <p className="muted" key={item}>{item}</p>)}
          </Card>
        </section>
        <CrossModuleSignalFeed items={dashboard?.signals || []} readOnly />
        <AttentionQueueTable items={dashboard?.attentionQueue || []} />
      </div>
    </div>
  );
}

export function BridgeSignalsPage() {
  return (
    <EntityPage
      badge="Signals"
      title="Cross-module signal control."
      copy="Source, target, severity, recommended action, evidence, lifecycle and human review status."
      load={bridgeApi.listSignals}
      create={bridgeApi.createSignal}
      defaults={{ title: '', sourceModule: 'M&A', targetModule: 'Funding', signalType: 'cross_module_signal', severity: 'watch' }}
      fields={['title', 'sourceModule', 'targetModule', 'signalType', 'severity']}
      render={(items, refresh) => (
        <CrossModuleSignalFeed
          items={items}
          onAcknowledge={async (item) => { await bridgeApi.acknowledgeSignal(item.id); await refresh(); }}
          onResolve={async (item) => { await bridgeApi.resolveSignal(item.id); await refresh(); }}
          onDismiss={async (item) => { await bridgeApi.dismissSignal(item.id, { reason: 'Dismissed after human review.' }); await refresh(); }}
        />
      )}
    />
  );
}

export function DependencyMapPage() {
  return (
    <EntityPage
      badge="Dependencies"
      title="Dependency map."
      copy="Dependencies between modules, source and target entities, blocking flags, owners and resolution notes."
      load={bridgeApi.listDependencies}
      create={bridgeApi.createDependency}
      defaults={{ sourceModule: 'Governance', targetModule: 'PMI', dependencyType: 'approval', owner: 'Executive Office' }}
      fields={['sourceModule', 'targetModule', 'dependencyType', 'owner']}
      permission={PERMISSIONS.MANAGE_BRIDGE_DEPENDENCY}
      render={(items) => <DependencyMapGraph items={items} />}
    />
  );
}

export function ConflictRegisterPage() {
  return (
    <EntityPage
      badge="Conflicts"
      title="Conflict register."
      copy="Funding, compliance, M&A, governance, PMI, reporting and strategy conflicts requiring human review."
      load={bridgeApi.listConflicts}
      create={bridgeApi.createConflict}
      defaults={{ title: '', conflictType: 'cross_module_conflict', sourceModule: 'Funding', targetModule: 'Compliance', severity: 'risk' }}
      fields={['title', 'conflictType', 'sourceModule', 'targetModule', 'severity']}
      permission={PERMISSIONS.MANAGE_BRIDGE_DEPENDENCY}
      render={(items) => <EnterpriseTable title="Conflicts" items={items} columns={[
        { key: 'title', label: 'Conflict' },
        { key: 'severity', label: 'Severity', render: (item) => <ConflictSeverityBadge severity={item.severity} /> },
        { key: 'sourceModule', label: 'Source' },
        { key: 'targetModule', label: 'Target' },
        { key: 'status', label: 'Status' }
      ]} />}
    />
  );
}

export function ExecutiveAttentionQueuePage() {
  return (
    <EntityPage
      badge="Attention"
      title="Executive attention queue."
      copy="Prioritized critical signals, blocked items, board-required actions and cross-module conflicts."
      load={bridgeApi.listAttentionQueue}
      create={null}
      render={(items) => <AttentionQueueTable items={items} />}
    />
  );
}

export function BridgeReportsPage() {
  return (
    <EntityPage
      badge="Reports"
      title="Bridge reports."
      copy="Cross-module executive brief, dependency map report, attention queue, conflicts brief, board signal pack and CEO Bridge snapshot."
      load={bridgeApi.listReports}
      create={bridgeApi.createReport}
      defaults={{ title: '', reportType: 'cross_module_executive_brief' }}
      fields={['title', 'reportType']}
      permission={PERMISSIONS.EXPORT_BRIDGE_REPORT}
    />
  );
}

export function BridgeSnapshotPage() {
  return (
    <EntityPage
      badge="Snapshots"
      title="CEO Bridge snapshots."
      copy="Snapshot generation for executive traceability. Decision support only; human review required."
      load={bridgeApi.listSnapshots}
      create={bridgeApi.createSnapshot}
      defaults={{ title: 'CEO Bridge Snapshot', snapshotType: 'ceo_bridge_snapshot' }}
      fields={['title', 'snapshotType']}
      permission={PERMISSIONS.EXPORT_BRIDGE_REPORT}
      render={(items) => (
        <>
          <SimpleCards items={items} />
          <EvidenceLinkPanel items={[]} />
        </>
      )}
    />
  );
}
