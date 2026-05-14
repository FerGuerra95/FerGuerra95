import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { governanceApi } from '../services/governanceApi.js';
import { DecisionRegisterTable, governanceCss } from '../components/GovernanceComponents.jsx';
import { useAuth } from '../../../app/providers/AuthProvider.jsx';
import { Badge } from '../../../shared/components/ui/Badge.jsx';

export function DecisionRegisterPage() {
  const navigate = useNavigate();
  const { PERMISSIONS, can } = useAuth();
  const readOnly = !can(PERMISSIONS.UPDATE_GOVERNANCE);
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ title: '', owner: '', priority: 'medium' });
  const [filter, setFilter] = useState('all');

  async function refresh() {
    setItems(await governanceApi.listDecisions());
  }

  useEffect(() => { refresh(); }, []);

  const filtered = useMemo(() => filter === 'all' ? items : items.filter((item) => item.status === filter), [items, filter]);

  async function create(event) {
    event.preventDefault();
    if (!can(PERMISSIONS.CREATE_GOVERNANCE)) return;
    if (!form.title.trim()) return;
    await governanceApi.createDecision({ ...form, decisionType: 'governance', status: 'draft', boardApprovalRequired: true });
    setForm({ title: '', owner: '', priority: 'medium' });
    await refresh();
  }

  async function run(action, item) {
    await action(item.id, { notes: 'Updated from Governance register' });
    await refresh();
  }

  return (
    <div className="page">
      <style>{governanceCss}</style>
      <div className="governance-enterprise-page">
        <section className="governance-enterprise-hero">
          <Badge>Decision Register</Badge>
          <h1 className="governance-enterprise-title">Executive decisions.</h1>
          <p className="governance-enterprise-copy">Create, review, approve, escalate and implement governance decisions with audit history.</p>
        </section>
        <form className="governance-enterprise-toolbar" onSubmit={create}>
          <label className="governance-enterprise-field">
            <span>Decision title</span>
            <input aria-label="Decision title" className="governance-enterprise-input" disabled={!can(PERMISSIONS.CREATE_GOVERNANCE)} value={form.title} onChange={(e) => setForm((v) => ({ ...v, title: e.target.value }))} />
          </label>
          <label className="governance-enterprise-field">
            <span>Owner</span>
            <input aria-label="Owner" className="governance-enterprise-input" disabled={!can(PERMISSIONS.CREATE_GOVERNANCE)} value={form.owner} onChange={(e) => setForm((v) => ({ ...v, owner: e.target.value }))} />
          </label>
          <select aria-label="Priority" className="governance-enterprise-select" value={form.priority} onChange={(e) => setForm((v) => ({ ...v, priority: e.target.value }))} disabled={!can(PERMISSIONS.CREATE_GOVERNANCE)}>
            <option value="medium">Medium</option><option value="high">High</option><option value="critical">Critical</option>
          </select>
          <button className="governance-enterprise-button" disabled={!can(PERMISSIONS.CREATE_GOVERNANCE)}>Create decision</button>
          <select className="governance-enterprise-select" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All statuses</option><option value="draft">Draft</option><option value="under_review">Under review</option><option value="approved">Approved</option><option value="escalated">Escalated</option>
          </select>
        </form>
        <DecisionRegisterTable
          items={filtered}
          readOnly={readOnly}
          onSelect={(item) => navigate(`/governance/decisions/${item.id}`)}
          onSubmit={(item) => run(governanceApi.submitDecision, item)}
          onApprove={(item) => run(governanceApi.approveDecision, item)}
          onEscalate={(item) => run(governanceApi.escalateDecision, item)}
        />
      </div>
    </div>
  );
}
