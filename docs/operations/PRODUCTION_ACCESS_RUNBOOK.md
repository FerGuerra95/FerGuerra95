# CEO's OS — Production Access Runbook

**Status:** Draft · Internal operations  
**Not:** Customer-facing SLA or access policy

---

## 1. Principles

- Production access is **least privilege** and **time-bound**.
- No shared passwords; no credentials in chat, docs, or git.
- All access supports auditability and incident response.

---

## 2. Who may access production

| Role | Typical access | Notes |
|---|---|---|
| Platform operator | Render dashboard, shell, env secrets | MFA on provider account |
| Support engineer | Read-only smoke + approved break-glass | Log actions |
| Developer | No standing prod DB write without approval | Use staging/local |

---

## 3. Authentication to the application

- Use dedicated operator accounts in production tenant — not customer admin impersonation without contract.
- Smoke credentials from secret store:

```text
CEOS_E2E_USER=...
CEOS_E2E_PASSWORD=...
```

Never commit values. Rotate per `CREDENTIAL_HYGIENE.md`.

---

## 4. Environment secrets (Render / host)

| Secret | Requirement |
|---|---|
| `AUTH_SECRET` | ≥32 chars, unique, rotated on compromise |
| `DB_PATH` | Persistent disk path (e.g. `/var/data/ceos-os.sqlite`) |
| `CORS_ORIGINS` | Exact production SPA origin(s) only |
| `FRONTEND_URL` / `PUBLIC_APP_URL` | Match deployed URLs |
| OIDC secrets | Only if SSO enabled; see OIDC gap below |

Reference placeholders: `.env.example` only.

---

## 5. Render / shell access

- Shell used for backup: `node scripts/backup-sqlite.js` with `BACKUP_DIR=/var/data/backups`
- **Do not** run `restore-sqlite-drill.js` against production target (`ALLOW_PRODUCTION_RESTORE_TARGET` unset)
- Download backups via secure channel — not git

---

## 6. Database access

- SQLite file may contain all tenant data — treat as **confidential**.
- No copying prod DB to developer laptops without encryption and approval.
- Sanitized excerpts only for debugging; no PII in tickets.

---

## 7. Break-glass procedure

1. Document reason and approver.  
2. Use shortest access window.  
3. Prefer read-only investigation (backup mount, log export).  
4. If write required: backup first, then change, then smoke.  
5. Post-incident note in internal log (no secrets).

---

## 8. OIDC / SSO production

If `OIDC_ISSUER` is set:

- **C14-P1-OIDC-IDTOKEN-01 OPEN** — `id_token` is parsed without full signature verification when userinfo is unavailable (`oidcAuth.service.js`).
- Do not enable SSO for regulated pilot until verification hardening phase (C.14.6 or explicit fix).
- Restrict email domain via `OIDC_ALLOWED_EMAIL_DOMAIN`.

---

## 9. Secure share in production

- Operators do not create shares on behalf of customers without instruction.
- Revoke links when support tickets close.
- See `SECURE_SHARE_OPERATIONAL_GUIDELINES.md`.

---

## 10. Logging discipline

- Do not enable debug logs that print tokens, cookies, or full request bodies in production.
- `backend-server.err` is local/dev artifact — never commit.

---

## 11. Post-access verification

After any prod change:

- [ ] `/health` and `/api/health` 200
- [ ] Login with smoke user
- [ ] One read per critical module (M&A, Compliance, Executive)
- [ ] No unexpected CORS errors from SPA

---

## 12. Credential rotation (C14-P1-CREDENTIAL-01)

If test password was exposed:

1. Rotate in admin/bootstrap path (outside repo).  
2. Update Render secret / `CEOS_E2E_PASSWORD` only in secret store.  
3. Re-run authenticated smoke.  
4. Mark **RESOLVED OPS** in inventory when confirmed.

---

## Related

- `PILOT_SECURITY_RUNBOOK.md`
- `BACKUP_RESTORE_RUNBOOK.md`
- `../security/CREDENTIAL_HYGIENE.md`
