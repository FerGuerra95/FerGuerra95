CREATE TABLE IF NOT EXISTS pmi_cases (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  deal_name TEXT NOT NULL DEFAULT 'PMI case',
  buyer_name TEXT NOT NULL DEFAULT '',
  target_name TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'draft',
  integration_day REAL NOT NULL DEFAULT 0,
  synergy_target REAL NOT NULL DEFAULT 0,
  synergy_captured REAL NOT NULL DEFAULT 0,
  integration_budget REAL NOT NULL DEFAULT 0,
  integration_cost_used REAL NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'EUR',
  payload_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_pmi_cases_organization_id
  ON pmi_cases (organization_id);

CREATE INDEX IF NOT EXISTS idx_pmi_cases_status
  ON pmi_cases (organization_id, status);

CREATE INDEX IF NOT EXISTS idx_pmi_cases_deal_name
  ON pmi_cases (organization_id, deal_name);

CREATE TABLE IF NOT EXISTS ecosystem_records (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  branch TEXT NOT NULL,
  title TEXT NOT NULL DEFAULT 'Ecosystem record',
  status TEXT NOT NULL DEFAULT 'draft',
  score TEXT NOT NULL DEFAULT '',
  payload_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_ecosystem_records_organization_id
  ON ecosystem_records (organization_id);

CREATE INDEX IF NOT EXISTS idx_ecosystem_records_branch
  ON ecosystem_records (organization_id, branch);

CREATE INDEX IF NOT EXISTS idx_ecosystem_records_status
  ON ecosystem_records (organization_id, branch, status);
