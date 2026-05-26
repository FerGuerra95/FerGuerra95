# AI Provider Abstraction Plan — C.16.1 (Design Only)

**Status:** C.16.0 design · **Not implemented**  
**Goal:** Single backend boundary for LLM providers so modules never embed vendor SDKs or API keys.

---

## 1. Principles

- **No provider hardcoded** in feature modules (Reporting, Compliance, etc.)  
- **No API keys in repository** — env / secret manager only  
- **Provider selected by env** (e.g. `AI_PROVIDER=openai|azure|mock`)  
- **organizationId from auth context** only  
- **Request/response audit** with redaction  
- **Prompt registry versioning** (`aiPromptRegistry.js`)  
- **No streaming** until audit + redaction pipeline is proven  
- **Rate limits + abuse controls** per org/user  
- **Timeout** with explicit error — **no silent fallback to fake AI text**  
- **Output classification** before returning to client (`draft`, `refused`, `error`)

---

## 2. Proposed Services (backend)

| File | Responsibility |
|---|---|
| `backend/services/ai/aiClient.service.js` | Provider adapter interface; `complete({ messages, model, timeout })` |
| `backend/services/ai/aiAudit.service.js` | Persist sanitized audit rows; link to `audit_logs` pattern |
| `backend/services/ai/aiPromptRegistry.js` | Versioned system/user templates per use case |
| `backend/services/ai/aiGuardrails.service.js` | Pre-flight scope checks; post-flight output filter + refusals |
| `backend/services/ai/aiContextBuilder.service.js` | Tenant-scoped DSS context assembly per `AI_DATA_BOUNDARIES.md` |

Optional later:

- `aiRateLimit.service.js` — wrap existing rate limiter patterns  
- `aiMockProvider.js` — deterministic responses for tests (no network)

---

## 3. Proposed API Routes (future)

All routes: **authenticated**, **permission-checked**, **tenant-scoped**, **POST only** for generation.

| Route | Use case | Notes |
|---|---|---|
| `POST /api/ai/board-review-draft` | Board Review Draft Assistant | Body: `{ boardPackId \| reportId, sectionKeys? }` |
| `POST /api/ai/compliance-memo-draft` | Compliance memo (later) | Body: `{ reportId \| auditRunId }` |
| `POST /api/ai/ma-ic-memo-draft` | M&A IC memo (later) | Body: `{ dealId }` |

**Not in v1:** streaming endpoints, agent tool endpoints, batch jobs.

Response shape (illustrative):

```json
{
  "data": {
    "draftText": "...",
    "labels": ["AI Draft", "Requires Human Review", "Based on DSS Signals"],
    "provenance": [{ "module": "reporting", "recordId": "...", "fields": ["headline"] }],
    "classification": "draft",
    "promptVersion": "board_review_draft_v1"
  }
}
```

---

## 4. Environment Variables (names only)

| Variable | Purpose |
|---|---|
| `AI_PROVIDER` | Provider key |
| `AI_API_KEY` | Secret — never commit |
| `AI_MODEL` | Default model id |
| `AI_BASE_URL` | Optional custom endpoint |
| `AI_TIMEOUT_MS` | Request timeout |
| `AI_ENABLED` | Feature flag — default `false` until pilot sign-off |

---

## 5. Request Flow

```
Client → auth.middleware → permission check → ai.routes
  → aiGuardrails.validateScope()
  → aiContextBuilder.build(organizationId, scopeIds)
  → aiPromptRegistry.render(useCase, context)
  → aiClient.complete()
  → aiGuardrails.filterOutput()
  → aiAudit.record(redacted)
  → JSON response (draft only)
```

---

## 6. Security Checklist (C.16.1 implementation gate)

- [ ] DPA / subprocessor review for chosen provider  
- [ ] Keys in Render/secret store only  
- [ ] Tenant isolation tests (wrong org ID → 403)  
- [ ] Viewer role cannot call AI mutate endpoints  
- [ ] Prompt injection regression tests (refusal templates)  
- [ ] No secrets in audit metadata  
- [ ] Rate limit per org  
- [ ] Integration tests with mock provider only in CI  

---

## 7. Testing Strategy

- **Unit:** mock provider; guardrails refusal cases; context builder redaction  
- **Integration:** authenticated POST with test org; assert no cross-tenant  
- **No live provider calls in CI** by default  
- **Golden / Formula:** AI tests must **not** assert LLM numeric outputs as oracles  

---

## 8. Explicit Non-Goals (C.16.1)

- Frontend provider SDK  
- OpenAI dependency in `package.json` until approved phase  
- Autonomous agents, tool use, RAG over full DB  
- Customer data used for provider fine-tuning  

---

## Related

- `AI_READINESS_AUDIT.md`  
- `AI_DATA_BOUNDARIES.md`  
- `AI_GUARDRAILS.md`  
- `AI_USE_CASES.md`
