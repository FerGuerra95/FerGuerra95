# Visual Manual Structure

## Purpose

Create a lightweight visual manual that explains CEO's OS with screenshots, short captions, and branch-specific workflows. The manual should help prospects understand the product before a controlled pilot without granting broad product access.

## Format

Recommended formats:

- Internal source: Markdown or controlled slide deck.
- External preview: PDF or hosted page with version and claim review.
- Screenshots: compressed image assets stored outside the repo unless explicitly approved.

Do not commit heavy video files, raw recordings, or unreviewed screenshot exports to the repository.

## Manual Outline

1. Cover: CEO's OS / The Sovereign OS.
2. What it is: Private Executive DSS.
3. What it is not: no autonomous decision, no legal/investment advice, no certification.
4. Demo data note: IberNova Industrial Group S.L. is fictional.
5. CEO Overview: executive aggregation.
6. Reporting / Board Packs: persisted snapshots.
7. Board Review Draft: preview, labels, workflow.
8. M&A: deal preparation.
9. Funding: runway, dilution, funding scenario.
10. Compliance: supplier/evidence/risk view.
11. Risk: heatmap and mitigation.
12. PMI: integration forecast/demo planning.
13. Governance: board workflow and decisions.
14. Strategy: initiatives and strategic risk.
15. Bridge: internal/unlisted cross-module signals.
16. Heritage: premium/future continuity narrative.
17. Pilot path: 48h onboarding and legal/data boundary.
18. Appendix: claim checklist and version log.

## Practical Walkthrough Section

Add a practical walkthrough chapter for pilot onboarding:

1. Login and navigation.
2. CEO Overview.
3. Reporting / Board Packs.
4. Persisted snapshot creation.
5. HTML Board Review Draft preview.
6. Workflow states.
7. Browser-native print/save-as-PDF.
8. M&A / Funding / Compliance / Risk walkthrough.
9. Limited PMI / Governance / Strategy context.
10. Bridge / Heritage as internal/demo/future context.

This section should be operational and button-oriented. It should not read like a sales deck.

## Page Template

| Section | Content |
|---|---|
| Screenshot | Synthetic/IberNova screen only |
| What you are seeing | One-sentence explanation |
| DSS value | What decision preparation it supports |
| Human review | What a human must verify |
| Missing data | What is unknown or insufficient |
| Do not claim | Forbidden wording for this screen |

## Screenshot Naming

Use predictable names outside the repo:

`ceos-academy-v{version}-{branch}-{screen}-{date}.png`

Example:

`ceos-academy-v0.1-reporting-board-review-draft-2026-05-27.png`

## External Manual Rules

- Keep the first external manual short: 12-18 pages.
- Prefer one screenshot per page.
- Use captions, not dense prose.
- Keep Board Review Draft / Human Review Required labels visible.
- Do not include future modules unless labelled roadmap/demo.
