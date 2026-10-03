import { PROTECTED_CLASS_GATES, validateCapsule } from './capsule.mjs';
import {
  classifyProtected,
  findOwnershipOverlaps,
  findProtectedViolations,
  findUnauthorizedFiles,
  uniqueCanonicalFiles
} from './ownership.mjs';
import { assertStateMatchesCapsule } from './stateMachine.mjs';

export class PolicyError extends Error {
  constructor(code, message) {
    super(message);
    this.name = 'PolicyError';
    this.code = code;
  }
}

function fail(code, message) {
  throw new PolicyError(code, message);
}

function authorityFrom(capsule) {
  if (!capsule) {
    fail('CAPSULE_REQUIRED', 'Path and overlap checks require the task capsule.');
  }
  return validateCapsule(capsule);
}

export function checkPaths({ capsule, changedFiles, state = null }) {
  const authority = authorityFrom(capsule);
  if (!state) fail('STATE_REQUIRED', 'check-paths requires the bound task state.');
  assertStateMatchesCapsule(state, authority);
  const unauthorized = findUnauthorizedFiles(changedFiles, authority.allowed_files);
  if (unauthorized.length > 0) {
    fail('UNAUTHORIZED_FILE', `Files outside ALLOWED_FILES: ${unauthorized.join(', ')}`);
  }
  const forbidden = new Set(authority.forbidden_files);
  const blocked = uniqueCanonicalFiles(changedFiles).filter((filePath) => forbidden.has(filePath));
  if (blocked.length > 0) {
    fail('FORBIDDEN_FILE', `Forbidden files are present: ${blocked.join(', ')}`);
  }
  const protectedViolations = findProtectedViolations(changedFiles, authority.protected_authorization);
  if (protectedViolations.length > 0) {
    fail('PROTECTED_FILE', 'A protected file lacks capsule authorization.');
  }
  for (const filePath of uniqueCanonicalFiles(changedFiles)) {
    for (const protectedClass of classifyProtected(filePath)) {
      const gate = PROTECTED_CLASS_GATES[protectedClass];
      if (!gate) continue;
      if (authority.human_gates[gate] !== true || state.human_authorizations?.[gate] !== true) {
        fail(
          'HUMAN_AUTHORIZATION_REQUIRED',
          `${protectedClass} scope is not human approval. ${gate} authorization is required.`
        );
      }
    }
  }
  return { ok: true };
}

function overlapRecord(task) {
  if (!task || typeof task !== 'object' || Array.isArray(task)) {
    fail('TASK_INVALID', 'Overlap task must be an object.');
  }
  if (!task.state) fail('STATE_REQUIRED', 'Each overlap task requires its bound state.');
  const authority = authorityFrom(task.capsule);
  assertStateMatchesCapsule(task.state, authority);
  if (task.allowed_files) {
    assertStateMatchesCapsule({
      ...task.state,
      task: authority.task,
      baseline: authority.baseline,
      allowed_files: task.allowed_files,
      forbidden_files: authority.forbidden_files,
      protected_authorization: authority.protected_authorization
    }, authority);
  }
  const phase = task.phase || task.state?.phase;
  if (!phase || typeof phase !== 'string') {
    fail('TASK_INVALID', 'Overlap task requires a phase.');
  }
  if (task.state?.phase && task.state.phase !== phase) {
    fail('STATE_CAPSULE_DIVERGENCE', 'Overlap phase does not match state.');
  }
  return {
    task: authority.task,
    phase,
    files: authority.allowed_files,
    parallel: task.parallel_overlap_authorization || []
  };
}

export function checkActiveOverlap(tasks) {
  if (!Array.isArray(tasks)) {
    fail('TASK_LIST', 'Overlap input must be a list of tasks.');
  }
  const overlaps = findOwnershipOverlaps(tasks.map(overlapRecord));
  if (overlaps.length > 0) {
    fail('OWNERSHIP_OVERLAP', 'Active tasks overlap ALLOWED_FILES and must be serialized.');
  }
  return { ok: true, overlaps };
}
