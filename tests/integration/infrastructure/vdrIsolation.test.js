// @vitest-environment node

import fs from 'node:fs';
import path from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { initializeDatabaseSchema } from '../../../backend/storage/databaseSchema.js';
import { closeDatabase } from '../../../backend/storage/sqliteStorage.js';
import {
  createMaDataRoomFileDocument,
  getMaDataRoomFileDownload
} from '../../../backend/services/ma/dataRoom.service.js';
import { CANONICAL_VDR_ROOT } from '../../../scripts/lib/test-isolation.mjs';

describe('VDR fixture isolation', () => {
  beforeAll(() => {
    closeDatabase();
    initializeDatabaseSchema();
  });

  afterAll(() => {
    closeDatabase();
  });

  it('writes and reads fixture bytes only below the configured temporary root', async () => {
    const configuredRoot = path.resolve(process.env.MA_VDR_STORAGE_DIR);
    const payload = Buffer.from('isolated-vdr-fixture', 'utf8');
    const document = await createMaDataRoomFileDocument({
      organizationId: 'org_vdr_isolation',
      userId: 'user_vdr_isolation',
      title: 'Isolated VDR Fixture',
      originalFileName: 'fixture.txt',
      mimeType: 'text/plain',
      fileBuffer: payload,
      allowedRoles: ['admin']
    });
    const download = await getMaDataRoomFileDownload({
      id: document.id,
      organizationId: 'org_vdr_isolation',
      userId: 'user_vdr_isolation',
      role: 'admin'
    });
    const resolvedFile = path.resolve(download.filePath);

    expect(resolvedFile.startsWith(`${configuredRoot}${path.sep}`)).toBe(true);
    expect(resolvedFile.startsWith(path.resolve(CANONICAL_VDR_ROOT))).toBe(false);
    expect(fs.readFileSync(resolvedFile)).toEqual(payload);
  });
});
