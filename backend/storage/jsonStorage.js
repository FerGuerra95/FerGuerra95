import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'node:crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../data');

const writeLocks = new Map();

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

function createStorageError(message, status = 500, code = 'STORAGE_ERROR') {
  const error = new Error(message);
  error.status = status;
  error.code = code;
  return error;
}

function sanitizeCollectionName(collection) {
  const safeCollection = String(collection || '').replace(/[^a-zA-Z0-9_-]/g, '');

  if (!safeCollection) {
    throw createStorageError(
      'Nombre de colección inválido.',
      500,
      'INVALID_COLLECTION_NAME'
    );
  }

  return safeCollection;
}

function getFilePath(collection) {
  const safeCollection = sanitizeCollectionName(collection);
  return path.join(DATA_DIR, `${safeCollection}.json`);
}

function ensureArray(value, fallback = []) {
  return Array.isArray(value) ? value : fallback;
}

async function readJsonFile(filePath, fallback = []) {
  try {
    const raw = await fs.readFile(filePath, 'utf8');

    if (!raw.trim()) {
      return fallback;
    }

    const parsed = JSON.parse(raw);

    return ensureArray(parsed, fallback);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return null;
    }

    if (error instanceof SyntaxError) {
      throw createStorageError(
        `JSON inválido en ${path.basename(filePath)}.`,
        500,
        'INVALID_JSON_FILE'
      );
    }

    throw error;
  }
}

async function atomicWriteJson(filePath, value) {
  const tempFilePath = `${filePath}.${process.pid}.${Date.now()}.tmp`;
  const payload = JSON.stringify(value, null, 2);

  await fs.writeFile(tempFilePath, payload, 'utf8');
  await fs.rename(tempFilePath, filePath);
}

async function withWriteLock(collection, action) {
  const safeCollection = sanitizeCollectionName(collection);
  const previous = writeLocks.get(safeCollection) || Promise.resolve();

  const next = previous
    .catch(() => null)
    .then(action)
    .finally(() => {
      if (writeLocks.get(safeCollection) === next) {
        writeLocks.delete(safeCollection);
      }
    });

  writeLocks.set(safeCollection, next);

  return next;
}

export async function readCollection(collection, fallback = []) {
  await ensureDataDir();

  const filePath = getFilePath(collection);
  const safeFallback = ensureArray(fallback, []);

  const items = await readJsonFile(filePath, safeFallback);

  if (items === null) {
    await writeCollection(collection, safeFallback);
    return safeFallback;
  }

  return ensureArray(items, safeFallback);
}

export async function writeCollection(collection, items = []) {
  await ensureDataDir();

  const filePath = getFilePath(collection);
  const safeItems = ensureArray(items, []);

  return withWriteLock(collection, async () => {
    await atomicWriteJson(filePath, safeItems);
    return safeItems;
  });
}

export function createId(prefix = 'item') {
  const safePrefix = String(prefix || 'item').replace(/[^a-zA-Z0-9_-]/g, '') || 'item';

  if (crypto.randomUUID) {
    return `${safePrefix}_${crypto.randomUUID()}`;
  }

  return `${safePrefix}_${Date.now()}_${Math.random().toString(16).slice(2, 10)}`;
}

export function getDataDir() {
  return DATA_DIR;
}