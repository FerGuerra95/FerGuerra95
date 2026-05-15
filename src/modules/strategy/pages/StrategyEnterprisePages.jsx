import React, { useEffect, useMemo, useState } from 'react';
import { Badge } from '../../../shared/components/ui/Badge.jsx';
import { PERMISSIONS, useAuth } from '../../../app/providers/AuthProvider.jsx';
import { strategyApi } from '../services/strategyApi.js';
import {
  InitiativesTable,
  ObjectivesTable,
  StrategyExecutiveWidget,
  StrategyStatusBadge,
  StrategyTable,
  strategyEnterpriseCss
} from '../components/StrategyEnterpriseComponents.jsx';

function EntityPage({ badge, title, copy, load, create, defaults = {}, fields = [], render, permission = PERMISSIONS.CREATE_STRATEGY }) {
  const { can } = useAuth();
  const canCreate = can(permission);
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(defaults);
  const [filters, setFilters] = useState({ status: '', owner: '', priority: '' });
  const [state, setState] = useState({ loading: true, error: null });

  async function refresh() {
    try { setItems(await load()); setState({ loading: false, error: null }); }
    catch (error) { setState({ loading: false, error }); }
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
    const priorityOk = !filters.priority || String(item.priority || item.impact || '').toLowerCase().includes(filters.priority.toLowerCase());
    return statusOk && ownerOk && priorityOk;
  }), [items, filters]);

  return (
    <div className="page">
      <style>{strategyEnterpriseCss}</style>
      <div className="strategy-page">
        <section className="strategy-hero ceos-ws-hero">
          <Badge>{badge}</Badge>
          <h1 className="strategy-title">{title}</h1>
          <p className="strategy-copy">{copy}</p>
        </section>
        <div className="strategy-toolbar">
          <label className="strategy-field"><span>Status filter</span><input aria-label="Status filter" className="strategy-input" value={filters.status} onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))} /></label>
          <label className="strategy-field"><span>Owner filter</span><input aria-label="Owner filter" className="strategy-input" value={filters.owner} onChange={(event) => setFilters((current) => ({ ...current, owner: event.target.value }))} /></label>
          <label className="strategy-field"><span>Priority filter</span><input aria-label="Priority filter" className="strategy-input" value={filters.priority} onChange={(event) => setFilters((current) => ({ ...current, priority: event.target.value }))} /></label>
        </div>
        {create ? (
          <form className="strategy-toolbar" onSubmit={submit}>
            {fields.map((field) => <label className="strategy-field" key={field}><span>{field}</span><input aria-label={field} className="strategy-input" disabled={!canCreate} value={form[field] || ''} onChange={(event) => setForm((current) => ({ ...current, [field]: event.target.value }))} /></label>)}
            <button className="strategy-button" disabled={!canCreate}>{canCreate ? 'Create' : 'Read only'}</button>
          </form>
        ) : null}
        {state.loading ? <div className="strategy-empty">Loading strategy records.</div> : null}
        {state.error ? <div className="strategy-empty">Strategy records could not be loaded.</div> : null}
        {render(filtered)}
      </div>
    </div>
  );
}

export function StrategyDashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [state, setState] = useState({ loading: true, error: null });
  useEffect(() => {
    strategyApi.getDashboard().then((data) => { setDashboard(data); setState({ loading: false, error: null }); }).catch((error) => setState({ loading: false, error }));
  }, []);
  return (
    <div className="page">
      <style>{strategyEnterpriseCss}</style>
      <div className="strategy-page">
        <section className="strategy-hero ceos-ws-hero">
          <Badge>Enterprise Strategy</Badge>
          <h1 className="strategy-title">Strategic execution command center.</h1>
          <p className="strategy-copy">Objectives, initiatives, scenarios, competitive notes, strategic risks and board-ready strategy reporting. Decision support only.</p>
        </section>
        {state.loading ? <div className="strategy-empty">Loading Strategy dashboard.</div> : null}
        {state.error ? <div className="strategy-empty">Strategy dashboard could not be loaded.</div> : null}
        <StrategyExecutiveWidget summary={dashboard} />
        <section className="strategy-grid-two">
          <ObjectivesTable items={dashboard?.objectives || []} />
          <InitiativesTable items={dashboard?.initiatives || []} />
        </section>
      </div>
    </div>
  );
}

