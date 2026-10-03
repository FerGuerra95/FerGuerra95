import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { fingerprintAuthority, HUMAN_GATES, validateCapsule } from './capsule.mjs';
import { sameCanonicalList, uniqueCanonicalFiles } from './ownership.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const SECRET_KEYS = /^(auth_secret|password|secret|bearer|api_key|access_token|refresh_token|credential|private_key)$/i;
const SECRET_VALUES = /bearer\s+[a-z0-9._~+/-]+=*|-----BEGIN [A-Z ]*PRIVATE KEY-----/i;

const MERGE_AUTHORIZED_PHASES = new Set([
  'MERGED',
  'POST_MERGE_VALIDATING',
  'VALIDATED',
  'GOVERNANCE_CLOSURE',
  'CLOSED'
]);

export function loadTransitions(filePath = path.join(here, 'transitions.json')) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

export function loadGuards(filePath = path.join(here, 'guards.json')) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

export function writeJsonAtomic(filePath, contents, options = {}) {
  const directory = path.dirname(path.resolve(filePath));
  fs.mkdirSync(directory, { recursive: true });
  const tempPath = path.join(
    directory,
    `.${path.basename(filePath)}.${process.pid}.${crypto.randomBytes(6).toString('hex')}.tmp`
  );
  let handle;
  try {
    handle = fs.openSync(tempPath, 'w');
    fs.writeFileSync(handle, contents);
    fs.fsyncSync(handle);
  } catch (error) {
    if (handle !== undefined) fs.closeSync(handle);
    fs.rmSync(tempPath, { force: true });
    throw error;
  }
  fs.closeSync(handle);
  try {
    if (options.beforeRename) options.beforeRename(tempPath);
    fs.renameSync(tempPath, filePath);
  } catch (error) {
    fs.rmSync(tempPath, { force: true });
    throw error;
  }
}

export class TransitionError extends Error {
  constructor(code, message) {
    super(message);
    this.name = 'TransitionError';
    this.code = code;
  }
}

export class StateError extends Error {
  constructor(code, message) {
    super(message);
    this.name = 'StateError';
    this.code = code;
  }
}

export function findSecretPaths(value, trail = []) {
  const hits = [];
  if (Array.isArray(value)) {
    value.forEach((entry, index) => hits.push(...findSecretPaths(entry, [...trail, String(index)])));
    return hits;
  }
  if (value && typeof value === 'object') {
    for (const [key, entry] of Object.entries(value)) {
      if (SECRET_KEYS.test(key)) hits.push([...trail, key].join('.'));
      hits.push(...findSecretPaths(entry, [...trail, key]));
    }
    return hits;
  }
  if (typeof value === 'string' && SECRET_VALUES.test(value)) hits.push(trail.join('.') || '<root>');
  return hits;
}

export function emptyHumanAuthorizations() {
  return Object.fromEntries(HUMAN_GATES.map((gate) => [gate, false]));
}

export function grantHumanAuthorizations(record, gateNames) {
  if (!record || typeof record !== 'object' || Array.isArray(record)) {
    throw new StateError('STATE_INVALID', 'Task state requires human_authorizations.');
  }
  const next = {};
  for (const gate of HUMAN_GATES) {
    if (typeof record[gate] !== 'boolean') {
      throw new StateError('STATE_INVALID', `human_authorizations.${gate} must be boolean.`);
    }
    next[gate] = record[gate];
  }
  for (const key of Object.keys(record)) {
    if (!HUMAN_GATES.includes(key)) {
      throw new StateError('HUMAN_GATE_UNKNOWN', `Unknown human authorization ${key}.`);
    }
  }
  for (const gate of gateNames) {
    if (!HUMAN_GATES.includes(gate)) {
      throw new StateError('HUMAN_GATE_UNKNOWN', `Unknown human gate ${gate}.`);
    }
    next[gate] = true;
  }
  return next;
}

