# AI Data Boundaries — CEO's OS / The Sovereign OS

**Status:** C.16.0 design · **Not enforced in runtime until C.16.1+**  
**Principle:** Minimize data sent to external AI providers; tenant scope is server-authoritative.

---

## 1. Data AI May Read (Phase 1 — Board Review Draft Assistant)

| Category | Examples | Conditions |
|---|---|---|
| Executive summaries | Module cards, readiness index, corporate health radar **labels** (not raw cross-tenant) | From `executiveOverview` for **session org** only |
| Reporting drafts | Board pack metadata, section titles, KPI text already shown in UI | User-selected pack/report ID |
| DSS narrative fields | Headlines, posture, `insufficient_data` flags, human-review labels | No reinterpretation as certification |
| Module summaries | Non-secret risk/compliance/funding/M&A **summary** fields from backend services | Tenant-scoped API only |
| User-selected scope | Single deal, single report, single program | Explicit ID validated server-side |
| Sanitized evidence summaries | Short excerpts if user attaches to draft request | Truncated; no bulk export |

---

## 2. Data AI Must NOT Read (Phase 1)

| Category | Reason |
|---|---|
| Raw secrets | `AUTH_SECRET`, API keys, provider keys |
| Auth artifacts | Tokens, cookies, session IDs, JWT, `id_token`, refresh tokens |
| Credential material | Passwords, password hashes, salts, bootstrap secrets |
| Full database dumps | Cross-record exfiltration risk |
| Cross-tenant data | Any org not matching session `organizationId` |
| Secure-share bearer tokens | Full URLs with secrets |
| Unscoped uploads | Entire data room / all suppliers without user selection |
| System environment | `.env`, process env, Render secrets |
| Audit log raw payloads | May contain sensitive metadata — use redacted summaries only |
| Golden Dataset files as “truth” | AI must not override formulas; oracles are engineering-only |

---

## 3. Special Categories & PII

- Avoid sending **unnecessary** personal data (emails, full names) in prompts; prefer role labels (“CFO”, “Supplier A”) when sufficient.  
- If PII is required for a memo, **minimize** and document in DPA.  
- No special-category data (health, biometric, etc.) unless explicit legal basis and feature design.  

---

## 4. Multi-Tenancy Rules

1. **`organizationId` injected by backend** from authenticated session — never trust client-only scope.  
2. **User must select scope** (report ID, board pack ID, deal ID) — server validates ownership.  
3. **No silent tenant expansion** — e.g. “all organizations” or “global benchmark across customers”.  
4. **No hidden cross-module aggregation** beyond what approved context builder explicitly loads.  
5. **Context size caps** — truncate lists (top N risks, top N suppliers) with explicit “truncated” flag in prompt metadata.

---

## 5. Training & Retention

| Rule | Default |
|---|---|
| Train on customer data | **Disabled** unless explicit contract + legal approval |
| Provider retention | Use enterprise API terms with **no training** where available |
| Our logs | Redacted audit of prompts/responses; retention per pilot security pack |
| Output storage | Draft text in tenant-scoped tables only if user saves — not provider-side by default |

---

## 6. Context Builder Contract (C.16.1)

The future `aiContextBuilder.service.js` must:

- Accept `{ organizationId, userId, useCase, scopeIds }` only from authorized handlers  
- Load data via **existing module services** (Reporting, Executive, etc.) — not ad-hoc SQL across tenants  
- Return a **structured, redacted** context object + `provenance[]` (source module, record id, field names)  
- Attach `insufficient_data` markers where SoT is null — AI must not invent values  
- Refuse build if scope IDs fail ownership check  

---

## 7. Provenance & Citations

AI outputs should reference **which DSS fields** informed the draft (e.g. “Based on Reporting board pack X, section Y”). AI must **not** cite Golden Dataset IDs as if they were customer facts unless those values were already persisted and included in context.

---

## Related

- `AI_READINESS_AUDIT.md`  
- `AI_GUARDRAILS.md`  
- `docs/privacy/DATA_PROCESSING_SUMMARY.md`  
- `docs/architecture/SOURCE_OF_TRUTH_REGISTRY.md`
