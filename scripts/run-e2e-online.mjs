import { spawn } from 'node:child_process';
import path from 'node:path';

import { assertMutationE2eTarget } from './lib/test-isolation.mjs';

// Legacy manual suite. It is mutation-capable and is not a CI gate.
// Remote/persistent targets cannot prove DB and VDR isolation, so they abort.
const decision = assertMutationE2eTarget(process.env);

console.info(
  `[test-isolation] Isolated mutation target accepted for online suite: ${decision.appUrl}`
);

const cliPath = path.join(
  process.cwd(),
  'node_modules',
  '@playwright',
  'test',
  'cli.js'
);
const child = spawn(
  process.execPath,
  [cliPath, 'test', 'tests/*.spec.js'],
  {
    cwd: process.cwd(),
    env: process.env,
    stdio: 'inherit'
  }
);

child.on('exit', (code, signal) => {
  if (signal) {
    console.error(`[test-isolation] Online suite exited from signal ${signal}.`);
    process.exit(1);
  }
  process.exit(code ?? 1);
});
