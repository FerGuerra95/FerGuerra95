import crypto from 'node:crypto';
import fs from 'node:fs';
import net from 'node:net';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const currentFile = fileURLToPath(import.meta.url);
const currentDir = path.dirname(currentFile);

export const PROJECT_ROOT = path.resolve(currentDir, '../..');
export const CANONICAL_DATABASE_PATH = path.join(
  PROJECT_ROOT,
  'backend',
  'data',
  'ceo_os.sqlite'
);
export const CANONICAL_VDR_ROOT = path.join(
  PROJECT_ROOT,
  'backend',
  'data',
  'ma_vdr'
);

const CANONICAL_RUNTIME_PORT = '4000';
export const RESERVED_E2E_PORTS = Object.freeze([4000, 5173, 5174]);

function comparablePath(value) {
  const resolved = path.resolve(String(value || ''));
  return process.platform === 'win32' ? resolved.toLowerCase() : resolved;
}

function isWithin(parent, candidate) {
  const parentPath = comparablePath(parent);
  const candidatePath = comparablePath(candidate);
  const relative = path.relative(parentPath, candidatePath);

  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
}

function sha256(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function snapshotFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return { exists: false };
  }

  const stat = fs.lstatSync(filePath);
  if (!stat.isFile()) {
    return {
      exists: true,
      type: stat.isDirectory() ? 'directory' : 'other'
    };
  }

  const contents = fs.readFileSync(filePath);
  return {
    exists: true,
    type: 'file',
    size: stat.size,
    sha256: sha256(contents)
  };
}

function snapshotDirectory(root) {
  if (!fs.existsSync(root)) {
    return {
      exists: false,
      entries: [],
      sha256: sha256('[]')
    };
  }

  const entries = [];

  function visit(directory) {
    const names = fs.readdirSync(directory).sort((left, right) =>
      left.localeCompare(right)
    );

    for (const name of names) {
      const absolutePath = path.join(directory, name);
      const relativePath = path.relative(root, absolutePath).split(path.sep).join('/');
      const stat = fs.lstatSync(absolutePath);

      if (stat.isDirectory()) {
        entries.push({ path: relativePath, type: 'directory' });
        visit(absolutePath);
      } else if (stat.isFile()) {
        entries.push({
          path: relativePath,
          type: 'file',
          size: stat.size,
          sha256: sha256(fs.readFileSync(absolutePath))
        });
      } else {
        entries.push({ path: relativePath, type: 'other' });
      }
    }
  }

  visit(root);
  return {
    exists: true,
    entries,
    sha256: sha256(JSON.stringify(entries))
  };
}

function safeSegment(value, fallback) {
  const normalized = String(value || fallback)
    .trim()
    .replace(/[^a-zA-Z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);

  return normalized || fallback;
}

function required(value, label) {
  const normalized = String(value || '').trim();
  if (!normalized) {
    throw new Error(`[test-isolation] ${label} is required.`);
  }
  return normalized;
}

function assertAbsolutePath(value, label) {
  const normalized = required(value, label);
  if (!path.isAbsolute(normalized)) {
    throw new Error(`[test-isolation] ${label} must be an absolute path.`);
  }
  return path.resolve(normalized);
}

function parseHttpUrl(value, label) {
  let url;
  try {
    url = new URL(required(value, label));
  } catch {
    throw new Error(`[test-isolation] ${label} must be a valid HTTP URL.`);
  }

  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new Error(`[test-isolation] ${label} must use HTTP or HTTPS.`);
  }
  return url;
}

function isLoopback(hostname) {
  return ['127.0.0.1', 'localhost', '::1', '[::1]'].includes(
    String(hostname || '').toLowerCase()
  );
}

export function resolveWorkerId(env = process.env) {
  return safeSegment(
    env.VITEST_POOL_ID ||
      env.VITEST_WORKER_ID ||
      env.TEST_WORKER_INDEX ||
      env.PLAYWRIGHT_WORKER_INDEX ||
      'main',
    'main'
  );
}

export function createIsolatedTestEnvironment({
  label = 'test',
  workerId = resolveWorkerId(),
  baseDir = os.tmpdir(),
  runId = crypto.randomUUID()
} = {}) {
  const safeLabel = safeSegment(label, 'test');
  const safeWorker = safeSegment(workerId, 'main');
  const safeRunId = safeSegment(runId, crypto.randomUUID());
  const prefix = path.join(
    path.resolve(baseDir),
    `ceos-${safeLabel}-${process.pid}-${safeWorker}-${safeRunId}-`
  );
  const root = fs.mkdtempSync(prefix);
  const databaseDir = path.join(root, 'database');
  const vdrRoot = path.join(root, 'ma_vdr');
  const databasePath = path.join(databaseDir, 'ceo_os.test.sqlite');

  fs.mkdirSync(databaseDir, { recursive: true });
  fs.mkdirSync(vdrRoot, { recursive: true });

  const environment = {
    CEOS_TEST_ISOLATION: '1',
    CEOS_TEST_RUN_ID: safeRunId,
    CEOS_TEST_ROOT: root,
    DB_PATH: databasePath,
    MA_VDR_STORAGE_DIR: vdrRoot,
    NODE_ENV: 'test',
    AUTH_SECRET: 'ceos-test-isolation-secret-0123456789abcdef'
  };

  assertIsolatedTestEnvironment(environment);

  return {
    label: safeLabel,
    workerId: safeWorker,
    runId: safeRunId,
    root,
    databasePath,
    vdrRoot,
    environment
  };
}

