import { spawn } from 'node:child_process';
import http from 'node:http';
import path from 'node:path';

import {
  assertCanonicalRuntimeStateUnchanged,
  assertSafeE2eTarget,
  captureCanonicalRuntimeState,
  cleanupIsolatedTestEnvironment,
  allocateIsolatedE2ePort,
  collectIsolatedFixtureManifest,
  createIsolatedTestEnvironment,
  emitTestProvenance
} from './lib/test-isolation.mjs';

const args = process.argv.slice(2);
const isolation = createIsolatedTestEnvironment({ label: 'playwright' });
let server = null;
let playwrightFinished = false;
let unexpectedServerExit = null;
let runEnvironment = isolation.environment;

function waitForUrl(url, timeoutMs = 120000) {
  const startedAt = Date.now();

  return new Promise((resolve, reject) => {
    function attempt() {
      const request = http.get(url, (response) => {
        response.resume();
        if (response.statusCode && response.statusCode < 500) {
          resolve();
          return;
        }
        retry();
      });

      request.on('error', retry);
      request.setTimeout(1500, () => {
        request.destroy();
        retry();
      });
    }

    function retry() {
      if (Date.now() - startedAt > timeoutMs) {
        reject(new Error(`Timed out waiting for ${url}`));
        return;
      }
      setTimeout(attempt, 500);
    }

    attempt();
  });
}

function probeUrl(url, timeoutMs = 5000) {
  return new Promise((resolve) => {
    const request = http.get(url, (response) => {
      response.resume();
      resolve(Boolean(response.statusCode && response.statusCode < 500));
    });

    request.once('error', () => resolve(false));
    request.setTimeout(timeoutMs, () => {
      request.destroy();
      resolve(false);
    });
  });
}

function stopServer() {
  return new Promise((resolve) => {
    if (!server || server.exitCode !== null || server.killed) {
      resolve();
      return;
    }

    const timer = setTimeout(() => {
      server.kill('SIGKILL');
      resolve();
    }, 3000);

    server.once('exit', () => {
      clearTimeout(timer);
      resolve();
    });

    server.kill('SIGTERM');
  });
}

async function isolatedPorts() {
  const backendPort = await allocateIsolatedE2ePort();
  const frontendPort = await allocateIsolatedE2ePort({
    avoid: [backendPort]
  });

  return { backendPort, frontendPort };
}

