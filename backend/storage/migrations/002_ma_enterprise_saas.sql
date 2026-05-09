CREATE TABLE IF NOT EXISTS ma_deals (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  case_id TEXT,
  name TEXT NOT NULL DEFAULT 'M&A Deal',
  stage TEXT NOT NULL DEFAULT 'screening',
  owner_name TEXT NOT NULL DEFAULT '',
  priority TEXT NOT NULL DEFAULT 'medium',
  risk_level TEXT NOT NULL DEFAULT 'medium',
  status TEXT NOT NULL DEFAULT 'active',
  next_step TEXT NOT NULL DEFAULT '',
  ic_memo_status TEXT NOT NULL DEFAULT 'not_started',
  expected_close_at TEXT,
  payload_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (case_id) REFERENCES ma_cases(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_ma_deals_organization_id
  ON ma_deals (organization_id);

CREATE INDEX IF NOT EXISTS idx_ma_deals_organization_stage
  ON ma_deals (organization_id, stage);

CREATE INDEX IF NOT EXISTS idx_ma_deals_organization_status
  ON ma_deals (organization_id, status);

CREATE INDEX IF NOT EXISTS idx_ma_deals_case_id
  ON ma_deals (organization_id, case_id);

CREATE TABLE IF NOT EXISTS ma_data_room_documents (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  case_id TEXT,
  report_id TEXT,
  share_id TEXT,
  title TEXT NOT NULL DEFAULT 'M&A Document',
  document_type TEXT NOT NULL DEFAULT 'report',
  classification TEXT NOT NULL DEFAULT 'confidential',
  status TEXT NOT NULL DEFAULT 'draft',
  payload_json TEXT NOT NULL DEFAULT '{}',
  last_accessed_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (case_id) REFERENCES ma_cases(id) ON DELETE SET NULL,
  FOREIGN KEY (report_id) REFERENCES ma_reports(id) ON DELETE SET NULL,
  FOREIGN KEY (share_id) REFERENCES secure_share_links(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_ma_data_room_documents_organization_id
  ON ma_data_room_documents (organization_id);

CREATE INDEX IF NOT EXISTS idx_ma_data_room_documents_case_id
  ON ma_data_room_documents (organization_id, case_id);

CREATE INDEX IF NOT EXISTS idx_ma_data_room_documents_report_id
  ON ma_data_room_documents (organization_id, report_id);

CREATE INDEX IF NOT EXISTS idx_ma_data_room_documents_status
  ON ma_data_room_documents (organization_id, status);

CREATE UNIQUE INDEX IF NOT EXISTS idx_ma_data_room_documents_share_id
  ON ma_data_room_documents (organization_id, share_id)
  WHERE share_id IS NOT NULL;
