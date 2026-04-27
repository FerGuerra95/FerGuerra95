import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.resolve(__dirname, '../data');
const DATABASE_FILE = path.join(DATA_DIR, 'ceo_os.sqlite');

let db = null;

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, {
      recursive: true
    });
  }
}

export function getDatabase() {
  if (db) return db;

  ensureDataDir();

  db = new Database(DATABASE_FILE);

  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  return db;
}

export function closeDatabase() {
  if (!db) return;

  db.close();
  db = null;
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

export function transaction(callback) {
  const database = getDatabase();
  const wrapped = database.transaction(callback);

  return wrapped();
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