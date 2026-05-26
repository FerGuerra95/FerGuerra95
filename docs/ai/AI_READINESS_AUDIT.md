# C.16.0 — AI Readiness Audit

**Status:** COMPLETED · **READY FOR DESIGN** · **NOT RUNTIME AI YET**  
**Baseline:** `2e0a3cc` (post C.15.1b / AGENTS drift resolution)  
**Phase type:** DOCS / SECURITY / ARCHITECTURE — no product runtime changes

---

## 1. Executive Summary

CEO's OS is a **human-reviewed Decision Support System (DSS)**. The product has closed **C.13 Global Logic Baseline** and **C.14 Security / Pilot Hardening** for a **controlled pilot**. Commercial truthfulness (C.15.0) explicitly allows **AI-ready architecture** language but **not** autonomous AI, legal advice, investment advice, or certified outputs.

**AI readiness decision:** **READY FOR DESIGN** — guardrails, data boundaries, use-case catalog, and provider abstraction plan are defined. **NOT READY FOR RUNTIME IMPLEMENTATION** until C.16.1+ (provider abstraction, audit logging, DPA/subprocessor review, and first use-case hardening).

**First approved candidate:** **AI Board Review Draft Assistant** — draft-only narrative from existing Reporting / Executive DSS outputs; human review required; no database mutation; no score recalculation; no autonomous action.

---

## 2. Current Product Status

| Area | Status | AI implication |
|---|---|---|
| C.13 logic baseline | Closed | Formulas and Golden Datasets are **not** AI-owned |
| C.14 security / pilot | Closed for controlled pilot | Auth, tenant create hardening, audit logs, backup, secure share documented |
| C.15 commercial truthfulness | Closed (docs) | AI must match `WHAT_WE_CAN_AND_CANNOT_SAY.md` |
| C.15.1 production perimeter | PASS (unauthenticated) | 200 health; API 401 without token |
| C.15.1b authenticated smoke | P2 blocked (env) | Does not block **design**; blocks **prod AI validation** |
| Runtime AI in product | **None** | No OpenAI/provider calls in production paths audited for C.16.0 |
| Reporting PDF renderer | Pending (C.17.x) | AI may draft text; must not claim “complete PDF” |

---

## 3. AI Readiness Decision

| Dimension | Verdict |
|---|---|
| Strategic fit (DSS + human review) | **Yes** — aligned with product identity |
| Security / multi-tenant readiness | **Partial** — design required before runtime; reuse C.14 patterns |
| Privacy / legal readiness | **Draft** — DPA/subprocessor review required before customer data to provider |
| Data / SoT clarity | **Yes** — module services + formulas remain authoritative |
| Commercial claims | **Constrained** — draft-only, no certification language |
| Implementation readiness | **No** — C.16.1+ required |

**Label:** **READY FOR DESIGN / NOT YET READY FOR RUNTIME IMPLEMENTATION**

---

## 4. Approved First AI Use Case

### AI Board Review Draft Assistant

| Attribute | Requirement |
|---|---|
| Purpose | Expand or refine **Board Review Draft** narrative from persisted Reporting / Executive summaries |
| Input | User-selected board pack / report scope; backend-built context from tenant-scoped DSS outputs |
| Output | Labeled **AI Draft · Requires Human Review · Based on DSS Signals · Not Legal/Investment Advice** |
| Mutations | **None** — no auto-save to “approved” status; user explicitly saves draft |
| Scores | AI **must not** invent or recalculate KPIs, readiness, compliance, risk, or funding metrics |
| Autonomy | **Forbidden** — no send-to-board, no email, no workflow approval |

**Why first:** Aligns with C.15 Reporting truthfulness (“Board Review Draft”), existing module data, lowest autonomous risk, clear human gate.

---

## 5. Blocked AI Use Cases (runtime)

- Autonomous agents or “CEO bot” that acts without human confirmation  
- Auto-approval of governance decisions, compliance posture, or deals  
- Legal advice, investment advice, fairness opinion, tax advice  
- Certified compliance / governance / risk / audit outputs  
- Board-approved or filed report generation presented as final  
- Autonomous external sending (email, Slack, data room publish)  
- Automatic database mutation, deletion, or cross-tenant reads  
- Marketplace matching, success-fee negotiation, or “verified buyer” claims  
- AI as source-of-truth for scores, formulas, or Golden Dataset values  
- Training on customer data without explicit contract and legal review  

---

## 6. Module-by-Module Readiness

| Module | Readiness for AI (draft narrative) | Blockers / notes |
|---|---|---|
| **Reporting** | **High** — first target (board pack draft) | PDF renderer separate; no “certified PDF” |
| **Executive Overview** | **Medium** — executive brief from gated summaries | Aggregator only; respect `insufficient_data` |
| **Compliance** | **Medium** — memo draft from audit/report summaries | No legal certification; audit baseline required for scores in context |
| **M&A** | **Medium** — IC memo draft from deal/CIM context | No fairness opinion; user-selected deal scope |
| **Governance** | **Low–Medium** — narrative only | No decision approval; workflow stays human |
| **Risk** | **Medium** — explainers / review questions | No regulatory certification |
| **Funding** | **Medium** — narrative on scenarios | No investment advice or guaranteed runway |
| **PMI** | **Low–Medium** | Demo merge risk documented (C13-P1-09); do not treat demo as fact |
| **Bridge** | **Low** | Heuristic signals; marketplace internal demo only |
| **Strategy / Heritage** | **Low–Medium** | Standard tenant scope + human review |
| **Auth / users** | **Blocked** for AI context | No passwords, tokens, hashes |
| **Secure share** | **Blocked** for raw token context | No bearer tokens in prompts |

