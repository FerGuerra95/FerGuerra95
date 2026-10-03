import crypto from 'node:crypto';

import { canonicalizeRepoPath, PROTECTED_CLASSES, uniqueCanonicalFiles } from './ownership.mjs';

const REQUIRED_FIELDS = [
  'task',
  'baseline',
  'allowed_files',
  'forbidden_files',
  'human_gates'
];

export const HUMAN_GATES = [
  'scope_expansion',
  'source_of_truth_change',
  'golden_change',
  'governance_change',
  'merge',
  'production',
  'destructive_real_data_action'
];

export const PROTECTED_CLASS_GATES = {
  source_of_truth: 'source_of_truth_change',
  golden: 'golden_change',
  governance_handoff: 'governance_change'
};

export function canonicalHumanGates(gates) {
  if (!gates || typeof gates !== 'object' || Array.isArray(gates)) {
    throw new CapsuleError('HUMAN_GATES_REQUIRED', 'human_gates must declare every required gate.');
  }
  const unknown = Object.keys(gates).filter((key) => !HUMAN_GATES.includes(key));
  if (unknown.length > 0) {
    throw new CapsuleError('HUMAN_GATE_UNKNOWN', `Unknown human gate ${unknown[0]}.`);
  }
  const canonical = {};
  for (const gate of HUMAN_GATES) {
    if (typeof gates[gate] !== 'boolean') {
      throw new CapsuleError(
        'HUMAN_GATES_REQUIRED',
        `Human gate ${gate} must be declared true or false. Missing gates are not authorized.`
      );
    }
    canonical[gate] = gates[gate];
  }
  return canonical;
}

export class CapsuleError extends Error {
  constructor(code, message) {
    super(message);
    this.name = 'CapsuleError';
    this.code = code;
  }
}

export function validateCapsule(capsule) {
  if (!capsule || typeof capsule !== 'object' || Array.isArray(capsule)) {
    throw new CapsuleError('CAPSULE_INVALID', 'Task capsule must be an object.');
  }
  for (const field of REQUIRED_FIELDS) {
    if (capsule[field] === undefined || capsule[field] === null || capsule[field] === '') {
      throw new CapsuleError('CAPSULE_FIELD_MISSING', `Capsule field ${field} is required.`);
    }
  }
  if (!/^[0-9a-f]{7,64}$/i.test(String(capsule.baseline))) {
    throw new CapsuleError('BASELINE_MISSING', 'Capsule baseline must be a commit SHA.');
  }
  for (const field of ['allowed_files', 'forbidden_files']) {
    if (!Array.isArray(capsule[field])) {
      throw new CapsuleError('CAPSULE_LIST', `${field} must be a list.`);
    }
  }
  const humanGates = canonicalHumanGates(capsule.human_gates);
  const protectedAuthorization = capsule.protected_authorization || [];
  if (!Array.isArray(protectedAuthorization)) {
    throw new CapsuleError('CAPSULE_LIST', 'protected_authorization must be a list.');
  }
  for (const protectedClass of protectedAuthorization) {
    if (!PROTECTED_CLASSES.includes(protectedClass)) {
      throw new CapsuleError('PROTECTED_CLASS_UNKNOWN', `Unknown protected class ${protectedClass}.`);
    }
    const requiredGate = PROTECTED_CLASS_GATES[protectedClass];
    if (requiredGate && humanGates[requiredGate] !== true) {
      throw new CapsuleError(
        'HUMAN_GATE_REQUIRED',
        `${protectedClass} scope requires human gate ${requiredGate} to be declared required.`
      );
    }
  }

  const validated = {
    ...capsule,
    baseline: String(capsule.baseline).toLowerCase(),
    human_gates: humanGates,
    allowed_files: uniqueCanonicalFiles(capsule.allowed_files),
    forbidden_files: uniqueCanonicalFiles(capsule.forbidden_files),
    protected_authorization: [...new Set(protectedAuthorization)].sort()
  };
  if (Object.prototype.hasOwnProperty.call(capsule, 'evidence_plan')) {
    validated.evidence_plan = canonicalEvidencePlan(capsule.evidence_plan);
  }
  return validated;
}

const PLAN_KEYS = ['required', 'optional'];
const ENTRY_KEYS = ['id', 'argv', 'timeout_ms'];
const TOKEN_KEYS = ['type', 'value'];
const TOKEN_TYPES = ['exec', 'flag', 'literal', 'candidate_path', 'evidence_output'];
const EVIDENCE_OUTPUT_PLACEHOLDER = '<EVIDENCE_OUTPUT_DIR>';

function exactKeys(value, allowed, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new CapsuleError('EVIDENCE_PLAN_INVALID', `${label} must be an object.`);
  }
  const keys = Object.keys(value);
  const missing = allowed.filter((key) => !Object.prototype.hasOwnProperty.call(value, key));
  const unknown = keys.filter((key) => !allowed.includes(key));
  if (missing.length > 0 || unknown.length > 0) {
    throw new CapsuleError(
      'EVIDENCE_PLAN_INVALID',
      `${label} keys must be exactly ${allowed.join(', ')}.`
    );
  }
}

