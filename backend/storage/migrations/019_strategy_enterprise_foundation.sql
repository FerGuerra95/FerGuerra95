CREATE TABLE IF NOT EXISTS strategic_objectives (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  created_by TEXT NOT NULL DEFAULT '',
  user_id TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL DEFAULT 'Strategic objective',
  description TEXT NOT NULL DEFAULT '',
  owner TEXT NOT NULL DEFAULT 'Strategy Office',
  horizon TEXT NOT NULL DEFAULT '12_months',
  priority TEXT NOT NULL DEFAULT 'medium',
  status TEXT NOT NULL DEFAULT 'active',
  target_metric REAL NOT NULL DEFAULT 0,
  current_metric REAL NOT NULL DEFAULT 0,
  linked_module TEXT NOT NULL DEFAULT '',
  linked_board_decision_id TEXT NOT NULL DEFAULT '',
  payload_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_strategy_objectives_org ON strategic_objectives (organization_id);

CREATE TABLE IF NOT EXISTS strategic_initiatives (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  created_by TEXT NOT NULL DEFAULT '',
  user_id TEXT NOT NULL DEFAULT '',
  objective_id TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL DEFAULT 'Strategic initiative',
  owner TEXT NOT NULL DEFAULT 'Strategy Office',
  due_date TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'active',
  progress REAL NOT NULL DEFAULT 0,
  blockers_json TEXT NOT NULL DEFAULT '[]',
  dependencies_json TEXT NOT NULL DEFAULT '[]',
  budget_need REAL NOT NULL DEFAULT 0,
  capital_need REAL NOT NULL DEFAULT 0,
  linked_funding_round_id TEXT NOT NULL DEFAULT '',
  linked_risk_id TEXT NOT NULL DEFAULT '',
  payload_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_strategy_initiatives_org ON strategic_initiatives (organization_id);

CREATE TABLE IF NOT EXISTS strategic_scenarios (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  created_by TEXT NOT NULL DEFAULT '',
  user_id TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL DEFAULT 'Strategic scenario',
  assumptions_json TEXT NOT NULL DEFAULT '[]',
  upside TEXT NOT NULL DEFAULT '',
  downside TEXT NOT NULL DEFAULT '',
  recommended_action TEXT NOT NULL DEFAULT '',
  capital_impact REAL NOT NULL DEFAULT 0,
  risk_impact TEXT NOT NULL DEFAULT 'medium',
  probability REAL NOT NULL DEFAULT 50,
  confidence REAL NOT NULL DEFAULT 60,
  status TEXT NOT NULL DEFAULT 'draft',
  payload_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_strategy_scenarios_org ON strategic_scenarios (organization_id);

CREATE TABLE IF NOT EXISTS strategic_market_notes (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  created_by TEXT NOT NULL DEFAULT '',
  user_id TEXT NOT NULL DEFAULT '',
  market TEXT NOT NULL DEFAULT '',
  competitor TEXT NOT NULL DEFAULT '',
  signal TEXT NOT NULL DEFAULT '',
  implication TEXT NOT NULL DEFAULT '',
  source_evidence TEXT NOT NULL DEFAULT '',
  confidence REAL NOT NULL DEFAULT 60,
  status TEXT NOT NULL DEFAULT 'active',
  payload_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_strategy_market_notes_org ON strategic_market_notes (organization_id);

CREATE TABLE IF NOT EXISTS strategic_risks (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  created_by TEXT NOT NULL DEFAULT '',
  user_id TEXT NOT NULL DEFAULT '',
  risk TEXT NOT NULL DEFAULT 'Strategic risk',
  impact TEXT NOT NULL DEFAULT 'medium',
  mitigation TEXT NOT NULL DEFAULT '',
  linked_enterprise_risk_id TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'open',
  payload_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_strategy_risks_org ON strategic_risks (organization_id);

CREATE TABLE IF NOT EXISTS strategy_report_exports (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  created_by TEXT NOT NULL DEFAULT '',
  user_id TEXT NOT NULL DEFAULT '',
  report_type TEXT NOT NULL DEFAULT 'strategy_board_memo',
  title TEXT NOT NULL DEFAULT 'Strategy Board Memo',
  status TEXT NOT NULL DEFAULT 'generated',
  payload_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_strategy_reports_org ON strategy_report_exports (organization_id);
