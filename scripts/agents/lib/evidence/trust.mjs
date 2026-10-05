import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { fingerprintCapsule, validateCapsule } from '../capsule.mjs';
import { checkPaths } from '../policy.mjs';
import { assertStateMatchesCapsule, createInitialState, validateState } from '../stateMachine.mjs';
import { hashFile } from './bundle.mjs';
import {
  blobId,
  changedPaths,
  EvidenceError,
  git,
  hashObject,
  isAncestor,
  parsePorcelain,
  sha256Buffer,
  snapshotRepository,
  trackedWorktreeClean,
  worktreeMatchesHead
} from './gitFacts.mjs';

export const AUTHORITY_FILES = [
  'scripts/agents/evidence.mjs',
  'scripts/agents/lib/capsule.mjs',
  'scripts/agents/lib/evidence/bundle.mjs',
  'scripts/agents/lib/evidence/execute.mjs',
  'scripts/agents/lib/evidence/gitFacts.mjs',
  'scripts/agents/lib/evidence/trust.mjs',
  'scripts/agents/lib/guards.json',
  'scripts/agents/lib/ownership.mjs',
  'scripts/agents/lib/policy.mjs',
  'scripts/agents/lib/stateMachine.mjs',
  'scripts/agents/lib/transitions.json'
];

const RUNTIME_ENV_FILES = [
  '.env',
  '.env.local',
  '.env.development',
  '.env.development.local',
  '.env.test',
  '.env.test.local',
  '.env.production',
  '.env.production.local'
];

const KNOWN_EXCLUSION_FILES = new Set([
  'backend-server.err',
  'src/modules/ma/components/madataroomroutefieldvisual.jsx',
  'src/modules/ma/components/pipelineflowfieldvisual.jsx'
]);

export function controlRootFrom(moduleUrl) {
  const modulePath = fileURLToPath(moduleUrl);
  return fs.realpathSync(path.resolve(path.dirname(modulePath), '../..'));
}

export function isInside(root, target) {
  const relative = path.relative(root, target);
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
}

function canonicalLoose(filePath) {
  return String(filePath || '').replace(/\\/g, '/').replace(/^\.\//, '').toLowerCase();
}

export function isKnownExclusion(filePath) {
  const canonical = canonicalLoose(filePath);
  if (KNOWN_EXCLUSION_FILES.has(canonical)) return true;
  return canonical === 'docs/academy/screenshots' || canonical.startsWith('docs/academy/screenshots/');
}

function assertTaskId(task) {
  if (!/^[A-Za-z0-9][A-Za-z0-9._-]{0,80}$/.test(task)) {
    throw new EvidenceError('TASK_ID', 'Task id cannot be used as an evidence path.');
  }
}

export function assertDistinctRoots(controlRoot, candidateRoot) {
  const control = fs.realpathSync(controlRoot);
  const candidate = fs.realpathSync(candidateRoot);
  if (control === candidate) {
    throw new EvidenceError('ROOT_IDENTITY', 'Control and candidate must be different real directories.');
  }
  return { control, candidate };
}

export function assertControlBaseline(controlRoot, baseline) {
  const snapshot = snapshotRepository(controlRoot);
  if (snapshot.head !== baseline) {
    throw new EvidenceError('CONTROL_BASELINE', 'Control HEAD does not equal the authorized capsule baseline.');
  }
  if (!trackedWorktreeClean(snapshot)) {
    throw new EvidenceError('CONTROL_DIRTY', 'Control index and tracked worktree must be clean.');
  }
  for (const relativePath of AUTHORITY_FILES) {
    if (!worktreeMatchesHead(controlRoot, relativePath)) {
      throw new EvidenceError('CONTROL_IDENTITY', `Control authority bytes do not match HEAD: ${relativePath}`);
    }
  }
  return snapshot;
}

export function readExternalCapsule(capsulePath, forbiddenRoots) {
  const capsuleReal = fs.realpathSync(capsulePath);
  for (const root of forbiddenRoots) {
    if (!root || !fs.existsSync(root)) continue;
    if (isInside(fs.realpathSync(root), capsuleReal)) {
      throw new EvidenceError('CAPSULE_LOCATION', 'The authoritative capsule must be outside the candidate worktree and the evidence bundle.');
    }
  }
  const bytes = fs.readFileSync(capsuleReal);
  let parsed;
  try {
    parsed = validateCapsule(JSON.parse(bytes.toString('utf8')));
  } catch (error) {
    throw new EvidenceError(error.code || 'CAPSULE_INVALID', error.message);
  }
  return {
    bytes,
    path: capsuleReal,
    sha256: hashFile(capsuleReal),
    parsed,
    fingerprint: fingerprintCapsule(parsed)
  };
}

export function capsuleBytesUnchanged(capsule) {
  return fs.readFileSync(capsule.path).equals(capsule.bytes);
}

export function readExternalState(statePath, forbiddenRoots) {
  const stateReal = fs.realpathSync(statePath);
  for (const root of forbiddenRoots) {
    if (!root || !fs.existsSync(root)) continue;
    if (isInside(fs.realpathSync(root), stateReal)) {
      throw new EvidenceError(
        'STATE_LOCATION',
        'The trusted authorization state must be outside the candidate, control, and evidence bundle.'
      );
    }
  }
  const bytes = fs.readFileSync(stateReal);
  let parsed;
  try {
    parsed = JSON.parse(bytes.toString('utf8'));
  } catch {
    throw new EvidenceError('STATE_INVALID', 'Trusted authorization state is not valid JSON.');
  }
  return {
    bytes,
    path: stateReal,
    sha256: sha256Buffer(bytes),
    parsed
  };
}

export function bindTrustedState(trusted, capsule) {
  try {
    validateState(trusted.parsed, { capsule: capsule.parsed });
    assertStateMatchesCapsule(trusted.parsed, capsule.parsed);
  } catch (error) {
    throw new EvidenceError(error.code || 'STATE_INVALID', error.message);
  }
  return structuredClone(trusted.parsed);
}

export function stateBytesUnchanged(trusted) {
  if (!trusted) return true;
  try {
    return fs.readFileSync(trusted.path).equals(trusted.bytes);
  } catch {
    return false;
  }
}

const TASK_ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._-]{0,80}$/;

