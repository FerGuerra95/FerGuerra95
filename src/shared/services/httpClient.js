function resolveApiBaseUrl() {
  if (typeof window === 'undefined') {
    return '/api';
  }

  const { hostname, port } = window.location;

  const isLocalHost =
    hostname === 'localhost' ||
    hostname === '127.0.0.1';

  const isViteDevServer =
    isLocalHost &&
    (port === '5173' || port === '5174');

  if (isViteDevServer) {
    return `http://${hostname}:4000/api`;
  }

  return '/api';
}

const API_BASE_URL = resolveApiBaseUrl().replace(/\/$/, '');

const AUTH_TOKEN_KEY = 'ceo_os_auth_token';
const DEFAULT_TIMEOUT_MS = 30_000;

export class ApiError extends Error {
  constructor(message, { status = 0, code = 'API_ERROR', meta = null } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.meta = meta;
  }
}

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
  const controller = new AbortController();
  const timeoutMs = Number(options.timeoutMs || DEFAULT_TIMEOUT_MS);
  const timerApi = typeof window !== 'undefined' ? window : globalThis;
  const timeoutId = timerApi.setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  const methodUpper = String(options.method || 'GET').toUpperCase();
  const hasJsonBody =
    typeof options.body === 'string' &&
    options.body.length > 0 &&
    ['POST', 'PUT', 'PATCH', 'DELETE'].includes(methodUpper);

  const headers = {
    ...(hasJsonBody && !options.skipJsonContentType
      ? { 'Content-Type': 'application/json' }
      : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  let response;
  let payload;
  const expectsBlob = options.responseType === 'blob';

  try {
    response = await fetch(url, {
      ...options,
      headers,
      signal: options.signal || controller.signal
    });

    if (expectsBlob && response.ok) {
      payload = {
        data: await response.blob(),
        meta: {
          contentType: response.headers.get('content-type') || '',
          contentDisposition: response.headers.get('content-disposition') || '',
          checksumSha256: response.headers.get('x-ma-checksum-sha256') || '',
          watermark: response.headers.get('x-ma-watermark') || '',
          documentClassification:
            response.headers.get('x-ma-document-classification') || '',
          documentVersion: response.headers.get('x-ma-document-version') || ''
        },
        error: null
      };
    } else {
      payload = await parseResponse(response);
    }
  } catch (error) {
    const isAbort = error?.name === 'AbortError';
    throw new ApiError(
      isAbort
        ? `La solicitud ha superado ${Math.round(timeoutMs / 1000)} segundos.`
        : error?.message || 'No se pudo conectar con la API.',
      {
        status: 0,
        code: isAbort ? 'REQUEST_TIMEOUT' : 'NETWORK_ERROR'
      }
    );
  } finally {
    timerApi.clearTimeout(timeoutId);
  }

  if (!response.ok) {
    const message =
      payload?.error?.message ||
      payload?.message ||
      `Error HTTP ${response.status}`;

    const apiError = new ApiError(message, {
      status: response.status,
      code: payload?.error?.code || `HTTP_${response.status}`,
      meta: payload?.meta || null
    });

    if (response.status === 401 && typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('ceos:auth-expired', {
          detail: {
            error: apiError
          }
        })
      );
    }

    throw apiError;
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

  postBinary(path, body, options = {}) {
    return request(path, {
      ...options,
      method: 'POST',
      body,
      skipJsonContentType: true
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

  download(path, options = {}) {
    return request(path, {
      ...options,
      method: 'GET',
      responseType: 'blob'
    });
  },

  setAuthToken,
  getAuthToken,
  clearAuthToken
};
