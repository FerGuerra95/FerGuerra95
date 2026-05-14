CREATE TABLE IF NOT EXISTS bridge_reports (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL DEFAULT 'Bridge Network Memo',
  status TEXT NOT NULL DEFAULT 'generated',
  report_type TEXT NOT NULL DEFAULT 'network_memo',
  opportunity_id TEXT NOT NULL DEFAULT '',
  payload_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_bridge_reports_org
  ON bridge_reports (organization_id);

CREATE INDEX IF NOT EXISTS idx_bridge_reports_opportunity
  ON bridge_reports (organization_id, opportunity_id);

CREATE TABLE IF NOT EXISTS bridge_documents (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL DEFAULT 'Bridge document',
  document_type TEXT NOT NULL DEFAULT 'teaser',
  classification TEXT NOT NULL DEFAULT 'confidential',
  status TEXT NOT NULL DEFAULT 'registered',
  owner TEXT NOT NULL DEFAULT 'Bridge Lead',
  opportunity_id TEXT NOT NULL DEFAULT '',
  counterparty_id TEXT NOT NULL DEFAULT '',
  nda_status TEXT NOT NULL DEFAULT 'required',
  redaction_level TEXT NOT NULL DEFAULT 'redacted_teaser',
  payload_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_bridge_documents_org
  ON bridge_documents (organization_id);

CREATE INDEX IF NOT EXISTS idx_bridge_documents_opportunity
  ON bridge_documents (organization_id, opportunity_id);