function orchestrationPair(task) {
  const directory = `.agents/tasks/${task}`;
  return {
    directory,
    capsule: `${directory}/capsule.json`,
    state: `${directory}/STATE.json`
  };
}

function repoRel(parts) {
  return parts.join('/');
}

function readActualEntries(directory) {
  try {
    return fs.readdirSync(directory, { withFileTypes: true });
  } catch {
    return [];
  }
}

function listTaskTreeEntries(candidateRoot) {
  const files = [];
  const walk = (current, parts) => {
    for (const entry of readActualEntries(current)) {
      const nextParts = [...parts, entry.name];
      const absolute = path.join(current, entry.name);
      if (entry.isDirectory()) walk(absolute, nextParts);
      else if (entry.isFile()) files.push(repoRel(nextParts));
    }
  };
  for (const agents of readActualEntries(candidateRoot)) {
    if (!agents.isDirectory() || agents.name.toLowerCase() !== '.agents') continue;
    const agentsPath = path.join(candidateRoot, agents.name);
    for (const tasks of readActualEntries(agentsPath)) {
      if (!tasks.isDirectory() || tasks.name.toLowerCase() !== 'tasks') continue;
      walk(path.join(agentsPath, tasks.name), [agents.name, tasks.name]);
    }
  }
  return files;
}

function isValidTaskId(value) {
  return TASK_ID_PATTERN.test(String(value || ''));
}

function isTaskStateShaped(relativePath) {
  const parts = String(relativePath || '').replace(/\\/g, '/').split('/');
  if (parts.length !== 4) return false;
  if (parts[0].toLowerCase() !== '.agents' || parts[1].toLowerCase() !== 'tasks') return false;
  if (!isValidTaskId(parts[2])) return false;
  const leaf = parts[3].toLowerCase();
  return leaf === 'capsule.json' || leaf === 'state.json';
}

function isInsideTaskRecordDirectory(relativePath) {
  const parts = String(relativePath || '').replace(/\\/g, '/').split('/');
  if (parts.length < 4) return false;
  if (parts[0].toLowerCase() !== '.agents' || parts[1].toLowerCase() !== 'tasks') return false;
  return isValidTaskId(parts[2]);
}

