CREATE TABLE IF NOT EXISTS risk_committee_reviews (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  created_by TEXT NOT NULL DEFAULT '',
  user_id TEXT NOT NULL DEFAULT '',
  review_title TEXT NOT NULL DEFAULT 'Risk committee review',
  committee_name TEXT NOT NULL DEFAULT 'Risk Committee',
  meeting_date TEXT NOT NULL DEFAULT '',
  chair TEXT NOT NULL DEFAULT '',
  attendees_json TEXT NOT NULL DEFAULT '[]',
  agenda_json TEXT NOT NULL DEFAULT '[]',
  linked_risks_json TEXT NOT NULL DEFAULT '[]',
  decisions_json TEXT NOT NULL DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'draft',
  minutes_summary TEXT NOT NULL DEFAULT '',
  payload_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_risk_committee_reviews_org
  ON risk_committee_reviews (organization_id);

CREATE TABLE IF NOT EXISTS risk_evidence_links (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  created_by TEXT NOT NULL DEFAULT '',
  user_id TEXT NOT NULL DEFAULT '',
  risk_id TEXT NOT NULL DEFAULT '',
  linked_entity_type TEXT NOT NULL DEFAULT 'risk',
  linked_entity_id TEXT NOT NULL DEFAULT '',
  evidence_title TEXT NOT NULL DEFAULT 'Risk evidence',
  evidence_type TEXT NOT NULL DEFAULT 'document',
  evidence_quality TEXT NOT NULL DEFAULT 'medium',
  source_module TEXT NOT NULL DEFAULT 'Risk',
  reviewer TEXT NOT NULL DEFAULT '',
  review_status TEXT NOT NULL DEFAULT 'pending',
  human_review_note TEXT NOT NULL DEFAULT '',
  payload_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_risk_evidence_links_org
  ON risk_evidence_links (organization_id);

CREATE TABLE IF NOT EXISTS risk_notifications (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  created_by TEXT NOT NULL DEFAULT '',
  user_id TEXT NOT NULL DEFAULT '',
  notification_type TEXT NOT NULL DEFAULT 'risk_update_required',
  target_role TEXT NOT NULL DEFAULT 'executive',
  title TEXT NOT NULL DEFAULT 'Risk update required',
  message TEXT NOT NULL DEFAULT '',
  severity TEXT NOT NULL DEFAULT 'watch',
  status TEXT NOT NULL DEFAULT 'queued',
  linked_risk_id TEXT NOT NULL DEFAULT '',
  payload_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_risk_notifications_org
  ON risk_notifications (organization_id);
