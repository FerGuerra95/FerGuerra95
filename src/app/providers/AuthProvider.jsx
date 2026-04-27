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

const DEMO_USERS = [
  {
    id: 'u_demo_admin',
    name: 'Fernando',
    email: 'admin@ceoos.local',
    password: 'admin123',
    role: 'admin',
    organizationId: 'org_demo',
    workspaces: ['ma', 'compliance', 'funding']
  },
  {
    id: 'u_demo_user',
    name: 'Usuario Demo',
    email: 'user@ceoos.local',
    password: 'user123',
    role: 'user',
    organizationId: 'org_demo_2',
    workspaces: ['ma', 'compliance', 'funding']
  },
  {
    id: 'u_demo_viewer',
    name: 'Viewer Demo',
    email: 'viewer@ceoos.local',
    password: 'viewer123',
    role: 'viewer',
    organizationId: 'org_demo_3',
    workspaces: ['ma', 'compliance', 'funding']
  }
];

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

    if (!parsed?.user) return null;

    return parsed;
  } catch {
    return null;
  }
}

function writeStoredSession(user, mode = 'local', token = '') {
  try {
    localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({
        user,
        mode,
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

function loginWithDemoUser({ email, password }) {
  const normalizedEmail = String(email || '').trim().toLowerCase();
  const normalizedPassword = String(password || '').trim();

  const matchedUser = DEMO_USERS.find((item) => {
    return (
      item.email.toLowerCase() === normalizedEmail &&
      item.password === normalizedPassword
    );
  });

  if (!matchedUser) {
    return {
      ok: false,
      message: 'Email o contraseña incorrectos.'
    };
  }

  const safeUser = sanitizeUser(matchedUser);

  return {
    ok: true,
    user: safeUser,
    token: '',
    mode: 'local'
  };
}

async function loginWithBackend({ email, password }) {
  const payload = await httpClient.post('/auth/login', {
    email: String(email || '').trim().toLowerCase(),
    password: String(password || '').trim()
  });

  const data = extractData(payload);

  const token = data?.token || data?.accessToken || payload?.token || '';
  const rawUser = data?.user || data;

  if (!rawUser?.id) {
    throw new Error('Respuesta de login inválida.');
  }

  const safeUser = sanitizeUser(rawUser);

  if (token) {
    httpClient.setAuthToken(token);
  }

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

  return sanitizeUser(rawUser);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState('local');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function hydrateSession() {
      setIsLoading(true);

      const storedSession = readStoredSession();

      if (storedSession?.token) {
        httpClient.setAuthToken(storedSession.token);
      }

      try {
        const backendUser = await fetchCurrentUserFromBackend();

        if (!cancelled && backendUser) {
          setUser(backendUser);
          setAuthMode('backend');
          writeStoredSession(
            backendUser,
            'backend',
            storedSession?.token || httpClient.getAuthToken?.() || ''
          );
          setIsLoading(false);
          return;
        }
      } catch {
        // Si el backend no responde, mantenemos sesión local si existe.
      }

      if (!cancelled && storedSession?.user) {
        setUser(sanitizeUser(storedSession.user));
        setAuthMode(storedSession.mode || 'local');
      }

      if (!cancelled) {
        setIsLoading(false);
      }
    }

    hydrateSession();

    return () => {
      cancelled = true;
    };
  }, []);

  async function login({ email, password }) {
    try {
      const backendResult = await loginWithBackend({
        email,
        password
      });

      setUser(backendResult.user);
      setAuthMode('backend');
      writeStoredSession(
        backendResult.user,
        'backend',
        backendResult.token || ''
      );

      return backendResult;
    } catch {
      const demoResult = loginWithDemoUser({
        email,
        password
      });

      if (!demoResult.ok) {
        return {
          ok: false,
          message: 'Email o contraseña incorrectos.'
        };
      }

      httpClient.clearAuthToken();

      setUser(demoResult.user);
      setAuthMode('local');
      writeStoredSession(demoResult.user, 'local');

      return demoResult;
    }
  }

  function logout() {
    setUser(null);
    setAuthMode('local');
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