function isRootTaskDocumentation(relativePath) {
  const parts = String(relativePath || '').replace(/\\/g, '/').split('/');
  return parts.length === 3
    && parts[0].toLowerCase() === '.agents'
    && parts[1].toLowerCase() === 'tasks'
    && parts[2] !== ''
    && !parts[2].includes('\\');
}

function controlBaselineTaskPaths(controlRoot, baseline) {
  if (!controlRoot) {
    throw new EvidenceError('CONTROL_REQUIRED', 'Candidate inspection requires the trusted control root.');
  }
  const listed = git(controlRoot, ['ls-tree', '-r', '--name-only', baseline, '--', '.agents/tasks'], { allowFail: true });
  if (listed.status !== 0) {
    throw new EvidenceError('CONTROL_BASELINE', 'Control baseline task-path listing failed.');
  }
  return new Set(
    String(listed.stdout || '')
      .split(/\n/)
      .map((line) => line.replace(/\\/g, '/').trim())
      .filter(Boolean)
  );
}

export function inspectCandidate(candidateRoot, capsule, controlRoot, grantState = null) {
  assertTaskId(capsule.parsed.task);
  const head = git(candidateRoot, ['rev-parse', 'HEAD']).stdout.trim().toLowerCase();
  if (!isAncestor(candidateRoot, capsule.parsed.baseline, head)) {
    throw new EvidenceError('CANDIDATE_ANCESTRY', 'Candidate tip does not descend from the capsule baseline.');
  }
  const pair = orchestrationPair(capsule.parsed.task);
  const baselineDocs = controlBaselineTaskPaths(controlRoot, capsule.parsed.baseline);
  const onDisk = listTaskTreeEntries(candidateRoot);
  for (const relativePath of onDisk) {
    if (relativePath === pair.capsule || relativePath === pair.state) continue;
    if (isTaskStateShaped(relativePath) || isInsideTaskRecordDirectory(relativePath)) {
      throw new EvidenceError('TASK_STATE_UNEXPECTED', `Unexpected task-state file: ${relativePath}`);
    }
    if (isRootTaskDocumentation(relativePath) && baselineDocs.has(relativePath)) {
      continue;
    }
    throw new EvidenceError('TASK_STATE_UNEXPECTED', `Unexpected task-state file: ${relativePath}`);
  }
  const hasCapsule = onDisk.includes(pair.capsule);
  const hasState = onDisk.includes(pair.state);
  if (hasCapsule !== hasState) {
    throw new EvidenceError('TASK_STATE_UNEXPECTED', 'Orchestration state must be the exact capsule.json and STATE.json pair.');
  }
  const trackedState = git(candidateRoot, ['ls-files', '--', pair.capsule, pair.state], { allowFail: true }).stdout.trim();
  if (trackedState) {
    throw new EvidenceError('TASK_STATE_COMMITTED', 'Orchestration state is tracked or staged and is invalid.');
  }
  const present = hasCapsule && hasState;
  const snapshot = snapshotRepository(candidateRoot);
  const entries = parsePorcelain(snapshot.porcelain);
  const knownExclusions = [];
  for (const entry of entries) {
    const file = canonicalLoose(entry.file);
    const pairFile = file === pair.capsule.toLowerCase() || file === pair.state.toLowerCase();
    if (pairFile) {
      if (entry.xy !== '??') {
        throw new EvidenceError('TASK_STATE_STAGED', 'Orchestration state must be untracked. Staged or tracked task state is invalid.');
      }
      continue;
    }
    if (isKnownExclusion(entry.file)) {
      if (entry.xy !== '??') {
        throw new EvidenceError('KNOWN_EXCLUSION', 'A known exclusion is staged or tracked and cannot pass silently.');
      }
      knownExclusions.push(entry.file.replace(/\\/g, '/'));
      continue;
    }
    throw new EvidenceError('CANDIDATE_DIRTY', `Candidate worktree is not a clean committed tip: ${entry.file}`);
  }
  const paths = changedPaths(candidateRoot, capsule.parsed.baseline, head);
  if (paths.some((filePath) => canonicalLoose(filePath).startsWith('.agents/tasks/'))) {
    throw new EvidenceError('TASK_STATE_COMMITTED', 'Committed orchestration state is invalid.');
  }
  if (paths.some((filePath) => isKnownExclusion(filePath))) {
    throw new EvidenceError('KNOWN_EXCLUSION', 'A known exclusion is part of the candidate commit and cannot pass silently.');
  }
  for (const relativePath of RUNTIME_ENV_FILES) {
    const absolute = path.join(candidateRoot, relativePath);
    if (!fs.existsSync(absolute)) continue;
    const committed = blobId(candidateRoot, `HEAD:${relativePath}`);
    const local = hashObject(candidateRoot, absolute);
    if (!committed || committed !== local) {
      throw new EvidenceError('RUNTIME_ENV', `Runtime environment file does not match the committed candidate blob: ${relativePath}`);
    }
  }
  let orchestration = { present: false, human_authorizations_fact: null };
  if (present) {
    const candidateCapsuleBytes = fs.readFileSync(path.join(candidateRoot, pair.capsule));
    let candidateFingerprint;
    try {
      candidateFingerprint = fingerprintCapsule(JSON.parse(candidateCapsuleBytes.toString('utf8')));
    } catch (error) {
      throw new EvidenceError('TASK_STATE_FINGERPRINT', error.message);
    }
    if (candidateFingerprint !== capsule.fingerprint) {
      throw new EvidenceError('TASK_STATE_FINGERPRINT', 'Candidate task capsule fingerprint differs from the external design-freeze capsule.');
    }
    const state = JSON.parse(fs.readFileSync(path.join(candidateRoot, pair.state), 'utf8'));
    if (state?.capsule_fingerprint !== capsule.fingerprint) {
      throw new EvidenceError('TASK_STATE_FINGERPRINT', 'Candidate STATE.json fingerprint differs from the external design-freeze capsule.');
    }
    orchestration = {
      present: true,
      files: [pair.capsule, pair.state],
      human_authorizations_fact: state.human_authorizations || null,
      fingerprint: candidateFingerprint
    };
  }
  const boundState = grantState ? structuredClone(grantState) : createInitialState(capsule.parsed);
  try {
    checkPaths({ capsule: capsule.parsed, changedFiles: paths, state: boundState });
  } catch (error) {
    throw new EvidenceError(error.code || 'PATH_POLICY', error.message);
  }
  return {
    head,
    snapshot,
    paths,
    knownExclusions,
    orchestration,
    authorityPathsChanged: authorityChanges(candidateRoot, capsule.parsed.baseline, head),
    toolchain: toolchainFacts(candidateRoot, head, capsule.parsed)
  };
}