const NON_HUMAN_EXECUTION_ROLES = ['builder', 'engineering', 'reviewer'];
const NON_MERGE_GRANT_ROLES = ['human', 'technical_direction'];

export function authorizeGate(state, request, options = {}) {
  const guards = options.guards || loadGuards();
  if (!options.capsule) {
    throw new TransitionError('CAPSULE_REQUIRED', 'Authorization requires the task capsule.');
  }
  const authority = validateCapsule(options.capsule);
  validateState(state, { capsule: authority, transitions: options.transitions });
  const gate = request?.gate;
  const role = request?.role;
  if (!HUMAN_GATES.includes(gate)) {
    throw new TransitionError('HUMAN_GATE_UNKNOWN', `Unknown human gate ${gate || 'missing'}.`);
  }
  if (!guards.knownRoles.includes(role)) {
    throw new TransitionError('UNKNOWN_ROLE', `Role ${role || 'unknown'} is not a known role.`);
  }
  if (NON_HUMAN_EXECUTION_ROLES.includes(role)) {
    throw new TransitionError('HUMAN_AUTHORIZATION_FORBIDDEN', `Role ${role} cannot represent a human authorization.`);
  }
  if (gate === 'merge') {
    if (!guards.mergeRoles.includes(role)) {
      throw new TransitionError('HUMAN_AUTHORIZATION_FORBIDDEN', `Role ${role} cannot represent merge authorization.`);
    }
  } else if (!NON_MERGE_GRANT_ROLES.includes(role)) {
    throw new TransitionError('HUMAN_AUTHORIZATION_FORBIDDEN', `Role ${role} cannot represent ${gate} authorization.`);
  }
  if (authority.human_gates[gate] !== true) {
    throw new TransitionError('HUMAN_GATE_NOT_REQUIRED', `Human gate ${gate} is not required by the capsule.`);
  }
  const next = structuredClone(state);
  next.human_authorizations = grantHumanAuthorizations(state.human_authorizations, [gate]);
  next.production_authorized = false;
  validateState(next, { capsule: authority, transitions: options.transitions });
  return next;
}

export function humanGateFor(to) {
  if (to === 'SCOPE_EXPANSION_REQUIRED') return 'scope_expansion';
  if (to === 'HUMAN_MERGE_GATE' || to === 'MERGED') return 'merge';
  return null;
}

function invariant(detail) {
  throw new StateError('STATE_INVARIANT', `State invariant failed: ${detail}`);
}

