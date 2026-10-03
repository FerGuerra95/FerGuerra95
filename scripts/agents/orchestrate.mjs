#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { validateCapsule } from './lib/capsule.mjs';
import { checkActiveOverlap, checkPaths } from './lib/policy.mjs';
import { authorizeGate, createInitialState, humanGateFor, transition, validateState, writeJsonAtomic } from './lib/stateMachine.mjs';

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, value) {
  writeJsonAtomic(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function arg(name, argv) {
  const index = argv.indexOf(name);
  return index === -1 ? null : argv[index + 1];
}

function flag(name, argv) {
  return argv.includes(name);
}

function requireArg(name, argv) {
  const value = arg(name, argv);
  if (value == null || value === '') {
    const error = new Error(`${name} is required.`);
    error.code = 'MISSING_ARGUMENT';
    throw error;
  }
  return value;
}

export function runOrchestrator(argv = process.argv.slice(2)) {
  const command = argv[0];
  if (!command || command === '--help') {
    return {
      exitCode: 0,
      result: {
        commands: ['validate-capsule', 'validate-state', 'init', 'transition', 'authorize-gate', 'check-paths', 'check-overlap', 'human-gate']
      }
    };
  }
  if (command === 'validate-capsule') {
    const capsule = validateCapsule(readJson(requireArg('--file', argv)));
    return { exitCode: 0, result: { ok: true, task: capsule.task, baseline: capsule.baseline } };
  }
  if (command === 'validate-state') {
    const capsule = validateCapsule(readJson(requireArg('--capsule', argv)));
    const state = validateState(readJson(requireArg('--file', argv)), { capsule });
    return { exitCode: 0, result: { ok: true, task: state.task, phase: state.phase, actor_role: state.actor_role } };
  }
  if (command === 'init') {
    const capsule = validateCapsule(readJson(requireArg('--capsule', argv)));
    const state = createInitialState(capsule);
    const destination = requireArg('--out', argv);
    if (fs.existsSync(destination)) {
      const error = new Error('Refusing to overwrite an existing state file.');
      error.code = 'STATE_EXISTS';
      throw error;
    }
    writeJson(destination, state);
    return { exitCode: 0, result: state };
  }
  if (command === 'authorize-gate') {
    const capsule = validateCapsule(readJson(requireArg('--capsule', argv)));
    const statePath = requireArg('--state', argv);
    const current = validateState(readJson(statePath), { capsule });
    const next = authorizeGate(current, {
      gate: requireArg('--gate', argv),
      role: requireArg('--role', argv)
    }, { capsule });
    writeJson(arg('--out', argv) || statePath, next);
    return {
      exitCode: 0,
      result: { phase: next.phase, gate: requireArg('--gate', argv), human_authorizations: next.human_authorizations }
    };
  }
  if (command === 'transition') {
    if (flag('--authorize', argv) || argv.includes('--authorize-gate')) {
      const error = new Error('Human authorization is recorded only by authorize-gate.');
      error.code = 'AUTHORIZATION_COMMAND';
      throw error;
    }
    const capsule = validateCapsule(readJson(requireArg('--capsule', argv)));
    const statePath = requireArg('--state', argv);
    const current = validateState(readJson(statePath), { capsule });
    const next = transition(current, {
      to: arg('--to', argv),
      role: arg('--role', argv),
      scopeExpansionRequired: flag('--scope-expansion', argv),
      reviewerBlocker: arg('--blocker', argv)
    }, { capsule });
    writeJson(arg('--out', argv) || statePath, next);
    return {
      exitCode: 0,
      result: { phase: next.phase, actor_role: next.actor_role, human_gate: next.human_gate, attempt: next.attempt }
    };
  }
  if (command === 'check-paths') {
    const input = readJson(requireArg('--file', argv));
    return { exitCode: 0, result: checkPaths(input) };
  }
  if (command === 'check-overlap') {
    return { exitCode: 0, result: checkActiveOverlap(readJson(requireArg('--file', argv))) };
  }
  if (command === 'human-gate') {
    return { exitCode: 0, result: { to: arg('--to', argv), human_gate: humanGateFor(arg('--to', argv)) } };
  }
  return { exitCode: 2, result: { error: `Unknown command ${command}` } };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const outcome = runOrchestrator();
    process.stdout.write(`${JSON.stringify(outcome.result)}\n`);
    process.exitCode = outcome.exitCode;
  } catch (error) {
    process.stderr.write(`${error.code || 'ERROR'} ${error.message}\n`);
    process.exitCode = 1;
  }
}
