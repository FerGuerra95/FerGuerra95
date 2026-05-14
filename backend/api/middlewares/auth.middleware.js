import {
  getTokenPayload,
  getUserFromToken
} from '../../services/auth/auth.service.js';

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
  RUN_COMPLIANCE_AUDIT: 'run:compliance_audit',

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
  CREATE_MA_REPORT: 'create:ma_report',
  CREATE_MA_SHARE: 'create:ma_share',
  REVOKE_MA_SHARE: 'revoke:ma_share',
  MANAGE_MA_DATA_ROOM: 'manage:ma_data_room',
  CREATE_MA_DEAL: 'create:ma_deal',
  UPDATE_MA_DEAL: 'update:ma_deal',
  DELETE_MA_DEAL: 'delete:ma_deal',
  READ_AUDIT_LOG: 'read:audit_log',

  CREATE_FUNDING_SNAPSHOT: 'create:funding_snapshot',
  READ_PMI: 'read:pmi',
  CREATE_PMI: 'create:pmi',
  UPDATE_PMI: 'update:pmi',
  DELETE_PMI: 'delete:pmi',
  MANAGE_PMI_CASE: 'manage:pmi_case',
  CREATE_PMI_FROM_MA_DEAL: 'create:pmi_from_ma_deal',
  DUPLICATE_PMI_CASE: 'duplicate:pmi_case',
  READ_PMI_AUDIT: 'read:pmi_audit',
  UPDATE_PMI_WORKSTREAM: 'update:pmi_workstream',
  MANAGE_PMI_SYNERGY: 'manage:pmi_synergy',
  MANAGE_PMI_RISK: 'manage:pmi_risk',
  MANAGE_PMI_DAY1: 'manage:pmi_day1',
  EXPORT_PMI_REPORT: 'export:pmi_report',
  MANAGE_ECOSYSTEM_BRANCH: 'manage:ecosystem_branch',
  READ_BRIDGE: 'read:bridge',
  CREATE_BRIDGE_SIGNAL: 'create:bridge_signal',
  UPDATE_BRIDGE_SIGNAL: 'update:bridge_signal',
  RESOLVE_BRIDGE_SIGNAL: 'resolve:bridge_signal',
  DISMISS_BRIDGE_SIGNAL: 'dismiss:bridge_signal',
  MANAGE_BRIDGE_DEPENDENCY: 'manage:bridge_dependency',
  EXPORT_BRIDGE_REPORT: 'export:bridge_report',

  READ_GOVERNANCE: 'read:governance',
  CREATE_GOVERNANCE: 'create:governance',
  UPDATE_GOVERNANCE: 'update:governance',
  DELETE_GOVERNANCE: 'delete:governance',
  APPROVE_GOVERNANCE_DECISION: 'approve:governance_decision',
  MANAGE_GOVERNANCE_POLICY: 'manage:governance_policy',
  MANAGE_GOVERNANCE_COMMITTEE: 'manage:governance_committee',
  EXPORT_GOVERNANCE_REPORT: 'export:governance_report',

  READ_HERITAGE: 'read:heritage',
  CREATE_HERITAGE: 'create:heritage',
  UPDATE_HERITAGE: 'update:heritage',
  DELETE_HERITAGE: 'delete:heritage',
  MANAGE_HERITAGE_PROTECTION: 'manage:heritage_protection',
  MANAGE_HERITAGE_SUCCESSION: 'manage:heritage_succession',
  EXPORT_HERITAGE_REPORT: 'export:heritage_report',

  READ_RISK: 'read:risk',
  CREATE_RISK: 'create:risk',
  UPDATE_RISK: 'update:risk',
  DELETE_RISK: 'delete:risk',
  MANAGE_RISK_CONTROL: 'manage:risk_control',
  MANAGE_RISK_MITIGATION: 'manage:risk_mitigation',
  MANAGE_RISK_INCIDENT: 'manage:risk_incident',
  MANAGE_RISK_KRI: 'manage:risk_kri',
  MANAGE_RISK_APPETITE: 'manage:risk_appetite',
  EXPORT_RISK_REPORT: 'export:risk_report',

  READ_REPORTING: 'read:reporting',
  CREATE_REPORTING: 'create:reporting',
  UPDATE_REPORTING: 'update:reporting',
  EXPORT_REPORTING: 'export:reporting',

  READ_STRATEGY: 'read:strategy',
  CREATE_STRATEGY: 'create:strategy',
  UPDATE_STRATEGY: 'update:strategy',
  EXPORT_STRATEGY: 'export:strategy'
});

