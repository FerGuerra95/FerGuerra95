export class PathError extends Error {
  constructor(code, message) {
    super(message);
    this.name = 'PathError';
    this.code = code;
  }
}

export const PROTECTED_CLASSES = [
  'source_of_truth',
  'governance_handoff',
  'golden',
  'secrets',
  'production_config',
  'migrations',
  'security_contract'
];

/**
 * One lexical repository path. No filesystem lookup.
 * Comparison form is lowercase so Windows ownership and security checks
 * treat spelling variants as the same file.
 */
export function canonicalizeRepoPath(value) {
  const original = String(value ?? '');
  if (original.includes('\0')) {
    throw new PathError('PATH_INVALID', 'Repository path contains a null byte.');
  }

  const text = original.replace(/\\/g, '/').trim();
  if (!text) {
    throw new PathError('PATH_EMPTY', 'Repository path is empty.');
  }
  if (text.startsWith('//')) {
    throw new PathError('PATH_UNC', 'UNC paths are not repository paths.');
  }
  if (/^[a-zA-Z]:/.test(text) || text.includes(':')) {
    throw new PathError('PATH_ABSOLUTE', 'Drive-qualified paths are not repository paths.');
  }
  if (text.startsWith('/')) {
    throw new PathError('PATH_ABSOLUTE', 'Absolute paths are not repository paths.');
  }

  const directoryMarked = text.endsWith('/');
  const collapsed = text.replace(/\/+/g, '/').replace(/\/+$/, '');
  const parts = [];
  for (const part of collapsed.split('/')) {
    if (part === '' || part === '.') continue;
    if (part === '..') {
      if (parts.length === 0) {
        throw new PathError('PATH_TRAVERSAL', 'Path escapes the repository root.');
      }
      parts.pop();
      continue;
    }
    parts.push(part);
  }

  if (parts.length === 0 || directoryMarked) {
    throw new PathError(
      'PATH_DIRECTORY',
      'Directory grants are not valid. ALLOWED_FILES entries must be exact files.'
    );
  }

  return parts.join('/').toLowerCase();
}

export function uniqueCanonicalFiles(files) {
  if (!Array.isArray(files)) {
    throw new PathError('PATH_LIST', 'Path list must be an array.');
  }
  return [...new Set(files.map((filePath) => canonicalizeRepoPath(filePath)))].sort();
}

export function sameCanonicalList(left, right) {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

const PROTECTED_RULES = [
  {
    class: 'source_of_truth',
    test: (filePath) => filePath === 'docs/architecture/source_of_truth_registry.md'
  },
  {
    class: 'governance_handoff',
    test: (filePath) => filePath === 'docs/product/ceo_os_master_control_baseline.md'
  },
  {
    class: 'golden',
    test: (filePath) => filePath.includes('golden') && filePath.endsWith('.json')
  },
  {
    class: 'secrets',
    test: (filePath) => /(^|\/)\.env($|\.)/.test(filePath)
  },
  {
    class: 'production_config',
    test: (filePath) => /(^|\/)render\.yaml$/.test(filePath)
  },
  {
    class: 'migrations',
    test: (filePath) => filePath.includes('backend/storage/migrations/')
  },
  {
    class: 'security_contract',
    test: (filePath) => filePath.startsWith('docs/security/')
  }
];

export function classifyProtected(filePath) {
  const canonical = canonicalizeRepoPath(filePath);
  return PROTECTED_RULES.filter((rule) => rule.test(canonical)).map((rule) => rule.class);
}

export function findUnauthorizedFiles(changedFiles, allowedFiles) {
  const allowed = new Set(uniqueCanonicalFiles(allowedFiles));
  return uniqueCanonicalFiles(changedFiles).filter((filePath) => !allowed.has(filePath));
}

export function findProtectedViolations(changedFiles, protectedAuthorization = []) {
  const granted = new Set(protectedAuthorization || []);
  const violations = [];
  for (const filePath of uniqueCanonicalFiles(changedFiles)) {
    for (const protectedClass of classifyProtected(filePath)) {
      if (!granted.has(protectedClass)) {
        violations.push({ file: filePath, class: protectedClass });
      }
    }
  }
  return violations;
}

export function findOwnershipOverlaps(tasks) {
  const active = (tasks || []).filter((task) => task && task.phase !== 'CLOSED');
  const overlaps = [];
  for (let index = 0; index < active.length; index += 1) {
    for (let other = index + 1; other < active.length; other += 1) {
      const left = active[index];
      const right = active[other];
      const leftFiles = new Set(left.files || []);
      const shared = (right.files || []).filter((filePath) => leftFiles.has(filePath));
      if (shared.length === 0) continue;
      const leftAllows = (left.parallel || []).includes(right.task);
      const rightAllows = (right.parallel || []).includes(left.task);
      if (leftAllows && rightAllows) continue;
      overlaps.push({ tasks: [left.task, right.task], files: shared, action: 'SERIALIZE' });
    }
  }
  return overlaps;
}
