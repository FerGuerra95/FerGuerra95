import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import { httpClient } from '../../shared/services/httpClient.js';
import { IS_PUBLIC_DEMO_MODE } from '../../shared/config/demoMode.js';

const AuthContext = createContext(null);

const AUTH_STORAGE_KEY = 'ceo_os_auth_session';

export const PERMISSIONS = {
  READ: 'read',

  CREATE_SUPPLIER: 'create:supplier',
  UPDATE_SUPPLIER: 'update:supplier',
  DELETE_SUPPLIER: 'delete:supplier',

  CREATE_ALERT: 'create:alert',
  UPDATE_ALERT: 'update:alert',
  DELETE_ALERT: 'delete:alert',

  CREATE_EVIDENCE: 'create:evidence',
  UPDATE_EVIDENCE: 'update:evidence',
  DELETE_EVIDENCE: 'delete:evidence',
  RUN_COMPLIANCE_AUDIT: 'run:compliance_audit',

  CREATE_REVIEW: 'create:review',
  UPDATE_REVIEW: 'update:review',
  DECIDE_REVIEW: 'decide:review',
  DELETE_REVIEW: 'delete:review',

  CREATE_REPORT: 'create:report',
  UPDATE_REPORT: 'update:report',
  DELETE_REPORT: 'delete:report',

  CREATE_MA_CASE: 'create:ma_case',
  UPDATE_MA_CASE: 'update:ma_case',
  DELETE_MA_CASE: 'delete:ma_case',
  CREATE_MA_REPORT: 'create:ma_report',
  CREATE_MA_SHARE: 'create:ma_share',
  REVOKE_MA_SHARE: 'revoke:ma_share',
  MANAGE_MA_DATA_ROOM: 'manage:ma_data_room',
  CREATE_MA_DEAL: 'create:ma_deal',
  UPDATE_MA_DEAL: 'update:ma_deal',
  DELETE_MA_DEAL: 'delete:ma_deal',
  READ_AUDIT_LOG: 'read:audit_log',

  CREATE_FUNDING_SNAPSHOT: 'create:funding_snapshot',

  READ_PMI: 'read:pmi',
  CREATE_PMI: 'create:pmi',
  UPDATE_PMI: 'update:pmi',
  DELETE_PMI: 'delete:pmi',
  MANAGE_PMI_CASE: 'manage:pmi_case',
  CREATE_PMI_FROM_MA_DEAL: 'create:pmi_from_ma_deal',
  DUPLICATE_PMI_CASE: 'duplicate:pmi_case',
  READ_PMI_AUDIT: 'read:pmi_audit',
  UPDATE_PMI_WORKSTREAM: 'update:pmi_workstream',
  MANAGE_PMI_SYNERGY: 'manage:pmi_synergy',
  MANAGE_PMI_RISK: 'manage:pmi_risk',
  MANAGE_PMI_DAY1: 'manage:pmi_day1',
  EXPORT_PMI_REPORT: 'export:pmi_report',

  MANAGE_ECOSYSTEM_BRANCH: 'manage:ecosystem_branch',
  READ_BRIDGE: 'read:bridge',
  CREATE_BRIDGE_SIGNAL: 'create:bridge_signal',
  UPDATE_BRIDGE_SIGNAL: 'update:bridge_signal',
  RESOLVE_BRIDGE_SIGNAL: 'resolve:bridge_signal',
  DISMISS_BRIDGE_SIGNAL: 'dismiss:bridge_signal',
  MANAGE_BRIDGE_DEPENDENCY: 'manage:bridge_dependency',
  EXPORT_BRIDGE_REPORT: 'export:bridge_report',
  READ_GOVERNANCE: 'read:governance',
  CREATE_GOVERNANCE: 'create:governance',
  UPDATE_GOVERNANCE: 'update:governance',
  DELETE_GOVERNANCE: 'delete:governance',
  APPROVE_GOVERNANCE_DECISION: 'approve:governance_decision',
  MANAGE_GOVERNANCE_POLICY: 'manage:governance_policy',
  MANAGE_GOVERNANCE_COMMITTEE: 'manage:governance_committee',
  EXPORT_GOVERNANCE_REPORT: 'export:governance_report',

  READ_HERITAGE: 'read:heritage',
  CREATE_HERITAGE: 'create:heritage',
  UPDATE_HERITAGE: 'update:heritage',
  DELETE_HERITAGE: 'delete:heritage',
  MANAGE_HERITAGE_PROTECTION: 'manage:heritage_protection',
  MANAGE_HERITAGE_SUCCESSION: 'manage:heritage_succession',
  EXPORT_HERITAGE_REPORT: 'export:heritage_report',

  READ_RISK: 'read:risk',
  CREATE_RISK: 'create:risk',
  UPDATE_RISK: 'update:risk',
  DELETE_RISK: 'delete:risk',
  MANAGE_RISK_CONTROL: 'manage:risk_control',
  MANAGE_RISK_MITIGATION: 'manage:risk_mitigation',
  MANAGE_RISK_INCIDENT: 'manage:risk_incident',
  MANAGE_RISK_KRI: 'manage:risk_kri',
  MANAGE_RISK_APPETITE: 'manage:risk_appetite',
  EXPORT_RISK_REPORT: 'export:risk_report',

  READ_REPORTING: 'read:reporting',
  CREATE_REPORTING: 'create:reporting',
  UPDATE_REPORTING: 'update:reporting',
  EXPORT_REPORTING: 'export:reporting',

  READ_STRATEGY: 'read:strategy',
  CREATE_STRATEGY: 'create:strategy',
  UPDATE_STRATEGY: 'update:strategy',
  EXPORT_STRATEGY: 'export:strategy',

  READ_EXECUTIVE: 'read:executive',
  CREATE_EXECUTIVE_SIGNAL: 'create:executive_signal',
  UPDATE_EXECUTIVE_SIGNAL: 'update:executive_signal',
  MANAGE_EXECUTIVE_QUEUE: 'manage:executive_queue',
  EXPORT_EXECUTIVE_REPORT: 'export:executive_report'
};

