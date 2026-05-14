CREATE TABLE IF NOT EXISTS heritage_reports (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL DEFAULT 'Heritage Continuity Report',
  status TEXT NOT NULL DEFAULT 'generated',
  report_type TEXT NOT NULL DEFAULT 'continuity',
  payload_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_heritage_reports_org
  ON heritage_reports (organization_id);

CREATE TABLE IF NOT EXISTS heritage_documents (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL DEFAULT 'Heritage document',
  document_type TEXT NOT NULL DEFAULT 'evidence',
  classification TEXT NOT NULL DEFAULT 'confidential',
  status TEXT NOT NULL DEFAULT 'registered',
  owner TEXT NOT NULL DEFAULT 'Heritage Lead',
  linked_entity_type TEXT NOT NULL DEFAULT '',
  linked_entity_id TEXT NOT NULL DEFAULT '',
  evidence_status TEXT NOT NULL DEFAULT 'pending',
  review_due_at TEXT NOT NULL DEFAULT '',
  payload_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_heritage_documents_org
  ON heritage_documents (organization_id);

CREATE INDEX IF NOT EXISTS idx_heritage_documents_linked_entity
  ON heritage_documents (organization_id, linked_entity_type, linked_entity_id);
