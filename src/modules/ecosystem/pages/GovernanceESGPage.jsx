import React, { useEffect, useMemo, useState } from 'react';
import {
  BarChart3,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  Landmark,
  Plus,
  Scale,
  ShieldCheck,
  Target
} from 'lucide-react';
import { Card } from '../../../shared/components/ui/Card.jsx';
import { Badge } from '../../../shared/components/ui/Badge.jsx';
import { useAuth } from '../../../app/providers/AuthProvider.jsx';
import { governanceApi } from '../services/governanceApi.js';

const DEMO_DECISIONS = [
  {
    id: 'demo-decision-board',
    title: 'Approve FY26 financing and ESG reporting cadence',
    category: 'Board',
    status: 'open',
    owner: 'Board Secretary',
    dueDate: '2026-06-30',
    evidenceStatus: 'ready',
    boardApprovalRequired: true
  },
  {
    id: 'demo-decision-risk',
    title: 'Ratify supplier risk escalation policy',
    category: 'Risk',
    status: 'approved',
    owner: 'Compliance Lead',
    dueDate: '2026-05-31',
    evidenceStatus: 'approved',
    boardApprovalRequired: false
  }
];

const DEMO_CONTROLS = [
  {
    id: 'demo-control-board',
    name: 'Board decision ledger',
    domain: 'Board',
    status: 'active',
    owner: 'Board Secretary',
    effectiveness: 82,
    reviewCadence: 'monthly'
  },
  {
    id: 'demo-control-esg',
    name: 'ESG evidence review',
    domain: 'ESG',
    status: 'active',
    owner: 'Compliance Lead',
    effectiveness: 74,
    reviewCadence: 'quarterly'
  }
];

const DEMO_ESG = [
  {
    id: 'demo-esg-governance',
    metric: 'Board evidence readiness',
    pillar: 'Governance',
    value: 78,
    target: 100,
    status: 'tracking',
    evidenceStatus: 'ready',
    reportingPeriod: 'FY26'
  },
  {
    id: 'demo-esg-supply-chain',
    metric: 'Supplier ESG risk coverage',
    pillar: 'Social',
    value: 64,
    target: 100,
    status: 'tracking',
    evidenceStatus: 'pending',
    reportingPeriod: 'FY26'
  }
];

