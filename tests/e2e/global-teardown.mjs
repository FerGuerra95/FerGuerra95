import {
  emitTestProvenance
} from '../../scripts/lib/test-isolation.mjs';

export default async function globalTeardown() {
  emitTestProvenance({ result: 'PLAYWRIGHT_TESTS_COMPLETE' });
}
