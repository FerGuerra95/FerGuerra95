# CEO's OS / The Sovereign OS — Golden Datasets
## Purpose
Golden Datasets are static, manually reviewed datasets used as calculation anchors for CEO's OS.
They exist to prevent AI-generated or refactored code from silently changing business logic while still compiling, rendering or passing superficial tests.
A Golden Dataset defines:
- module
- calculation name
- inputs
- expected output
- formula
- manual calculation
- tolerance
- edge case status
- business risk
- disclaimer
## Source of truth
Base file:
docs/testing/golden_inputs.json
The Golden Dataset is not production data.
It is a test oracle for logic integrity.
## Rule
A critical calculation is not pilot-ready unless it has one of the following:
1. A Golden Dataset entry.
2. A documented P1 gap explaining why no Golden Dataset exists yet.
## Stop condition
If audited code produces an output different from the Golden Dataset expected result beyond tolerance, stop and report:
- dataset id
- module
- calculation
- file/function responsible
- input used
- actual frontend output
- actual backend output
- expected output
- difference
- risk
- recommendation
Do not mark the phase as closed until the mismatch is resolved or formally documented.
## Critical calculations
Golden Datasets are required for:
- M&A valuation
- M&A waterfall
- M&A buyer matching / scoring
- Compliance risk score
- Compliance resilience score
- Funding runway
- Funding dilution
- Funding post-money
- Funding investor readiness
- PMI synergy forecast / captured
- PMI integration health
- Bridge signal priority
- Bridge recalculation engine
- Risk scoring
- Risk heatmap
- Reporting KPIs
- Executive Overview readiness / module health
## Test Shielding / Oracle Protection
If a calculation fails an existing test or mismatches the Golden Dataset, do not modify the test, fixture, Golden Dataset, expected output, tolerance or snapshot to make it pass.
You must instead:
1. Fix the underlying business logic.
2. Prove with manual calculation that the oracle is wrong.
3. Trigger a Stop Condition and request human review.
Any modification to Golden Datasets or test expectations must be a separate explicit task with:
- reason for change
- manual calculation
- business justification
- before/after expected output
- reviewer note
## Test requirements
A test is weak if it only checks:
- render
- smoke
- no crash
- no visible NaN
- snapshot
- happy path
A strong test checks:
- known input
- expected output
- tolerance
- edge cases
- frontend/backend consistency
- no demo/fallback contamination
## Manual review requirement
Every Golden Dataset must include a manual calculation.
Do not trust AI-generated expected outputs without checking the arithmetic.
## Tutor explanation requirement
When a calculation is audited, explain it as if onboarding a future maintainer:
- why this formula is used
- what inputs it trusts
- what output means
- what it does not mean
- what risk it reduces
- what test proves it
- what disclaimer is required
## Pilot readiness
Before pilot readiness, every critical calculation must be classified as:
| Status | Meaning |
|---|---|
| Golden validated | Has Golden Dataset and code matches expected output |
| Gap P1 | Critical calculation lacks Golden Dataset |
| Mismatch | Code differs from Golden Dataset; stop condition |
| Not critical | Calculation is cosmetic or non-business-critical |
| Deprecated | Calculation should not be used as source-of-truth |
## Future work
C.13 must use this file as the starting point for:
- Formula Registry
- Calculation Source of Truth
- Golden Dataset expansion
- Deprecated Function Audit
- Duplicate Function Audit
- Cross-module Consistency Review
- Test Oracle Review
