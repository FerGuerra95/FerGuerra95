# C.15.3 - Internal Demo Dry Run / Commercial QA

**Status:** Internal demo QA complete  
**Mode:** Docs / demo QA only  
**Runtime impact:** None  
**Primary decision:** Ready for a controlled external pilot demo after operator-authenticated smoke is run or an operator-verified session is prepared.

---

## 1. Executive Summary

The current Board Intelligence demo is commercially coherent, differentiated, and mostly safe for a controlled external pilot conversation. The strongest story is:

Executive Overview -> Reporting / Board Packs -> persisted Board Review Snapshot -> premium HTML Board Review Draft -> reviewed/internal_final workflow -> Board Intelligence Pilot offer.

The demo should be positioned as a **Private Executive DSS** and **Board Intelligence Workspace**, not as enterprise-certified software, autonomous AI, certified PDF reporting, legal advice, investment advice, or board-approved output.

The main remaining operational risk is the documented **P2 authenticated production smoke residual**: `CEOS_E2E_*` credentials were not available in the operator shell during prior smoke phases. This is not a confirmed product P0/P1, but it should be closed or bypassed with an operator-verified session before a high-stakes external demo.

---

## 2. Demo Goal

Show that CEO's OS can help an executive team convert fragmented operational signals into a traceable **Board Review Draft** with:

- clear human review gates;
- persisted snapshots;
- audit metadata;
- honest missing-data handling;
- a premium HTML preview;
- commercial pilot scope that is credible without overclaiming.

The demo should create confidence in a controlled pilot, not imply procurement readiness or certification.

---

## 3. Target Buyer

Primary buyer:

- CEO, CFO, board secretary, chief of staff, M&A lead, compliance lead, or PE/portfolio operator.

Buyer pain:

- Board materials take too long to assemble.
- Operational signals live across modules, spreadsheets, and memos.
- Drafts circulate without state, version, or audit clarity.
- Teams need human-reviewed intelligence, not another ungoverned dashboard.

Best-fit pilot:

- 4-6 week Board Intelligence pilot with one named sponsor, one named human reviewer, and one optional strategic module deep dive.

---

## 4. Recommended Demo Flow

| Step | Objective | Message | Risk | Duration | Do Not Say | If Production Fails |
|---|---|---|---|---:|---|---|
| CEO / Executive Overview | Establish executive command center | Aggregates DSS signals; does not certify enterprise health | Missing data may look weak | 5 min | "Certified health score" | Use local/staging or screenshots clearly labelled illustrative |
| Reporting / Board Packs | Make Board Intelligence tangible | Reporting is the commercial spine | Empty state if demo data missing | 4 min | "Final board pack" | Show empty-state truthfully and explain pilot data intake |
| Persisted snapshots | Show traceability | Snapshot preserves what was shown | Auth/session issue | 4 min | "Backend approves this" | Use pre-created snapshot or document P2/env gap |
| Premium HTML Board Review Draft | Create the strongest visual moment | Branded draft, review-ready, not approved | Popup blocker or missing snapshot | 5 min | "Certified PDF" | Use existing preview, not fake PDF |
| Workflow reviewed/internal_final | Show control, not autonomy | Human gates move state | Permissions may block actions | 4 min | "Board-approved" | Treat 403 as expected permission discipline |
| Optional deep dive | Prove module depth | Pick one: M&A, Compliance, or Funding | Too much breadth dilutes story | 5-7 min | "Fairness opinion" / "certified audit" / "investment advice" | Skip if time is tight |
| Pilot offer | Close with next step | Controlled scope, clear deliverables | Price/scope confusion | 4 min | "Procurement-ready suite" | Send one-pager and pilot offer after call |

Recommended total: **28-35 minutes**.

---

## 5. Screen-by-screen Checklist

| Screen | Purpose | Must Show | Must Not Say | Risk | Pass/Fail |
|---|---|---|---|---|---|
| Landing/login | Establish private workspace | Private access; no secrets on screen | "Public marketplace live" | Login/env issue | PASS if operator session ready |
| CEO Overview | Executive signal aggregation | N/A / insufficient_data where applicable | "Certified enterprise score" | Misread aggregate as SoT | PASS |
| Reporting dashboard | Transition to Board Intelligence | Reporting / Board Packs entry | "Complete PDF suite" | User expects binary PDF | PASS |
| Board Packs | Show report prep workspace | Board Review Draft labels | "Final report" | Empty state | PASS if data/snapshot exists |
| Persisted snapshots | Show traceability | Snapshot list, status, metadata | "Saved final" before API success | Auth/permission | PASS |
| HTML Board Review Draft preview | Premium moment | Logo/header, Human Review Required, Not Board Approved | "Certified PDF" | Popup blocker | PASS |
| Workflow panel | Show human gates | reviewed/internal_final controls | "AI approved it" | Permissions block action | PASS if explained |
| M&A optional | Show strategic depth | DSS valuation/pipeline prep | "Fairness opinion" | Too much detail | OPTIONAL |
| Compliance optional | Show operational risk support | Evidence/review workflow | "Certified compliance" | Legal-advice risk | OPTIONAL |
| Funding optional | Show scenario support | Scenario/readiness labels | "Investment advice" | Draft vs persisted confusion | OPTIONAL |
| Pilot offer | Convert interest | 4-6 week controlled pilot, inputs, criteria | "Procurement-ready" | Scope creep | PASS |

