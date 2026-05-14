CREATE TABLE IF NOT EXISTS enterprise_reports (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  created_by TEXT NOT NULL DEFAULT '',
  user_id TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL DEFAULT 'Enterprise report',
  module TEXT NOT NULL DEFAULT 'enterprise',
  report_type TEXT NOT NULL DEFAULT 'enterprise_readiness_report',
  status TEXT NOT NULL DEFAULT 'draft',
  owner TEXT NOT NULL DEFAULT 'Executive Office',
  version TEXT NOT NULL DEFAULT '1.0',
  last_exported_at TEXT NOT NULL DEFAULT '',
  evidence_completeness REAL NOT NULL DEFAULT 0,
  human_review_required REAL NOT NULL DEFAULT 1,
  payload_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_enterprise_reports_org ON enterprise_reports (organization_id);
CREATE INDEX IF NOT EXISTS idx_enterprise_reports_module ON enterprise_reports (organization_id, module);

CREATE TABLE IF NOT EXISTS report_templates (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  created_by TEXT NOT NULL DEFAULT '',
  user_id TEXT NOT NULL DEFAULT '',
  template_key TEXT NOT NULL DEFAULT '',
  module TEXT NOT NULL DEFAULT 'enterprise',
  structure_json TEXT NOT NULL DEFAULT '{}',
  required_sections_json TEXT NOT NULL DEFAULT '[]',
  required_evidence_json TEXT NOT NULL DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'active',
  payload_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_report_templates_org ON report_templates (organization_id);

CREATE TABLE IF NOT EXISTS report_versions (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  created_by TEXT NOT NULL DEFAULT '',
  user_id TEXT NOT NULL DEFAULT '',
  report_id TEXT NOT NULL DEFAULT '',
  version_number TEXT NOT NULL DEFAULT '1.0',
  change_summary TEXT NOT NULL DEFAULT '',
  source_entities_json TEXT NOT NULL DEFAULT '[]',
  payload_snapshot_json TEXT NOT NULL DEFAULT '{}',
  payload_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_report_versions_org ON report_versions (organization_id, report_id);

CREATE TABLE IF NOT EXISTS report_exports (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  created_by TEXT NOT NULL DEFAULT '',
  user_id TEXT NOT NULL DEFAULT '',
  report_id TEXT NOT NULL DEFAULT '',
  export_type TEXT NOT NULL DEFAULT 'pdf',
  exported_by TEXT NOT NULL DEFAULT '',
  exported_at TEXT NOT NULL DEFAULT '',
  checksum TEXT NOT NULL DEFAULT '',
  destination_note TEXT NOT NULL DEFAULT '',
  confidentiality_level TEXT NOT NULL DEFAULT 'confidential',
  payload_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_report_exports_org ON report_exports (organization_id);

CREATE TABLE IF NOT EXISTS report_schedules (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  created_by TEXT NOT NULL DEFAULT '',
  user_id TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL DEFAULT 'Scheduled report',
  schedule TEXT NOT NULL DEFAULT 'monthly',
  owner TEXT NOT NULL DEFAULT 'Executive Office',
  next_run TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'active',
  template_id TEXT NOT NULL DEFAULT '',
  payload_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_report_schedules_org ON report_schedules (organization_id);

CREATE TABLE IF NOT EXISTS report_evidence_links (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  created_by TEXT NOT NULL DEFAULT '',
  user_id TEXT NOT NULL DEFAULT '',
  report_id TEXT NOT NULL DEFAULT '',
  source_module TEXT NOT NULL DEFAULT '',
  source_entity_id TEXT NOT NULL DEFAULT '',
  evidence_title TEXT NOT NULL DEFAULT 'Report evidence',
  evidence_status TEXT NOT NULL DEFAULT 'missing',
  evidence_quality TEXT NOT NULL DEFAULT 'medium',
  human_review_required REAL NOT NULL DEFAULT 1,
  payload_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_report_evidence_org ON report_evidence_links (organization_id, report_id);

CREATE TABLE IF NOT EXISTS board_packs (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  created_by TEXT NOT NULL DEFAULT '',
  user_id TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL DEFAULT 'Board Executive Snapshot',
  status TEXT NOT NULL DEFAULT 'draft',
  sections_json TEXT NOT NULL DEFAULT '[]',
  source_modules_json TEXT NOT NULL DEFAULT '[]',
  executive_summary TEXT NOT NULL DEFAULT '',
  decisions_json TEXT NOT NULL DEFAULT '[]',
  risks_json TEXT NOT NULL DEFAULT '[]',
  financial_highlights_json TEXT NOT NULL DEFAULT '[]',
  compliance_highlights_json TEXT NOT NULL DEFAULT '[]',
  funding_highlights_json TEXT NOT NULL DEFAULT '[]',
  ma_highlights_json TEXT NOT NULL DEFAULT '[]',
  pmi_highlights_json TEXT NOT NULL DEFAULT '[]',
  governance_highlights_json TEXT NOT NULL DEFAULT '[]',
  completeness_score REAL NOT NULL DEFAULT 0,
  payload_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_board_packs_org ON board_packs (organization_id);
