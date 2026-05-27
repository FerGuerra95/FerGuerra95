# AI Use Cases — CEO's OS / The Sovereign OS

**Status:** C.16.0 catalog · No runtime implementation  
**Legend:** **Approved (first)** · **Approved (later)** · **Deferred** · **Blocked**

---

| Use Case | Status | Why | Allowed Output | Forbidden Output | Future Phase |
|---|---|---|---|---|---|
| AI Board Review Draft Assistant | **Approved (first)** | Draft-only; human review; uses Reporting/Executive DSS; no mutation | Section narratives, executive summary draft, review questions | Board-approved pack, certified PDF, autonomous send | **C.16.2** |
| AI Compliance Memo Draft | Approved (later) | Memo from audit/report summaries; tenant-scoped | Draft memo, gap narrative, review checklist | Legal certification, “compliant” verdict | C.16.3 |
| AI M&A IC Memo Draft | Approved (later) | User-selected deal; CIM/deal context | IC narrative, diligence themes | Fairness opinion, guaranteed match | C.16.4 |
| AI Executive Brief | Approved (later) | From gated executive overview | Weekly brief draft | Autonomous prioritization / decisions | C.16.5 |
| AI Missing Data Explainer | Approved (later) | Explains `insufficient_data` flags | Plain-language gaps list | Invented scores to fill gaps | C.16.5 |
| AI Review Questions Generator | Approved (later) | Questions for human reviewers | Question lists for board/risk/compliance | Auto-answers presented as facts | C.16.5 |
| AI narrative summarizer (module DSS) | Approved (later) | Summarize existing calculated fields | Short summaries with citations | Recalculated KPIs | C.16.5+ |
| AI autonomous agents | **Deferred** | Conflicts with DSS human-review model | — | Any autonomous workflow | Not planned v1 |
| AI scoring engine | **Deferred** | SoT is formulas/Golden/services | — | Replacement risk/compliance scores | Not planned |
| AI legal opinion | **Blocked** | Regulatory / liability | — | Legal advice text as authoritative | — |
| AI investment recommendation | **Blocked** | Regulatory / liability | — | Buy/sell/hold, valuation opinion | — |
| AI marketplace matching | **Blocked** | Internal demo only; commercial false claim | — | Live marketplace matching | — |
| AI external sending | **Blocked** | Autonomous action | — | Email/Slack/deal room publish | — |
| AI auto-remediation | **Blocked** | DB mutation | — | Fix records, delete suppliers | — |
| AI procurement/legal answers | **Blocked** | Not product scope | — | “Procurement-ready”, DPA answers as law | — |
| AI training on tenant data | **Deferred** | Legal/DPA required | — | Default training | Contract-only |
| AI chat over full database | **Blocked** | Exfiltration risk | — | Arbitrary SQL/RAG over all tables | — |

---

## Implementation Order (recommended)

1. **C.16.1** — Provider abstraction + audit + guardrails (no user-facing feature)  
2. **C.16.2** — Board Review Draft Assistant  
3. **C.16.3–C.16.5** — Additional approved-later use cases  
4. **C.17.0** — PDF renderer (parallel; not AI)

---

## C.16.2 Implementation Status

**AI Board Review Draft Assistant foundation:** IMPLEMENTED AS INTERNAL SERVICE ONLY.

- Internal backend service: `backend/services/ai/boardReviewDraft.service.js`.
- Uses C.16.1 provider abstraction through disabled/mock modes only.
- Produces draft-only structured output from supplied DSS context.
- Requires human review and labels output as AI Draft / Requires Human Review / Based on DSS Signals / Not Legal Advice / Not Investment Advice / Not Board Approved.
- No endpoint, UI, provider SDK, API key, external fetch, streaming, database mutation, or provider traffic.
- Does not calculate official scores, certify posture, approve board material, or provide legal/investment advice.

---

## C.17.0 Board Pack Renderer Relationship

- AI Board Review Draft Assistant may feed draft narrative into a future Board Pack renderer.
- Renderer must preserve AI Draft, Requires Human Review, Based on DSS Signals, Not Legal Advice, Not Investment Advice, and Not Board Approved labels.
- AI cannot set `reviewed` or `internal_final`.
- AI cannot approve a report, certify a report, or replace module-owned source-of-truth.
- See `docs/reporting/BOARD_REVIEW_DRAFT_SPEC.md`.

---

## Related

- `AI_READINESS_AUDIT.md`  
- `AI_GUARDRAILS.md`  
- `AI_PROVIDER_ABSTRACTION_PLAN.md`
---

## C.16.3 Near-Term Runtime Use-Case Boundary

Approved near-term runtime candidates after legal/security gates:

| Use case | Boundary |
|---|---|
| Board Review Draft narrative | Draft-only, based on persisted snapshot/DSS context |
| Outreach draft assistant | Draft copy only; human sends/edits |
| Call note summarization | Summarize human-provided notes; no CRM automation |
| Missing data questions | Generate review questions; do not invent answers |

Blocked use cases:

- autonomous email sending;
- autonomous approval/review/internal-final marking;
- legal advice;
- investment advice;
- fairness opinions;
- certified compliance conclusions;
- formula or score recalculation;
- source-of-truth changes;
- full database chat;
- real client data before DPA/subprocessor approval.
