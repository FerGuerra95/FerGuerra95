# AI Subprocessor and DPA Gate

**Phase:** C.16.3  
**Status:** Required gate before any real client data reaches an AI provider.

> No real client data may be sent to an AI provider until the DPA/subprocessor path is approved.

---

## 1. Why Provider AI Traffic Creates Subprocessor Risk

External AI providers may process, store, route, inspect, or retain prompts and outputs. If prompts include client data or personal data, the provider may become a subprocessor or equivalent vendor under privacy/security obligations.

---

## 2. Required Legal Review

Counsel must review:

- provider terms;
- data processing terms;
- no-training terms;
- retention terms;
- transfer mechanisms;
- subprocessors;
- liability;
- client disclosure requirements.

---

## 3. Required DPA Review

The pilot DPA must address:

- AI provider role;
- processing purpose;
- data categories;
- transfer location;
- retention/deletion;
- security measures;
- assistance obligations;
- audit/cooperation.

---

## 4. Required Subprocessor Disclosure

Before real client data:

- identify provider;
- identify relevant subprocessors;
- disclose purpose;
- disclose location/transfer basis;
- record client approval or objection window where required.

---

## 5. Required Client Approval Path

Client approval should be documented with:

- client name;
- pilot scope;
- approved data categories;
- provider;
- runtime mode;
- effective date;
- approver;
- limitations.

---

## 6. Required No-Training / Retention Review

Confirm:

- prompts/outputs are not used to train provider models unless explicitly approved;
- retention period;
- deletion path;
- logging controls;
- abuse monitoring implications.

---

## 7. Required Data Transfer Review

Assess:

- processing region;
- cross-border transfer;
- SCCs or equivalent transfer mechanism;
- local law risks;
- client restrictions.

---

## 8. Required Security Review

Security must review:

- API key storage;
- outbound request path;
- rate limits;
- audit logs;
- redaction/minimization;
- prompt injection defenses;
- incident process;
- kill switch.

---

## 9. Required Pilot Scope Approval

Approval must be use-case specific. Approval for synthetic demos does not approve real client data. Approval for Board Review Draft narrative does not approve legal advice, investment advice, scoring, autonomous sending, or full database chat.

---

## 10. Go / No-Go Checklist

| Check | Go required |
|---|---|
| DPA updated/reviewed | Yes |
| Provider terms reviewed | Yes |
| No-training reviewed | Yes |
| Retention reviewed | Yes |
| Data transfer reviewed | Yes |
| Client approval recorded | Yes |
| Security review complete | Yes |
| Redaction tests pass | Yes |
| Prompt injection tests pass | Yes |
| Kill switch tested | Yes |

---

## 11. Approval Record Template

| Field | Value |
|---|---|
| Client / org | `[placeholder]` |
| Provider | `[placeholder]` |
| Approved use case | `[placeholder]` |
| Runtime mode | `[controlled-pilot / production-restricted]` |
| Approved data classes | `[placeholder]` |
| Excluded data classes | `[placeholder]` |
| Approver | `[placeholder]` |
| Legal reviewer | `[placeholder]` |
| Security reviewer | `[placeholder]` |
| Effective date | `[placeholder]` |
| Expiry / review date | `[placeholder]` |

---

## 12. Blockers

Runtime remains blocked if:

- DPA/subprocessor approval missing;
- provider no-training unavailable or unclear;
- retention cannot be bounded;
- client forbids subprocessors;
- data transfer review fails;
- secrets cannot be protected;
- prompt injection tests fail;
- product UI lacks human-review labels.