const ROLE_PERMISSIONS = {
  admin: ['*'],

  board_member: [
    PERMISSIONS.READ,
    PERMISSIONS.READ_GOVERNANCE,
    PERMISSIONS.READ_HERITAGE,
    PERMISSIONS.READ_AUDIT_LOG,
    PERMISSIONS.READ_PMI,
    PERMISSIONS.READ_PMI_AUDIT,
    PERMISSIONS.READ_BRIDGE,
    PERMISSIONS.READ_RISK,
    PERMISSIONS.READ_REPORTING,
    PERMISSIONS.READ_STRATEGY,
    PERMISSIONS.READ_EXECUTIVE
  ],

  user: [
    PERMISSIONS.READ,

    PERMISSIONS.CREATE_SUPPLIER,
    PERMISSIONS.UPDATE_SUPPLIER,

    PERMISSIONS.CREATE_ALERT,
    PERMISSIONS.UPDATE_ALERT,

    PERMISSIONS.CREATE_EVIDENCE,
    PERMISSIONS.UPDATE_EVIDENCE,
    PERMISSIONS.RUN_COMPLIANCE_AUDIT,

    PERMISSIONS.CREATE_REVIEW,
    PERMISSIONS.UPDATE_REVIEW,
    PERMISSIONS.DECIDE_REVIEW,

    PERMISSIONS.CREATE_REPORT,

    PERMISSIONS.CREATE_MA_CASE,
    PERMISSIONS.UPDATE_MA_CASE,
    PERMISSIONS.CREATE_MA_REPORT,
    PERMISSIONS.CREATE_MA_SHARE,
    PERMISSIONS.REVOKE_MA_SHARE,
    PERMISSIONS.MANAGE_MA_DATA_ROOM,
    PERMISSIONS.CREATE_MA_DEAL,
    PERMISSIONS.UPDATE_MA_DEAL,
    PERMISSIONS.READ_AUDIT_LOG,

    PERMISSIONS.CREATE_FUNDING_SNAPSHOT,

    PERMISSIONS.READ_PMI,
    PERMISSIONS.CREATE_PMI,
    PERMISSIONS.UPDATE_PMI,
    PERMISSIONS.MANAGE_PMI_CASE,
    PERMISSIONS.CREATE_PMI_FROM_MA_DEAL,
    PERMISSIONS.DUPLICATE_PMI_CASE,
    PERMISSIONS.READ_PMI_AUDIT,
    PERMISSIONS.UPDATE_PMI_WORKSTREAM,
    PERMISSIONS.MANAGE_PMI_SYNERGY,
    PERMISSIONS.MANAGE_PMI_RISK,
    PERMISSIONS.MANAGE_PMI_DAY1,
    PERMISSIONS.EXPORT_PMI_REPORT,
    PERMISSIONS.MANAGE_ECOSYSTEM_BRANCH,
    PERMISSIONS.READ_BRIDGE,
    PERMISSIONS.CREATE_BRIDGE_SIGNAL,
    PERMISSIONS.UPDATE_BRIDGE_SIGNAL,
    PERMISSIONS.RESOLVE_BRIDGE_SIGNAL,
    PERMISSIONS.DISMISS_BRIDGE_SIGNAL,
    PERMISSIONS.MANAGE_BRIDGE_DEPENDENCY,
    PERMISSIONS.EXPORT_BRIDGE_REPORT,
    PERMISSIONS.READ_GOVERNANCE,
    PERMISSIONS.CREATE_GOVERNANCE,
    PERMISSIONS.UPDATE_GOVERNANCE,
    PERMISSIONS.MANAGE_GOVERNANCE_POLICY,
    PERMISSIONS.MANAGE_GOVERNANCE_COMMITTEE,
    PERMISSIONS.EXPORT_GOVERNANCE_REPORT,

    PERMISSIONS.READ_HERITAGE,
    PERMISSIONS.CREATE_HERITAGE,
    PERMISSIONS.UPDATE_HERITAGE,
    PERMISSIONS.MANAGE_HERITAGE_PROTECTION,
    PERMISSIONS.MANAGE_HERITAGE_SUCCESSION,
    PERMISSIONS.EXPORT_HERITAGE_REPORT,

    PERMISSIONS.READ_RISK,
    PERMISSIONS.CREATE_RISK,
    PERMISSIONS.UPDATE_RISK,
    PERMISSIONS.MANAGE_RISK_CONTROL,
    PERMISSIONS.MANAGE_RISK_MITIGATION,
    PERMISSIONS.MANAGE_RISK_INCIDENT,
    PERMISSIONS.MANAGE_RISK_KRI,
    PERMISSIONS.MANAGE_RISK_APPETITE,
    PERMISSIONS.EXPORT_RISK_REPORT,

    PERMISSIONS.READ_REPORTING,
    PERMISSIONS.CREATE_REPORTING,
    PERMISSIONS.UPDATE_REPORTING,
    PERMISSIONS.EXPORT_REPORTING,

    PERMISSIONS.READ_STRATEGY,
    PERMISSIONS.CREATE_STRATEGY,
    PERMISSIONS.UPDATE_STRATEGY,
    PERMISSIONS.EXPORT_STRATEGY,

    PERMISSIONS.READ_EXECUTIVE,
    PERMISSIONS.CREATE_EXECUTIVE_SIGNAL,
    PERMISSIONS.UPDATE_EXECUTIVE_SIGNAL,
    PERMISSIONS.MANAGE_EXECUTIVE_QUEUE,
    PERMISSIONS.EXPORT_EXECUTIVE_REPORT
  ],

  viewer: [
    PERMISSIONS.READ,
    PERMISSIONS.READ_GOVERNANCE,
    PERMISSIONS.READ_HERITAGE,
    PERMISSIONS.READ_PMI,
    PERMISSIONS.READ_BRIDGE,
    PERMISSIONS.READ_RISK,
    PERMISSIONS.READ_REPORTING,
    PERMISSIONS.READ_STRATEGY,
    PERMISSIONS.READ_EXECUTIVE
  ]
};

