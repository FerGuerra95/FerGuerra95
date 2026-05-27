# Export and Board Review Draft Tutorial

## 1. What Is a Board Review Draft?

A Board Review Draft is a review-ready HTML document generated from selected CEO's OS reporting context and persisted snapshot metadata. It is designed to support human review, board preparation, and controlled pilot discussion.

## 2. What It Is Not

A Board Review Draft is not:

- Board-approved output.
- Certified PDF.
- Legal advice.
- Investment advice.
- Fairness opinion.
- Certified compliance report.
- Autonomous AI output.
- Final board decision.

## 3. How It Is Generated

1. Open Reporting / Board Packs.
2. Select or prepare the relevant board pack context.
3. Create a persisted Board Review snapshot.
4. Open the snapshot preview.
5. Review the HTML Board Review Draft with the visible status and audit metadata.

The draft should use persisted renderer input/status metadata. It should not recalculate scores during preview or replace missing values with fake zeroes.

## 4. How It Is Reviewed

Reviewers should check:

- Header/logo and scope.
- Board Review Draft label.
- Human Review Required label.
- Not Board Approved label.
- Not Legal Advice and Not Investment Advice language.
- Missing data and insufficient_data sections.
- Snapshot/version/audit metadata.
- Workflow state.

## 5. How To Open HTML Preview

From the persisted snapshot list, use the preview/open action. If a snapshot is revoked, do not present it as an active draft. If archived, present it as read-only.

## 6. How To Save As PDF From Browser

Use browser-native print/save:

1. Open the HTML Board Review Draft preview.
2. Use `Ctrl+P` or browser menu -> Print.
3. Select "Save as PDF" as the destination.
4. Save the file outside the repository in an approved working folder.
5. Review the PDF manually before sharing.

Correct wording:

> "This is a browser-saved PDF copy of an HTML Board Review Draft."

Incorrect wording:

> "CEO's OS generated a certified PDF."

## 7. What To Review Before Sending

- No real secrets or tokens.
- No private client data if legal path is not approved.
- No undefined, NaN, Infinity, or fake 0 values.
- Missing data is visible.
- Human Review Required is visible.
- Status is correct.
- No unsafe claims.

## 8. Claims It Cannot Include

- Board-approved.
- Certified PDF.
- Certified compliance.
- Legal advice.
- Investment advice.
- Fairness opinion.
- Autonomous AI.
- SOC2/ISO certification.
- Production AI provider traffic.

## 9. Human Review Required

Human Review Required means a qualified human must review the draft before it influences external communication, board discussion, or pilot conclusions.

It does not mean:

- The board has approved it.
- Legal counsel has approved it.
- Investors have approved it.
- AI has certified it.

## 10. Workflow State Differences

| State | Meaning | What it does not mean |
|---|---|---|
| draft | Working draft | Not reviewed or approved |
| human_review_required | Needs human review | Not board-approved |
| reviewed | Human reviewer has reviewed | Not board-approved |
| internal_final | Internal workflow endpoint | Not board-approved and not certified |
| archived | Read-only historical snapshot | Not active |
| revoked | Withdrawn snapshot | Not active and should not be previewed as current |

## 11. Why It Is Not Board-Approved

Only the relevant board or governance body can approve board materials. CEO's OS can prepare a draft and preserve workflow metadata, but it cannot make a board decision.

## 12. Why It Is Not Certified PDF

The current workflow supports HTML preview and browser-native print/save. That convenience PDF copy does not carry certification, digital signing, legal attestation, or audit certification.

