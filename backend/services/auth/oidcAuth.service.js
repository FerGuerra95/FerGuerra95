import crypto from 'node:crypto';

import { recordAuthAuditLog } from '../audit/auditLog.service.js';
import { verifyOidcIdToken } from '../../utils/oidcIdTokenVerify.js';
import { loginUserWithOidcProfile } from './auth.service.js';
import { saveOidcState, takeOidcState } from './oidcStateStore.js';

function createError(message, status = 400, code = 'OIDC_ERROR') {
  const error = new Error(message);
  error.status = status;
  error.code = code;
  return error;
}

function base64url(buf) {
  return Buffer.from(buf)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function getEnv(name) {
  return String(process.env[name] || '').trim();
}

export function isOidcConfigured() {
  return Boolean(getEnv('OIDC_ISSUER') && getEnv('OIDC_CLIENT_ID'));
}

function getBackendPublicUrl() {
  return (
    getEnv('OIDC_PUBLIC_URL') ||
    getEnv('PUBLIC_API_URL') ||
    `http://127.0.0.1:${Number.parseInt(process.env.PORT || '4000', 10)}`
  ).replace(/\/$/, '');
}

function getFrontendBaseUrl() {
  return (
    getEnv('FRONTEND_URL') ||
    getEnv('PUBLIC_APP_URL') ||
    'http://localhost:5173'
  ).replace(/\/$/, '');
}

function getRedirectUri() {
  const custom = getEnv('OIDC_REDIRECT_URI');
  if (custom) return custom.replace(/\/$/, '');
  return `${getBackendPublicUrl()}/api/auth/oidc/callback`;
}

let discoveryCache = { issuer: '', data: null, expires: 0 };

async function fetchDiscovery(issuer) {
  const normalized = issuer.replace(/\/$/, '');
  const now = Date.now();
  if (discoveryCache.issuer === normalized && discoveryCache.expires > now) {
    return discoveryCache.data;
  }

  const url = `${normalized}/.well-known/openid-configuration`;
  const res = await fetch(url);

  if (!res.ok) {
    throw createError('No se pudo obtener la configuración OIDC.', 502, 'OIDC_DISCOVERY_FAILED');
  }

  const data = await res.json();
  discoveryCache = {
    issuer: normalized,
    data,
    expires: now + 3_600_000
  };
  return data;
}

function profileFromIdTokenClaims(payload) {
  const email =
    payload?.email || payload?.preferred_username || payload?.upn;

  if (!email) {
    throw createError(
      'No se pudo obtener el email del proveedor OIDC.',
      502,
      'OIDC_NO_EMAIL'
    );
  }

  const normalizedEmail = String(email).trim().toLowerCase();

  return {
    email: normalizedEmail,
    name: payload?.name || normalizedEmail
  };
}

/**
 * Resolves OIDC user profile. Userinfo (Bearer access_token) is preferred.
 * id_token is only accepted after cryptographic verification — never decoded without verify.
 */
export async function resolveOidcUserProfileFromTokens(
  tokens,
  discovery,
  { nonce } = {}
) {
  const clientId = getEnv('OIDC_CLIENT_ID');
  const issuer = getEnv('OIDC_ISSUER');
  const clientSecret = getEnv('OIDC_CLIENT_SECRET');

  if (tokens.access_token && discovery.userinfo_endpoint) {
    const res = await fetch(discovery.userinfo_endpoint, {
      headers: { Authorization: `Bearer ${tokens.access_token}` }
    });

    if (res.ok) {
      const u = await res.json();
      const email = u.email || u.preferred_username || u.upn;

      if (email) {
        return {
          email: String(email).trim().toLowerCase(),
          name: u.name || u.given_name || email
        };
      }
    }
  }

  if (!tokens.id_token) {
    throw createError(
      'No se pudo obtener el email del proveedor OIDC.',
      502,
      'OIDC_NO_EMAIL'
    );
  }

  try {
    const verifiedPayload = await verifyOidcIdToken(tokens.id_token, {
      issuer,
      clientId,
      nonce,
      clientSecret,
      discovery
    });

    return profileFromIdTokenClaims(verifiedPayload);
  } catch (error) {
    const code = error?.code || 'OIDC_ID_TOKEN_VERIFICATION_FAILED';

    throw createError(
      'No se pudo verificar el id_token del proveedor OIDC.',
      401,
      code
    );
  }
}

function assertAllowedEmailDomain(email) {
  const domainRule = getEnv('OIDC_ALLOWED_EMAIL_DOMAIN');
  if (!domainRule) return;

  const normalizedRule = domainRule.startsWith('@')
    ? domainRule.slice(1).toLowerCase()
    : domainRule.toLowerCase();

  const at = email.indexOf('@');
  if (at < 0) {
    throw createError('Email OIDC inválido.', 403, 'OIDC_EMAIL_INVALID');
  }

  const userDomain = email.slice(at + 1).toLowerCase();
  if (userDomain !== normalizedRule) {
    throw createError(
      'Dominio de email no autorizado para SSO.',
      403,
      'OIDC_EMAIL_DOMAIN_FORBIDDEN'
    );
  }
}

export async function startOidcAuthorization(res) {
  if (!isOidcConfigured()) {
    throw createError('SSO no configurado.', 503, 'OIDC_NOT_CONFIGURED');
  }

  const issuer = getEnv('OIDC_ISSUER');
  const clientId = getEnv('OIDC_CLIENT_ID');
  const discovery = await fetchDiscovery(issuer);

  const state = base64url(crypto.randomBytes(24));
  const nonce = base64url(crypto.randomBytes(16));
  const usePkce = getEnv('OIDC_PKCE') !== 'false';
  let codeVerifier = '';
  if (usePkce) {
    codeVerifier = base64url(crypto.randomBytes(32));
  }

  await saveOidcState(state, { nonce, codeVerifier });

  const redirectUri = getRedirectUri();
  const scope = getEnv('OIDC_SCOPES') || 'openid profile email';

  const params = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    scope,
    redirect_uri: redirectUri,
    state,
    nonce
  });

  if (usePkce && codeVerifier) {
    const codeChallenge = base64url(
      crypto.createHash('sha256').update(codeVerifier, 'utf8').digest()
    );
    params.set('code_challenge', codeChallenge);
    params.set('code_challenge_method', 'S256');
  }

  const location = `${discovery.authorization_endpoint}?${params.toString()}`;
  res.redirect(302, location);
}

