import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';

import { EvidenceError } from './gitFacts.mjs';

const PLACEHOLDER = '<EVIDENCE_OUTPUT_DIR>';
const EXTRACT_LIMIT = 8192;

const ENV_ALLOW = new Set([
  'PATH',
  'PATHEXT',
  'SYSTEMROOT',
  'WINDIR',
  'COMSPEC',
  'TEMP',
  'TMP',
  'USERPROFILE',
  'HOMEDRIVE',
  'HOMEPATH',
  'HOME'
]);

export function scrubbedEnvironment(source = process.env) {
  const env = {};
  for (const [key, value] of Object.entries(source)) {
    if (typeof value !== 'string') continue;
    if (!ENV_ALLOW.has(key.toUpperCase())) continue;
    if (/(secret|token|password|credential|api_key|auth|sqlite|database|vdr)/i.test(key)) continue;
    env[key] = value;
  }
  return env;
}

export function redactExtract(text) {
  return String(text)
    .replace(/bearer\s+[a-z0-9._~+/-]+/gi, 'bearer [redacted]')
    .replace(/-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]*?-----END [A-Z ]*PRIVATE KEY-----/g, '[redacted private key]')
    .replace(/(password|secret|token|api_key)\s*[=:]\s*\S+/gi, '$1=[redacted]')
    .slice(0, EXTRACT_LIMIT);
}

function insideLexical(root, candidate) {
  const relative = path.relative(root, candidate);
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
}

export function resolvePlanArgv(entry, context) {
  const args = [];
  const outputs = [];
  for (const token of entry.argv) {
    if (token.type === 'exec') continue;
    if (token.type === 'flag' || token.type === 'literal') {
      args.push(token.value);
      continue;
    }
    if (token.type === 'candidate_path') {
      const absolute = path.resolve(context.candidateRoot, ...token.value.split('/'));
      if (!fs.existsSync(absolute)) {
        throw new EvidenceError('CANDIDATE_PATH', `candidate_path does not exist: ${token.value}`);
      }
      const real = fs.realpathSync(absolute);
      if (!insideLexical(context.candidateRoot, real)) {
        throw new EvidenceError('CANDIDATE_PATH', `candidate_path escapes the candidate: ${token.value}`);
      }
      args.push(real);
      continue;
    }
    if (token.type === 'evidence_output') {
      const remainder = token.value.slice(PLACEHOLDER.length);
      const relative = remainder.replace(/^\//, '');
      const absolute = path.resolve(context.runDir, ...relative.split('/'));
      if (!insideLexical(context.runDir, absolute)) {
        throw new EvidenceError('EVIDENCE_OUTPUT', 'evidence_output escapes the run directory.');
      }
      if (path.basename(absolute).toLowerCase() === 'manifest.json') {
        throw new EvidenceError('EVIDENCE_OUTPUT', 'evidence_output cannot target manifest.json.');
      }
      fs.mkdirSync(path.dirname(absolute), { recursive: true });
      const parent = fs.realpathSync(path.dirname(absolute));
      if (!insideLexical(fs.realpathSync(context.runDir), parent)) {
        throw new EvidenceError('EVIDENCE_OUTPUT', 'evidence_output escapes the run directory.');
      }
      outputs.push(absolute);
      args.push(absolute);
      continue;
    }
    throw new EvidenceError('EVIDENCE_PLAN_INVALID', `Unknown token type ${token.type}.`);
  }
  return { args, outputs };
}

function taskkillPath() {
  const root = process.env.SystemRoot || process.env.windir || 'C:\\Windows';
  return path.join(root, 'System32', 'taskkill.exe');
}

function waitForClose(child, timeoutMs) {
  if (child.exitCode !== null || child.signalCode !== null) return Promise.resolve(true);
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve(false), timeoutMs);
    child.once('close', () => {
      clearTimeout(timer);
      resolve(true);
    });
  });
}

async function confirmedTerminate(child) {
  if (child.exitCode !== null || child.signalCode !== null) return true;
  const pid = child.pid;
  if (!pid) return false;
  if (process.platform === 'win32') {
      const killer = spawn(taskkillPath(), ['/PID', String(pid), '/T', '/F'], {
        shell: false,
        windowsHide: true
      });
      const killTimer = setTimeout(() => killer.kill(), 5000);
    const killed = await new Promise((resolve) => {
      killer.once('error', () => {
        clearTimeout(killTimer);
        resolve(false);
      });
      killer.once('exit', (code) => {
        clearTimeout(killTimer);
        resolve(code === 0 || code === 128);
      });
    });
    const closed = await waitForClose(child, 4000);
    return killed && closed;
  }
  try {
    process.kill(-pid, 'SIGKILL');
  } catch {
    try {
      process.kill(pid, 'SIGKILL');
    } catch {
      return child.exitCode !== null || child.signalCode !== null;
    }
  }
  return waitForClose(child, 10000);
}

export function runCommand(entry, context) {
  const resolved = resolvePlanArgv(entry, context);
  const expectsJson = entry.argv.some((token) => token.type === 'flag' && token.value === '--reporter=json');
  return new Promise((resolve) => {
    const stdoutHash = crypto.createHash('sha256');
    const stderrHash = crypto.createHash('sha256');
    let stdoutText = '';
    let stderrText = '';
    let settled = false;
    const child = spawn(process.execPath, resolved.args, {
      cwd: context.candidateRoot,
      env: scrubbedEnvironment(),
      shell: false,
      windowsHide: true,
      detached: process.platform !== 'win32',
      stdio: ['ignore', 'pipe', 'pipe']
    });
    child.stdout.on('data', (chunk) => {
      stdoutHash.update(chunk);
      if (stdoutText.length < EXTRACT_LIMIT) stdoutText += chunk.toString('utf8');
    });
    child.stderr.on('data', (chunk) => {
      stderrHash.update(chunk);
      if (stderrText.length < EXTRACT_LIMIT) stderrText += chunk.toString('utf8');
    });
    const finish = async (status, exitCode) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      const confirmed = status === 'TIMEOUT' ? await confirmedTerminate(child) : true;
      if (status === 'TIMEOUT' && !confirmed) status = 'ERROR';
      resolve({
        id: entry.id,
        required: context.required,
        status,
        exit_code: exitCode,
        timeout_ms: entry.timeout_ms,
        stdout_sha256: stdoutHash.digest('hex'),
        stderr_sha256: stderrHash.digest('hex'),
        stdout_extract: redactExtract(stdoutText),
        stderr_extract: redactExtract(stderrText),
        outputs: resolved.outputs,
        expects_json: expectsJson,
        termination_confirmed: confirmed
      });
    };
    const timer = setTimeout(() => {
      finish('TIMEOUT', null);
    }, entry.timeout_ms);
    child.once('error', () => finish('ERROR', null));
    child.once('close', (code) => finish(code === 0 ? 'PASS' : 'FAIL', code));
  });
}
