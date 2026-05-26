# C.17.5 - Board Review Backend Persistence Plan

**Status:** PLANNED / NO BACKEND IMPLEMENTED IN C.17.5

## 1. Executive Summary

C.17.5 defines the future backend persistence model for Board Review Draft snapshots, versions, workflow states, audit events, exports, and future secure-share boundaries. It is planning only. No backend code, API route, database migration, persistence behavior, PDF generation, AI runtime, or UI behavior is implemented in this phase.

The goal is to make a later backend implementation safe before touching storage: tenant scope must come from the authenticated backend session, review/final states must be human-gated, AI must remain draft-only, and all persisted records must preserve Board Review Draft truthfulness.

## 2. Current State

- Board Review Draft renderer exists as HTML preview.
- Reporting / Board Packs preview can open printable HTML.
- Frontend snapshot/version/audit metadata exists for preview display.
- Frontend workflow controls exist as preview-only state controls.
- No backend persistence exists for Board Review snapshots.
- No API endpoint exists for Board Review workflow state.
- No migration or table exists for persisted Board Review snapshots.
- No binary PDF export exists.
- No reviewed/internal-final state is authoritative yet.

## 3. Target State

The future backend should persist Board Review Draft snapshots and workflow events as tenant-scoped reporting records. The backend should become the source of truth for persisted report state only after C.17.6 or later implements storage, permissions, audit events, and tests.

The target backend should support:

- persistent immutable-ish snapshots;
- version history;
- review workflow events;
- export history;
- revocation/archive state;
- secure-share readiness in a later phase;
- safe audit metadata;
- strict tenant isolation.

## 4. Non-goals

C.17.5 does not implement:

- backend routes;
- backend services;
- database migrations;
- DB persistence;
- frontend runtime changes;
- PDF binary generation;
- secure-share integration;
- AI provider traffic;
- board-approved output;
- certified PDF output;
- legal, investment, compliance, or fairness-opinion approval.

## 5. Entity Model

Future entities:

1. `board_review_snapshots`
2. `board_review_versions`
3. `board_review_audit_events`
4. `board_review_workflow_events`
5. `board_review_exports`
6. `board_review_share_links` only if secure share integration is explicitly authorized later.

These entities represent Reporting workflow state, not module source data. Module services and persisted module records remain authoritative for module facts and scores.

## 6. Proposed Future Tables

### board_review_snapshots

Proposed fields:

- `id`
- `organization_id`
- `report_id` nullable
- `board_pack_id` nullable
- `title`
- `status`
- `snapshot_version`
- `renderer_version`
- `source_modules_json`
- `data_freshness_json`
- `renderer_input_json`
- `missing_data_json`
- `insufficient_data_flags_json`
- `ai_metadata_json`
- `truthfulness_json`
- `audit_metadata_json`
- `created_by`
- `created_at`
- `updated_at`
- `archived_at` nullable
- `revoked_at` nullable

Rules:

- `organization_id` is required.
- `organization_id` must come from backend auth/session context.
- The frontend must never decide tenant ownership.
- No cross-tenant reads or writes.
- Do not store raw tokens, cookies, passwords, auth headers, raw secure-share bearer tokens, provider API keys, or raw database dumps.

### board_review_versions

Proposed fields:

- `id`
- `organization_id`
- `snapshot_id`
- `version`
- `status`
- `previous_status`
- `created_by`
- `created_at`
- `reviewed_by` nullable
- `reviewed_at` nullable
- `internal_final_approved_by` nullable
- `internal_final_approved_at` nullable
- `metadata_json`

### board_review_audit_events

Proposed fields:

- `id`
- `organization_id`
- `snapshot_id`
- `actor_id`
- `action`
- `previous_status` nullable
- `next_status` nullable
- `result`
- `blocked_reason` nullable
- `metadata_json`
- `created_at`

### board_review_workflow_events

Proposed fields:

- `id`
- `organization_id`
- `snapshot_id`
- `actor_id`
- `event_type`
- `from_status`
- `to_status`
- `comment` nullable
- `review_checklist_json`
- `created_at`

### board_review_exports

Proposed fields:

- `id`
- `organization_id`
- `snapshot_id`
- `export_type`
- `export_version`
- `exported_by`
- `exported_at`
- `status_at_export`
- `checksum` nullable
- `metadata_json`

### board_review_share_links

Future only. Use this table only if a later secure-share phase explicitly authorizes Board Review sharing.

