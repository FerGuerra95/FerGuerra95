# Report Versioning And Audit

**Status:** PLANNED / NOT IMPLEMENTED IN C.17.0

## Version States

| State | Meaning |
|---|---|
| `draft` | Working report material; may be regenerated or edited. |
| `ai_draft` | Draft includes AI-generated narrative; human review required. |
| `human_review_required` | Material is not ready for circulation without named human review. |
| `reviewed` | Human reviewer has taken explicit review action. |
| `internal_final` | Tenant-internal final version after explicit confirmation. |
| `archived` | Retained historical version. |
| `revoked` | No longer available for circulation or secure share. |

## Rules

- Draft can be regenerated.
- Reviewed requires human action.
- Internal final requires explicit confirmation.
- AI output cannot mark reviewed or internal-final.
- Export must record safe metadata.
- Secure share must never expose draft as approved material.
- Revoked share remains unavailable.
- Snapshot must preserve what was shown at export time.
- Renderer must not hide insufficient-data flags.
- Renderer must not recalculate official scores.

## Audit Metadata

Every future report export should record:

- `reportId`
- `organizationId`
- `actorId`
- `createdAt`
- `exportedAt`
- `version`
- `status`
- source modules
- data freshness
- human reviewer if any
- AI used yes/no
- prompt version if AI used
- limitations
- insufficient-data flags

## Sensitive Data Exclusions

Audit metadata must not include raw secrets, tokens, cookies, session ids, auth headers, API keys, passwords, password hashes, private keys, or full sensitive prompt payloads.

## Snapshot Policy

Snapshots preserve the rendered facts, labels, status, limitations, and insufficient-data flags shown at export time. A snapshot is historical evidence of what was rendered; it is not a source-of-truth for live module values.

## C.17.1 Status

C.17.1 includes an Audit Metadata section in the HTML renderer foundation.

Persistent report versioning, export audit events, snapshot storage, secure-share state preservation, and reviewed/internal-final workflows remain future phases. The current renderer displays provided metadata only and does not mutate or persist records.

## C.17.2 Status

C.17.2 adds Reporting / Board Packs preview integration for the HTML Board Review Draft renderer.

Persistent report versioning remains a future phase. The preview uses displayed audit metadata only and does not persist snapshots, create export ledger events, set reviewed/internal-final status, or mutate records.

Preview metadata remains safe display metadata:

- report or board pack id when available;
- draft status;
- generated timestamp;
- source type;
- AI used yes/no;
- prompt version if supplied;
- limitations and insufficient-data markers.

No raw secrets, tokens, cookies, session ids, auth headers, API keys, passwords, or private keys belong in preview metadata.

## C.17.3 Status

**Status:** FRONTEND SNAPSHOT / VERSIONING / AUDIT METADATA FOUNDATION IMPLEMENTED / NO BACKEND PERSISTENCE.

C.17.3 adds pure frontend helpers for Board Review Draft snapshot metadata:

- `resolveBoardReviewStatus`
- `createBoardReviewVersionMetadata`
- `buildBoardReviewAuditMetadata`
- `sanitizeBoardReviewAuditMetadata`
- `buildBoardReviewSnapshot`
- `validateBoardReviewSnapshot`
- `sanitizeSnapshotForRenderer`

Runtime posture:

- No backend persistence.
- No API endpoint.
- No database migration.
- No export ledger mutation.
- No binary PDF generation.
- No AI runtime/provider change.

Status rules:

- Default preview status is `human_review_required`.
- `reviewed` requires explicit human review metadata.
- `internal_final` requires explicit internal-final approval metadata.
- AI-only output cannot set `reviewed` or `internal_final`.
- `revoked` and `archived` can be represented as metadata states when provided.
- No `board_approved` status exists.

Snapshot rules:

- Snapshot metadata is preview/export metadata only.
- Snapshot metadata is not source-of-truth.
- Renderer metadata is not source-of-truth.
- Missing scores remain `N/A` / `insufficient_data`.
- Audit metadata is sanitized and redacts sensitive keys before display.
