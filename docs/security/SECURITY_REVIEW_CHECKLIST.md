# CEO's OS / The Sovereign OS — Security Review Checklist

## Purpose

Security checklist for changes touching APIs, auth, persistence, reports, exports, secure sharing, or enterprise data flows.

Complete before merging security-sensitive work or recommending pilot exposure.

**Pilot pack (C.14.4):** `SECURITY_PRIVACY_PILOT_PACK.md` · `CREDENTIAL_HYGIENE.md` · `SECURE_SHARE_OPERATIONAL_GUIDELINES.md` · `docs/privacy/*`

---

## Security control inventory (C.14.4)

| Control | Current status | Evidence | Gap | Priority |
|---|---|---|---|---|
| Auth required for API | **Implemented** | `auth.middleware.js`, protected routes | Per-route public exceptions must stay documented | P2 |
| API 401 without token | **Implemented** | Auth middleware + integration tests | — | — |
| Role/permission model | **Partial** | `auth.middleware.js`, AuthProvider mirror | Full matrix Pending C.13 per module | P2 |
| Tenant-safe create hardening | **Implemented** (C.14.1) | `tenantPayload.js`, Risk/Strategy/Reporting/Executive | Heritage/Bridge body-spread not in C.14.1 scope | P2 |
| Audit logs (auth + compliance CRUD) | **Implemented** (C.14.3) | `auditLog.service.js`, integration tests | Other modules partial | P2 |
| Backup/restore runbook | **Implemented** (C.14.2) | `BACKUP_RESTORE_RUNBOOK.md`, scripts | Prod schedule operator-dependent | P2 |
| Health checks | **Implemented** | `/health`, `/api/health` | Split public vs internal minimal health — optional | P3 |
| CORS allowlist | **Implemented** | `httpApp.js`, `CORS_ORIGIN(S)` | Misconfiguration risk if `*` in prod | P1 ops |
| Security headers (CSP, HSTS, etc.) | **Implemented** | `security.middleware.js` | CSP may need tuning per deploy | P2 |
| Password hashing | **Implemented** | `auth.service.js` | — | — |
| Session/token revocation | **Implemented** | Logout + password reset revoke sessions | — | — |
| Error stack suppression (prod client) | **Partial** | Error handler patterns | Verify each deploy | P2 |
| Rate limiting | **Implemented** | `createRateLimiter`, secure-share public limiter | Global API limits may need tuning | P2 |
| Secrets management | **Partial** | `.env.example`, Render secrets | No vault integration in repo | P2 |
| Production smoke | **Partial** | Inventory: auth smoke passed post-redeploy | Funding e2e copy P2 | P2 |
| Human review / DSS disclaimers | **Implemented** (docs) | `AGENTS.md`, logic protocol | UI copy variance possible | P2 |
| Secure share (technical) | **Implemented** (C.14.6) | `secureShare.service.js` | Public 404 oracle fix; auth route keeps 403 codes | P2 ops |
| Secure share (operational) | **Documented** (C.14.4–C.14.6) | `SECURE_SHARE_OPERATIONAL_GUIDELINES.md` | Training/enforcement | P2 |
| OIDC id_token verification | **Implemented** (C.14.6) | `oidcIdTokenVerify.js` | Requires `jwks_uri` for RS256; ES256 not supported | P1 if SSO + ES256 only |
| Data retention policy | **Gap** | — | No automated purge | P1 |
| DSR / export-delete workflow | **Gap** | — | Manual pilot only | P1 |
| SSO/OIDC | **Partial** | `oidcAuth.service.js`, PKCE/state | **id_token not signature-verified** | P1 if SSO on |
| DPA/RGPD legal pack | **Draft** (C.14.4) | `docs/privacy/*` | Legal review + final DPA | P1 |
| SOC2/ISO certification | **Gap** | — | Not claimed | P3 |
| Credential hygiene | **RESOLVED OPS** (C.14.7b) | `CREDENTIAL_HYGIENE.md` | Prod test password rotated outside repo; post-rotation smoke **PENDING** | P2 ops — smoke with `CEOS_E2E_*` only |

