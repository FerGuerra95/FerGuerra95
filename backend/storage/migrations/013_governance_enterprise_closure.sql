ALTER TABLE governance_decisions ADD COLUMN created_by TEXT NOT NULL DEFAULT '';
ALTER TABLE governance_decisions ADD COLUMN decision_type TEXT NOT NULL DEFAULT 'governance';
ALTER TABLE governance_decisions ADD COLUMN priority TEXT NOT NULL DEFAULT 'medium';
ALTER TABLE governance_decisions ADD COLUMN deadline_at TEXT NOT NULL DEFAULT '';
ALTER TABLE governance_decisions ADD COLUMN approver TEXT NOT NULL DEFAULT '';
ALTER TABLE governance_decisions ADD COLUMN source_module TEXT NOT NULL DEFAULT '';
ALTER TABLE governance_decisions ADD COLUMN source_entity_id TEXT NOT NULL DEFAULT '';
ALTER TABLE governance_decisions ADD COLUMN approval_notes TEXT NOT NULL DEFAULT '';
ALTER TABLE governance_decisions ADD COLUMN change_history_json TEXT NOT NULL DEFAULT '[]';
ALTER TABLE governance_decisions ADD COLUMN evidence_json TEXT NOT NULL DEFAULT '[]';
ALTER TABLE governance_decisions ADD COLUMN blocking_decision REAL NOT NULL DEFAULT 0;
ALTER TABLE governance_decisions ADD COLUMN estimated_financial_impact REAL NOT NULL DEFAULT 0;
ALTER TABLE governance_decisions ADD COLUMN estimated_compliance_impact REAL NOT NULL DEFAULT 0;
ALTER TABLE governance_decisions ADD COLUMN estimated_strategic_impact REAL NOT NULL DEFAULT 0;
ALTER TABLE governance_decisions ADD COLUMN locked_at TEXT NOT NULL DEFAULT '';
ALTER TABLE governance_decisions ADD COLUMN submitted_at TEXT NOT NULL DEFAULT '';
ALTER TABLE governance_decisions ADD COLUMN approved_at TEXT NOT NULL DEFAULT '';
ALTER TABLE governance_decisions ADD COLUMN rejected_at TEXT NOT NULL DEFAULT '';
ALTER TABLE governance_decisions ADD COLUMN deferred_at TEXT NOT NULL DEFAULT '';
ALTER TABLE governance_decisions ADD COLUMN escalated_at TEXT NOT NULL DEFAULT '';
ALTER TABLE governance_decisions ADD COLUMN implemented_at TEXT NOT NULL DEFAULT '';

