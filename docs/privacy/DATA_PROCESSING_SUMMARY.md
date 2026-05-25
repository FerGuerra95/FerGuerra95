# CEO's OS — Data Processing Summary (Pilot)

**Status:** Draft · Internal · Subject to legal review  
**Purpose:** Inventory of data categories for privacy questionnaires and DPA preparation

---

## Summary table

| Data category | Examples | Purpose | Stored? | Audit? | Risk | Notes |
|---|---|---|---|---|---|---|
| User account data | Email, name, role, user id | Authentication, authorization | Yes (SQLite users) | Login/logout audit (C.14.3) | Medium | Passwords hashed; never log plaintext |
| Organization data | `organizationId`, org settings | Multi-tenant scope | Yes | Partial | Medium | Client cannot override org on hardened creates |
| M&A deal data | Cases, financials, pipeline, VDR file metadata | DSS M&A workflows | Yes | Partial (incl. secure share) | High | Business confidential |
| Compliance suppliers | Name, country, scores, status | Supply chain compliance DSS | Yes | CRUD audited (C.14.3) | High | UI score vs persisted field — see SoT registry |
| Compliance evidence | Title, source type, confidence; excerpt in DB | Evidence linking | Yes | CRUD audited; excerpt **not** in audit metadata | High | Do not duplicate full text in audit |
| Compliance reviews | Status, decision, reviewer | Human review workflow | Yes | CRUD + status change audited | Medium | Notes excluded from audit metadata |
| Compliance reports | Report metadata, summaries | Reporting / board prep | Yes | `compliance.report.created` | High | Human review before external use |
| Risk register | Risks, controls, scores | Risk DSS | Yes | Partial module audit | High | Golden oracles for some scores |
| PMI programs | Synergies, milestones, integration | PMI DSS | Yes | Partial | High | Demo merge removed C.13.12B |
| Governance decisions | Decisions, meetings, packs | Governance tracking | Yes | Partial | High | Not certified governance system |
| Strategy objectives | Initiatives, scenarios | Strategy DSS | Yes | Partial | Medium | |
| Reporting metadata | KPIs, schedules, library | Reporting DSS | Yes | Partial | Medium | |
| Executive signals | Aggregated module signals | Executive overview | Yes | Partial | Medium | Aggregator only — not master store |
| Audit logs | action, entityType, safe metadata | Accountability | Yes | N/A (is audit) | Medium | Sanitized — no passwords/tokens |
| Secure share tokens | Hashed token, link id, expiry | External report viewing | Yes (hash only) | Access/create/revoke events | **High** | Bearer secret — operational guidelines |
| Password reset tokens | Hashed token, expiry | Account recovery | Yes (hash) | Password reset audit | Medium | Single-use |
| Auth sessions | Session id, status, expiry | Session management | Yes | Logout audit | Medium | |
| Technical logs | Request id, errors | Operations | Env-dependent | No | Medium | Must not contain secrets/PII |
| OIDC tokens (transient) | access_token, id_token in memory | SSO login | Not persisted as tokens | Login success audit | **High** if SSO on | **id_token not cryptographically verified** — gap |

---

## Cross-cutting rules

### Passwords

- Stored **hashed** — never plain text in DB or audit logs.
- Never document or commit real passwords.

### Audit metadata

- `sanitizeAuditMetadata` removes: password, token, id_token, excerpt, notes, large payloads, etc.
- Email stored as **hint** only in auth audit (domain + local prefix).

### Credentials in operations

- Use `CEOS_E2E_USER` / `CEOS_E2E_PASSWORD` locally only.
- See `docs/security/CREDENTIAL_HYGIENE.md`.

### Sensitive client data

- Use only under **NDA / pilot agreement**.
- Minimize copies; prefer dedicated pilot org.
- Do not use production customer DB snapshots without contract.

### Data not intended for pilot

- Special category personal data (unless explicitly authorized).
- Payment card data, government ID scans, unrelated HR dumps.
- Secrets: `AUTH_SECRET`, API keys, share URLs with tokens in tickets.

---

## Related

- `RGPD_PILOT_READINESS.md`
- `DPA_DRAFT_NOTES.md`
- `../architecture/SOURCE_OF_TRUTH_REGISTRY.md`
- `../security/SECURITY_PRIVACY_PILOT_PACK.md`