async function main() {
  let result = 'FAILED';
  const canonicalBefore = captureCanonicalRuntimeState();

  try {
    const { backendPort, frontendPort } = await isolatedPorts();
    const baseUrl = `http://127.0.0.1:${frontendPort}`;
    const apiBaseUrl = `http://127.0.0.1:${backendPort}/api`;
    const testEnv = {
      ...process.env,
      ...isolation.environment,
      PORT: String(backendPort),
      CEOS_E2E_FRONTEND_PORT: String(frontendPort),
      CEOS_BASE_URL: baseUrl,
      CEOS_API_BASE_URL: apiBaseUrl,
      CEOS_E2E: 'true',
      CEOS_TEST_CLEANUP_OWNER: 'runner',
      CEOS_E2E_TARGET_ISOLATED: '1',
      CEOS_E2E_TARGET_RUN_ID: isolation.runId,
      CEOS_E2E_USER: process.env.CEOS_E2E_USER || 'admin@ceoos.local',
      CEOS_E2E_PASSWORD: process.env.CEOS_E2E_PASSWORD || 'admin123',
      BOOTSTRAP_ADMIN_EMAIL: '',
      BOOTSTRAP_ADMIN_PASSWORD: '',
      BOOTSTRAP_USERS_JSON: ''
    };
    runEnvironment = testEnv;

    assertSafeE2eTarget({ baseUrl, apiBaseUrl, env: testEnv });
    emitTestProvenance({
      command: `node scripts/run-e2e.mjs ${args.join(' ')}`.trim(),
      result: 'STARTED',
      env: testEnv
    });

    server = spawn(process.execPath, ['./scripts/e2e-playwright-server.mjs'], {
      cwd: process.cwd(),
      env: testEnv,
      stdio: ['ignore', 'pipe', 'pipe'],
      detached: process.platform === 'win32'
    });

    server.stdout?.on('data', (chunk) => process.stdout.write(chunk));
    server.stderr?.on('data', (chunk) => process.stderr.write(chunk));
    server.on('exit', (code, signal) => {
      if (playwrightFinished) return;
      unexpectedServerExit = { code, signal };
      console.error(
        `[test-isolation] Isolated E2E server exited unexpectedly before Playwright finished (code=${code}, signal=${signal}).`
      );
    });

    await Promise.all([
      waitForUrl(`http://127.0.0.1:${backendPort}/health`),
      waitForUrl(baseUrl)
    ]);

    const cliPath = path.join(
      process.cwd(),
      'node_modules',
      '@playwright',
      'test',
      'cli.js'
    );
    const playwright = spawn(process.execPath, [cliPath, 'test', ...args], {
      cwd: process.cwd(),
      env: testEnv,
      stdio: 'inherit'
    });

    if (unexpectedServerExit) {
      playwright.kill('SIGTERM');
      throw new Error(
        `[test-isolation] Isolated E2E server died before tests started (code=${unexpectedServerExit.code}, signal=${unexpectedServerExit.signal}).`
      );
    }

    const exitCode = await new Promise((resolve) => {
      const failFast = () => {
        if (!unexpectedServerExit) return;
        playwright.kill('SIGTERM');
        resolve(1);
      };
      server.once('exit', failFast);
      playwright.on('exit', (code) => resolve(code ?? 1));
    });

    const backendHealthy =
      !unexpectedServerExit &&
      (await probeUrl(`http://127.0.0.1:${backendPort}/health`));
    console.info(
      `[CEO_OS_SERVER_LIFECYCLE] ${JSON.stringify({
        survivedPlaywright: backendHealthy,
        exitCode: server.exitCode,
        killed: server.killed,
        unexpectedServerExit
      })}`
    );

    playwrightFinished = true;
    if (unexpectedServerExit) {
      process.exitCode = 1;
      result = `FAILED (isolated server exited code=${unexpectedServerExit.code} signal=${unexpectedServerExit.signal})`;
      console.error(`[test-isolation] ${result}`);
    } else if (!backendHealthy) {
      process.exitCode = 1;
      result = 'FAILED (isolated server health check failed after Playwright)';
      console.error(`[test-isolation] ${result}`);
    } else {
      result = exitCode === 0 ? 'PASSED' : `FAILED (${exitCode})`;
      process.exitCode = exitCode;
    }
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  } finally {
    await stopServer();
    const verificationFailures = [];

    try {
      const fixtureManifest = await collectIsolatedFixtureManifest(
        runEnvironment
      );
      console.info(
        `[CEO_OS_FIXTURE_MANIFEST] ${JSON.stringify({
          runId: fixtureManifest.runId,
          trackedRecords: fixtureManifest.trackedRecords,
          populatedTables: fixtureManifest.tables.filter(
            (table) => table.records > 0
          ),
          vdrFiles: fixtureManifest.vdrFiles,
          vdrSha256: fixtureManifest.vdrSha256,
          manifestSha256: fixtureManifest.manifestSha256
        })}`
      );
    } catch (error) {
      verificationFailures.push('FIXTURE_MANIFEST_FAILED');
      console.error(error);
    }

    try {
      const canonicalAfter = captureCanonicalRuntimeState();
      const invariant = assertCanonicalRuntimeStateUnchanged(
        canonicalBefore,
        canonicalAfter
      );
      console.info(
        `[CEO_OS_CANONICAL_INVARIANTS] ${JSON.stringify({
          databaseUnchanged: invariant.databaseUnchanged,
          vdrUnchanged: invariant.vdrUnchanged,
          beforeSha256: invariant.beforeSha256,
          afterSha256: invariant.afterSha256
        })}`
      );
    } catch (error) {
      verificationFailures.push('CANONICAL_INVARIANT_FAILED');
      console.error(error);
    }

    if (verificationFailures.length > 0) {
      result = `${result}; ${verificationFailures.join('; ')}`;
      process.exitCode = 1;
    }

    try {
      try {
        emitTestProvenance({
          command: `node scripts/run-e2e.mjs ${args.join(' ')}`.trim(),
          result,
          env: runEnvironment
        });
      } finally {
        cleanupIsolatedTestEnvironment(isolation);
      }
    } catch (error) {
      process.exitCode = 1;
      console.error(error);
    }
  }
}

main();
