CREATE TABLE IF NOT EXISTS compliance_audit_runs (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  scope TEXT NOT NULL DEFAULT 'portfolio',
  framework TEXT NOT NULL DEFAULT 'all',
  status TEXT NOT NULL DEFAULT 'completed',
  score REAL NOT NULL DEFAULT 0,
  critical_findings INTEGER NOT NULL DEFAULT 0,
  payload_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_compliance_audit_runs_org
  ON compliance_audit_runs (organization_id, framework, created_at);

CREATE INDEX IF NOT EXISTS idx_compliance_audit_runs_status
  ON compliance_audit_runs (organization_id, status);

CREATE TABLE IF NOT EXISTS compliance_rule_results (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  audit_run_id TEXT NOT NULL,
  supplier_id TEXT,
  ma_case_id TEXT,
  rule_id TEXT NOT NULL,
  framework TEXT NOT NULL,
  control_ref TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'warning',
  severity TEXT NOT NULL DEFAULT 'medium',
  score_impact REAL NOT NULL DEFAULT 0,
  title TEXT NOT NULL,
  explanation TEXT NOT NULL DEFAULT '',
  required_evidence_type TEXT NOT NULL DEFAULT '',
  payload_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (audit_run_id) REFERENCES compliance_audit_runs(id) ON DELETE CASCADE,
  FOREIGN KEY (supplier_id) REFERENCES compliance_suppliers(id) ON DELETE SET NULL,
  FOREIGN KEY (ma_case_id) REFERENCES ma_cases(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_compliance_rule_results_org
  ON compliance_rule_results (organization_id, audit_run_id);

CREATE INDEX IF NOT EXISTS idx_compliance_rule_results_rule
  ON compliance_rule_results (organization_id, rule_id);

CREATE INDEX IF NOT EXISTS idx_compliance_rule_results_supplier
  ON compliance_rule_results (organization_id, supplier_id, severity);

CREATE INDEX IF NOT EXISTS idx_compliance_rule_results_ma
  ON compliance_rule_results (organization_id, ma_case_id, severity);

CREATE TABLE IF NOT EXISTS compliance_rule_evidence_links (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  rule_result_id TEXT NOT NULL,
  evidence_id TEXT NOT NULL,
  link_status TEXT NOT NULL DEFAULT 'linked',
  citation_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (rule_result_id) REFERENCES compliance_rule_results(id) ON DELETE CASCADE,
  FOREIGN KEY (evidence_id) REFERENCES compliance_evidence(id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_compliance_rule_evidence_unique
  ON compliance_rule_evidence_links (organization_id, rule_result_id, evidence_id);

CREATE INDEX IF NOT EXISTS idx_compliance_rule_evidence_evidence
  ON compliance_rule_evidence_links (organization_id, evidence_id);

CREATE TABLE IF NOT EXISTS compliance_ma_risk_impacts (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  ma_case_id TEXT NOT NULL,
  audit_run_id TEXT NOT NULL,
  legal_risk_score REAL NOT NULL DEFAULT 0,
  ebitda_multiple_delta REAL NOT NULL DEFAULT 0,
  rationale TEXT NOT NULL DEFAULT '',
  payload_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (ma_case_id) REFERENCES ma_cases(id) ON DELETE CASCADE,
  FOREIGN KEY (audit_run_id) REFERENCES compliance_audit_runs(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_compliance_ma_risk_impacts_case
  ON compliance_ma_risk_impacts (organization_id, ma_case_id, created_at);

CREATE INDEX IF NOT EXISTS idx_compliance_ma_risk_impacts_audit
  ON compliance_ma_risk_impacts (organization_id, audit_run_id);
