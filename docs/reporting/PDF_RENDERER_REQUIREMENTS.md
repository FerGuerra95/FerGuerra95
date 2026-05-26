# PDF Renderer Requirements

**Status:** PLANNED / NOT IMPLEMENTED IN C.17.0

## Output Requirements

Future C.17.1/C.17.2 renderer output must be:

- A4-ready.
- Printable.
- Executive premium layout.
- Confidential header.
- Optional watermark.
- Prepared by.
- Reviewed by.
- Generated at.
- Organization / case / report scope.
- Human Review Required.
- Draft state visible.
- Page-break safe.
- No cut-off cards.
- No `undefined`, `NaN`, or `Infinity`.
- No fake scores.
- No board-approved claim.
- No certified, legal, investment, compliance, or fairness-opinion claim.

## Technical Constraints

- Prefer HTML/CSS printable renderer first.
- Avoid new PDF dependencies unless separately justified.
- Do not use `jsPDF` unless quality is validated against A4 layout, typography, page breaks, and truthfulness labels.
- No external PDF service.
- No data leaves backend/browser for rendering.
- Snapshot metadata is required before exports can be treated as repeatable.
- Export audit event is required before finalization.
- Renderer must display data; it must not recalculate official scores.

## Required Metadata

Every export should be able to display or retain:

- report id;
- organization id;
- prepared by;
- reviewed by, if any;
- generated at;
- version;
- status;
- source modules;
- data freshness;
- limitations;
- insufficient-data flags;
- AI used yes/no;
- prompt version if AI was used.

## Testing Requirements

Future implementation should include:

- Unit formatter tests.
- HTML builder tests.
- No `NaN` / `undefined` / `Infinity` tests.
- Playwright print/screenshot smoke.
- A4 layout check.
- Truthfulness copy check.
- Status preservation tests for draft, reviewed, internal-final, archived, and revoked.
- Secure-share status visibility tests before sharing rendered output.

## C.17.0 Decision

C.17.0 does not implement PDF generation. The recommended next step is an HTML Board Review Draft Renderer that is print-ready and dependency-light before any binary PDF path is authorized.

## C.17.1 Status

C.17.1 implements the shared HTML renderer foundation and report logo/header requirement. Binary PDF generation remains deferred.

The renderer uses an existing CEO's OS brand asset in a reusable header component and HTML builder. No `jsPDF`, PDF dependency, external PDF service, binary export, or route integration was added.

## C.17.2 Status

C.17.2 completes HTML preview integration inside Reporting / Board Packs. Binary PDF remains deferred.

The preview flow:

- Uses the existing HTML builder.
- Opens a local printable HTML preview window.
- Preserves the shared CEO's OS logo/header.
- Does not call an external PDF service.
- Does not add a PDF package or binary export path.
- Does not create a certified PDF, board-approved report, legal report, investment recommendation, or compliance certification.

## C.17.3 Status

C.17.3 adds frontend snapshot/version/audit metadata for HTML previews. Future PDF/export implementation must use a persisted/export snapshot produced by an authorized backend phase, not live recalculation at render time.

Future PDF requirements now include:

- Use export snapshot metadata rather than recalculating official scores.
- Preserve status and human-review metadata.
- Preserve insufficient-data flags.
- Preserve audit metadata and limitations.
- Never convert preview metadata into board approval, certification, legal advice, investment advice, or compliance certification.
