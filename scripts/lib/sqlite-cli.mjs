import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import Database from 'better-sqlite3';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '../..');

const DEFAULT_LOCAL_DB = path.join(REPO_ROOT, 'backend', 'data', 'ceo_os.sqlite');
const DEFAULT_BACKUP_DIR = path.join(REPO_ROOT, '.local', 'backups');

const BLOCKED_RESTORE_TARGET_PATTERNS = [
  /[/\\]var[/\\]data[/\\]ceos-os\.sqlite$/i,
  /[/\\]var[/\\]data[/\\]ceos\.sqlite$/i,
  /[/\\]var[/\\]data[/\\]ceo_os\.sqlite$/i
];

export function repoRoot() {
  return REPO_ROOT;
}

export function resolveDatabasePath(explicitPath = '') {
  const configured = String(
    explicitPath ||
      process.env.DB_PATH ||
      process.env.SQLITE_PATH ||
      process.env.SQLITE_DB_PATH ||
      ''
  ).trim();

  if (!configured) {
    return DEFAULT_LOCAL_DB;
  }

  return path.isAbsolute(configured)
    ? configured
    : path.resolve(REPO_ROOT, configured);
}

export function resolveBackupDir(explicitDir = '') {
  const configured = String(explicitDir || process.env.BACKUP_DIR || DEFAULT_BACKUP_DIR).trim();
  return path.isAbsolute(configured)
    ? configured
    : path.resolve(REPO_ROOT, configured);
}

export function formatBackupTimestamp(date = new Date()) {
  const pad = (n) => String(n).padStart(2, '0');
  return [
    date.getUTCFullYear(),
    pad(date.getUTCMonth() + 1),
    pad(date.getUTCDate()),
    pad(date.getUTCHours()),
    pad(date.getUTCMinutes()),
    pad(date.getUTCSeconds())
  ].join('');
}

export function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

export function parseArgs(argv) {
  const args = { _: [] };

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === '--help' || token === '-h') {
      args.help = true;
      continue;
    }
    if (token.startsWith('--')) {
      const key = token.slice(2);
      const next = argv[i + 1];
      if (next && !next.startsWith('--')) {
        args[key] = next;
        i += 1;
      } else {
        args[key] = true;
      }
      continue;
    }
    args._.push(token);
  }

  return args;
}

export function runIntegrityCheck(databaseFile, { quick = false } = {}) {
  const db = new Database(databaseFile, { readonly: true, fileMustExist: true });
  try {
    const pragma = quick ? 'quick_check' : 'integrity_check';
    const rows = db.pragma(pragma);
    const results = rows.map((row) => Object.values(row)[0]);
    const ok = results.length === 1 && results[0] === 'ok';
    return { ok, results, pragma };
  } finally {
    db.close();
  }
}

export function assertRestoreTargetAllowed(targetPath) {
  const normalized = path.normalize(targetPath).replace(/\\/g, '/');
  const blocked = BLOCKED_RESTORE_TARGET_PATTERNS.some((pattern) =>
    pattern.test(normalized)
  );

  if (blocked && process.env.ALLOW_PRODUCTION_RESTORE_TARGET !== '1') {
    throw new Error(
      `Restore target blocked (production path): ${normalized}. Use a drill path under .local/restore-drill/.`
    );
  }
}

export async function backupDatabase(sourcePath, destinationPath) {
  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Source database not found: ${sourcePath}`);
  }

  ensureDir(path.dirname(destinationPath));

  const source = new Database(sourcePath, { readonly: true, fileMustExist: true });
  try {
    await source.backup(destinationPath);
  } finally {
    source.close();
  }

  return destinationPath;
}

export function copyDatabaseFile(sourcePath, targetPath) {
  assertRestoreTargetAllowed(targetPath);
  ensureDir(path.dirname(targetPath));
  fs.copyFileSync(sourcePath, targetPath);
  return targetPath;
}
