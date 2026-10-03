import fs from 'node:fs';
import path from 'node:path';

import {
  assertArtifactConsistency,
  assertSeals,
  createExclusiveRun,
  LIMITATIONS,
  manifestBody,
  overallStatus,
  sealCommandOutputs,
  snapshotFiles,
  validateManifest,
  writeManifest
} from './lib/evidence/bundle.mjs';
import { runCommand } from './lib/evidence/execute.mjs';
import { sameSnapshot, snapshotRepository } from './lib/evidence/gitFacts.mjs';
import {
  assertControlBaseline,
  assertDistinctRoots,
  capsuleBytesUnchanged,
  controlRootFrom,
  inspectCandidate,
  readExternalCapsule
} from './lib/evidence/trust.mjs';

const HELP = [
  'node scripts/agents/evidence.mjs run --candidate-worktree <path> --capsule <external-capsule> [--expect-candidate <sha>]',
  'node scripts/agents/evidence.mjs validate --bundle <run-dir> --capsule <external-capsule> [--expect-candidate <sha>]'
].join('\n');

function fail(code, message) {
  process.stdout.write(`${JSON.stringify({ ok: false, overall_status: 'INVALID', code, message })}\n`);
  process.exitCode = 1;
}

function readFlag(argv, name) {
  const index = argv.indexOf(name);
  if (index === -1) return null;
  const value = argv[index + 1];
  if (!value || value.startsWith('--')) {
    throw new Error(`Missing value for ${name}.`);
  }
  return value;
}

function commandView(entry, required, status, extras = {}) {
  return {
    id: entry.id,
    required,
    status,
    exit_code: extras.exit_code ?? null,
    timeout_ms: entry.timeout_ms,
    stdout_sha256: extras.stdout_sha256 || null,
    stderr_sha256: extras.stderr_sha256 || null,
    stdout_extract: extras.stdout_extract || '',
    stderr_extract: extras.stderr_extract || '',
    expects_json: extras.expects_json === true,
    artifacts: extras.artifacts || []
  };
}

function classifyJson(result, runDir) {
  if (!result.expects_json || result.status !== 'PASS') return result.status;
  if (!result.artifacts || result.artifacts.length === 0) return 'ERROR';
  for (const artifact of result.artifacts) {
    try {
      JSON.parse(fs.readFileSync(path.join(runDir, ...artifact.path.split('/')), 'utf8'));
    } catch {
      return 'ERROR';
    }
  }
  return 'PASS';
}

async function executePlan(plan, context) {
  const commands = [];
  const seals = new Map();
  let integrityOk = true;
  let stop = false;
  const entries = [
    ...(plan?.required || []).map((entry) => ({ entry, required: true })),
    ...(plan?.optional || []).map((entry) => ({ entry, required: false }))
  ];
  for (const { entry, required } of entries) {
    if (stop) {
      commands.push(commandView(entry, required, 'NOT_RUN'));
      continue;
    }
    try {
      assertSeals(context.runDir, seals);
    } catch {
      integrityOk = false;
      commands.push(commandView(entry, required, 'INVALID'));
      stop = true;
      continue;
    }
    const before = snapshotFiles(context.runDir);
    const raw = await runCommand(entry, { ...context, required });
    let artifacts = [];
    try {
      const sealed = sealCommandOutputs(context.runDir, before, raw.outputs || [], seals);
      artifacts = sealed.digests;
      for (const digest of sealed.digests) {
        if (seals.has(digest.path)) {
          if (seals.get(digest.path) !== digest.sha256) {
            throw new Error(`Sealed artifact changed: ${digest.path}`);
          }
          continue;
        }
        seals.set(digest.path, digest.sha256);
      }
      if (sealed.missing.length > 0 && raw.status === 'PASS') raw.status = 'ERROR';
    } catch {
      integrityOk = false;
      commands.push(commandView(entry, required, 'INVALID', raw));
      stop = true;
      continue;
    }
    raw.artifacts = artifacts;
    raw.status = classifyJson(raw, context.runDir);
    if (raw.status === 'TIMEOUT' && raw.termination_confirmed === false) {
      raw.status = 'ERROR';
      integrityOk = false;
    }
    commands.push(commandView(entry, required, raw.status, raw));
    const controlPost = snapshotRepository(context.controlRoot);
    const candidatePost = snapshotRepository(context.candidateRoot);
    if (!sameSnapshot(context.controlPre, controlPost) || !sameSnapshot(context.candidatePre, candidatePost) || !capsuleBytesUnchanged(context.capsule)) {
      integrityOk = false;
      stop = true;
    } else if (required && raw.status !== 'PASS') {
      stop = true;
    }
    context.controlPost = controlPost;
    context.candidatePost = candidatePost;
  }
  if (!context.controlPost) context.controlPost = snapshotRepository(context.controlRoot);
  if (!context.candidatePost) context.candidatePost = snapshotRepository(context.candidateRoot);
  try {
    assertSeals(context.runDir, seals);
  } catch {
    integrityOk = false;
  }
  if (!capsuleBytesUnchanged(context.capsule)) integrityOk = false;
  if (!sameSnapshot(context.controlPre, context.controlPost) || !sameSnapshot(context.candidatePre, context.candidatePost)) {
    integrityOk = false;
  }
  return {
    commands,
    integrityOk,
    artifactDigests: [...seals.entries()].map(([artifactPath, digest]) => ({ path: artifactPath, sha256: digest }))
  };
}

