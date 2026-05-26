CREATE TABLE IF NOT EXISTS board_review_snapshots (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  report_id TEXT,
  board_pack_id TEXT,
  title TEXT NOT NULL,
  status TEXT NOT NULL,
  snapshot_version INTEGER NOT NULL DEFAULT 1,
  renderer_version TEXT NOT NULL,
  source_modules_json TEXT NOT NULL DEFAULT '[]',
  data_freshness_json TEXT NOT NULL DEFAULT '{}',
  renderer_input_json TEXT NOT NULL DEFAULT '{}',
  missing_data_json TEXT NOT NULL DEFAULT '[]',
  insufficient_data_flags_json TEXT NOT NULL DEFAULT '[]',
  ai_metadata_json TEXT NOT NULL DEFAULT '{}',
  truthfulness_json TEXT NOT NULL DEFAULT '{}',
  audit_metadata_json TEXT NOT NULL DEFAULT '{}',
  created_by TEXT NOT NULL,
  reviewed_by TEXT,
  reviewed_at TEXT,
  internal_final_by TEXT,
  internal_final_at TEXT,
  archived_at TEXT,
  revoked_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_board_review_snapshots_org
  ON board_review_snapshots (organization_id);

CREATE INDEX IF NOT EXISTS idx_board_review_snapshots_org_status
  ON board_review_snapshots (organization_id, status);

CREATE INDEX IF NOT EXISTS idx_board_review_snapshots_org_created
  ON board_review_snapshots (organization_id, created_at);

CREATE TABLE IF NOT EXISTS board_review_audit_events (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  snapshot_id TEXT NOT NULL,
  actor_id TEXT,
  event_type TEXT NOT NULL,
  previous_status TEXT,
  next_status TEXT,
  result TEXT NOT NULL,
  blocked_reason TEXT,
  metadata_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_board_review_audit_events_org_snapshot
  ON board_review_audit_events (organization_id, snapshot_id);

CREATE INDEX IF NOT EXISTS idx_board_review_audit_events_org_created
  ON board_review_audit_events (organization_id, created_at);
