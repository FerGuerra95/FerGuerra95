import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import {
  DEFAULT_FUNDING_INPUTS,
  DEFAULT_FUNDING_SETTINGS
} from '../engine/fundingFormulas.js';
import { fundingApi } from '../services/fundingApi.js';
import { useAuth } from '../../../app/providers/AuthProvider.jsx';

const FundingStoreContext = createContext(null);

const FUNDING_ORG_STORAGE_PREFIX = 'funding_draft_by_org_v1';

function getOrganizationId(user) {
  return user?.organizationId || 'org_demo';
}

function getUserId(user) {
  return user?.id || 'u_demo';
}

function getOrganizationStorageKey(organizationId) {
  return `${FUNDING_ORG_STORAGE_PREFIX}_${organizationId}`;
}

function buildDefaultDraft(user) {
  return {
    fundingInputs: {
      ...DEFAULT_FUNDING_INPUTS
    },
    fundingSettings: {
      ...DEFAULT_FUNDING_SETTINGS
    },
    organizationId: getOrganizationId(user),
    userId: getUserId(user),
    updatedAt: new Date().toISOString()
  };
}

function normalizeDraft(draft, user) {
  const organizationId = getOrganizationId(user);
  const userId = getUserId(user);

  return {
    fundingInputs: {
      ...DEFAULT_FUNDING_INPUTS,
      ...(draft?.fundingInputs || {})
    },
    fundingSettings: {
      ...DEFAULT_FUNDING_SETTINGS,
      ...(draft?.fundingSettings || {})
    },
    organizationId: draft?.organizationId || organizationId,
    userId: draft?.userId || userId,
    updatedAt: draft?.updatedAt || new Date().toISOString()
  };
}

function safeReadOrganizationDraft(user) {
  const organizationId = getOrganizationId(user);
  const storageKey = getOrganizationStorageKey(organizationId);

  try {
    if (typeof localStorage === 'undefined') {
      return buildDefaultDraft(user);
    }

    const raw = localStorage.getItem(storageKey);

    if (raw) {
      const parsed = JSON.parse(raw);
      return normalizeDraft(parsed, user);
    }

    /**
     * Compatibilidad con drafts antiguos:
     * si existía un draft global previo de fundingApi, lo usamos como base
     * para la organización actual y luego se guardará ya separado por org.
     */
    const legacyDraft = fundingApi.loadDraft?.();

    if (legacyDraft?.fundingInputs || legacyDraft?.fundingSettings) {
      return normalizeDraft(legacyDraft, user);
    }

    return buildDefaultDraft(user);
  } catch {
    return buildDefaultDraft(user);
  }
}

function safeWriteOrganizationDraft({ fundingInputs, fundingSettings, user }) {
  const organizationId = getOrganizationId(user);
  const userId = getUserId(user);
  const storageKey = getOrganizationStorageKey(organizationId);

  const draft = {
    fundingInputs: {
      ...DEFAULT_FUNDING_INPUTS,
      ...(fundingInputs || {})
    },
    fundingSettings: {
      ...DEFAULT_FUNDING_SETTINGS,
      ...(fundingSettings || {})
    },
    organizationId,
    userId,
    updatedAt: new Date().toISOString()
  };

  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(storageKey, JSON.stringify(draft));
    }
  } catch {
    // Si localStorage falla, la app sigue funcionando en memoria.
  }

  return draft;
}

export function FundingStoreProvider({ children }) {
  const { user } = useAuth();
  const organizationId = getOrganizationId(user);

  const initialDraft = safeReadOrganizationDraft(user);

  const [fundingInputs, setFundingInputs] = useState(
    initialDraft.fundingInputs || DEFAULT_FUNDING_INPUTS
  );

  const [fundingSettings, setFundingSettings] = useState(
    initialDraft.fundingSettings || DEFAULT_FUNDING_SETTINGS
  );

  const [lastSavedAt, setLastSavedAt] = useState(
    initialDraft.updatedAt || null
  );

  useEffect(() => {
    const nextDraft = safeReadOrganizationDraft(user);

    setFundingInputs(nextDraft.fundingInputs || DEFAULT_FUNDING_INPUTS);
    setFundingSettings(nextDraft.fundingSettings || DEFAULT_FUNDING_SETTINGS);
    setLastSavedAt(nextDraft.updatedAt || null);
  }, [organizationId, user]);

  useEffect(() => {
    const savedDraft = safeWriteOrganizationDraft({
      fundingInputs,
      fundingSettings,
      user
    });

    setLastSavedAt(savedDraft.updatedAt);
  }, [fundingInputs, fundingSettings, user]);

  const value = useMemo(
    () => ({
      fundingInputs,
      setFundingInputs,
      fundingSettings,
      setFundingSettings,
      organizationId,
      lastSavedAt
    }),
    [fundingInputs, fundingSettings, organizationId, lastSavedAt]
  );

  return (
    <FundingStoreContext.Provider value={value}>
      {children}
    </FundingStoreContext.Provider>
  );
}

export function useFundingStore() {
  const context = useContext(FundingStoreContext);

  if (!context) {
    throw new Error(
      'useFundingStore debe usarse dentro de FundingStoreProvider'
    );
  }

  return context;
}