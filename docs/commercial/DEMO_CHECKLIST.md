# Demo Checklist — Board Intelligence (C.15.2)

**Audience:** Operator / AE / founder before external demo  
**Duration target:** 25–35 minutes (`DEMO_SCRIPT.md`)

---

## Pre-demo (T-24h to T-30min)

| # | Check | Done |
|---|---|---|
| 1 | `https://app.theceosos.com` returns **200** | ☐ |
| 2 | `/health` and `/api/health` return **200** | ☐ |
| 3 | Unauth `/api/executive/overview` and `/api/reporting/board-review-snapshots` return **401** | ☐ |
| 4 | Login works with **pilot/demo org** (credentials from secret store — **not** chat/email body) | ☐ |
| 5 | Demo org has Reporting / Board Packs data or acceptable empty states | ☐ |
| 6 | At least one **persisted Board Review Snapshot** exists (or create live in demo) | ☐ |
| 7 | **Premium HTML preview** opens; shows logo/header + **Human Review Required** + **Not Board Approved** | ☐ |
| 8 | Workflow buttons visible: draft → reviewed → internal_final (test in staging if prod risky) | ☐ |
| 9 | Browser zoom ~100%; second monitor tested | ☐ |
| 10 | **No secrets** on screen: `.env`, tokens, DB tools, Postman auth headers | ☐ |
| 11 | Fallback plan if prod slow: local build or recorded screenshots (label as illustrative) | ☐ |
| 12 | **P2 auth smoke:** if external C-level audience, run C.15.1b with `CEOS_E2E_*` from secret store OR use operator-verified session | ☐ |
| 13 | One-pager + pilot offer PDF/md ready to send post-call | ☐ |

---

## During demo — DO

- Open with **Private Executive DSS** + **human review** frame  
- Show **insufficient_data / N/A** honestly if data missing  
- Say **Board Review Draft**, not board-approved  
- Mention **persisted snapshot** + audit trail  
- Optional: **AI-ready draft assistant foundation** — draft-only  
- Deep dive **one** of M&A / Compliance / Funding max  
- Close with **Board Intelligence Pilot** offer  

---

## During demo — DO NOT

| Prohibited | Why |
|---|---|
| Show tokens, cookies, JWT, `.env` | Security |
| Open raw DB / migrations | Security + confusion |
| Promise **SOC2/ISO/enterprise certified** | False claim |
| Promise **autonomous AI** or AI approval | False claim |
| Promise **certified PDF** or filed report | Truthfulness — HTML preview ≠ certified PDF |
| Show `/bridge/marketplace` as public live product | Commercial false claim |
| Present synthetic fallback scores (64/60/58 cluster) as real | P1 truthfulness risk |
| Say “investment advice” or “legal advice” | Regulatory |

---

## Post-demo (same day)

| # | Action | Done |
|---|---|---|
| 1 | Send `CEO_OS_ONE_PAGER.md` | ☐ |
| 2 | Send `BOARD_INTELLIGENCE_PILOT_OFFER.md` | ☐ |
| 3 | Capture: sponsor, human reviewer, module priority, timeline | ☐ |
| 4 | Agree minimum data intake (`PILOT_DATA_INTAKE_TEMPLATE.md`) | ☐ |
| 5 | NDA/DPA path with legal if proceeding | ☐ |
| 6 | Log objections answered (`DEMO_OBJECTION_HANDLING.md`) | ☐ |
| 7 | If prod issues: file P2/P3 in inventory — **no** silent “it worked” claim | ☐ |

---

## Quick phrase card

- “Decision support, not autonomous decision-making.”  
- “Review-ready draft, not board-approved.”  
- “AI assists draft preparation; it does not approve, certify, or calculate official scores.”  
- “Value = private context, workflow, audit, human review.”
