# Board Review Draft Spec

**Status:** PLANNED / NOT IMPLEMENTED IN C.17.0

## Definition

A Board Review Draft is internal executive preparation material grounded in tenant-scoped DSS signals. It requires human review before circulation and must not be presented as approved board material, legal advice, investment advice, compliance certification, a fairness opinion, or a final external report.

## Mandatory Labels

- Board Review Draft.
- Human Review Required.
- Based on DSS Signals.
- Not Legal Advice.
- Not Investment Advice.
- Not Board Approved.
- Confidential.

## Required Sections

### 1. Cover / Classification

Shows report title, organization scope, generated date, status, confidentiality label, prepared by, and reviewed by when available.

### 2. Executive Summary

Summarizes provided DSS context without inventing metrics or overriding module-owned values.

### 3. Module Signals

Lists Reporting, Executive Overview, and selected module signals with source labels and freshness where available.

### 4. Key Risks

Highlights risks already present in supplied DSS context. It must not create new risk scores.

### 5. Missing Data / Insufficient Data

Preserves `null`, `N/A`, and `insufficient_data` markers. Missing information must not be converted to `0`, `watch`, or synthetic confidence.

### 6. AI Draft Section If AI Present

AI-generated narrative must remain clearly labeled as AI Draft and Requires Human Review. AI cannot approve, certify, finalize, or set reviewed/internal-final status.

### 7. Human Review Checklist

Includes review questions and confirmation checklist for named human reviewers.

### 8. Decision Questions

Frames questions for the executive/board preparation process without answering them as binding decisions.

### 9. Evidence / Source Summary

Lists source modules, record ids where appropriate, data freshness, and known limitations.

### 10. Limitations / Disclaimer

States that CEO's OS is a DSS, not legal advice, investment advice, certified compliance output, a fairness opinion, or formal board approval.

### 11. Audit Metadata

Displays or records safe metadata: report id, organization id, actor id, generated at, version, status, source modules, AI used yes/no, prompt version when applicable, reviewer, and insufficient-data flags.

## State Rules

- Draft can be regenerated.
- AI draft remains draft material.
- Reviewed requires human action.
- Internal final requires explicit confirmation.
- No AI output can mark itself reviewed or internal-final.

## C.17.1 Status

C.17.1 implements the mandatory report logo/header foundation for HTML Board Review Draft rendering.

The renderer preserves:

- Board Review Draft.
- Human Review Required.
- Based on DSS Signals.
- Not Legal Advice.
- Not Investment Advice.
- Not Board Approved.
- Confidential.

No route/page integration or binary PDF generation exists in C.17.1.

## C.17.2 Status

C.17.2 integrates Board Review Draft preview into Reporting / Board Packs.

The preview integration preserves:

- CEO's OS logo/header.
- Board Review Draft status.
- Confidential classification.
- Human Review Required warning.
- Based on DSS Signals label.
- Not Legal Advice.
- Not Investment Advice.
- Not Board Approved.

The preview requires a selected board pack or report snapshot. It must not invent data, recalculate scores, convert missing scores to `0`, hide `insufficient_data`, or present the preview as reviewed, internal-final, certified, or board-approved.

## C.17.3 Status

C.17.3 adds snapshot, version, status, and audit metadata to the Board Review Draft preview foundation.

Preview metadata must remain visible enough for review workflows:

- snapshot id and snapshot version;
- status;
- generated timestamp;
- source type/modules where available;
- data freshness when supplied;
- AI used yes/no and prompt version when supplied;
- insufficient-data flags;
- limitations.

The metadata does not make the preview source-of-truth. `reviewed` and `internal_final` can appear only when explicit human review/final metadata is supplied. AI-only content cannot set those states.

## C.17.4 Status

C.17.4 adds frontend review workflow state controls for Board Review Draft previews.

State rules:

- `reviewed` requires explicit human review metadata, including reviewer and timestamp where available.
- `internal_final` requires reviewed state plus explicit internal-final approval metadata.
- AI-only content cannot set `reviewed` or `internal_final`.
- Revoked and archived states remain metadata/display states until backend persistence exists.
- Preview-only UI actions must not claim the report has been saved, persisted, certified, or board approved.

Mandatory labels remain visible: Board Review Draft, Human Review Required, Based on DSS Signals, Not Legal Advice, Not Investment Advice, Not Board Approved, and Confidential.

## C.17.5 Status

C.17.5 plans future backend persistence for Board Review Draft snapshots and workflow state.

Reviewed/internal-final states become official Reporting workflow state only after a backend persistence phase implements tenant-scoped storage, permissions, audit events, and tests. Until then, frontend workflow metadata remains preview/display metadata only.

Backend persistence must not introduce board-approved, certified PDF, legal approval, investment approval, compliance certification, or AI-approved report semantics.
