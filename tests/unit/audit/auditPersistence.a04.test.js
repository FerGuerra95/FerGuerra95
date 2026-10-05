import { afterEach, describe, expect, it, vi } from 'vitest';

const createMock = vi.fn();

vi.mock('../../../backend/storage/sqliteEntityStore.service.js', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    createSqliteEntityStore(tableName, idPrefix, defaults) {
      const store = actual.createSqliteEntityStore(tableName, idPrefix, defaults);
      if (tableName !== 'audit_logs') return store;
      return {
        ...store,
        create: (...args) => createMock(...args)
      };
    }
  };
});

const { recordAuditLog } = await import('../../../backend/services/audit/auditLog.service.js');

const requiredPayload = {
  organizationId: 'org_a04',
  userId: 'u_a04',
  action: 'a04.test.required',
  entityType: 'audit_test',
  entityId: 'e1',
  metadata: { ok: true }
};

function sqliteFailure() {
  const error = { name: 'SqliteError', code: 'SQLITE_FULL' };
  return error;
}

describe('A04 audit persistence taxonomy', () => {
  afterEach(() => {
    createMock.mockReset();
  });

  it('CLASS A maps SqliteError-shaped failure to AUDIT_PERSISTENCE_FAILED', async () => {
    createMock.mockRejectedValue(sqliteFailure());

    const rejection = await recordAuditLog({ ...requiredPayload, required: true }).catch((error) => error);

    expect(rejection).toBeInstanceOf(Error);
    expect(rejection.code).toBe('AUDIT_PERSISTENCE_FAILED');
    expect(rejection.status).toBe(500);
    expect(rejection.message).toBe('Audit persistence failed');
    expect(rejection.details).toBeUndefined();
    expect(rejection.code).not.toMatch(/^SQLITE_/);
    expect(String(rejection.message)).not.toContain('SQLITE_FULL');
    expect(String(rejection.message)).not.toContain('disk I/O');
  });

  it('CLASS B suppresses only classified SqliteError-shaped failure', async () => {
    createMock.mockRejectedValue(sqliteFailure());

    await expect(recordAuditLog({ ...requiredPayload, required: false })).resolves.toBeNull();
  });

  it('CLASS B propagates TypeError and does not resolve null', async () => {
    createMock.mockRejectedValue(new TypeError('programming defect'));

    await expect(recordAuditLog({ ...requiredPayload, required: false })).rejects.toBeInstanceOf(TypeError);
    await expect(recordAuditLog({ ...requiredPayload, required: false })).rejects.toThrow('programming defect');
  });

  it('CLASS A propagates TypeError without remapping to AUDIT_PERSISTENCE_FAILED', async () => {
    createMock.mockRejectedValue(new TypeError('programming defect'));

    const rejection = await recordAuditLog({ ...requiredPayload, required: true }).catch((error) => error);

    expect(rejection).toBeInstanceOf(TypeError);
    expect(rejection.message).toBe('programming defect');
    expect(rejection.code).not.toBe('AUDIT_PERSISTENCE_FAILED');
  });

  it('does not classify generic disk I/O Error as SQLite persistence', async () => {
    createMock.mockRejectedValue(new Error('disk I/O error'));

    const requiredRejection = await recordAuditLog({ ...requiredPayload, required: true }).catch((error) => error);
    expect(requiredRejection).toBeInstanceOf(Error);
    expect(requiredRejection.message).toBe('disk I/O error');
    expect(requiredRejection.code).not.toBe('AUDIT_PERSISTENCE_FAILED');

    const optionalRejection = await recordAuditLog({ ...requiredPayload, required: false }).catch((error) => error);
    expect(optionalRejection).toBeInstanceOf(Error);
    expect(optionalRejection.message).toBe('disk I/O error');
    expect(optionalRejection).not.toBeNull();
  });

  it('successful persistence still returns the created audit entity', async () => {
    const created = { id: 'audit_log_ok', organizationId: 'org_a04', action: 'a04.test.required' };
    createMock.mockResolvedValue(created);

    await expect(recordAuditLog(requiredPayload)).resolves.toEqual(created);
    expect(createMock).toHaveBeenCalledTimes(1);
  });
});
