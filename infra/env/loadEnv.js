import fs from 'fs';
import path from 'path';

export function loadEnv(file = '.env') {
  const envPath = path.resolve(process.cwd(), file);
  if (!fs.existsSync(envPath)) return {};

  const raw = fs.readFileSync(envPath, 'utf8');
  const lines = raw.split('\n');
  const result = {};

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const [key, ...rest] = trimmed.split('=');
    result[key] = rest.join('=').trim();
  }

  return result;
}
