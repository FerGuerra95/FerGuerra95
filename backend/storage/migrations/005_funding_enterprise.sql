CREATE TABLE IF NOT EXISTS funding_snapshots (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  company_name TEXT NOT NULL DEFAULT 'Funding case',
  stage TEXT NOT NULL DEFAULT 'seed',
  status TEXT NOT NULL DEFAULT 'completed',
  readiness_score REAL NOT NULL DEFAULT 0,
  target_raise REAL NOT NULL DEFAULT 0,
  runway_after_raise_months REAL NOT NULL DEFAULT 0,
  dilution_pct REAL NOT NULL DEFAULT 0,
  payload_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_funding_snapshots_org
  ON funding_snapshots (organization_id, created_at);

CREATE INDEX IF NOT EXISTS idx_funding_snapshots_status
  ON funding_snapshots (organization_id, status);

CREATE INDEX IF NOT EXISTS idx_funding_snapshots_stage
  ON funding_snapshots (organization_id, stage);

CREATE TABLE IF NOT EXISTS funding_board_memos (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  snapshot_id TEXT NOT NULL,
  title TEXT NOT NULL DEFAULT 'Funding Board Memo',
  status TEXT NOT NULL DEFAULT 'generated',
  executive_summary_json TEXT NOT NULL DEFAULT '{}',
  payload_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (snapshot_id) REFERENCES funding_snapshots(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_funding_board_memos_org
  ON funding_board_memos (organization_id, created_at);

CREATE INDEX IF NOT EXISTS idx_funding_board_memos_snapshot
  ON funding_board_memos (organization_id, snapshot_id);
