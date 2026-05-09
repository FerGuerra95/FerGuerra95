import {
  allSql,
  getDatabase,
  getSql,
  now,
  runSql,
  toJson,
  fromJson,
  createSqliteId
} from './sqliteStorage.js';

const columnsCache = new Map();

function assertSafeIdentifier(value) {
  const text = String(value || '');

  if (!/^[a-zA-Z0-9_]+$/.test(text)) {
    throw new Error(`Identificador SQL no válido: ${text}`);
  }

  return text;
}

function snakeToCamel(value) {
  return String(value || '').replace(/_([a-z])/g, (_match, letter) =>
    letter.toUpperCase()
  );
}

function getColumns(tableName) {
  const safeTable = assertSafeIdentifier(tableName);

  if (columnsCache.has(safeTable)) {
    return columnsCache.get(safeTable);
  }

  const database = getDatabase();
  const rows = database.prepare(`PRAGMA table_info(${safeTable})`).all();

  const columns = rows.map((row) => row.name);
  columnsCache.set(safeTable, columns);

  return columns;
}

function hasOwn(object, key) {
  return Object.prototype.hasOwnProperty.call(object, key);
}

function getJsonFieldName(column) {
  return snakeToCamel(String(column).replace(/_json$/, ''));
}

function getFieldName(column) {
  if (column.endsWith('_json')) {
    return getJsonFieldName(column);
  }

  return snakeToCamel(column);
}

function getOrganizationColumn(tableName) {
  return getColumns(tableName).includes('organization_id')
    ? 'organization_id'
    : null;
}

function getPayloadValueForColumn(payload = {}, column) {
  const camelKey = getFieldName(column);
  const snakeKey = column;

  if (hasOwn(payload, camelKey)) {
    return payload[camelKey];
  }

  if (hasOwn(payload, snakeKey)) {
    return payload[snakeKey];
  }

  return undefined;
}

function rowToEntity(row = {}) {
  const entity = {};

  Object.entries(row).forEach(([column, value]) => {
    const field = getFieldName(column);

    if (column.endsWith('_json')) {
      entity[field] = fromJson(value, column === 'items_json' ? [] : null);
      return;
    }

    entity[field] = value;
  });

  return entity;
}

function buildInsertPayload({ tableName, idPrefix, defaults = {}, payload = {} }) {
  const columns = getColumns(tableName);
  const currentTime = now();

  const entity = {
    ...defaults,
    ...payload,
    id: payload.id || createSqliteId(idPrefix),
    createdAt: payload.createdAt || currentTime,
    updatedAt: currentTime
  };

  const valuesByColumn = {};

  columns.forEach((column) => {
    const value = getPayloadValueForColumn(entity, column);

    if (value === undefined) return;

    if (column.endsWith('_json')) {
      valuesByColumn[column] = toJson(
        value,
        column === 'items_json' ? [] : null
      );
      return;
    }

    valuesByColumn[column] = value;
  });

  return {
    entity,
    valuesByColumn
  };
}

function insertEntity({ tableName, idPrefix, defaults = {}, payload = {} }) {
  const safeTable = assertSafeIdentifier(tableName);

  const { entity, valuesByColumn } = buildInsertPayload({
    tableName: safeTable,
    idPrefix,
    defaults,
    payload
  });

  const columns = Object.keys(valuesByColumn);
  const placeholders = columns.map((column) => `@${column}`);

  const sql = `
    INSERT INTO ${safeTable} (${columns.join(', ')})
    VALUES (${placeholders.join(', ')})
  `;

  runSql(sql, valuesByColumn);

  return entity;
}