const governanceCss = `
  .governance-page {
    width: min(1540px, 100%);
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 34px;
  }

  .governance-hero {
    min-height: 500px;
    position: relative;
    overflow: hidden;
    border-radius: 38px;
    padding: 44px;
    border: 1px solid rgba(148, 163, 184, 0.18);
    background:
      radial-gradient(circle at 8% 2%, rgba(14, 165, 233, 0.34), transparent 30%),
      radial-gradient(circle at 88% 8%, rgba(16, 185, 129, 0.16), transparent 27%),
      linear-gradient(135deg, rgba(2, 6, 23, 0.99), rgba(15, 23, 42, 0.97));
    box-shadow: 0 38px 120px rgba(0, 0, 0, 0.42), inset 0 1px 0 rgba(255,255,255,0.055);
  }

  .governance-hero::before {
    content: "";
    position: absolute;
    inset: 0;
    background:
      linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px);
    background-size: 50px 50px;
    mask-image: linear-gradient(to bottom, rgba(0,0,0,0.9), transparent 82%);
    pointer-events: none;
  }

  .governance-hero-layout {
    position: relative;
    z-index: 1;
    min-height: 420px;
    display: grid;
    grid-template-columns: minmax(0, 1.08fr) minmax(360px, 0.92fr);
    gap: 36px;
    align-items: center;
  }

  .governance-badge-row,
  .governance-toolbar {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    align-items: center;
  }

  .governance-title {
    margin: 0;
    max-width: 940px;
    font-size: clamp(40px, 4.8vw, 68px);
    line-height: 0.94;
    letter-spacing: -0.075em;
  }

  .governance-title span {
    display: block;
    margin-top: 9px;
    color: rgba(226, 232, 240, 0.68);
  }

  .governance-copy {
    max-width: 850px;
    margin: 28px 0 0;
    font-size: 17px;
    line-height: 1.82;
    color: rgba(203, 213, 225, 0.86);
  }

  .governance-grid {
    display: grid;
    gap: 24px;
  }

  .governance-grid-four {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .governance-grid-two {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .governance-panel,
  .governance-kpi,
  .governance-row-card,
  .governance-signal-card {
    border: 1px solid rgba(148, 163, 184, 0.16);
    border-radius: 28px;
    padding: 24px;
    background: linear-gradient(135deg, rgba(255,255,255,0.064), rgba(255,255,255,0.022)), rgba(15, 23, 42, 0.64);
    box-shadow: 0 24px 70px rgba(0, 0, 0, 0.21), inset 0 1px 0 rgba(255,255,255,0.035);
  }

  .governance-signal-card {
    backdrop-filter: blur(22px);
  }

  .governance-panel-head,
  .governance-card-head {
    display: flex;
    justify-content: space-between;
    gap: 18px;
    align-items: flex-start;
  }

  .governance-icon {
    display: grid;
    place-items: center;
    width: 46px;
    height: 46px;
    border-radius: 18px;
    background: rgba(14, 165, 233, 0.14);
    border: 1px solid rgba(125, 211, 252, 0.24);
    flex: 0 0 auto;
  }

  .governance-kicker {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
    font-size: 11px;
    line-height: 1;
    text-transform: uppercase;
    letter-spacing: 0.17em;
    color: rgba(148, 163, 184, 0.96);
  }

  .governance-panel-title,
  .governance-card-title {
    margin: 0;
    letter-spacing: -0.045em;
  }

  .governance-score {
    margin-top: 22px;
    padding: 22px;
    border-radius: 26px;
    background: rgba(255,255,255,0.047);
    border: 1px solid rgba(255,255,255,0.085);
  }

  .governance-score strong,
  .governance-kpi-value {
    display: block;
    font-size: 36px;
    line-height: 1;
    letter-spacing: -0.06em;
    color: #fff;
    font-weight: 850;
  }

  .governance-mini-row,
  .governance-control-row {
    display: flex;
    justify-content: space-between;
    gap: 14px;
    padding: 12px 0;
    border-top: 1px solid rgba(148, 163, 184, 0.13);
  }

  .governance-mini-row strong,
  .governance-control-row strong {
    text-align: right;
    overflow-wrap: anywhere;
  }

  .governance-form {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 0.8fr) auto;
    gap: 12px;
    align-items: center;
  }

  .governance-input,
  .governance-select {
    width: 100%;
    min-height: 40px;
    border-radius: 14px;
    border: 1px solid rgba(148, 163, 184, 0.18);
    background: rgba(15, 23, 42, 0.72);
    color: rgba(226, 232, 240, 0.94);
    padding: 9px 11px;
    outline: none;
  }

  .governance-button-lite {
    min-height: 38px;
    border-radius: 14px;
    border: 1px solid rgba(125, 211, 252, 0.24);
    background: rgba(14, 165, 233, 0.14);
    color: rgba(226, 232, 240, 0.94);
    font-weight: 800;
    cursor: pointer;
    padding: 8px 12px;
  }

  .governance-button-lite:disabled {
    cursor: not-allowed;
    opacity: 0.55;
  }

  @media (max-width: 1180px) {
    .governance-hero-layout,
    .governance-grid-four,
    .governance-grid-two {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 780px) {
    .governance-hero {
      padding: 30px;
    }

    .governance-form {
      grid-template-columns: 1fr;
    }

    .governance-title {
      font-size: clamp(36px, 11vw, 54px);
    }
  }
`;

function toNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function clampScore(value) {
  return Math.max(0, Math.min(100, Math.round(toNumber(value))));
}

