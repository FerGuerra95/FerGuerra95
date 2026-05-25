/**
 * Restore drill: copy a backup file to a drill target and verify integrity.
 * Never use production live DB paths as --target.
 *
 * Usage:
 *   node scripts/restore-sqlite-drill.js --backup .local/backups/<file>.sqlite --target .local/restore-drill/ceos-os-restore.sqlite
 */
import fs from 'node:fs';

import {
  assertRestoreTargetAllowed,
  copyDatabaseFile,
  parseArgs,
  runIntegrityCheck
} from './lib/sqlite-cli.mjs';

function printHelp() {
  console.log(`Usage:
  node scripts/restore-sqlite-drill.js --backup <backup.sqlite> --target <drill.sqlite>

Notes:
  - Copies backup to target for rehearsal only.
  - Blocks /var/data/ceos-os.sqlite and similar production paths unless ALLOW_PRODUCTION_RESTORE_TARGET=1 (not for normal use).
  - Does not modify the backup file or the live source database.`);
}

function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help) {
    printHelp();
    process.exit(0);
  }

  const backupPath = args.backup;
  const targetPath = args.target;

  if (!backupPath || !targetPath) {
    console.error('[restore-sqlite-drill] --backup and --target are required.');
    printHelp();
    process.exit(1);
  }

  if (!fs.existsSync(backupPath)) {
    console.error(`[restore-sqlite-drill] Backup not found: ${backupPath}`);
    process.exit(1);
  }

  try {
    assertRestoreTargetAllowed(targetPath);
  } catch (error) {
    console.error(`[restore-sqlite-drill] ${error.message}`);
    process.exit(1);
  }

  copyDatabaseFile(backupPath, targetPath);
  const integrity = runIntegrityCheck(targetPath);

  console.log('[restore-sqlite-drill] status: ok');
  console.log(`[restore-sqlite-drill] backup: ${backupPath}`);
  console.log(`[restore-sqlite-drill] target: ${targetPath}`);
  console.log(
    `[restore-sqlite-drill] integrity_check: ${integrity.ok ? 'ok' : integrity.results.join(', ')}`
  );

  process.exit(integrity.ok ? 0 : 1);
}

main();
