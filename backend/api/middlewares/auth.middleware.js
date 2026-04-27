import { getUserFromToken } from '../../services/auth/auth.service.js';

export const PERMISSIONS = Object.freeze({
  READ: 'read',

  CREATE_SUPPLIER: 'create:supplier',
  UPDATE_SUPPLIER: 'update:supplier',
  DELETE_SUPPLIER: 'delete:supplier',

  CREATE_ALERT: 'create:alert',
  UPDATE_ALERT: 'update:alert',
  DELETE_ALERT: 'delete:alert',

  CREATE_EVIDENCE: 'create:evidence',
  UPDATE_EVIDENCE: 'update:evidence',
  DELETE_EVIDENCE: 'delete:evidence',

  CREATE_REVIEW: 'create:review',
  UPDATE_REVIEW: 'update:review',
  DECIDE_REVIEW: 'decide:review',
  DELETE_REVIEW: 'delete:review',

  CREATE_REPORT: 'create:report',
  UPDATE_REPORT: 'update:report',
  DELETE_REPORT: 'delete:report',

  CREATE_MA_CASE: 'create:ma_case',
  UPDATE_MA_CASE: 'update:ma_case',
  DELETE_MA_CASE: 'delete:ma_case',
  CREATE_MA_REPORT: 'create:ma_report'
});

const ROLE_PERMISSIONS = Object.freeze({
  admin: Object.freeze(['*']),

  user: Object.freeze([
    PERMISSIONS.READ,

    PERMISSIONS.CREATE_SUPPLIER,
    PERMISSIONS.UPDATE_SUPPLIER,

    PERMISSIONS.CREATE_ALERT,
    PERMISSIONS.UPDATE_ALERT,

    PERMISSIONS.CREATE_EVIDENCE,
    PERMISSIONS.UPDATE_EVIDENCE,

    PERMISSIONS.CREATE_REVIEW,
    PERMISSIONS.UPDATE_REVIEW,
    PERMISSIONS.DECIDE_REVIEW,

    PERMISSIONS.CREATE_REPORT,

    PERMISSIONS.CREATE_MA_CASE,
    PERMISSIONS.UPDATE_MA_CASE,
    PERMISSIONS.CREATE_MA_REPORT
  ]),

  viewer: Object.freeze([
    PERMISSIONS.READ
  ])
});

function getBearerToken(req) {
  const header = req.headers.authorization || '';

  if (!header.startsWith('Bearer ')) {
    return '';
  }

  return header.slice(7).trim();
}

function getRole(user) {
  return String(user?.role || 'viewer').trim().toLowerCase();
}

function userHasPermission(user, permission) {
  if (!user?.id) {
    return false;
  }

  const role = getRole(user);
  const permissions = ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS.viewer;

  return permissions.includes('*') || permissions.includes(permission);
}

function unauthorized(res, message = 'No autorizado.') {
  return res.status(401).json({
    data: null,
    meta: {
      timestamp: new Date().toISOString()
    },
    error: {
      code: 'UNAUTHORIZED',
      message
    }
  });
}

function forbidden(res, message = 'No tienes permisos para realizar esta acción.') {
  return res.status(403).json({
    data: null,
    meta: {
      timestamp: new Date().toISOString()
    },
    error: {
      code: 'FORBIDDEN',
      message
    }
  });
}

export const requireAuth = async (req, res, next) => {
  try {
    const token = getBearerToken(req);

    if (!token) {
      return unauthorized(res, 'Token no encontrado.');
    }

    const user = await getUserFromToken(token);

    if (!user?.id) {
      return unauthorized(res, 'Sesión no válida.');
    }

    if (!user?.organizationId) {
      return forbidden(res, 'Usuario sin organización asignada.');
    }

    req.user = user;
    req.organizationId = user.organizationId;
    req.role = getRole(user);

    return next();
  } catch (error) {
    return res.status(error?.status || 401).json({
      data: null,
      meta: {
        timestamp: new Date().toISOString()
      },
      error: {
        code: 'UNAUTHORIZED',
        message: error?.message || 'No autorizado.'
      }
    });
  }
};

export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user?.id) {
      return unauthorized(res, 'Sesión no válida.');
    }

    const role = getRole(req.user);

    const normalizedAllowedRoles = allowedRoles.map((item) =>
      String(item || '').trim().toLowerCase()
    );

    if (!normalizedAllowedRoles.includes(role)) {
      return forbidden(res);
    }

    return next();
  };
}

export function requirePermission(permission) {
  return (req, res, next) => {
    if (!req.user?.id) {
      return unauthorized(res, 'Sesión no válida.');
    }

    if (!permission) {
      return forbidden(res, 'Permiso no definido.');
    }

    if (!userHasPermission(req.user, permission)) {
      return forbidden(res);
    }

    return next();
  };
}

export function can(user, permission) {
  return userHasPermission(user, permission);
}

export function getPermissionsForRole(role) {
  const normalizedRole = String(role || 'viewer').trim().toLowerCase();
  const permissions = ROLE_PERMISSIONS[normalizedRole] || ROLE_PERMISSIONS.viewer;

  return [...permissions];
}