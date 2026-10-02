import crypto from 'node:crypto';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import net from 'node:net';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it } from 'vitest';

const FALLBACK_AUTH_SECRET = 'ceo-os-local-development-secret';
const SYNTHETIC_AUTH_SECRET = 'a03-synthetic-auth-secret-0123456789';
const PRESET_AUTH_SECRET = 'a03-preset-process-secret-0123456789ab';
const FILE_AUTH_SECRET = 'a03-dotenv-file-secret-not-used-012345';
const SERVER_ENTRY = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../../backend/server.js'
);

const children = [];
const tempRoots = [];

function signatureMatches(token, secret) {
  const parts = String(token || '').split('.');

  if (parts.length !== 3 || !secret) {
    return false;
  }

  const expected = crypto
    .createHmac('sha256', secret)
    .update(`${parts[0]}.${parts[1]}`)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  return expected === parts[2];
}

function reservePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      const port = typeof address === 'object' && address ? address.port : 0;
      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(port);
      });
    });
  });
}

async function reserveSafePort() {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const port = await reservePort();
    if (port && port !== 4000) {
      return port;
    }
  }

  throw new Error('Could not reserve an isolated port.');
}

function childEnvironment(port, dbPath, vdrPath, extra = {}) {
  const env = { ...process.env };

  for (const key of [
    'AUTH_SECRET',
    'NODE_ENV',
    'CEOS_E2E',
    'DOTENV_CONFIG_PATH',
    'BOOTSTRAP_USERS_JSON',
    'BOOTSTRAP_ADMIN_EMAIL',
    'BOOTSTRAP_ADMIN_PASSWORD',
    'BOOTSTRAP_SYNC_USERS',
    'VITE_ENABLE_MA_LOCAL_FALLBACK'
  ]) {
    delete env[key];
  }

  env.PORT = String(port);
  env.DB_PATH = dbPath;
  env.SQLITE_PATH = dbPath;
  env.SQLITE_DB_PATH = dbPath;
  env.MA_VDR_STORAGE_DIR = vdrPath;
  env.VDR_STORAGE_DIR = vdrPath;

  return { ...env, ...extra };
}

async function startServer({ envLines, extraEnv = {} }) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'ceos-a03-bootstrap-'));
  tempRoots.push(root);
  const dbPath = path.join(root, 'ceo_os.sqlite');
  const vdrPath = path.join(root, 'ma_vdr');
  fs.mkdirSync(vdrPath, { recursive: true });
  fs.writeFileSync(path.join(root, '.env'), `${envLines.trim()}\n`, 'utf8');

  const port = await reserveSafePort();
  const child = spawn(process.execPath, [SERVER_ENTRY], {
    cwd: root,
    env: childEnvironment(port, dbPath, vdrPath, extraEnv),
    stdio: ['ignore', 'pipe', 'pipe'],
    windowsHide: true
  });
  children.push(child);

  let output = '';
  child.stdout.on('data', (chunk) => {
    output += chunk.toString('utf8');
  });
  child.stderr.on('data', (chunk) => {
    output += chunk.toString('utf8');
  });

  const health = await waitForHealth(child, port, outputRef(child, () => output));

  return {
    port,
    child,
    dbPath,
    readOutput: () => output,
    health
  };
}

function outputRef(child, readOutput) {
  return () => ({
    exitCode: child.exitCode,
    output: readOutput()
  });
}

