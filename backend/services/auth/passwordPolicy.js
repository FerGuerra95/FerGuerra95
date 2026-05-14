/**
 * Política de contraseñas para altas y cambios (no aplica al verificar login legado).
 */

function envBool(name) {
  const v = String(process.env[name] || '').trim().toLowerCase();
  return v === '1' || v === 'true' || v === 'yes';
}

export function getPasswordMinLength() {
  const raw = Number.parseInt(process.env.PASSWORD_MIN_LENGTH || '12', 10);
  if (!Number.isFinite(raw)) return 12;
  return Math.max(8, Math.min(raw, 128));
}

export function isStrictPasswordClassesRequired() {
  return !envBool('PASSWORD_SKIP_COMPLEXITY');
}

/**
 * @returns {{ ok: true } | { ok: false, message: string }}
 */
export function validateNewPasswordStrength(password) {
  const p = String(password || '');
  const min = getPasswordMinLength();

  if (p.length < min) {
    return {
      ok: false,
      message: `La contraseña debe tener al menos ${min} caracteres.`
    };
  }

  if (p.length > 512) {
    return {
      ok: false,
      message: 'La contraseña es demasiado larga.'
    };
  }

  if (!isStrictPasswordClassesRequired()) {
    return { ok: true };
  }

  const hasLower = /[a-z]/.test(p);
  const hasUpper = /[A-Z]/.test(p);
  const hasDigit = /\d/.test(p);
  const hasSymbol = /[^A-Za-z0-9]/.test(p);
  const classes = [hasLower, hasUpper, hasDigit, hasSymbol].filter(Boolean)
    .length;

  if (classes < 3) {
    return {
      ok: false,
      message:
        'La contraseña debe incluir al menos tres de las siguientes categorías: minúsculas, mayúsculas, números y símbolos.'
    };
  }

  return { ok: true };
}
