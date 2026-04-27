const STORAGE_KEY = 'compliance_suppliers_api_v1';

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

function createId(prefix = 'supplier') {
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`;
}

export const suppliersApi = {
  list(fallback = []) {
    return safeRead(fallback);
  },

  saveAll(suppliers = []) {
    safeWrite(suppliers);
    return suppliers;
  },

  getById(id, fallback = []) {
    const suppliers = safeRead(fallback);
    return suppliers.find((supplier) => supplier.id === id) || null;
  },

  create(payload, fallback = []) {
    const suppliers = safeRead(fallback);

    const supplier = {
      id: createId('supplier'),
      name: payload?.name || 'Nuevo proveedor',
      country: payload?.country || 'Sin país',
      region: payload?.region || 'Sin región',
      tier: payload?.tier || 'Tier 1',
      sector: payload?.sector || 'General',
      criticality: payload?.criticality || 'Media',
      spend: Number(payload?.spend) || 0,
      status: payload?.status || 'active',
      riskScore: Number(payload?.riskScore) || 50,
      resilienceScore: Number(payload?.resilienceScore) || 50,
      lastReviewAt: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    const next = [supplier, ...suppliers];
    safeWrite(next);

    return supplier;
  },

  update(id, patch = {}, fallback = []) {
    const suppliers = safeRead(fallback);

    const next = suppliers.map((supplier) =>
      supplier.id === id
        ? {
            ...supplier,
            ...patch,
            updatedAt: new Date().toISOString()
          }
        : supplier
    );

    safeWrite(next);

    return next.find((supplier) => supplier.id === id) || null;
  },

  remove(id, fallback = []) {
    const suppliers = safeRead(fallback);
    const next = suppliers.filter((supplier) => supplier.id !== id);

    safeWrite(next);

    return {
      deleted: true,
      id
    };
  },

  clear() {
    safeWrite([]);
    return [];
  }
};