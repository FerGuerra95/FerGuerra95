const STORAGE_KEY = 'compliance_alerts_api_v1';

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

function createId(prefix = 'alert') {
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`;
}

export const alertsApi = {
  list(fallback = []) {
    return safeRead(fallback);
  },

  saveAll(alerts = []) {
    safeWrite(alerts);
    return alerts;
  },

  getById(id, fallback = []) {
    const alerts = safeRead(fallback);
    return alerts.find((alert) => alert.id === id) || null;
  },

  listBySupplier(supplierId, fallback = []) {
    const alerts = safeRead(fallback);

    if (!supplierId) return alerts;

    return alerts.filter((alert) => alert.supplierId === supplierId);
  },

  create(payload, fallback = []) {
    const alerts = safeRead(fallback);

    const alert = {
      id: createId('alert'),
      supplierId: payload?.supplierId || '',
      title: payload?.title || 'Nueva alerta',
      category: payload?.category || 'General Risk',
      severity: payload?.severity || 'medium',
      status: payload?.status || 'open',
      source: payload?.source || 'Manual',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      description: payload?.description || ''
    };

    const next = [alert, ...alerts];
    safeWrite(next);

    return alert;
  },

  update(id, patch = {}, fallback = []) {
    const alerts = safeRead(fallback);

    const next = alerts.map((alert) =>
      alert.id === id
        ? {
            ...alert,
            ...patch,
            updatedAt: new Date().toISOString()
          }
        : alert
    );

    safeWrite(next);

    return next.find((alert) => alert.id === id) || null;
  },

  updateStatus(id, status, fallback = []) {
    return this.update(
      id,
      {
        status,
        updatedAt: new Date().toISOString()
      },
      fallback
    );
  },

  remove(id, fallback = []) {
    const alerts = safeRead(fallback);
    const next = alerts.filter((alert) => alert.id !== id);

    safeWrite(next);

    return {
      deleted: true,
      id
    };
  },

  removeBySupplier(supplierId, fallback = []) {
    const alerts = safeRead(fallback);
    const next = alerts.filter((alert) => alert.supplierId !== supplierId);

    safeWrite(next);

    return {
      deleted: true,
      supplierId
    };
  },

  clear() {
    safeWrite([]);
    return [];
  }
};