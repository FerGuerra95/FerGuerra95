import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

import { EvidenceError, sha256Buffer } from './gitFacts.mjs';

export const LIMITATIONS = [
  'A-MULTI-02B IS NOT A SANDBOX.',
  'A-MULTI-02B PROVIDES A TRUSTED LOCAL RECORD AND VALIDATION OF THE DEFINED EXECUTION FACTS FOR A COMMITTED CANDIDATE.',
  'It does NOT provide OS isolation, host attestation, malware containment, network isolation, or cryptographic execution identity.',
  'Candidate code executes with local OS-user privileges.',
  '02B does not prove prevention of user-accessible filesystem reads, user-accessible filesystem writes, sibling worktree inspection, network use, or OS-level behavior accessible to the account.',
  'Breakaway processes are a known limitation. Job Object isolation is not claimed.',
  'node_modules is a known limitation. This bundle does not claim a clean install, lockfile attestation, a reproducible dependency environment, or remote attestation.',
  'bundle_sha256 proves byte consistency of this manifest only. It is not a signature, human identity, trusted timestamp, or host attestation.',
  'Redaction may miss secrets. Logs are not confidential storage.',
  'Evidence PASS does not authorize merge, production, governance, Source of Truth, Golden, scope expansion, destructive real-data action, Reviewer VERIFIED, governance CLOSED, push, or deploy.',
  'The plan execution proves the frozen plan ran. It does not prove the plan was complete, strong, or sufficient.'
];

const MANIFEST_KEYS = [
  'artifact_digests',
  'authority_paths_changed',
  'baseline',
  'bundle_sha256',
  'candidate_paths',
  'candidate_snapshot',
  'candidate_tip',
  'capsule_fingerprint',
  'capsule_sha256',
  'commands',
  'control_snapshot',
  'known_exclusions',
  'limitations',
  'orchestration_state',
  'overall_status',
  'task',
  'toolchain',
  'trusted_state_sha256'
];

