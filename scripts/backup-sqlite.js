/**
 * Safe SQLite backup using better-sqlite3 .backup() (WAL-safe).
 * Does not modify the source database.
 *
 * Usage:
 *   DB_PATH=./backend/data/ceo_os.sqlite BACKUP_DIR=.local/backups node scripts/backup-sqlite.js
 */
import fs from 'node:fs';
import path from 'node:path';

import {
  backupDatabase,
  formatBackupTimestamp,
  resolveBackupDir,
  resolveDatabasePath,
  runIntegrityCheck
} from './lib/sqlite-cli.mjs';

async function main() {
  const sourcePath = resolveDatabasePath();
  const backupDir = resolveBackupDir();
  const fileName = `ceos-os-backup-${formatBackupTimestamp()}.sqlite`;
  const backupPath = path.join(backupDir, fileName);

  if (!fs.existsSync(sourcePath)) {
    console.error(`[backup-sqlite] Source not found: ${sourcePath}`);
    console.error('[backup-sqlite] Set DB_PATH to an existing SQLite file.');
    process.exit(1);
  }

  await backupDatabase(sourcePath, backupPath);

  const integrity = runIntegrityCheck(backupPath);
  const sizeBytes = fs.statSync(backupPath).size;

  console.log('[backup-sqlite] status: ok');
  console.log(`[backup-sqlite] source: ${sourcePath}`);
  console.log(`[backup-sqlite] backup: ${backupPath}`);
  console.log(`[backup-sqlite] size_bytes: ${sizeBytes}`);
  console.log(`[backup-sqlite] integrity_check: ${integrity.ok ? 'ok' : integrity.results.join(', ')}`);
  console.log(`[backup-sqlite] timestamp_utc: ${new Date().toISOString()}`);

  if (!integrity.ok) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(`[backup-sqlite] ${error.message}`);
  process.exit(1);
});
