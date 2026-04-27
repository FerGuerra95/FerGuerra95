import { loginUser } from '../../services/auth/auth.service.js';

function buildMeta(extra = {}) {
  return {
    timestamp: new Date().toISOString(),
    ...extra
  };
}

function sendAuthError(res, error) {
  const status = error?.status || 401;

  return res.status(status).json({
    data: null,
    meta: buildMeta(),
    error: {
      code: error?.code || 'AUTH_ERROR',
      message: error?.message || 'No autorizado.'
    }
  });
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({
        data: null,
        meta: buildMeta(),
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Email y contraseña son obligatorios.'
        }
      });
    }

    const result = await loginUser({
      email,
      password
    });

    return res.json({
      data: {
        user: result.user,
        token: result.token
      },
      meta: buildMeta({
        mode: 'json-auth'
      }),
      error: null
    });
  } catch (error) {
    return sendAuthError(res, error);
  }
};

export const logout = async (_req, res) => {
  return res.json({
    data: {
      loggedOut: true
    },
    meta: buildMeta({
      mode: 'json-auth'
    }),
    error: null
  });
};

export const me = async (req, res) => {
  return res.json({
    data: {
      user: req.user
    },
    meta: buildMeta({
      mode: 'json-auth'
    }),
    error: null
  });
};