function authorityChanges(candidateRoot, baseline, head) {
  return AUTHORITY_FILES.filter((relativePath) => {
    return blobId(candidateRoot, `${baseline}:${relativePath}`) !== blobId(candidateRoot, `${head}:${relativePath}`);
  });
}

function nearestVersion(candidateRoot, absolutePath) {
  const root = fs.realpathSync(candidateRoot);
  let directory = fs.realpathSync(path.dirname(absolutePath));
  while (isInside(root, directory)) {
    const packagePath = path.join(directory, 'package.json');
    if (fs.existsSync(packagePath) && !canonicalLoose(packagePath).endsWith('.env')) {
      try {
        const parsed = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
        return typeof parsed.version === 'string' ? parsed.version : null;
      } catch {
        return null;
      }
    }
    if (directory === root) break;
    directory = path.dirname(directory);
  }
  return null;
}

function toolchainFacts(candidateRoot, head, parsed) {
  const tools = [];
  const entries = [...(parsed.evidence_plan?.required || []), ...(parsed.evidence_plan?.optional || [])];
  for (const entry of entries) {
    for (const token of entry.argv) {
      if (token.type !== 'candidate_path') continue;
      const absolute = path.resolve(candidateRoot, ...token.value.split('/'));
      if (!fs.existsSync(absolute)) {
        tools.push({ path: token.value, present: false, sha256: null, version: null });
        continue;
      }
      tools.push({
        path: token.value,
        present: true,
        sha256: hashFile(absolute),
        version: nearestVersion(candidateRoot, absolute)
      });
    }
  }
  return {
    package_json_blob: blobId(candidateRoot, `${head}:package.json`),
    package_lock_blob: blobId(candidateRoot, `${head}:package-lock.json`),
    tools
  };
}
