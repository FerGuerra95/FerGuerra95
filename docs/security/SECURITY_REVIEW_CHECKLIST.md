# CEO's OS / The Sovereign OS — Security Review Checklist

## Purpose

Security checklist for changes touching APIs, auth, persistence, reports, exports, secure sharing, or enterprise data flows.

Complete before merging security-sensitive work or recommending pilot exposure.

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
