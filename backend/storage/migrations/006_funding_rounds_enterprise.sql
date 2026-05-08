CREATE TABLE IF NOT EXISTS funding_rounds (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  user_id TEXT,
  funding_case_id TEXT,
  round_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  amount_raised REAL NOT NULL DEFAULT 0,
  valuation_pre_money REAL,
  valuation_post_money REAL,
  dilution_percentage REAL,
  investor_name TEXT,
  closing_date TEXT,
  monthly_burn_rate REAL,
  current_cash REAL,
  projected_runway_months REAL,
  risk_status TEXT DEFAULT 'normal',
  payload_json TEXT NOT NULL DEFAULT '{}',
  notes TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_funding_rounds_org
  ON funding_rounds (organization_id);

CREATE INDEX IF NOT EXISTS idx_funding_rounds_org_created_at
  ON funding_rounds (organization_id, created_at);

CREATE INDEX IF NOT EXISTS idx_funding_rounds_org_status
  ON funding_rounds (organization_id, status);

CREATE INDEX IF NOT EXISTS idx_funding_rounds_org_closing_date
  ON funding_rounds (organization_id, closing_date);
