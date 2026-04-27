import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEFAULT_DATA_DIR = path.resolve(__dirname, '../data');
const DEFAULT_DATABASE_FILE = path.join(DEFAULT_DATA_DIR, 'ceo_os.sqlite');

let db = null;
let activeDatabaseFile = null;

function isProduction() {
  return process.env.NODE_ENV === 'production';
}

function getConfiguredDatabasePath() {
  return (
    process.env.DB_PATH ||
    process.env.SQLITE_PATH ||
    process.env.SQLITE_DB_PATH ||
    ''
  );
}

function resolveDatabaseFile() {
  const configuredPath = getConfiguredDatabasePath();

  if (!configuredPath.trim()) {
    if (isProduction()) {
      throw new Error(
        'DB_PATH es obligatorio en producción para evitar que SQLite use una ruta no persistente.'
      );
    }

    return DEFAULT_DATABASE_FILE;
  }

  if (path.isAbsolute(configuredPath)) {
    return configuredPath;
  }

  return path.resolve(process.cwd(), configuredPath);
}

function ensureDatabaseDir(databaseFile) {
  const databaseDir = path.dirname(databaseFile);

  if (!fs.existsSync(databaseDir)) {
    fs.mkdirSync(databaseDir, {
      recursive: true
    });
  }
}

function configureDatabase(database) {
  database.pragma('journal_mode = WAL');
  database.pragma('foreign_keys = ON');
  database.pragma('busy_timeout = 5000');
  database.pragma('synchronous = NORMAL');
}

export function getDatabaseFilePath() {
  return activeDatabaseFile || resolveDatabaseFile();
}

export function getDatabase() {
  if (db) return db;

  const databaseFile = resolveDatabaseFile();

  ensureDatabaseDir(databaseFile);

  db = new Database(databaseFile);
  activeDatabaseFile = databaseFile;

  configureDatabase(db);

  return db;
}

export function closeDatabase() {
  if (!db) return;

  db.close();
  db = null;
  activeDatabaseFile = null;
}

export function execSql(sql) {
  const database = getDatabase();
  database.exec(sql);
}

export function runSql(sql, params = {}) {
  const database = getDatabase();
  return database.prepare(sql).run(params);
}

export function getSql(sql, params = {}) {
  const database = getDatabase();
  return database.prepare(sql).get(params) || null;
}

export function allSql(sql, params = {}) {
  const database = getDatabase();
  return database.prepare(sql).all(params);
}

export function transaction(callback, ...args) {
  const database = getDatabase();
  const wrapped = database.transaction(callback);

  return wrapped(...args);
}

export function createSqliteId(prefix = 'item') {
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`;
}

export function now() {
  return new Date().toISOString();
}

export function toJson(value, fallback = null) {
  try {
    return JSON.stringify(value ?? fallback);
  } catch {
    return JSON.stringify(fallback);
  }
}

export function fromJson(value, fallback = null) {
  if (value === null || value === undefined || value === '') {
    return fallback;
  }

  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

export function booleanToInteger(value) {
  return value ? 1 : 0;
}

export function integerToBoolean(value) {
  return Number(value) === 1;
}