CREATE TABLE IF NOT EXISTS governance_board_packs (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  created_by TEXT NOT NULL,
  user_id TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL DEFAULT 'Governance Board Pack',
  status TEXT NOT NULL DEFAULT 'draft',
  agenda_json TEXT NOT NULL DEFAULT '[]',
  executive_summary TEXT NOT NULL DEFAULT '',
  key_decisions_json TEXT NOT NULL DEFAULT '[]',
  risks_json TEXT NOT NULL DEFAULT '[]',
  financial_highlights_json TEXT NOT NULL DEFAULT '[]',
  compliance_highlights_json TEXT NOT NULL DEFAULT '[]',
  ma_highlights_json TEXT NOT NULL DEFAULT '[]',
  funding_highlights_json TEXT NOT NULL DEFAULT '[]',
  pmi_highlights_json TEXT NOT NULL DEFAULT '[]',
  governance_highlights_json TEXT NOT NULL DEFAULT '[]',
  annexes_json TEXT NOT NULL DEFAULT '[]',
  evidence_json TEXT NOT NULL DEFAULT '[]',
  readiness_score REAL NOT NULL DEFAULT 0,
  finalized_at TEXT NOT NULL DEFAULT '',
  payload_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_governance_board_packs_org
  ON governance_board_packs (organization_id);

CREATE TABLE IF NOT EXISTS governance_committees (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  created_by TEXT NOT NULL,
  user_id TEXT NOT NULL DEFAULT '',
  committee_name TEXT NOT NULL DEFAULT 'Governance Committee',
  committee_type TEXT NOT NULL DEFAULT 'board',
  chair TEXT NOT NULL DEFAULT '',
  members_json TEXT NOT NULL DEFAULT '[]',
  cadence TEXT NOT NULL DEFAULT 'monthly',
  next_meeting_date TEXT NOT NULL DEFAULT '',
  scope TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'active',
  linked_decisions_json TEXT NOT NULL DEFAULT '[]',
  linked_policies_json TEXT NOT NULL DEFAULT '[]',
  payload_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_governance_committees_org
  ON governance_committees (organization_id);

CREATE TABLE IF NOT EXISTS governance_policies (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  created_by TEXT NOT NULL,
  user_id TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL DEFAULT 'Governance Policy',
  area TEXT NOT NULL DEFAULT 'Governance',
  jurisdiction TEXT NOT NULL DEFAULT '',
  owner TEXT NOT NULL DEFAULT 'Governance Lead',
  effective_date TEXT NOT NULL DEFAULT '',
  review_date TEXT NOT NULL DEFAULT '',
  control_points_json TEXT NOT NULL DEFAULT '[]',
  required_evidence_json TEXT NOT NULL DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'active',
  risk_if_overdue TEXT NOT NULL DEFAULT 'medium',
  linked_compliance_controls_json TEXT NOT NULL DEFAULT '[]',
  payload_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_governance_policies_org
  ON governance_policies (organization_id);

CREATE TABLE IF NOT EXISTS governance_action_items (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  created_by TEXT NOT NULL,
  user_id TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL DEFAULT 'Governance action',
  owner TEXT NOT NULL DEFAULT 'Governance Lead',
  due_date TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'open',
  escalation_level TEXT NOT NULL DEFAULT 'none',
  linked_decision_id TEXT NOT NULL DEFAULT '',
  linked_board_pack_id TEXT NOT NULL DEFAULT '',
  linked_committee_id TEXT NOT NULL DEFAULT '',
  blocker_notes TEXT NOT NULL DEFAULT '',
  completion_evidence_json TEXT NOT NULL DEFAULT '[]',
  overdue_risk_flag REAL NOT NULL DEFAULT 0,
  completed_at TEXT NOT NULL DEFAULT '',
  payload_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_governance_action_items_org
  ON governance_action_items (organization_id);

CREATE TABLE IF NOT EXISTS governance_meetings (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  created_by TEXT NOT NULL,
  user_id TEXT NOT NULL DEFAULT '',
  meeting_title TEXT NOT NULL DEFAULT 'Governance Meeting',
  meeting_date TEXT NOT NULL DEFAULT '',
  committee_id TEXT NOT NULL DEFAULT '',
  attendees_json TEXT NOT NULL DEFAULT '[]',
  agenda_json TEXT NOT NULL DEFAULT '[]',
  decisions_json TEXT NOT NULL DEFAULT '[]',
  actions_json TEXT NOT NULL DEFAULT '[]',
  minutes_summary TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'draft',
  finalized_at TEXT NOT NULL DEFAULT '',
  payload_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_governance_meetings_org
  ON governance_meetings (organization_id);

CREATE TABLE IF NOT EXISTS governance_approval_history (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  created_by TEXT NOT NULL,
  user_id TEXT NOT NULL DEFAULT '',
  decision_id TEXT NOT NULL,
  action TEXT NOT NULL DEFAULT 'updated',
  from_status TEXT NOT NULL DEFAULT '',
  to_status TEXT NOT NULL DEFAULT '',
  notes TEXT NOT NULL DEFAULT '',
  payload_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_governance_approval_history_decision
  ON governance_approval_history (organization_id, decision_id);

CREATE TABLE IF NOT EXISTS governance_report_exports (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  created_by TEXT NOT NULL,
  user_id TEXT NOT NULL DEFAULT '',
  report_type TEXT NOT NULL DEFAULT 'board_readiness_snapshot',
  title TEXT NOT NULL DEFAULT 'Governance Report',
  status TEXT NOT NULL DEFAULT 'generated',
  payload_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_governance_report_exports_org
  ON governance_report_exports (organization_id);
