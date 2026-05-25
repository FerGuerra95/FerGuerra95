/**
 * Operational password reset for an existing SQLite user (production Render shell).
 *
 * Bootstrap env vars only seed missing users; changing BOOTSTRAP_ADMIN_PASSWORD
 * does not update passwords for users that already exist.
 *
 * Required env (set in shell — never commit or log values):
 *   DB_PATH=/var/data/ceos-os.sqlite
 *   CEOS_RESET_EMAIL=<user email>
 *   CEOS_RESET_PASSWORD=<new password>
 *   CONFIRM_PASSWORD_RESET=yes
 *
 * Also requires NODE_ENV=production OR CONFIRM_PASSWORD_RESET=yes.
 *
 * Usage (Render Shell — do not paste password into logs):
 *   export DB_PATH=/var/data/ceos-os.sqlite
 *   export CEOS_RESET_EMAIL="the-test-user-email"
 *   export CEOS_RESET_PASSWORD="new-password-not-printed"
 *   export CONFIRM_PASSWORD_RESET=yes
 *   node scripts/ops/reset-user-password.js
 *
 * After run: login with new password; confirm old password fails; attest rotation
 * without revealing the password (see docs/security/CREDENTIAL_HYGIENE.md).
 */
import fs from 'node:fs';
import path from 'node:path';

import { resetUserPasswordByEmailForOps } from '../../backend/services/auth/auth.service.js';
import { initializeDatabaseSchema } from '../../backend/storage/databaseSchema.js';
import {
  closeDatabase,
  getDatabaseFilePath
} from '../../backend/storage/sqliteStorage.js';
import { resolveDatabasePath } from '../lib/sqlite-cli.mjs';

const PRODUCTION_DB_PATTERN = /[/\\]var[/\\]data[/\\]ceos-os\.sqlite$/i;

function envFlagYes(name) {
  const value = String(process.env[name] || '')
    .trim()
    .toLowerCase();
  return value === 'yes' || value === '1' || value === 'true';
}

function isProductionDatabasePath(databasePath) {
  const normalized = path.normalize(databasePath).replace(/\\/g, '/');
  return PRODUCTION_DB_PATTERN.test(normalized);
}

function assertSafeToRun(databasePath) {
  const confirm = envFlagYes('CONFIRM_PASSWORD_RESET');
  const isProduction = process.env.NODE_ENV === 'production';

  if (!confirm && !isProduction) {
    throw new Error(
      'Requires NODE_ENV=production or CONFIRM_PASSWORD_RESET=yes.'
    );
  }

  if (isProductionDatabasePath(databasePath) && !isProduction) {
    throw new Error(
      'Refusing production DB_PATH outside NODE_ENV=production. Run from Render shell.'
    );
  }
}

function readRequiredEnv(name) {
  const value = String(process.env[name] || '').trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function printSafeStatus({ userFound, passwordUpdated, code }) {
  console.log(`user found: ${userFound ? 'yes' : 'no'}`);
  console.log(`password updated: ${passwordUpdated ? 'yes' : 'no'}`);
  if (code) {
    console.log(`result code: ${code}`);
  }
  console.log(`timestamp: ${new Date().toISOString()}`);
}

async function main() {
  const databasePath = resolveDatabasePath();
  assertSafeToRun(databasePath);

  if (process.env.NODE_ENV === 'production' && !String(process.env.DB_PATH || '').trim()) {
    throw new Error('DB_PATH is required in production.');
  }

  const email = readRequiredEnv('CEOS_RESET_EMAIL');
  const password = readRequiredEnv('CEOS_RESET_PASSWORD');

  if (!fs.existsSync(databasePath)) {
    throw new Error(`Database file not found: ${databasePath}`);
  }

  closeDatabase();
  initializeDatabaseSchema();

  const result = await resetUserPasswordByEmailForOps(email, password);

  printSafeStatus(result);

  const resolvedPath = getDatabaseFilePath();
  console.log(`database: ${resolvedPath}`);

  closeDatabase();

  if (!result.passwordUpdated) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(`[reset-user-password] ${error.message}`);
  process.exit(1);
});
