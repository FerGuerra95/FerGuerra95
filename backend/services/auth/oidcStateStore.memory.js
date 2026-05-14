const memoryStore = new Map();

function cleanupMemoryStore() {
  const t = Date.now();
  for (const [k, v] of memoryStore) {
    if (v.expires < t) memoryStore.delete(k);
  }
}

export function saveMemoryState(state, payload) {
  cleanupMemoryStore();
  memoryStore.set(state, payload);
}

export function takeMemoryState(state) {
  cleanupMemoryStore();
  const stored = memoryStore.get(state) || null;
  memoryStore.delete(state);
  if (!stored || stored.expires < Date.now()) {
    return null;
  }
  return stored;
}
