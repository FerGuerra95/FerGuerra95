import {
  getUserFromToken,
  loginUser
} from '../../services/auth/auth.service.js';

function getBearerToken(req) {
  const header = req.headers.authorization || '';

  if (!header.startsWith('Bearer ')) {
    return '';
  }

  return header.slice(7).trim();
}

function sendAuthError(res, error) {
  const status = error?.status || 401;

  return res.status(status).json({
    data: null,
    meta: {},
    error: {
      message: error?.message || 'No autorizado'
    }
  });
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({
        data: null,
        meta: {},
        error: {
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
      meta: {
        mode: 'json-auth'
      },
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
    meta: {},
    error: null
  });
};

export const me = async (req, res) => {
  try {
    const token = getBearerToken(req);

    if (!token) {
      return res.status(401).json({
        data: null,
        meta: {},
        error: {
          message: 'Token no encontrado.'
        }
      });
    }

    const user = await getUserFromToken(token);

    return res.json({
      data: {
        user
      },
      meta: {
        mode: 'json-auth'
      },
      error: null
    });
  } catch (error) {
    return sendAuthError(res, error);
  }
};