export function applyTestEnvironment(environment, target = process.env) {
  for (const [key, value] of Object.entries(environment || {})) {
    target[key] = String(value);
  }
  return target;
}

export function assertIsolatedTestEnvironment(env = process.env) {
  if (env.CEOS_TEST_ISOLATION !== '1') {
    throw new Error(
      '[test-isolation] CEOS_TEST_ISOLATION=1 is required before test state can be created.'
    );
  }

  required(env.CEOS_TEST_RUN_ID, 'CEOS_TEST_RUN_ID');
  const root = assertAbsolutePath(env.CEOS_TEST_ROOT, 'CEOS_TEST_ROOT');
  const databasePath = assertAbsolutePath(env.DB_PATH, 'DB_PATH');
  const vdrRoot = assertAbsolutePath(
    env.MA_VDR_STORAGE_DIR || env.VDR_STORAGE_DIR,
    'MA_VDR_STORAGE_DIR'
  );

  if (isWithin(PROJECT_ROOT, root)) {
    throw new Error('[test-isolation] CEOS_TEST_ROOT must be outside the project root.');
  }
  if (!isWithin(root, databasePath)) {
    throw new Error('[test-isolation] DB_PATH must be inside CEOS_TEST_ROOT.');
  }
  if (!isWithin(root, vdrRoot)) {
    throw new Error('[test-isolation] MA_VDR_STORAGE_DIR must be inside CEOS_TEST_ROOT.');
  }
  if (
    comparablePath(databasePath) === comparablePath(CANONICAL_DATABASE_PATH) ||
    isWithin(path.dirname(CANONICAL_DATABASE_PATH), databasePath)
  ) {
    throw new Error('[test-isolation] Canonical/runtime database paths are forbidden.');
  }
  if (
    comparablePath(vdrRoot) === comparablePath(CANONICAL_VDR_ROOT) ||
    isWithin(path.dirname(CANONICAL_VDR_ROOT), vdrRoot)
  ) {
    throw new Error('[test-isolation] Canonical/runtime VDR paths are forbidden.');
  }

  return {
    root,
    databasePath,
    vdrRoot,
    runId: String(env.CEOS_TEST_RUN_ID)
  };
}

export function captureCanonicalRuntimeState() {
  const database = Object.fromEntries(
    ['', '-wal', '-shm'].map((suffix) => [
      suffix || 'database',
      snapshotFile(`${CANONICAL_DATABASE_PATH}${suffix}`)
    ])
  );
  const vdr = snapshotDirectory(CANONICAL_VDR_ROOT);

  return {
    database,
    vdr,
    sha256: sha256(JSON.stringify({ database, vdr }))
  };
}

export function assertCanonicalRuntimeStateUnchanged(before, after) {
  if (!before || !after) {
    throw new Error(
      '[test-isolation] Canonical runtime state snapshots are required.'
    );
  }

  const databaseUnchanged =
    JSON.stringify(before.database) === JSON.stringify(after.database);
  const vdrUnchanged = JSON.stringify(before.vdr) === JSON.stringify(after.vdr);

  if (!databaseUnchanged || !vdrUnchanged) {
    const changed = [
      databaseUnchanged ? null : 'DB/WAL/SHM',
      vdrUnchanged ? null : 'VDR'
    ].filter(Boolean);
    throw new Error(
      `[test-isolation] Canonical runtime state changed during isolated tests: ${changed.join(', ')}.`
    );
  }

  return {
    databaseUnchanged,
    vdrUnchanged,
    beforeSha256: before.sha256,
    afterSha256: after.sha256
  };
}

function quoteSqlIdentifier(value) {
  return `"${String(value).replaceAll('"', '""')}"`;
}

