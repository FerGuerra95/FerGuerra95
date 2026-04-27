import { httpClient } from '../../../shared/services/httpClient.js';

const CASES_KEY = 'ma_mvp_cases_v1';

function safeReadLocal() {
  try {
    if (typeof localStorage === 'undefined') return [];

    const raw = localStorage.getItem(CASES_KEY);
    const parsed = raw ? JSON.parse(raw) : [];

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function safeWriteLocal(cases = []) {
  try {
    if (typeof localStorage === 'undefined') return;

    localStorage.setItem(CASES_KEY, JSON.stringify(cases));
  } catch {
    // Si localStorage falla, no bloqueamos la app.
  }
}

function extractData(payload) {
  if (!payload) return null;
  return payload.data ?? payload;
}

function extractCollection(payload) {
  const data = extractData(payload);

  if (Array.isArray(data)) return data;

  if (Array.isArray(data?.items)) return data.items;

  return [];
}

async function tryBackend(action, fallback) {
  try {
    return await action();
  } catch {
    return fallback;
  }
}

export const maCasesApi = {
  list() {
    return safeReadLocal();
  },

  async listRemote() {
    const payload = await httpClient.get('/ma/cases');
    return extractCollection(payload);
  },

  async hydrateFromBackend() {
    return tryBackend(async () => {
      const remoteCases = await this.listRemote();
      safeWriteLocal(remoteCases);
      return remoteCases;
    }, safeReadLocal());
  },

  async getById(id) {
    if (!id) return null;

    const payload = await httpClient.get(`/ma/cases/${id}`);
    return extractData(payload);
  },

  saveAll(cases = []) {
    safeWriteLocal(cases);

    this.saveAllRemote(cases).catch(() => {
      // Backend apagado o error de red: mantenemos localStorage.
    });

    return cases;
  },

  async saveAllRemote(cases = []) {
    const results = [];

    for (const item of cases) {
      try {
        const saved = await this.saveCase(item);
        if (saved) results.push(saved);
      } catch {
        // No bloqueamos por un caso fallido.
      }
    }

    return results;
  },

  async saveCase(caseItem) {
    if (!caseItem) return null;

    let savedCase = null;

    /**
     * Primero intentamos crear con POST.
     * En este MVP, aunque el caso ya traiga id desde frontend,
     * POST debe permitir crearlo en backend.
     */
    try {
      const createdPayload = await httpClient.post('/ma/cases', caseItem);
      savedCase = extractData(createdPayload);
    } catch {
      /**
       * Si el backend responde que ya existe, intentamos actualizar con PUT.
       */
      if (caseItem.id) {
        const updatedPayload = await httpClient.put(
          `/ma/cases/${caseItem.id}`,
          caseItem
        );

        savedCase = extractData(updatedPayload);
      }
    }

    if (!savedCase) {
      savedCase = caseItem;
    }

    const localCases = safeReadLocal();
    const exists = localCases.some((item) => item.id === savedCase.id);

    const next = exists
      ? localCases.map((item) => (item.id === savedCase.id ? savedCase : item))
      : [savedCase, ...localCases];

    safeWriteLocal(next.filter(Boolean));

    return savedCase;
  },

  async remove(id) {
    if (!id) return { deleted: false, id };

    const localCases = safeReadLocal().filter((item) => item.id !== id);
    safeWriteLocal(localCases);

    return tryBackend(async () => {
      const payload = await httpClient.delete(`/ma/cases/${id}`);
      return extractData(payload);
    }, { deleted: true, id });
  },

  clearLocal() {
    safeWriteLocal([]);
    return [];
  }
};