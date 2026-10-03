# A-MULTI-02B trusted evidence

This contract is subordinate to `AGENTS.md`. It uses the A-MULTI-02A capsule, path, ownership, and guard primitives as the control authority. It does not replace them.

The candidate is the subject. The candidate is never the judge.

## Assurance

A-MULTI-02B IS NOT A SANDBOX.

A-MULTI-02B PROVIDES A TRUSTED LOCAL RECORD AND VALIDATION OF THE DEFINED EXECUTION FACTS FOR A COMMITTED CANDIDATE.

It does not provide OS isolation, host attestation, malware containment, network isolation, or cryptographic execution identity. Candidate code executes with local OS-user privileges. 02B does not prove prevention of user-accessible filesystem reads or writes, sibling worktree inspection, network use, or other OS-level behavior available to the account.

`bundle_sha256` proves byte consistency of the canonical manifest only. It is not a signature, a human identity, a trusted timestamp, or host attestation. Redaction may miss secrets. Logs are not confidential storage.

`node_modules` is a known limitation. A bundle does not claim a clean install, lockfile attestation, a reproducible dependency environment, or remote attestation. Breakaway processes are a known limitation. Job Object isolation is not claimed.

Executing the frozen plan proves that plan ran. It does not prove the plan was complete, strong, or sufficient. A weak plan remains a human design limitation.

## Human authority

Evidence PASS does not authorize merge, production, governance, Source of Truth, Golden, scope expansion, or a destructive real-data action. It does not set Reviewer `VERIFIED`, governance `CLOSED`, or call merge, push, or deploy. The runner does not call `authorize-gate` or `transition`.

Candidate `human_authorizations` may be recorded as facts. They grant nothing.

## Control and candidate

The runner derives the control repository from its own module path. It does not derive control identity from `process.cwd()` or from the candidate path. Control and candidate must be different real directories.

Before commands, control HEAD must equal the external capsule baseline, and the control index and tracked worktree must be clean. Trusted authority bytes must match the control HEAD blobs. The runner re-checks control and candidate branch, HEAD, index, and tracked worktree after the children terminate and before it writes `manifest.json`. Any mismatch is `INVALID`, never `PASS`.

The authoritative capsule is outside the candidate and outside the evidence bundle. Its bytes are read once. A later byte change is `INVALID`. Changed bytes are not parsed.

The candidate tip must be a commit that descends from the capsule baseline. `--expect-candidate` must match that tip. Orchestration state is only the untracked pair `.agents/tasks/<task>/capsule.json` and `STATE.json`. Any other task-state file, or a staged or committed copy, is `INVALID`. Known global exclusions may be recorded when untracked. They are not candidate code. A staged or committed known exclusion does not pass.

Runtime `.env` files that exist locally and do not match the committed blob fail closed. Contents are not copied into the bundle. Tracked `.env.example` does not fail solely because of its name.

## Commands

There is no arbitrary shell string. Children are `spawn` with `shell: false`. `exec` may only mean `node`, resolved to the control `process.execPath`. `flag` and `literal` are frozen argv. A literal is not filesystem authorization. `candidate_path` must remain inside the candidate. `evidence_output` uses `<EVIDENCE_OUTPUT_DIR>` and must remain inside the exclusive run directory.

Child cwd is the candidate root. The child environment is a scrubbed allowlist, not `process.env`.

Direct tool shape, when a frozen plan chooses it:

```text
node <candidate>/node_modules/vitest/vitest.mjs run --reporter=json --outputFile=<EVIDENCE_OUTPUT_DIR>/vitest.json <test>
node <candidate>/node_modules/vite/bin/vite.js build
```

Exit code is process authority. Missing or malformed JSON is `ERROR`. A non-zero exit is `FAIL`. JSON counts do not override the exit code. A build exit of 0 only means that frozen argv exited 0. It is not application correctness, production validity, or release provenance.

Required evidence must `PASS` for an overall `PASS`. Optional evidence cannot satisfy a missing required item. A skipped required command, a timeout, or an integrity failure cannot be `PASS`.

On Windows, timeout termination is `taskkill.exe /PID <pid> /T /F` with `shell: false`, and only confirmed termination continues. On other platforms, termination uses the process group. No `PASS` is recorded without confirmed termination.

## Bundle

Evidence is written only under `CONTROL/.agents/evidence/<task>/<candidate-tip>/<run-id>/`. That tree is gitignored. A candidate tip is not reused. The runner seals each declared output before the next command and writes `manifest.json` last. A child-written manifest or any other unexpected artifact is `INVALID`.

02B does not attest itself. A trusted bundle for the 02B implementation is not claimed. Future tasks may use 02B only after it is the canonical merged baseline.

```text
node scripts/agents/evidence.mjs run --candidate-worktree <path> --capsule <external-capsule> [--expect-candidate <sha>]
node scripts/agents/evidence.mjs validate --bundle <run-dir> --capsule <external-capsule> [--expect-candidate <sha>]
```
