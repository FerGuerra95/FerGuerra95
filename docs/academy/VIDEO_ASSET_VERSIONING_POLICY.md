# Video Asset Versioning Policy

## 1. Naming Convention

Use:

`CEOS_VisualAcademy_{AssetName}_{Audience}_{DataType}_v{Version}_YYYY-MM-DD`

Example:

`CEOS_VisualAcademy_PracticalManual_SyntheticDemo_v1.0_2026-05-27`

## 2. Version Format

| Version | Meaning |
|---|---|
| v0.1 | Internal draft |
| v0.5 | Review candidate |
| v1.0 | Approved first release |
| v1.1 | Minor update |
| v2.0 | Material product/workflow update |

## 3. Asset States

| State | Meaning |
|---|---|
| Draft | Producer/internal work in progress |
| Reviewed | Passed initial truthfulness/visual/security review |
| Approved | Approved for intended audience |
| Revoked | Must not be shared further |
| Archived | Superseded but retained in controlled storage |

## 4. Storage Location

Store all media outside the repository in an approved controlled folder or video platform.

## 5. Link Tracker

Track externally:

| Field | Value |
|---|---|
| Asset name | |
| Version | |
| State | |
| Hosting location | |
| Access level | |
| Link owner | |
| Approved by | |
| Date approved | |
| Product version reflected | |
| Data used | |
| Notes | |

## 6. Approval Metadata

Every approved video should record:

- Who approved it.
- Date approved.
- Product version/commit or release context reflected.
- Data used.
- Audience.
- Expiry/review date.

## 7. Update Triggers

Update or revoke when:

- UI changes materially.
- Workflow states change.
- Reporting/export/PDF capability changes.
- Product claims change.
- Legal claims change.
- Security/privacy posture changes.
- AI/provider runtime status changes.
- Pricing or pilot offer changes.
- A forbidden claim is discovered.

## 8. Revocation Process

1. Mark version as revoked in tracker.
2. Remove or restrict hosting access.
3. Notify link owners.
4. Replace with corrected version if available.
5. Record why it was revoked.

