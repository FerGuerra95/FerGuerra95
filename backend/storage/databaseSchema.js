import { execSql } from './sqliteStorage.js';
import { runSchemaMigrations } from './migrationRunner.js';

export function initializeDatabaseSchema() {
  execSql(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      applied_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      role TEXT NOT NULL DEFAULT 'viewer',
      organization_id TEXT NOT NULL,
      workspaces_json TEXT NOT NULL DEFAULT '[]',
      status TEXT NOT NULL DEFAULT 'active',
      password_hash TEXT NOT NULL,
      password_salt TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_users_email
      ON users (email);

    CREATE INDEX IF NOT EXISTS idx_users_organization_id
      ON users (organization_id);

    CREATE TABLE IF NOT EXISTS auth_sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      organization_id TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'active',
      created_at TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      revoked_at TEXT,
      last_seen_at TEXT,
      ip_hash TEXT,
      user_agent_hash TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_auth_sessions_user_id
      ON auth_sessions (user_id);

    CREATE INDEX IF NOT EXISTS idx_auth_sessions_organization_id
      ON auth_sessions (organization_id);

    CREATE INDEX IF NOT EXISTS idx_auth_sessions_status
      ON auth_sessions (status);

    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      organization_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      action TEXT NOT NULL,
      entity_type TEXT NOT NULL,
      entity_id TEXT NOT NULL DEFAULT '',
      metadata_json TEXT NOT NULL DEFAULT '{}',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_audit_logs_organization_id
      ON audit_logs (organization_id);

    CREATE INDEX IF NOT EXISTS idx_audit_logs_entity
      ON audit_logs (organization_id, entity_type, entity_id);

    CREATE INDEX IF NOT EXISTS idx_audit_logs_action
      ON audit_logs (organization_id, action);

    CREATE TABLE IF NOT EXISTS secure_share_links (
      id TEXT PRIMARY KEY,
      organization_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      report_id TEXT,
      token_hash TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'active',
      expires_at TEXT NOT NULL,
      revoked_at TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_secure_share_links_organization_id
      ON secure_share_links (organization_id);

    CREATE INDEX IF NOT EXISTS idx_secure_share_links_report_id
      ON secure_share_links (organization_id, report_id);

    CREATE TABLE IF NOT EXISTS compliance_suppliers (
      id TEXT PRIMARY KEY,
      organization_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      country TEXT NOT NULL DEFAULT 'Sin país',
      region TEXT NOT NULL DEFAULT 'Sin región',
      tier TEXT NOT NULL DEFAULT 'Tier 1',
      sector TEXT NOT NULL DEFAULT 'General',
      criticality TEXT NOT NULL DEFAULT 'Media',
      spend REAL NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'active',
      risk_score REAL NOT NULL DEFAULT 50,
      resilience_score REAL NOT NULL DEFAULT 50,
      last_review_at TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_compliance_suppliers_organization_id
      ON compliance_suppliers (organization_id);

    CREATE INDEX IF NOT EXISTS idx_compliance_suppliers_name
      ON compliance_suppliers (organization_id, name);

    CREATE INDEX IF NOT EXISTS idx_compliance_suppliers_status
      ON compliance_suppliers (organization_id, status);

    CREATE TABLE IF NOT EXISTS compliance_alerts (
      id TEXT PRIMARY KEY,
      organization_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      supplier_id TEXT NOT NULL,
      title TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT 'General Risk',
      severity TEXT NOT NULL DEFAULT 'medium',
      status TEXT NOT NULL DEFAULT 'open',
      source TEXT NOT NULL DEFAULT 'Manual',
      description TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_compliance_alerts_organization_id
      ON compliance_alerts (organization_id);

    CREATE INDEX IF NOT EXISTS idx_compliance_alerts_supplier_id
      ON compliance_alerts (supplier_id);

    CREATE INDEX IF NOT EXISTS idx_compliance_alerts_status
      ON compliance_alerts (organization_id, status);

    CREATE INDEX IF NOT EXISTS idx_compliance_alerts_organization_supplier
      ON compliance_alerts (organization_id, supplier_id);

    CREATE INDEX IF NOT EXISTS idx_compliance_alerts_organization_severity
      ON compliance_alerts (organization_id, severity);

    CREATE TABLE IF NOT EXISTS compliance_evidence (
      id TEXT PRIMARY KEY,
      organization_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      supplier_id TEXT NOT NULL,
      alert_id TEXT,
      title TEXT NOT NULL,
      source_type TEXT NOT NULL DEFAULT 'manual',
      source_url TEXT NOT NULL DEFAULT '',
      language TEXT NOT NULL DEFAULT 'es',
      excerpt TEXT NOT NULL DEFAULT '',
      translated_excerpt TEXT NOT NULL DEFAULT '',
      confidence REAL NOT NULL DEFAULT 0.7,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_compliance_evidence_organization_id
      ON compliance_evidence (organization_id);

    CREATE INDEX IF NOT EXISTS idx_compliance_evidence_supplier_id
      ON compliance_evidence (supplier_id);

    CREATE INDEX IF NOT EXISTS idx_compliance_evidence_alert_id
      ON compliance_evidence (alert_id);

    CREATE INDEX IF NOT EXISTS idx_compliance_evidence_organization_supplier
      ON compliance_evidence (organization_id, supplier_id);

    CREATE INDEX IF NOT EXISTS idx_compliance_evidence_organization_alert
      ON compliance_evidence (organization_id, alert_id);

    CREATE TABLE IF NOT EXISTS compliance_reviews (
      id TEXT PRIMARY KEY,
      organization_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      alert_id TEXT NOT NULL,
      supplier_id TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      reviewer TEXT NOT NULL DEFAULT '',
      decision TEXT NOT NULL DEFAULT '',
      notes TEXT NOT NULL DEFAULT '',
      decided_at TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_compliance_reviews_organization_id
      ON compliance_reviews (organization_id);

    CREATE INDEX IF NOT EXISTS idx_compliance_reviews_supplier_id
      ON compliance_reviews (supplier_id);

    CREATE INDEX IF NOT EXISTS idx_compliance_reviews_alert_id
      ON compliance_reviews (alert_id);

    CREATE INDEX IF NOT EXISTS idx_compliance_reviews_organization_status
      ON compliance_reviews (organization_id, status);

    CREATE INDEX IF NOT EXISTS idx_compliance_reviews_organization_supplier
      ON compliance_reviews (organization_id, supplier_id);

    CREATE INDEX IF NOT EXISTS idx_compliance_reviews_organization_alert
      ON compliance_reviews (organization_id, alert_id);

    CREATE TABLE IF NOT EXISTS compliance_reports (
      id TEXT PRIMARY KEY,
      organization_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      supplier_id TEXT,
      supplier_name TEXT NOT NULL DEFAULT '',
      title TEXT NOT NULL DEFAULT 'Compliance Report',
      type TEXT NOT NULL DEFAULT 'compliance',
      scope TEXT NOT NULL DEFAULT 'supplier',
      status TEXT NOT NULL DEFAULT 'generated',
      summary TEXT NOT NULL DEFAULT '',
      risk_score REAL,
      resilience_score REAL,
      risk_level TEXT NOT NULL DEFAULT '',
      resilience_level TEXT NOT NULL DEFAULT '',
      recommendations_json TEXT NOT NULL DEFAULT '[]',
      evidence_summary_json TEXT,
      items_json TEXT NOT NULL DEFAULT '[]',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_compliance_reports_organization_id
      ON compliance_reports (organization_id);

    CREATE INDEX IF NOT EXISTS idx_compliance_reports_supplier_id
      ON compliance_reports (supplier_id);

    CREATE INDEX IF NOT EXISTS idx_compliance_reports_organization_supplier
      ON compliance_reports (organization_id, supplier_id);

    CREATE INDEX IF NOT EXISTS idx_compliance_reports_organization_status
      ON compliance_reports (organization_id, status);

    CREATE TABLE IF NOT EXISTS ma_cases (
      id TEXT PRIMARY KEY,
      organization_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL DEFAULT 'Caso M&A',
      status TEXT NOT NULL DEFAULT 'draft',
      financials_json TEXT NOT NULL DEFAULT '{}',
      settings_json TEXT NOT NULL DEFAULT '{}',
      snapshot_json TEXT,
      snapshots_json TEXT NOT NULL DEFAULT '[]',
      last_snapshot_at TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_ma_cases_organization_id
      ON ma_cases (organization_id);

    CREATE INDEX IF NOT EXISTS idx_ma_cases_name
      ON ma_cases (organization_id, name);

    CREATE INDEX IF NOT EXISTS idx_ma_cases_status
      ON ma_cases (organization_id, status);

    CREATE INDEX IF NOT EXISTS idx_ma_cases_user
      ON ma_cases (organization_id, user_id);

    CREATE TABLE IF NOT EXISTS ma_reports (
      id TEXT PRIMARY KEY,
      organization_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      case_id TEXT,
      title TEXT NOT NULL DEFAULT 'M&A Report',
      type TEXT NOT NULL DEFAULT 'ma',
      status TEXT NOT NULL DEFAULT 'generated',
      payload_json TEXT NOT NULL DEFAULT '{}',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (case_id) REFERENCES ma_cases(id) ON DELETE SET NULL
    );

    CREATE INDEX IF NOT EXISTS idx_ma_reports_organization_id
      ON ma_reports (organization_id);

    CREATE INDEX IF NOT EXISTS idx_ma_reports_case_id
      ON ma_reports (case_id);

    CREATE INDEX IF NOT EXISTS idx_ma_reports_organization_case
      ON ma_reports (organization_id, case_id);

    CREATE INDEX IF NOT EXISTS idx_ma_reports_organization_status
      ON ma_reports (organization_id, status);

    INSERT INTO schema_migrations (id, name, applied_at)
    VALUES (
      '001_initial_runtime_schema',
      'Initial runtime schema for CEO OS MVP',
      datetime('now')
    )
    ON CONFLICT(id) DO NOTHING;
  `);

  runSchemaMigrations();
}

export default initializeDatabaseSchema;