function canonicalEvidenceOutput(value) {
  if (typeof value !== 'string' || !value.startsWith(EVIDENCE_OUTPUT_PLACEHOLDER)) {
    throw new CapsuleError('EVIDENCE_PLAN_INVALID', 'evidence_output must use <EVIDENCE_OUTPUT_DIR>.');
  }
  const remainder = value.slice(EVIDENCE_OUTPUT_PLACEHOLDER.length);
  if (remainder === '') return value;
  if (!remainder.startsWith('/') || remainder.includes('\\') || remainder.includes('\0')) {
    throw new CapsuleError('EVIDENCE_PLAN_INVALID', 'evidence_output remainder must be a relative file.');
  }
  const parts = remainder.slice(1).split('/');
  if (parts.length === 0 || parts.some((part) => part === '' || part === '.' || part === '..')) {
    throw new CapsuleError('EVIDENCE_PLAN_INVALID', 'evidence_output escapes the run directory.');
  }
  if (parts[parts.length - 1] === 'manifest.json') {
    throw new CapsuleError('EVIDENCE_PLAN_INVALID', 'evidence_output cannot target manifest.json.');
  }
  return value;
}

function canonicalToken(token) {
  exactKeys(token, TOKEN_KEYS, 'Evidence token');
  if (!TOKEN_TYPES.includes(token.type)) {
    throw new CapsuleError('EVIDENCE_PLAN_INVALID', `Unknown evidence token type ${token.type}.`);
  }
  if (typeof token.value !== 'string' || token.value.includes('\0')) {
    throw new CapsuleError('EVIDENCE_PLAN_INVALID', 'Evidence token value must be a string.');
  }
  if (token.type === 'exec' && token.value !== 'node') {
    throw new CapsuleError('EVIDENCE_PLAN_INVALID', 'exec may only represent node.');
  }
  if (token.type === 'candidate_path') {
    try {
      return { type: token.type, value: canonicalizeRepoPath(token.value) };
    } catch (error) {
      throw new CapsuleError('EVIDENCE_PLAN_INVALID', error.message);
    }
  }
  if (token.type === 'evidence_output') {
    return { type: token.type, value: canonicalEvidenceOutput(token.value) };
  }
  return { type: token.type, value: token.value };
}

function canonicalEntry(entry, seen) {
  exactKeys(entry, ENTRY_KEYS, 'Evidence entry');
  if (typeof entry.id !== 'string' || entry.id === '' || entry.id.includes('\0')) {
    throw new CapsuleError('EVIDENCE_PLAN_INVALID', 'Evidence id must be a non-empty string.');
  }
  if (seen.has(entry.id)) {
    throw new CapsuleError('EVIDENCE_PLAN_INVALID', `Duplicate evidence id ${entry.id}.`);
  }
  seen.add(entry.id);
  if (!Array.isArray(entry.argv) || entry.argv.length === 0) {
    throw new CapsuleError('EVIDENCE_PLAN_INVALID', 'Evidence argv must be a non-empty list.');
  }
  const argv = entry.argv.map((token) => canonicalToken(token));
  if (argv[0].type !== 'exec' || argv.filter((token) => token.type === 'exec').length !== 1) {
    throw new CapsuleError('EVIDENCE_PLAN_INVALID', 'Evidence argv must start with exactly one exec token.');
  }
  if (!Number.isInteger(entry.timeout_ms) || entry.timeout_ms <= 0) {
    throw new CapsuleError('EVIDENCE_PLAN_INVALID', 'timeout_ms must be a positive integer.');
  }
  return { id: entry.id, argv, timeout_ms: entry.timeout_ms };
}

export function canonicalEvidencePlan(plan) {
  exactKeys(plan, PLAN_KEYS, 'evidence_plan');
  if (!Array.isArray(plan.required) || !Array.isArray(plan.optional)) {
    throw new CapsuleError('EVIDENCE_PLAN_INVALID', 'evidence_plan lists must be arrays.');
  }
  const seen = new Set();
  return {
    required: plan.required.map((entry) => canonicalEntry(entry, seen)),
    optional: plan.optional.map((entry) => canonicalEntry(entry, seen))
  };
}

export function fingerprintAuthority(authority) {
  const payload = {
    allowed_files: authority.allowed_files,
    baseline: authority.baseline,
    forbidden_files: authority.forbidden_files,
    human_gates: canonicalHumanGates(authority.human_gates),
    protected_authorization: authority.protected_authorization,
    task: String(authority.task)
  };
  if (Object.prototype.hasOwnProperty.call(authority, 'evidence_plan')) {
    payload.evidence_plan = canonicalEvidencePlan(authority.evidence_plan);
  }
  return crypto.createHash('sha256').update(JSON.stringify(payload)).digest('hex');
}

export function fingerprintCapsule(capsule) {
  return fingerprintAuthority(validateCapsule(capsule));
}
