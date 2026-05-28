import React, { useEffect, useState } from 'react';
import { governanceApi } from '../services/governanceApi.js';
import {
  ActionItemsTable,
  BoardPackCard,
  CommitteeCalendar,
  GovernanceAuditTimeline,
  PolicyReviewPanel,
  governanceCss
} from '../components/GovernanceComponents.jsx';
import { Badge } from '../../../shared/components/ui/Badge.jsx';
import { Card } from '../../../shared/components/ui/Card.jsx';
import { PERMISSIONS, useAuth } from '../../../app/providers/AuthProvider.jsx';

function EntityPage({
  badge,
  title,
  copy,
  load,
  create,
  defaults = {},
  fields = [],
  render,
  permission = PERMISSIONS.CREATE_GOVERNANCE
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
      <style>{governanceCss}</style>
      <div className="governance-enterprise-page">
        <section className="governance-enterprise-hero ceos-ws-hero">
          <Badge>{badge}</Badge>
          <h1 className="governance-enterprise-title">{title}</h1>
          <p className="governance-enterprise-copy">{copy}</p>
        </section>
        <form className="governance-enterprise-toolbar" onSubmit={submit}>
          {fields.map((field) => (
            <label className="governance-enterprise-field" key={field}>
              <span>{field}</span>
              <input
                aria-label={field}
                className="governance-enterprise-input"
                disabled={!canCreate}
                value={form[field] || ''}
                onChange={(event) => setForm((current) => ({ ...current, [field]: event.target.value }))}
              />
            </label>
          ))}
          <button className="governance-enterprise-button" disabled={!canCreate}>
            {canCreate ? 'Create' : 'Read only'}
          </button>
        </form>
        {status.loading ? <div className="governance-enterprise-empty">Loading records.</div> : null}
        {status.error ? <div className="governance-enterprise-empty">Records could not be loaded.</div> : null}
        {render ? render(items) : <SimpleCards items={items} />}
      </div>
    </div>
  );
}

function SimpleCards({ items }) {
  if (items.length === 0) return <div className="governance-enterprise-empty">No records available.</div>;
  return (
    <section className="governance-enterprise-grid-two">
      {items.map((item) => (
        <Card className="governance-enterprise-panel ceos-executive-inner-surface" key={item.id}>
          <h3>{item.title || item.committeeName || item.meetingTitle || item.action || item.id}</h3>
          <p className="muted">{item.status || item.reportType || 'active'}</p>
        </Card>
      ))}
    </section>
  );
}

export function BoardPacksPage() {
  return (
    <EntityPage
      badge="Board Packs"
      title="Governance decision packs."
      copy="Module-owned governance decision packs (agenda, summary, decisions, risks). Not the Reporting Board Pack aggregator. DSS only — human review required."
      load={governanceApi.listBoardPacks}
      create={governanceApi.createBoardPack}
      defaults={{ title: '', executiveSummary: '' }}
      fields={['title', 'executiveSummary']}
      render={(items) => <section className="governance-enterprise-grid-two">{items.map((item) => <BoardPackCard item={item} key={item.id} />)}</section>}
    />
  );
}

export function CommitteesPage() {
  return (
    <EntityPage
      badge="Committees"
      title="Committee operations."
      copy="Board, audit, investment, risk, compliance, executive and integration committees."
      load={governanceApi.listCommittees}
      create={governanceApi.createCommittee}
      defaults={{ committeeName: '', chair: '', nextMeetingDate: '' }}
      fields={['committeeName', 'chair', 'nextMeetingDate']}
      permission={PERMISSIONS.MANAGE_GOVERNANCE_COMMITTEE}
      render={(items) => <CommitteeCalendar items={items} />}
    />
  );
}

export function PoliciesPage() {
  return (
    <EntityPage
      badge="Policies"
      title="Corporate policy register."
      copy="Active policies, review dates, risk if overdue, evidence requirements and renewal workflow."
      load={governanceApi.listPolicies}
      create={governanceApi.createPolicy}
      defaults={{ title: '', owner: '', reviewDate: '' }}
      fields={['title', 'owner', 'reviewDate']}
      permission={PERMISSIONS.MANAGE_GOVERNANCE_POLICY}
      render={(items) => <PolicyReviewPanel items={items} />}
    />
  );
}

export function ActionTrackerPage() {
  return (
    <EntityPage
      badge="Action Tracker"
      title="Governance action items."
      copy="Owners, due dates, escalation levels, blockers and completion evidence."
      load={governanceApi.listActions}
      create={governanceApi.createAction}
      defaults={{ title: '', owner: '', dueDate: '' }}
      fields={['title', 'owner', 'dueDate']}
      render={(items) => <ActionItemsTable items={items} />}
    />
  );
}

export function GovernanceMeetingsPage() {
  return (
    <EntityPage
      badge="Meetings"
      title="Meeting minutes lite."
      copy="Meeting agenda, attendees, decisions, actions and minutes summary."
      load={governanceApi.listMeetings}
      create={governanceApi.createMeeting}
      defaults={{ meetingTitle: '', meetingDate: '', minutesSummary: '' }}
      fields={['meetingTitle', 'meetingDate', 'minutesSummary']}
    />
  );
}

export function GovernanceReportsPage() {
  return (
    <EntityPage
      badge="Reports"
      title="Governance reports."
      copy="Board packs, decision memos, action trackers, policy summaries, risk briefs and audit trail summaries."
      load={governanceApi.listReports}
      create={governanceApi.createReport}
      defaults={{ title: '', reportType: 'board_readiness_snapshot' }}
      fields={['title', 'reportType']}
      permission={PERMISSIONS.EXPORT_GOVERNANCE_REPORT}
    />
  );
}

export function GovernanceAuditTrailPage() {
  const [items, setItems] = useState([]);
  useEffect(() => { governanceApi.listAuditTrail().then(setItems).catch(() => setItems([])); }, []);
  return (
    <div className="page">
      <style>{governanceCss}</style>
      <div className="governance-enterprise-page">
        <section className="governance-enterprise-hero ceos-ws-hero">
          <Badge>Audit Trail</Badge>
          <h1 className="governance-enterprise-title">Governance audit trail.</h1>
          <p className="governance-enterprise-copy">Organization-scoped activity for governance decisions, board packs, committees, policies, actions, meetings and reports.</p>
        </section>
        <GovernanceAuditTimeline items={items} />
      </div>
    </div>
  );
}
