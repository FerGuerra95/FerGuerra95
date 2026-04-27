import crypto from 'node:crypto';

import {
  allSql,
  getSql,
  runSql,
  transaction,
  fromJson
} from '../../storage/sqliteStorage.js';

const AUTH_SECRET =
  process.env.AUTH_SECRET || 'ceo-os-local-development-secret';

const TOKEN_TTL_SECONDS = 60 * 60 * 24 * 7;

const VALID_ROLES = ['admin', 'user', 'viewer'];

const DEMO_USERS = [
  {
    id: 'u_demo_admin',
    name: 'Fernando',
    email: 'admin@ceoos.local',
    password: 'admin123',
    role: 'admin',
    organizationId: 'org_demo',
    workspaces: ['ma', 'compliance', 'funding'],
    status: 'active'
  },
  {
    id: 'u_demo_user',
    name: 'Usuario Demo',
    email: 'user@ceoos.local',
    password: 'user123',
    role: 'user',
    organizationId: 'org_demo_2',
    workspaces: ['ma', 'compliance', 'funding'],
    status: 'active'
  },
  {
    id: 'u_demo_viewer',
    name: 'Viewer Demo',
    email: 'viewer@ceoos.local',
    password: 'viewer123',
    role: 'viewer',
    organizationId: 'org_demo_3',
    workspaces: ['ma', 'compliance', 'funding'],
    status: 'active'
  }
];

function isProduction() {
  return process.env.NODE_ENV === 'production';
}

function createError(message, status = 401, code = 'AUTH_ERROR') {
  const error = new Error(message);
  error.status = status;
  error.code = code;
  return error;
}

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function normalizeRole(role) {
  const normalizedRole = String(role || 'viewer').trim().toLowerCase();

  return VALID_ROLES.includes(normalizedRole) ? normalizedRole : 'viewer';
}

function normalizeWorkspaces(workspaces) {
  return Array.isArray(workspaces) ? workspaces : [];
}

