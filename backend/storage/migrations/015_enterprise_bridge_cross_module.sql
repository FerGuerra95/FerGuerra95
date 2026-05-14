CREATE TABLE IF NOT EXISTS bridge_signals (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  created_by TEXT NOT NULL DEFAULT '',
  user_id TEXT NOT NULL DEFAULT '',
  source_module TEXT NOT NULL DEFAULT '',
  target_module TEXT NOT NULL DEFAULT '',
  signal_type TEXT NOT NULL DEFAULT 'cross_module_signal',
  severity TEXT NOT NULL DEFAULT 'watch',
  title TEXT NOT NULL DEFAULT 'Bridge signal',
  description TEXT NOT NULL DEFAULT '',
  recommended_action TEXT NOT NULL DEFAULT '',
  evidence_json TEXT NOT NULL DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'open',
  owner TEXT NOT NULL DEFAULT 'Executive Office',
  due_date TEXT NOT NULL DEFAULT '',
  confidence_level REAL NOT NULL DEFAULT 60,
  stale_flag REAL NOT NULL DEFAULT 0,
  human_review_status TEXT NOT NULL DEFAULT 'required',
  acknowledged_at TEXT NOT NULL DEFAULT '',
  resolved_at TEXT NOT NULL DEFAULT '',
  dismissed_at TEXT NOT NULL DEFAULT '',
  dismissal_reason TEXT NOT NULL DEFAULT '',
  payload_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_bridge_signals_org ON bridge_signals (organization_id);
CREATE INDEX IF NOT EXISTS idx_bridge_signals_status ON bridge_signals (organization_id, status);
CREATE INDEX IF NOT EXISTS idx_bridge_signals_type ON bridge_signals (organization_id, signal_type);

CREATE TABLE IF NOT EXISTS bridge_dependencies (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  created_by TEXT NOT NULL DEFAULT '',
  user_id TEXT NOT NULL DEFAULT '',
  source_module TEXT NOT NULL DEFAULT '',
  target_module TEXT NOT NULL DEFAULT '',
  source_entity_id TEXT NOT NULL DEFAULT '',
  target_entity_id TEXT NOT NULL DEFAULT '',
  dependency_type TEXT NOT NULL DEFAULT 'operational',
  blocking_flag REAL NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'open',
  owner TEXT NOT NULL DEFAULT 'Executive Office',
  resolution_note TEXT NOT NULL DEFAULT '',
  payload_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_bridge_dependencies_org ON bridge_dependencies (organization_id);

CREATE TABLE IF NOT EXISTS bridge_conflicts (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  created_by TEXT NOT NULL DEFAULT '',
  user_id TEXT NOT NULL DEFAULT '',
  conflict_type TEXT NOT NULL DEFAULT 'cross_module_conflict',
  source_module TEXT NOT NULL DEFAULT '',
  target_module TEXT NOT NULL DEFAULT '',
  severity TEXT NOT NULL DEFAULT 'risk',
  title TEXT NOT NULL DEFAULT 'Bridge conflict',
  description TEXT NOT NULL DEFAULT '',
  mitigation TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'open',
  owner TEXT NOT NULL DEFAULT 'Executive Office',
  evidence_json TEXT NOT NULL DEFAULT '[]',
  payload_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_bridge_conflicts_org ON bridge_conflicts (organization_id);

CREATE TABLE IF NOT EXISTS bridge_attention_queue (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  created_by TEXT NOT NULL DEFAULT '',
  user_id TEXT NOT NULL DEFAULT '',
  source_signal_id TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL DEFAULT 'Executive attention item',
  priority_score REAL NOT NULL DEFAULT 0,
  severity TEXT NOT NULL DEFAULT 'watch',
  owner TEXT NOT NULL DEFAULT 'Executive Office',
  due_date TEXT NOT NULL DEFAULT '',
  recommended_action TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'open',
  payload_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_bridge_attention_org ON bridge_attention_queue (organization_id);

CREATE TABLE IF NOT EXISTS bridge_evidence_links (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  created_by TEXT NOT NULL DEFAULT '',
  user_id TEXT NOT NULL DEFAULT '',
  signal_id TEXT NOT NULL DEFAULT '',
  source_module TEXT NOT NULL DEFAULT '',
  source_entity_id TEXT NOT NULL DEFAULT '',
  link_label TEXT NOT NULL DEFAULT '',
  evidence_quality TEXT NOT NULL DEFAULT 'medium',
  human_review_note TEXT NOT NULL DEFAULT '',
  payload_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_bridge_evidence_org ON bridge_evidence_links (organization_id);

CREATE TABLE IF NOT EXISTS bridge_snapshots (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  created_by TEXT NOT NULL DEFAULT '',
  user_id TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL DEFAULT 'CEO Bridge Snapshot',
  status TEXT NOT NULL DEFAULT 'generated',
  snapshot_type TEXT NOT NULL DEFAULT 'ceo_bridge_snapshot',
  payload_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_bridge_snapshots_org ON bridge_snapshots (organization_id);

CREATE TABLE IF NOT EXISTS bridge_signal_history (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  created_by TEXT NOT NULL DEFAULT '',
  user_id TEXT NOT NULL DEFAULT '',
  signal_id TEXT NOT NULL DEFAULT '',
  action TEXT NOT NULL DEFAULT 'updated',
  from_status TEXT NOT NULL DEFAULT '',
  to_status TEXT NOT NULL DEFAULT '',
  notes TEXT NOT NULL DEFAULT '',
  payload_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_bridge_signal_history_signal
  ON bridge_signal_history (organization_id, signal_id);
