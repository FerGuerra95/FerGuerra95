import { spawn } from 'node:child_process';
import http from 'node:http';
import path from 'node:path';

const args = process.argv.slice(2);
const server = spawn(process.execPath, ['./scripts/e2e-playwright-server.mjs'], {
  cwd: process.cwd(),
  env: {
    ...process.env,
    CEOS_E2E: 'true'
  },
  stdio: 'inherit'
});

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

function stopServer() {
  return new Promise((resolve) => {
    if (server.exitCode !== null || server.killed) {
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

async function main() {
  try {
    await Promise.all([
      waitForUrl('http://127.0.0.1:4000/health'),
      waitForUrl('http://127.0.0.1:5173')
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
      env: {
        ...process.env,
        CEOS_BASE_URL: 'http://127.0.0.1:5173',
        CEOS_API_BASE_URL: 'http://127.0.0.1:4000/api'
      },
      stdio: 'inherit'
    });

    const exitCode = await new Promise((resolve) => {
      playwright.on('exit', (code) => resolve(code ?? 1));
    });

    await stopServer();
    process.exit(exitCode);
  } catch (error) {
    console.error(error);
    await stopServer();
    process.exit(1);
  }
}

main();
