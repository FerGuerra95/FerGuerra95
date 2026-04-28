import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import { httpClient } from '../../shared/services/httpClient.js';

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
  CREATE_MA_REPORT: 'create:ma_report'
};

const ROLE_PERMISSIONS = {
  admin: ['*'],

  user: [
    PERMISSIONS.READ,

    PERMISSIONS.CREATE_SUPPLIER,
    PERMISSIONS.UPDATE_SUPPLIER,

    PERMISSIONS.CREATE_ALERT,
    PERMISSIONS.UPDATE_ALERT,

    PERMISSIONS.CREATE_EVIDENCE,
    PERMISSIONS.UPDATE_EVIDENCE,

    PERMISSIONS.CREATE_REVIEW,
    PERMISSIONS.UPDATE_REVIEW,
    PERMISSIONS.DECIDE_REVIEW,

    PERMISSIONS.CREATE_REPORT,

    PERMISSIONS.CREATE_MA_CASE,
    PERMISSIONS.UPDATE_MA_CASE,
    PERMISSIONS.CREATE_MA_REPORT
  ],

  viewer: [PERMISSIONS.READ]
};

function normalizeRole(role) {
  const normalizedRole = String(role || 'viewer').trim().toLowerCase();

  if (normalizedRole === 'admin') return 'admin';
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

      isDemoAuthEnabled: false,

      PERMISSIONS,

      can: (permission) => userCan(user, permission),
      hasRole: (...roles) => userHasRole(user, ...roles),

      login,
      logout
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