Proposed fields:

- `id`
- `organization_id`
- `snapshot_id`
- `secure_share_link_id`
- `created_by`
- `created_at`
- `revoked_at` nullable
- `metadata_json`

Raw share bearer tokens must not be stored in audit metadata.

## 7. Proposed Future Endpoints

Future endpoints, not implemented in C.17.5:

- `GET /api/reporting/board-review-snapshots`
- `GET /api/reporting/board-review-snapshots/:id`
- `POST /api/reporting/board-review-snapshots`
- `POST /api/reporting/board-review-snapshots/:id/preview`
- `POST /api/reporting/board-review-snapshots/:id/mark-reviewed`
- `POST /api/reporting/board-review-snapshots/:id/mark-internal-final`
- `POST /api/reporting/board-review-snapshots/:id/archive`
- `POST /api/reporting/board-review-snapshots/:id/revoke`
- `POST /api/reporting/board-review-snapshots/:id/export-html`
- `POST /api/reporting/board-review-snapshots/:id/export-pdf` future only

Endpoint rules:

- All endpoints require authentication.
- All reads/writes are scoped by `organizationId` from session/auth context.
- `mark-reviewed` requires review permission.
- `mark-internal-final` requires higher permission.
- AI/service actors cannot mark reviewed/internal-final.
- Every transition writes an audit event.
- No public endpoint exists unless a secure-share phase explicitly authorizes read-only access.

## 8. Permissions / Roles

Future permissions:

- `reporting.snapshot.create`
- `reporting.snapshot.read`
- `reporting.snapshot.preview`
- `reporting.snapshot.review`
- `reporting.snapshot.internalFinal`
- `reporting.snapshot.archive`
- `reporting.snapshot.revoke`
- `reporting.snapshot.export`
- `reporting.snapshot.share`

Suggested role posture:

- Viewer: read/preview only.
- User/analyst: create draft/preview if the existing role model allows it.
- Reviewer/admin: mark reviewed.
- Admin: mark internal final initially.
- Secure-share/public access: read-only only; cannot mark workflow states.
- AI/service actor: can create `ai_draft` metadata only if a future AI runtime phase authorizes it; cannot mark reviewed/internal-final.

No auth implementation changes are made in C.17.5.

## 9. Multi-tenancy Rules

- `organization_id` must be mandatory on every persisted Board Review row.
- Backend must derive `organization_id` from authenticated session/token.
- Client-provided `organizationId` must not be trusted for ownership.
- Every query must filter by organization.
- Every mutation must verify the snapshot belongs to the actor's organization.
- Cross-tenant reads, writes, previews, exports, and shares are P0/P1 security failures.
- Audit events must include `organizationId`.

## 10. Snapshot Rules

- Snapshots preserve what was rendered at preview/export time.
- Snapshots do not recalculate official scores.
- Snapshots preserve `N/A`, `null`, and `insufficient_data`.
- Snapshots must not convert missing scores to `0`.
- Snapshots store renderer input and safe metadata as JSON initially.
- Snapshot payloads must be sanitized before persistence.
- Snapshot payloads are reporting state, not module source-of-truth.

## 11. Workflow State Rules

Allowed statuses:

- `draft`
- `ai_draft`
- `human_review_required`
- `reviewed`
- `internal_final`
- `archived`
- `revoked`

Rules:

- Default status is `human_review_required`.
- `reviewed` requires a human reviewer actor.
- `reviewed` requires `reviewed_at`.
- `internal_final` requires reviewed first.
- `internal_final` requires explicit approval.
- `internal_final` cannot have unresolved critical missing data unless an override is logged.
- `revoked` cannot be exported or shared.
- `archived` is read-only.
- AI output can create `ai_draft` metadata but cannot mark reviewed/internal-final.
- Secure share cannot upgrade status.
- No `board_approved` status exists.

## 12. Audit Event Rules

Future audit event names:

- `board_review.snapshot.created`
- `board_review.snapshot.previewed`
- `board_review.snapshot.updated`
- `board_review.workflow.review_requested`
- `board_review.workflow.reviewed`
- `board_review.workflow.internal_final_marked`
- `board_review.workflow.archived`
- `board_review.workflow.revoked`
- `board_review.export.html_generated`
- `board_review.export.pdf_generated_future`
- `board_review.secure_share.created_future`
- `board_review.secure_share.accessed_future`

Audit metadata must include:

