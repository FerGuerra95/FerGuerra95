import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import {
  DEFAULT_FINANCIALS,
  DEFAULT_SETTINGS,
  STORAGE_KEYS
} from '../engine/valuationFormulas.js';
import { maCasesApi } from '../services/maCasesApi.js';
import { useAuth } from '../../../app/providers/AuthProvider.jsx';

const MAStoreContext = createContext(null);

function getOrganizationId(user) {
  return user?.organizationId || 'org_demo';
}

function getUserId(user) {
  return user?.id || 'u_demo';
}

function attachOwnershipToCase(item, user) {
  const organizationId = getOrganizationId(user);
  const userId = getUserId(user);

  return {
    ...item,
    organizationId: item.organizationId || organizationId,
    userId: item.userId || userId
  };
}

function belongsToOrganization(item, organizationId) {
  if (!item) return false;

  /**
   * Compatibilidad con casos antiguos:
   * Si el caso no tenía organizationId, lo tratamos como legacy local
   * y lo asignamos a la organización actual al guardarlo de nuevo.
   */
  if (!item.organizationId) return true;

  return item.organizationId === organizationId;
}

function filterCasesByOrganization(cases = [], organizationId) {
  return Array.isArray(cases)
    ? cases.filter((item) => belongsToOrganization(item, organizationId))
    : [];
}

function mergeOrganizationCases({
  allCases = [],
  organizationCases = [],
  organizationId,
  user
}) {
  const casesFromOtherOrganizations = allCases.filter((item) => {
    if (!item.organizationId) return false;
    return item.organizationId !== organizationId;
  });

  const ownedCases = organizationCases.map((item) =>
    attachOwnershipToCase(
      {
        ...item,
        organizationId
      },
      user
    )
  );

  return [...ownedCases, ...casesFromOtherOrganizations];
}

export function MAStoreProvider({ children }) {
  const { user } = useAuth();

  const organizationId = getOrganizationId(user);

  const [financials, setFinancials] = useState(DEFAULT_FINANCIALS);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  /**
   * Primera carga síncrona desde localStorage.
   * Ahora filtrada por organizationId.
   */
  const [savedCases, setSavedCases] = useState(() => {
    const localCases = maCasesApi.list();
    return filterCasesByOrganization(localCases, organizationId).map((item) =>
      attachOwnershipToCase(item, user)
    );
  });

  const [backendStatus, setBackendStatus] = useState({
    isLoadingCases: false,
    lastSyncAt: null,
    error: null
  });

  const [analysis, setAnalysis] = useState({
    isAnalyzing: false,
    progress: 100,
    label: 'Listo para auditoría',
    showResults: true
  });

  /**
   * Cuando cambia el usuario/organización, recargamos casos locales
   * correspondientes a esa organización.
   */
  useEffect(() => {
    const localCases = maCasesApi.list();
    const organizationCases = filterCasesByOrganization(
      localCases,
      organizationId
    ).map((item) => attachOwnershipToCase(item, user));

    setSavedCases(organizationCases);
  }, [organizationId, user]);

  /**
   * Segunda carga asíncrona desde backend.
   * Si el backend responde, actualiza solo los casos de la organización actual.
   * Si falla, se mantiene localStorage.
   */
  useEffect(() => {
    let cancelled = false;

    async function hydrateCases() {
      setBackendStatus((prev) => ({
        ...prev,
        isLoadingCases: true,
        error: null
      }));

      try {
        const remoteCases = await maCasesApi.hydrateFromBackend();

        if (!cancelled && Array.isArray(remoteCases)) {
          const organizationCases = filterCasesByOrganization(
            remoteCases,
            organizationId
          ).map((item) => attachOwnershipToCase(item, user));

          setSavedCases(organizationCases);

          setBackendStatus({
            isLoadingCases: false,
            lastSyncAt: new Date().toISOString(),
            error: null
          });
        }
      } catch (error) {
        if (!cancelled) {
          setBackendStatus({
            isLoadingCases: false,
            lastSyncAt: null,
            error: error?.message || 'No se pudo sincronizar con backend'
          });
        }
      }
    }

    hydrateCases();

    return () => {
      cancelled = true;
    };
  }, [organizationId, user]);

  async function refreshSavedCases() {
    setBackendStatus((prev) => ({
      ...prev,
      isLoadingCases: true,
      error: null
    }));

    try {
      const remoteCases = await maCasesApi.hydrateFromBackend();

      const organizationCases = filterCasesByOrganization(
        remoteCases,
        organizationId
      ).map((item) => attachOwnershipToCase(item, user));

      setSavedCases(organizationCases);

      setBackendStatus({
        isLoadingCases: false,
        lastSyncAt: new Date().toISOString(),
        error: null
      });

      return organizationCases;
    } catch (error) {
      setBackendStatus({
        isLoadingCases: false,
        lastSyncAt: null,
        error: error?.message || 'No se pudo sincronizar con backend'
      });

      return savedCases;
    }
  }

  function updateSavedCases(nextCases) {
    const safeCases = Array.isArray(nextCases) ? nextCases : [];

    const allLocalCases = maCasesApi.list();

    const nextAllCases = mergeOrganizationCases({
      allCases: allLocalCases,
      organizationCases: safeCases,
      organizationId,
      user
    });

    const nextOrganizationCases = filterCasesByOrganization(
      nextAllCases,
      organizationId
    ).map((item) => attachOwnershipToCase(item, user));

    setSavedCases(nextOrganizationCases);
    maCasesApi.saveAll(nextAllCases);

    setBackendStatus((prev) => ({
      ...prev,
      lastSyncAt: new Date().toISOString()
    }));
  }

  const value = useMemo(
    () => ({
      financials,
      setFinancials,
      settings,
      setSettings,

      savedCases,
      setSavedCases,
      updateSavedCases,
      refreshSavedCases,

      backendStatus,

      analysis,
      setAnalysis,

      organizationId
    }),
    [
      financials,
      settings,
      savedCases,
      backendStatus,
      analysis,
      organizationId
    ]
  );

  return (
    <MAStoreContext.Provider value={value}>
      {children}
    </MAStoreContext.Provider>
  );
}

export function useMAStore() {
  const context = useContext(MAStoreContext);

  if (!context) {
    throw new Error('useMAStore debe usarse dentro de MAStoreProvider');
  }

  return context;
}

export { STORAGE_KEYS };