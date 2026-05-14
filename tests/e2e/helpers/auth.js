import dotenv from 'dotenv';
import { expect } from '@playwright/test';

dotenv.config();

const AUTH_STORAGE_KEY = 'ceo_os_auth_session';
const AUTH_TOKEN_KEY = 'ceo_os_auth_token';

function resolveApiBaseUrl() {
  if (process.env.CEOS_API_BASE_URL) {
    return process.env.CEOS_API_BASE_URL.replace(/\/$/, '');
  }

  const appBaseUrl = new URL(process.env.CEOS_BASE_URL || 'http://127.0.0.1:5173');
  const isLocalVite =
    (appBaseUrl.hostname === 'localhost' || appBaseUrl.hostname === '127.0.0.1') &&
    (appBaseUrl.port === '5173' || appBaseUrl.port === '5174');

  if (isLocalVite) {
    return `${appBaseUrl.protocol}//${appBaseUrl.hostname}:4000/api`;
  }

  return new URL('/api', appBaseUrl).toString().replace(/\/$/, '');
}

export function getE2eCredentials() {
  const envEmail = process.env.CEOS_E2E_USER || process.env.CEOS_USER;
  const envPassword = process.env.CEOS_E2E_PASSWORD || process.env.CEOS_PASSWORD;

  if (envEmail && envPassword) {
    return {
      email: envEmail,
      password: envPassword
    };
  }

  const bootstrapUsers = JSON.parse(process.env.BOOTSTRAP_USERS_JSON || '[]');
  const adminUser =
    bootstrapUsers.find((user) => user.role === 'admin') ||
    bootstrapUsers[0] ||
    null;

  if (!adminUser?.email || !adminUser?.password) {
    throw new Error(
      'No hay credenciales e2e. Define CEOS_E2E_USER/CEOS_E2E_PASSWORD o BOOTSTRAP_USERS_JSON.'
    );
  }

  return {
    email: adminUser.email,
    password: adminUser.password
  };
}

/**
 * Token JWT para llamadas API en e2e (misma resolución de credenciales que `loginAsDemoAdmin`).
 */
export async function fetchDemoAdminApiToken(request) {
  const credentials = getE2eCredentials();
  const response = await request.post(`${resolveApiBaseUrl()}/auth/login`, {
    data: {
      email: credentials.email,
      password: credentials.password
    }
  });

  if (!response.ok()) {
    throw new Error(
      `Login API e2e falló: ${response.status()} ${await response.text()}`
    );
  }

  const payload = await response.json();
  const data = payload.data ?? payload;
  const token = data?.token || data?.accessToken || '';

  if (!token) {
    throw new Error('Respuesta de login API sin token.');
  }

  return token;
}

export async function loginAsDemoAdmin(page) {
  const credentials = getE2eCredentials();
  const response = await page.request.post(`${resolveApiBaseUrl()}/auth/login`, {
    data: {
      email: credentials.email,
      password: credentials.password
    }
  });

  if (!response.ok()) {
    throw new Error(`No se pudo iniciar sesion e2e: ${response.status()} ${await response.text()}`);
  }

  const payload = await response.json();
  const data = payload.data ?? payload;
  const token = data?.token || data?.accessToken || '';
  const user = data?.user || null;

  if (!token || !user?.id) {
    throw new Error('Respuesta de login e2e sin token o usuario.');
  }

  await page.addInitScript(
    ({ key, session }) => {
      window.localStorage.setItem(key, JSON.stringify(session));
      window.localStorage.setItem(session.tokenKey, session.token);
    },
    {
      key: AUTH_STORAGE_KEY,
      session: {
        user,
        mode: 'backend',
        token,
        tokenKey: AUTH_TOKEN_KEY,
        createdAt: new Date().toISOString()
      }
    }
  );

  await page.goto('/dashboard', { waitUntil: 'domcontentloaded' });
  await expect(page).toHaveURL(/\/dashboard/);
}
