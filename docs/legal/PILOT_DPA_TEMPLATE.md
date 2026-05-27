# Pilot DPA Template

**Status:** Draft for legal review only.  
**Use:** Internal starting point for counsel when pilot data processing may involve personal data or client-controlled data.  
**Not:** Legal advice, final DPA, or ready-to-sign template.

> No real client data should be processed until the required NDA/SOW/DPA path is approved. Synthetic demo data may be used before DPA review.

---

## 1. Role Assessment

Controller / processor assessment:

- Client role: `[controller / controller-equivalent placeholder]`
- CEO's OS provider role: `[processor / service provider / other placeholder]`
- Joint controller analysis required? `[yes/no placeholder]`

Legal counsel must confirm roles under GDPR/RGPD or other applicable privacy laws.

---

## 2. Subject Matter

Processing of limited pilot data to configure and operate a controlled CEO's OS Board Intelligence pilot, including Reporting / Board Review Draft workflows, persisted snapshots, audit metadata, and optional scoped modules.

---

## 3. Duration

Processing starts on `[date]` and ends on the earlier of:

- pilot termination;
- end of SOW;
- completed offboarding/deletion;
- `[other placeholder]`.

---

## 4. Nature and Purpose of Processing

Nature:

- ingesting limited client-provided business data;
- structuring DSS context;
- generating Board Review Drafts;
- storing persisted snapshots and audit metadata;
- supporting human review sessions.

Purpose:

- controlled pilot evaluation;
- board preparation support;
- missing-data mapping;
- review workflow demonstration.

---

## 5. Categories of Data Subjects

Potential categories, if supplied by client:

- client employees or management contacts;
- supplier or counterparty contacts;
- customer contacts if strictly necessary;
- advisor contacts;
- pilot users.

Prefer business contact metadata and avoid unnecessary personal data.

---

## 6. Categories of Personal Data

Potential categories:

- name;
- business role/title;
- business email;
- business phone;
- organization;
- pilot access/user metadata;
- comments or document metadata supplied by client.

Special category data should not be supplied unless expressly approved in writing by legal counsel.

---

## 7. Client Instructions

CEO's OS provider processes pilot data only on documented client instructions in the SOW/DPA and reasonable written instructions during the pilot.

The client remains responsible for ensuring it has the right to provide the data.

---

## 8. Confidentiality

Personnel with access to pilot data must be subject to confidentiality obligations. Access should be limited to those required to operate, support, secure, or review the pilot.

---

## 9. Security Measures / TOMs

See Annex B. Measures should be reviewed and completed before signature.

Minimum principles:

- access control;
- least privilege;
- authentication;
- secure storage;
- encryption where applicable;
- auditability;
- no secrets in docs or chat;
- tenant separation;
- incident handling process.

---

## 10. Subprocessors

Subprocessors are listed in Annex C.

No production provider AI traffic using real client data is permitted unless subprocessors, transfer basis, and client approval are separately documented.

---

## 11. International Transfers

International transfer mechanism:

`[EU SCCs / adequacy / no transfer / other placeholder]`

Counsel must assess international transfers before real client data processing.

---

## 12. Assistance With Data Subject Rights

CEO's OS provider will reasonably assist the client with data subject requests related to pilot data, subject to scope, identity verification by the client, and technical feasibility.

---

## 13. Breach Notification

Security incident and personal data breach notification timing:

`[placeholder; legal counsel to define]`

Provider should notify client without undue delay after confirming an incident affecting pilot data.

---

## 14. Return / Deletion After Pilot

Upon pilot completion or termination, pilot data must be returned or deleted according to the SOW/DPA and the offboarding checklist.

Deletion exceptions must be documented, such as:

- legal retention;
- billing records;
- security logs;
- backup lifecycle;
- audit logs with minimized metadata.

---

## 15. Audit / Evidence / Cooperation

Provider will provide reasonable evidence of compliance for the pilot scope. This is not a SOC2/ISO certification claim.

---

## Annex A - Processing Details

| Field | Placeholder |
|---|---|
| Pilot name | `[pilot name]` |
| Client | `[client legal name]` |
| Modules | `[Reporting / Board Intelligence / optional modules]` |
| Data categories | `[list]` |
| Data subjects | `[list]` |
| Processing location | `[placeholder]` |
| Retention | `[placeholder]` |

---

## Annex B - Security Measures

| Measure | Description / Placeholder |
|---|---|
| Access control | `[roles, least privilege]` |
| Authentication | `[method]` |
| Tenant scoping | `organizationId from backend/session; frontend does not decide tenant` |
| Encryption | `[at rest / in transit placeholder]` |
| Logging | `[audit and security logs]` |
| Incident response | `[contact and timeline placeholder]` |
| Backups | `[placeholder]` |
| Offboarding | See Annex D |

---

## Annex C - Subprocessors

| Subprocessor | Purpose | Location | Status |
|---|---|---|---|
| `[none / TBD]` | `[purpose]` | `[location]` | Legal review required |

AI provider runtime must remain disabled for real client data unless separately approved.

---

## Annex D - Deletion / Offboarding Record

| Item | Completed by | Date | Evidence |
|---|---|---|---|
| Data export returned if agreed | `[name]` | `[date]` | `[link/ref]` |
| Pilot workspace disabled | `[name]` | `[date]` | `[link/ref]` |
| Uploaded files deleted | `[name]` | `[date]` | `[link/ref]` |
| Snapshots retained/deleted per SOW | `[name]` | `[date]` | `[link/ref]` |
| Client confirmation received | `[name]` | `[date]` | `[link/ref]` |
