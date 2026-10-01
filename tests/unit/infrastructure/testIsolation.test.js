// @vitest-environment node

import fs from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';
import { describe, expect, it } from 'vitest';

import {
  CANONICAL_DATABASE_PATH,
  CANONICAL_VDR_ROOT,
  allocateIsolatedE2ePort,
  assertCanonicalRuntimeStateUnchanged,
  assertIsolatedTestEnvironment,
  assertMutationE2eTarget,
  assertSafeE2eTarget,
  cleanupIsolatedTestEnvironment,
  collectIsolatedFixtureManifest,
  collectTestProvenance,
  createIsolatedTestEnvironment,
  resolveIsolatedApiBaseUrl
} from '../../../scripts/lib/test-isolation.mjs';

describe('test isolation safety contract', () => {
  it('creates unique DB and VDR roots and removes SQLite sidecars', () => {
    const first = createIsolatedTestEnvironment({ label: 'guard-lifecycle' });
    const second = createIsolatedTestEnvironment({ label: 'guard-lifecycle' });

    expect(first.databasePath).not.toBe(second.databasePath);
    expect(first.vdrRoot).not.toBe(second.vdrRoot);

    fs.writeFileSync(first.databasePath, 'db');
    fs.writeFileSync(`${first.databasePath}-wal`, 'wal');
    fs.writeFileSync(`${first.databasePath}-shm`, 'shm');
    fs.writeFileSync(path.join(first.vdrRoot, 'fixture.txt'), 'fixture');

    cleanupIsolatedTestEnvironment(first);
    cleanupIsolatedTestEnvironment(second);

    expect(fs.existsSync(first.root)).toBe(false);
    expect(fs.existsSync(second.root)).toBe(false);
  });

  it('rejects the canonical database and VDR even when the marker is set', () => {
    const context = createIsolatedTestEnvironment({ label: 'guard-canonical' });

    expect(() =>
      assertIsolatedTestEnvironment({
        ...context.environment,
        DB_PATH: CANONICAL_DATABASE_PATH
      })
    ).toThrow(/DB_PATH must be inside CEOS_TEST_ROOT|Canonical\/runtime database/);

    expect(() =>
      assertIsolatedTestEnvironment({
        ...context.environment,
        MA_VDR_STORAGE_DIR: CANONICAL_VDR_ROOT
      })
    ).toThrow(/MA_VDR_STORAGE_DIR must be inside CEOS_TEST_ROOT|Canonical\/runtime VDR/);

    cleanupIsolatedTestEnvironment(context);
  });

  it('rejects port 4000 with otherwise valid positive isolation proof', () => {
    const context = createIsolatedTestEnvironment({ label: 'guard-e2e' });
    const env = {
      ...context.environment,
      CEOS_E2E_TARGET_ISOLATED: '1',
      CEOS_E2E_TARGET_RUN_ID: context.runId
    };

    expect(() =>
      assertSafeE2eTarget({
        baseUrl: 'http://127.0.0.1:4173',
        apiBaseUrl: 'http://127.0.0.1:4000/api',
        env
      })
    ).toThrow(/canonical runtime on port 4000/);

    cleanupIsolatedTestEnvironment(context);
  });

  it('blocks external mutation even when environment identifiers match', () => {
    const context = createIsolatedTestEnvironment({ label: 'guard-external' });
    const env = {
      ...context.environment,
      CEOS_E2E_TARGET_ISOLATED: '1',
      CEOS_E2E_TARGET_RUN_ID: context.runId,
      CEOS_E2E_EXTERNAL_DATABASE_ID: context.runId,
      CEOS_E2E_EXTERNAL_STORAGE_ID: context.runId
    };

    expect(() =>
      assertSafeE2eTarget({
        baseUrl: 'https://isolated.example.test',
        apiBaseUrl: 'https://isolated.example.test/api',
        env
      })
    ).toThrow(/External mutation targets are blocked/);

    expect(() =>
      assertMutationE2eTarget({
        ...env,
        CEOS_BASE_URL: 'https://ceos-os.onrender.com',
        CEOS_API_BASE_URL: 'https://ceos-os.onrender.com/api'
      })
    ).toThrow(/External mutation targets are blocked/);

    cleanupIsolatedTestEnvironment(context);
  });

  it('aborts an unconfigured mutation runner and accepts only an isolated loopback target', () => {
    expect(() => assertMutationE2eTarget({})).toThrow(/CEOS_BASE_URL is required/);

    const context = createIsolatedTestEnvironment({ label: 'guard-mutation' });
    const env = {
      ...context.environment,
      CEOS_BASE_URL: 'http://127.0.0.1:4173',
      CEOS_API_BASE_URL: 'http://127.0.0.1:4174/api',
      CEOS_E2E_TARGET_ISOLATED: '1',
      CEOS_E2E_TARGET_RUN_ID: context.runId,
      PORT: '4174',
      CEOS_E2E_FRONTEND_PORT: '4173'
    };

    expect(assertMutationE2eTarget(env).appUrl).toBe('http://127.0.0.1:4173');

    expect(() =>
      assertMutationE2eTarget({
        ...env,
        CEOS_BASE_URL: 'http://127.0.0.1:4000'
      })
    ).toThrow(/canonical runtime on port 4000/);

    expect(() =>
      assertMutationE2eTarget({
        ...env,
        DB_PATH: CANONICAL_DATABASE_PATH
      })
    ).toThrow(/DB_PATH must be inside CEOS_TEST_ROOT|Canonical\/runtime database/);

    expect(() =>
      assertMutationE2eTarget({
        ...env,
        MA_VDR_STORAGE_DIR: CANONICAL_VDR_ROOT
      })
    ).toThrow(/MA_VDR_STORAGE_DIR must be inside CEOS_TEST_ROOT|Canonical\/runtime VDR/);

    cleanupIsolatedTestEnvironment(context);
  });

  it('does not allocate canonical port 4000 or Vite dev ports 5173 and 5174', async () => {
    const sequence = [5173, 5174, 4000, 49152];
    const allocated = await allocateIsolatedE2ePort({
      acquire: async () => sequence.shift()
    });

    expect(allocated).toBe(49152);
    await expect(
      allocateIsolatedE2ePort({
        acquire: async () => 5173
      })
    ).rejects.toThrow(/reserved ports 4000, 5173 and 5174/);
  });

  it('refuses a silent Vite 5173 to canonical 4000 API fallback', () => {
    expect(() =>
      resolveIsolatedApiBaseUrl({
        CEOS_BASE_URL: 'http://127.0.0.1:5173'
      })
    ).toThrow(/CEOS_API_BASE_URL is required/);

    expect(() =>
      resolveIsolatedApiBaseUrl({
        CEOS_BASE_URL: 'http://127.0.0.1:5173',
        CEOS_API_BASE_URL: 'http://127.0.0.1:4000/api'
      })
    ).toThrow(/canonical runtime on port 4000/);

    expect(
      resolveIsolatedApiBaseUrl({
        CEOS_API_BASE_URL: 'http://127.0.0.1:4173/api'
      })
    ).toBe('http://127.0.0.1:4173/api');
  });

  it('detects any canonical DB sidecar or VDR snapshot change', () => {
    const before = {
      database: {
        database: { exists: true, size: 10, sha256: 'db' },
        '-wal': { exists: true, size: 4, sha256: 'wal' },
        '-shm': { exists: false }
      },
      vdr: {
        exists: true,
        entries: [{ path: 'org/document.bin', size: 3, sha256: 'vdr' }],
        sha256: 'vdr-tree'
      },
      sha256: 'canonical-before'
    };

    expect(
      assertCanonicalRuntimeStateUnchanged(before, structuredClone(before))
    ).toMatchObject({
      databaseUnchanged: true,
      vdrUnchanged: true
    });

    const changedDatabase = structuredClone(before);
    changedDatabase.database['-wal'].sha256 = 'changed';
    expect(() =>
      assertCanonicalRuntimeStateUnchanged(before, changedDatabase)
    ).toThrow(/DB\/WAL\/SHM/);

    const changedVdr = structuredClone(before);
    changedVdr.vdr.entries.push({
      path: 'org/other.bin',
      size: 1,
      sha256: 'other'
    });
    expect(() =>
      assertCanonicalRuntimeStateUnchanged(before, changedVdr)
    ).toThrow(/VDR/);
  });

  it('uses captured isolation provenance when process env is mutated', () => {
    const context = createIsolatedTestEnvironment({
      label: 'captured-provenance'
    });
    const previous = {
      CEOS_TEST_ISOLATION: process.env.CEOS_TEST_ISOLATION,
      CEOS_TEST_RUN_ID: process.env.CEOS_TEST_RUN_ID,
      CEOS_TEST_ROOT: process.env.CEOS_TEST_ROOT,
      DB_PATH: process.env.DB_PATH,
      MA_VDR_STORAGE_DIR: process.env.MA_VDR_STORAGE_DIR
    };

    try {
      delete process.env.CEOS_TEST_ISOLATION;
      delete process.env.CEOS_TEST_RUN_ID;
      delete process.env.CEOS_TEST_ROOT;
      delete process.env.DB_PATH;
      delete process.env.MA_VDR_STORAGE_DIR;

      expect(
        collectTestProvenance({
          result: 'CAPTURED_ENV_TEST',
          env: context.environment
        })
      ).toMatchObject({
        runId: context.runId,
        databasePath: context.databasePath,
        fileRoot: context.vdrRoot
      });
    } finally {
      for (const [key, value] of Object.entries(previous)) {
        if (value === undefined) delete process.env[key];
        else process.env[key] = value;
      }
      cleanupIsolatedTestEnvironment(context);
    }
  });

  it('tracks isolated fixture IDs and tenant ownership without raw payloads', async () => {
    const context = createIsolatedTestEnvironment({
      label: 'fixture-manifest'
    });
    const database = new Database(context.databasePath);

    try {
      database.exec(`
        CREATE TABLE fixture_records (
          id TEXT PRIMARY KEY,
          organization_id TEXT NOT NULL,
          payload TEXT
        )
      `);
      database
        .prepare(
          'INSERT INTO fixture_records (id, organization_id, payload) VALUES (?, ?, ?)'
        )
        .run('fixture-1', 'org-fixture', 'private-payload');
      fs.writeFileSync(
        path.join(context.vdrRoot, 'fixture.bin'),
        Buffer.from('fixture-bytes')
      );
      database.close();

      const manifest = await collectIsolatedFixtureManifest(
        context.environment
      );
      const table = manifest.tables.find(
        (entry) => entry.table === 'fixture_records'
      );

      expect(table).toMatchObject({
        records: 1,
        ownerColumn: 'organization_id',
        organizations: 1,
        missingOwnerRecords: 0
      });
      expect(table.identitySha256).toMatch(/^[a-f0-9]{64}$/);
      expect(JSON.stringify(manifest)).not.toContain('private-payload');
      expect(manifest.vdrFiles).toBe(1);
      expect(manifest.manifestSha256).toMatch(/^[a-f0-9]{64}$/);
    } finally {
      if (database.open) database.close();
      cleanupIsolatedTestEnvironment(context);
    }
  });
});
