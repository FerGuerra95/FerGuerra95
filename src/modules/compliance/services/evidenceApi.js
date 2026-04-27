const STORAGE_KEY = 'compliance_evidence_api_v1';

function safeRead(fallback = []) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function safeWrite(value) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    // En modo local/demo, si falla localStorage, no bloqueamos la app.
  }
}

function createId(prefix = 'evidence') {
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`;
}

export const evidenceApi = {
  list(fallback = []) {
    return safeRead(fallback);
  },

  saveAll(evidenceItems = []) {
    safeWrite(evidenceItems);
    return evidenceItems;
  },

  getById(id, fallback = []) {
    const evidenceItems = safeRead(fallback);
    return evidenceItems.find((item) => item.id === id) || null;
  },

  listBySupplier(supplierId, fallback = []) {
    const evidenceItems = safeRead(fallback);

    if (!supplierId) return evidenceItems;

    return evidenceItems.filter((item) => item.supplierId === supplierId);
  },

  listByAlert(alertId, fallback = []) {
    const evidenceItems = safeRead(fallback);

    if (!alertId) return evidenceItems;

    return evidenceItems.filter((item) => item.alertId === alertId);
  },

  create(payload, fallback = []) {
    const evidenceItems = safeRead(fallback);

    const evidence = {
      id: createId('evidence'),
      supplierId: payload?.supplierId || '',
      alertId: payload?.alertId || '',
      title: payload?.title || 'Nueva evidencia',
      sourceType: payload?.sourceType || 'manual',
      sourceUrl: payload?.sourceUrl || '',
      language: payload?.language || 'es',
      excerpt: payload?.excerpt || '',
      translatedExcerpt: payload?.translatedExcerpt || '',
      confidence: Number(payload?.confidence) || 0.7,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const next = [evidence, ...evidenceItems];
    safeWrite(next);

    return evidence;
  },

  update(id, patch = {}, fallback = []) {
    const evidenceItems = safeRead(fallback);

    const next = evidenceItems.map((item) =>
      item.id === id
        ? {
            ...item,
            ...patch,
            updatedAt: new Date().toISOString()
          }
        : item
    );

    safeWrite(next);

    return next.find((item) => item.id === id) || null;
  },

  remove(id, fallback = []) {
    const evidenceItems = safeRead(fallback);
    const next = evidenceItems.filter((item) => item.id !== id);

    safeWrite(next);

    return {
      deleted: true,
      id
    };
  },

  removeBySupplier(supplierId, fallback = []) {
    const evidenceItems = safeRead(fallback);
    const next = evidenceItems.filter((item) => item.supplierId !== supplierId);

    safeWrite(next);

    return {
      deleted: true,
      supplierId
    };
  },

  removeByAlert(alertId, fallback = []) {
    const evidenceItems = safeRead(fallback);
    const next = evidenceItems.filter((item) => item.alertId !== alertId);

    safeWrite(next);

    return {
      deleted: true,
      alertId
    };
  },

  clear() {
    safeWrite([]);
    return [];
  }
};