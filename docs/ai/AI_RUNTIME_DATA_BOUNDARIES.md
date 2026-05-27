# AI Runtime Data Boundaries

**Phase:** C.16.3  
**Status:** Planning only / no runtime AI enabled

---

## 1. Data Classes

| Class | Description |
|---|---|
| Synthetic demo data | Fictional data such as IberNova Industrial Group S.L. |
| Internal test data | Non-client test fixtures or internal examples |
| Client-provided business data | Non-public company data supplied for pilot |
| Personal data | Any personal data under GDPR/RGPD or other privacy law |
| Sensitive/confidential data | Board materials, M&A data, funding materials, supplier risk, compliance evidence |
| Secrets | Tokens, passwords, cookies, API keys, private keys, auth headers |
| Regulated data | Special category, export-controlled, financial regulated, privileged, or other restricted data |

---

## 2. Allowed Data By Runtime Mode

| Mode | Allowed data |
|---|---|
| `disabled` | None |
| `mock` | Synthetic and test fixtures only |
| `sandbox` | Synthetic only |
| `internal-only` | Internal non-client data only |
| `controlled-pilot` | Approved pilot data only after DPA/subprocessor path |
| `production-restricted` | Contract-approved production data only |

---

## 3. Forbidden Data By Runtime Mode

Secrets are forbidden in every mode.

Real client data is forbidden in:

- `disabled`;
- `mock`;
- `sandbox`;
- `internal-only`;
- any mode before DPA/subprocessor approval.

Regulated data is forbidden unless separately approved in writing by legal/security.

---

## 4. Redaction Requirements

Before provider request:

- strip secrets;
- strip auth artifacts;
- strip raw secure-share tokens;
- minimize personal data;
- remove unnecessary names/emails/phone numbers;
- remove raw database exports;
- remove irrelevant document sections;
- preserve missing-data markers.

---

## 5. Minimization Rules

Use the smallest context that can answer the draft task:

- prefer persisted snapshot summaries;
- prefer module signal summaries;
- prefer missing-data maps;
- avoid full data rooms;
- avoid raw spreadsheets unless specifically approved and minimized.

---

## 6. No Secrets In Prompts

Prompts must never include passwords, tokens, cookies, auth headers, API keys, private keys, or raw bearer URLs.

---

## 7. No Tokens In Prompts

Secure-share tokens, session tokens, JWTs, access tokens, refresh tokens, and provider keys must be blocked before prompt construction.

---

## 8. No DB Dumps In Prompts

Raw SQL dumps, table exports, backup files, and unbounded JSON dumps are forbidden.

---

## 9. No Full Data Room In Prompt

The AI runtime may receive curated excerpts or summaries only. Full data room ingestion is out of scope for C.16.4.

---

## 10. Snapshot-Based Context Only

Board Review Draft use cases should use persisted snapshot `rendererInput`, sanitized audit metadata, module signal summaries, and explicit missing-data flags. AI must not query modules directly or become source-of-truth.

---

## 11. Human Approval Before Real Client Data

Before real client data reaches a provider:

- sponsor approval;
- legal/DPA approval;
- subprocessor approval;
- data owner approval;
- human reviewer identified;
- runtime mode explicitly enabled.

---

## 12. Retention And Deletion Placeholders

Provider contract review must define:

- whether prompts are retained;
- retention duration;
- deletion mechanism;
- no-training setting;
- audit evidence;
- subprocessors;
- transfer location.

---

## 13. Audit Metadata Requirements

Record sanitized:

- organization ID;
- actor ID;
- use case;
- data class;
- runtime mode;
- prompt version;
- provider/model;
- redaction result;
- output classification;
- refusal/error status.

Do not record raw prompt if it contains sensitive or personal data.
