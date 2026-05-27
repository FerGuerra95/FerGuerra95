# Pilot Data Handling and Offboarding

**Status:** Internal operational draft for legal/security review.  
**Use:** Controlled pilot data handling guide.  
**Not:** Legal advice, privacy policy, or final DPA.

---

## 1. Data Intake Principles

- Prefer synthetic data until legal path is approved.
- Collect minimum useful data.
- Use client-approved sources.
- Label source and freshness.
- Preserve missing data as missing.
- Convert gaps into board-review questions.

---

## 2. Data Minimization

Before upload, ask:

- Is this required for the pilot decision?
- Can a summary replace raw documents?
- Can personal data be removed?
- Can sensitive fields be redacted?
- Is the human reviewer prepared to review this content?

---

## 3. Prohibited Data

Do not upload unless separately approved by legal/security:

- passwords;
- API keys;
- tokens;
- cookies;
- auth headers;
- raw database dumps;
- private keys;
- payment card data;
- special category personal data;
- privileged legal advice;
- employee medical or disciplinary records;
- export-controlled data;
- unrelated personal data.

---

## 4. Sensitive Data Handling

If sensitive data is required:

- confirm NDA/DPA/SOW path;
- minimize fields;
- restrict access;
- document purpose;
- record retention and deletion requirement;
- avoid provider AI runtime unless subprocessors are approved.

---

## 5. Synthetic vs Real Data

| Data type | Use before NDA/DPA/SOW? | Notes |
|---|---|---|
| IberNova synthetic demo data | Yes | Clearly label as fictional |
| Public non-sensitive data | Usually yes | Confirm source and avoid misleading claims |
| Client confidential data | No | NDA required first |
| Personal data | No | DPA assessment required |
| Highly sensitive data | No | Legal/security approval required |

---

## 6. Storage Principles

- Store only in approved pilot workspace.
- Do not store in chat or issue trackers unless expressly approved.
- Do not store raw secrets.
- Keep tenant scoping.
- Keep audit metadata sanitized.

---

## 7. Access Control

- Named users only.
- No shared passwords.
- Least privilege.
- Reviewer access limited to pilot need.
- Remove access at offboarding.

---

## 8. Retention Placeholder

Retention period: `[placeholder]`

Retention must be defined in SOW/DPA and should specify:

- pilot workspace data;
- uploaded files;
- generated Board Review Drafts;
- persisted snapshots;
- audit logs;
- backups.

---

## 9. Export

Exports must preserve:

- Board Review Draft label;
- Human Review Required;
- Not Board Approved;
- Not Legal Advice;
- Not Investment Advice;
- source/snapshot metadata;
- missing-data labels.

Exports must not claim certified PDF or board approval.

---

## 10. Deletion / Offboarding Checklist

| Step | Owner | Done |
|---|---|---|
| Confirm pilot end date | `[owner]` | `[ ]` |
| Confirm export/return requirements | `[owner]` | `[ ]` |
| Disable pilot users | `[owner]` | `[ ]` |
| Delete uploaded files per SOW/DPA | `[owner]` | `[ ]` |
| Delete or retain snapshots per SOW/DPA | `[owner]` | `[ ]` |
| Remove unnecessary local copies | `[owner]` | `[ ]` |
| Confirm backup retention lifecycle | `[owner]` | `[ ]` |
| Send deletion/offboarding confirmation | `[owner]` | `[ ]` |

---

## 11. Evidence Of Deletion

Evidence may include:

- offboarding checklist;
- system audit record;
- deletion confirmation email;
- retained-data summary;
- exception log.

Do not include secrets or raw personal data in deletion evidence.

---

## 12. Client Confirmation

Client confirmation should record:

- what was returned;
- what was deleted;
- what remains in logs/backups;
- date;
- responsible contacts.

---

## 13. Internal Log

Internal offboarding log should include:

- pilot name;
- client;
- workspace;
- offboarding owner;
- dates;
- retained categories;
- deletion evidence pointer.

---

## 14. What Remains In Audit Logs

Audit logs may retain safe metadata such as:

- actor ID;
- organization ID;
- event type;
- timestamp;
- snapshot ID;
- status transition;
- result;
- blocked reason.

Audit logs must not retain raw tokens, passwords, cookies, auth headers, provider keys, or secure-share bearer tokens.

---

## 15. What Must Not Be Retained

- raw credentials;
- API keys;
- private keys;
- passwords;
- cookies;
- raw auth headers;
- unauthorized personal data;
- raw legal privileged documents unless explicitly agreed;
- client data outside agreed retention.
