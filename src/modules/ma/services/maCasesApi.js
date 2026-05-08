import { httpClient } from '../../../shared/services/httpClient.js';

const CASES_KEY = 'ma_mvp_cases_v1';

const LOCAL_FALLBACK_REQUESTED =
  import.meta.env.VITE_ENABLE_MA_LOCAL_FALLBACK === 'true';

if (import.meta.env.PROD && LOCAL_FALLBACK_REQUESTED) {
  throw new Error(
    'VITE_ENABLE_MA_LOCAL_FALLBACK cannot be enabled in production builds.'
  );
}

const ALLOW_LOCAL_FALLBACK =
  !import.meta.env.PROD && LOCAL_FALLBACK_REQUESTED;

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
    // En desarrollo no bloqueamos la app si localStorage falla.
  }
}

function syncLocalFallback(cases = []) {
  if (!ALLOW_LOCAL_FALLBACK) return;

  safeWriteLocal(cases);
}

function readLocalFallback() {
  return ALLOW_LOCAL_FALLBACK ? safeReadLocal() : [];
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

function warnLocalFallback(error, context = 'M&A backend unavailable') {
  if (!ALLOW_LOCAL_FALLBACK) return;

  console.warn(`${context}. Using localStorage fallback.`, error);
}

export const maCasesApi = {
  list() {
    return readLocalFallback();
  },

  async listRemote() {
    const payload = await httpClient.get('/ma/cases');
    return extractCollection(payload);
  },

  async hydrateFromBackend() {
    try {
      const remoteCases = await this.listRemote();
      syncLocalFallback(remoteCases);
      return remoteCases;
    } catch (error) {
      if (ALLOW_LOCAL_FALLBACK) {
        warnLocalFallback(error, 'Could not hydrate M&A cases from backend');
        return safeReadLocal();
      }

      throw error;
    }
  },

  async getById(id) {
    if (!id) return null;

    try {
      const payload = await httpClient.get(`/ma/cases/${id}`);
      return extractData(payload);
    } catch (error) {
      if (ALLOW_LOCAL_FALLBACK) {
        warnLocalFallback(error, 'Could not fetch M&A case from backend');

        return safeReadLocal().find((item) => item.id === id) || null;
      }

      throw error;
    }
  },

  saveAll(cases = []) {
    const safeCases = Array.isArray(cases) ? cases.filter(Boolean) : [];

    syncLocalFallback(safeCases);

    this.saveAllRemote(safeCases).catch((error) => {
      if (ALLOW_LOCAL_FALLBACK) {
        warnLocalFallback(error, 'Could not sync all M&A cases to backend');
        return;
      }

      console.error('M&A cases were not saved to backend.', error);
    });

    return safeCases;
  },

  async saveAllRemote(cases = []) {
    const safeCases = Array.isArray(cases) ? cases.filter(Boolean) : [];
    const results = [];

    for (const item of safeCases) {
      try {
        const saved = await this.saveCase(item);
        if (saved) results.push(saved);
      } catch (error) {
        if (ALLOW_LOCAL_FALLBACK) {
          warnLocalFallback(error, `Could not sync M&A case ${item?.id || ''}`);
          continue;
        }

        throw error;
      }
    }

    return results;
  },

  async saveCase(caseItem) {
    if (!caseItem) return null;

    try {
      const createdPayload = await httpClient.post('/ma/cases', caseItem);
      const savedCase = extractData(createdPayload);

      if (savedCase) {
        const localCases = safeReadLocal();
        const exists = localCases.some((item) => item.id === savedCase.id);

        const next = exists
          ? localCases.map((item) => (item.id === savedCase.id ? savedCase : item))
          : [savedCase, ...localCases];

        syncLocalFallback(next.filter(Boolean));
      }

      return savedCase;
    } catch (createError) {
      if (!caseItem.id) {
        if (ALLOW_LOCAL_FALLBACK) {
          warnLocalFallback(createError, 'Could not create M&A case in backend');
          syncLocalFallback([caseItem, ...safeReadLocal()]);
          return caseItem;
        }

        throw createError;
      }

      try {
        const updatedPayload = await httpClient.patch(
          `/ma/cases/${caseItem.id}`,
          caseItem
        );

        const savedCase = extractData(updatedPayload);

        if (savedCase) {
          const localCases = safeReadLocal();
          const exists = localCases.some((item) => item.id === savedCase.id);

          const next = exists
            ? localCases.map((item) => (item.id === savedCase.id ? savedCase : item))
            : [savedCase, ...localCases];

          syncLocalFallback(next.filter(Boolean));
        }

        return savedCase;
      } catch (updateError) {
        if (ALLOW_LOCAL_FALLBACK) {
          warnLocalFallback(updateError, 'Could not update M&A case in backend');

          const localCases = safeReadLocal();
          const exists = localCases.some((item) => item.id === caseItem.id);

          const next = exists
            ? localCases.map((item) => (item.id === caseItem.id ? caseItem : item))
            : [caseItem, ...localCases];

          syncLocalFallback(next.filter(Boolean));

          return caseItem;
        }

        throw updateError;
      }
    }
  },

  async remove(id) {
    if (!id) return { deleted: false, id };

    if (ALLOW_LOCAL_FALLBACK) {
      const localCases = safeReadLocal().filter((item) => item.id !== id);
      safeWriteLocal(localCases);
    }

    try {
      const payload = await httpClient.delete(`/ma/cases/${id}`);
      return extractData(payload);
    } catch (error) {
      if (ALLOW_LOCAL_FALLBACK) {
        warnLocalFallback(error, 'Could not delete M&A case in backend');
        return { deleted: true, id };
      }

      throw error;
    }
  },

  clearLocal() {
    safeWriteLocal([]);
    return [];
  }
};