export function createSqliteEntityStore(tableName, idPrefix, defaults = {}) {
  const safeTable = assertSafeIdentifier(tableName);

  return {
    async list() {
      const columns = getColumns(safeTable);
      const orderColumn = columns.includes('created_at') ? 'created_at' : 'id';

      const rows = allSql(
        `SELECT * FROM ${safeTable} ORDER BY ${orderColumn} DESC`
      );

      return rows.map(rowToEntity);
    },

    async listByOrganization(organizationId) {
      const organizationColumn = getOrganizationColumn(safeTable);

      if (!organizationColumn || !organizationId) return [];

      const columns = getColumns(safeTable);
      const orderColumn = columns.includes('created_at') ? 'created_at' : 'id';

      const rows = allSql(
        `
          SELECT * FROM ${safeTable}
          WHERE ${organizationColumn} = @organizationId
          ORDER BY ${orderColumn} DESC
        `,
        { organizationId }
      );

      return rows.map(rowToEntity);
    },

    async getById(id) {
      const row = getSql(
        `SELECT * FROM ${safeTable} WHERE id = @id LIMIT 1`,
        { id }
      );

      return row ? rowToEntity(row) : null;
    },

    async getByIdForOrganization(id, organizationId) {
      const organizationColumn = getOrganizationColumn(safeTable);

      if (!organizationColumn || !organizationId) return null;

      const row = getSql(
        `
          SELECT * FROM ${safeTable}
          WHERE id = @id
            AND ${organizationColumn} = @organizationId
          LIMIT 1
        `,
        { id, organizationId }
      );

      return row ? rowToEntity(row) : null;
    },

    async create(payload = {}) {
      const created = insertEntity({
        tableName: safeTable,
        idPrefix,
        defaults,
        payload
      });

      return this.getById(created.id);
    },

    async update(id, patch = {}) {
      const existing = await this.getById(id);

      if (!existing) return null;

      const columns = getColumns(safeTable);

      const nextPatch = {
        ...patch,
        id,
        updatedAt: now()
      };

      const valuesByColumn = {
        id
      };

      columns.forEach((column) => {
        if (column === 'id') return;
        if (column === 'created_at') return;

        const value = getPayloadValueForColumn(nextPatch, column);

        if (value === undefined) return;

        if (column.endsWith('_json')) {
          valuesByColumn[column] = toJson(
            value,
            column === 'items_json' ? [] : null
          );
          return;
        }

        valuesByColumn[column] = value;
      });

      const updateColumns = Object.keys(valuesByColumn).filter(
        (column) => column !== 'id'
      );

      if (updateColumns.length === 0) {
        return existing;
      }

      const assignments = updateColumns.map(
        (column) => `${column} = @${column}`
      );

      runSql(
        `
          UPDATE ${safeTable}
          SET ${assignments.join(', ')}
          WHERE id = @id
        `,
        valuesByColumn
      );

      return this.getById(id);
    },

    async updateForOrganization(id, patch = {}, organizationId) {
      const existing = await this.getByIdForOrganization(id, organizationId);

      if (!existing) return null;

      const columns = getColumns(safeTable);
      const organizationColumn = getOrganizationColumn(safeTable);

      const nextPatch = {
        ...patch,
        id,
        updatedAt: now()
      };

      if (organizationColumn) {
        nextPatch.organizationId = organizationId;
      }

      const valuesByColumn = {
        id,
        organizationId
      };

      columns.forEach((column) => {
        if (column === 'id') return;
        if (column === 'created_at') return;

        const value = getPayloadValueForColumn(nextPatch, column);

        if (value === undefined) return;

        if (column.endsWith('_json')) {
          valuesByColumn[column] = toJson(
            value,
            column === 'items_json' ? [] : null
          );
          return;
        }

        valuesByColumn[column] = value;
      });

      const updateColumns = Object.keys(valuesByColumn).filter(
        (column) => column !== 'id' && column !== 'organizationId'
      );

      if (updateColumns.length === 0) {
        return existing;
      }

      const assignments = updateColumns.map(
        (column) => `${column} = @${column}`
      );

      runSql(
        `
          UPDATE ${safeTable}
          SET ${assignments.join(', ')}
          WHERE id = @id
            AND ${organizationColumn} = @organizationId
        `,
        valuesByColumn
      );

      return this.getByIdForOrganization(id, organizationId);
    },

    async remove(id) {
      const result = runSql(
        `DELETE FROM ${safeTable} WHERE id = @id`,
        { id }
      );

      return {
        deleted: result.changes > 0,
        id
      };
    },

    async removeForOrganization(id, organizationId) {
      const organizationColumn = getOrganizationColumn(safeTable);

      if (!organizationColumn || !organizationId) {
        return {
          deleted: false,
          id
        };
      }

      const result = runSql(
        `
          DELETE FROM ${safeTable}
          WHERE id = @id
            AND ${organizationColumn} = @organizationId
        `,
        { id, organizationId }
      );

      return {
        deleted: result.changes > 0,
        id
      };
    },

    async replaceAll() {
      throw new Error(
        `replaceAll está deshabilitado para ${safeTable}. No se permite borrar tablas completas en arquitectura multi-tenant.`
      );
    }
  };
}
