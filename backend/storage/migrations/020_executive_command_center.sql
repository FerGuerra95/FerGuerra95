CREATE TABLE IF NOT EXISTS executive_signals (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  created_by TEXT NOT NULL DEFAULT '',
  user_id TEXT NOT NULL DEFAULT '',
  module TEXT NOT NULL DEFAULT 'enterprise',
  severity TEXT NOT NULL DEFAULT 'watch',
  title TEXT NOT NULL DEFAULT 'Executive signal',
  recommended_action TEXT NOT NULL DEFAULT '',
  owner TEXT NOT NULL DEFAULT 'Executive Office',
  due_date TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'open',
  source TEXT NOT NULL DEFAULT '',
  evidence_json TEXT NOT NULL DEFAULT '[]',
  human_review_required INTEGER NOT NULL DEFAULT 1,
  payload_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_executive_signals_org ON executive_signals (organization_id);
CREATE INDEX IF NOT EXISTS idx_executive_signals_status ON executive_signals (organization_id, status);

CREATE TABLE IF NOT EXISTS executive_decision_queue (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  created_by TEXT NOT NULL DEFAULT '',
  user_id TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL DEFAULT 'Executive decision',
  module TEXT NOT NULL DEFAULT 'enterprise',
  decision_type TEXT NOT NULL DEFAULT 'critical_decision',
  severity TEXT NOT NULL DEFAULT 'watch',
  owner TEXT NOT NULL DEFAULT 'Executive Office',
  due_date TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'open',
  priority_score REAL NOT NULL DEFAULT 0,
  board_required INTEGER NOT NULL DEFAULT 0,
  recommended_action TEXT NOT NULL DEFAULT '',
  payload_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_executive_decision_queue_org ON executive_decision_queue (organization_id);

CREATE TABLE IF NOT EXISTS executive_snapshots (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  created_by TEXT NOT NULL DEFAULT '',
  user_id TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL DEFAULT 'Executive snapshot',
  readiness_score REAL NOT NULL DEFAULT 0,
  confidence REAL NOT NULL DEFAULT 0,
  payload_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_executive_snapshots_org ON executive_snapshots (organization_id);

CREATE TABLE IF NOT EXISTS executive_board_views (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  created_by TEXT NOT NULL DEFAULT '',
  user_id TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL DEFAULT 'Board Executive Snapshot',
  status TEXT NOT NULL DEFAULT 'generated',
  payload_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_executive_board_views_org ON executive_board_views (organization_id);

CREATE TABLE IF NOT EXISTS executive_reports (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  created_by TEXT NOT NULL DEFAULT '',
  user_id TEXT NOT NULL DEFAULT '',
  report_type TEXT NOT NULL DEFAULT 'ceo_weekly_brief',
  title TEXT NOT NULL DEFAULT 'CEO Weekly Brief',
  status TEXT NOT NULL DEFAULT 'generated',
  payload_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_executive_reports_org ON executive_reports (organization_id);

CREATE TABLE IF NOT EXISTS executive_calendar_items (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  created_by TEXT NOT NULL DEFAULT '',
  user_id TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL DEFAULT 'Executive calendar item',
  module TEXT NOT NULL DEFAULT 'enterprise',
  item_type TEXT NOT NULL DEFAULT 'critical_deadline',
  due_date TEXT NOT NULL DEFAULT '',
  priority TEXT NOT NULL DEFAULT 'watch',
  owner TEXT NOT NULL DEFAULT 'Executive Office',
  status TEXT NOT NULL DEFAULT 'open',
  source_entity_id TEXT NOT NULL DEFAULT '',
  payload_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_executive_calendar_org ON executive_calendar_items (organization_id);
