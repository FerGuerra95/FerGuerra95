// @vitest-environment node

import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import request from 'supertest';

import { buildHttpApp } from '../../../backend/httpApp.js';
import { initializeDatabaseSchema } from '../../../backend/storage/databaseSchema.js';
import { closeDatabase } from '../../../backend/storage/sqliteStorage.js';

describe('API auth', () => {
  let app;

  beforeAll(async () => {
    const tmp = path.join(os.tmpdir(), `ceos-auth-${Date.now()}.sqlite`);
    process.env.DB_PATH = tmp;
    process.env.AUTH_SECRET = 'a'.repeat(40);
    process.env.NODE_ENV = 'development';
    delete process.env.CEOS_E2E;

    closeDatabase();
    initializeDatabaseSchema();
    app = buildHttpApp();
  });

  afterAll(() => {
    const dbPath = process.env.DB_PATH;
    closeDatabase();
    if (dbPath && fs.existsSync(dbPath)) {
      try {
        fs.unlinkSync(dbPath);
      } catch {
        // ignore
      }
    }
  });

  it('login con credenciales demo devuelve token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@ceoos.local',
        password: 'admin123'
      });

    expect(res.status).toBe(200);
    expect(res.body?.data?.token).toBeTruthy();
  });

  it('password-reset request responde genérico sin filtrar existencia', async () => {
    const res = await request(app)
      .post('/api/auth/password-reset/request')
      .send({ email: 'noexiste@example.com' });

    expect(res.status).toBe(200);
    expect(res.body?.data?.ok).toBe(true);
  });

  it('password-reset confirm con token inválido devuelve 400', async () => {
    const res = await request(app)
      .post('/api/auth/password-reset/confirm')
      .send({
        token: 'invalid-token-xxxxxxxx',
        password: 'ValidPass12ab!'
      });

    expect(res.status).toBe(400);
    expect(res.body?.error?.code).toBeTruthy();
  });

  it(
    'tras reset de contraseña las sesiones previas dejan de ser válidas',
    async () => {
      const login1 = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'user@ceoos.local',
          password: 'user123'
        });

      expect(login1.status).toBe(200);
      const token1 = login1.body.data.token;

      const spy = vi.spyOn(crypto, 'randomBytes').mockImplementation((size, cb) => {
        const len = typeof size === 'number' ? size : 32;
        const buf = Buffer.alloc(len, 0xab);
        if (typeof cb === 'function') {
          cb(null, buf);
          return buf;
        }
        return buf;
      });

      await request(app)
        .post('/api/auth/password-reset/request')
        .send({ email: 'user@ceoos.local' })
        .expect(200);

      const expectedPlain = Buffer.alloc(32, 0xab).toString('hex');
      spy.mockRestore();

      const confirm = await request(app)
        .post('/api/auth/password-reset/confirm')
        .send({
          token: expectedPlain,
          password: 'NewSecret12ab!'
        });

      expect(confirm.status).toBe(200);
      expect(confirm.body?.data?.ok).toBe(true);

      const me = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token1}`);

      expect(me.status).toBe(401);

      const oldLogin = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'user@ceoos.local',
          password: 'user123'
        });
      expect(oldLogin.status).toBe(401);

      const newLogin = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'user@ceoos.local',
          password: 'NewSecret12ab!'
        });
      expect(newLogin.status).toBe(200);
    },
    30_000
  );

  it('oidc/start sin configuración responde 503 JSON', async () => {
    delete process.env.OIDC_ISSUER;
    delete process.env.OIDC_CLIENT_ID;

    const res = await request(app).get('/api/auth/oidc/start');

    expect(res.status).toBe(503);
    expect(res.body?.error?.code).toBe('OIDC_NOT_CONFIGURED');
  });
});