export async function collectIsolatedFixtureManifest(env = process.env) {
  const isolated = assertIsolatedTestEnvironment(env);
  const vdr = snapshotDirectory(isolated.vdrRoot);
  const tables = [];

  if (fs.existsSync(isolated.databasePath)) {
    const { default: Database } = await import('better-sqlite3');
    const database = new Database(isolated.databasePath, {
      readonly: true,
      fileMustExist: true
    });

    try {
      const tableNames = database
        .prepare(
          "SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY name"
        )
        .all()
        .map((row) => String(row.name));

      for (const tableName of tableNames) {
        const quotedTable = quoteSqlIdentifier(tableName);
        const columns = database
          .prepare(`PRAGMA table_info(${quotedTable})`)
          .all()
          .map((column) => String(column.name));

        if (!columns.includes('id')) continue;

        const ownerColumn = columns.includes('organization_id')
          ? 'organization_id'
          : columns.includes('organizationId')
            ? 'organizationId'
            : null;
        const quotedOwner = ownerColumn
          ? quoteSqlIdentifier(ownerColumn)
          : null;
        const rows = database
          .prepare(
            ownerColumn
              ? `SELECT id, ${quotedOwner} AS organizationId FROM ${quotedTable} ORDER BY id`
              : `SELECT id, NULL AS organizationId FROM ${quotedTable} ORDER BY id`
          )
          .all();
        const identities = rows.map((row) => ({
          id: String(row.id ?? ''),
          organizationId:
            row.organizationId === null || row.organizationId === undefined
              ? null
              : String(row.organizationId)
        }));
        const organizations = [
          ...new Set(
            identities
              .map((row) => row.organizationId)
              .filter((value) => value !== null)
          )
        ].sort();

        tables.push({
          table: tableName,
          records: identities.length,
          ownerColumn,
          organizations: organizations.length,
          missingOwnerRecords: ownerColumn
            ? identities.filter((row) => !row.organizationId).length
            : null,
          identitySha256: sha256(JSON.stringify(identities))
        });
      }
    } finally {
      database.close();
    }
  }

  const trackedRecords = tables.reduce(
    (total, table) => total + table.records,
    0
  );
  const manifest = {
    runId: isolated.runId,
    trackedRecords,
    tables,
    vdrFiles: vdr.entries.filter((entry) => entry.type === 'file').length,
    vdrSha256: vdr.sha256
  };

  return {
    ...manifest,
    manifestSha256: sha256(JSON.stringify(manifest))
  };
}

export function resolveIsolatedApiBaseUrl(env = process.env) {
  const raw = String(env.CEOS_API_BASE_URL || '').trim();
  if (!raw) {
    throw new Error(
      '[test-isolation] CEOS_API_BASE_URL is required. Mutation-capable E2E must not default to Vite 5173 or canonical port 4000.'
    );
  }

  const apiUrl = parseHttpUrl(raw, 'CEOS_API_BASE_URL');
  if (isLoopback(apiUrl.hostname) && apiUrl.port === CANONICAL_RUNTIME_PORT) {
    throw new Error(
      `[test-isolation] CEOS_API_BASE_URL cannot target the canonical runtime on port ${CANONICAL_RUNTIME_PORT}.`
    );
  }

  return apiUrl.toString().replace(/\/$/, '');
}

export function assertSafeE2eTarget({
  baseUrl,
  apiBaseUrl,
  env = process.env
} = {}) {
  const isolated = assertIsolatedTestEnvironment(env);
  const appUrl = parseHttpUrl(baseUrl || env.CEOS_BASE_URL, 'CEOS_BASE_URL');
  const apiUrl = parseHttpUrl(
    apiBaseUrl || env.CEOS_API_BASE_URL,
    'CEOS_API_BASE_URL'
  );

  for (const [label, url] of [
    ['CEOS_BASE_URL', appUrl],
    ['CEOS_API_BASE_URL', apiUrl]
  ]) {
    if (isLoopback(url.hostname) && url.port === CANONICAL_RUNTIME_PORT) {
      throw new Error(
        `[test-isolation] ${label} cannot target the canonical runtime on port ${CANONICAL_RUNTIME_PORT}.`
      );
    }
  }

  if (env.CEOS_E2E_TARGET_ISOLATED !== '1') {
    throw new Error('[test-isolation] CEOS_E2E_TARGET_ISOLATED=1 is required.');
  }
  if (String(env.CEOS_E2E_TARGET_RUN_ID || '') !== isolated.runId) {
    throw new Error(
      '[test-isolation] CEOS_E2E_TARGET_RUN_ID must match CEOS_TEST_RUN_ID.'
    );
  }

  const externalTarget = !isLoopback(appUrl.hostname) || !isLoopback(apiUrl.hostname);
  if (externalTarget) {
    throw new Error(
      '[test-isolation] External mutation targets are blocked. Matching environment identifiers are not verifiable proof of remote database or VDR isolation.'
    );
  }

  return {
    ...isolated,
    appUrl: appUrl.toString().replace(/\/$/, ''),
    apiUrl: apiUrl.toString().replace(/\/$/, ''),
    externalTarget
  };
}

