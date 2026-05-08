function createValidationError(message, details = []) {
  const error = new Error(message || 'Solicitud no valida.');
  error.status = 400;
  error.code = 'VALIDATION_ERROR';
  error.details = details;
  return error;
}

function normalizeSchema(schema) {
  if (typeof schema === 'function') {
    return {
      body: schema
    };
  }

  return schema || {};
}

function runValidator(validator, value, req, segment) {
  if (!validator) return value;

  if (typeof validator !== 'function') {
    throw createValidationError(
      `Validador no configurado correctamente para ${segment}.`
    );
  }

  return validator(value, req);
}

export const validate = (schema) => (req, _res, next) => {
  const normalizedSchema = normalizeSchema(schema);

  try {
    if (normalizedSchema.body) {
      const nextBody = runValidator(
        normalizedSchema.body,
        req.body,
        req,
        'body'
      );

      if (nextBody !== undefined) req.body = nextBody;
    }

    if (normalizedSchema.params) {
      const nextParams = runValidator(
        normalizedSchema.params,
        req.params,
        req,
        'params'
      );

      if (nextParams !== undefined) req.params = nextParams;
    }

    if (normalizedSchema.query) {
      const nextQuery = runValidator(
        normalizedSchema.query,
        req.query,
        req,
        'query'
      );

      if (nextQuery !== undefined) {
        Object.assign(req.query, nextQuery);
      }
    }

    return next();
  } catch (error) {
    if (error?.status) {
      return next(error);
    }

    return next(
      createValidationError(error?.message || 'Solicitud no valida.')
    );
  }
};

export function validationError(message, details = []) {
  throw createValidationError(message, details);
}

export function assertPlainObject(value, label = 'payload') {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    validationError(`${label} debe ser un objeto.`);
  }

  return value;
}

export function normalizeString(value, fallback = '') {
  return String(value ?? fallback).trim();
}

export function assertId(value, label = 'id') {
  const id = normalizeString(value);

  if (!/^[a-zA-Z0-9_:-]{1,160}$/.test(id)) {
    validationError(`${label} no es valido.`);
  }

  return id;
}

export function assertOptionalEnum(value, allowedValues, fallback) {
  const text = normalizeString(value, fallback);

  if (!text) return fallback;

  if (!allowedValues.includes(text)) {
    validationError(`Valor no permitido: ${text}.`);
  }

  return text;
}

export function assertFiniteNumber(value, label) {
  if (value === undefined || value === null || value === '') return value;

  const number = Number(value);

  if (!Number.isFinite(number)) {
    validationError(`${label} debe ser numerico.`);
  }

  return number;
}