function assertPhaseInvariants(state) {
  if (state.production_authorized !== false) {
    invariant('production_authorized must remain false.');
  }
  if (typeof state.merge_authorized !== 'boolean') {
    invariant('merge_authorized must be boolean.');
  }
  if (!Number.isInteger(state.attempt) || state.attempt < 1) {
    invariant('attempt must be a positive integer.');
  }

  const mergeAllowed = MERGE_AUTHORIZED_PHASES.has(state.phase);
  if (state.merge_authorized !== mergeAllowed) {
    invariant('merge_authorized is not valid for this phase.');
  }

  const reviewByPhase = {
    ASSIGNED: ['PENDING'],
    IMPLEMENTING: ['PENDING', 'NOT_VERIFIED'],
    READY_FOR_REVIEW: ['PENDING', 'NOT_VERIFIED'],
    REVIEWING: ['REVIEWING'],
    VERIFIED: ['VERIFIED'],
    NOT_VERIFIED: ['NOT_VERIFIED'],
    HUMAN_MERGE_GATE: ['VERIFIED'],
    MERGED: ['VERIFIED'],
    POST_MERGE_VALIDATING: ['VERIFIED'],
    VALIDATED: ['VERIFIED'],
    GOVERNANCE_CLOSURE: ['VERIFIED'],
    CLOSED: ['VERIFIED']
  };
  if (reviewByPhase[state.phase] && !reviewByPhase[state.phase].includes(state.review_status)) {
    invariant(`review_status ${state.review_status || 'missing'} contradicts phase ${state.phase}.`);
  }
  if ((state.phase === 'BLOCKED' || state.phase === 'SCOPE_EXPANSION_REQUIRED') && state.review_status === 'VERIFIED') {
    invariant(`${state.phase} cannot claim review_status VERIFIED.`);
  }

  const humanGateByPhase = {
    ASSIGNED: null,
    IMPLEMENTING: null,
    READY_FOR_REVIEW: null,
    REVIEWING: null,
    VERIFIED: null,
    NOT_VERIFIED: null,
    HUMAN_MERGE_GATE: 'merge',
    MERGED: null,
    POST_MERGE_VALIDATING: null,
    VALIDATED: null,
    GOVERNANCE_CLOSURE: null,
    CLOSED: null,
    BLOCKED: 'blocked',
    SCOPE_EXPANSION_REQUIRED: 'scope_expansion'
  };
  if (Object.prototype.hasOwnProperty.call(humanGateByPhase, state.phase)
    && state.human_gate !== humanGateByPhase[state.phase]) {
    invariant(`human_gate does not match phase ${state.phase}.`);
  }

  if (state.phase === 'ASSIGNED') {
    if (state.actor_role !== null) invariant('ASSIGNED has no actor_role.');
    if (state.builder_status !== 'PENDING') invariant('ASSIGNED builder_status must be PENDING.');
  } else if (typeof state.actor_role !== 'string' || !state.actor_role) {
    invariant('actor_role is required after assignment.');
  }

  if (state.phase === 'IMPLEMENTING' && state.builder_status !== 'IMPLEMENTING') {
    invariant('IMPLEMENTING builder_status must be IMPLEMENTING.');
  }
  if (state.phase === 'READY_FOR_REVIEW' && state.builder_status !== 'READY_FOR_REVIEW') {
    invariant('READY_FOR_REVIEW builder_status must be READY_FOR_REVIEW.');
  }
  if (state.phase === 'CLOSED' && state.builder_status !== 'CLOSED') {
    invariant('CLOSED builder_status must be CLOSED.');
  }
}

export function assertStateMatchesCapsule(state, capsule) {
  const authority = validateCapsule(capsule);
  if (String(state?.task) !== String(authority.task)) {
    throw new StateError('STATE_CAPSULE_DIVERGENCE', 'State task diverges from the capsule.');
  }
  if (String(state?.baseline || '').toLowerCase() !== authority.baseline) {
    throw new StateError('STATE_CAPSULE_DIVERGENCE', 'State baseline diverges from the capsule.');
  }
  const allowed = uniqueCanonicalFiles(state?.allowed_files || []);
  const forbidden = uniqueCanonicalFiles(state?.forbidden_files || []);
  const protectedAuthorization = [...new Set(state?.protected_authorization || [])].sort();
  if (!sameCanonicalList(allowed, authority.allowed_files)) {
    throw new StateError('STATE_CAPSULE_DIVERGENCE', 'State allowed_files diverge from the capsule.');
  }
  if (!sameCanonicalList(forbidden, authority.forbidden_files)) {
    throw new StateError('STATE_CAPSULE_DIVERGENCE', 'State forbidden_files diverge from the capsule.');
  }
  if (!sameCanonicalList(protectedAuthorization, authority.protected_authorization)) {
    throw new StateError('STATE_CAPSULE_DIVERGENCE', 'State protected_authorization diverges from the capsule.');
  }
  if (state?.capsule_fingerprint !== fingerprintAuthority(authority)) {
    throw new StateError('STATE_CAPSULE_DIVERGENCE', 'State capsule_fingerprint does not match the capsule.');
  }
  return authority;
}

