import {
  assertPlainObject,
  normalizeString,
  validationError
} from '../middlewares/validate.middleware.js';
import { validateNewPasswordStrength } from '../../services/auth/passwordPolicy.js';

function normalizeEmail(value) {
  const email = normalizeString(value).toLowerCase();

  if (!email || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    validationError('Email no valido.');
  }

  return email;
}

function normalizePassword(value) {
  const password = normalizeString(value);

  if (!password) {
    validationError('Password obligatorio.');
  }

  if (password.length > 512) {
    validationError('Password demasiado largo.');
  }

  return password;
}

function login(body = {}) {
  const payload = assertPlainObject(body, 'body');

  return {
    email: normalizeEmail(payload.email),
    password: normalizePassword(payload.password)
  };
}

function passwordResetRequestBody(body = {}) {
  const payload = assertPlainObject(body, 'body');

  return {
    email: normalizeEmail(payload.email)
  };
}

function passwordResetConfirmBody(body = {}) {
  const payload = assertPlainObject(body, 'body');
  const token = normalizeString(payload.token);

  if (!token || token.length < 16) {
    validationError('Token no valido.');
  }

  const password = normalizeString(payload.password);

  if (!password) {
    validationError('Password obligatorio.');
  }

  if (password.length > 512) {
    validationError('Password demasiado largo.');
  }

  const strength = validateNewPasswordStrength(password);
  if (!strength.ok) {
    validationError(strength.message);
  }

  return {
    token,
    password
  };
}

export const authValidator = {
  login: {
    body: login
  },
  passwordResetRequest: {
    body: passwordResetRequestBody
  },
  passwordResetConfirm: {
    body: passwordResetConfirmBody
  }
};
