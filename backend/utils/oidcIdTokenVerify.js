import crypto from 'node:crypto';

function base64urlDecode(input) {
  const normalized = String(input || '').replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized.padEnd(
    normalized.length + ((4 - (normalized.length % 4)) % 4),
    '='
  );
  return Buffer.from(padded, 'base64');
}

function decodeJsonPart(part) {
  try {
    return JSON.parse(base64urlDecode(part).toString('utf8'));
  } catch {
    return null;
  }
}

let jwksCache = { uri: '', keys: null, expires: 0 };

async function fetchJwks(jwksUri) {
  const uri = String(jwksUri || '').trim();
  if (!uri) return null;

  const now = Date.now();
  if (jwksCache.uri === uri && jwksCache.keys && jwksCache.expires > now) {
    return jwksCache.keys;
  }

  const res = await fetch(uri);
  if (!res.ok) return null;

  const body = await res.json();
  const keys = Array.isArray(body?.keys) ? body.keys : [];
  jwksCache = { uri, keys, expires: now + 3_600_000 };
  return keys;
}

function resolveSigningKey(jwk) {
  if (!jwk || typeof jwk !== 'object') return null;

  if (jwk.kty === 'RSA' && jwk.n && jwk.e) {
    try {
      return crypto.createPublicKey({ key: jwk, format: 'jwk' });
    } catch {
      return null;
    }
  }

  return null;
}

function verifyRsaSignature(alg, signingInput, signature, publicKey) {
  const map = {
    RS256: 'RSA-SHA256',
    RS384: 'RSA-SHA384',
    RS512: 'RSA-SHA512'
  };
  const nodeAlg = map[alg];
  if (!nodeAlg) return false;

  try {
    const verifier = crypto.createVerify(nodeAlg);
    verifier.update(signingInput);
    verifier.end();
    return verifier.verify(publicKey, signature);
  } catch {
    return false;
  }
}

function verifyHsSignature(alg, signingInput, signature, clientSecret) {
  const map = {
    HS256: 'sha256',
    HS384: 'sha384',
    HS512: 'sha512'
  };
  const hashAlg = map[alg];
  if (!hashAlg || !clientSecret) return false;

  const expected = crypto
    .createHmac(hashAlg, clientSecret)
    .update(signingInput)
    .digest();

  if (expected.length !== signature.length) return false;

  return crypto.timingSafeEqual(expected, signature);
}

function normalizeIssuer(value) {
  return String(value || '')
    .trim()
    .replace(/\/$/, '');
}

function audienceMatches(aud, clientId) {
  const safeClientId = String(clientId || '').trim();
  if (!safeClientId) return false;

  if (Array.isArray(aud)) {
    return aud.some((entry) => String(entry) === safeClientId);
  }

  return String(aud || '') === safeClientId;
}

function assertTemporalClaims(payload, clockSkewSec = 120) {
  const now = Math.floor(Date.now() / 1000);

  if (payload.exp !== undefined) {
    const exp = Number(payload.exp);
    if (!Number.isFinite(exp) || exp < now - clockSkewSec) {
      throw Object.assign(new Error('id_token expirado.'), {
        code: 'OIDC_ID_TOKEN_EXPIRED'
      });
    }
  }

  if (payload.nbf !== undefined) {
    const nbf = Number(payload.nbf);
    if (Number.isFinite(nbf) && nbf > now + clockSkewSec) {
      throw Object.assign(new Error('id_token no válido todavía (nbf).'), {
        code: 'OIDC_ID_TOKEN_NOT_YET_VALID'
      });
    }
  }
}

/**
 * Verifies OIDC id_token signature and standard claims.
 * Does not log or persist the raw token.
 *
 * @param {string} idToken
 * @param {{
 *   issuer: string;
 *   clientId: string;
 *   nonce?: string;
 *   clientSecret?: string;
 *   discovery?: { issuer?: string; jwks_uri?: string };
 * }} options
 * @returns {Promise<Record<string, unknown>>}
 */
export async function verifyOidcIdToken(idToken, options = {}) {
  const token = String(idToken || '').trim();
  if (!token) {
    throw Object.assign(new Error('id_token ausente.'), {
      code: 'OIDC_ID_TOKEN_MISSING'
    });
  }

  const parts = token.split('.');
  if (parts.length !== 3) {
    throw Object.assign(new Error('id_token malformado.'), {
      code: 'OIDC_ID_TOKEN_MALFORMED'
    });
  }

  const [headerPart, payloadPart, signaturePart] = parts;
  const header = decodeJsonPart(headerPart);
  const payload = decodeJsonPart(payloadPart);

  if (!header?.alg || !payload) {
    throw Object.assign(new Error('id_token malformado.'), {
      code: 'OIDC_ID_TOKEN_MALFORMED'
    });
  }

  const expectedIssuer = normalizeIssuer(
    options.issuer || options.discovery?.issuer
  );
  const tokenIssuer = normalizeIssuer(payload.iss);

  if (!expectedIssuer || !tokenIssuer || tokenIssuer !== expectedIssuer) {
    throw Object.assign(new Error('issuer id_token no válido.'), {
      code: 'OIDC_ID_TOKEN_ISSUER_MISMATCH'
    });
  }

  if (!audienceMatches(payload.aud, options.clientId)) {
    throw Object.assign(new Error('audience id_token no válida.'), {
      code: 'OIDC_ID_TOKEN_AUDIENCE_MISMATCH'
    });
  }

  if (options.nonce) {
    const tokenNonce = String(payload.nonce || '');
    if (!tokenNonce || tokenNonce !== String(options.nonce)) {
      throw Object.assign(new Error('nonce id_token no válido.'), {
        code: 'OIDC_ID_TOKEN_NONCE_MISMATCH'
      });
    }
  }

  assertTemporalClaims(payload);

  const signingInput = `${headerPart}.${payloadPart}`;
  const signature = base64urlDecode(signaturePart);
  const alg = String(header.alg);

  let verified = false;

  if (alg.startsWith('HS')) {
    verified = verifyHsSignature(
      alg,
      signingInput,
      signature,
      options.clientSecret || ''
    );
  } else if (alg.startsWith('RS')) {
    const jwksUri = options.discovery?.jwks_uri;
    const keys = await fetchJwks(jwksUri);
    const kid = header.kid;
    const candidates = (keys || []).filter(
      (key) => !kid || key.kid === kid
    );

    for (const jwk of candidates) {
      const publicKey = resolveSigningKey(jwk);
      if (!publicKey) continue;
      if (verifyRsaSignature(alg, signingInput, signature, publicKey)) {
        verified = true;
        break;
      }
    }

    if (!verified && !jwksUri) {
      throw Object.assign(
        new Error('JWKS no configurado; no se puede verificar id_token.'),
        { code: 'OIDC_JWKS_REQUIRED' }
      );
    }
  } else {
    throw Object.assign(
      new Error(`Algoritmo id_token no soportado: ${alg}`),
      { code: 'OIDC_ID_TOKEN_ALG_UNSUPPORTED' }
    );
  }

  if (!verified) {
    throw Object.assign(new Error('Firma id_token no válida.'), {
      code: 'OIDC_ID_TOKEN_SIGNATURE_INVALID'
    });
  }

  return payload;
}

/** @internal — tests only */
export function resetOidcJwksCacheForTests() {
  jwksCache = { uri: '', keys: null, expires: 0 };
}
