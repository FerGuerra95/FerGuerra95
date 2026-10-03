import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { expect, it } from 'vitest';

import { fingerprintCapsule, validateCapsule } from '../../../scripts/agents/lib/capsule.mjs';
import { stableStringify } from '../../../scripts/agents/lib/evidence/bundle.mjs';
import { AUTHORITY_FILES } from '../../../scripts/agents/lib/evidence/trust.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const GATES = {
  scope_expansion: false,
  source_of_truth_change: false,
  golden_change: false,
  governance_change: false,
  merge: true,
  production: false,
  destructive_real_data_action: false
};

function test(name, fn) {
  it(name, fn, 90000);
}

function git(repo, args, allowFail = false) {
  const result = spawnSync('git', ['-C', repo, ...args], { encoding: 'utf8', shell: false });
  if (!allowFail && result.status !== 0) {
    throw new Error(result.stderr || result.stdout || 'git failed');
  }
  return result;
}

function commitAll(repo, message) {
  git(repo, ['add', '-A']);
  git(repo, ['-c', 'user.email=evidence@example.invalid', '-c', 'user.name=Evidence', '-c', 'commit.gpgsign=false', 'commit', '-m', message]);
}

function copyAuthority(control) {
  for (const relativePath of [...AUTHORITY_FILES, '.gitignore']) {
    const source = path.join(repoRoot, relativePath);
    const target = path.join(control, relativePath);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.copyFileSync(source, target);
  }
  fs.writeFileSync(path.join(control, 'notes.txt'), 'base\n');
  fs.writeFileSync(path.join(control, '.env.example'), '# example\n');
}

function entry(id, code, output = 'out.txt', extra = [], timeout = 15000) {
  return {
    id,
    timeout_ms: timeout,
    argv: [
      { type: 'exec', value: 'node' },
      { type: 'flag', value: '-e' },
      { type: 'literal', value: code },
      { type: 'evidence_output', value: `<EVIDENCE_OUTPUT_DIR>/${output}` },
      ...extra
    ]
  };
}

function capsuleFor(baseline, plan, allowed = ['notes.txt']) {
  return {
    task: 'T02B',
    baseline,
    allowed_files: allowed,
    forbidden_files: [],
    protected_authorization: [],
    human_gates: GATES,
    evidence_plan: plan
  };
}

