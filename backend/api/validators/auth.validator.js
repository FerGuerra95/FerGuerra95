import {
  assertPlainObject,
  normalizeString,
  validationError
} from '../middlewares/validate.middleware.js';

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

export const authValidator = {
  login: {
    body: login
  }
};
