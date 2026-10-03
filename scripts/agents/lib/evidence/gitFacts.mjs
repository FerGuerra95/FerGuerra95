import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';

export class EvidenceError extends Error {
  constructor(code, message) {
    super(message);
    this.name = 'EvidenceError';
    this.code = code;
  }
}

export function sha256(text) {
  return crypto.createHash('sha256').update(text).digest('hex');
}

export function sha256Buffer(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

export function git(repo, args, options = {}) {
  const result = spawnSync('git', ['-C', repo, '-c', 'core.quotepath=false', ...args], {
    encoding: options.encoding === 'buffer' ? 'buffer' : 'utf8',
    shell: false,
    windowsHide: true,
    timeout: 20000,
    maxBuffer: 32 * 1024 * 1024
  });
  if (result.error) {
    throw new EvidenceError('GIT_FAILED', result.error.message);
  }
  if (!options.allowFail && result.status !== 0) {
    throw new EvidenceError('GIT_FAILED', String(result.stderr || 'git failed').trim());
  }
  return result;
}

export function snapshotRepository(repo) {
  const head = git(repo, ['rev-parse', 'HEAD']).stdout.trim().toLowerCase();
  const symbolic = git(repo, ['symbolic-ref', '-q', 'HEAD'], { allowFail: true });
  const branch = symbolic.status === 0 ? symbolic.stdout.trim() : 'DETACHED';
  const index = git(repo, ['ls-files', '-s']).stdout;
  const tracked = [
    git(repo, ['diff', '--name-status', 'HEAD']).stdout,
    git(repo, ['diff', '--cached', '--name-status', 'HEAD']).stdout
  ].join('');
  const porcelain = git(repo, ['status', '--porcelain=v1', '--untracked-files=all']).stdout;
  return {
    branch,
    head,
    index_sha256: sha256(index),
    tracked_sha256: sha256(tracked),
    porcelain_sha256: sha256(porcelain),
    porcelain
  };
}

export function sameSnapshot(left, right) {
  return left.branch === right.branch
    && left.head === right.head
    && left.index_sha256 === right.index_sha256
    && left.tracked_sha256 === right.tracked_sha256
    && left.porcelain_sha256 === right.porcelain_sha256;
}

export function trackedWorktreeClean(snapshot) {
  return snapshot.porcelain === '';
}

export function isAncestor(repo, baseline, head) {
  const result = git(repo, ['merge-base', '--is-ancestor', baseline, head], { allowFail: true });
  return result.status === 0;
}

export function changedPaths(repo, baseline, head) {
  const result = git(repo, ['diff', '--name-status', '--find-renames', `${baseline}..${head}`]).stdout;
  const paths = [];
  for (const line of result.split(/\n/).filter(Boolean)) {
    const parts = line.split('\t');
    const status = parts[0] || '';
    if (status.startsWith('R') || status.startsWith('C')) {
      if (parts[1]) paths.push(parts[1]);
      if (parts[2]) paths.push(parts[2]);
      continue;
    }
    if (parts[1]) paths.push(parts[1]);
  }
  return paths;
}

export function worktreeMatchesHead(repo, relativePath) {
  const present = git(repo, ['cat-file', '-e', `HEAD:${relativePath}`], { allowFail: true });
  if (present.status !== 0) return false;
  const unstaged = git(repo, ['diff', '--quiet', 'HEAD', '--', relativePath], { allowFail: true });
  const staged = git(repo, ['diff', '--cached', '--quiet', 'HEAD', '--', relativePath], { allowFail: true });
  return unstaged.status === 0 && staged.status === 0;
}

export function blobId(repo, spec) {
  const result = git(repo, ['rev-parse', spec], { allowFail: true });
  if (result.status !== 0) return null;
  return result.stdout.trim().toLowerCase();
}

export function hashObject(repo, absolutePath) {
  const result = git(repo, ['hash-object', '--no-filters', '--', absolutePath], { allowFail: true });
  if (result.status !== 0) return null;
  return result.stdout.trim().toLowerCase();
}

export function parsePorcelain(porcelain) {
  return porcelain.split(/\n/).filter(Boolean).map((line) => {
    const xy = line.slice(0, 2);
    let file = line.slice(3).replace(/\\/g, '/');
    if (file.includes(' -> ')) file = file.split(' -> ').pop();
    return { xy, file };
  });
}
