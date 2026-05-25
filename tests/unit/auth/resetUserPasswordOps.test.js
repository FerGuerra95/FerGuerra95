// @vitest-environment node

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import {
  loginUser,
  resetUserPasswordByEmailForOps
} from '../../../backend/services/auth/auth.service.js';
import { initializeDatabaseSchema } from '../../../backend/storage/databaseSchema.js';
import { closeDatabase } from '../../../backend/storage/sqliteStorage.js';

describe('resetUserPasswordByEmailForOps', () => {
  const tmpDb = path.join(
    os.tmpdir(),
    `ceos-reset-ops-${Date.now()}.sqlite`
  );

  beforeAll(() => {
    process.env.DB_PATH = tmpDb;
    process.env.AUTH_SECRET = 'b'.repeat(40);
    process.env.NODE_ENV = 'development';
    delete process.env.BOOTSTRAP_ADMIN_EMAIL;
    delete process.env.BOOTSTRAP_ADMIN_PASSWORD;

    closeDatabase();
    initializeDatabaseSchema();
  });

  afterAll(() => {
    closeDatabase();
    if (fs.existsSync(tmpDb)) {
      try {
        fs.unlinkSync(tmpDb);
      } catch {
        // ignore
      }
    }
  });

  it('updates password for existing user and rejects old password', async () => {
    await loginUser({
      email: 'admin@ceoos.local',
      password: 'admin123'
    });

    const newPassword = 'OpsResetPass12!';

    const result = await resetUserPasswordByEmailForOps(
      'admin@ceoos.local',
      newPassword
    );

    expect(result).toEqual({
      userFound: true,
      passwordUpdated: true
    });

    await expect(
      loginUser({
        email: 'admin@ceoos.local',
        password: 'admin123'
      })
    ).rejects.toMatchObject({
      code: 'INVALID_CREDENTIALS'
    });

    const login = await loginUser({
      email: 'admin@ceoos.local',
      password: newPassword
    });

    expect(login.token).toBeTruthy();
  });

  it('returns userFound false when email does not exist', async () => {
    const result = await resetUserPasswordByEmailForOps(
      'missing@ceoos.local',
      'ValidPass12ab!'
    );

    expect(result).toEqual({
      userFound: false,
      passwordUpdated: false,
      code: 'USER_NOT_FOUND'
    });
  });

  it('rejects weak passwords without updating', async () => {
    const result = await resetUserPasswordByEmailForOps(
      'user@ceoos.local',
      'short'
    );

    expect(result.passwordUpdated).toBe(false);
    expect(result.code).toBe('WEAK_PASSWORD');
  });
});
