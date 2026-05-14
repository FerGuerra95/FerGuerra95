import { describe, expect, it, afterEach } from 'vitest';

import {
  getPasswordMinLength,
  validateNewPasswordStrength
} from '../../../backend/services/auth/passwordPolicy.js';

describe('passwordPolicy', () => {
  const prevMin = process.env.PASSWORD_MIN_LENGTH;
  const prevSkip = process.env.PASSWORD_SKIP_COMPLEXITY;

  afterEach(() => {
    if (prevMin === undefined) delete process.env.PASSWORD_MIN_LENGTH;
    else process.env.PASSWORD_MIN_LENGTH = prevMin;
    if (prevSkip === undefined) delete process.env.PASSWORD_SKIP_COMPLEXITY;
    else process.env.PASSWORD_SKIP_COMPLEXITY = prevSkip;
  });

  it('rechaza contraseñas cortas', () => {
    delete process.env.PASSWORD_MIN_LENGTH;
    const r = validateNewPasswordStrength('Short1!');
    expect(r.ok).toBe(false);
  });

  it('acepta contraseña fuerte por defecto', () => {
    delete process.env.PASSWORD_SKIP_COMPLEXITY;
    const r = validateNewPasswordStrength('GoodPass12ab!');
    expect(r.ok).toBe(true);
  });

  it('PASSWORD_SKIP_COMPLEXITY omite clases', () => {
    process.env.PASSWORD_SKIP_COMPLEXITY = 'true';
    const r = validateNewPasswordStrength('1234567890ab');
    expect(r.ok).toBe(true);
  });

  it('PASSWORD_MIN_LENGTH respeta límites', () => {
    process.env.PASSWORD_MIN_LENGTH = '10';
    expect(getPasswordMinLength()).toBe(10);
  });
});
