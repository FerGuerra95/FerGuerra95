CREATE TABLE IF NOT EXISTS pmi_programs (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  created_by TEXT NOT NULL DEFAULT '',
  user_id TEXT NOT NULL DEFAULT '',
  acquisition_name TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL DEFAULT 'PMI Program',
  strategic_rationale TEXT NOT NULL DEFAULT '',
  integration_thesis TEXT NOT NULL DEFAULT '',
  integration_phase TEXT NOT NULL DEFAULT 'planning',
  owner TEXT NOT NULL DEFAULT 'PMI Lead',
  sponsor TEXT NOT NULL DEFAULT '',
  integration_manager TEXT NOT NULL DEFAULT '',
  linked_ma_deal_id TEXT NOT NULL DEFAULT '',
  start_date TEXT NOT NULL DEFAULT '',
  target_completion_date TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'active',
  integration_scope TEXT NOT NULL DEFAULT '',
  target_operating_model TEXT NOT NULL DEFAULT '',
  value_creation_thesis TEXT NOT NULL DEFAULT '',
  status_notes TEXT NOT NULL DEFAULT '',
  payload_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_pmi_programs_org ON pmi_programs (organization_id);

CREATE TABLE IF NOT EXISTS pmi_synergy_initiatives (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  created_by TEXT NOT NULL DEFAULT '',
  user_id TEXT NOT NULL DEFAULT '',
  program_id TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL DEFAULT 'Synergy initiative',
  synergy_type TEXT NOT NULL DEFAULT 'cost',
  target_value REAL NOT NULL DEFAULT 0,
  captured_value REAL NOT NULL DEFAULT 0,
  annualized_value REAL NOT NULL DEFAULT 0,
  one_time_cost REAL NOT NULL DEFAULT 0,
  confidence_level REAL NOT NULL DEFAULT 50,
  owner TEXT NOT NULL DEFAULT 'PMI Lead',
  status TEXT NOT NULL DEFAULT 'identified',
  due_date TEXT NOT NULL DEFAULT '',
  evidence_json TEXT NOT NULL DEFAULT '[]',
  dependencies_json TEXT NOT NULL DEFAULT '[]',
  value_leakage_risk TEXT NOT NULL DEFAULT 'medium',
  realization_date TEXT NOT NULL DEFAULT '',
  finance_validation_status TEXT NOT NULL DEFAULT 'pending',
  payload_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_pmi_synergies_org ON pmi_synergy_initiatives (organization_id);

CREATE TABLE IF NOT EXISTS pmi_milestones (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  created_by TEXT NOT NULL DEFAULT '',
  user_id TEXT NOT NULL DEFAULT '',
  program_id TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL DEFAULT 'Integration milestone',
  category TEXT NOT NULL DEFAULT 'operations',
  owner TEXT NOT NULL DEFAULT 'PMI Lead',
  due_date TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'pending',
  progress REAL NOT NULL DEFAULT 0,
  dependencies_json TEXT NOT NULL DEFAULT '[]',
  blockers_json TEXT NOT NULL DEFAULT '[]',
  linked_synergy_id TEXT NOT NULL DEFAULT '',
  evidence_json TEXT NOT NULL DEFAULT '[]',
  escalation TEXT NOT NULL DEFAULT 'none',
  critical_path_flag REAL NOT NULL DEFAULT 0,
  payload_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_pmi_milestones_org ON pmi_milestones (organization_id);

CREATE TABLE IF NOT EXISTS pmi_risks (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  created_by TEXT NOT NULL DEFAULT '',
  user_id TEXT NOT NULL DEFAULT '',
  program_id TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL DEFAULT 'Integration risk',
  risk_area TEXT NOT NULL DEFAULT 'operations',
  severity TEXT NOT NULL DEFAULT 'medium',
  likelihood REAL NOT NULL DEFAULT 2,
  impact REAL NOT NULL DEFAULT 2,
  mitigation TEXT NOT NULL DEFAULT '',
  owner TEXT NOT NULL DEFAULT 'PMI Lead',
  status TEXT NOT NULL DEFAULT 'open',
  linked_compliance_alert_id TEXT NOT NULL DEFAULT '',
  linked_milestone_id TEXT NOT NULL DEFAULT '',
  residual_risk TEXT NOT NULL DEFAULT 'medium',
  escalation_status TEXT NOT NULL DEFAULT 'none',
  payload_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_pmi_risks_org ON pmi_risks (organization_id);

CREATE TABLE IF NOT EXISTS pmi_day1_checklist (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  created_by TEXT NOT NULL DEFAULT '',
  user_id TEXT NOT NULL DEFAULT '',
  program_id TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL DEFAULT 'Day 1 readiness item',
  checklist_area TEXT NOT NULL DEFAULT 'governance',
  owner TEXT NOT NULL DEFAULT 'PMI Lead',
  status TEXT NOT NULL DEFAULT 'pending',
  readiness_score REAL NOT NULL DEFAULT 0,
  evidence_json TEXT NOT NULL DEFAULT '[]',
  blocker_notes TEXT NOT NULL DEFAULT '',
  payload_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_pmi_day1_org ON pmi_day1_checklist (organization_id);

CREATE TABLE IF NOT EXISTS pmi_100_day_plan (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  created_by TEXT NOT NULL DEFAULT '',
  user_id TEXT NOT NULL DEFAULT '',
  program_id TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL DEFAULT '100-day plan item',
  period TEXT NOT NULL DEFAULT 'day_30',
  priorities_json TEXT NOT NULL DEFAULT '[]',
  completed_actions_json TEXT NOT NULL DEFAULT '[]',
  delayed_actions_json TEXT NOT NULL DEFAULT '[]',
  critical_blockers_json TEXT NOT NULL DEFAULT '[]',
  value_capture_progress REAL NOT NULL DEFAULT 0,
  committee_decisions_required_json TEXT NOT NULL DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'in_progress',
  owner TEXT NOT NULL DEFAULT 'PMI Lead',
  payload_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_pmi_day100_org ON pmi_100_day_plan (organization_id);

CREATE TABLE IF NOT EXISTS pmi_transition_services (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  created_by TEXT NOT NULL DEFAULT '',
  user_id TEXT NOT NULL DEFAULT '',
  program_id TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL DEFAULT 'TSA item',
  provider TEXT NOT NULL DEFAULT '',
  receiver TEXT NOT NULL DEFAULT '',
  service_area TEXT NOT NULL DEFAULT '',
  start_date TEXT NOT NULL DEFAULT '',
  end_date TEXT NOT NULL DEFAULT '',
  cost REAL NOT NULL DEFAULT 0,
  risk TEXT NOT NULL DEFAULT 'medium',
  owner TEXT NOT NULL DEFAULT 'PMI Lead',
  exit_plan TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'active',
  payload_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_pmi_tsa_org ON pmi_transition_services (organization_id);

CREATE TABLE IF NOT EXISTS pmi_operating_model_items (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  created_by TEXT NOT NULL DEFAULT '',
  user_id TEXT NOT NULL DEFAULT '',
  program_id TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL DEFAULT 'Operating model item',
  target_operating_model_notes TEXT NOT NULL DEFAULT '',
  org_structure_dependencies_json TEXT NOT NULL DEFAULT '[]',
  systems_integration_dependencies_json TEXT NOT NULL DEFAULT '[]',
  process_harmonization TEXT NOT NULL DEFAULT '',
  reporting_lines TEXT NOT NULL DEFAULT '',
  decision_rights TEXT NOT NULL DEFAULT '',
  governance_cadence TEXT NOT NULL DEFAULT '',
  owner TEXT NOT NULL DEFAULT 'PMI Lead',
  status TEXT NOT NULL DEFAULT 'draft',
  payload_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_pmi_operating_model_org ON pmi_operating_model_items (organization_id);

CREATE TABLE IF NOT EXISTS pmi_people_culture_items (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  created_by TEXT NOT NULL DEFAULT '',
  user_id TEXT NOT NULL DEFAULT '',
  program_id TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL DEFAULT 'People and culture item',
  key_people_risk TEXT NOT NULL DEFAULT 'medium',
  retention_plan TEXT NOT NULL DEFAULT '',
  cultural_integration_notes TEXT NOT NULL DEFAULT '',
  communication_plan TEXT NOT NULL DEFAULT '',
  labor_dependency_note TEXT NOT NULL DEFAULT '',
  leadership_alignment TEXT NOT NULL DEFAULT '',
  owner TEXT NOT NULL DEFAULT 'PMI Lead',
  status TEXT NOT NULL DEFAULT 'active',
  payload_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_pmi_people_org ON pmi_people_culture_items (organization_id);

CREATE TABLE IF NOT EXISTS pmi_technology_items (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  created_by TEXT NOT NULL DEFAULT '',
  user_id TEXT NOT NULL DEFAULT '',
  program_id TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL DEFAULT 'Technology integration item',
  systems_inventory_json TEXT NOT NULL DEFAULT '[]',
  integration_approach TEXT NOT NULL DEFAULT '',
  cyber_security_dependencies_json TEXT NOT NULL DEFAULT '[]',
  data_migration_risk TEXT NOT NULL DEFAULT 'medium',
  tsa_technology_dependency TEXT NOT NULL DEFAULT '',
  owner TEXT NOT NULL DEFAULT 'Technology Lead',
  status TEXT NOT NULL DEFAULT 'active',
  payload_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_pmi_technology_org ON pmi_technology_items (organization_id);

CREATE TABLE IF NOT EXISTS pmi_report_exports (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  created_by TEXT NOT NULL DEFAULT '',
  user_id TEXT NOT NULL DEFAULT '',
  report_type TEXT NOT NULL DEFAULT 'pmi_executive_integration_memo',
  title TEXT NOT NULL DEFAULT 'PMI Report',
  status TEXT NOT NULL DEFAULT 'generated',
  payload_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_pmi_reports_org ON pmi_report_exports (organization_id);