function normalizeRole(role) {
  const normalizedRole = String(role || 'viewer').trim().toLowerCase();

  if (normalizedRole === 'admin') return 'admin';
  if (normalizedRole === 'board_member') return 'board_member';
  if (normalizedRole === 'user') return 'user';
  if (normalizedRole === 'viewer') return 'viewer';

  return 'viewer';
}

function getPermissionsForRole(role) {
  const normalizedRole = normalizeRole(role);
  return ROLE_PERMISSIONS[normalizedRole] || ROLE_PERMISSIONS.viewer;
}

function userCan(user, permission) {
  if (!user || !permission) return false;

  const permissions = getPermissionsForRole(user.role);

  return permissions.includes('*') || permissions.includes(permission);
}

function userHasRole(user, ...roles) {
  if (!user) return false;

  const currentRole = normalizeRole(user.role);
  const allowedRoles = roles.map((role) => normalizeRole(role));

  return allowedRoles.includes(currentRole);
}

function sanitizeUser(user) {
  if (!user) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: normalizeRole(user.role),
    organizationId: user.organizationId,
    workspaces: Array.isArray(user.workspaces) ? user.workspaces : []
  };
}

function extractData(payload) {
  if (!payload) return null;
  return payload.data ?? payload;
}

function readStoredSession() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);

    if (!raw) return null;

    const parsed = JSON.parse(raw);

    if (!parsed?.user || !parsed?.token) return null;

    return parsed;
  } catch {
    return null;
  }
}

function writeStoredSession(user, token = '') {
  try {
    localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({
        user,
        mode: 'backend',
        token,
        createdAt: new Date().toISOString()
      })
    );
  } catch {
    // Si localStorage falla, no bloqueamos la app.
  }
}

function clearStoredSession() {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch {
    // Si localStorage falla, no bloqueamos logout.
  }
}