Do not mark a row **Complete** unless evidence exists; use **Partial** or **Gap** honestly.

---

## Authentication

| Check | Pass |
|---|---|
| Endpoint requires authentication | Unless explicitly public by design |
| Token/session validated server-side | Not client-only trust |
| Invalid/expired token rejected | 401/403 appropriate |
| No AUTH_SECRET in client bundle | |
| No hardcoded production credentials | |
| Login/logout flows do not leak tokens in URLs | |

## Authorization

| Check | Pass |
|---|---|
| Role checked server-side for mutation | |
| Viewer cannot POST/PATCH/DELETE protected resources | |
| Admin vs user vs viewer behavior documented | Assumed until C.13 confirms |
| Permission source verified in code | Not guessed from UI labels |
| UI gating is not sole security control | Backend must enforce |

## Multi-Tenant Isolation

| Check | Pass |
|---|---|
| organizationId from backend token/session | Never from client body alone |
| Frontend does not decide tenant ownership | |
| All business read/write scoped by organizationId server-side | |
| No cross-tenant query or IDOR | |
| List endpoints filter by tenant | |
| Tests document multi-tenant behavior or gap | |

Status for full codebase: Assumed / Pending C.13 validation unless endpoint audited.

## Input Validation

| Check | Pass |
|---|---|
| Payload schema validated | |
| Invalid input rejected with safe error | |
| No trust in client for authorization fields | |
| Numeric values sanitized (no NaN injection) | |
| IDs validated (format, ownership) | |
| File upload limits if applicable | |

## Secrets Protection

Do not expose in code, logs, commits, or client:

- AUTH_SECRET
- JWT signing secrets
- API keys
- passwords
- private URLs with embedded credentials
- .env values (except .env.example patterns)
- production database files or dumps
- customer PII

## Logs and Errors

| Check | Pass |
|---|---|
| No PII in application logs | |
| No secrets in logs | |
| Production client does not show raw stack traces | |
| Error messages useful but not leaky | |
| backend-server.err never committed | |

## Auditability

State-changing enterprise actions should preserve where implemented:

| Field | Required |
|---|---|
| actor | user id or service identity |
| organizationId | tenant scope |
| action | verb/type |
| timestamp | ISO or DB default |
| safe metadata | no secrets/PII overload |

Status: Assumed / Pending C.13 validation per module.

## Reports / Exports / Secure Sharing

| Check | Pass |
|---|---|
| Human review disclaimer on DSS outputs | Not legal/financial advice |
| Access controlled by auth + tenant | |
| Expiry/revocation if time-limited sharing | |
| Audit event on share/export if applicable | |
| No certification language in exports | |

## API Change Review (Per Endpoint)

For each new or changed endpoint document:

| Item | Value |
|---|---|
| Method + path | |
| Auth required | yes/no |
| Roles allowed | list or pending |
| organizationId source | |
| Mutation? | yes/no |
| Audit event? | yes/no/pending |
| PII in response? | |

## Stop Conditions

Stop and escalate to human review if:

- organizationId source is ambiguous
- permission model is unclear for the change
- viewer might mutate protected data
- possible cross-tenant data exposure
- secret might leak in diff, log, or response
- destructive migration without backup plan
- public exposure of private enterprise data
- output implies certification, legal advice, or investment advice
- auth/router/middleware change required without explicit authorization

## Related Rules

- `.cursor/rules/ceos-os-security-review.mdc`
- `.cursor/rules/ceos-os-enterprise-guardrails.mdc` (do not modify without authorization)
- `AGENTS.md` Mandatory Rules

## Post-Review

Record findings in audit inventory or HANDOFF_STATE.

Do not mark security as Confirmed for whole product until C.13 security pass completes.