export const StrategicObjectivesPage = () => <EntityPage badge="Objectives" title="Strategic objectives." copy="Objectives by horizon, priority, status, target metric, linked module and board decision." load={strategyApi.listObjectives} create={strategyApi.createObjective} defaults={{ title: '', owner: 'Strategy Office', horizon: '12_months', priority: 'high', status: 'active', targetMetric: 100, currentMetric: 0 }} fields={['title', 'owner', 'horizon', 'priority', 'status', 'targetMetric', 'currentMetric']} render={(items) => <ObjectivesTable items={items} />} />;
export const StrategicInitiativesPage = () => <EntityPage badge="Initiatives" title="Strategic initiatives." copy="Execution progress, blockers, dependencies, capital need, funding linkage and risk linkage." load={strategyApi.listInitiatives} create={strategyApi.createInitiative} defaults={{ title: '', owner: 'Strategy Office', dueDate: '', status: 'active', progress: 0, capitalNeed: 0 }} fields={['title', 'owner', 'dueDate', 'status', 'progress', 'capitalNeed']} render={(items) => <InitiativesTable items={items} />} />;
export const StrategicScenariosPage = () => <EntityPage badge="Scenarios" title="Strategic scenarios." copy="Assumptions, upside, downside, recommended action, capital impact, risk impact, probability and confidence." load={strategyApi.listScenarios} create={strategyApi.createScenario} defaults={{ title: '', upside: '', downside: '', recommendedAction: '', capitalImpact: 0, riskImpact: 'medium', probability: 50, confidence: 60 }} fields={['title', 'upside', 'downside', 'recommendedAction', 'capitalImpact', 'riskImpact', 'probability', 'confidence']} render={(items) => <StrategyTable title="Strategic scenarios" items={items} columns={[{ key: 'title', label: 'Scenario' }, { key: 'capitalImpact', label: 'Capital impact' }, { key: 'riskImpact', label: 'Risk' }, { key: 'probability', label: 'Probability' }, { key: 'confidence', label: 'Confidence' }]} />} />;
export const StrategicMarketNotesPage = () => <EntityPage badge="Market" title="Market and competitive notes." copy="Market, competitor, signal, implication, source evidence and confidence." load={strategyApi.listMarketNotes} create={strategyApi.createMarketNote} defaults={{ market: '', competitor: '', signal: '', implication: '', sourceEvidence: '', confidence: 60 }} fields={['market', 'competitor', 'signal', 'implication', 'sourceEvidence', 'confidence']} render={(items) => <StrategyTable title="Market notes" items={items} columns={[{ key: 'market', label: 'Market' }, { key: 'competitor', label: 'Competitor' }, { key: 'signal', label: 'Signal' }, { key: 'implication', label: 'Implication' }, { key: 'confidence', label: 'Confidence' }]} />} />;
export const StrategicRisksPage = () => <EntityPage badge="Risks" title="Strategic risks." copy="Strategic risk register, impact, mitigation and linked enterprise risk." load={strategyApi.listRisks} create={strategyApi.createRisk} defaults={{ risk: '', impact: 'medium', mitigation: '', status: 'open' }} fields={['risk', 'impact', 'mitigation', 'status']} render={(items) => <StrategyTable title="Strategic risks" items={items} columns={[{ key: 'risk', label: 'Risk' }, { key: 'impact', label: 'Impact', render: (item) => <StrategyStatusBadge status={item.impact} /> }, { key: 'mitigation', label: 'Mitigation' }, { key: 'status', label: 'Status', render: (item) => <StrategyStatusBadge status={item.status} /> }]} />} />;
export const StrategyReportsPage = () => <EntityPage badge="Reports" title="Strategy reports." copy="Strategy Board Memo, Strategic Scenario Pack, Strategic Execution Report and Capital Allocation Memo." load={strategyApi.listReports} create={strategyApi.createReport} defaults={{ title: 'Strategy Board Memo', reportType: 'strategy_board_memo' }} fields={['title', 'reportType']} permission={PERMISSIONS.EXPORT_STRATEGY} render={(items) => <StrategyTable title="Strategy reports" items={items} columns={[{ key: 'title', label: 'Report' }, { key: 'reportType', label: 'Type' }, { key: 'status', label: 'Status', render: (item) => <StrategyStatusBadge status={item.status} /> }, { key: 'createdAt', label: 'Generated' }]} />} />;
