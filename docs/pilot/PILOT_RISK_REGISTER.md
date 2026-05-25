# CEO's OS — Pilot Risk Register

**Status:** Draft · Living document during pilot  
**Owner:** Pilot lead · Review weekly in `PILOT_WEEKLY_REVIEW.md`

---

## Risk table

| ID | Risk | Severity | Mitigation | Owner | Status |
|---|---|---|---|---|---|
| R01 | Credential exposure (chat, commit, screenshot) | **High** | `CREDENTIAL_HYGIENE.md`; rotate; `CEOS_E2E_*` only in secrets | Ops | **Open** until C14-P1-CREDENTIAL-01 resolved |
| R02 | Customer uploads sensitive data not in intake | **High** | `PILOT_DATA_INTAKE_TEMPLATE.md`; legal approval; training | Sponsor | Open |
| R03 | User treats DSS output as certified legal/financial advice | **High** | Kickoff training; disclaimers; Human Review Owner | Sponsor | Open |
| R04 | Board pack interpreted as board-approved / final | **High** | Label **DRAFT**; weekly human review | Human Review Owner | Open |
| R05 | Backup not executed before material change | **Medium** | `BACKUP_RESTORE_RUNBOOK.md`; weekly backup in review | Ops | Open |
| R06 | Secure share link forwarded to unauthorized party | **High** | `SECURE_SHARE_OPERATIONAL_GUIDELINES.md`; short expiry; revoke | Users + ops | Partial |
| R07 | Data deletion expectation unclear at end | **Medium** | Offboarding checklist; written customer confirmation | Legal | Open |
| R08 | Scope creep into procurement / SOC2 claims | **Medium** | `PILOT_READINESS_PACK.md` do-not-claim; exec alignment | Pilot lead | Open |
| R09 | SSO requested but OIDC not hardened | **High** (if SSO) | Defer SSO or C.14.6; C14-P1-OIDC-IDTOKEN-01 | Engineering | Open if SSO |
| R10 | Performance / availability incident | **Medium** | Render monitoring; comms plan; no SLA claimed | Ops | Open |
| R11 | Legal / DPA not finalized | **Medium** | C.14.4 draft packs; legal review before expansion | Legal | Open |
| R12 | PDF renderer expected but not available | **Low** | Set expectations in kickoff; export HTML/JSON | Pilot lead | Open |
| R13 | Marketplace (`/bridge/marketplace`) misunderstood as public | **Medium** | Exclude from pilot; internal demo only | Product | Open |
| R14 | Cross-tenant data leak | **Critical** | C.14.1 hardening; no shared org; incident P0 path | Engineering | Mitigated — monitor |
| R15 | Demo/fallback data mistaken for customer real data | **Medium** | Dedicated pilot org; truthfulness labels C.13 | Pilot lead | Mitigated — monitor |
| R16 | Funding draft vs backend persisted confusion | **Medium** | Label draft; Funding module caution in pack | Users | Open |
| R17 | Heritage module completeness overpromised | **Medium** | Exclude or preview-only in scope | Sponsor | Open |
| R18 | Retention automation absent | **Medium** | Document manual process; legal agreement | Legal | Open |
| R19 | Pilot user shared login | **High** | Per-user accounts in onboarding | Admin | Open |
| R20 | Incident response playbook incomplete | **Medium** | `PILOT_SECURITY_RUNBOOK.md` escalation | Ops | Partial |

**Severity:** Critical / High / Medium / Low  
**Status:** Open · Mitigated · Closed

---

## Add new risks (template)

| ID | Risk | Severity | Mitigation | Owner | Status |
|---|---|---|---|---|---|
| R__ | | | | | Open |

---

## Related

- `PILOT_READINESS_PACK.md` §15  
- `../security/SECURITY_REVIEW_CHECKLIST.md`
