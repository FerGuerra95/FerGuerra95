/**
 * Ejecuta Lighthouse CI usando el Chromium descargado por Playwright (misma que e2e).
 * Requiere: `npm run build` previo y `npx playwright install chromium`.
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { chromium } from '@playwright/test';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const configArg = process.argv[2];
const configPath = configArg
  ? path.isAbsolute(configArg)
    ? configArg
    : path.join(root, configArg)
  : path.join(root, 'lighthouserc.cjs');

function resolveChromePath() {
  const fromEnv = String(
    process.env.CHROME_PATH || process.env.LIGHTHOUSE_CHROME_PATH || ''
  ).trim();
  if (fromEnv && fs.existsSync(fromEnv)) return fromEnv;

  try {
    const fromPlaywright = chromium.executablePath();
    if (fromPlaywright && fs.existsSync(fromPlaywright)) return fromPlaywright;
  } catch {
    //
  }

  return '';
}

const chromePath = resolveChromePath();

if (!chromePath) {
  console.error(
    '[lighthouse-ci] No se encontró Chrome/Chromium. Opciones:\n' +
      '  - npx playwright install chromium\n' +
      '  - o define CHROME_PATH apuntando a chrome.exe / google-chrome'
  );
  process.exit(1);
}

const result = spawnSync(
  'npx',
  ['lhci', 'autorun', '--config', configPath],
  {
    cwd: root,
    stdio: 'inherit',
    shell: true,
    env: {
      ...process.env,
      CHROME_PATH: chromePath
    }
  }
);

process.exit(result.status === null ? 1 : result.status ?? 1);