async function loginWithBackend({ email, password }) {
  const payload = await httpClient.post('/auth/login', {
    email: String(email || '').trim().toLowerCase(),
    password: String(password || '').trim()
  });

  const data = extractData(payload);

  const token = data?.token || data?.accessToken || payload?.token || '';
  const rawUser = data?.user || data;

  if (!token) {
    throw new Error('Respuesta de login sin token.');
  }

  if (!rawUser?.id) {
    throw new Error('Respuesta de login inválida.');
  }

  const safeUser = sanitizeUser(rawUser);

  if (!safeUser?.organizationId) {
    throw new Error('Usuario sin organización asignada.');
  }

  httpClient.setAuthToken(token);

  return {
    ok: true,
    user: safeUser,
    token,
    mode: 'backend'
  };
}

async function fetchCurrentUserFromBackend() {
  const token = httpClient.getAuthToken();

  if (!token) return null;

  const payload = await httpClient.get('/auth/me');
  const data = extractData(payload);
  const rawUser = data?.user || data;

  if (!rawUser?.id) return null;

  const safeUser = sanitizeUser(rawUser);

  if (!safeUser?.organizationId) return null;

  return safeUser;
}

function shouldRestoreStoredSession(storedSession) {
  return Boolean(
    storedSession?.user &&
      storedSession?.token &&
      storedSession?.mode === 'backend'
  );
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState('backend');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function hydrateSession() {
      setIsLoading(true);

      const storedSession = readStoredSession();

      if (!shouldRestoreStoredSession(storedSession)) {
        clearStoredSession();
        httpClient.clearAuthToken();

        if (!cancelled) {
          setUser(null);
          setAuthMode('backend');
          setIsLoading(false);
        }

        return;
      }

      httpClient.setAuthToken(storedSession.token);

      try {
        const backendUser = await fetchCurrentUserFromBackend();

        if (!backendUser) {
          throw new Error('Sesión inválida.');
        }

        if (!cancelled) {
          setUser(backendUser);
          setAuthMode('backend');
          writeStoredSession(backendUser, storedSession.token);
          setIsLoading(false);
        }
      } catch {
        clearStoredSession();
        httpClient.clearAuthToken();

        if (!cancelled) {
          setUser(null);
          setAuthMode('backend');
          setIsLoading(false);
        }
      }
    }

    hydrateSession();

    return () => {
      cancelled = true;
    };
  }, []);

  async function completeSessionWithToken(token) {
    clearStoredSession();
    httpClient.clearAuthToken();
    setUser(null);
    setAuthMode('backend');

    const normalized = String(token || '').trim();

    if (!normalized) {
      return {
        ok: false,
        message: 'Token de sesión no válido.'
      };
    }

    try {
      httpClient.setAuthToken(normalized);
      const backendUser = await fetchCurrentUserFromBackend();

      if (!backendUser) {
        throw new Error('Sesión inválida.');
      }

      setUser(backendUser);
      setAuthMode('backend');
      writeStoredSession(backendUser, normalized);

      return {
        ok: true,
        user: backendUser,
        token: normalized,
        mode: 'backend'
      };
    } catch {
      clearStoredSession();
      httpClient.clearAuthToken();
      setUser(null);
      setAuthMode('backend');

      return {
        ok: false,
        message: 'No se pudo validar la sesión SSO.'
      };
    }
  }

  async function login({ email, password }) {
    clearStoredSession();
    httpClient.clearAuthToken();
    setUser(null);
    setAuthMode('backend');

    try {
      const backendResult = await loginWithBackend({
        email,
        password
      });

      setUser(backendResult.user);
      setAuthMode('backend');
      writeStoredSession(backendResult.user, backendResult.token || '');

      return backendResult;
    } catch {
      setUser(null);
      setAuthMode('backend');
      clearStoredSession();
      httpClient.clearAuthToken();

      return {
        ok: false,
        message: 'Email o contraseña incorrectos.'
      };
    }
  }

  function logout() {
    setUser(null);
    setAuthMode('backend');
    clearStoredSession();
    httpClient.clearAuthToken();
  }

  useEffect(() => {
    function handleAuthExpired() {
      logout();
    }

    window.addEventListener('ceos:auth-expired', handleAuthExpired);

    return () => {
      window.removeEventListener('ceos:auth-expired', handleAuthExpired);
    };
  }, []);

  const role = normalizeRole(user?.role);
  const permissions = getPermissionsForRole(role);

  const value = useMemo(
    () => ({
      user,
      role,
      permissions,
      authMode,
      isLoading,
      isAuthenticated: Boolean(user),

      isAdmin: role === 'admin',
      isUser: role === 'user',
      isViewer: role === 'viewer',

      isDemoAuthEnabled: IS_PUBLIC_DEMO_MODE,

      PERMISSIONS,

      can: (permission) => userCan(user, permission),
      hasRole: (...roles) => userHasRole(user, ...roles),

      login,
      logout,
      completeSessionWithToken
    }),
    [user, role, permissions, authMode, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }

  return context;
}
