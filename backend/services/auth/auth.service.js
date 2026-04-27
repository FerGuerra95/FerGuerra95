import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.resolve(__dirname, '../../data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

const AUTH_SECRET =
  process.env.AUTH_SECRET || 'ceo-os-local-development-secret';

const TOKEN_TTL_SECONDS = 60 * 60 * 24 * 7;

const VALID_ROLES = ['admin', 'user', 'viewer'];

const SEED_USERS = [
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

function createError(message, status = 401, code = 'AUTH_ERROR') {
  const error = new Error(message);
  error.status = status;
  error.code = code;
  return error;
}

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, {
      recursive: true
    });
  }
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

function normalizeRole(role) {
  const normalizedRole = String(role || 'viewer').trim().toLowerCase();

  return VALID_ROLES.includes(normalizedRole) ? normalizedRole : 'viewer';
}

function sanitizeUser(user) {
  if (!user) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: normalizeRole(user.role),
    organizationId: user.organizationId,
    workspaces: Array.isArray(user.workspaces) ? user.workspaces : [],
    status: user.status || 'active',
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
}

function readUsersFile() {
  ensureDataDir();

  if (!fs.existsSync(USERS_FILE)) {
    return [];
  }

  try {
    const raw = fs.readFileSync(USERS_FILE, 'utf8');
    const parsed = JSON.parse(raw);

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeUsersFile(users) {
  ensureDataDir();

  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
}

function buildSeedUser(seedUser) {
  const now = new Date().toISOString();
  const passwordRecord = createPasswordRecord(seedUser.password);

  return {
    id: seedUser.id,
    name: seedUser.name,
    email: seedUser.email.toLowerCase(),
    role: normalizeRole(seedUser.role),
    organizationId: seedUser.organizationId,
    workspaces: seedUser.workspaces,
    status: seedUser.status || 'active',
    ...passwordRecord,
    createdAt: now,
    updatedAt: now
  };
}

function buildSeedUsers() {
  return SEED_USERS.map(buildSeedUser);
}

function normalizeStoredUser(user) {
  const now = new Date().toISOString();

  const normalizedUser = {
    ...user,
    email: String(user.email || '').trim().toLowerCase(),
    role: normalizeRole(user.role),
    workspaces: Array.isArray(user.workspaces) ? user.workspaces : [],
    status: user.status || 'active',
    createdAt: user.createdAt || now,
    updatedAt: user.updatedAt || now
  };

  if (!hasPasswordRecord(normalizedUser) && normalizedUser.password) {
    const passwordRecord = createPasswordRecord(normalizedUser.password);

    delete normalizedUser.password;

    return {
      ...normalizedUser,
      ...passwordRecord,
      updatedAt: now
    };
  }

  delete normalizedUser.password;

  return normalizedUser;
}

function ensureUsersSeeded() {
  const existingUsers = readUsersFile().map(normalizeStoredUser);

  if (existingUsers.length === 0) {
    const seedUsers = buildSeedUsers();

    writeUsersFile(seedUsers);

    return seedUsers;
  }

  let changed = false;
  const nextUsers = [...existingUsers];

  for (const seedUser of SEED_USERS) {
    const existingById = nextUsers.find((item) => item.id === seedUser.id);
    const existingByEmail = nextUsers.find(
      (item) =>
        String(item.email || '').toLowerCase() ===
        String(seedUser.email || '').toLowerCase()
    );

    if (!existingById && !existingByEmail) {
      nextUsers.push(buildSeedUser(seedUser));
      changed = true;
    }
  }

  const normalizedUsers = nextUsers.map((user) => {
    const normalized = normalizeStoredUser(user);

    if (JSON.stringify(normalized) !== JSON.stringify(user)) {
      changed = true;
    }

    return normalized;
  });

  if (changed) {
    writeUsersFile(normalizedUsers);
  }

  return normalizedUsers;
}

function createToken(user) {
  const now = Math.floor(Date.now() / 1000);

  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };

  const payload = {
    sub: user.id,
    email: user.email,
    role: normalizeRole(user.role),
    organizationId: user.organizationId,
    workspaces: user.workspaces || [],
    iat: now,
    exp: now + TOKEN_TTL_SECONDS
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

  const payload = parseBase64urlJson(encodedPayload);
  const now = Math.floor(Date.now() / 1000);

  if (payload.exp && payload.exp < now) {
    throw createError('Token caducado.', 401, 'TOKEN_EXPIRED');
  }

  return payload;
}

export async function loginUser({ email, password }) {
  const users = ensureUsersSeeded();

  const normalizedEmail = String(email || '').trim().toLowerCase();
  const normalizedPassword = String(password || '').trim();

  const user = users.find((item) => {
    return String(item.email || '').toLowerCase() === normalizedEmail;
  });

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
  const users = ensureUsersSeeded();

  const user = users.find((item) => item.id === payload.sub);

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