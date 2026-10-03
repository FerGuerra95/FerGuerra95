import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import { fingerprintCapsule, HUMAN_GATES, validateCapsule, CapsuleError } from '../../../scripts/agents/lib/capsule.mjs';
import { classifyProtected, PathError } from '../../../scripts/agents/lib/ownership.mjs';
import { checkActiveOverlap, checkPaths, PolicyError } from '../../../scripts/agents/lib/policy.mjs';
import {
  createInitialState,
  loadGuards,
  loadTransitions,
  authorizeGate,
  transition,
  TransitionError,
  validateState,
  writeJsonAtomic,
  StateError
} from '../../../scripts/agents/lib/stateMachine.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const libDir = path.join(root, 'scripts/agents/lib');
const cliPath = path.join(root, 'scripts/agents/orchestrate.mjs');
const contractPath = path.join(root, '.agents/orchestration/CONTRACT.md');
const baseline = '194736151ea66d6d4eab0001baf8f78cc271a0ee';
const auditFile = 'backend/services/audit/auditLog.service.js';

function rawCapsule(overrides = {}) {
  return {
    task: 'A04',
    baseline,
    allowed_files: [auditFile],
    forbidden_files: ['.env'],
    human_gates: {
      scope_expansion: true,
      source_of_truth_change: true,
      golden_change: true,
      governance_change: true,
      merge: true,
      production: true,
      destructive_real_data_action: true
    },
    protected_authorization: [],
    ...overrides
  };
}

function capsule(overrides = {}) {
  return validateCapsule(rawCapsule(overrides));
}

function withCapsule(authority, request, options = {}) {
  return transition(createInitialState(authority), request, { capsule: authority, ...options });
}

function advance(authority, steps) {
  let state = createInitialState(authority);
  for (const step of steps) {
    if (step.to === 'MERGED' && state.human_authorizations.merge !== true) {
      state = authorizeGate(state, { gate: 'merge', role: 'human' }, { capsule: authority });
    }
    state = transition(state, step, { capsule: authority });
  }
  return state;
}

function atReviewing(authority = capsule()) {
  return advance(authority, [
    { to: 'IMPLEMENTING', role: 'engineering' },
    { to: 'READY_FOR_REVIEW', role: 'engineering' },
    { to: 'REVIEWING', role: 'reviewer' }
  ]);
}

function atMergeGate(authority = capsule()) {
  const reviewed = transition(atReviewing(authority), { to: 'VERIFIED', role: 'reviewer' }, { capsule: authority });
  return transition(reviewed, { to: 'HUMAN_MERGE_GATE', role: 'reviewer' }, { capsule: authority });
}

function runCli(args) {
  return spawnSync(process.execPath, [cliPath, ...args], { encoding: 'utf8' });
}

function boundPaths(capsuleInput, changedFiles) {
  return checkPaths({
    capsule: capsuleInput,
    changedFiles,
    state: createInitialState(capsuleInput)
  });
}

function overlapTask(task, allowedFiles, extra = {}) {
  const capsuleBody = rawCapsule({ task, allowed_files: allowedFiles });
  const state = { ...createInitialState(capsuleBody), phase: 'IMPLEMENTING' };
  return {
    task,
    phase: 'IMPLEMENTING',
    capsule: capsuleBody,
    state,
    ...extra
  };
}

