# CEO's OS — Current SQLite Data Model

**Evidence baseline:** Astra, 17 September 2026. **VERIFIED FACT:** immutable read-only inspection of the checkpointed default SQLite file observed **93 tables** and **22 migration records**. WAL existed and was excluded by that inspection; identity/parity of the running process's database and newest WAL state remain **UNVERIFIED**. These counts describe that observation, not every deployment.

## Active schema and migration authority

- `backend/storage/sqliteStorage.js`: path resolution, connection and pragmas.
- `backend/storage/databaseSchema.js`: runtime base schema.
- `backend/storage/migrationRunner.js` and `backend/storage/migrations/`: applied versioned SQL.
- `backend/storage/sqliteEntityStore.service.js`: shared entity access and organization-scoped operations.
- Old `backend/db/` SQL is not the active migration authority.

Configured pragmas include WAL, foreign keys ON, busy timeout and NORMAL synchronous mode. Existing `CREATE TABLE IF NOT EXISTS` definitions do not retrofit newly declared constraints into already-created tables.

## Tenant and identity posture

All observed tables have an id primary key. **91 contain `organization_id`** and each has an organization-leading index. Exceptions: `schema_migrations` and `password_reset_tokens`; reset tokens link to users by FK.

There are no general organization, membership, role, permission or tenant-policy master tables. Tenant scope comes from authenticated user/session context and organization-scoped rows. Roles/permissions are represented in code/user data, not a general relational policy model.

Most records have created/updated timestamps; sessions and reset tokens instead include lifecycle times, Board Review audit events are append-style created records, and migration records have applied times. Payload/metadata JSON carries many domain fields and relationships.

## Observed table inventory — 93

### Platform (5)

`users`, `auth_sessions`, `password_reset_tokens`, `audit_logs`, `schema_migrations`.

### M&A (5)

`ma_cases`, `ma_deals`, `ma_reports`, `ma_data_room_documents`, `secure_share_links`.

### Compliance (9)

`compliance_suppliers`, `compliance_alerts`, `compliance_evidence`, `compliance_reviews`, `compliance_reports`, `compliance_audit_runs`, `compliance_rule_results`, `compliance_rule_evidence_links`, `compliance_ma_risk_impacts`.

### Funding (3)

`funding_rounds`, `funding_snapshots`, `funding_board_memos`.

### PMI (12)

`pmi_cases`, `pmi_programs`, `pmi_synergy_initiatives`, `pmi_milestones`, `pmi_risks`, `pmi_day1_checklist`, `pmi_100_day_plan`, `pmi_transition_services`, `pmi_operating_model_items`, `pmi_people_culture_items`, `pmi_technology_items`, `pmi_report_exports`.

### Ecosystem (1)

`ecosystem_records`.

### Bridge (12)

`bridge_opportunities`, `bridge_counterparties`, `bridge_introductions`, `bridge_reports`, `bridge_documents`, `bridge_signals`, `bridge_dependencies`, `bridge_conflicts`, `bridge_attention_queue`, `bridge_evidence_links`, `bridge_snapshots`, `bridge_signal_history`.

### Governance (10)

`governance_decisions`, `governance_controls`, `governance_esg_metrics`, `governance_board_packs`, `governance_committees`, `governance_policies`, `governance_action_items`, `governance_meetings`, `governance_approval_history`, `governance_report_exports`.

### Heritage (5)

`heritage_assets`, `heritage_successions`, `heritage_protections`, `heritage_reports`, `heritage_documents`.

### Risk (10)

`risk_register`, `risk_controls`, `risk_mitigations`, `risk_incidents`, `risk_kri_metrics`, `risk_appetite_statements`, `risk_report_exports`, `risk_committee_reviews`, `risk_evidence_links`, `risk_notifications`.

### Reporting (9)

`enterprise_reports`, `report_templates`, `report_versions`, `report_exports`, `report_schedules`, `report_evidence_links`, `board_packs`, `board_review_snapshots`, `board_review_audit_events`.

### Strategy (6)

`strategic_objectives`, `strategic_initiatives`, `strategic_scenarios`, `strategic_market_notes`, `strategic_risks`, `strategy_report_exports`.

### Executive (6)

`executive_signals`, `executive_decision_queue`, `executive_board_views`, `executive_reports`, `executive_snapshots`, `executive_calendar_items`.

## Foreign keys and A28 schema drift

**86 of 93 observed tables have no declared FK.** Seven have declared relationships:

| Child table | Observed referenced records / action |
|---|---|
| `ma_deals` | case → `ma_cases`, SET NULL |
| `ma_data_room_documents` | case/report/share → `ma_cases` / `ma_reports` / `secure_share_links`, SET NULL |
| `compliance_rule_results` | audit run CASCADE; supplier/case SET NULL |
| `compliance_rule_evidence_links` | rule result/evidence CASCADE |
| `compliance_ma_risk_impacts` | case/audit run CASCADE |
| `funding_board_memos` | snapshot CASCADE |
| `password_reset_tokens` | user CASCADE |