export async function completeOidcAuthorization(req, res) {
  const frontend = getFrontendBaseUrl();
  const error = req.query?.error;
  const errorDescription = req.query?.error_description;

  if (error) {
    const msg = encodeURIComponent(
      String(errorDescription || error || 'SSO cancelado')
    );
    return res.redirect(302, `${frontend}/login?sso_error=${msg}`);
  }

  const code = req.query?.code;
  const state = req.query?.state;

  if (!code || !state) {
    return res.redirect(302, `${frontend}/login?sso_error=${encodeURIComponent('Respuesta SSO incompleta')}`);
  }

  const stored = await takeOidcState(String(state));

  if (!stored) {
    return res.redirect(
      302,
      `${frontend}/login?sso_error=${encodeURIComponent('Sesión SSO expirada. Inténtalo de nuevo.')}`
    );
  }

  const pkceOff = getEnv('OIDC_PKCE') === 'false';
  if (!pkceOff && !stored.codeVerifier) {
    return res.redirect(
      302,
      `${frontend}/login?sso_error=${encodeURIComponent('Sesión SSO expirada. Inténtalo de nuevo.')}`
    );
  }

  const issuer = getEnv('OIDC_ISSUER');
  const clientId = getEnv('OIDC_CLIENT_ID');
  const clientSecret = getEnv('OIDC_CLIENT_SECRET');

  if (!clientSecret) {
    throw createError('OIDC_CLIENT_SECRET es obligatorio.', 500, 'OIDC_MISCONFIGURED');
  }

  const discovery = await fetchDiscovery(issuer);
  const redirectUri = getRedirectUri();

  const tokenBody = new URLSearchParams({
    grant_type: 'authorization_code',
    code: String(code),
    redirect_uri: redirectUri,
    client_id: clientId,
    client_secret: clientSecret
  });

  if (stored.codeVerifier) {
    tokenBody.set('code_verifier', String(stored.codeVerifier));
  }

  const tokenRes = await fetch(discovery.token_endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: tokenBody
  });

  const tokens = await tokenRes.json();

  if (!tokenRes.ok || (!tokens.access_token && !tokens.id_token)) {
    const hint = tokens.error_description || tokens.error || 'token_exchange_failed';
    return res.redirect(
      302,
      `${frontend}/login?sso_error=${encodeURIComponent(hint)}`
    );
  }

  try {
    const profile = await resolveOidcUserProfileFromTokens(tokens, discovery, {
      nonce: stored.nonce
    });
    assertAllowedEmailDomain(profile.email);
    const result = await loginUserWithOidcProfile({
      email: profile.email,
      name: profile.name
    });

    const jwt = encodeURIComponent(result.token);
    return res.redirect(302, `${frontend}/login#access_token=${jwt}`);
  } catch (err) {
    const failureCode = String(err?.code || 'OIDC_ERROR');

    if (
      failureCode.startsWith('OIDC_ID_TOKEN') ||
      failureCode === 'OIDC_JWKS_REQUIRED'
    ) {
      await recordAuthAuditLog({
        action: 'auth.login.failed',
        metadata: {
          method: 'oidc',
          reason: 'oidc_token_verification_failed',
          failureCode
        }
      });
    }

    const msg = encodeURIComponent(err?.message || 'Error SSO');
    return res.redirect(302, `${frontend}/login?sso_error=${msg}`);
  }
}
