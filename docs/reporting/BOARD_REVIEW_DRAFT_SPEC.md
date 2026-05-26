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