---

## 6. Timing

| Segment | Target |
|---|---:|
| Executive problem + positioning | 3 min |
| CEO Overview | 5 min |
| Reporting / Board Packs | 4 min |
| Persisted snapshot + preview | 8 min |
| Workflow controls | 4 min |
| Optional deep dive | 5-7 min |
| Pilot offer + discovery | 4-5 min |

Hard stop version: skip optional deep dive and spend 20 minutes on Executive Overview + Reporting + pilot close.

---

## 7. Strongest Moments

- The phrase "Board Review Draft, not board-approved" is strong and credible.
- Persisted snapshots make the demo feel enterprise-grade without claiming certification.
- The premium HTML preview with shared logo/header is the clearest visual proof point.
- Workflow states explain why this is more than a dashboard or generic AI chat.
- Honest `insufficient_data` / N/A handling protects trust.

---

## 8. Weakest / Risky Moments

- Authenticated production smoke remains P2/env until `CEOS_E2E_*` is loaded or an operator session is verified.
- If there is no demo board pack data, the Reporting section can become too abstract.
- The word `internal_final` may be misread as board approval; always clarify that it is internal workflow state only.
- AI foundation can invite overclaiming. Say "AI-ready draft assistant foundation", not "AI runs the report".
- PDF expectations need steering: current strength is premium HTML preview, not certified PDF.

---

## 9. Wording Risks

| Risky wording | Replace with |
|---|---|
| "Board-approved" | "Board Review Draft" |
| "Certified PDF" | "Premium HTML Board Review Draft preview" |
| "Autonomous AI" | "AI-ready draft assistant foundation, human-reviewed" |
| "Legal/investment advice" | "Decision-support material for qualified human review" |
| "Procurement-ready" | "Controlled pilot ready with documented limits" |
| "SOC2/ISO certified" | "Pilot security procedures documented; certification not claimed" |
| "Final report" | "Internal draft / internal-final workflow state, not board approval" |

---

## 10. Truthfulness Checks

| Check | Result |
|---|---|
| DSS positioning preserved | PASS |
| Board Review Draft wording preserved | PASS |
| Human Review Required preserved | PASS |
| Not Board Approved preserved | PASS |
| Certified PDF avoided | PASS |
| Legal/investment advice avoided | PASS |
| AI autonomy avoided | PASS |
| Marketplace-live claim avoided | PASS |
| Missing score to fake 0 avoided | PASS in documented tests; verify in live demo |
| P2 auth smoke residual disclosed | PASS |

---

## 11. Security Checks

| Check | Result |
|---|---|
| No secrets in docs | PASS |
| Credentials must come from local secret store | PASS |
| No tokens/cookies on screen | Operator must verify before demo |
| Protected API unauth 401 from C.17.8 | PASS |
| Production authenticated smoke | P2 blocked by env/credentials |
| Pilot DPA/subprocessor before provider LLM traffic | REQUIRED |

---

## 12. P2 Residuals

**Residual:** Authenticated production smoke remains pending due `CEOS_E2E_*` env/credentials.

**Impact:**

- Not a confirmed product P0/P1.
- Production perimeter passed in C.17.8.
- Protected APIs returned 401 unauthenticated.
- Before a strong external demo, load `CEOS_E2E_*` from the local secret store and rerun authenticated smoke, or use an operator-verified session and document that choice.

**Do not hide this residual.** Treat it as an operational readiness item.

---

## 13. Demo Readiness Score

| Area | Score / Decision |
|---|---|
| Product demo readiness | 8/10 - strong for controlled pilot if authenticated session is ready |
| Commercial clarity | 8/10 - clear Board Intelligence spine and pilot offer |
| Truthfulness safety | 9/10 - strong guardrails; operator must keep wording disciplined |
| Technical confidence | 7/10 - local tests/build and perimeter pass; authenticated prod smoke still P2 |
| Enterprise/procurement readiness | 4/10 - not procurement-ready and should not be sold that way |
| Overall external demo readiness | 7.5/10 - ready for controlled pilot demo after auth smoke/session prep |

---

## 14. Must Fix Before External Demo

1. Load `CEOS_E2E_*` from local secret store and rerun authenticated smoke, or prepare an operator-verified production session.
2. Confirm at least one persisted Board Review Snapshot exists, or have a safe empty-state narrative.
3. Verify the premium HTML preview opens on the demo machine.
4. Confirm no secrets, tokens, cookies, terminals, raw DB, or `.env` screens are visible.
5. Rehearse the 30-minute spine and avoid module sprawl.

---

## 15. Nice To Have

- Pre-created demo snapshot with clearly safe data.
- One backup screenshot set labelled as illustrative fallback.
- Short pilot close slide extracted from `BOARD_INTELLIGENCE_PILOT_OFFER.md`.
- A one-page objection crib sheet for AI, PDF, certification, and data privacy.
- A short "why not ChatGPT" diagram for technical buyers.

---

## 16. Recommended Next Step

Run the demo internally once, stopwatch it, and close the P2 authenticated smoke residual before a high-stakes external buyer call.

Recommended path:

1. Operator loads production smoke credentials from local secret store.
2. Run authenticated smoke.
3. Execute a 30-minute internal dry run.
4. If no P0/P1 appears, proceed to controlled external pilot outreach.