export function stableStringify(value) {
  if (Array.isArray(value)) return `[${value.map((entry) => stableStringify(entry)).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

export function listFiles(directory) {
  if (!fs.existsSync(directory)) return [];
  const found = [];
  const walk = (current) => {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const absolute = path.join(current, entry.name);
      if (entry.isDirectory()) walk(absolute);
      else if (entry.isFile()) found.push(absolute);
    }
  };
  walk(directory);
  return found.sort();
}

export function hashFile(filePath) {
  return sha256Buffer(fs.readFileSync(filePath));
}

export function relativeTo(root, filePath) {
  return path.relative(root, filePath).split(path.sep).join('/');
}

export function snapshotFiles(directory) {
  const snapshot = new Map();
  for (const filePath of listFiles(directory)) {
    snapshot.set(relativeTo(directory, filePath), hashFile(filePath));
  }
  return snapshot;
}

export function createExclusiveRun(controlRoot, task, candidateTip) {
  const tipDir = path.join(controlRoot, '.agents', 'evidence', task, candidateTip);
  fs.mkdirSync(path.dirname(tipDir), { recursive: true });
  try {
    fs.mkdirSync(tipDir);
  } catch (error) {
    if (error && error.code === 'EEXIST') {
      throw new EvidenceError('CANDIDATE_REUSE', 'A completed or existing evidence run already exists for this candidate tip.');
    }
    throw error;
  }
  const runId = `${Date.now().toString(36)}-${crypto.randomBytes(6).toString('hex')}`;
  const runDir = path.join(tipDir, runId);
  fs.mkdirSync(runDir);
  return { tipDir, runDir, runId };
}

export function assertSeals(runDir, seals) {
  const current = snapshotFiles(runDir);
  for (const [relativePath, digest] of seals.entries()) {
    if (current.get(relativePath) !== digest) {
      throw new EvidenceError('ARTIFACT_SEAL', `Sealed artifact changed: ${relativePath}`);
    }
  }
  return current;
}

export function sealCommandOutputs(runDir, before, allowedAbsolute, sealed = new Map()) {
  const after = snapshotFiles(runDir);
  const allowed = new Set(allowedAbsolute.map((filePath) => relativeTo(runDir, filePath)));
  for (const [relativePath, digest] of sealed.entries()) {
    if (after.get(relativePath) !== digest) {
      throw new EvidenceError('ARTIFACT_SEAL', `Sealed artifact changed: ${relativePath}`);
    }
  }
  for (const [relativePath, digest] of after.entries()) {
    if (relativePath.toLowerCase() === 'manifest.json' || relativePath.toLowerCase().endsWith('/manifest.json')) {
      throw new EvidenceError('ARTIFACT_UNEXPECTED', 'A child wrote manifest.json.');
    }
    const previous = before.get(relativePath);
    if (!allowed.has(relativePath) && previous !== digest) {
      throw new EvidenceError('ARTIFACT_UNEXPECTED', `Unexpected evidence artifact: ${relativePath}`);
    }
  }
  for (const [relativePath, digest] of before.entries()) {
    if (sealed.has(relativePath)) continue;
    if (after.get(relativePath) !== digest && !allowed.has(relativePath)) {
      throw new EvidenceError('ARTIFACT_SEAL', `Sealed artifact changed: ${relativePath}`);
    }
  }
  const digests = [];
  const missing = [];
  for (const relativePath of allowed) {
    if (sealed.has(relativePath)) continue;
    const digest = after.get(relativePath);
    if (!digest) missing.push(relativePath);
    else digests.push({ path: relativePath, sha256: digest });
  }
  return { after, digests, missing };
}

export function assertArtifactConsistency(runDir, commands, artifactDigests) {
  if (!Array.isArray(artifactDigests)) {
    throw new EvidenceError('ARTIFACT_MISSING', 'Artifact digests are missing.');
  }
  const digests = new Map();
  for (const entry of artifactDigests) {
    if (!entry || typeof entry.path !== 'string' || typeof entry.sha256 !== 'string') {
      throw new EvidenceError('ARTIFACT_MISSING', 'Artifact digest is incomplete.');
    }
    if (digests.has(entry.path) && digests.get(entry.path) !== entry.sha256) {
      throw new EvidenceError('ARTIFACT_SEAL', `Conflicting artifact digest: ${entry.path}`);
    }
    digests.set(entry.path, entry.sha256);
  }
  for (const [relativePath, digest] of digests.entries()) {
    const absolute = path.join(runDir, ...relativePath.split('/'));
    if (!fs.existsSync(absolute) || hashFile(absolute) !== digest) {
      throw new EvidenceError('ARTIFACT_MISSING', `Artifact digest mismatch: ${relativePath}`);
    }
  }
  for (const command of commands || []) {
    if (command.status !== 'PASS') continue;
    for (const artifact of command.artifacts || []) {
      if (!digests.has(artifact.path) || digests.get(artifact.path) !== artifact.sha256) {
        throw new EvidenceError('ARTIFACT_MISSING', `Missing required artifact ${artifact.path}.`);
      }
      const absolute = path.join(runDir, ...artifact.path.split('/'));
      if (!fs.existsSync(absolute) || hashFile(absolute) !== artifact.sha256) {
        throw new EvidenceError('ARTIFACT_MISSING', `Missing required artifact ${artifact.path}.`);
      }
    }
    if (command.required && (command.artifacts || []).length === 0 && command.expects_json === true) {
      throw new EvidenceError('ARTIFACT_MISSING', `Missing required artifact for ${command.id}.`);
    }
  }
}

export function overallStatus(commands, integrityOk) {
  if (!integrityOk) return 'INVALID';
  const required = commands.filter((command) => command.required);
  if (required.some((command) => command.status === 'INVALID')) return 'INVALID';
  if (required.some((command) => command.status === 'ERROR')) return 'ERROR';
  if (required.some((command) => command.status === 'TIMEOUT')) return 'TIMEOUT';
  if (required.some((command) => command.status === 'FAIL')) return 'FAIL';
  if (required.some((command) => command.status === 'NOT_RUN')) return 'NOT_RUN';
  if (required.every((command) => command.status === 'PASS')) return 'PASS';
  return 'ERROR';
}

export function writeManifest(runDir, body) {
  const canonical = stableStringify(body);
  const manifest = {
    ...body,
    bundle_sha256: crypto.createHash('sha256').update(canonical).digest('hex')
  };
  const target = path.join(runDir, 'manifest.json');
  if (fs.existsSync(target)) {
    throw new EvidenceError('MANIFEST_EXISTS', 'manifest.json already exists.');
  }
  fs.writeFileSync(target, `${stableStringify(manifest)}\n`);
  return manifest;
}

function publicCommand(command) {
  return {
    artifacts: command.artifacts || [],
    exit_code: command.exit_code ?? null,
    expects_json: command.expects_json === true,
    id: command.id,
    required: command.required === true,
    status: command.status,
    stderr_extract: command.stderr_extract || '',
    stderr_sha256: command.stderr_sha256 || null,
    stdout_extract: command.stdout_extract || '',
    stdout_sha256: command.stdout_sha256 || null,
    timeout_ms: command.timeout_ms
  };
}

export function manifestBody(record) {
  return {
    artifact_digests: record.artifactDigests,
    authority_paths_changed: record.authorityPathsChanged,
    baseline: record.baseline,
    candidate_paths: record.candidatePaths,
    candidate_snapshot: record.candidateSnapshot,
    candidate_tip: record.candidateTip,
    capsule_fingerprint: record.capsuleFingerprint,
    capsule_sha256: record.capsuleSha256,
    commands: record.commands.map(publicCommand),
    control_snapshot: record.controlSnapshot,
    known_exclusions: record.knownExclusions,
    limitations: LIMITATIONS,
    orchestration_state: record.orchestrationState,
    overall_status: record.overallStatus,
    task: record.task,
    toolchain: record.toolchain,
    trusted_state_sha256: record.trustedStateSha256 === undefined ? null : record.trustedStateSha256
  };
}

export function validateManifest(runDir, manifest, capsule, options = {}) {
  const keys = Object.keys(manifest);
  const missing = MANIFEST_KEYS.filter((key) => !keys.includes(key));
  const unknown = keys.filter((key) => !MANIFEST_KEYS.includes(key));
  if (missing.length > 0 || unknown.length > 0) {
    throw new EvidenceError('MANIFEST_INCOMPLETE', 'Manifest keys do not match the evidence contract.');
  }
  if (!Array.isArray(manifest.limitations) || manifest.limitations.join('\n') !== LIMITATIONS.join('\n')) {
    throw new EvidenceError('MANIFEST_INCOMPLETE', 'Manifest limitations do not match the frozen contract.');
  }
  const { bundle_sha256: recorded, ...body } = manifest;
  const actual = crypto.createHash('sha256').update(stableStringify(body)).digest('hex');
  if (actual !== recorded) {
    throw new EvidenceError('BUNDLE_HASH', 'bundle_sha256 does not match the canonical manifest.');
  }
  if (options.expectCandidate && options.expectCandidate !== manifest.candidate_tip) {
    throw new EvidenceError('CANDIDATE_MISMATCH', 'Candidate tip does not match expect-candidate.');
  }
  if (capsule.sha256 !== manifest.capsule_sha256 || capsule.fingerprint !== manifest.capsule_fingerprint) {
    throw new EvidenceError('CAPSULE_MISMATCH', 'External capsule does not match the evidence bundle.');
  }
  if (capsule.baseline !== manifest.baseline || capsule.task !== manifest.task) {
    throw new EvidenceError('CAPSULE_MISMATCH', 'External capsule identity does not match the evidence bundle.');
  }
  if (manifest.trusted_state_sha256 !== null && !/^[0-9a-f]{64}$/.test(String(manifest.trusted_state_sha256))) {
    throw new EvidenceError('MANIFEST_INCOMPLETE', 'trusted_state_sha256 must be null or a SHA-256 hex digest.');
  }
  assertArtifactConsistency(runDir, manifest.commands, manifest.artifact_digests);
  return { ok: true, overall_status: manifest.overall_status };
}
