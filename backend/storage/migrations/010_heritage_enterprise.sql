CREATE TABLE IF NOT EXISTS heritage_assets (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL DEFAULT 'Heritage asset',
  asset_type TEXT NOT NULL DEFAULT 'Operating company',
  jurisdiction TEXT NOT NULL DEFAULT '',
  estimated_value REAL NOT NULL DEFAULT 0,
  protection_status TEXT NOT NULL DEFAULT 'mapped',
  liquidity_profile TEXT NOT NULL DEFAULT 'medium',
  owner TEXT NOT NULL DEFAULT 'Owner',
  risk_level TEXT NOT NULL DEFAULT 'medium',
  payload_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_heritage_assets_org
  ON heritage_assets (organization_id);

CREATE INDEX IF NOT EXISTS idx_heritage_assets_type
  ON heritage_assets (organization_id, asset_type);

CREATE TABLE IF NOT EXISTS heritage_successions (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL DEFAULT 'Succession protocol',
  status TEXT NOT NULL DEFAULT 'draft',
  owner TEXT NOT NULL DEFAULT 'Family Office',
  successor TEXT NOT NULL DEFAULT '',
  readiness REAL NOT NULL DEFAULT 0,
  effective_date TEXT NOT NULL DEFAULT '',
  evidence_status TEXT NOT NULL DEFAULT 'pending',
  payload_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_heritage_successions_org
  ON heritage_successions (organization_id);

CREATE INDEX IF NOT EXISTS idx_heritage_successions_status
  ON heritage_successions (organization_id, status);

CREATE TABLE IF NOT EXISTS heritage_protections (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL DEFAULT 'Asset protection control',
  domain TEXT NOT NULL DEFAULT 'Legal',
  status TEXT NOT NULL DEFAULT 'active',
  owner TEXT NOT NULL DEFAULT 'Heritage Lead',
  coverage REAL NOT NULL DEFAULT 60,
  review_cadence TEXT NOT NULL DEFAULT 'quarterly',
  last_review_at TEXT NOT NULL DEFAULT '',
  next_review_at TEXT NOT NULL DEFAULT '',
  payload_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_heritage_protections_org
  ON heritage_protections (organization_id);

CREATE INDEX IF NOT EXISTS idx_heritage_protections_domain
  ON heritage_protections (organization_id, domain);
