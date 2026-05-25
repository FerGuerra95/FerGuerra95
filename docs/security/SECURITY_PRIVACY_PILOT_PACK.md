# CEO's OS / The Sovereign OS — Security & Privacy Pilot Pack

**Status:** Draft · Internal / pilot readiness only  
**Legal review:** Required before any customer-facing or contractual use  
**Not:** Final DPA · Final privacy policy · Procurement pack · SOC2/ISO certification

---

## 1. Purpose

Provide a single internal reference for running a **controlled pilot** of CEO's OS: what security and privacy controls exist today, what data is in scope, what must remain human-reviewed, and what must **not** be promised commercially.

This pack supports pilot operators, security reviewers, and legal counsel preparation. It does **not** certify GDPR compliance, SOC2, ISO 27001, or enterprise procurement readiness.

---

## 2. Scope

| In scope | Out of scope (this pack) |
|---|---|
| Private executive DSS pilot on known tenants | Public marketplace positioning |
| Documented controls from C.14.1–C.14.3 + codebase review | Product code changes |
| Operational runbooks and hygiene | Final DPA / privacy policy text |
| RGPD-oriented **assumptions** and gaps | Legal advice or investment advice |
| M&A secure share operational rules | Full SSO hardening (see OIDC gap) |

---

## 3. Pilot-only status

CEO's OS in pilot is:

- **Decision-support software (DSS)** — outputs require human review.
- **Multi-tenant** — organization isolation enforced server-side for audited paths.
- **Not** autonomous decision-making, legal certification, fairness opinion, or investment advice.

Pilot data should use **dedicated test organizations**, synthetic or NDA-covered client data, and rotated credentials (see `CREDENTIAL_HYGIENE.md`).

---

## 4. Security controls implemented (evidence-based)

| Area | Implementation (summary) | Evidence |
|---|---|---|
| API authentication | Bearer JWT validated server-side; protected routes reject missing/invalid token | `auth.middleware.js`, integration auth tests |
| Login audit | Success/failure/logout events in `audit_logs`; metadata sanitized | C.14.3, `auth.service.js` |
| Password storage | Hashed (not plain text) | `auth.service.js` |
| Session revocation | Logout revokes session; password reset revokes all user sessions | `auth.service.js` |
| Tenant-safe create | Client `organizationId` stripped on create for Risk/Strategy/Reporting/Executive | C.14.1, `tenantPayload.js` |
| Compliance CRUD audit | Supplier/evidence/review/report mutations audited | C.14.3 |
| CORS | Allowlist via `CORS_ORIGIN` / `CORS_ORIGINS` | `httpApp.js` |
| Security headers | CSP, HSTS (prod), X-Frame-Options, etc. | `security.middleware.js` |
| Rate limiting | API and secure-share public routes | `security.middleware.js`, `maPublic.routes.js` |
| Backup / integrity | Scripts + runbook; local restore drill | C.14.2, `BACKUP_RESTORE_RUNBOOK.md` |
| Health checks | `/health`, `/api/health` | `server.js` |
| Secure share (technical) | Token hashed at rest; expiry/revoke; fragment URL; public rate limit; audit on access | `secureShare.service.js` |
| Error handling | Production-oriented error responses (no raw stack in client contract goal) | Assumed — verify per deploy |
| DSS disclaimers | Product positioning in AGENTS.md and logic protocol | `AGENTS.md`, `LOGIC_INTEGRITY_PROTOCOL.md` |

**Partial / gap:** Full-module permission matrix (C.13 pending per endpoint), formal retention/DSR automation, ES256-only OIDC providers (unsupported), SOC2/ISO program, enterprise incident response playbook.

---

## 5. Privacy assumptions (draft)

- **Controller / processor roles** depend on contract; typically customer = controller for business data, operator = processor — **subject to legal review** (`RGPD_PILOT_READINESS.md`).
- Processing purposes: decision-support, reporting preparation, audit trail, pilot evaluation.
- **No special categories** of personal data should be uploaded unless explicitly authorized and legally justified.
- Audit logs store **reduced** identifiers (e.g. email domain hint, not full passwords/tokens).
- Pilot participants must not paste production passwords, tokens, or full PII into chats, tickets, or docs.

---

## 6. Data categories (summary)

See `docs/privacy/DATA_PROCESSING_SUMMARY.md` for the full table.

High level: user accounts, organization-scoped business records (M&A, Compliance, Risk, PMI, Governance, Strategy, Reporting, Executive signals), audit logs, optional evidence text, secure share metadata, technical logs.

---

## 7. Data not intended for pilot

- Production customer databases copied without contract/NDA.
- Special category data (health, biometric, etc.) unless explicitly approved.
- Live payment card or banking credentials.
- Unredacted personal documents beyond pilot need.
- Secrets in tickets: `AUTH_SECRET`, API keys, share tokens, `id_token`, refresh tokens.

---

## 8. Roles and access

| Role | Typical capability | Enforcement |
|---|---|---|
| admin | Broad mutate/read within org | Server-side permissions (verify per module) |
| user | Standard enterprise use | Server-side |
| viewer | Read-oriented; must not mutate protected enterprise data | Server-side + UI gating (UI not sole control) |

