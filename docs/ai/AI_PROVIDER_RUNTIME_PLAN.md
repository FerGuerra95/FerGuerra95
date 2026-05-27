# AI Provider Runtime Plan

**Phase:** C.16.3  
**Status:** Planning only / no provider traffic  
**Runtime posture:** Blocked until DPA/subprocessor approval and security review are complete.

---

## 1. Purpose

Define how CEO's OS may activate real AI provider runtime in a future phase without violating DSS, tenant, security, legal, or truthfulness boundaries.

This document does not authorize runtime implementation.

---

## 2. Current Status

- C.16.1 provider abstraction foundation exists.
- C.16.2 Board Review Draft Assistant foundation exists.
- Provider runtime is disabled/mock only.
- No provider SDK, API key, external fetch, streaming path, endpoint, or production provider traffic is authorized by this phase.

---

## 3. Why Runtime AI Is Not Enabled Yet

Runtime provider traffic remains blocked because the following gates are not complete:

- provider selection;
- DPA/subprocessor review;
- no-training/data-retention review;
- international transfer review;
- secrets/secret-store configuration;
- prompt injection test suite;
- tenant-scope integration tests;
- output evaluation gates;
- product UI review for Human Review Required labels.

---

## 4. Provider-Neutral Architecture

The architecture must remain provider-neutral:

- application code calls the internal AI abstraction only;
- provider-specific code stays behind a single server-side adapter;
- frontend never imports provider SDKs;
- renderer never calls providers;
- prompt registry and guardrails remain provider-independent.

---

## 5. Required Gates Before Provider Traffic

| Gate | Required before runtime? |
|---|---|
| Legal DPA/subprocessor approval | Yes |
| Provider no-training and retention review | Yes |
| Secret-store/API key setup | Yes |
| Tenant-context tests | Yes |
| Prompt injection tests | Yes |
| Redaction/minimization tests | Yes |
| Human-review UI labels | Yes |
| Kill switch tested | Yes |
| Audit logging with redaction | Yes |
| Cost/rate limits | Yes |

---

## 6. Runtime Modes

| Mode | Provider traffic | Allowed data | Use |
|---|---|---|---|
| `disabled` | No | None | Default production posture |
| `mock` | No | Synthetic/test only | Unit/integration tests |
| `sandbox` | Yes, if approved | Synthetic only | Provider connectivity after approval |
| `internal-only` | Yes, if approved | Internal non-client test data | Red team and QA |
| `controlled-pilot` | Yes, if approved | Explicitly approved pilot data only | Limited customer pilot |
| `production-restricted` | Yes, if approved | Contract-approved production data | Future restricted release |

Default must remain `disabled`.

---

## 7. Feature Flags

Future flags should separate:

- provider runtime enabled;
- use case enabled;
- organization enabled;
- user role enabled;
- data class enabled;
- streaming enabled/disabled;
- provider fallback disabled by default.

No flag may bypass DPA/subprocessor approval for real client data.

---

## 8. Kill Switch

The system must have a server-side kill switch that:

- disables all provider traffic immediately;
- returns explicit disabled/error status;
- does not generate fake AI output;
- records sanitized audit metadata;
- can be set without redeploy if possible.

---

## 9. Environment Variables Policy

- API keys only in secret store / environment.
- No keys in repo, docs, frontend bundle, tests, logs, or screenshots.
- Environment names must not imply production readiness until legal/security gates are complete.
- Missing keys should fail closed.

---

## 10. Secrets Policy

Never send to provider:

- API keys;
- passwords;
- tokens;
- cookies;
- auth headers;
- private keys;
- raw secure-share links;
- raw database dumps.

---

## 11. Provider Abstraction Requirements

Runtime adapter must:

- enforce allowed use cases;
- enforce tenant context;
- enforce data class boundaries;
- call redaction/minimization before provider request;
- attach prompt version;
- classify output as draft;
- never mutate module records or workflow state.

---

## 12. Logging / Redaction Requirements

Audit logs may include:

- organization ID;
- actor ID;
- use case;
- provider/model identifier;
- prompt version;
- input size/hash;
- output classification;
- refusal/error code;
- token/cost metadata where safe.

Audit logs must not include raw secrets, full prompts with sensitive data, raw provider credentials, or raw client files.

---

## 13. Error Handling Requirements

- Provider errors must not be hidden.
- No silent fallback to fake content.
- UI must show controlled "AI unavailable" state.
- Retry must be bounded.
- Error metadata must be sanitized.

---

## 14. Rate Limits

Future runtime must include:

- per-tenant quota;
- per-user quota;
- per-use-case quota;
- timeout;
- max input size;
- max output size;
- abuse detection.

---

## 15. Cost Controls

- Require org-level enablement.
- Track safe token/cost metadata.
- Block large prompts.
- Prefer snapshot summaries over raw documents.
- Require explicit pilot budget owner for controlled-pilot mode.

---

## 16. Human Review Gate

All AI outputs must show:

- AI Draft;
- Requires Human Review;
- Based on DSS Signals;
- Not Legal Advice;
- Not Investment Advice;
- Not Board Approved.

AI cannot mark `reviewed`, `internal_final`, approved, certified, or sent.

---

## 17. Rollout Criteria

Runtime rollout can start only when:

- legal/subprocessor gates complete;
- security review complete;
- synthetic tests pass;
- prompt injection tests pass;
- output evaluation framework is adopted;
- kill switch tested;
- support/offboarding path documented.

---

## 18. Rollback Criteria

Rollback immediately if:

- provider receives forbidden data;
- prompt injection bypass is confirmed;
- output hides `insufficient_data`;
- output gives legal/investment advice;
- output claims approval/certification;
- secrets appear in logs/prompts;
- cost/latency exceeds pilot guardrails.

---

## 19. C.16.4 Implementation Boundaries

C.16.4 may implement only a sandbox provider client behind feature flags if separately authorized.

C.16.4 must not:

- process real client data;
- add frontend provider SDK;
- enable provider traffic by default;
- bypass DPA/subprocessor gate;
- mutate source-of-truth records;
- allow autonomous actions.
