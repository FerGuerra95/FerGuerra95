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

/** Base URL del API (p. ej. `/api` o `http://localhost:4000/api`) para redirecciones SSO absolutas. */
export function getResolvedApiBaseUrl() {
  return API_BASE_URL;
}

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

function buildRequestUrl(path, params) {
  const normalized = normalizePath(path);
  const qIndex = normalized.indexOf('?');
  const pathname = qIndex >= 0 ? normalized.slice(0, qIndex) : normalized;
  const existingQuery = qIndex >= 0 ? normalized.slice(qIndex + 1) : '';

  const searchParams = new URLSearchParams(existingQuery);

  if (params && typeof params === 'object') {
    for (const [key, value] of Object.entries(params)) {
      if (value === '' || value === null || value === undefined) {
        continue;
      }
      if (Array.isArray(value)) {
        for (const item of value) {
          if (item === '' || item === null || item === undefined) {
            continue;
          }
          searchParams.append(key, String(item));
        }
      } else {
        searchParams.append(key, String(value));
      }
    }
  }

  const qs = searchParams.toString();
  return qs ? `${API_BASE_URL}${pathname}?${qs}` : `${API_BASE_URL}${pathname}`;
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
  const {
    params,
    skipAuthExpiredEvent,
    skipJsonContentType,
    timeoutMs: timeoutOpt,
    responseType,
    ...fetchRest
  } = options;

  const url = buildRequestUrl(path, params);
  const token = getAuthToken();
  const controller = new AbortController();
  const timeoutMs = Number(timeoutOpt || DEFAULT_TIMEOUT_MS);
  const timerApi = typeof window !== 'undefined' ? window : globalThis;
  const timeoutId = timerApi.setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  const methodUpper = String(fetchRest.method || 'GET').toUpperCase();
  const hasJsonBody =
    typeof fetchRest.body === 'string' &&
    fetchRest.body.length > 0 &&
    ['POST', 'PUT', 'PATCH', 'DELETE'].includes(methodUpper);

  const headers = {
    ...(hasJsonBody && !skipJsonContentType
      ? { 'Content-Type': 'application/json' }
      : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(fetchRest.headers || {})
  };

  let response;
  let payload;
  const expectsBlob = responseType === 'blob';

  try {
    response = await fetch(url, {
      ...fetchRest,
      headers,
      signal: fetchRest.signal || controller.signal
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

    if (
      response.status === 401 &&
      typeof window !== 'undefined' &&
      !skipAuthExpiredEvent
    ) {
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
