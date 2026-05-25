# CEO's OS — Pilot Onboarding Checklist

**Status:** Draft · Internal · Subject to legal review  
**Master pack:** `PILOT_READINESS_PACK.md`

---

## Pre-pilot

| # | Item | Owner | Done |
|---|---|---|---|
| 1 | NDA or pilot agreement signed | Legal / sponsor | [ ] |
| 2 | Legal review of pilot scope (DSS limits, not certification) | Legal | [ ] |
| 3 | Data processing assumptions accepted (`RGPD_PILOT_READINESS.md`) | Legal + sponsor | [ ] |
| 4 | Pilot org `organizationId` created (dedicated, not customer prod) | Admin | [ ] |
| 5 | Users identified (named individuals, no shared login) | Sponsor | [ ] |
| 6 | Roles assigned (admin / user / viewer) | Admin | [ ] |
| 7 | Credentials created via secure path only (`CREDENTIAL_HYGIENE.md`) | Admin | [ ] |
| 8 | C14-P1-CREDENTIAL-01: test password rotated if previously exposed | Ops | [ ] |
| 9 | Temporary access rules documented (expiry, revoke date) | Sponsor | [ ] |
| 10 | Backup before pilot (`scripts/backup-sqlite.js`) | Ops | [ ] |
| 11 | Production smoke: health, login, one read per in-scope module | Ops | [ ] |
| 12 | Human Review Owner assigned (name, role) | Sponsor | [ ] |
| 13 | Pilot modules selected (see readiness pack §5–6) | Sponsor | [ ] |
| 14 | Data intake template completed (`PILOT_DATA_INTAKE_TEMPLATE.md`) | Sponsor | [ ] |
| 15 | Success criteria agreed (`PILOT_SUCCESS_CRITERIA.md`) | Sponsor | [ ] |
| 16 | Exit criteria agreed (go/no-go, retention) | Sponsor + legal | [ ] |
| 17 | `PILOT_RISK_REGISTER.md` reviewed with sponsor | Pilot lead | [ ] |
| 18 | Kickoff meeting scheduled (scope, limits, weekly cadence) | Pilot lead | [ ] |

---

## During pilot

| # | Item | Cadence | Done |
|---|---|---|---|
| 1 | Weekly review session | Weekly | [ ] |
| 2 | Issue log updated | Weekly | [ ] |
| 3 | Audit log sample review (auth + compliance minimum) | Weekly | [ ] |
| 4 | Backup executed per policy | Weekly or pre-change | [ ] |
| 5 | User access review (still required?) | Bi-weekly | [ ] |
| 6 | Data quality review (demo vs real mislabel) | Weekly | [ ] |
| 7 | Human review of key outputs (board draft, compliance report) | Per deliverable | [ ] |
| 8 | Security incident path understood | Once | [ ] |
| 9 | Secure share links inventoried and revoked when done | Per share | [ ] |
| 10 | No credentials in chat/email policy reinforced | Ongoing | [ ] |

---

## Post-pilot

| # | Item | Owner | Done |
|---|---|---|---|
| 1 | Export agreed materials (reports, exports customer approved) | Sponsor | [ ] |
| 2 | Revoke or disable pilot users | Admin | [ ] |
| 3 | Rotate smoke/test credentials | Ops | [ ] |
| 4 | Revoke all secure share links | Admin / users | [ ] |
| 5 | Archive audit logs per agreement | Ops | [ ] |
| 6 | Final backup | Ops | [ ] |
| 7 | Delete or retain data per agreement (**manual process**) | Ops + legal | [ ] |
| 8 | Confirm deletion/retention with customer in writing | Legal | [ ] |
| 9 | Final pilot report delivered | Pilot lead | [ ] |
| 10 | Lessons learned session | Pilot lead | [ ] |
| 11 | Next commercial step decision (expand / procurement / stop) | Sponsor | [ ] |

---

## Related

- `PILOT_OFFBOARDING_CHECKLIST.md`
- `../operations/PILOT_SECURITY_RUNBOOK.md`
- `../security/CREDENTIAL_HYGIENE.md`