The current schema source declares auth-session→user and M&A-report→case relationships absent from the inspected existing tables. **A28 remains OPEN.** Fresh and upgraded database constraints need isolated parity validation.

FKs generally reference IDs, not composite tenant+ID keys. Missing FKs do **not** automatically equal tenant leakage; tenant-safe relationships must be enforced by schema and/or tested service ownership checks. Conversely, a row-level organization filter does not prove that its linked file or record belongs to the same tenant.

## Domain relationships and persistence meaning

M&A cases and deals are distinct entities. Valuation is frontend-derived data/snapshots stored through case/report payloads, not a separate authoritative valuation-engine table. Stable case/deal/report/document/share linkage is incomplete (A10/A14/A19). Historical conceptual Valuation/BuyerMatch/Organization models below are not physical tables.

Funding rounds/snapshots/memos coexist with browser drafts. PMI case payload/ledger coexists with enterprise initiative tables. Reporting Board Review snapshots own persisted workflow/renderer input; source-module business values retain their module ownership.

## VDR database/filesystem boundary

`ma_data_room_documents` stores metadata and nested storage/access/governance payloads; bytes are filesystem objects under the configured VDR root. Normal upload constructs organization/document/version paths, but metadata mutation can accept a client storage reference and download checks only root containment (A01 P0). Database row scoping therefore does not close physical-file ownership.

Secure shares reference stored reports with token hash, expiry and revocation. File recovery needs both DB metadata and matching objects. Watermark handling is header-level, not proof that the file bytes contain a watermark.

## Archive/delete/retention differences

- Current dirty M&A case deletion soft-archives; normal list excludes archived cases, while direct case access and linked deals/reports/shares/documents can remain. This is not a cascading revocation/erasure contract.
- M&A deals use hard delete. VDR archive/revoke blocks document download; legal-hold metadata can block archive until released.
- Compliance supplier cleanup performs sequential related hard deletes; atomicity and actor/audit behavior require validation.
- Reporting Board Review workflow has archive/revoke lifecycle fields. Other module “delete” behaviors are not a unified platform retention policy.
- No universal retention/legal-hold schema or purge executor was established. VDR controls are partial (A32); same authorized manager can release hold and then archive.

## TARGET — not implemented

Approve explicit identity/version and tenant relationship contracts; reconcile fresh/upgraded schema through a separately authorized migration; define archive/delete/revoke semantics; bind file references server-side; establish durable audit and coordinated DB/VDR backup/retention. Do not infer a mandatory Postgres rewrite or add tables through this documentation pass.

See [Source of Truth](architecture/SOURCE_OF_TRUTH_REGISTRY.md), [debt register](product/CODEBASE_ROBUSTNESS_AUDIT.md) and [test isolation](testing/TEST_STRATEGY.md).


## Historical record — superseded for current status

Preserved verbatim (earlier conceptual model; original date not recorded). Every PASS, CLOSED, READY, RESOLVED, “current” owner and next action below belongs to its historical phase. Current 17 September 2026 sections above take precedence. Historical test output is not current validation.

<details>
<summary>Historical content — not current release evidence</summary>

# Modelo de Datos

## Entidades comunes
### User
- id
- name
- email
- role
- organizationId
- createdAt

### Organization
- id
- name
- plan
- createdAt

### File
- id
- organizationId
- ownerId
- module
- filename
- mimeType
- storagePath
- createdAt

## M&A
### Case
- id
- organizationId
- name
- sector
- status
- createdAt
- updatedAt

### Valuation
- id
- caseId
- normalizedEbitda
- netDebt
- equityBase
- adjustedMultiple
- qualityScore
- createdAt

### BuyerMatch
- id
- caseId
- buyerType
- title
- fitScore
- description

### Report
- id
- caseId
- type
- version
- htmlPath
- pdfPath
- createdAt

## Compliance
### Supplier
- id
- organizationId
- name
- country
- sector
- tier
- status
- createdAt
- updatedAt

### SupplierSite
- id
- supplierId
- country
- region
- city
- address
- latitude
- longitude

### Alert
- id
- supplierId
- type
- severity
- title
- status
- sourceCount
- detectedAt

### Evidence
- id
- supplierId
- alertId
- sourceType
- sourceUrl
- sourceLanguage
- translatedLanguage
- excerpt
- screenshotPath
- createdAt

### Citation
- id
- evidenceId
- label
- url
- snippet
- language

### ReviewDecision
- id
- alertId
- reviewerId
- decision
- note
- decidedAt

### ComplianceReport
- id
- supplierId
- version
- status
- htmlPath
- pdfPath
- createdAt

</details>
