/**
 * Comprueba tamaños gzip de salida de Vite en dist/assets (JS principal y total).
 * Ajusta los límites cuando el bundle crezca de forma deliberada.
 */
import fs from 'node:fs';
import path from 'node:path';
import { gzipSync } from 'node:zlib';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const assetsDir = path.join(root, 'dist', 'assets');

const BUDGETS = {
  /** Chunk principal de React vendor */
  vendorReactGzipMax: 130 * 1024,
  /** Entry / app principal (nombre hash de Vite) */
  indexMainGzipMax: 52 * 1024,
  /** Suma de todos los .js en assets (gzip) */
  totalJsGzipMax: 980 * 1024
};

function gzipSize(buffer) {
  return gzipSync(buffer).length;
}

function main() {
  if (!fs.existsSync(assetsDir)) {
    console.error('[bundle-budget] Falta dist/assets. Ejecuta npm run build antes.');
    process.exit(1);
  }

  const files = fs.readdirSync(assetsDir).filter((name) => name.endsWith('.js'));
  if (files.length === 0) {
    console.error('[bundle-budget] No hay ficheros .js en dist/assets.');
    process.exit(1);
  }

  let vendorGzip = 0;
  let indexGzip = 0;
  let totalJsGzip = 0;

  for (const name of files) {
    const full = path.join(assetsDir, name);
    const buf = fs.readFileSync(full);
    const gz = gzipSize(buf);
    totalJsGzip += gz;

    if (name.startsWith('vendor-react')) {
      vendorGzip = Math.max(vendorGzip, gz);
    }
    if (name.startsWith('index-')) {
      indexGzip = Math.max(indexGzip, gz);
    }
  }

  const failures = [];

  if (!vendorGzip) {
    failures.push('No se encontro chunk vendor-react*.js');
  } else if (vendorGzip > BUDGETS.vendorReactGzipMax) {
    failures.push(
      `vendor-react gzip ${vendorGzip} > max ${BUDGETS.vendorReactGzipMax}`
    );
  }

  if (!indexGzip) {
    failures.push('No se encontro chunk index-*.js');
  } else if (indexGzip > BUDGETS.indexMainGzipMax) {
    failures.push(
      `index-* gzip ${indexGzip} > max ${BUDGETS.indexMainGzipMax}`
    );
  }

  if (totalJsGzip > BUDGETS.totalJsGzipMax) {
    failures.push(
      `total JS gzip ${totalJsGzip} > max ${BUDGETS.totalJsGzipMax}`
    );
  }

  console.log(
    `[bundle-budget] vendor-react gzip=${vendorGzip}, index gzip=${indexGzip}, total JS gzip=${totalJsGzip}`
  );

  if (failures.length) {
    console.error('[bundle-budget] Fallos:', failures.join(' | '));
    process.exit(1);
  }

  console.log('[bundle-budget] OK');
}

main();
