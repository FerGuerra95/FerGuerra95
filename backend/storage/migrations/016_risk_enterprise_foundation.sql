CREATE TABLE IF NOT EXISTS risk_register (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  created_by TEXT NOT NULL DEFAULT '',
  user_id TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL DEFAULT 'Enterprise risk',
  category TEXT NOT NULL DEFAULT 'operational',
  description TEXT NOT NULL DEFAULT '',
  inherent_severity TEXT NOT NULL DEFAULT 'medium',
  likelihood REAL NOT NULL DEFAULT 2,
  impact REAL NOT NULL DEFAULT 2,
  residual_risk TEXT NOT NULL DEFAULT 'medium',
  owner TEXT NOT NULL DEFAULT 'Risk Owner',
  status TEXT NOT NULL DEFAULT 'open',
  mitigation TEXT NOT NULL DEFAULT '',
  linked_module TEXT NOT NULL DEFAULT '',
  linked_entity_id TEXT NOT NULL DEFAULT '',
  review_date TEXT NOT NULL DEFAULT '',
  payload_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_risk_register_org ON risk_register (organization_id);
CREATE INDEX IF NOT EXISTS idx_risk_register_status ON risk_register (organization_id, status);

CREATE TABLE IF NOT EXISTS risk_controls (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  created_by TEXT NOT NULL DEFAULT '',
  user_id TEXT NOT NULL DEFAULT '',
  risk_id TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL DEFAULT 'Risk control',
  control_type TEXT NOT NULL DEFAULT 'preventive',
  owner TEXT NOT NULL DEFAULT 'Control Owner',
  frequency TEXT NOT NULL DEFAULT 'quarterly',
  status TEXT NOT NULL DEFAULT 'active',
  evidence_json TEXT NOT NULL DEFAULT '[]',
  last_tested_date TEXT NOT NULL DEFAULT '',
  effectiveness REAL NOT NULL DEFAULT 0,
  payload_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_risk_controls_org ON risk_controls (organization_id);

CREATE TABLE IF NOT EXISTS risk_mitigations (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  created_by TEXT NOT NULL DEFAULT '',
  user_id TEXT NOT NULL DEFAULT '',
  risk_id TEXT NOT NULL DEFAULT '',
  action TEXT NOT NULL DEFAULT 'Mitigation action',
  owner TEXT NOT NULL DEFAULT 'Risk Owner',
  due_date TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'open',
  progress REAL NOT NULL DEFAULT 0,
  blockers TEXT NOT NULL DEFAULT '',
  payload_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_risk_mitigations_org ON risk_mitigations (organization_id);

CREATE TABLE IF NOT EXISTS risk_incidents (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  created_by TEXT NOT NULL DEFAULT '',
  user_id TEXT NOT NULL DEFAULT '',
  incident_date TEXT NOT NULL DEFAULT '',
  severity TEXT NOT NULL DEFAULT 'medium',
  description TEXT NOT NULL DEFAULT '',
  impacted_area TEXT NOT NULL DEFAULT '',
  resolution TEXT NOT NULL DEFAULT '',
  root_cause TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'open',
  linked_risk_id TEXT NOT NULL DEFAULT '',
  payload_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_risk_incidents_org ON risk_incidents (organization_id);

CREATE TABLE IF NOT EXISTS risk_kri_metrics (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  created_by TEXT NOT NULL DEFAULT '',
  user_id TEXT NOT NULL DEFAULT '',
  metric TEXT NOT NULL DEFAULT 'KRI metric',
  threshold REAL NOT NULL DEFAULT 0,
  actual_value REAL NOT NULL DEFAULT 0,
  breach_flag REAL NOT NULL DEFAULT 0,
  trend TEXT NOT NULL DEFAULT 'stable',
  owner TEXT NOT NULL DEFAULT 'Risk Owner',
  payload_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_risk_kri_org ON risk_kri_metrics (organization_id);

CREATE TABLE IF NOT EXISTS risk_appetite_statements (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  created_by TEXT NOT NULL DEFAULT '',
  user_id TEXT NOT NULL DEFAULT '',
  appetite_statement TEXT NOT NULL DEFAULT 'Risk appetite statement',
  metric TEXT NOT NULL DEFAULT '',
  threshold REAL NOT NULL DEFAULT 0,
  breach_handling TEXT NOT NULL DEFAULT '',
  owner TEXT NOT NULL DEFAULT 'Risk Committee',
  breach_flag REAL NOT NULL DEFAULT 0,
  payload_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_risk_appetite_org ON risk_appetite_statements (organization_id);

CREATE TABLE IF NOT EXISTS risk_report_exports (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  created_by TEXT NOT NULL DEFAULT '',
  user_id TEXT NOT NULL DEFAULT '',
  report_type TEXT NOT NULL DEFAULT 'enterprise_risk_brief',
  title TEXT NOT NULL DEFAULT 'Enterprise Risk Brief',
  status TEXT NOT NULL DEFAULT 'generated',
  payload_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_risk_reports_org ON risk_report_exports (organization_id);
