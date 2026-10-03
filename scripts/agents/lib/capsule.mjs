import crypto from 'node:crypto';

import { PROTECTED_CLASSES, uniqueCanonicalFiles } from './ownership.mjs';

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

  return {
    ...capsule,
    baseline: String(capsule.baseline).toLowerCase(),
    human_gates: humanGates,
    allowed_files: uniqueCanonicalFiles(capsule.allowed_files),
    forbidden_files: uniqueCanonicalFiles(capsule.forbidden_files),
    protected_authorization: [...new Set(protectedAuthorization)].sort()
  };
}

export function fingerprintAuthority(authority) {
  const payload = JSON.stringify({
    allowed_files: authority.allowed_files,
    baseline: authority.baseline,
    forbidden_files: authority.forbidden_files,
    human_gates: canonicalHumanGates(authority.human_gates),
    protected_authorization: authority.protected_authorization,
    task: String(authority.task)
  });
  return crypto.createHash('sha256').update(payload).digest('hex');
}

export function fingerprintCapsule(capsule) {
  return fingerprintAuthority(validateCapsule(capsule));
}
