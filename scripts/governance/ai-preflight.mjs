/**
 * Read-only AI bootstrap helper. Prints HEAD, status and CURRENT_HANDOFF_STATE.
 * Does not reset, clean, stash, stage, commit, or touch DB/VDR.
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const MASTER_REL = 'docs/product/CEO_OS_MASTER_CONTROL_BASELINE.md';
const MASTER_PATH = path.join(REPO_ROOT, MASTER_REL);
const HANDOFF_HEADING = '# 20. CURRENT_HANDOFF_STATE';
const HANDOFF_FIELDS = [
  'ACTIVE PHASE',
  'LAST COMPLETED PACKAGE',
  'OPEN BLOCKERS RELEVANT TO NEXT WORK',
  'EXACT NEXT ACTION'
];

function git(args) {
  return execFileSync('git', args, {
    cwd: REPO_ROOT,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe']
  }).trim();
}

function fieldValue(section, label) {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = section.match(new RegExp(`^- \\*\\*${escaped}:\\*\\*\\s*(.*)$`, 'm'));
  return match ? match[1].trim() : '';
}

function normalizeSha(value) {
  const match = String(value).match(/[0-9a-f]{7,40}/i);
  return match ? match[0].toLowerCase() : '';
}

function shasMatch(expected, actual) {
  if (!expected || !actual) return false;
  return expected === actual || expected.startsWith(actual) || actual.startsWith(expected);
}

function main() {
  let exitCode = 0;
  const warnings = [];

  console.log(`[ai-preflight] repository root: ${REPO_ROOT}`);

  let head = '';
  let status = '';
  try {
    head = git(['rev-parse', 'HEAD']);
    status = git(['status', '--short']);
  } catch (error) {
    console.error('[ai-preflight] unable to read Git state.');
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }

  console.log(`[ai-preflight] HEAD: ${head}`);
  const statusLines = status ? status.split(/\r?\n/) : [];
  console.log(`[ai-preflight] git status --short (${statusLines.length} entries):`);
  console.log(status || '(clean)');

  if (!fs.existsSync(MASTER_PATH)) {
    console.error(`[ai-preflight] missing ${MASTER_REL}`);
    process.exit(1);
  }

  const master = fs.readFileSync(MASTER_PATH, 'utf8');
  const headingAt = master.indexOf(HANDOFF_HEADING);
  if (headingAt < 0) {
    console.error('[ai-preflight] CURRENT_HANDOFF_STATE section not found.');
    process.exit(1);
  }

  const nextHeading = master.indexOf('\n# ', headingAt + HANDOFF_HEADING.length);
  const section = nextHeading >= 0 ? master.slice(headingAt, nextHeading) : master.slice(headingAt);

  console.log('[ai-preflight] CURRENT_HANDOFF_STATE:');
  for (const label of HANDOFF_FIELDS) {
    const value = fieldValue(section, label);
    console.log(`  ${label}: ${value || '(missing)'}`);
    if (!value) {
      warnings.push(`handoff field missing: ${label}`);
    }
  }

  const expectedHead = normalizeSha(fieldValue(section, 'CURRENT HEAD'));
  const actualHead = normalizeSha(head);
  if (!expectedHead) {
    console.error('[ai-preflight] CURRENT HEAD is missing from the handoff.');
    exitCode = 1;
  } else if (!shasMatch(expectedHead, actualHead)) {
    console.error(`[ai-preflight] HEAD mismatch: handoff ${expectedHead} vs actual ${actualHead}`);
    console.error('[ai-preflight] STOP. Do not normalize the repository.');
    exitCode = 1;
  } else {
    console.log(`[ai-preflight] HEAD matches handoff (${expectedHead}).`);
  }

  if (statusLines.length > 0) {
    warnings.push('working tree is dirty/untracked; preserve unrelated work');
  }

  for (const warning of warnings) {
    console.log(`[ai-preflight] warning: ${warning}`);
  }

  process.exit(exitCode);
}

main();