async function runEvidence(options) {
  const controlRoot = controlRootFrom(import.meta.url);
  const roots = assertDistinctRoots(controlRoot, options.candidate);
  const capsule = readExternalCapsule(options.capsule, [
    roots.candidate,
    path.join(roots.control, '.agents', 'evidence')
  ]);
  assertControlBaseline(roots.control, capsule.parsed.baseline);
  const candidate = inspectCandidate(roots.candidate, capsule);
  if (options.expectCandidate && options.expectCandidate.toLowerCase() !== candidate.head) {
    throw Object.assign(new Error('Candidate tip does not match expect-candidate.'), { code: 'CANDIDATE_MISMATCH' });
  }
  const run = createExclusiveRun(roots.control, capsule.parsed.task, candidate.head);
  const controlPre = snapshotRepository(roots.control);
  if (controlPre.head !== capsule.parsed.baseline || controlPre.porcelain !== '') {
    throw Object.assign(new Error('Control changed before evidence commands.'), { code: 'CONTROL_DIRTY' });
  }
  const candidatePre = snapshotRepository(roots.candidate);
  const executed = await executePlan(capsule.parsed.evidence_plan, {
    controlRoot: roots.control,
    candidateRoot: roots.candidate,
    runDir: run.runDir,
    capsule,
    controlPre,
    candidatePre
  });
  let overall = overallStatus(executed.commands, executed.integrityOk && capsuleBytesUnchanged(capsule));
  if (overall === 'PASS') {
    try {
      assertArtifactConsistency(run.runDir, executed.commands, executed.artifactDigests);
    } catch {
      overall = 'INVALID';
    }
  }
  const manifest = writeManifest(run.runDir, manifestBody({
    artifactDigests: executed.artifactDigests,
    authorityPathsChanged: candidate.authorityPathsChanged,
    baseline: capsule.parsed.baseline,
    candidatePaths: candidate.paths,
    candidateSnapshot: { pre: candidatePre, post: executed.candidatePost || candidatePre },
    candidateTip: candidate.head,
    capsuleFingerprint: capsule.fingerprint,
    capsuleSha256: capsule.sha256,
    commands: executed.commands,
    controlSnapshot: { pre: controlPre, post: executed.controlPost || controlPre },
    knownExclusions: candidate.knownExclusions,
    orchestrationState: candidate.orchestration,
    overallStatus: overall,
    task: capsule.parsed.task,
    toolchain: candidate.toolchain
  }));
  process.stdout.write(`${JSON.stringify({
    ok: overall === 'PASS',
    overall_status: overall,
    manifest: path.join(run.runDir, 'manifest.json'),
    bundle_sha256: manifest.bundle_sha256,
    limitations: LIMITATIONS
  })}\n`);
  if (overall !== 'PASS') process.exitCode = 1;
}

function validateEvidence(options) {
  const controlRoot = controlRootFrom(import.meta.url);
  const runDir = fs.realpathSync(options.bundle.endsWith('manifest.json') ? path.dirname(options.bundle) : options.bundle);
  const manifest = JSON.parse(fs.readFileSync(path.join(runDir, 'manifest.json'), 'utf8'));
  assertControlBaseline(controlRoot, manifest.baseline);
  const capsule = readExternalCapsule(options.capsule, [runDir, path.join(controlRoot, '.agents', 'evidence')]);
  if (capsule.parsed.baseline !== manifest.baseline) {
    throw Object.assign(new Error('Control baseline does not match the bundle.'), { code: 'CONTROL_BASELINE' });
  }
  const result = validateManifest(runDir, manifest, {
    sha256: capsule.sha256,
    fingerprint: capsule.fingerprint,
    baseline: capsule.parsed.baseline,
    task: capsule.parsed.task
  }, { expectCandidate: options.expectCandidate ? options.expectCandidate.toLowerCase() : null });
  process.stdout.write(`${JSON.stringify({ ok: true, ...result })}\n`);
}

async function main() {
  const argv = process.argv.slice(2);
  if (argv.length === 0 || argv.includes('--help') || argv.includes('-h')) {
    process.stdout.write(`${HELP}\n`);
    return;
  }
  const command = argv[0];
  const expectCandidate = readFlag(argv, '--expect-candidate');
  if (command === 'run') {
    const candidate = readFlag(argv, '--candidate-worktree');
    const capsule = readFlag(argv, '--capsule');
    if (!candidate || !capsule) throw new Error('run requires --candidate-worktree and --capsule.');
    await runEvidence({ candidate, capsule, expectCandidate });
    return;
  }
  if (command === 'validate') {
    const bundle = readFlag(argv, '--bundle');
    const capsule = readFlag(argv, '--capsule');
    if (!bundle || !capsule) throw new Error('validate requires --bundle and --capsule.');
    validateEvidence({ bundle, capsule, expectCandidate });
    return;
  }
  throw new Error(`Unknown evidence command ${command}.`);
}

main().catch((error) => {
  fail(error.code || 'INVALID', error.message);
});