Organization scope comes from **backend session/token**, not client-selected `organizationId` on creates (C.14.1).

---

## 9. Human review requirement

All calculated scores, matches, readiness indicators, board-pack drafts, and compliance outputs are **indicative DSS material**. They are not legal opinions, investment advice, certified audits, or guaranteed outcomes. Pilot users must review before board, legal, or external disclosure.

---

## 10. Audit trail summary (C.14.3)

- **Auth:** `auth.login.succeeded`, `auth.login.failed`, `auth.logout.succeeded`
- **Compliance CRUD:** `compliance.supplier|evidence|review|report.*`
- **M&A secure share (existing):** `ma.secure_share.created`, `ma.secure_share.public_accessed`, `ma.secure_share.revoked` (where implemented)
- Metadata: sanitized via `auditMetadata.js` — no passwords, tokens, full evidence body

---

## 11. Backup / restore summary (C.14.2)

- Scheduled/on-demand SQLite backup via `scripts/backup-sqlite.js`
- Integrity: `scripts/verify-sqlite-integrity.js`
- Restore drill documented; production target restore blocked by script
- RPO/RTO: provisional 24h / 4h manual — **not SLA**

---

## 12. Known limitations

- No enterprise SOC2/ISO certification program in repo.
- No finalized DPA, privacy policy, retention schedule, or DSR workflow.
- OIDC: enable SSO only when discovery exposes `jwks_uri` (RS256) or HS256 with client secret — verified in C.14.6.
- Secure share: bearer link secrecy depends on operational discipline; technical controls partial.
- Not all modules may have complete audit coverage beyond Compliance CRUD + Auth (C.14.3).
- Demo/bootstrap users exist in dev; production must use strong secrets and rotated test creds.

---

## 13. Open P1 / P2 (pilot blockers vs hardening)

| ID | Topic | Status |
|---|---|---|
| C14-P1-CREDENTIAL-01 | Prod/test password rotation after exposure | **RESOLVED OPS** (C.14.7b) — rotated outside repo; new value not in git/docs/chat; post-rotation smoke **PENDING** |
| C14-P1-DPA-RGPD-PRIVACY-01 | Legal privacy pack | **PARTIALLY RESOLVED** — pilot drafts; legal review required |
| C14-P1-SECURE-SHARE-01 | Secure share | **RESOLVED** (C.14.6 technical + C.14.4 ops) |
| C14-P1-OIDC-IDTOKEN-01 | OIDC `id_token` verification | **RESOLVED** (C.14.6) when SSO configured |
| — | SOC2/ISO / procurement / SLA | **OPEN** — not claimed |

---

## 14. Customer-facing safe wording (pilot)

**May say:**

- "Private executive decision-support workspace for pilot evaluation."
- "Human-reviewed indicators and drafts — not autonomous decisions."
- "Role-based access and organization-scoped data."
- "Audit events for key auth and compliance actions (pilot scope)."
- "Backup and integrity procedures documented for operations."

**Must not say:**

- "GDPR fully compliant" / "SOC2 ready" / "ISO 27001 certified"
- "Legal reviewed" / "Procurement-ready" / "Production certified"
- "Guaranteed compliance outcomes" / "Certified audit" / "Investment advice"

---

## 15. Do-not-claim section

CEO's OS pilot is **not**:

- A certified compliance or governance system  
- Legal, tax, or investment advice  
- A fairness opinion or autonomous deal engine  
- A public deal marketplace  
- SOC2 Type II, ISO 27001, or SLA-backed enterprise SaaS  

---

## Related documents

| Document | Path |
|---|---|
| Security control inventory | `docs/security/SECURITY_REVIEW_CHECKLIST.md` |
| RGPD pilot readiness | `docs/privacy/RGPD_PILOT_READINESS.md` |
| Data processing summary | `docs/privacy/DATA_PROCESSING_SUMMARY.md` |
| DPA draft notes (index only) | `docs/privacy/DPA_DRAFT_NOTES.md` |
| Credential hygiene | `docs/security/CREDENTIAL_HYGIENE.md` |
| Secure share guidelines | `docs/security/SECURE_SHARE_OPERATIONAL_GUIDELINES.md` |
| Pilot security runbook | `docs/operations/PILOT_SECURITY_RUNBOOK.md` |
| Production access | `docs/operations/PRODUCTION_ACCESS_RUNBOOK.md` |
| Backup/restore | `docs/operations/BACKUP_RESTORE_RUNBOOK.md` |
| **Pilot readiness pack (C.14.5)** | `docs/pilot/PILOT_READINESS_PACK.md` |
| Onboarding / weekly / offboarding | `docs/pilot/PILOT_ONBOARDING_CHECKLIST.md`, `PILOT_WEEKLY_REVIEW.md`, `PILOT_OFFBOARDING_CHECKLIST.md` |
| Data intake / success / risks | `docs/pilot/PILOT_DATA_INTAKE_TEMPLATE.md`, `PILOT_SUCCESS_CRITERIA.md`, `PILOT_RISK_REGISTER.md` |

---

**This document is an internal/pilot readiness draft and requires legal review before use as a customer-facing legal document.**