function getMetrics({ decisions = [], controls = [], esgMetrics = [] }) {
  const closedDecisions = decisions.filter((item) =>
    ['closed', 'approved', 'completed'].includes(String(item.status || '').toLowerCase())
  );
  const evidenceReady = decisions.filter((item) =>
    ['ready', 'approved', 'complete'].includes(String(item.evidenceStatus || '').toLowerCase())
  );
  const controlEffectiveness =
    controls.length > 0
      ? clampScore(controls.reduce((sum, item) => sum + toNumber(item.effectiveness), 0) / controls.length)
      : 58;
  const esgReadiness =
    esgMetrics.length > 0
      ? clampScore(
          esgMetrics.reduce((sum, item) => {
            const target = toNumber(item.target) || 100;
            return sum + Math.min(100, (toNumber(item.value) / target) * 100);
          }, 0) / esgMetrics.length
        )
      : 55;
  const decisionClosureRate = decisions.length > 0 ? clampScore((closedDecisions.length / decisions.length) * 100) : 0;
  const evidenceReadiness = decisions.length > 0 ? clampScore((evidenceReady.length / decisions.length) * 100) : 0;
  const weakControls = controls.filter((item) => toNumber(item.effectiveness) < 60).length;
  const score = clampScore(
    decisionClosureRate * 0.26 +
      controlEffectiveness * 0.34 +
      esgReadiness * 0.24 +
      evidenceReadiness * 0.16 -
      weakControls * 4
  );

  return {
    score,
    decisionClosureRate,
    controlEffectiveness,
    esgReadiness,
    evidenceReadiness,
    weakControls,
    openDecisions: decisions.length - closedDecisions.length
  };
}

