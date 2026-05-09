import { describe, it, expect } from 'vitest';
import { formatCurrency } from '../../../src/shared/utils/formatCurrency.js';

describe('formatCurrency', () => {
  it('formatea divisas principales con Intl y codigo ISO real', () => {
    expect(formatCurrency(1234567, 'EUR')).toContain('1.234.567');
    expect(formatCurrency(1234567, 'USD')).toContain('$');
    expect(formatCurrency(1234567, 'GBP')).toContain('£');
    expect(formatCurrency(1234567, 'JPY')).toContain('1.234.567');
  });

  it('normaliza importes invalidos a cero sin romper reportes', () => {
    expect(formatCurrency('no-number', 'EUR')).toContain('0');
  });

  it('cae a EUR cuando el codigo de divisa no es ISO de tres letras', () => {
    const value = formatCurrency(1234567, 'EURO');

    expect(value).toContain('1.234.567');
    expect(value).toContain('€');
  });
});