- `organizationId`
- `actorId`
- `snapshotId`
- `previousStatus`
- `nextStatus`
- `action`
- `timestamp`
- `result`
- `blockedReason` if denied
- safe metadata only

Audit metadata must not include:

- tokens;
- cookies;
- passwords;
- auth headers;
- raw secure-share bearer token;
- raw database dump;
- provider API keys;
- full prompt if sensitive.

## 13. Secure Share Interaction

Future secure-share interaction is read-only unless separately authorized.

Rules:

- Secure share may expose a read-only snapshot in a later phase.
- Public access must show status clearly.
- Revoked or expired snapshots must be unavailable.
- Raw bearer tokens must never be stored in audit.
- Share cannot expose internal-only draft unless explicitly allowed.
- Share cannot turn draft into approved output.
- Secure-share access should audit sanitized metadata only.

## 14. AI Interaction

- AI can suggest narrative draft.
- AI can populate `ai_draft` metadata if a future runtime phase authorizes it.
- AI cannot mark reviewed.
- AI cannot mark internal_final.
- AI cannot approve.
- AI cannot certify.
- AI cannot recalculate official scores.
- AI cannot mutate snapshot status without human action.
- `promptVersion` must be stored if AI is used.
- AI provider traffic remains blocked until DPA/subprocessor/runtime authorization.

## 15. PDF / Export Interaction

- HTML preview remains first-class.
- Binary PDF export is future only.
- Future PDF must render from a persisted snapshot, not live recalculation.
- Export must preserve version, status, limitations, and insufficient-data flags.
- Export must include CEO's OS logo/header.
- Export must include human-review and not-board-approved labels unless a later policy defines a different internal-final label.
- `internal_final` still does not mean board-approved.
- No certified PDF claim is allowed.

## 16. Data Retention / Revocation

- Revoked snapshots remain unavailable for export/share.
- Archived snapshots are read-only.
- Retention policy should align with enterprise reporting retention and future legal/privacy review.
- Deletion/purge should require a separate retention/DSR phase.
- Revocation should create audit events.
- Secure-share revocation should not leak raw bearer tokens.

## 17. Testing Requirements

Future C.17.6 unit tests:

- service creates snapshot scoped by organization;
- service rejects missing `organizationId`;
- service rejects cross-tenant read;
- service preserves `insufficient_data`;
- service does not convert null score to `0`;
- reviewed requires actor;
- internal_final requires reviewed;
- AI cannot mark reviewed/internal_final;
- audit redacts secrets.

Future C.17.6 integration tests:

- `POST` snapshot creates org-scoped record;
- `GET` snapshot only same organization;
- mark-reviewed creates audit event;
- mark-internal-final blocked without reviewed;
- revoked cannot export/share;
- unauthenticated returns 401;
- viewer cannot mark reviewed/internal_final.

Future e2e:

- Board pack preview -> create snapshot -> mark reviewed -> export HTML.
- Public secure share read-only if later enabled.

## 18. Migration Strategy

- Add a new migration only.
- Avoid changes to existing reporting tables unless strictly necessary.
- JSON fields are acceptable initially for snapshot payloads.
- Add indexes for `organization_id`, `status`, `created_at`, and nullable `board_pack_id` / `report_id`.
- No destructive migration.
- Document rollback plan.
- Seed/demo data is not required.

## 19. Stop Conditions for Implementation

Stop C.17.6 implementation if:

- tenant scope source is ambiguous;
- permission model is unclear;
- viewer could mutate review state;
- AI/service actor could mark reviewed/internal_final;
- raw secrets could be stored in snapshot/audit metadata;
- migration is destructive;
- secure share could expose drafts as approved output;
- PDF/export could imply certification or board approval.

## 20. Recommended C.17.6 Scope

Recommended next implementation:

**C.17.6 - Backend persistence implementation for Board Review Draft snapshots**

Suggested C.17.6 scope:

- migration for snapshots/version/audit tables;
- backend service with tenant scope;
- protected endpoints for create/read/preview;
- workflow endpoints for reviewed/internal-final/archive/revoke;
- audit events for every transition;
- unit/integration tests for tenant isolation and permissions.

PDF export, secure share integration, and AI runtime should remain separate phases.

## Conclusion

Status: **PLANNED / NO BACKEND IMPLEMENTED IN C.17.5**

Recommended next implementation: **C.17.6 - Backend persistence implementation for Board Review Draft snapshots**.