export function cleanupIsolatedTestEnvironment(environmentOrContext) {
  const source = environmentOrContext?.environment || environmentOrContext || {};
  const isolated = assertIsolatedTestEnvironment(source);
  const suffixes = ['', '-wal', '-shm'];

  for (const suffix of suffixes) {
    fs.rmSync(`${isolated.databasePath}${suffix}`, { force: true });
  }
  fs.rmSync(isolated.vdrRoot, { recursive: true, force: true });
  fs.rmSync(isolated.root, { recursive: true, force: true });
}

export function assertMutationE2eTarget(env = process.env) {
  const baseRaw = String(env.CEOS_BASE_URL || '').trim();
  if (!baseRaw) {
    throw new Error(
      '[test-isolation] CEOS_BASE_URL is required. Mutation tests must not default to Render or any persistent runtime.'
    );
  }

  const appUrl = parseHttpUrl(baseRaw, 'CEOS_BASE_URL');
  if (!isLoopback(appUrl.hostname)) {
    throw new Error(
      '[test-isolation] External mutation targets are blocked. Matching environment identifiers are not verifiable proof of remote database or VDR isolation.'
    );
  }

  return assertSafeE2eTarget({
    baseUrl: baseRaw,
    apiBaseUrl: env.CEOS_API_BASE_URL,
    env
  });
}

export function readMutationSuiteBaseUrl(env = process.env) {
  return assertMutationE2eTarget(env).appUrl;
}

export async function allocateIsolatedE2ePort({
  host = '127.0.0.1',
  avoid = [],
  acquire = findAvailablePort
} = {}) {
  const blocked = new Set(
    [...RESERVED_E2E_PORTS, ...avoid].map((port) => Number(port))
  );

  for (let attempt = 0; attempt < 40; attempt += 1) {
    const port = Number(await acquire(host));
    if (Number.isInteger(port) && port > 0 && !blocked.has(port)) {
      return port;
    }
  }

  throw new Error(
    '[test-isolation] Unable to allocate an E2E port outside reserved ports 4000, 5173 and 5174.'
  );
}

export async function findAvailablePort(host = '127.0.0.1') {
  return await new Promise((resolve, reject) => {
    const server = net.createServer();
    server.unref();
    server.once('error', reject);
    server.listen(0, host, () => {
      const address = server.address();
      const port = typeof address === 'object' && address ? address.port : 0;
      server.close((error) => {
        if (error) reject(error);
        else resolve(port);
      });
    });
  });
}

function readGit(commandArgs) {
  try {
    return execFileSync('git', commandArgs, {
      cwd: PROJECT_ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore']
    }).trim();
  } catch {
    return 'UNAVAILABLE';
  }
}

function sourceFingerprint() {
  const schemaPath = path.join(
    PROJECT_ROOT,
    'backend',
    'storage',
    'databaseSchema.js'
  );
  const migrationsPath = path.join(
    PROJECT_ROOT,
    'backend',
    'storage',
    'migrations'
  );

  return sha256(
    JSON.stringify({
      schema: snapshotFile(schemaPath),
      migrations: snapshotDirectory(migrationsPath)
    })
  );
}

export function collectTestProvenance({
  command = process.argv.join(' '),
  result = 'STARTED',
  env = process.env
} = {}) {
  const isolated = assertIsolatedTestEnvironment(env);
  const worktree = readGit(['status', '--porcelain=v1', '--untracked-files=all']);
  const worktreeEntries = worktree === 'UNAVAILABLE' || !worktree
    ? 0
    : worktree.split(/\r?\n/).length;

  return {
    head: readGit(['rev-parse', 'HEAD']),
    worktreeStatus:
      worktree === 'UNAVAILABLE'
        ? 'UNAVAILABLE'
        : worktreeEntries > 0
          ? `DIRTY (${worktreeEntries} entries)`
          : 'CLEAN',
    worktreeManifestSha256:
      worktree === 'UNAVAILABLE' ? 'UNAVAILABLE' : sha256(worktree),
    command,
    environment: String(env.NODE_ENV || ''),
    runId: isolated.runId,
    databasePath: isolated.databasePath,
    fileRoot: isolated.vdrRoot,
    backendPort: String(env.PORT || ''),
    frontendPort: String(env.CEOS_E2E_FRONTEND_PORT || ''),
    node: process.version,
    platform: `${process.platform}-${process.arch}`,
    packageLockSha256: snapshotFile(
      path.join(PROJECT_ROOT, 'package-lock.json')
    ).sha256 || 'UNAVAILABLE',
    schemaFingerprint: sourceFingerprint(),
    fixtureNamespace: isolated.runId,
    timestamp: new Date().toISOString(),
    result
  };
}

export function emitTestProvenance(options = {}) {
  const provenance = collectTestProvenance(options);
  console.info(`[CEO_OS_TEST_PROVENANCE] ${JSON.stringify(provenance)}`);
  return provenance;
}
