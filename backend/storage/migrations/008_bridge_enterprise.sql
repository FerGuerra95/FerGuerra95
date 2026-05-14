CREATE TABLE IF NOT EXISTS bridge_opportunities (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL DEFAULT 'Bridge opportunity',
  source_branch TEXT NOT NULL DEFAULT 'manual',
  source_id TEXT NOT NULL DEFAULT '',
  counterparty_type TEXT NOT NULL DEFAULT 'Strategic buyer',
  sector TEXT NOT NULL DEFAULT 'General',
  geography TEXT NOT NULL DEFAULT 'Europe',
  stage TEXT NOT NULL DEFAULT 'Qualification',
  qualification_status TEXT NOT NULL DEFAULT 'verified',
  opportunity_value REAL NOT NULL DEFAULT 0,
  probability REAL NOT NULL DEFAULT 35,
  status TEXT NOT NULL DEFAULT 'active',
  owner TEXT NOT NULL DEFAULT 'Bridge Lead',
  nda_status TEXT NOT NULL DEFAULT 'required',
  redaction_level TEXT NOT NULL DEFAULT 'redacted_teaser',
  data_room_access TEXT NOT NULL DEFAULT 'none',
  board_approval_required REAL NOT NULL DEFAULT 1,
  next_step TEXT NOT NULL DEFAULT '',
  payload_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_bridge_opportunities_org
  ON bridge_opportunities (organization_id);

CREATE INDEX IF NOT EXISTS idx_bridge_opportunities_stage
  ON bridge_opportunities (organization_id, stage);

CREATE INDEX IF NOT EXISTS idx_bridge_opportunities_status
  ON bridge_opportunities (organization_id, status);

CREATE TABLE IF NOT EXISTS bridge_counterparties (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL DEFAULT 'Bridge counterparty',
  counterparty_type TEXT NOT NULL DEFAULT 'Strategic buyer',
  sector_focus TEXT NOT NULL DEFAULT 'General',
  geography TEXT NOT NULL DEFAULT 'Europe',
  ticket_min REAL NOT NULL DEFAULT 0,
  ticket_max REAL NOT NULL DEFAULT 0,
  risk_appetite TEXT NOT NULL DEFAULT 'Medium',
  kyc_status TEXT NOT NULL DEFAULT 'review',
  nda_status TEXT NOT NULL DEFAULT 'required',
  contact_owner TEXT NOT NULL DEFAULT 'Bridge Lead',
  status TEXT NOT NULL DEFAULT 'active',
  score TEXT NOT NULL DEFAULT '',
  payload_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_bridge_counterparties_org
  ON bridge_counterparties (organization_id);

CREATE INDEX IF NOT EXISTS idx_bridge_counterparties_type
  ON bridge_counterparties (organization_id, counterparty_type);

CREATE TABLE IF NOT EXISTS bridge_introductions (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  opportunity_id TEXT NOT NULL,
  counterparty_id TEXT NOT NULL,
  counterparty_name TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'drafted',
  nda_status TEXT NOT NULL DEFAULT 'required',
  introduced_at TEXT NOT NULL DEFAULT '',
  next_step TEXT NOT NULL DEFAULT '',
  payload_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_bridge_introductions_org
  ON bridge_introductions (organization_id);

CREATE INDEX IF NOT EXISTS idx_bridge_introductions_opportunity
  ON bridge_introductions (organization_id, opportunity_id);