function MiniRow({ label, value }) {
  return (
    <div className="governance-mini-row">
      <span className="muted">{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function KpiCard({ label, value, description, icon: Icon }) {
  return (
    <article className="governance-kpi">
      <div className="governance-card-head">
        <div>
          <div className="kpi-label">{label}</div>
          <strong className="governance-kpi-value">{value}</strong>
        </div>
        <div className="governance-icon">
          <Icon size={18} />
        </div>
      </div>
      <p className="muted">{description}</p>
    </article>
  );
}

function DecisionCard({ item, onUpdate, disabled }) {
  return (
    <article className="governance-row-card">
      <div className="governance-card-head">
        <div>
          <div className="governance-kicker">
            <ClipboardCheck size={14} />
            {item.category}
          </div>
          <h3 className="governance-card-title">{item.title}</h3>
          <p className="muted">{item.owner} · due {item.dueDate || 'not set'}</p>
        </div>
        <Badge>{item.status}</Badge>
      </div>
      <div className="governance-toolbar">
        <select
          className="governance-select"
          value={item.status || 'open'}
          onChange={(event) => onUpdate(item.id, { status: event.target.value })}
          disabled={disabled}
          aria-label={`${item.title} status`}
        >
          <option value="open">Open</option>
          <option value="in_review">In review</option>
          <option value="approved">Approved</option>
          <option value="closed">Closed</option>
        </select>
        <select
          className="governance-select"
          value={item.evidenceStatus || 'pending'}
          onChange={(event) => onUpdate(item.id, { evidenceStatus: event.target.value })}
          disabled={disabled}
          aria-label={`${item.title} evidence`}
        >
          <option value="pending">Evidence pending</option>
          <option value="ready">Evidence ready</option>
          <option value="approved">Evidence approved</option>
        </select>
      </div>
    </article>
  );
}

export function GovernanceESGPage() {
  const { PERMISSIONS, can } = useAuth();
  const canManageGovernance = can(PERMISSIONS.MANAGE_ECOSYSTEM_BRANCH);
  const [decisions, setDecisions] = useState(DEMO_DECISIONS);
  const [controls, setControls] = useState(DEMO_CONTROLS);
  const [esgMetrics, setEsgMetrics] = useState(DEMO_ESG);
  const [backendStatus, setBackendStatus] = useState({ loading: true, error: null });
  const [newDecision, setNewDecision] = useState({ title: '', owner: '' });
  const [newControl, setNewControl] = useState({ name: '', owner: '' });
  const [newMetric, setNewMetric] = useState({ metric: '', value: '' });

  useEffect(() => {
    let cancelled = false;

    async function loadGovernance() {
      try {
        const [decisionItems, controlItems, metricItems] = await Promise.all([
          governanceApi.listDecisions(),
          governanceApi.listControls(),
          governanceApi.listEsgMetrics()
        ]);
        if (cancelled) return;
        setDecisions(decisionItems.length > 0 ? decisionItems : DEMO_DECISIONS);
        setControls(controlItems.length > 0 ? controlItems : DEMO_CONTROLS);
        setEsgMetrics(metricItems.length > 0 ? metricItems : DEMO_ESG);
        setBackendStatus({ loading: false, error: null });
      } catch (error) {
        if (cancelled) return;
        setBackendStatus({ loading: false, error });
      }
    }

    loadGovernance();

    return () => {
      cancelled = true;
    };
  }, []);

  const metrics = useMemo(() => getMetrics({ decisions, controls, esgMetrics }), [decisions, controls, esgMetrics]);
  const isFallback = decisions.some((item) => String(item.id).startsWith('demo-'));

  async function handleCreateDecision(event) {
    event.preventDefault();
    const title = newDecision.title.trim();
    if (!title) return;
    try {
      const created = await governanceApi.createDecision({
        title,
        owner: newDecision.owner || 'Board Secretary',
        category: 'Board',
        status: 'open',
        evidenceStatus: 'pending',
        boardApprovalRequired: true
      });
      setDecisions((items) => [created, ...items.filter((item) => !String(item.id).startsWith('demo-'))]);
      setNewDecision({ title: '', owner: '' });
    } catch (error) {
      setBackendStatus({ loading: false, error });
    }
  }

  async function handleUpdateDecision(id, patch) {
    if (String(id).startsWith('demo-')) {
      setDecisions((items) => items.map((item) => (item.id === id ? { ...item, ...patch } : item)));
      return;
    }
    const updated = await governanceApi.updateDecision(id, patch);
    setDecisions((items) => items.map((item) => (item.id === updated.id ? updated : item)));
  }

  async function handleCreateControl(event) {
    event.preventDefault();
    const name = newControl.name.trim();
    if (!name) return;
    const created = await governanceApi.createControl({
      name,
      owner: newControl.owner || 'Governance Lead',
      domain: 'Board',
      effectiveness: 65,
      status: 'active'
    });
    setControls((items) => [created, ...items.filter((item) => !String(item.id).startsWith('demo-'))]);
    setNewControl({ name: '', owner: '' });
  }

  async function handleCreateMetric(event) {
    event.preventDefault();
    const metric = newMetric.metric.trim();
    if (!metric) return;
    const created = await governanceApi.createEsgMetric({
      metric,
      value: toNumber(newMetric.value),
      target: 100,
      pillar: 'Governance',
      evidenceStatus: 'pending',
      reportingPeriod: 'FY26'
    });
    setEsgMetrics((items) => [created, ...items.filter((item) => !String(item.id).startsWith('demo-'))]);
    setNewMetric({ metric: '', value: '' });
  }

  return (
    <div className="page">
      <style>{governanceCss}</style>
      <div className="governance-page">
        <section className="governance-hero">
          <div className="governance-hero-layout">
            <div>
              <div className="governance-badge-row">
                <Badge>Governance</Badge>
                <Badge>ESG Strategy</Badge>
                <Badge>Board Control</Badge>
                <Badge>{backendStatus.loading ? 'Syncing' : isFallback ? 'Demo fallback' : 'Enterprise synced'}</Badge>
              </div>
              <h1 className="governance-title">
                Governance & ESG Control.
                <span>Board decisions, controls and evidence readiness.</span>
              </h1>
              <p className="governance-copy">
                Rama enterprise para digitalizar decisiones de consejo, controles
                corporativos, evidencias ESG y reporting conectado con Compliance,
                Funding y el Executive Overview.
              </p>
            </div>

            <aside className="governance-signal-card">
              <div className="governance-panel-head">
                <div>
                  <div className="kpi-label">Governance Signal</div>
                  <h2 className="governance-panel-title">Board control readiness</h2>
                </div>
                <div className="governance-icon">
                  <Scale size={20} />
                </div>
              </div>
              <div className="governance-score">
                <strong>{metrics.score}</strong>
                <p className="muted">
                  {metrics.openDecisions} decisiones abiertas, {metrics.weakControls} controles débiles y {metrics.evidenceReadiness}% de evidencia lista.
                </p>
              </div>
              <MiniRow label="Decision closure" value={`${metrics.decisionClosureRate}%`} />
              <MiniRow label="Control effectiveness" value={`${metrics.controlEffectiveness}%`} />
              <MiniRow label="ESG readiness" value={`${metrics.esgReadiness}%`} />
            </aside>
          </div>
        </section>

        <section className="governance-grid governance-grid-four">
          <KpiCard label="Decisions" value={decisions.length} description="Decisiones trazadas con owner y evidencia." icon={ClipboardCheck} />
          <KpiCard label="Controls" value={controls.length} description="Controles activos de board, ESG y riesgo." icon={ShieldCheck} />
          <KpiCard label="ESG metrics" value={esgMetrics.length} description="Métricas listas para reporting ejecutivo." icon={BarChart3} />
          <KpiCard label="Evidence" value={`${metrics.evidenceReadiness}%`} description="Preparación documental para board y auditoría." icon={FileText} />
        </section>

        <section className="governance-grid governance-grid-two">
          <Card className="governance-panel">
            <div className="governance-panel-head">
              <div>
                <div className="governance-kicker">
                  <Plus size={14} />
                  Board ledger
                </div>
                <h3 className="governance-panel-title">Create board decision</h3>
              </div>
              <div className="governance-icon">
                <Landmark size={18} />
              </div>
            </div>
            <form className="governance-form" onSubmit={handleCreateDecision}>
              <input className="governance-input" value={newDecision.title} onChange={(event) => setNewDecision((current) => ({ ...current, title: event.target.value }))} placeholder="Decision" aria-label="Decision title" />
              <input className="governance-input" value={newDecision.owner} onChange={(event) => setNewDecision((current) => ({ ...current, owner: event.target.value }))} placeholder="Owner" aria-label="Decision owner" />
              <button className="governance-button-lite" type="submit" disabled={!canManageGovernance}>Add</button>
            </form>
          </Card>

          <Card className="governance-panel">
            <div className="governance-panel-head">
              <div>
                <div className="governance-kicker">
                  <ShieldCheck size={14} />
                  Control framework
                </div>
                <h3 className="governance-panel-title">Add governance control</h3>
              </div>
              <div className="governance-icon">
                <ShieldCheck size={18} />
              </div>
            </div>
            <form className="governance-form" onSubmit={handleCreateControl}>
              <input className="governance-input" value={newControl.name} onChange={(event) => setNewControl((current) => ({ ...current, name: event.target.value }))} placeholder="Control" aria-label="Control name" />
              <input className="governance-input" value={newControl.owner} onChange={(event) => setNewControl((current) => ({ ...current, owner: event.target.value }))} placeholder="Owner" aria-label="Control owner" />
              <button className="governance-button-lite" type="submit" disabled={!canManageGovernance}>Add</button>
            </form>
          </Card>
        </section>

        <section className="governance-grid governance-grid-two">
          <div className="governance-grid">
            {decisions.map((item) => (
              <DecisionCard key={item.id} item={item} onUpdate={handleUpdateDecision} disabled={!canManageGovernance} />
            ))}
          </div>

          <Card className="governance-panel">
            <div className="governance-kicker">
              <Target size={14} />
              ESG metric register
            </div>
            <h3 className="governance-panel-title">Reporting metrics</h3>
            <form className="governance-form" onSubmit={handleCreateMetric}>
              <input className="governance-input" value={newMetric.metric} onChange={(event) => setNewMetric((current) => ({ ...current, metric: event.target.value }))} placeholder="Metric" aria-label="ESG metric" />
              <input className="governance-input" type="number" min="0" value={newMetric.value} onChange={(event) => setNewMetric((current) => ({ ...current, value: event.target.value }))} placeholder="Value" aria-label="Metric value" />
              <button className="governance-button-lite" type="submit" disabled={!canManageGovernance}>Add</button>
            </form>
            <div>
              {esgMetrics.map((item) => (
                <MiniRow key={item.id} label={item.metric} value={`${item.value}/${item.target}`} />
              ))}
            </div>
          </Card>
        </section>

        <section className="governance-grid governance-grid-two">
          <Card className="governance-panel">
            <div className="governance-kicker">
              <ShieldCheck size={14} />
              Control effectiveness
            </div>
            {controls.map((item) => (
              <div className="governance-control-row" key={item.id}>
                <span className="muted">{item.name}</span>
                <strong>{item.effectiveness}%</strong>
              </div>
            ))}
          </Card>

          <Card className="governance-panel">
            <div className="governance-kicker">
              <CheckCircle2 size={14} />
              Connected OS
            </div>
            <h3 className="governance-panel-title">Compliance + Funding + Board Pack</h3>
            <p className="muted">
              Governance consolida decisiones, evidencias y métricas ESG para el Executive Overview y el Board Pack.
            </p>
          </Card>
        </section>
      </div>
    </div>
  );
}
