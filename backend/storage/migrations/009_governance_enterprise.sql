CREATE TABLE IF NOT EXISTS governance_decisions (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL DEFAULT 'Governance decision',
  category TEXT NOT NULL DEFAULT 'Board',
  status TEXT NOT NULL DEFAULT 'open',
  owner TEXT NOT NULL DEFAULT 'Board Secretary',
  due_date TEXT NOT NULL DEFAULT '',
  decision_date TEXT NOT NULL DEFAULT '',
  evidence_status TEXT NOT NULL DEFAULT 'pending',
  board_approval_required REAL NOT NULL DEFAULT 1,
  payload_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_governance_decisions_org
  ON governance_decisions (organization_id);

CREATE INDEX IF NOT EXISTS idx_governance_decisions_status
  ON governance_decisions (organization_id, status);

CREATE TABLE IF NOT EXISTS governance_controls (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL DEFAULT 'Governance control',
  domain TEXT NOT NULL DEFAULT 'Board',
  status TEXT NOT NULL DEFAULT 'active',
  owner TEXT NOT NULL DEFAULT 'Governance Lead',
  effectiveness REAL NOT NULL DEFAULT 60,
  review_cadence TEXT NOT NULL DEFAULT 'quarterly',
  last_review_at TEXT NOT NULL DEFAULT '',
  next_review_at TEXT NOT NULL DEFAULT '',
  payload_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_governance_controls_org
  ON governance_controls (organization_id);

CREATE INDEX IF NOT EXISTS idx_governance_controls_domain
  ON governance_controls (organization_id, domain);

CREATE TABLE IF NOT EXISTS governance_esg_metrics (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  metric TEXT NOT NULL DEFAULT 'ESG metric',
  pillar TEXT NOT NULL DEFAULT 'Governance',
  value REAL NOT NULL DEFAULT 0,
  target REAL NOT NULL DEFAULT 100,
  status TEXT NOT NULL DEFAULT 'tracking',
  evidence_status TEXT NOT NULL DEFAULT 'pending',
  reporting_period TEXT NOT NULL DEFAULT '',
  payload_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_governance_esg_metrics_org
  ON governance_esg_metrics (organization_id);

CREATE INDEX IF NOT EXISTS idx_governance_esg_metrics_pillar
  ON governance_esg_metrics (organization_id, pillar);
