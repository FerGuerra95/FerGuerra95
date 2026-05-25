# CEO's OS — Credential Hygiene (Pilot & Operations)

**Status:** Draft · Internal operations  
**Legal review:** N/A (operational security)

---

## C14-P1-CREDENTIAL-01

| Field | Value |
|---|---|
| **Status** | **OPEN / ROTATION REQUIRED OUTSIDE REPO** |
| **Phase** | C.14.7 — Credential rotation closure (2026-05-24) |
| **Operator confirmation** | **Not received** — cannot mark RESOLVED OPS without explicit operator attestation |
| **Reason** | Production or shared test password was previously exposed outside secret stores (e.g. chat). Treat as **compromised** until rotated. |
| **Resolution criteria** | Operator rotates password via secure admin/panel; attests rotation in writing (ticket/chat: “rotated, no value”); post-rotation auth smoke passes using `CEOS_E2E_*` only |
| **New password in repo/docs/chat** | **Must remain no** |

**Do not** document the new password value anywhere in git, docs, or tickets.

### What blocks while OPEN

- Claiming “credential hygiene closed” for enterprise pilot
- Expanded production pilot without rotation attestation
- Marking C14-P1-CREDENTIAL-01 **RESOLVED OPS** in inventory

Does **not** block local development or docs-only phases.

### Operator attestation (no secrets)

When rotation is complete, operator confirms only:

> “Production test password rotated outside repo on [approximate date]. New value not stored in git/docs/chat. Ready for post-rotation smoke.”

Do **not** include username+password together or any credential value.

### Post-rotation auth smoke

| Item | Status |
|---|---|
| **POST-ROTATION AUTH SMOKE** | **PENDING** (requires rotation confirmation + local `CEOS_E2E_*`) |

Run only with variables in shell/secret manager — never in committed files:

```powershell
# Set locally only — do not paste values into chat or docs
$env:CEOS_E2E_USER = '<from secret store>'
$env:CEOS_E2E_PASSWORD = '<from secret store>'
$env:CEOS_BASE_URL = 'https://app.theceosos.com'
```

Then: login smoke, one authenticated API read per critical hub, logout. Document pass/fail without printing credentials.

### Closure state (operator selects one)

| Option | Inventory status |
|---|---|
| A — Rotated outside repo | **RESOLVED OPS / PROD TEST PASSWORD ROTATED OUTSIDE REPO** |
| B — Not yet rotated | **OPEN / ROTATION REQUIRED OUTSIDE REPO** |
| C — Cannot confirm | **OPEN / ROTATION STATUS UNCONFIRMED** |

---

## 1. Never commit credentials

- No real `.env` files in git (only `.env.example` placeholders).
- No `AUTH_SECRET`, API keys, SMTP passwords, OIDC secrets, or share tokens in commits.
- `backend-server.err` must never be staged (may contain request noise).

---

## 2. Never paste production passwords in chat

- Slack, email, Cursor chats, screenshots, and support tickets are not secret stores.
- If exposure occurs: **rotate immediately** and assume compromise until rotated.

---

## 3. Local smoke / E2E variables

Use environment variables locally and in CI — never hardcode:

| Variable | Purpose |
|---|---|
| `CEOS_E2E_USER` | Smoke login email |
| `CEOS_E2E_PASSWORD` | Smoke login password |

Reference: `.env.example` (placeholders only).

---

## 4. CI / Render secret stores

- `AUTH_SECRET` — minimum 32 characters in production; unique per environment.
- OIDC: `OIDC_CLIENT_SECRET` in platform secrets only.
- SMTP and Redis URLs in secret managers, not in repo.

---

## 5. Rotate after exposure

1. Revoke or change the affected user password in the secure admin path.
2. Invalidate sessions (logout all / password reset flow revokes sessions).
3. Re-run authenticated smoke (`/api/auth/login`, critical read paths).
4. Update **only** secret store entries — not documentation with the new value.

---

## 6. Disable or rotate smoke users after pilot

- Dedicated pilot org (`org_*` test tenant), not customer production org.
- Disable bootstrap/demo users in production when pilot ends.
- Do not leave `BOOTSTRAP_SYNC_USERS=true` on production unless explicitly required.

---

## 7. Dedicated test organization

- Pilot data and users scoped to non-customer org IDs.
- Never reuse a customer's live credentials for testing.

---

## 8. Do not reuse real customer credentials

- Operators must not log into customer tenants with shared passwords in docs.
- Per-user accounts with least privilege for pilot support.

---

## 9. Do not log tokens

- No JWT, session id, `id_token`, refresh token, or secure-share bearer token in application logs or audit metadata.
- Audit layer strips forbidden keys (`auditMetadata.js`).

---

## 10. Checklists

### Before pilot smoke

- [ ] `CEOS_E2E_*` set from secret store (not chat)
- [ ] `AUTH_SECRET` not default in production
- [ ] CORS origins match deployed SPA URL only
- [ ] No passwords in open PRs or docs

### After credential exposure

- [ ] Password rotated outside repo
- [ ] Sessions invalidated
- [ ] Smoke re-run
- [ ] C14-P1-CREDENTIAL-01 marked **RESOLVED OPS** in inventory (operator confirmation only)

### After pilot ends

- [ ] Smoke users disabled or passwords rotated
- [ ] Share links revoked (see `SECURE_SHARE_OPERATIONAL_GUIDELINES.md`)
- [ ] Backup retained per retention policy (pending formal policy)

---

## Related

- `docs/operations/PRODUCTION_ACCESS_RUNBOOK.md`
- `docs/operations/PILOT_SECURITY_RUNBOOK.md`
- `docs/security/SECURITY_PRIVACY_PILOT_PACK.md`
