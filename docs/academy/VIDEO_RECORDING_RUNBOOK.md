# Video Recording Runbook

## 1. Preparation Before Recording

- Confirm the video scope and chapter list.
- Use IberNova or other synthetic data only.
- Confirm the environment is stable.
- Run `RECORDING_REHEARSAL_CHECKLIST.md`.
- Run `VISUAL_CAPTURE_CHECKLIST.md`.
- Run `VISUAL_QA_BEFORE_RECORDING.md`.
- Select shots from `SCREENSHOT_SHOT_LIST.md`.
- Confirm screen classification in `DEMO_SAFE_SCREEN_GUIDE.md`.
- Confirm tooling choice in `AI_VIDEO_TOOLING_DECISION.md`.
- Confirm no real client/prospect data is loaded.
- Close unrelated browser tabs and apps.
- Disable notifications.
- Prepare the script and storyboard.
- Prepare a local notes file outside the repo for recording logistics.

## 2. Synthetic Data Rule

Use only:

- IberNova Industrial Group S.L.
- Synthetic demo records.
- Dummy users/accounts approved for demo.

Do not use:

- Real client data.
- Prospect names.
- Personal data.
- Real emails or call notes.
- Secrets, API keys, cookies, tokens, or auth headers.

## 3. Secret Visibility Review

Before recording:

- Check browser tabs.
- Check URL bar.
- Check account menu.
- Check developer console is closed.
- Check no `.env`, terminal, API responses, tokens, cookies, or headers are visible.

## 4. Zoom and Resolution

Recommended:

- 1920x1080 recording.
- Browser zoom 90-100%.
- Clear sidebar visibility.
- Do not crop labels like Human Review Required or Not Board Approved.

## 5. Recording Order

1. Record login/navigation.
2. Record CEO Overview.
3. Record Reporting / Board Packs.
4. Record snapshot creation and preview.
5. Record browser save-as-PDF segment.
6. Record branch walkthroughs.
7. Record closing.
8. Record retakes only for chapters with issues.

## 6. Take-by-Chapter Method

Record chapters separately when possible. This makes it easier to remove a chapter if a claim or screenshot fails review.

For each chapter:

- Read objective.
- Check `VIDEO_CHAPTER_CAPTURE_PLAN.md`.
- Verify data is synthetic.
- Record action.
- Check labels.
- Stop and review.

## 7. Post-Recording Review

Review for:

- Wrong claims.
- Secrets or real data.
- Missing labels.
- UI errors.
- NaN/undefined/Infinity.
- Fake 0 replacing N/A.
- Confusing PDF wording.
- Overlong or unclear narration.

## 8. Truthfulness Checklist

Run `VIDEO_TRUTHFULNESS_CHECKLIST.md` before publishing. Block the video if any forbidden claim appears.

## 8A. External AI Video Production Workflow

Use `AI_VIDEO_PRODUCTION_SETUP.md` when producing with external tools:

1. Capture with Guidde, Supademo, Loom, or OBS.
2. Add approved avatar/voice only if `FOUNDER_AVATAR_PRODUCTION_PLAN.md` requirements are met.
3. Edit in Canva, CapCut, Descript, or equivalent outside the repo.
4. Run `VIDEO_APPROVAL_AND_RELEASE_CHECKLIST.md`.
5. Version using `VIDEO_ASSET_VERSIONING_POLICY.md`.
6. Host externally with controlled access.

## 9. Exporting the Video

Export video outside the repository.

Recommended settings:

- 1080p.
- H.264 MP4.
- Clear filename with version.
- No raw recording committed to repo.

## 10. Versioning

Use:

`C24.2-practical-user-manual-v{version}-{status}-{date}`

Example:

`C24.2-practical-user-manual-v0.1-draft-2026-05-27`

Log the final approved version in the external hosting/version register.

## 11. Hosting

Use controlled hosting:

- Internal drive for drafts.
- Unlisted video platform for qualified prospects.
- Controlled data room for active pilots.

Do not publish broadly before product/legal/security review.

## 12. When To Update

Update the video when:

- UI navigation changes materially.
- Reporting workflow changes.
- Export/PDF capability changes.
- AI runtime status changes.
- Legal/security claims change.
- A forbidden claim is discovered.

## 13. Approval Before Publishing

No video can be sent to prospects until:

- rehearsal has passed;
- visual QA has passed;
- product truthfulness review has passed;
- avatar/founder approval is complete if used;
- version and hosting access are assigned.
