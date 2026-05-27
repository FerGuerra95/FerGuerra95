# AI Video Tooling Decision

## Tool Comparison

| Tool | Use case | Pros | Risks | Recommended use | Cost note | Data caution |
|---|---|---|---|---|---|---|
| Guidde | Step-by-step walkthrough capture | Fast product walkthroughs, callouts, easy updates | Third-party upload/storage | Capture click-by-click tutorials | Subscription likely | Synthetic data only |
| Supademo | Interactive walkthroughs | Good for guided demos and embeds | External hosting risk | Alternative to Guidde | Subscription likely | Synthetic data only |
| Loom | Screen recording | Fast, familiar, shareable links | Link access and retention management | Rehearsals and quick walkthroughs | Free/paid tiers | No real client data |
| OBS | Raw screen recording | Local control, high quality | More setup complexity | Final raw captures | Free | Store output outside repo |
| HeyGen | Avatar/founder-style presenter | Polished AI presenter | Likeness/consent and claim risk | Optional approved intro/outro | Paid | Fernando approval required |
| Synthesia | Avatar presenter | Enterprise-style presenter | Likeness/consent and external data risk | Optional approved intro/outro | Paid | No real data/scripts with secrets |
| Canva | Editing, covers, light video | Easy cover frames and templates | Brand/claim drift in templates | Cover frames and lightweight edits | Free/paid tiers | No real screenshots with secrets |
| CapCut | Editing/captions | Fast video editing and captions | Caption errors, external processing | Final edit when reviewed | Free/paid tiers | Review all captions |
| Descript | Editing/transcript | Strong transcript-based editing | Transcript storage and AI processing | Caption and narration edits | Paid | No real client content |

## Recommended Initial Setup

Use:

- Guidde or Supademo for walkthrough capture.
- Loom or OBS for raw rehearsal and long practical recordings.
- HeyGen or Synthesia for avatar/founder intro only after Fernando approval.
- Canva or CapCut for final edit, captions, and cover frames.
- Vimeo, Loom, YouTube unlisted, private Drive, or controlled data room for hosting.

## Decision

Start with Guidde/Supademo for product walkthrough capture, HeyGen/Synthesia for an optional approved avatar intro, and Canva/CapCut for final edit.

## Data Caution

Do not upload real client data, prospect data, personal data, secrets, tokens, cookies, auth headers, session IDs, raw logs, or confidential screenshots to third-party video tools.

