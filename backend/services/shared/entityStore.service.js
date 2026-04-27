import {
  createId,
  readCollection,
  writeCollection
} from '../../storage/jsonStorage.js';

function now() {
  return new Date().toISOString();
}

function createStoreError(message, status = 400, code = 'STORE_ERROR') {
  const error = new Error(message);
  error.status = status;
  error.code = code;
  return error;
}

function ensureArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeId(value) {
  return String(value || '').trim();
}

function cleanPatch(patch = {}) {
  const {
    id,
    createdAt,
    ...safePatch
  } = patch || {};

  return safePatch;
}

function hasDuplicateId(items = [], id) {
  const safeId = normalizeId(id);

  if (!safeId) return false;

  return items.some((item) => item.id === safeId);
}

function buildEntity({ defaults = {}, payload = {}, idPrefix }) {
  const timestamp = now();
  const id = normalizeId(payload.id) || createId(idPrefix);

  return {
    ...defaults,
    ...payload,
    id,
    createdAt: payload.createdAt || timestamp,
    updatedAt: timestamp
  };
}

export function createEntityStore(collectionName, idPrefix, defaults = {}) {
  if (!collectionName) {
    throw createStoreError(
      'collectionName es obligatorio para crear un entity store.',
      500,
      'MISSING_COLLECTION_NAME'
    );
  }

  if (!idPrefix) {
    throw createStoreError(
      'idPrefix es obligatorio para crear un entity store.',
      500,
      'MISSING_ID_PREFIX'
    );
  }

  return {
    async list() {
      const items = await readCollection(collectionName, []);
      return ensureArray(items);
    },

    async getById(id) {
      const safeId = normalizeId(id);

      if (!safeId) return null;

      const items = await readCollection(collectionName, []);
      return ensureArray(items).find((item) => item.id === safeId) || null;
    },

    async create(payload = {}) {
      const items = ensureArray(await readCollection(collectionName, []));
      const item = buildEntity({
        defaults,
        payload,
        idPrefix
      });

      if (hasDuplicateId(items, item.id)) {
        throw createStoreError(
          `Ya existe un registro con id ${item.id}.`,
          409,
          'DUPLICATE_ENTITY_ID'
        );
      }

      const next = [item, ...items];

      await writeCollection(collectionName, next);

      return item;
    },

    async update(id, patch = {}) {
      const safeId = normalizeId(id);

      if (!safeId) return null;

      const items = ensureArray(await readCollection(collectionName, []));
      const safePatch = cleanPatch(patch);

      let updated = null;

      const next = items.map((item) => {
        if (item.id !== safeId) return item;

        updated = {
          ...item,
          ...safePatch,
          id: item.id,
          createdAt: item.createdAt,
          updatedAt: now()
        };

        return updated;
      });

      if (!updated) return null;

      await writeCollection(collectionName, next);

      return updated;
    },

    async remove(id) {
      const safeId = normalizeId(id);

      if (!safeId) {
        return {
          deleted: false,
          id: '',
          reason: 'missing_id'
        };
      }

      const items = ensureArray(await readCollection(collectionName, []));
      const exists = items.some((item) => item.id === safeId);

      if (!exists) {
        return {
          deleted: false,
          id: safeId,
          reason: 'not_found'
        };
      }

      const next = items.filter((item) => item.id !== safeId);

      await writeCollection(collectionName, next);

      return {
        deleted: true,
        id: safeId
      };
    },

    async replaceAll(items = []) {
      const safeItems = ensureArray(items).map((item) => ({
        ...defaults,
        ...item,
        id: normalizeId(item.id) || createId(idPrefix),
        createdAt: item.createdAt || now(),
        updatedAt: item.updatedAt || now()
      }));

      const seen = new Set();

      const duplicated = safeItems.find((item) => {
        if (seen.has(item.id)) return true;
        seen.add(item.id);
        return false;
      });

      if (duplicated) {
        throw createStoreError(
          `No se puede reemplazar la colección: id duplicado ${duplicated.id}.`,
          409,
          'DUPLICATE_ENTITY_ID'
        );
      }

      await writeCollection(collectionName, safeItems);

      return safeItems;
    },

    async count() {
      const items = await readCollection(collectionName, []);
      return ensureArray(items).length;
    },

    async exists(id) {
      const item = await this.getById(id);
      return Boolean(item);
    }
  };
}