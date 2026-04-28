const DEFAULT_API_BASE_URL = import.meta.env.DEV
  ? 'http://localhost:4000/api'
  : '/api';

const API_BASE_URL = (
  import.meta.env.VITE_API_URL?.trim() || DEFAULT_API_BASE_URL
).replace(/\/$/, '');

const AUTH_TOKEN_KEY = 'ceo_os_auth_token';

function getAuthToken() {
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  } catch {
    return null;
  }
}

function setAuthToken(token) {
  try {
    if (token) {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
    }
  } catch {
    // Si localStorage falla, no bloqueamos la app.
  }
}

function clearAuthToken() {
  try {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  } catch {
    // Si localStorage falla, no bloqueamos logout.
  }
}

function normalizePath(path) {
  const safePath = String(path || '');

  if (safePath.startsWith('/')) {
    return safePath;
  }

  return `/${safePath}`;
}

async function parseResponse(response) {
  const text = await response.text();

  if (!text) {
    return {
      data: null,
      meta: {},
      error: null
    };
  }

  try {
    return JSON.parse(text);
  } catch {
    return {
      data: null,
      meta: {},
      error: {
        message: 'Respuesta no JSON'
      }
    };
  }
}

async function request(path, options = {}) {
  const url = `${API_BASE_URL}${normalizePath(path)}`;
  const token = getAuthToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const response = await fetch(url, {
    ...options,
    headers
  });

  const payload = await parseResponse(response);

  if (!response.ok) {
    const message =
      payload?.error?.message ||
      payload?.message ||
      `Error HTTP ${response.status}`;

    throw new Error(message);
  }

  return payload;
}

export const httpClient = {
  get(path, options = {}) {
    return request(path, {
      ...options,
      method: 'GET'
    });
  },

  post(path, body, options = {}) {
    return request(path, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body)
    });
  },

  put(path, body, options = {}) {
    return request(path, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body)
    });
  },

  patch(path, body, options = {}) {
    return request(path, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(body)
    });
  },

  delete(path, options = {}) {
    return request(path, {
      ...options,
      method: 'DELETE'
    });
  },

  setAuthToken,
  getAuthToken,
  clearAuthToken
};