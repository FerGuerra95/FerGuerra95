# CEO's OS — Pilot Security Runbook

**Status:** Draft · Internal operations  
**Scope:** Controlled pilot before enterprise procurement

---

## 1. Pre-pilot checklist

- [ ] Pilot agreement / NDA signed (legal)
- [ ] Dedicated pilot `organizationId` created
- [ ] Users created with least privilege (avoid shared passwords)
- [ ] `AUTH_SECRET` and secrets in platform store (not repo)
- [ ] CORS origins match pilot SPA URL only
- [ ] C14-P1-CREDENTIAL-01: exposed test passwords **rotated**
- [ ] Backup taken (`scripts/backup-sqlite.js`) — see `BACKUP_RESTORE_RUNBOOK.md`
- [ ] Review `SECURITY_PRIVACY_PILOT_PACK.md` with sponsor

---

## 2. Test / prod org setup

| Environment | Rule |
|---|---|
| Local | `.env` from `.env.example`; never commit secrets |
| Staging / prod pilot | Separate org; no copy of customer prod DB without contract |
| Demo users | Disable or restrict in production |

---

## 3. User creation

- Per-user accounts; assign `admin` / `user` / `viewer` intentionally.
- Viewer must not perform enterprise mutations (verify per module).
- Document who has access in pilot charter.

---

## 4. Role assignment

- Re-verify after org changes.
- No shared "team" login for auditability.

---

## 5. Credential handling

Follow `docs/security/CREDENTIAL_HYGIENE.md`:

- `CEOS_E2E_*` for smoke only
- Rotate after any exposure
- No passwords in chat or docs

---

## 6. Data intake rules

- Only data covered by NDA/pilot scope.
- No special category data unless legal approval.
- Label demo vs real in conversations — product may still show persisted data as real within tenant.

---

## 7. NDA / legal prerequisites

- Customer privacy notice to their users is customer's duty.
- Operator provides pilot pack drafts — **not** final legal docs.

---

## 8. Backup before pilot

```text
node scripts/backup-sqlite.js
node scripts/verify-sqlite-integrity.js --quick
```

Store backup outside git. See `BACKUP_RESTORE_RUNBOOK.md`.

---

## 9. Audit log review cadence

Weekly (pilot):

- Sample `auth.login.failed` spikes
- Compliance CRUD volume vs activity
- `ma.secure_share.public_accessed` for unexpected access

Query via DB or future admin tooling — manual in pilot.

---

## 10. Weekly security review (30 min)

- Open P1 status (credentials, OIDC if enabled, share links active)
- CORS / secret rotation dates
- Failed login patterns
- Incident near-misses from operators

---

## 11. Incident escalation

| Severity | Example | Action |
|---|---|---|
| P0 | Suspected cross-tenant leak, secret in repo | Stop pilot; rotate secrets; notify legal/customer |
| P1 | Credential exposure in chat | Rotate password; revoke sessions |
| P2 | Overshared secure link | Revoke link; notify recipient |

Document timeline; no secrets in ticket body.

---

## 12. Offboarding

- [ ] Disable pilot users
- [ ] Revoke active secure shares
- [ ] Export data if contract requires
- [ ] Schedule deletion (manual until DSR automation)
- [ ] Retain backups per agreed period only

---

## 13. Data deletion / retention

**Pending** formal policy. Until then: agree in pilot contract; manual SQLite export/delete with integrity check after.

---

## 14. Smoke tests before pilot go-live

| Check | Command / path |
|---|---|
| Health | `GET /health`, `GET /api/health` |
| Login | `POST /api/auth/login` with `CEOS_E2E_*` |
| Auth audit | Integration `authApi.test.js` (CI) |
| Compliance audit | Integration `complianceApi.test.js` (CI) |
| Build | `npm run build` |

Production smoke: documented in inventory (authenticated hubs passed with P2 residuals).

---

## 15. What not to promise

Do not tell pilot sponsors the product is:

- GDPR-certified, SOC2-ready, ISO-certified, procurement-ready, or legally reviewed
- Autonomous decision-making or guaranteed compliance outcomes

Use wording from `SECURITY_PRIVACY_PILOT_PACK.md` §14.

---

## Related

- `PRODUCTION_ACCESS_RUNBOOK.md`
- `BACKUP_RESTORE_RUNBOOK.md`
- `../security/CREDENTIAL_HYGIENE.md`
- `../security/SECURE_SHARE_OPERATIONAL_GUIDELINES.md`