export function createInitialState(capsule) {
  const authority = validateCapsule(capsule);
  return {
    task: authority.task,
    baseline: authority.baseline,
    phase: 'ASSIGNED',
    actor_role: null,
    builder_status: 'PENDING',
    review_status: 'PENDING',
    human_gate: null,
    human_authorizations: emptyHumanAuthorizations(),
    merge_authorized: false,
    production_authorized: false,
    attempt: 1,
    capsule_fingerprint: fingerprintAuthority(authority),
    allowed_files: [...authority.allowed_files],
    forbidden_files: [...authority.forbidden_files],
    protected_authorization: [...authority.protected_authorization],
    correction: { reviewer_blocker: null }
  };
}

export function validateState(state, options = {}) {
  const transitions = options.transitions || loadTransitions();
  if (!state || typeof state !== 'object' || Array.isArray(state)) {
    throw new StateError('STATE_INVALID', 'Task state must be an object.');
  }
  if (!state.task) throw new StateError('STATE_INVALID', 'Task state requires a task id.');
  if (!state.baseline || !/^[0-9a-f]{7,64}$/i.test(String(state.baseline))) {
    throw new StateError('BASELINE_MISSING', 'Task state requires a baseline SHA.');
  }
  if (!Object.prototype.hasOwnProperty.call(transitions, state.phase)) {
    throw new StateError('STATE_INVALID', 'Task state phase is not a known phase.');
  }
  if (!Array.isArray(state.allowed_files)) {
    throw new StateError('STATE_INVALID', 'Task state requires allowed_files.');
  }
  if (!/^[0-9a-f]{64}$/.test(String(state.capsule_fingerprint || ''))) {
    throw new StateError('STATE_INVALID', 'Task state requires capsule_fingerprint.');
  }
  grantHumanAuthorizations(state.human_authorizations, []);
  const secrets = findSecretPaths(state);
  if (secrets.length > 0) {
    throw new StateError('SECRET_LEAK', 'Task state contains a secret-like field or value.');
  }
  assertPhaseInvariants(state);
  if (options.capsule) {
    const authority = assertStateMatchesCapsule(state, options.capsule);
    for (const gate of HUMAN_GATES) {
      if (state.human_authorizations[gate] === true && authority.human_gates[gate] !== true) {
        throw new StateError(
          'HUMAN_GATE_NOT_REQUIRED',
          `human_authorizations.${gate} claims approval for a gate the capsule does not require.`
        );
      }
    }
  }
  return state;
}

function requireRole(guards, key, role) {
  if (!guards.knownRoles.includes(role)) {
    throw new TransitionError('UNKNOWN_ROLE', `Role ${role || 'unknown'} is not a known role.`);
  }
  if (!guards[key].includes(role)) {
    throw new TransitionError('ROLE_FORBIDDEN', `Role ${role} cannot perform this transition.`);
  }
}

