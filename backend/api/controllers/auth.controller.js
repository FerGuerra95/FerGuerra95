import {
  completePasswordReset,
  loginUser,
  logoutUser,
  requestPasswordReset
} from '../../services/auth/auth.service.js';
import {
  completeOidcAuthorization,
  startOidcAuthorization
} from '../../services/auth/oidcAuth.service.js';

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
        token: result.token,
        session: result.session
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

export const logout = async (req, res) => {
  const result = await logoutUser(req.authToken || '');

  return res.json({
    data: result,
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

export const passwordResetRequest = async (req, res) => {
  try {
    const result = await requestPasswordReset(req.body?.email || '');

    return res.json({
      data: result,
      meta: buildMeta(),
      error: null
    });
  } catch (error) {
    return res.status(error?.status || 500).json({
      data: null,
      meta: buildMeta(),
      error: {
        code: error?.code || 'PASSWORD_RESET_ERROR',
        message: error?.message || 'No se pudo procesar la solicitud.'
      }
    });
  }
};

export const passwordResetConfirm = async (req, res) => {
  try {
    const result = await completePasswordReset({
      token: req.body?.token,
      password: req.body?.password
    });

    return res.json({
      data: result,
      meta: buildMeta(),
      error: null
    });
  } catch (error) {
    return res.status(error?.status || 400).json({
      data: null,
      meta: buildMeta(),
      error: {
        code: error?.code || 'PASSWORD_RESET_ERROR',
        message: error?.message || 'No se pudo restablecer la contraseña.'
      }
    });
  }
};

export const oidcStart = async (req, res) => {
  try {
    await startOidcAuthorization(res);
  } catch (error) {
    return res.status(error?.status || 500).json({
      data: null,
      meta: buildMeta(),
      error: {
        code: error?.code || 'OIDC_ERROR',
        message: error?.message || 'SSO no disponible.'
      }
    });
  }
};

export const oidcCallback = async (req, res) => {
  try {
    await completeOidcAuthorization(req, res);
  } catch (error) {
    const frontend = (
      process.env.FRONTEND_URL ||
      process.env.PUBLIC_APP_URL ||
      'http://localhost:5173'
    ).replace(/\/$/, '');
    return res.redirect(
      302,
      `${frontend}/login?sso_error=${encodeURIComponent(error?.message || 'Error SSO')}`
    );
  }
};
