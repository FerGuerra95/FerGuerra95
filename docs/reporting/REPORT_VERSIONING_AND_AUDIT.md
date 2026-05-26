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