function base64url(input) {
  return Buffer.from(input)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function base64urlJson(value) {
  return base64url(JSON.stringify(value));
}

function parseBase64urlJson(value) {
  const normalized = String(value || '').replace(/-/g, '+').replace(/_/g, '/');

  const padded = normalized.padEnd(
    normalized.length + ((4 - (normalized.length % 4)) % 4),
    '='
  );

  return JSON.parse(Buffer.from(padded, 'base64').toString('utf8'));
}

function signPayload(encodedHeader, encodedPayload) {
  return crypto
    .createHmac('sha256', AUTH_SECRET)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function safeCompare(a, b) {
  const left = Buffer.from(String(a));
  const right = Buffer.from(String(b));

  if (left.length !== right.length) {
    return false;
  }

  return crypto.timingSafeEqual(left, right);
}

function createSalt() {
  return crypto.randomBytes(16).toString('hex');
}

function hashPassword(password, salt) {
  return crypto
    .createHash('sha256')
    .update(`${salt}:${password}`)
    .digest('hex');
}

function createPasswordRecord(password) {
  const salt = createSalt();

  return {
    passwordSalt: salt,
    passwordHash: hashPassword(password, salt)
  };
}

function hasPasswordRecord(user) {
  return Boolean(user?.passwordHash && user?.passwordSalt);
}

function verifyPassword(password, user) {
  if (!hasPasswordRecord(user)) {
    return false;
  }

  const candidateHash = hashPassword(password, user.passwordSalt);

  return safeCompare(candidateHash, user.passwordHash);
}

function now() {
  return new Date().toISOString();
}

function mapDbUser(row) {
  if (!row) return null;

  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: normalizeRole(row.role),
    organizationId: row.organization_id,
    workspaces: normalizeWorkspaces(fromJson(row.workspaces_json, [])),
    status: row.status || 'active',
    passwordHash: row.password_hash,
    passwordSalt: row.password_salt,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function sanitizeUser(user) {
  if (!user) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: normalizeRole(user.role),
    organizationId: user.organizationId,
    workspaces: normalizeWorkspaces(user.workspaces),
    status: user.status || 'active',
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
}

function getAllUsers() {
  return allSql(
    `
      SELECT
        id,
        name,
        email,
        role,
        organization_id,
        workspaces_json,
        status,
        password_hash,
        password_salt,
        created_at,
        updated_at
      FROM users
      ORDER BY created_at ASC
    `
  ).map(mapDbUser);
}

function getUserByEmail(email) {
  const row = getSql(
    `
      SELECT
        id,
        name,
        email,
        role,
        organization_id,
        workspaces_json,
        status,
        password_hash,
        password_salt,
        created_at,
        updated_at
      FROM users
      WHERE email = @email
      LIMIT 1
    `,
    {
      email: normalizeEmail(email)
    }
  );

  return mapDbUser(row);
}

function getUserById(id) {
  const row = getSql(
    `
      SELECT
        id,
        name,
        email,
        role,
        organization_id,
        workspaces_json,
        status,
        password_hash,
        password_salt,
        created_at,
        updated_at
      FROM users
      WHERE id = @id
      LIMIT 1
    `,
    {
      id
    }
  );

  return mapDbUser(row);
}

function userExistsByIdOrEmail({ id, email }) {
  return Boolean(
    getSql(
      `
        SELECT id
        FROM users
        WHERE id = @id OR email = @email
        LIMIT 1
      `,
      {
        id,
        email: normalizeEmail(email)
      }
    )
  );
}

function insertUser(user) {
  const createdAt = now();
  const passwordRecord = createPasswordRecord(user.password);

  runSql(
    `
      INSERT INTO users (
        id,
        name,
        email,
        role,
        organization_id,
        workspaces_json,
        status,
        password_hash,
        password_salt,
        created_at,
        updated_at
      )
      VALUES (
        @id,
        @name,
        @email,
        @role,
        @organizationId,
        @workspacesJson,
        @status,
        @passwordHash,
        @passwordSalt,
        @createdAt,
        @updatedAt
      )
    `,
    {
      id: user.id,
      name: user.name,
      email: normalizeEmail(user.email),
      role: normalizeRole(user.role),
      organizationId: user.organizationId,
      workspacesJson: JSON.stringify(normalizeWorkspaces(user.workspaces)),
      status: user.status || 'active',
      passwordHash: passwordRecord.passwordHash,
      passwordSalt: passwordRecord.passwordSalt,
      createdAt,
      updatedAt: createdAt
    }
  );
}

function getBootstrapUsers() {
  if (!isProduction()) {
    return DEMO_USERS;
  }

  const email = normalizeEmail(process.env.BOOTSTRAP_ADMIN_EMAIL);
  const password = String(process.env.BOOTSTRAP_ADMIN_PASSWORD || '').trim();

  if (!email || !password) {
    return [];
  }

  if (password.length < 12) {
    throw createError(
      'BOOTSTRAP_ADMIN_PASSWORD debe tener al menos 12 caracteres en producción.',
      500,
      'WEAK_BOOTSTRAP_PASSWORD'
    );
  }

  return [
    {
      id: process.env.BOOTSTRAP_ADMIN_ID || 'u_bootstrap_admin',
      name: process.env.BOOTSTRAP_ADMIN_NAME || 'Admin',
      email,
      password,
      role: 'admin',
      organizationId:
        process.env.BOOTSTRAP_ORGANIZATION_ID || 'org_bootstrap',
      workspaces: ['ma', 'compliance'],
      status: 'active'
    }
  ];
}

function ensureUsersSeeded() {
  const bootstrapUsers = getBootstrapUsers();

  if (bootstrapUsers.length === 0) {
    return getAllUsers();
  }

  transaction(() => {
    for (const user of bootstrapUsers) {
      if (!userExistsByIdOrEmail(user)) {
        insertUser(user);
      }
    }
  });

  return getAllUsers();
}

function createToken(user) {
  const issuedAt = Math.floor(Date.now() / 1000);

  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };

  const payload = {
    sub: user.id,
    email: user.email,
    role: normalizeRole(user.role),
    organizationId: user.organizationId,
    workspaces: normalizeWorkspaces(user.workspaces),
    iat: issuedAt,
    exp: issuedAt + TOKEN_TTL_SECONDS
  };

  const encodedHeader = base64urlJson(header);
  const encodedPayload = base64urlJson(payload);
  const signature = signPayload(encodedHeader, encodedPayload);

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

function verifyToken(token) {
  const parts = String(token || '').split('.');

  if (parts.length !== 3) {
    throw createError('Token inválido.', 401, 'INVALID_TOKEN');
  }

  const [encodedHeader, encodedPayload, signature] = parts;
  const expectedSignature = signPayload(encodedHeader, encodedPayload);

  if (!safeCompare(signature, expectedSignature)) {
    throw createError('Token inválido.', 401, 'INVALID_TOKEN');
  }

  let payload;

  try {
    payload = parseBase64urlJson(encodedPayload);
  } catch {
    throw createError('Token inválido.', 401, 'INVALID_TOKEN');
  }

  const currentTime = Math.floor(Date.now() / 1000);

  if (payload.exp && payload.exp <= currentTime) {
    throw createError('Token caducado.', 401, 'TOKEN_EXPIRED');
  }

  return payload;
}

export async function loginUser({ email, password }) {
  ensureUsersSeeded();

  const normalizedEmail = normalizeEmail(email);
  const normalizedPassword = String(password || '').trim();

  const user = getUserByEmail(normalizedEmail);

  if (!user || user.status === 'inactive') {
    throw createError(
      'Email o contraseña incorrectos.',
      401,
      'INVALID_CREDENTIALS'
    );
  }

  const isValidPassword = verifyPassword(normalizedPassword, user);

  if (!isValidPassword) {
    throw createError(
      'Email o contraseña incorrectos.',
      401,
      'INVALID_CREDENTIALS'
    );
  }

  const safeUser = sanitizeUser(user);
  const token = createToken(safeUser);

  return {
    user: safeUser,
    token
  };
}

export async function getUserFromToken(token) {
  const payload = verifyToken(token);

  ensureUsersSeeded();

  const user = getUserById(payload.sub);

  if (!user || user.status === 'inactive') {
    throw createError('Usuario no encontrado.', 401, 'USER_NOT_FOUND');
  }

  return sanitizeUser(user);
}

export function getTokenPayload(token) {
  return verifyToken(token);
}

export function listUsers() {
  return ensureUsersSeeded().map(sanitizeUser);
}