describe('A-MULTI-02A orchestration core', () => {
  it('accepts a legal transition and rejects an illegal one without rewriting state', () => {
    const authority = capsule();
    const state = createInitialState(authority);
    const next = transition(state, { to: 'IMPLEMENTING', role: 'engineering' }, { capsule: authority });
    expect(next.phase).toBe('IMPLEMENTING');
    expect(next.actor_role).toBe('engineering');
    expect(() => transition(state, { to: 'VERIFIED', role: 'reviewer' }, { capsule: authority })).toThrow(TransitionError);
    expect(state.phase).toBe('ASSIGNED');
  });

  it('lets only the reviewer set VERIFIED', () => {
    const authority = capsule();
    const reviewing = atReviewing(authority);
    expect(() => transition(reviewing, { to: 'VERIFIED', role: 'engineering' }, { capsule: authority })).toThrow(/VERIFIED/);
    expect(transition(reviewing, { to: 'VERIFIED', role: 'reviewer' }, { capsule: authority }).review_status).toBe('VERIFIED');
  });

  it('enforces the human merge gate', () => {
    const authority = capsule();
    const gate = atMergeGate(authority);
    expect(gate.human_gate).toBe('merge');
    expect(gate.merge_authorized).toBe(false);
    expect(() => transition(gate, {
      to: 'MERGED',
      role: 'human',
      humanAuthorization: true
    }, { capsule: authority })).toThrow(/recorded merge authorization/i);
    const granted = authorizeGate(gate, { gate: 'merge', role: 'human' }, { capsule: authority });
    expect(granted.phase).toBe('HUMAN_MERGE_GATE');
    const merged = transition(granted, {
      to: 'MERGED',
      role: 'human'
    }, { capsule: authority });
    expect(merged.phase).toBe('MERGED');
    expect(merged.merge_authorized).toBe(true);
    expect(merged.production_authorized).toBe(false);
  });

  it('rejects capsule/state allowed_files and baseline divergence', () => {
    const authority = capsule();
    const state = createInitialState(authority);
    const widened = { ...state, allowed_files: [...state.allowed_files, 'package.json'] };
    expect(() => validateState(widened, { capsule: authority })).toThrow(/allowed_files diverge/i);
    const moved = {
      ...state,
      baseline: 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb'
    };
    expect(() => validateState(moved, { capsule: authority })).toThrow(/baseline diverges/i);
  });

  it('rejects check-paths that try to use a widened state or a caller allow list', () => {
    const authority = capsule();
    const state = createInitialState(authority);
    const widened = { ...state, allowed_files: [...state.allowed_files, 'package.json'] };
    expect(() => checkPaths({
      capsule: authority,
      changedFiles: ['package.json'],
      state: widened
    })).toThrow(/allowed_files diverge/i);
    expect(() => checkPaths({
      changedFiles: ['package.json'],
      allowedFiles: ['package.json']
    })).toThrow(/capsule/i);
    expect(boundPaths(authority, ['backend\\services\\audit\\auditLog.service.js']).ok).toBe(true);
    expect(() => checkPaths({
      capsule: authority,
      changedFiles: [auditFile]
    })).toThrow(/bound task state/i);
  });

  it('canonicalizes dot, dotdot, duplicate separators, and case as the same file', () => {
    const authority = capsule();
    for (const changed of [
      'backend/services/audit/../audit/auditLog.service.js',
      'backend/./services/audit/auditLog.service.js',
      'backend//services//audit//auditLog.service.js',
      'Backend/Services/Audit/AuditLog.service.js'
    ]) {
      expect(boundPaths(authority, [changed]).ok).toBe(true);
    }
  });

  it('rejects absolute, drive-qualified, UNC, and root-escaping paths', () => {
    const authority = capsule();
    expect(() => boundPaths(authority, ['C:/repo/docs/security/policy.md'])).toThrow(PathError);
    expect(() => boundPaths(authority, ['C:\\repo\\backend\\server.js'])).toThrow(/drive-qualified/i);
    expect(() => boundPaths(authority, ['\\\\server\\share\\file.js'])).toThrow(/UNC/i);
    expect(() => boundPaths(authority, ['../outside.js'])).toThrow(/escapes the repository root/i);
  });

  it('rejects protected spellings unless the capsule grants the class', () => {
    const security = 'notes/../docs/security/policy.md';
    const securityCase = 'docs/Security/policy.md';
    const sourceCase = 'docs/architecture/source_of_truth_registry.md';
    expect(classifyProtected(sourceCase)).toContain('source_of_truth');
    expect(classifyProtected('docs/Architecture/SOURCE_OF_TRUTH_REGISTRY.md')).toContain('source_of_truth');
    expect(() => boundPaths(rawCapsule({ allowed_files: [security] }), [security])).toThrow(/protected/i);
    expect(() => boundPaths(rawCapsule({ allowed_files: [securityCase] }), [securityCase])).toThrow(/protected/i);
    expect(() => boundPaths(rawCapsule({ allowed_files: [sourceCase] }), [sourceCase])).toThrow(/protected/i);
    expect(() => validateCapsule(rawCapsule({
      allowed_files: ['C:/repo/docs/security/policy.md']
    }))).toThrow(/drive-qualified/i);
    expect(boundPaths(rawCapsule({
      allowed_files: [security],
      protected_authorization: ['security_contract']
    }), [securityCase]).ok).toBe(true);
  });

  it('collides canonical file spellings and ignores sibling prefixes and closed tasks', () => {
    const pairs = [
      ['Backend/services/auth/auth.service.js', 'backend/services/auth/auth.service.js'],
      ['backend/./services/auth/auth.service.js', 'backend/services/auth/auth.service.js'],
      ['backend/services/auth/../auth/auth.service.js', 'backend/services/auth/auth.service.js'],
      ['backend//services//auth//auth.service.js', 'backend/services/auth/auth.service.js']
    ];
    for (const [left, right] of pairs) {
      expect(() => checkActiveOverlap([
        overlapTask('A04', [left]),
        overlapTask('A06', [right])
      ])).toThrow(/serialized/i);
    }
    expect(checkActiveOverlap([
      overlapTask('A04', ['backend/services/auth']),
      overlapTask('A05', ['backend/services/auth-old'])
    ]).ok).toBe(true);
    const closed = overlapTask('A04', [auditFile]);
    closed.phase = 'CLOSED';
    closed.state = { ...closed.state, phase: 'CLOSED' };
    expect(checkActiveOverlap([
      closed,
      overlapTask('A06', [auditFile])
    ]).ok).toBe(true);
    expect(() => checkActiveOverlap([
      {
        ...overlapTask('A04', [auditFile]),
        parallel_overlap_authorization: ['A06']
      },
      overlapTask('A06', [auditFile])
    ])).toThrow(/serialized/i);
  });

  it('rejects directory grants and contradictory state fields', () => {
    expect(() => validateCapsule(rawCapsule({
      allowed_files: ['backend/services/']
    }))).toThrow(/exact files/i);
    const authority = capsule();
    const base = createInitialState(authority);
    expect(() => validateState({
      ...base,
      phase: 'VERIFIED',
      actor_role: 'reviewer',
      review_status: 'PENDING',
      human_gate: null,
      merge_authorized: false
    })).toThrow(/review_status PENDING contradicts phase VERIFIED/i);
    expect(() => validateState({
      ...base,
      phase: 'VERIFIED',
      actor_role: 'reviewer',
      review_status: 'VERIFIED',
      human_gate: null,
      merge_authorized: true
    })).toThrow(/merge_authorized/i);
    expect(() => validateState({
      ...base,
      production_authorized: true
    })).toThrow(/production_authorized/i);
  });

  it('refuses orchestrator and technical_direction as implementers', () => {
    const authority = capsule();
    const state = createInitialState(authority);
    expect(() => transition(state, { to: 'IMPLEMENTING', role: 'orchestrator' }, { capsule: authority })).toThrow(/cannot perform/i);
    expect(() => transition(state, { to: 'IMPLEMENTING', role: 'technical_direction' }, { capsule: authority })).toThrow(/cannot perform/i);
    expect(state.phase).toBe('ASSIGNED');
  });

  it('records --authorize as representation and not identity proof', () => {
    const contract = fs.readFileSync(contractPath, 'utf8');
    expect(contract).toMatch(/--authorize/);
    expect(contract).toMatch(/not cryptographic proof of human identity/i);
    expect(contract).toMatch(/records authorization state/i);
    expect(contract).toMatch(/representation/i);
  });

  it('rejects a malformed capsule, malformed state, missing baseline, and unknown role', () => {
    expect(() => validateCapsule({ task: 'A04' })).toThrow(CapsuleError);
    expect(() => validateCapsule(rawCapsule({ baseline: '' }))).toThrow(/baseline/i);
    expect(() => validateState({ task: 'A04', phase: 'ASSIGNED', allowed_files: [] })).toThrow(StateError);
    const authority = capsule();
    expect(() => withCapsule(authority, { to: 'IMPLEMENTING', role: 'intern' })).toThrow(/known role/i);
    expect(() => checkActiveOverlap(null)).toThrow(PolicyError);
  });

  it('rejects secret-like state', () => {
    const secretState = createInitialState(capsule());
    secretState.password = 'not-stored';
    expect(() => validateState(secretState)).toThrow(/secret/i);
  });

  it('preserves CLI exit codes and does not rewrite state on an illegal transition', () => {
    const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'ceos-02a-cli-'));
    const capsulePath = path.join(temp, 'capsule.json');
    const statePath = path.join(temp, 'STATE.json');
    const pathsPath = path.join(temp, 'paths.json');
    const tasksPath = path.join(temp, 'tasks.json');
    fs.writeFileSync(capsulePath, JSON.stringify(rawCapsule()));
    fs.writeFileSync(pathsPath, JSON.stringify({
      capsule: rawCapsule(),
      changedFiles: ['package.json'],
      allowedFiles: ['package.json']
    }));
    fs.writeFileSync(tasksPath, JSON.stringify([
      overlapTask('A04', [auditFile]),
      overlapTask('A06', [auditFile])
    ]));

    expect(runCli(['--help']).status).toBe(0);
    expect(runCli(['validate-capsule', '--file', capsulePath]).status).toBe(0);
    expect(runCli(['validate-capsule', '--file', path.join(temp, 'missing.json')]).status).toBe(1);
    expect(runCli(['init', '--capsule', capsulePath, '--out', statePath]).status).toBe(0);
    const before = fs.readFileSync(statePath);
    const secondInit = runCli(['init', '--capsule', capsulePath, '--out', statePath]);
    expect(secondInit.status).toBe(1);
    expect(secondInit.stderr).toMatch(/overwrite/i);
    expect(fs.readFileSync(statePath).equals(before)).toBe(true);
    const illegal = runCli([
      'transition', '--state', statePath, '--capsule', capsulePath, '--to', 'VERIFIED', '--role', 'reviewer'
    ]);
    expect(illegal.status).toBe(1);
    expect(fs.readFileSync(statePath).equals(before)).toBe(true);
    expect(runCli(['validate-state', '--file', statePath, '--capsule', capsulePath]).status).toBe(0);
    const widened = JSON.parse(before.toString('utf8'));
    widened.allowed_files = [...widened.allowed_files, 'package.json'];
    const widenedPath = path.join(temp, 'WIDE.json');
    fs.writeFileSync(widenedPath, JSON.stringify(widened));
    expect(runCli(['validate-state', '--file', widenedPath, '--capsule', capsulePath]).status).toBe(1);
    expect(runCli(['check-paths', '--file', pathsPath]).status).toBe(1);
    expect(runCli(['check-overlap', '--file', tasksPath]).status).toBe(1);
    expect(runCli(['human-gate', '--to', 'MERGED']).status).toBe(0);
    expect(runCli(['nope']).status).toBe(2);
    expect(runCli([
      'transition', '--state', statePath, '--capsule', capsulePath, '--to', 'IMPLEMENTING', '--role', 'engineering'
    ]).status).toBe(0);
    fs.rmSync(temp, { recursive: true, force: true });
  }, 20000);

  it('is sensitive to a mutated transition table and restores the canonical file', () => {
    const canonicalPath = path.join(libDir, 'transitions.json');
    const before = fs.readFileSync(canonicalPath);
    const copyPath = path.join(os.tmpdir(), `ceos-02a-transitions-${process.pid}.json`);
    const mutated = loadTransitions();
    mutated.ASSIGNED = [...mutated.ASSIGNED, 'VERIFIED'];
    fs.writeFileSync(copyPath, JSON.stringify(mutated));
    const authority = capsule();
    const state = createInitialState(authority);
    expect(() => transition(state, { to: 'VERIFIED', role: 'reviewer' }, { capsule: authority })).toThrow(/Refusing/);
    expect(transition(state, { to: 'VERIFIED', role: 'reviewer' }, {
      capsule: authority,
      transitions: loadTransitions(copyPath)
    }).phase).toBe('VERIFIED');
    fs.rmSync(copyPath, { force: true });
    expect(fs.readFileSync(canonicalPath).equals(before)).toBe(true);
  });

  it('is sensitive to reviewer authority and implementation role guards', () => {
    const canonicalPath = path.join(libDir, 'guards.json');
    const before = fs.readFileSync(canonicalPath);
    const copyPath = path.join(os.tmpdir(), `ceos-02a-roles-${process.pid}.json`);
    const mutated = loadGuards();
    mutated.builderCannotVerify = false;
    mutated.verifiedRoles = ['reviewer', 'engineering'];
    mutated.implementRoles = [...mutated.implementRoles, 'orchestrator'];
    fs.writeFileSync(copyPath, JSON.stringify(mutated));
    const authority = capsule();
    const reviewing = atReviewing(authority);
    const assigned = createInitialState(authority);
    expect(() => transition(reviewing, { to: 'VERIFIED', role: 'engineering' }, { capsule: authority })).toThrow(/VERIFIED/);
    expect(transition(reviewing, { to: 'VERIFIED', role: 'engineering' }, {
      capsule: authority,
      guards: loadGuards(copyPath)
    }).review_status).toBe('VERIFIED');
    expect(() => transition(assigned, { to: 'IMPLEMENTING', role: 'orchestrator' }, { capsule: authority })).toThrow(/cannot perform/i);
    expect(transition(assigned, { to: 'IMPLEMENTING', role: 'orchestrator' }, {
      capsule: authority,
      guards: loadGuards(copyPath)
    }).phase).toBe('IMPLEMENTING');
    fs.rmSync(copyPath, { force: true });
    expect(fs.readFileSync(canonicalPath).equals(before)).toBe(true);
  });

  it('is sensitive to a mutated human merge gate', () => {
    const canonicalPath = path.join(libDir, 'guards.json');
    const before = fs.readFileSync(canonicalPath);
    const copyPath = path.join(os.tmpdir(), `ceos-02a-merge-${process.pid}.json`);
    const mutated = loadGuards();
    mutated.mergeRequiresAuthorization = false;
    mutated.mergeRoles = ['technical_direction'];
    fs.writeFileSync(copyPath, JSON.stringify(mutated));
    const authority = capsule();
    const gate = atMergeGate(authority);
    const granted = authorizeGate(gate, { gate: 'merge', role: 'human' }, { capsule: authority });
    expect(() => transition(granted, { to: 'MERGED', role: 'human' }, { capsule: authority, guards: loadGuards(copyPath) })).toThrow(/merge role/i);
    expect(transition(granted, { to: 'MERGED', role: 'technical_direction' }, {
      capsule: authority,
      guards: loadGuards(copyPath)
    }).phase).toBe('MERGED');
    expect(() => transition(gate, { to: 'MERGED', role: 'technical_direction' }, {
      capsule: authority,
      guards: loadGuards(copyPath)
    })).toThrow(/recorded merge authorization/i);
    mutated.mergeRoles = ['engineering', 'technical_direction'];
    fs.writeFileSync(copyPath, JSON.stringify(mutated));
    expect(() => authorizeGate(gate, { gate: 'merge', role: 'engineering' }, {
      capsule: authority,
      guards: loadGuards(copyPath)
    })).toThrow(/cannot represent/);
    fs.rmSync(copyPath, { force: true });
    expect(fs.readFileSync(canonicalPath).equals(before)).toBe(true);
  });

  it('is sensitive to capsule authority, canonical paths, protected class, and invariants', () => {
    const authority = capsule();
    const state = createInitialState(authority);
    const widenedPath = path.join(os.tmpdir(), `ceos-02a-authority-${process.pid}.json`);
    fs.writeFileSync(widenedPath, JSON.stringify({
      ...state,
      allowed_files: ['package.json']
    }));
    expect(() => validateState(JSON.parse(fs.readFileSync(widenedPath, 'utf8')), { capsule: authority })).toThrow(/diverge/i);
    const matching = validateCapsule(rawCapsule({ allowed_files: ['package.json'], forbidden_files: ['.env'] }));
    expect(boundPaths(matching, ['Package.json']).ok).toBe(true);
    fs.rmSync(widenedPath, { force: true });

    expect(() => boundPaths(authority, ['backend/services/audit/../../../../outside.js'])).toThrow(PathError);
    expect(boundPaths(authority, ['backend/services/./audit/auditLog.service.js']).ok).toBe(true);

    const protectedCapsule = rawCapsule({
      allowed_files: ['docs/security/policy.md'],
      protected_authorization: ['security_contract']
    });
    expect(() => boundPaths(rawCapsule({ allowed_files: ['docs/security/policy.md'] }), ['docs/SECURITY/policy.md'])).toThrow(/protected/i);
    expect(boundPaths(protectedCapsule, ['docs/SECURITY/policy.md']).ok).toBe(true);

    expect(() => checkActiveOverlap([
      overlapTask('A04', ['Backend/a.js']),
      overlapTask('A06', ['backend/a.js'])
    ])).toThrow(/serialized/i);
    expect(checkActiveOverlap([
      overlapTask('A04', ['backend/a.js']),
      overlapTask('A06', ['backend/b.js'])
    ]).ok).toBe(true);

    expect(() => validateState({ ...state, production_authorized: true })).toThrow(/production_authorized/i);
    expect(validateState(state, { capsule: authority }).phase).toBe('ASSIGNED');
    expect(fs.existsSync(widenedPath)).toBe(false);
  });

  it('rejects a substituted capsule against the bound state', () => {
    const authority = capsule();
    const state = createInitialState(authority);
    const wide = rawCapsule({ allowed_files: [auditFile, 'package.json'] });
    expect(fingerprintCapsule(wide)).not.toBe(state.capsule_fingerprint);
    expect(() => checkPaths({
      capsule: wide,
      changedFiles: ['package.json'],
      state
    })).toThrow(/diverge|fingerprint/i);
    expect(() => transition(state, { to: 'IMPLEMENTING', role: 'engineering' }, { capsule: wide })).toThrow(/diverge|fingerprint/i);
    expect(() => validateState(state, { capsule: wide })).toThrow(/diverge|fingerprint/i);
    const rebound = {
      ...state,
      allowed_files: [...state.allowed_files, 'package.json']
    };
    expect(() => checkPaths({ capsule: wide, changedFiles: ['package.json'], state: rebound })).toThrow(/fingerprint/i);
  });

  it('changes the fingerprint when allowed files or baseline change', () => {
    const original = fingerprintCapsule(rawCapsule());
    expect(fingerprintCapsule(rawCapsule({
      allowed_files: [auditFile, 'package.json']
    }))).not.toBe(original);
    expect(fingerprintCapsule(rawCapsule({
      baseline: 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb'
    }))).not.toBe(original);
  });

  it('keeps one fingerprint for equivalent canonical path spellings', () => {
    const spelled = fingerprintCapsule(rawCapsule({
      allowed_files: ['Backend\\services\\audit\\..\\audit\\.\\auditLog.service.js']
    }));
    expect(spelled).toBe(fingerprintCapsule(rawCapsule()));
    expect(spelled).toBe(createInitialState(rawCapsule()).capsule_fingerprint);
  });

  it('refuses a fingerprint for a malformed capsule', () => {
    expect(() => fingerprintCapsule({ task: 'A04' })).toThrow(CapsuleError);
    expect(() => fingerprintCapsule(rawCapsule({ baseline: 'not-a-sha' }))).toThrow(CapsuleError);
  });

  it('rejects stop states that claim verified review', () => {
    const base = createInitialState(capsule());
    expect(() => validateState({
      ...base,
      phase: 'BLOCKED',
      actor_role: 'engineering',
      human_gate: 'blocked',
      review_status: 'VERIFIED',
      merge_authorized: false
    })).toThrow(/cannot claim review_status VERIFIED/i);
    expect(() => validateState({
      ...base,
      phase: 'SCOPE_EXPANSION_REQUIRED',
      actor_role: 'engineering',
      human_gate: 'scope_expansion',
      review_status: 'VERIFIED',
      merge_authorized: false
    })).toThrow(/cannot claim review_status VERIFIED/i);
  });

  it('replaces state atomically and keeps the last good file when the temp write fails', () => {
    const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'ceos-02a-atomic-'));
    const target = path.join(temp, 'STATE.json');
    writeJsonAtomic(target, '{"phase":"ASSIGNED"}\n');
    expect(JSON.parse(fs.readFileSync(target, 'utf8')).phase).toBe('ASSIGNED');
    expect(() => writeJsonAtomic(target, '{"phase":"TORN"}\n', {
      beforeRename() {
        throw new Error('simulated temp failure');
      }
    })).toThrow(/simulated temp failure/);
    expect(JSON.parse(fs.readFileSync(target, 'utf8')).phase).toBe('ASSIGNED');
    expect(fs.readdirSync(temp).some((name) => name.endsWith('.tmp'))).toBe(false);
    writeJsonAtomic(target, '{"phase":"IMPLEMENTING"}\n');
    expect(JSON.parse(fs.readFileSync(target, 'utf8')).phase).toBe('IMPLEMENTING');
    fs.rmSync(temp, { recursive: true, force: true });
  });

  it('validates the legal graph and reserves closure for technical direction or human', () => {
    const authority = capsule();
    const steps = [
      { to: 'IMPLEMENTING', role: 'engineering' },
      { to: 'READY_FOR_REVIEW', role: 'builder' },
      { to: 'REVIEWING', role: 'reviewer' },
      { to: 'VERIFIED', role: 'reviewer' },
      { to: 'HUMAN_MERGE_GATE', role: 'technical_direction' },
      { to: 'MERGED', role: 'human', humanAuthorization: true },
      { to: 'POST_MERGE_VALIDATING', role: 'engineering' },
      { to: 'VALIDATED', role: 'reviewer' },
      { to: 'GOVERNANCE_CLOSURE', role: 'technical_direction' },
      { to: 'CLOSED', role: 'human' }
    ];
    let state = createInitialState(authority);
    expect(validateState(state, { capsule: authority }).phase).toBe('ASSIGNED');
    for (const step of steps) {
      if (step.to === 'MERGED') {
        state = authorizeGate(state, { gate: 'merge', role: 'human' }, { capsule: authority });
        expect(state.phase).toBe('HUMAN_MERGE_GATE');
      }
      state = transition(state, step, { capsule: authority });
      expect(validateState(state, { capsule: authority }).phase).toBe(step.to);
    }
    expect(state.builder_status).toBe('CLOSED');
    expect(state.capsule_fingerprint).toBe(fingerprintCapsule(authority));

    const merged = advance(authority, steps.slice(0, 6));
    expect(() => transition(merged, { to: 'GOVERNANCE_CLOSURE', role: 'engineering' }, { capsule: authority })).toThrow(TransitionError);
    const validating = transition(merged, { to: 'POST_MERGE_VALIDATING', role: 'builder' }, { capsule: authority });
    expect(() => transition(validating, { to: 'VALIDATED', role: 'engineering' }, { capsule: authority })).toThrow(/cannot perform/i);
    const validated = transition(validating, { to: 'VALIDATED', role: 'reviewer' }, { capsule: authority });
    expect(() => transition(validated, { to: 'GOVERNANCE_CLOSURE', role: 'reviewer' }, { capsule: authority })).toThrow(/cannot perform/i);
    expect(() => transition(validated, { to: 'GOVERNANCE_CLOSURE', role: 'builder' }, { capsule: authority })).toThrow(/cannot perform/i);
    const closure = transition(validated, { to: 'GOVERNANCE_CLOSURE', role: 'orchestrator' }, { capsule: authority });
    expect(() => transition(closure, { to: 'CLOSED', role: 'engineering' }, { capsule: authority })).toThrow(/cannot perform/i);
    expect(() => transition(closure, { to: 'CLOSED', role: 'reviewer' }, { capsule: authority })).toThrow(/cannot perform/i);
    expect(transition(closure, { to: 'CLOSED', role: 'human' }, { capsule: authority }).phase).toBe('CLOSED');

    const reviewing = atReviewing(authority);
    const blocked = transition(reviewing, { to: 'BLOCKED', role: 'reviewer' }, { capsule: authority });
    expect(validateState(blocked, { capsule: authority }).review_status).toBe('REVIEWING');
    const rejected = transition(reviewing, { to: 'NOT_VERIFIED', role: 'reviewer' }, { capsule: authority });
    const scope = transition(rejected, { to: 'SCOPE_EXPANSION_REQUIRED', role: 'reviewer' }, { capsule: authority });
    expect(validateState(scope, { capsule: authority }).review_status).toBe('NOT_VERIFIED');
    const postMerge = advance(authority, [
      ...steps.slice(0, 6),
      { to: 'POST_MERGE_VALIDATING', role: 'engineering' }
    ]);
    const returned = transition(postMerge, { to: 'NOT_VERIFIED', role: 'reviewer' }, { capsule: authority });
    expect(validateState(returned, { capsule: authority }).merge_authorized).toBe(false);
    const corrected = transition(returned, { to: 'IMPLEMENTING', role: 'engineering' }, { capsule: authority });
    expect(validateState(corrected, { capsule: authority }).attempt).toBe(2);
    const implementing = advance(authority, [{ to: 'IMPLEMENTING', role: 'engineering' }]);
    const blockedFromWork = transition(implementing, { to: 'BLOCKED', role: 'engineering' }, { capsule: authority });
    expect(validateState(blockedFromWork, { capsule: authority }).human_gate).toBe('blocked');
    const scopeFromWork = transition(implementing, { to: 'SCOPE_EXPANSION_REQUIRED', role: 'builder' }, { capsule: authority });
    expect(validateState(scopeFromWork, { capsule: authority }).review_status).toBe('PENDING');
  });

  it('documents reported phase marks, caller overlap, the single writer, and path limits', () => {
    const contract = fs.readFileSync(contractPath, 'utf8');
    expect(contract).toMatch(/`MERGED` means the orchestration record reports that the merge occurred/);
    expect(contract).toMatch(/does not independently prove that Git main contains the candidate/);
    expect(contract).toMatch(/`VALIDATED` means the orchestration record reports validation completion/);
    expect(contract).toMatch(/does not independently prove that tests or the build passed/);
    expect(contract).toMatch(/`CLOSED` means the orchestration lifecycle records closure/);
    expect(contract).toMatch(/not independent evidence of product correctness/);
    expect(contract).toMatch(/only determines collisions within the complete set provided by the caller/);
    expect(contract).toMatch(/does not discover all active tasks/);
    expect(contract).toMatch(/one authoritative state file and one writer at a time/);
    expect(contract).toMatch(/not multi-writer safe/);
    expect(contract).toMatch(/does not provide cross-worktree shared-state transport/);
    expect(contract).toMatch(/Extensionless paths remain exact lexical paths/);
    expect(contract).toMatch(/do not imply directory ownership/);
    expect(contract).toMatch(/does not prove filesystem target identity/);
    expect(contract).toMatch(/Symlinks, junctions, and reparse points/);
    expect(contract).toMatch(/not an absolute deny/);
    expect(contract).toMatch(/forbidden_files` always wins/);
    expect(contract).toMatch(/Protected scope is not human approval/);
    expect(contract).toMatch(/does not prove human identity/);
    expect(contract).toMatch(/Multiple gate approvals may exist during one task/);
    expect(contract).toMatch(/control primitives, not execution/);
    expect(contract).toMatch(/does not deploy/);
    expect(checkActiveOverlap([overlapTask('A04', [auditFile])]).ok).toBe(true);
  });

  it('requires all seven human gates and separates scope from approval', () => {
    expect(HUMAN_GATES).toEqual([
      'scope_expansion',
      'source_of_truth_change',
      'golden_change',
      'governance_change',
      'merge',
      'production',
      'destructive_real_data_action'
    ]);
    const declared = validateCapsule(rawCapsule()).human_gates;
    expect(Object.keys(declared)).toEqual(HUMAN_GATES);
    const baselineFingerprint = fingerprintCapsule(rawCapsule());
    for (const gate of HUMAN_GATES) {
      const flipped = { ...rawCapsule().human_gates, [gate]: false };
      expect(fingerprintCapsule(rawCapsule({ human_gates: flipped }))).not.toBe(baselineFingerprint);
    }
    const missing = { ...rawCapsule().human_gates };
    delete missing.source_of_truth_change;
    expect(() => validateCapsule(rawCapsule({ human_gates: missing }))).toThrow(/source_of_truth_change/);
    expect(() => fingerprintCapsule(rawCapsule({ human_gates: missing }))).toThrow(CapsuleError);
    expect(() => validateCapsule(rawCapsule({
      human_gates: { ...rawCapsule().human_gates, deploy: false }
    }))).toThrow(/Unknown human gate/);
    expect(() => validateCapsule(rawCapsule({
      allowed_files: ['docs/architecture/source_of_truth_registry.md'],
      protected_authorization: ['source_of_truth'],
      human_gates: { ...rawCapsule().human_gates, source_of_truth_change: false }
    }))).toThrow(/source_of_truth_change/);

    const protectedCases = [
      ['docs/architecture/source_of_truth_registry.md', 'source_of_truth', 'source_of_truth_change'],
      ['docs/testing/golden_inputs.json', 'golden', 'golden_change'],
      ['docs/product/ceo_os_master_control_baseline.md', 'governance_handoff', 'governance_change']
    ];
    for (const [file, protectedClass, gate] of protectedCases) {
      const body = rawCapsule({
        allowed_files: [file],
        protected_authorization: [protectedClass]
      });
      const state = createInitialState(body);
      expect(() => checkPaths({ capsule: body, changedFiles: [file], state })).toThrow(/not human approval/i);
      const granted = authorizeGate(state, { gate, role: 'human' }, { capsule: body });
      expect(checkPaths({ capsule: body, changedFiles: [file], state: granted }).ok).toBe(true);
    }

    const authority = capsule();
    const mergeOnly = authorizeGate(createInitialState(authority), { gate: 'merge', role: 'technical_direction' }, { capsule: authority });
    expect(mergeOnly.human_authorizations.merge).toBe(true);
    expect(mergeOnly.human_authorizations.source_of_truth_change).toBe(false);
    const sourceOnly = authorizeGate(createInitialState(authority), { gate: 'source_of_truth_change', role: 'human' }, { capsule: authority });
    expect(sourceOnly.human_authorizations.source_of_truth_change).toBe(true);
    expect(sourceOnly.human_authorizations.merge).toBe(false);
    const both = authorizeGate(mergeOnly, { gate: 'source_of_truth_change', role: 'human' }, { capsule: authority });
    expect(both.human_authorizations.merge).toBe(true);
    expect(both.human_authorizations.source_of_truth_change).toBe(true);
    expect(both.human_authorizations.golden_change).toBe(false);

    let walked = createInitialState(authority);
    walked = transition(walked, {
      to: 'IMPLEMENTING',
      role: 'engineering',
      authorizeGates: ['source_of_truth_change'],
      humanAuthorization: true
    }, { capsule: authority });
    expect(walked.human_authorizations.source_of_truth_change).toBe(false);
    expect(walked.human_authorizations.merge).toBe(false);
    expect(walked.phase).toBe('IMPLEMENTING');

    const production = authorizeGate(createInitialState(authority), { gate: 'production', role: 'human' }, { capsule: authority });
    expect(production.human_authorizations.production).toBe(true);
    expect(production.production_authorized).toBe(false);
    expect(production.phase).toBe('ASSIGNED');
    expect(() => transition(production, {
      to: 'IMPLEMENTING',
      role: 'engineering',
      productionAuthorized: true
    }, { capsule: authority })).toThrow(/Production authorization/);

    const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'ceos-02a-gate-'));
    const sentinel = path.join(temp, 'keep.txt');
    fs.writeFileSync(sentinel, 'unchanged');
    const before = fs.readFileSync(sentinel);
    const destructive = authorizeGate(createInitialState(authority), { gate: 'destructive_real_data_action', role: 'technical_direction' }, { capsule: authority });
    expect(destructive.human_authorizations.destructive_real_data_action).toBe(true);
    expect(destructive.allowed_files).toEqual(createInitialState(authority).allowed_files);
    expect(destructive.capsule_fingerprint).toBe(createInitialState(authority).capsule_fingerprint);
    expect(fs.readFileSync(sentinel).equals(before)).toBe(true);
    expect(fs.readdirSync(temp)).toEqual(['keep.txt']);
    fs.rmSync(temp, { recursive: true, force: true });

    const mergeGate = atMergeGate(authority);
    expect(() => transition(mergeGate, { to: 'MERGED', role: 'human' }, { capsule: authority })).toThrow(/recorded merge authorization/i);
    const mergeGranted = authorizeGate(mergeGate, { gate: 'merge', role: 'human' }, { capsule: authority });
    const merged = transition(mergeGranted, { to: 'MERGED', role: 'human' }, { capsule: authority });
    expect(merged.human_authorizations.merge).toBe(true);
    expect(merged.human_authorizations.source_of_truth_change).toBe(false);
    expect(merged.production_authorized).toBe(false);
    expect(() => transition(mergeGranted, { to: 'MERGED', role: 'reviewer' }, { capsule: authority })).toThrow(/merge role/i);

    const changed = rawCapsule({
      human_gates: { ...rawCapsule().human_gates, governance_change: false }
    });
    const bound = createInitialState(authority);
    expect(fingerprintCapsule(changed)).not.toBe(bound.capsule_fingerprint);
    expect(() => validateState(bound, { capsule: changed })).toThrow(/fingerprint/i);
    expect(() => checkPaths({
      capsule: changed,
      changedFiles: [auditFile],
      state: bound
    })).toThrow(/fingerprint/i);
  });

  it('records human authorization only through authorizeGate and the frozen grantors', () => {
    const authority = capsule();
    const state = createInitialState(authority);
    const deniedRoles = ['builder', 'engineering', 'reviewer', 'orchestrator'];
    const grantors = ['human', 'technical_direction'];
    for (const role of [...deniedRoles, ...grantors]) {
      for (const gate of HUMAN_GATES) {
        if (deniedRoles.includes(role)) {
          expect(() => authorizeGate(state, { gate, role }, { capsule: authority })).toThrow(/cannot represent/);
        } else {
          const granted = authorizeGate(state, { gate, role }, { capsule: authority });
          expect(granted.human_authorizations[gate]).toBe(true);
          expect(granted.phase).toBe(state.phase);
          expect(granted.capsule_fingerprint).toBe(state.capsule_fingerprint);
          expect(granted.allowed_files).toEqual(state.allowed_files);
          expect(granted.production_authorized).toBe(false);
          for (const other of HUMAN_GATES) {
            if (other !== gate) expect(granted.human_authorizations[other]).toBe(false);
          }
        }
      }
    }
    const optional = rawCapsule({
      human_gates: { ...rawCapsule().human_gates, golden_change: false }
    });
    expect(() => authorizeGate(createInitialState(optional), {
      gate: 'golden_change',
      role: 'human'
    }, { capsule: optional })).toThrow(/not required/i);
    const tampered = createInitialState(optional);
    tampered.human_authorizations = { ...tampered.human_authorizations, golden_change: true };
    expect(() => validateState(tampered, { capsule: optional })).toThrow(/does not require/i);

    const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'ceos-02a-auth-'));
    const capsulePath = path.join(temp, 'capsule.json');
    const statePath = path.join(temp, 'STATE.json');
    fs.writeFileSync(capsulePath, JSON.stringify(rawCapsule()));
    expect(runCli(['init', '--capsule', capsulePath, '--out', statePath]).status).toBe(0);
    const before = fs.readFileSync(statePath);
    const denied = runCli([
      'authorize-gate', '--state', statePath, '--capsule', capsulePath,
      '--gate', 'source_of_truth_change', '--role', 'builder'
    ]);
    expect(denied.status).toBe(1);
    expect(fs.readFileSync(statePath).equals(before)).toBe(true);
    const legacy = runCli([
      'transition', '--state', statePath, '--capsule', capsulePath,
      '--to', 'IMPLEMENTING', '--role', 'engineering', '--authorize'
    ]);
    expect(legacy.status).toBe(1);
    expect(fs.readFileSync(statePath).equals(before)).toBe(true);
    expect(runCli([
      'authorize-gate', '--state', statePath, '--capsule', capsulePath,
      '--gate', 'merge', '--role', 'engineering'
    ]).status).toBe(1);
    expect(runCli([
      'authorize-gate', '--state', statePath, '--capsule', capsulePath,
      '--gate', 'source_of_truth_change', '--role', 'human'
    ]).status).toBe(0);
    const granted = JSON.parse(fs.readFileSync(statePath, 'utf8'));
    expect(granted.phase).toBe('ASSIGNED');
    expect(granted.human_authorizations.source_of_truth_change).toBe(true);
    expect(granted.human_authorizations.merge).toBe(false);
    expect(granted.production_authorized).toBe(false);
    expect(fs.readdirSync(temp).some((name) => name.endsWith('.tmp'))).toBe(false);
    const afterGrant = fs.readFileSync(statePath);
    expect(runCli([
      'authorize-gate', '--state', statePath, '--capsule', capsulePath,
      '--gate', 'golden_change', '--role', 'reviewer'
    ]).status).toBe(1);
    expect(fs.readFileSync(statePath).equals(afterGrant)).toBe(true);
    fs.rmSync(temp, { recursive: true, force: true });
  });
});