function makeWorld(options = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ceos-02b-'));
  const control = path.join(dir, 'control');
  const candidate = path.join(dir, 'candidate');
  fs.mkdirSync(control);
  copyAuthority(control);
  git(control, ['init', '-b', 'main']);
  commitAll(control, 'baseline');
  const baseline = git(control, ['rev-parse', 'HEAD']).stdout.trim();
  const cloned = spawnSync('git', ['clone', control, candidate], { encoding: 'utf8', shell: false });
  if (cloned.status !== 0) throw new Error(cloned.stderr || 'clone failed');
  if (options.mutateCandidate) options.mutateCandidate(candidate);
  fs.appendFileSync(path.join(candidate, 'notes.txt'), 'candidate\n');
  commitAll(candidate, 'candidate');
  const context = { dir, control, candidate, baseline };
  const plan = (typeof options.plan === 'function' ? options.plan(context) : options.plan)
    || { required: [entry('run', "require('fs').writeFileSync(process.argv[1], 'ok')")], optional: [] };
  const capsule = capsuleFor(baseline, plan, options.allowed);
  const capsulePath = path.join(dir, 'capsule.json');
  fs.writeFileSync(capsulePath, JSON.stringify(capsule));
  if (options.after) options.after({ dir, control, candidate, baseline, capsule, capsulePath });
  return {
    dir,
    control,
    candidate,
    baseline,
    capsule,
    capsulePath,
    cleanup() {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  };
}

function runCli(world, args = [], cwd = world.candidate) {
  return spawnSync(process.execPath, [
    path.join(world.control, 'scripts/agents/evidence.mjs'),
    ...args
  ], { encoding: 'utf8', shell: false, cwd, timeout: 25000 });
}

function run(world, extra = []) {
  return runCli(world, ['run', '--candidate-worktree', world.candidate, '--capsule', world.capsulePath, ...extra]);
}

function parsed(result) {
  const line = String(result.stdout || '').trim().split(/\n/).filter(Boolean).pop();
  return JSON.parse(line);
}

function legacyFingerprint(authority) {
  return crypto.createHash('sha256').update(JSON.stringify({
    allowed_files: authority.allowed_files,
    baseline: authority.baseline,
    forbidden_files: authority.forbidden_files,
    human_gates: authority.human_gates,
    protected_authorization: authority.protected_authorization,
    task: authority.task
  })).digest('hex');
}

test('an existing capsule without evidence_plan keeps its fingerprint', () => {
  const raw = {
    task: 'A-MULTI-02A',
    baseline: '0adf5a3b56d324cc2d2f6985455868e4d233bec0',
    allowed_files: ['scripts/agents/lib/capsule.mjs'],
    forbidden_files: [],
    protected_authorization: [],
    human_gates: GATES
  };
  const validated = validateCapsule(raw);
  expect(Object.prototype.hasOwnProperty.call(validated, 'evidence_plan')).toBe(false);
  expect(fingerprintCapsule(raw)).toBe(legacyFingerprint(validated));
});

test('evidence_plan field changes move the fingerprint and unknown or duplicate plans fail', () => {
  const baseline = '0adf5a3b56d324cc2d2f6985455868e4d233bec0';
  const command = entry('alpha', 'process.exit(0)');
  const original = capsuleFor(baseline, { required: [command], optional: [] });
  const without = { ...original };
  delete without.evidence_plan;
  expect(fingerprintCapsule(original)).not.toBe(fingerprintCapsule(without));
  const argv = [...command.argv];
  const swappedArgv = [argv[0], argv[2], argv[1], ...argv.slice(3)];
  const reordered = capsuleFor(baseline, { required: [{ ...command, argv: swappedArgv }], optional: [] });
  expect(fingerprintCapsule(reordered)).not.toBe(fingerprintCapsule(original));
  const swapped = capsuleFor(baseline, { required: [], optional: [command] });
  expect(fingerprintCapsule(swapped)).not.toBe(fingerprintCapsule(original));
  const retimed = capsuleFor(baseline, { required: [{ ...command, timeout_ms: 10 }], optional: [] });
  expect(fingerprintCapsule(retimed)).not.toBe(fingerprintCapsule(original));
  const revalued = capsuleFor(baseline, {
    required: [{ ...command, argv: command.argv.map((token) => token.type === 'literal' ? { ...token, value: 'other' } : token) }],
    optional: []
  });
  expect(fingerprintCapsule(revalued)).not.toBe(fingerprintCapsule(original));
  expect(() => validateCapsule(capsuleFor(baseline, { required: [], optional: [], extra: true }))).toThrow(/exactly/i);
  expect(() => validateCapsule(capsuleFor(baseline, {
    required: [{ ...command, cwd: '.' }],
    optional: []
  }))).toThrow(/exactly/i);
  expect(() => validateCapsule(capsuleFor(baseline, {
    required: [{ ...command, argv: [...command.argv, { type: 'shell', value: 'cmd' }] }],
    optional: []
  }))).toThrow(/token type/i);
  expect(() => validateCapsule(capsuleFor(baseline, {
    required: [command, { ...command, id: 'alpha' }],
    optional: []
  }))).toThrow(/duplicate/i);
  expect(() => validateCapsule(capsuleFor(baseline, {
    required: [command],
    optional: [{ ...command }]
  }))).toThrow(/duplicate/i);
});

test('control and candidate identity failures stop before commands', () => {
  const world = makeWorld({
    plan: { required: [entry('run', "require('fs').writeFileSync('ran.txt','1'); require('fs').writeFileSync(process.argv[1],'ok')")], optional: [] }
  });
  try {
    expect(parsed(runCli(world, ['run', '--candidate-worktree', world.control, '--capsule', world.capsulePath])).code).toBe('ROOT_IDENTITY');
    const wrong = { ...world.capsule, baseline: 'a'.repeat(40) };
    const wrongPath = path.join(world.dir, 'wrong.json');
    fs.writeFileSync(wrongPath, JSON.stringify(wrong));
    expect(parsed(runCli(world, ['run', '--candidate-worktree', world.candidate, '--capsule', wrongPath])).code).toBe('CONTROL_BASELINE');
    fs.appendFileSync(path.join(world.control, 'notes.txt'), 'dirty\n');
    expect(parsed(run(world)).code).toBe('CONTROL_DIRTY');
    expect(fs.existsSync(path.join(world.candidate, 'ran.txt'))).toBe(false);
  } finally {
    world.cleanup();
  }
});

test('a candidate that does not descend from the baseline is rejected', () => {
  const world = makeWorld();
  const other = path.join(world.dir, 'other');
  try {
    fs.mkdirSync(other);
    git(other, ['init', '-b', 'main']);
    fs.writeFileSync(path.join(other, 'notes.txt'), 'other\n');
    commitAll(other, 'other');
    const result = parsed(runCli(world, ['run', '--candidate-worktree', other, '--capsule', world.capsulePath]));
    expect(result.overall_status).toBe('INVALID');
    expect(result.code).toBe('CANDIDATE_ANCESTRY');
  } finally {
    world.cleanup();
  }
});

test('baseline checkPaths rejects an unauthorized candidate path before commands', () => {
  const world = makeWorld({
    mutateCandidate(candidate) {
      fs.writeFileSync(path.join(candidate, 'stolen.txt'), 'no\n');
    },
    plan: { required: [entry('run', "require('fs').writeFileSync('ran.txt','1'); require('fs').writeFileSync(process.argv[1],'ok')")], optional: [] }
  });
  try {
    const result = parsed(run(world));
    expect(result.overall_status).toBe('INVALID');
    expect(result.code).toBe('UNAUTHORIZED_FILE');
    expect(fs.existsSync(path.join(world.candidate, 'ran.txt'))).toBe(false);
  } finally {
    world.cleanup();
  }
});

test('candidate copies of authority files do not control the verdict', () => {
  const cases = [
    ['scripts/agents/evidence.mjs', "process.stdout.write('PASS')\n"],
    ['scripts/agents/lib/policy.mjs', 'export function checkPaths(){ return { ok: true }; }\n'],
    ['scripts/agents/lib/capsule.mjs', 'export function validateCapsule(){ return {}; }\n'],
    ['scripts/agents/lib/guards.json', '{"verifiedRoles":["engineering"]}\n']
  ];
  for (const [relativePath, contents] of cases) {
    const world = makeWorld({
      allowed: ['notes.txt', relativePath],
      mutateCandidate(candidate) {
        fs.writeFileSync(path.join(candidate, relativePath), contents);
        fs.writeFileSync(path.join(candidate, 'stolen.txt'), 'no\n');
      },
      plan: { required: [entry('run', "require('fs').writeFileSync('ran.txt','1'); require('fs').writeFileSync(process.argv[1],'ok')")], optional: [] }
    });
    try {
      const result = parsed(run(world));
      expect(result.code).toBe('UNAUTHORIZED_FILE');
      expect(fs.existsSync(path.join(world.candidate, 'ran.txt'))).toBe(false);
    } finally {
      world.cleanup();
    }
  }
});

test('exact untracked orchestration state is recorded and mismatches or extra state fail', () => {
  const world = makeWorld();
  try {
    const fingerprint = fingerprintCapsule(world.capsule);
    const taskDir = path.join(world.candidate, '.agents', 'tasks', 'T02B');
    fs.mkdirSync(taskDir, { recursive: true });
    fs.writeFileSync(path.join(taskDir, 'capsule.json'), JSON.stringify(world.capsule));
    const statePath = path.join(taskDir, 'STATE.json');
    const state = { capsule_fingerprint: fingerprint, human_authorizations: { ...GATES, merge: true }, phase: 'ASSIGNED' };
    fs.writeFileSync(statePath, JSON.stringify(state));
    const before = fs.readFileSync(statePath);
    const result = parsed(run(world));
    expect(result.overall_status).toBe('PASS');
    const manifest = JSON.parse(fs.readFileSync(result.manifest, 'utf8'));
    expect(manifest.orchestration_state.present).toBe(true);
    expect(manifest.orchestration_state.human_authorizations_fact.merge).toBe(true);
    expect(fs.readFileSync(statePath).equals(before)).toBe(true);
    world.cleanup();
  } catch (error) {
    world.cleanup();
    throw error;
  }

  const extra = makeWorld({
    after(ctx) {
      const taskDir = path.join(ctx.candidate, '.agents', 'tasks', 'T02B');
      fs.mkdirSync(taskDir, { recursive: true });
      fs.writeFileSync(path.join(taskDir, 'capsule.json'), JSON.stringify(ctx.capsule));
      fs.writeFileSync(path.join(taskDir, 'STATE.json'), JSON.stringify({ capsule_fingerprint: fingerprintCapsule(ctx.capsule) }));
      fs.writeFileSync(path.join(taskDir, 'NOTES.md'), 'extra\n');
    }
  });
  try {
    expect(parsed(run(extra)).code).toBe('TASK_STATE_UNEXPECTED');
  } finally {
    extra.cleanup();
  }

  const mismatch = makeWorld({
    after(ctx) {
      const taskDir = path.join(ctx.candidate, '.agents', 'tasks', 'T02B');
      fs.mkdirSync(taskDir, { recursive: true });
      const widened = { ...ctx.capsule, allowed_files: ['notes.txt', 'stolen.txt'] };
      fs.writeFileSync(path.join(taskDir, 'capsule.json'), JSON.stringify(widened));
      fs.writeFileSync(path.join(taskDir, 'STATE.json'), JSON.stringify({ capsule_fingerprint: 'a'.repeat(64) }));
    }
  });
  try {
    expect(parsed(run(mismatch)).code).toBe('TASK_STATE_FINGERPRINT');
  } finally {
    mismatch.cleanup();
  }
});

test('staged or committed task state is rejected', () => {
  const staged = makeWorld({
    after(ctx) {
      const taskDir = path.join(ctx.candidate, '.agents', 'tasks', 'T02B');
      fs.mkdirSync(taskDir, { recursive: true });
      fs.writeFileSync(path.join(taskDir, 'capsule.json'), JSON.stringify(ctx.capsule));
      fs.writeFileSync(path.join(taskDir, 'STATE.json'), JSON.stringify({ capsule_fingerprint: fingerprintCapsule(ctx.capsule) }));
      git(ctx.candidate, ['add', '.agents/tasks']);
    }
  });
  try {
    expect(parsed(run(staged)).overall_status).toBe('INVALID');
  } finally {
    staged.cleanup();
  }

  const committed = makeWorld({
    mutateCandidate(candidate) {
      const taskDir = path.join(candidate, '.agents', 'tasks', 'T02B');
      fs.mkdirSync(taskDir, { recursive: true });
      fs.writeFileSync(path.join(taskDir, 'capsule.json'), '{"task":"T02B"}\n');
      fs.writeFileSync(path.join(taskDir, 'STATE.json'), '{}\n');
    }
  });
  try {
    expect(parsed(run(committed)).code).toBe('TASK_STATE_COMMITTED');
  } finally {
    committed.cleanup();
  }
});

test('dirty, staged, and unexpected candidate files are rejected', () => {
  const dirty = makeWorld({
    after(ctx) {
      fs.appendFileSync(path.join(ctx.candidate, 'notes.txt'), 'dirty\n');
    }
  });
  try {
    expect(parsed(run(dirty)).code).toBe('CANDIDATE_DIRTY');
  } finally {
    dirty.cleanup();
  }

  const staged = makeWorld({
    after(ctx) {
      fs.appendFileSync(path.join(ctx.candidate, 'notes.txt'), 'staged\n');
      git(ctx.candidate, ['add', 'notes.txt']);
    }
  });
  try {
    expect(parsed(run(staged)).code).toBe('CANDIDATE_DIRTY');
  } finally {
    staged.cleanup();
  }

  const untracked = makeWorld({
    after(ctx) {
      fs.writeFileSync(path.join(ctx.candidate, 'extra.txt'), 'x\n');
    }
  });
  try {
    expect(parsed(run(untracked)).code).toBe('CANDIDATE_DIRTY');
  } finally {
    untracked.cleanup();
  }
});

test('known exclusions are recorded only while they stay untracked', () => {
  const recorded = makeWorld({
    after(ctx) {
      fs.writeFileSync(path.join(ctx.candidate, 'backend-server.err'), 'noise\n');
    }
  });
  try {
    const result = parsed(run(recorded));
    expect(result.overall_status).toBe('PASS');
    const manifest = JSON.parse(fs.readFileSync(result.manifest, 'utf8'));
    expect(manifest.known_exclusions).toContain('backend-server.err');
    expect(manifest.candidate_paths.join('\n')).not.toContain('backend-server.err');
  } finally {
    recorded.cleanup();
  }

  const staged = makeWorld({
    after(ctx) {
      fs.writeFileSync(path.join(ctx.candidate, 'backend-server.err'), 'noise\n');
      git(ctx.candidate, ['add', '-f', 'backend-server.err']);
    }
  });
  try {
    expect(parsed(run(staged)).code).toBe('KNOWN_EXCLUSION');
  } finally {
    staged.cleanup();
  }

  const committed = makeWorld({
    allowed: ['notes.txt', 'backend-server.err'],
    mutateCandidate(candidate) {
      fs.writeFileSync(path.join(candidate, 'backend-server.err'), 'noise\n');
    }
  });
  try {
    expect(parsed(run(committed)).code).toBe('KNOWN_EXCLUSION');
  } finally {
    committed.cleanup();
  }
});

test('runtime env files fail closed and .env.example does not', () => {
  const env = makeWorld({
    after(ctx) {
      fs.writeFileSync(path.join(ctx.candidate, '.env'), 'AUTH_SECRET=not-for-evidence\n');
    }
  });
  try {
    const result = parsed(run(env));
    expect(result.code).toBe('RUNTIME_ENV');
    expect(result.message || '').not.toContain('not-for-evidence');
    expect(JSON.stringify(result)).not.toContain('not-for-evidence');
  } finally {
    env.cleanup();
  }

  const example = makeWorld();
  try {
    expect(fs.readFileSync(path.join(example.candidate, '.env.example'), 'utf8')).toContain('example');
    expect(parsed(run(example)).overall_status).toBe('PASS');
  } finally {
    example.cleanup();
  }
});

test('path tokens, literals, and command results follow the frozen plan', () => {
  expect(() => validateCapsule(capsuleFor('a'.repeat(40), {
    required: [entry('bad', 'process.exit(0)', 'out.txt', [{ type: 'candidate_path', value: '../outside.txt' }])],
    optional: []
  }))).toThrow(/escapes|repository/i);
  expect(() => validateCapsule(capsuleFor('a'.repeat(40), {
    required: [entry('bad', 'process.exit(0)', '../../out.txt')],
    optional: []
  }))).toThrow(/escapes/i);

  const opaque = makeWorld({
    plan: {
      required: [entry('literal', "require('fs').writeFileSync(process.argv[1], process.argv[2])", 'out.txt', [
        { type: 'literal', value: '$NOT_EXPANDED' }
      ])],
      optional: []
    }
  });
  try {
    const result = parsed(run(opaque));
    expect(result.overall_status).toBe('PASS');
    const manifest = JSON.parse(fs.readFileSync(result.manifest, 'utf8'));
    const artifact = path.join(path.dirname(result.manifest), manifest.commands[0].artifacts[0].path);
    expect(fs.readFileSync(artifact, 'utf8')).toBe('$NOT_EXPANDED');
  } finally {
    opaque.cleanup();
  }

  const failed = makeWorld({
    plan: {
      required: [
        entry('tests', "require('fs').writeFileSync(process.argv[1], JSON.stringify({success:true,numPassedTests:9})); process.exit(1)", 'vitest.json', [
          { type: 'flag', value: '--reporter=json' }
        ]),
        entry('later', "require('fs').writeFileSync('second.txt','1'); require('fs').writeFileSync(process.argv[1],'ok')", 'later.txt')
      ],
      optional: []
    }
  });
  try {
    const result = parsed(run(failed));
    expect(result.overall_status).not.toBe('PASS');
    const manifest = JSON.parse(fs.readFileSync(result.manifest, 'utf8'));
    expect(manifest.commands[0].status).toBe('FAIL');
    expect(manifest.commands[1].status).toBe('NOT_RUN');
    expect(fs.existsSync(path.join(failed.candidate, 'second.txt'))).toBe(false);
  } finally {
    failed.cleanup();
  }
});

test('timeout and repository or control mutations cannot pass', () => {
  const timed = makeWorld({
    plan: {
      required: [
        entry('sleep', 'setInterval(() => {}, 10000)', 'out.txt', [], 500),
        entry('later', "require('fs').writeFileSync('second.txt','1')", 'later.txt')
      ],
      optional: []
    }
  });
  try {
    const result = parsed(run(timed));
    expect(result.overall_status).not.toBe('PASS');
    expect(fs.existsSync(path.join(timed.candidate, 'second.txt'))).toBe(false);
  } finally {
    timed.cleanup();
  }

  const cases = [
    (candidate) => `require('fs').appendFileSync('notes.txt','mutated\\n'); require('fs').writeFileSync(process.argv[1],'ok')`,
    () => "require('child_process').execFileSync('git',['add','notes.txt']); require('fs').appendFileSync('notes.txt','commit\\n'); require('child_process').execFileSync('git',['add','notes.txt']); require('child_process').execFileSync('git',['-c','user.email=evidence@example.invalid','-c','user.name=Evidence','-c','commit.gpgsign=false','commit','-m','during']); require('fs').writeFileSync(process.argv[1],'ok')",
    () => "require('child_process').execFileSync('git',['checkout','-b','sneaky']); require('fs').writeFileSync(process.argv[1],'ok')"
  ];
  for (const code of cases) {
    const world = makeWorld({ plan: { required: [entry('mutate', code())], optional: [] } });
    try {
      expect(parsed(run(world)).overall_status).toBe('INVALID');
    } finally {
      world.cleanup();
    }
  }

  const targeted = [
    (ctx) => entry('edit', `require('fs').appendFileSync(${JSON.stringify(path.join(ctx.control, 'scripts/agents/evidence.mjs'))}, '\\n// tamper\\n'); require('fs').writeFileSync(process.argv[1],'ok')`),
    (ctx) => entry('stage', `require('fs').appendFileSync(${JSON.stringify(path.join(ctx.control, 'notes.txt'))}, 'staged\\n'); require('child_process').execFileSync('git',['-C',${JSON.stringify(ctx.control)},'add','notes.txt']); require('fs').writeFileSync(process.argv[1],'ok')`),
    (ctx) => entry('branch', `require('child_process').execFileSync('git',['-C',${JSON.stringify(ctx.control)},'checkout','-b','hijack']); require('fs').writeFileSync(process.argv[1],'ok')`),
    (ctx) => entry('capsule', `require('fs').appendFileSync(${JSON.stringify(path.join(ctx.dir, 'capsule.json'))}, '\\n'); require('fs').writeFileSync(process.argv[1],'ok')`)
  ];
  for (const builder of targeted) {
    const world = makeWorld({
      plan: (ctx) => ({ required: [builder(ctx)], optional: [] })
    });
    try {
      expect(parsed(run(world)).overall_status).toBe('INVALID');
    } finally {
      world.cleanup();
    }
  }
});

test('a repeated evidence output cannot produce a passing run', () => {
  const baseline = 'a'.repeat(40);
  const owned = entry('one', "require('fs').writeFileSync(process.argv[1],'a')", 'same.txt');
  const again = entry('two', "require('fs').writeFileSync(process.argv[1],'b')", 'same.txt');
  const mixedCase = entry('three', "require('fs').writeFileSync(process.argv[1],'c')", 'Same.txt');
  expect(() => validateCapsule(capsuleFor(baseline, { required: [owned, again], optional: [] }))).toThrow(/duplicate evidence output/i);
  expect(() => validateCapsule(capsuleFor(baseline, { required: [owned], optional: [mixedCase] }))).toThrow(/duplicate evidence output/i);
  expect(() => validateCapsule(capsuleFor(baseline, {
    required: [entry('dir', "require('fs').writeFileSync(process.argv[1],'a')", 'Dir/same.txt')],
    optional: [entry('dir2', "require('fs').writeFileSync(process.argv[1],'b')", 'dir/Same.txt')]
  }))).toThrow(/duplicate evidence output/i);

  const world = makeWorld({
    plan: {
      required: [
        entry('one', "require('fs').writeFileSync('ran.txt','1'); require('fs').writeFileSync(process.argv[1],'a')", 'same.txt'),
        entry('two', "require('fs').writeFileSync(process.argv[1],'b')", 'same.txt')
      ],
      optional: []
    }
  });
  try {
    const result = parsed(run(world));
    expect(result.overall_status).not.toBe('PASS');
    expect(result.overall_status).toBe('INVALID');
    expect(fs.existsSync(path.join(world.candidate, 'ran.txt'))).toBe(false);
  } finally {
    world.cleanup();
  }
});

test('artifact sealing and bundle validation reject tampering', () => {
  const manifestWriter = makeWorld({
    plan: {
      required: [entry('manifest', "require('fs').writeFileSync(require('path').join(require('path').dirname(process.argv[1]), 'manifest.json'), '{}'); require('fs').writeFileSync(process.argv[1],'ok')")],
      optional: []
    }
  });
  try {
    expect(parsed(run(manifestWriter)).overall_status).toBe('INVALID');
  } finally {
    manifestWriter.cleanup();
  }

  const extra = makeWorld({
    plan: {
      required: [entry('extra', "require('fs').writeFileSync(require('path').join(require('path').dirname(process.argv[1]), 'extra.txt'), 'x'); require('fs').writeFileSync(process.argv[1],'ok')")],
      optional: []
    }
  });
  try {
    expect(parsed(run(extra)).overall_status).toBe('INVALID');
  } finally {
    extra.cleanup();
  }

  const reseal = makeWorld({
    plan: {
      required: [
        entry('first', "require('fs').writeFileSync(process.argv[1],'one')", 'first.txt'),
        entry('second', "require('fs').writeFileSync(require('path').join(require('path').dirname(process.argv[1]), 'first.txt'), 'changed'); require('fs').writeFileSync(process.argv[1],'two')", 'second.txt')
      ],
      optional: []
    }
  });
  try {
    expect(parsed(run(reseal)).overall_status).toBe('INVALID');
  } finally {
    reseal.cleanup();
  }

  const sound = makeWorld({
    plan: {
      required: [
        entry('first', "require('fs').writeFileSync(process.argv[1],'one')", 'first.txt'),
        entry('second', "require('fs').writeFileSync(process.argv[1],'two')", 'second.txt')
      ],
      optional: []
    }
  });
  try {
    const result = parsed(run(sound));
    expect(result.overall_status).toBe('PASS');
    const manifestPath = result.manifest;
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    for (const artifact of manifest.artifact_digests) {
      const absolute = path.join(path.dirname(manifestPath), artifact.path);
      const digest = crypto.createHash('sha256').update(fs.readFileSync(absolute)).digest('hex');
      expect(digest).toBe(artifact.sha256);
    }
    const reused = parsed(run(sound));
    expect(reused.code).toBe('CANDIDATE_REUSE');

    const original = fs.readFileSync(manifestPath, 'utf8');
    const edited = original.replace('"PASS"', '"FAIL"');
    fs.writeFileSync(manifestPath, edited);
    const validate = runCli(sound, ['validate', '--bundle', path.dirname(manifestPath), '--capsule', sound.capsulePath]);
    expect(validate.status).not.toBe(0);
    expect(parsed(validate).code).toBe('BUNDLE_HASH');
    fs.writeFileSync(manifestPath, original);

    const body = JSON.parse(original);
    delete body.task;
    delete body.bundle_sha256;
    body.bundle_sha256 = crypto.createHash('sha256').update(stableStringify(body)).digest('hex');
    fs.writeFileSync(manifestPath, `${stableStringify(body)}\n`);
    const incomplete = runCli(sound, ['validate', '--bundle', path.dirname(manifestPath), '--capsule', sound.capsulePath]);
    expect(parsed(incomplete).code).toBe('MANIFEST_INCOMPLETE');
    fs.writeFileSync(manifestPath, original);

    fs.rmSync(path.join(path.dirname(manifestPath), 'first.txt'));
    const missing = runCli(sound, ['validate', '--bundle', path.dirname(manifestPath), '--capsule', sound.capsulePath]);
    expect(parsed(missing).code).toBe('ARTIFACT_MISSING');
    fs.writeFileSync(manifestPath, original);
    fs.writeFileSync(path.join(path.dirname(manifestPath), 'first.txt'), 'one');

    const other = { ...sound.capsule, task: 'OTHER' };
    const otherPath = path.join(sound.dir, 'other-capsule.json');
    fs.writeFileSync(otherPath, JSON.stringify(other));
    const mismatch = runCli(sound, ['validate', '--bundle', path.dirname(manifestPath), '--capsule', otherPath]);
    expect(parsed(mismatch).code).toBe('CAPSULE_MISMATCH');
    const wrongTip = runCli(sound, ['validate', '--bundle', path.dirname(manifestPath), '--capsule', sound.capsulePath, '--expect-candidate', 'b'.repeat(40)]);
    expect(parsed(wrongTip).code).toBe('CANDIDATE_MISMATCH');
  } finally {
    sound.cleanup();
  }
});

test('a run does not call human gates or transition', () => {
  const sources = [
    'scripts/agents/evidence.mjs',
    ...AUTHORITY_FILES.filter((relativePath) => relativePath.startsWith('scripts/agents/lib/evidence/'))
  ];
  for (const relativePath of sources) {
    const source = fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
    expect(source).not.toMatch(/authorizeGate/);
    expect(source).not.toMatch(/authorize-gate/);
    expect(source).not.toMatch(/\btransition\s*\(/);
  }
});
