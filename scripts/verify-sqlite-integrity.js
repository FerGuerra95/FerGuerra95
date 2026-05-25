/**
 * PRAGMA integrity_check (or quick_check) on a SQLite file. Read-only.
 *
 * Usage:
 *   node scripts/verify-sqlite-integrity.js --db .local/backups/ceos-os-backup-....sqlite
 *   node scripts/verify-sqlite-integrity.js --quick
 */
import fs from 'node:fs';

import { parseArgs, resolveDatabasePath, runIntegrityCheck } from './lib/sqlite-cli.mjs';

function printHelp() {
  console.log(`Usage:
  node scripts/verify-sqlite-integrity.js [--db <path>] [--quick]

Environment:
  DB_PATH / SQLITE_PATH — default database if --db omitted

Options:
  --db <path>   SQLite file to verify
  --quick       Use PRAGMA quick_check instead of integrity_check
  --help        Show this message`);
}

function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help) {
    printHelp();
    process.exit(0);
  }

  const databaseFile = args.db ? resolveDatabasePath(args.db) : resolveDatabasePath();

  if (!fs.existsSync(databaseFile)) {
    console.error(`[verify-sqlite-integrity] File not found: ${databaseFile}`);
    process.exit(1);
  }

  const integrity = runIntegrityCheck(databaseFile, { quick: Boolean(args.quick) });

  console.log(`[verify-sqlite-integrity] db: ${databaseFile}`);
  console.log(`[verify-sqlite-integrity] pragma: ${integrity.pragma}`);
  console.log(
    `[verify-sqlite-integrity] result: ${integrity.ok ? 'ok' : integrity.results.join(', ')}`
  );

  process.exit(integrity.ok ? 0 : 1);
}

main();
