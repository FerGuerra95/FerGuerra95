import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { getDatabase } from './sqliteStorage.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DEFAULT_MIGRATIONS_DIR = path.join(__dirname, 'migrations');

function normalizeMigrationId(fileName) {
  return path.basename(fileName, '.sql').trim();
}

function getMigrationName(id) {
  return id.replace(/^\d+_?/, '').replace(/_/g, ' ') || id;
}

function ensureMigrationTable(database) {
  database.exec(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      applied_at TEXT NOT NULL
    );
  `);
}

function listMigrationFiles(migrationsDir) {
  if (!fs.existsSync(migrationsDir)) return [];

  return fs
    .readdirSync(migrationsDir)
    .filter((fileName) => fileName.endsWith('.sql'))
    .sort((left, right) => left.localeCompare(right));
}

function getAppliedMigrationIds(database) {
  const rows = database.prepare('SELECT id FROM schema_migrations').all();
  return new Set(rows.map((row) => row.id));
}

export function runSchemaMigrations({
  migrationsDir = DEFAULT_MIGRATIONS_DIR
} = {}) {
  const database = getDatabase();

  ensureMigrationTable(database);

  const migrationFiles = listMigrationFiles(migrationsDir);
  const appliedMigrationIds = getAppliedMigrationIds(database);

  const runPending = database.transaction(() => {
    migrationFiles.forEach((fileName) => {
      const id = normalizeMigrationId(fileName);

      if (!id || appliedMigrationIds.has(id)) return;

      const sql = fs.readFileSync(path.join(migrationsDir, fileName), 'utf8');

      if (sql.trim()) {
        database.exec(sql);
      }

      database
        .prepare(
          `
            INSERT INTO schema_migrations (id, name, applied_at)
            VALUES (@id, @name, datetime('now'))
          `
        )
        .run({
          id,
          name: getMigrationName(id)
        });

      appliedMigrationIds.add(id);
    });
  });

  runPending();
}

export default runSchemaMigrations;
