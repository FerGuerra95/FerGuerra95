import crypto from 'node:crypto';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import {
  resetOidcJwksCacheForTests,
  verifyOidcIdToken
} from '../../../backend/utils/oidcIdTokenVerify.js';

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

describe('verifyOidcIdToken', () => {
  const issuer = 'https://issuer.example.com';
  const clientId = 'ceos-test-client';
  let keyPair;
  let publicJwk;

  beforeAll(() => {
    keyPair = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 });
    publicJwk = keyPair.publicKey.export({ format: 'jwk' });
    publicJwk.kid = 'test-kid-1';
    publicJwk.use = 'sig';
    publicJwk.alg = 'RS256';
  });

  afterEach(() => {
    resetOidcJwksCacheForTests();
    vi.restoreAllMocks();
  });

  it('rejects id_token with invalid signature', async () => {
    const token = signRs256Jwt({
      header: { alg: 'RS256', typ: 'JWT', kid: 'test-kid-1' },
      payload: {
        iss: issuer,
        aud: clientId,
        exp: Math.floor(Date.now() / 1000) + 3600,
        email: 'user@example.com'
      },
      privateKey: keyPair.privateKey
    });

    const wrongVerifierPair = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048
    });
    const wrongJwk = wrongVerifierPair.publicKey.export({ format: 'jwk' });
    wrongJwk.kid = 'test-kid-1';
    wrongJwk.use = 'sig';
    wrongJwk.alg = 'RS256';

    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: true,
        json: async () => ({ keys: [wrongJwk] })
      }))
    );

    await expect(
      verifyOidcIdToken(token, {
        issuer,
        clientId,
        discovery: {
          issuer,
          jwks_uri: 'https://issuer.example.com/jwks-invalid-sig'
        }
      })
    ).rejects.toMatchObject({
      code: 'OIDC_ID_TOKEN_SIGNATURE_INVALID'
    });
  });

  it('rejects id_token with corrupted signature segment', async () => {
    const token = signRs256Jwt({
      header: { alg: 'RS256', typ: 'JWT', kid: 'test-kid-1' },
      payload: {
        iss: issuer,
        aud: clientId,
        exp: Math.floor(Date.now() / 1000) + 3600,
        email: 'user@example.com'
      },
      privateKey: keyPair.privateKey
    });

    const [headerPart, payloadPart, signaturePart] = token.split('.');
    const corrupted = `${headerPart}.${payloadPart}.${signaturePart.slice(0, -8)}INVALID00`;

    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: true,
        json: async () => ({ keys: [publicJwk] })
      }))
    );

    await expect(
      verifyOidcIdToken(corrupted, {
        issuer,
        clientId,
        discovery: {
          issuer,
          jwks_uri: 'https://issuer.example.com/jwks-corrupt-sig'
        }
      })
    ).rejects.toMatchObject({
      code: 'OIDC_ID_TOKEN_SIGNATURE_INVALID'
    });
  });

  it('rejects wrong issuer', async () => {
    const token = signRs256Jwt({
      header: { alg: 'RS256', typ: 'JWT', kid: 'test-kid-1' },
      payload: {
        iss: 'https://wrong-issuer.example.com',
        aud: clientId,
        exp: Math.floor(Date.now() / 1000) + 3600,
        email: 'user@example.com'
      },
      privateKey: keyPair.privateKey
    });

    await expect(
      verifyOidcIdToken(token, {
        issuer,
        clientId,
        discovery: { issuer, jwks_uri: 'https://issuer.example.com/jwks' }
      })
    ).rejects.toMatchObject({
      code: 'OIDC_ID_TOKEN_ISSUER_MISMATCH'
    });
  });

  it('rejects wrong audience', async () => {
    const token = signRs256Jwt({
      header: { alg: 'RS256', typ: 'JWT', kid: 'test-kid-1' },
      payload: {
        iss: issuer,
        aud: 'other-client',
        exp: Math.floor(Date.now() / 1000) + 3600,
        email: 'user@example.com'
      },
      privateKey: keyPair.privateKey
    });

    await expect(
      verifyOidcIdToken(token, {
        issuer,
        clientId,
        discovery: { issuer, jwks_uri: 'https://issuer.example.com/jwks' }
      })
    ).rejects.toMatchObject({
      code: 'OIDC_ID_TOKEN_AUDIENCE_MISMATCH'
    });
  });

  it('rejects expired token', async () => {
    const token = signRs256Jwt({
      header: { alg: 'RS256', typ: 'JWT', kid: 'test-kid-1' },
      payload: {
        iss: issuer,
        aud: clientId,
        exp: Math.floor(Date.now() / 1000) - 600,
        email: 'user@example.com'
      },
      privateKey: keyPair.privateKey
    });

    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: true,
        json: async () => ({ keys: [publicJwk] })
      }))
    );

    await expect(
      verifyOidcIdToken(token, {
        issuer,
        clientId,
        discovery: { issuer, jwks_uri: 'https://issuer.example.com/jwks' }
      })
    ).rejects.toMatchObject({
      code: 'OIDC_ID_TOKEN_EXPIRED'
    });
  });

  it('accepts valid RS256 id_token with JWKS', async () => {
    const token = signRs256Jwt({
      header: { alg: 'RS256', typ: 'JWT', kid: 'test-kid-1' },
      payload: {
        iss: issuer,
        aud: clientId,
        exp: Math.floor(Date.now() / 1000) + 3600,
        nonce: 'nonce-abc',
        email: 'user@example.com',
        name: 'Test User'
      },
      privateKey: keyPair.privateKey
    });

    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: true,
        json: async () => ({ keys: [publicJwk] })
      }))
    );

    const payload = await verifyOidcIdToken(token, {
      issuer,
      clientId,
      nonce: 'nonce-abc',
      discovery: { issuer, jwks_uri: 'https://issuer.example.com/jwks' }
    });

    expect(payload.email).toBe('user@example.com');
    expect(payload.name).toBe('Test User');
  });

  it('verifies HS256 id_token with client secret', async () => {
    const secret = 'test-client-secret-min-32-chars!!';
    const headerPart = base64urlJson({ alg: 'HS256', typ: 'JWT' });
    const payloadPart = base64urlJson({
      iss: issuer,
      aud: clientId,
      exp: Math.floor(Date.now() / 1000) + 3600,
      email: 'hs@example.com'
    });
    const signingInput = `${headerPart}.${payloadPart}`;
    const signature = crypto
      .createHmac('sha256', secret)
      .update(signingInput)
      .digest();
    const signaturePart = signature
      .toString('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
    const token = `${signingInput}.${signaturePart}`;

    const payload = await verifyOidcIdToken(token, {
      issuer,
      clientId,
      clientSecret: secret,
      discovery: { issuer }
    });

    expect(payload.email).toBe('hs@example.com');
  });
});