const ROLE_PERMISSIONS = Object.freeze({
  admin: Object.freeze(['*']),

  board_member: Object.freeze([
    PERMISSIONS.READ,
    PERMISSIONS.READ_GOVERNANCE,
    PERMISSIONS.READ_HERITAGE,
    PERMISSIONS.READ_AUDIT_LOG,
    PERMISSIONS.READ_PMI,
    PERMISSIONS.READ_PMI_AUDIT,
    PERMISSIONS.READ_BRIDGE,
    PERMISSIONS.READ_RISK,
    PERMISSIONS.READ_REPORTING,
    PERMISSIONS.READ_STRATEGY
  ]),

  user: Object.freeze([
    PERMISSIONS.READ,

    PERMISSIONS.CREATE_SUPPLIER,
    PERMISSIONS.UPDATE_SUPPLIER,

    PERMISSIONS.CREATE_ALERT,
    PERMISSIONS.UPDATE_ALERT,

    PERMISSIONS.CREATE_EVIDENCE,
    PERMISSIONS.UPDATE_EVIDENCE,
    PERMISSIONS.RUN_COMPLIANCE_AUDIT,

    PERMISSIONS.CREATE_REVIEW,
    PERMISSIONS.UPDATE_REVIEW,
    PERMISSIONS.DECIDE_REVIEW,

    PERMISSIONS.CREATE_REPORT,

    PERMISSIONS.CREATE_MA_CASE,
    PERMISSIONS.UPDATE_MA_CASE,
    PERMISSIONS.CREATE_MA_REPORT,
    PERMISSIONS.CREATE_MA_SHARE,
    PERMISSIONS.REVOKE_MA_SHARE,
    PERMISSIONS.MANAGE_MA_DATA_ROOM,
    PERMISSIONS.CREATE_MA_DEAL,
    PERMISSIONS.UPDATE_MA_DEAL,
    PERMISSIONS.READ_AUDIT_LOG,

    PERMISSIONS.CREATE_FUNDING_SNAPSHOT,
    PERMISSIONS.READ_PMI,
    PERMISSIONS.CREATE_PMI,
    PERMISSIONS.UPDATE_PMI,
    PERMISSIONS.MANAGE_PMI_CASE,
    PERMISSIONS.CREATE_PMI_FROM_MA_DEAL,
    PERMISSIONS.DUPLICATE_PMI_CASE,
    PERMISSIONS.READ_PMI_AUDIT,
    PERMISSIONS.UPDATE_PMI_WORKSTREAM,
    PERMISSIONS.MANAGE_PMI_SYNERGY,
    PERMISSIONS.MANAGE_PMI_RISK,
    PERMISSIONS.MANAGE_PMI_DAY1,
    PERMISSIONS.EXPORT_PMI_REPORT,
    PERMISSIONS.MANAGE_ECOSYSTEM_BRANCH,
    PERMISSIONS.READ_BRIDGE,
    PERMISSIONS.CREATE_BRIDGE_SIGNAL,
    PERMISSIONS.UPDATE_BRIDGE_SIGNAL,
    PERMISSIONS.RESOLVE_BRIDGE_SIGNAL,
    PERMISSIONS.DISMISS_BRIDGE_SIGNAL,
    PERMISSIONS.MANAGE_BRIDGE_DEPENDENCY,
    PERMISSIONS.EXPORT_BRIDGE_REPORT,
    PERMISSIONS.READ_GOVERNANCE,
    PERMISSIONS.CREATE_GOVERNANCE,
    PERMISSIONS.UPDATE_GOVERNANCE,
    PERMISSIONS.MANAGE_GOVERNANCE_POLICY,
    PERMISSIONS.MANAGE_GOVERNANCE_COMMITTEE,
    PERMISSIONS.EXPORT_GOVERNANCE_REPORT,

    PERMISSIONS.READ_HERITAGE,
    PERMISSIONS.CREATE_HERITAGE,
    PERMISSIONS.UPDATE_HERITAGE,
    PERMISSIONS.MANAGE_HERITAGE_PROTECTION,
    PERMISSIONS.MANAGE_HERITAGE_SUCCESSION,
    PERMISSIONS.EXPORT_HERITAGE_REPORT,

    PERMISSIONS.READ_RISK,
    PERMISSIONS.CREATE_RISK,
    PERMISSIONS.UPDATE_RISK,
    PERMISSIONS.MANAGE_RISK_CONTROL,
    PERMISSIONS.MANAGE_RISK_MITIGATION,
    PERMISSIONS.MANAGE_RISK_INCIDENT,
    PERMISSIONS.MANAGE_RISK_KRI,
    PERMISSIONS.MANAGE_RISK_APPETITE,
    PERMISSIONS.EXPORT_RISK_REPORT,

    PERMISSIONS.READ_REPORTING,
    PERMISSIONS.CREATE_REPORTING,
    PERMISSIONS.UPDATE_REPORTING,
    PERMISSIONS.EXPORT_REPORTING,

    PERMISSIONS.READ_STRATEGY,
    PERMISSIONS.CREATE_STRATEGY,
    PERMISSIONS.UPDATE_STRATEGY,
    PERMISSIONS.EXPORT_STRATEGY
  ]),

  viewer: Object.freeze([
    PERMISSIONS.READ,
    PERMISSIONS.READ_GOVERNANCE,
    PERMISSIONS.READ_HERITAGE,
    PERMISSIONS.READ_PMI,
    PERMISSIONS.READ_BRIDGE,
    PERMISSIONS.READ_RISK,
    PERMISSIONS.READ_REPORTING,
    PERMISSIONS.READ_STRATEGY
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
      requestId: res.req?.requestId,
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
      requestId: res.req?.requestId,
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
    const tokenPayload = getTokenPayload(token);

    if (!user?.id) {
      return unauthorized(res, 'Sesión no válida.');
    }

    if (!user?.organizationId) {
      return forbidden(res, 'Usuario sin organización asignada.');
    }

    req.user = user;
    req.organizationId = user.organizationId;
    req.role = getRole(user);
    req.authToken = token;
    req.authSessionId = tokenPayload?.jti || '';

    return next();
  } catch (error) {
    return res.status(error?.status || 401).json({
      data: null,
      meta: {
        requestId: req.requestId,
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