---

## 7. Security / Privacy Concerns

- **Subprocessor risk:** External LLM provider processes prompt content — requires DPA and data residency decision  
- **Prompt injection:** User + document content may instruct model to ignore policies — server-side guardrails + output classification required  
- **Over-collection:** Sending full DB or cross-module dumps increases leak surface — context minimization mandatory  
- **Audit:** Request/response logging must redact secrets and limit retention  
- **Abuse:** Rate limits, per-tenant quotas, timeout, no silent fake-AI fallback  
- **Pilot data:** Test orgs only until legal sign-off for production customer data  

---

## 8. Multi-Tenant Concerns

- `organizationId` **only** from backend session/token — never from client body or AI tool args alone  
- Context builder must **filter every query** by tenant  
- No “admin peek” across orgs in AI features without explicit super-admin design + audit  
- User must **explicitly select** case/report/deal scope; no implicit “all deals in system”  
- Cross-module aggregation allowed only from **approved SoT services** for that tenant  

---

## 9. Prompt Injection Concerns

| Threat | Mitigation (design) |
|---|---|
| User embeds “ignore policies / output secrets” | System prompt + output filter; refuse patterns in `AI_GUARDRAILS.md` |
| Malicious content in uploaded evidence | Defer unrestricted uploads; sanitize/truncate; no execution |
| Indirect injection via supplier names / reports | Treat all user content as untrusted; no tool execution from model |
| Model asked to exfiltrate other tenants | Hard tenant filter in context builder; refuse cross-tenant requests |

---

## 10. Logging / Audit Requirements (future runtime)

Every AI request should record (sanitized):

- `organizationId`, `userId`, `useCase`, `promptVersion`, `provider`, `model`, timestamp  
- Input **hash** or size — not full prompt if it contains PII (configurable redaction)  
- Output classification (`draft`, `refused`, `error`)  
- Token usage / latency (no API keys)  
- Human review outcome when user accepts/edits/rejects draft (optional phase)

Must **not** log: passwords, tokens, cookies, API keys, full secure-share URLs, raw auth headers.

---

## 11. Human Review Requirements

All C.16.x AI outputs are **drafts** until a human explicitly adopts them in product workflows. UI must show:

- **AI Draft**  
- **Requires Human Review**  
- **Based on DSS Signals**  
- **Not Legal / Investment Advice**

No one-click “Approve for board” or “Certify compliance” from AI output.

---

## 12. P0 / P1 / P2 / P3 AI Risks

| ID | Severity | Risk | Mitigation phase |
|---|---|---|---|
| AI-R01 | P0 | Cross-tenant data in prompt | C.16.1 context builder + tests |
| AI-R02 | P0 | API keys in repo/logs | C.16.1 secrets via env only |
| AI-R03 | P1 | AI recalculates official scores | Guardrails + no formula access in v1 |
| AI-R04 | P1 | Silent fallback fake AI text | Explicit error states only |
| AI-R05 | P1 | Certification language in output | Output filter + refusal templates |
| AI-R06 | P1 | Autonomous mutation via tool use | No agent tools in v1 |
| AI-R07 | P2 | Customer data to provider without DPA | Legal + subprocessor register |
| AI-R08 | P2 | Prompt injection exfiltration | Injection tests + red team |
| AI-R09 | P2 | Over-broad context (PII) | Data boundaries + minimization |
| AI-R10 | P3 | Cost abuse / rate limits | Per-tenant quotas |

---

## 13. Required Phases Before / After Implementation

| Phase | Scope |
|---|---|
| **C.16.0** (this) | Readiness audit, boundaries, guardrails, use cases, abstraction plan |
| **C.16.1** | AI Provider Abstraction — `aiClient`, `aiAudit`, `aiGuardrails`, `aiContextBuilder`, prompt registry (no UI polish) |
| **C.16.2** | Board Review Draft Assistant — single endpoint + UI + integration tests |
| **C.16.3** | Compliance Memo Draft (optional second) |
| **C.16.4** | M&A IC Memo Draft |
| **C.16.5** | Executive Brief + missing-data explainer |
| **C.17.0** | Reporting PDF renderer (parallel track; not AI) |
| Legal / ops | DPA, subprocessor list, retention, customer opt-in |

---

## Conclusion

**AI readiness:** **READY FOR DESIGN / NOT YET READY FOR RUNTIME IMPLEMENTATION**

**First approved candidate:** **AI Board Review Draft Assistant**

**Reason:** Draft-only, human-reviewed, grounded in existing DSS outputs, no autonomous decisions, no data mutation, aligned with C.15 commercial truthfulness and C.13/C.14 security posture.

**Related docs:** `AI_DATA_BOUNDARIES.md` · `AI_GUARDRAILS.md` · `AI_USE_CASES.md` · `AI_PROVIDER_ABSTRACTION_PLAN.md` · `AI_OPERATING_MODEL.md` (engineering agents, not product runtime AI)