export function transition(state, request, options = {}) {
  const transitions = options.transitions || loadTransitions();
  const guards = options.guards || loadGuards();
  if (!options.capsule) {
    throw new TransitionError('CAPSULE_REQUIRED', 'Transition requires the task capsule.');
  }
  const authority = validateCapsule(options.capsule);
  validateState(state, { transitions, capsule: authority });
  if (findSecretPaths(request).length > 0) {
    throw new TransitionError('SECRET_LEAK', 'Transition request contains a secret-like field or value.');
  }
  const from = state.phase;
  const to = request?.to;
  const allowed = transitions[from] || [];
  if (!allowed.includes(to)) {
    throw new TransitionError('INVALID_TRANSITION', `Refusing ${from} → ${to || 'unknown'}.`);
  }
  if (!guards.knownRoles.includes(request.role)) {
    throw new TransitionError('UNKNOWN_ROLE', `Role ${request.role || 'unknown'} is not a known role.`);
  }
  if (request.productionAuthorized === true) {
    throw new TransitionError('PRODUCTION_GATE', 'Production authorization is a separate human gate.');
  }

  const next = structuredClone(state);
  next.phase = to;
  next.actor_role = request.role;
  next.human_gate = humanGateFor(to);
  next.production_authorized = false;
  if (!MERGE_AUTHORIZED_PHASES.has(to)) next.merge_authorized = false;

  if (to === 'IMPLEMENTING' && from === 'ASSIGNED') {
    requireRole(guards, 'implementRoles', request.role);
    next.builder_status = 'IMPLEMENTING';
  }
  if (to === 'READY_FOR_REVIEW') {
    requireRole(guards, 'implementRoles', request.role);
    next.builder_status = 'READY_FOR_REVIEW';
  }
  if (to === 'REVIEWING') {
    requireRole(guards, 'reviewRoles', request.role);
    next.review_status = 'REVIEWING';
  }
  if (to === 'VERIFIED') {
    if (!guards.verifiedRoles.includes(request.role) || (guards.builderCannotVerify && ['builder', 'engineering'].includes(request.role))) {
      throw new TransitionError('BUILDER_CANNOT_VERIFY', 'Only the reviewer can set VERIFIED.');
    }
    next.review_status = 'VERIFIED';
    next.merge_authorized = false;
    next.human_gate = null;
  }
  if (to === 'NOT_VERIFIED') {
    requireRole(guards, 'notVerifiedRoles', request.role);
    next.review_status = 'NOT_VERIFIED';
    next.merge_authorized = false;
    next.human_gate = null;
    next.correction = { reviewer_blocker: request.reviewerBlocker || null };
  }
  if (from === 'NOT_VERIFIED' && to === 'IMPLEMENTING') {
    if (request.scopeExpansionRequired === true) {
      throw new TransitionError('SCOPE_EXPANSION', 'Correction requires scope expansion and cannot continue automatically.');
    }
    requireRole(guards, 'correctionRoles', request.role);
    next.attempt = Number(state.attempt || 1) + 1;
    next.builder_status = 'IMPLEMENTING';
    next.human_gate = null;
    next.merge_authorized = false;
    next.correction = { reviewer_blocker: request.reviewerBlocker || state.correction?.reviewer_blocker || null };
  }
  if (to === 'SCOPE_EXPANSION_REQUIRED') {
    next.human_gate = 'scope_expansion';
    next.merge_authorized = false;
  }
  if (to === 'BLOCKED') {
    next.human_gate = 'blocked';
    next.merge_authorized = false;
  }
  if (to === 'HUMAN_MERGE_GATE') {
    requireRole(guards, 'mergeGateRoles', request.role);
    next.human_gate = 'merge';
    next.merge_authorized = false;
  }
  if (to === 'MERGED') {
    if (!guards.mergeRoles.includes(request.role)) {
      throw new TransitionError('HUMAN_MERGE_GATE', 'MERGED requires a merge role.');
    }
    if (state.human_authorizations?.merge !== true) {
      throw new TransitionError('HUMAN_MERGE_GATE', 'MERGED requires recorded merge authorization.');
    }
    if (state.review_status !== 'VERIFIED') {
      throw new TransitionError('REVIEW_NOT_VERIFIED', 'Merge requires review_status VERIFIED.');
    }
    next.merge_authorized = true;
    next.human_gate = null;
  }
  if (to === 'POST_MERGE_VALIDATING') {
    requireRole(guards, 'postMergeRoles', request.role);
  }
  if (to === 'VALIDATED') {
    requireRole(guards, 'validatedRoles', request.role);
  }
  if (to === 'GOVERNANCE_CLOSURE' || to === 'CLOSED') {
    requireRole(guards, 'closureRoles', request.role);
  }
  if (to === 'CLOSED') next.builder_status = 'CLOSED';
  next.production_authorized = false;
  next.allowed_files = [...authority.allowed_files];
  next.capsule_fingerprint = fingerprintAuthority(authority);
  next.forbidden_files = [...authority.forbidden_files];
  next.protected_authorization = [...authority.protected_authorization];
  next.baseline = authority.baseline;
  next.task = authority.task;
  validateState(next, { transitions, capsule: authority });
  return next;
}