async function waitForHealth(child, port, readState, timeoutMs = 30000) {
  const started = Date.now();
  let lastStatus = 'not-ready';

  while (Date.now() - started < timeoutMs) {
    const state = readState();
    if (state.exitCode != null) {
      throw new Error(`Server exited before health with code ${state.exitCode}.`);
    }

    try {
      const response = await fetch(`http://127.0.0.1:${port}/api/health`);
      const body = await response.json();
      if (response.status === 200 && body?.data?.status === 'ok') {
        return body;
      }
      lastStatus = `http-${response.status}`;
    } catch {
      lastStatus = 'connection-refused';
    }

    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  throw new Error(`Health check timed out (${lastStatus}).`);
}

async function stopChild(child) {
  if (!child || child.exitCode != null) {
    return;
  }

  child.kill();
  await new Promise((resolve) => {
    const timer = setTimeout(() => {
      child.kill('SIGKILL');
      resolve();
    }, 3000);
    child.once('exit', () => {
      clearTimeout(timer);
      resolve();
    });
  });
}

function assertOutputHidesSecrets(output) {
  const leaked = [SYNTHETIC_AUTH_SECRET, PRESET_AUTH_SECRET, FILE_AUTH_SECRET].some(
    (secret) => output.includes(secret)
  );
  expect(leaked).toBe(false);
}

async function login(port, email, password) {
  const response = await fetch(`http://127.0.0.1:${port}/api/auth/login`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const body = await response.json();

  if (!response.ok) {
    throw new Error(
      `Login failed with status ${response.status} and code ${body?.error?.code || 'unknown'}.`
    );
  }

  const token = body?.data?.token;
  if (typeof token !== 'string' || token.split('.').length !== 3) {
    throw new Error('Login did not return a bearer token.');
  }

  return token;
}

describe('A03 security config bootstrap', () => {
  afterEach(async () => {
    while (children.length > 0) {
      await stopChild(children.pop());
    }

    while (tempRoots.length > 0) {
      fs.rmSync(tempRoots.pop(), { recursive: true, force: true });
    }
  });

  it('signs with the dotenv AUTH_SECRET on the normal server startup path', async () => {
    const started = await startServer({
      envLines: [
        `AUTH_SECRET=${SYNTHETIC_AUTH_SECRET}`,
        'NODE_ENV=development'
      ].join('\n')
    });

    const token = await login(started.port, 'admin@ceoos.local', 'admin123');

    expect(signatureMatches(token, SYNTHETIC_AUTH_SECRET)).toBe(true);
    expect(signatureMatches(token, FALLBACK_AUTH_SECRET)).toBe(false);
    expect(started.health.data.environment).toBe('development');
    assertOutputHidesSecrets(started.readOutput());
    expect(started.dbPath.includes(`${path.sep}backend${path.sep}data${path.sep}`)).toBe(
      false
    );
  }, 60000);

  it('captures NODE_ENV=production from dotenv before HTTP configuration', async () => {
    const started = await startServer({
      envLines: [
        `AUTH_SECRET=${SYNTHETIC_AUTH_SECRET}`,
        'NODE_ENV=production',
        'CEOS_E2E=false'
      ].join('\n')
    });

    expect(started.health.data.status).toBe('ok');
    expect(started.health.data.environment).toBeUndefined();
    assertOutputHidesSecrets(started.readOutput());
  }, 60000);

  it('captures CEOS_E2E from dotenv for the login rate limiter', async () => {
    const started = await startServer({
      envLines: [
        `AUTH_SECRET=${SYNTHETIC_AUTH_SECRET}`,
        'NODE_ENV=development',
        'CEOS_E2E=true'
      ].join('\n')
    });

    const statuses = [];
    for (let attempt = 0; attempt < 21; attempt += 1) {
      const response = await fetch(`http://127.0.0.1:${started.port}/api/auth/login`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: '{}'
      });
      statuses.push(response.status);
      await response.arrayBuffer();
    }

    expect(statuses[20]).toBe(400);
    expect(statuses.includes(429)).toBe(false);
    assertOutputHidesSecrets(started.readOutput());
  }, 60000);

  it('keeps pre-set process environment ahead of dotenv values', async () => {
    const started = await startServer({
      envLines: [
        `AUTH_SECRET=${FILE_AUTH_SECRET}`,
        'NODE_ENV=production',
        'CEOS_E2E=true'
      ].join('\n'),
      extraEnv: {
        AUTH_SECRET: PRESET_AUTH_SECRET,
        NODE_ENV: 'development'
      }
    });

    const token = await login(started.port, 'admin@ceoos.local', 'admin123');

    expect(signatureMatches(token, PRESET_AUTH_SECRET)).toBe(true);
    expect(signatureMatches(token, FILE_AUTH_SECRET)).toBe(false);
    expect(signatureMatches(token, FALLBACK_AUTH_SECRET)).toBe(false);
    expect(started.health.data.environment).toBe('development');
    assertOutputHidesSecrets(started.readOutput());
  }, 60000);
});
