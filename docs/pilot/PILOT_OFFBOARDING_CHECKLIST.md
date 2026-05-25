# CEO's OS — Pilot Offboarding Checklist

**Status:** Draft · Internal operations  
**Not:** Automated deletion guarantee — deletion is **manual/pending** unless contract specifies automated tooling (not in product today)

---

## 1. Confirm pilot end

| Item | Value |
|---|---|
| Planned end date | __________ |
| Actual end date | __________ |
| Sponsor sign-off on end | [ ] Yes |
| Reason (complete / stop early) | __________ |

---

## 2. Freeze changes

- [ ] Communicate read-only period to pilot users (optional 48h)  
- [ ] No new secure shares created  
- [ ] No new bulk data loads  

---

## 3. Export agreed artifacts

Export only what pilot agreement allows:

- [ ] Board review drafts (watermarked **DRAFT / DSS**)  
- [ ] Compliance reports (human-reviewed copies)  
- [ ] M&A exports customer approved  
- [ ] Risk/PMI extracts  
- [ ] Audit log extract (sanitized sample if requested)  

**Do not export:** other tenants' data · secrets · full DB without legal approval

---

## 4. Revoke users

- [ ] Disable or delete pilot user accounts  
- [ ] Confirm viewer/admin accounts removed  
- [ ] Document final user list archived  

---

## 5. Rotate smoke / test credentials

- [ ] `CEOS_E2E_PASSWORD` rotated in secret store  
- [ ] C14-P1-CREDENTIAL-01 marked **RESOLVED OPS** only after rotation confirmed  
- [ ] Bootstrap sync flags reviewed (`BOOTSTRAP_SYNC_USERS` not left unsafe)  

See `../security/CREDENTIAL_HYGIENE.md`.

---

## 6. Archive audit logs

- [ ] Export `audit_logs` slice for pilot org if contract requires  
- [ ] Store in customer-approved secure location (not git)  
- [ ] Retention period: __________ (legal)  

---

## 7. Backup final state

```text
node scripts/backup-sqlite.js
node scripts/verify-sqlite-integrity.js
```

- [ ] Backup file name / date: __________  
- [ ] Stored at: __________ (not in repo)  

---

## 8. Delete or retain data per agreement

| Agreement | Action | System capability |
|---|---|---|
| Delete all pilot tenant data | Manual export + delete procedure | **Manual** — no self-service erasure API |
| Retain N months | Keep backup + restrict access | Ops + legal |
| Return data to customer | Export package delivered | Manual |

- [ ] Customer written confirmation of delete/retain received  

**Gap (honest):** Automated tenant purge and DSR portal **not implemented** — document in final report.

---

## 9. Remove secure share links

- [ ] List active shares for pilot org  
- [ ] Revoke each (`ma.secure_share.revoked` or product UI)  
- [ ] Confirm no `public_accessed` after revoke window  

See `../security/SECURE_SHARE_OPERATIONAL_GUIDELINES.md`.

---

## 10. Final pilot report (outline)

Deliver to sponsor within ___ business days:

1. Executive summary (go/no-go recommendation)  
2. Modules used vs planned  
3. Success criteria scorecard  
4. Issues log summary  
5. Security/privacy incidents (if any)  
6. Human review outcomes  
7. Open P1/P2 for production  
8. Deletion/retention confirmation  
9. Recommended next step (expand / procurement / stop)  

---

## 11. Next-step decision

| Option | Selected | Notes |
|---|---|---|
| Extend pilot | [ ] | New dates + scope |
| Expand modules | [ ] | Requires audit for Heritage etc. |
| Procurement / enterprise discussion | [ ] | Legal DPA + SOC2 roadmap separate |
| Stop — no commercial continuation | [ ] | |
| Stop — delete data | [ ] | Manual deletion confirmed |

---

## 12. Lessons learned (internal)

| What worked | What failed | Process change |
|---|---|---|
| | | |

---

## Related

- `PILOT_ONBOARDING_CHECKLIST.md` (post-pilot section)  
- `../operations/BACKUP_RESTORE_RUNBOOK.md`  
- `PILOT_READINESS_PACK.md`
