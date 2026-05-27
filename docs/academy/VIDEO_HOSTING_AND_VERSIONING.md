# Video Hosting and Versioning

## Hosting Principles

Videos should be hosted outside the repository. The repository should contain scripts, checklists, and version notes only.

Do not commit:

- Raw video files.
- Rendered MP4/MOV files.
- Large screenshot exports.
- AI avatar source files.
- Voice recordings.
- Unreviewed media drafts.

## Recommended Hosting Options

| Option | Best for | Notes |
|---|---|---|
| Private/unlisted video platform | Prospect education | Use unlisted links and versioned titles |
| Controlled data room | Active pilots | Use access controls and expiry where possible |
| Internal drive | Draft review | Keep restricted to approved reviewers |
| Product help center later | Mature academy | Only after claim/legal/security review |

## Access Levels

| Level | Audience | Example asset |
|---|---|---|
| Internal draft | Team only | Raw script, rough cut, review notes |
| Unlisted prospect | Qualified prospects | CEO's OS overview, Reporting demo |
| Controlled pilot | Pilot participants | Visual manual, branch videos relevant to scope |
| Public | Broad audience | Short high-level overview only after review |

## Version Naming

Use:

`C24.1-{asset}-{version}-{status}-{date}`

Examples:

- `C24.1-ceos-overview-v0.1-draft-2026-05-27`
- `C24.1-reporting-board-packs-v1.0-approved-2026-06-03`

For C.24.4 production assets, also use `VIDEO_ASSET_VERSIONING_POLICY.md`.

Recommended production filename:

`CEOS_VisualAcademy_{AssetName}_{Audience}_{DataType}_v{Version}_YYYY-MM-DD`

## Version Log Template

| Version | Date | Asset | Data used | Claim review | Security review | Status | Link owner |
|---|---|---|---|---|---|---|---|
| v0.1 | YYYY-MM-DD | CEO's OS overview | IberNova synthetic | Pending | Pending | Draft | Internal |

## Republish Rules

Republish or archive a video when:

- Product UI materially changes.
- Workflow state semantics change.
- A module moves from demo/future to implemented.
- AI runtime status changes.
- Legal/security claims change.
- A forbidden claim is discovered.

## Takedown Rules

Immediately remove access if:

- Real client data appears.
- Secrets or tokens appear.
- A founder/avatar likeness was used without approval.
- The video implies certification, board approval, legal/investment advice, autonomous AI, or production provider AI traffic.
