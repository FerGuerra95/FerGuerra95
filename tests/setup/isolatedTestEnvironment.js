import { afterAll, afterEach } from 'vitest';

import {
  applyTestEnvironment,
  cleanupIsolatedTestEnvironment,
  createIsolatedTestEnvironment,
  emitTestProvenance
} from '../../scripts/lib/test-isolation.mjs';

const testEnvironment = createIsolatedTestEnvironment({
  label: 'vitest'
});
const capturedEnvironment = Object.freeze({
  ...testEnvironment.environment
});

applyTestEnvironment(capturedEnvironment);
emitTestProvenance({
  result: 'STARTED',
  env: capturedEnvironment
});

if (
  typeof window !== 'undefined' &&
  typeof window.matchMedia !== 'function'
) {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: (query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener() {},
      removeListener() {},
      addEventListener() {},
      removeEventListener() {},
      dispatchEvent() {
        return false;
      }
    })
  });
}

afterEach(async () => {
  try {
    if (typeof document !== 'undefined') {
      const { cleanup } = await import('@testing-library/react');
      cleanup();
    }
  } finally {
    applyTestEnvironment(capturedEnvironment);
  }
});

afterAll(async () => {
  try {
    const { closeDatabase } = await import('../../backend/storage/sqliteStorage.js');
    closeDatabase();
  } finally {
    try {
      emitTestProvenance({
        result: 'TEARDOWN_COMPLETE',
        env: capturedEnvironment
      });
    } finally {
      cleanupIsolatedTestEnvironment(testEnvironment);
    }
  }
});
