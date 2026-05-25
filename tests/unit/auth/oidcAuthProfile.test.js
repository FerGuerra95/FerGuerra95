import crypto from 'node:crypto';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import {
  resetOidcJwksCacheForTests
} from '../../../backend/utils/oidcIdTokenVerify.js';
import { resolveOidcUserProfileFromTokens } from '../../../backend/services/auth/oidcAuth.service.js';

function base64urlJson(value) {
  return Buffer.from(JSON.stringify(value))
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function signRs256Jwt({ header, payload, privateKey }) {
  const headerPart = base64urlJson(header);
  const payloadPart = base64urlJson(payload);
  const signingInput = `${headerPart}.${payloadPart}`;
  const signature = crypto
    .createSign('RSA-SHA256')
    .update(signingInput)
    .end()
    .sign(privateKey);

  const signaturePart = signature
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  return `${signingInput}.${signaturePart}`;
}

describe('resolveOidcUserProfileFromTokens', () => {
  const issuer = 'https://issuer.example.com';
  const clientId = 'ceos-oidc-client';
  let keyPair;
  let publicJwk;

  beforeAll(() => {
    process.env.OIDC_ISSUER = issuer;
    process.env.OIDC_CLIENT_ID = clientId;
    process.env.OIDC_CLIENT_SECRET = 'oidc-test-secret-min-32-characters';

    keyPair = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 });
    publicJwk = keyPair.publicKey.export({ format: 'jwk' });
    publicJwk.kid = 'kid-profile-test';
    publicJwk.use = 'sig';
    publicJwk.alg = 'RS256';
  });

  afterEach(() => {
    resetOidcJwksCacheForTests();
    vi.restoreAllMocks();
  });

  it('rejects unverified id_token when userinfo is unavailable', async () => {
    const unsignedPayload = base64urlJson({
      iss: issuer,
      aud: clientId,
      exp: Math.floor(Date.now() / 1000) + 3600,
      email: 'attacker@example.com'
    });
    const fakeIdToken = `eyJhbGciOiJub25lIn0.${unsignedPayload}.`;

    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: false,
        json: async () => ({})
      }))
    );

    const discovery = {
      issuer,
      userinfo_endpoint: 'https://issuer.example.com/userinfo',
      jwks_uri: 'https://issuer.example.com/jwks'
    };

    await expect(
      resolveOidcUserProfileFromTokens(
        { id_token: fakeIdToken },
        discovery,
        { nonce: 'n1' }
      )
    ).rejects.toMatchObject({
      code: expect.stringMatching(/^OIDC_ID_TOKEN/)
    });
  });

  it('accepts verified id_token when userinfo fails', async () => {
    const idToken = signRs256Jwt({
      header: { alg: 'RS256', typ: 'JWT', kid: 'kid-profile-test' },
      payload: {
        iss: issuer,
        aud: clientId,
        exp: Math.floor(Date.now() / 1000) + 3600,
        nonce: 'n1',
        email: 'verified@example.com',
        name: 'Verified User'
      },
      privateKey: keyPair.privateKey
    });

    vi.stubGlobal(
      'fetch',
      vi.fn(async (url) => {
        if (String(url).includes('/userinfo')) {
          return { ok: false, json: async () => ({}) };
        }
        if (String(url).includes('/jwks')) {
          return { ok: true, json: async () => ({ keys: [publicJwk] }) };
        }
        return { ok: false, json: async () => ({}) };
      })
    );

    const profile = await resolveOidcUserProfileFromTokens(
      { id_token: idToken },
      {
        issuer,
        userinfo_endpoint: 'https://issuer.example.com/userinfo',
        jwks_uri: 'https://issuer.example.com/jwks'
      },
      { nonce: 'n1' }
    );

    expect(profile.email).toBe('verified@example.com');
    expect(profile.name).toBe('Verified User');
  });
});
