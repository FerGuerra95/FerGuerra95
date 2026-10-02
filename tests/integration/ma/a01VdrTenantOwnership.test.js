// @vitest-environment node

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { maValidator } from '../../../backend/api/validators/ma.validator.js';
import { initializeDatabaseSchema } from '../../../backend/storage/databaseSchema.js';
import {
  closeDatabase,
  getSql,
  runSql
} from '../../../backend/storage/sqliteStorage.js';
import { createMaCase } from '../../../backend/services/ma/cases.service.js';
import {
  createMaDataRoomDocument,
  createMaDataRoomFileDocument,
  getMaDataRoomFileDownload,
  registerSecureShareDataRoomDocument,
  updateMaDataRoomDocumentGovernance
} from '../../../backend/services/ma/dataRoom.service.js';
import { createMaReport } from '../../../backend/services/ma/reports.service.js';
import { createMaSecureShareLink } from '../../../backend/services/ma/secureShare.service.js';

const ORG_A = 'org_a01_tenant_a';
const ORG_B = 'org_a01_tenant_b';
const USER_A = 'user_a01_tenant_a';
const USER_B = 'user_a01_tenant_b';

function sha256(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

function storageSegment(value, fallback = 'unknown') {
  const normalized = String(value ?? fallback)
    .trim()
    .replace(/[^a-zA-Z0-9_.-]/g, '_')
    .replace(/_+/g, '_')
    .slice(0, 120);

  return normalized || fallback;
}

function replaceStoredStorage(documentId, organizationId, storage) {
  const row = getSql(
    `
      SELECT payload_json
      FROM ma_data_room_documents
      WHERE id = @id
        AND organization_id = @organizationId
      LIMIT 1
    `,
    {
      id: documentId,
      organizationId
    }
  );
  const payload = JSON.parse(row.payload_json);
  payload.storage = storage;

  runSql(
    `
      UPDATE ma_data_room_documents
      SET payload_json = @payloadJson
      WHERE id = @id
        AND organization_id = @organizationId
    `,
    {
      id: documentId,
      organizationId,
      payloadJson: JSON.stringify(payload)
    }
  );
}

async function uploadFile({ organizationId, userId, fileName, contents }) {
  const fileBuffer = Buffer.from(contents);

  const document = await createMaDataRoomFileDocument({
    organizationId,
    userId,
    title: fileName,
    originalFileName: fileName,
    mimeType: 'text/plain',
    fileBuffer,
    allowedRoles: ['admin', 'user', 'viewer']
  });

  return {
    document,
    fileBuffer
  };
}

describe('A01 VDR tenant and document ownership', () => {
  beforeAll(() => {
    closeDatabase();
    initializeDatabaseSchema();
  });

  afterAll(() => {
    closeDatabase();
  });

  it('case 1: another organization cannot download a document by its id', async () => {
    const { document } = await uploadFile({
      organizationId: ORG_A,
      userId: USER_A,
      fileName: 'tenant-a-target.txt',
      contents: 'tenant-a-target-bytes'
    });

    await expect(
      getMaDataRoomFileDownload({
        id: document.id,
        organizationId: ORG_B,
        userId: USER_B,
        role: 'admin'
      })
    ).rejects.toMatchObject({
      code: 'MA_VDR_DOCUMENT_NOT_FOUND'
    });
  });

  it('case 2: a known foreign storage key cannot be downloaded by another tenant', async () => {
    const { document: fileA, fileBuffer } = await uploadFile({
      organizationId: ORG_A,
      userId: USER_A,
      fileName: 'cross-tenant-secret.txt',
      contents: 'cross-tenant-secret-bytes'
    });
    const foreignKey = fileA.storage.storageKey;

    await expect(
      createMaDataRoomDocument({
        organizationId: ORG_B,
        userId: USER_B,
        title: 'Forged cross-tenant metadata',
        payload: {
          storage: {
            kind: 'server_file',
            storageKey: foreignKey
          }
        }
      })
    ).rejects.toMatchObject({
      code: 'MA_VDR_STORAGE_CLIENT_CONTROLLED'
    });

    const forged = await createMaDataRoomDocument({
      organizationId: ORG_B,
      userId: USER_B,
      title: 'Org B metadata shell'
    });

    replaceStoredStorage(forged.id, ORG_B, {
      kind: 'server_file',
      storageKey: foreignKey,
      checksumSha256: fileA.storage.checksumSha256
    });

    await expect(
      getMaDataRoomFileDownload({
        id: forged.id,
        organizationId: ORG_B,
        userId: USER_B,
        role: 'admin'
      })
    ).rejects.toMatchObject({
      code: 'MA_VDR_STORAGE_OWNERSHIP_INVALID'
    });

    const traversalKey = [
      ORG_B,
      forged.id,
      '..',
      '..',
      String(foreignKey).replace(/\\/g, '/')
    ].join('/');

    replaceStoredStorage(forged.id, ORG_B, {
      kind: 'server_file',
      storageKey: traversalKey
    });

    await expect(
      getMaDataRoomFileDownload({
        id: forged.id,
        organizationId: ORG_B,
        userId: USER_B,
        role: 'admin'
      })
    ).rejects.toMatchObject({
      code: 'MA_VDR_STORAGE_OWNERSHIP_INVALID'
    });

    const ownerDownload = await getMaDataRoomFileDownload({
      id: fileA.id,
      organizationId: ORG_A,
      userId: USER_A,
      role: 'admin'
    });

    expect(fs.readFileSync(ownerDownload.filePath)).toEqual(fileBuffer);
  });

  it('case 3: the same organization cannot retarget another document storage key', async () => {
    const { document: fileA, fileBuffer } = await uploadFile({
      organizationId: ORG_A,
      userId: USER_A,
      fileName: 'same-tenant-secret.txt',
      contents: 'same-tenant-secret-bytes'
    });
    const documentB = await createMaDataRoomDocument({
      organizationId: ORG_A,
      userId: USER_A,
      title: 'Same tenant metadata shell'
    });

    await expect(
      createMaDataRoomDocument({
        organizationId: ORG_A,
        userId: USER_A,
        title: 'Same tenant forged create',
        payload: {
          storage: {
            kind: 'server_file',
            storageKey: fileA.storage.storageKey
          }
        }
      })
    ).rejects.toMatchObject({
      code: 'MA_VDR_STORAGE_CLIENT_CONTROLLED'
    });

    await expect(
      updateMaDataRoomDocumentGovernance(
        documentB.id,
        {
          storage: {
            kind: 'server_file',
            storageKey: fileA.storage.storageKey
          }
        },
        {
          organizationId: ORG_A
        }
      )
    ).rejects.toMatchObject({
      code: 'MA_VDR_STORAGE_CLIENT_CONTROLLED'
    });

    replaceStoredStorage(documentB.id, ORG_A, {
      kind: 'server_file',
      storageKey: fileA.storage.storageKey,
      checksumSha256: fileA.storage.checksumSha256
    });

    await expect(
      getMaDataRoomFileDownload({
        id: documentB.id,
        organizationId: ORG_A,
        userId: USER_A,
        role: 'admin'
      })
    ).rejects.toMatchObject({
      code: 'MA_VDR_STORAGE_OWNERSHIP_INVALID'
    });

    const ownerDownload = await getMaDataRoomFileDownload({
      id: fileA.id,
      organizationId: ORG_A,
      userId: USER_A,
      role: 'admin'
    });

    expect(fs.readFileSync(ownerDownload.filePath)).toEqual(fileBuffer);
  });

  it('case 4: metadata creation rejects nested storage and version ownership', async () => {
    await expect(
      createMaDataRoomDocument({
        organizationId: ORG_A,
        userId: USER_A,
        title: 'Metadata storage injection',
        payload: {
          note: 'board copy',
          storage: {
            kind: 'server_file',
            storageKey: 'org_a01_tenant_a/other-document/file.txt'
          }
        }
      })
    ).rejects.toMatchObject({
      code: 'MA_VDR_STORAGE_CLIENT_CONTROLLED'
    });

    await expect(
      createMaDataRoomDocument({
        organizationId: ORG_A,
        userId: USER_A,
        title: 'Metadata version injection',
        payload: {
          versions: [
            {
              kind: 'server_file',
              storageKey: 'org_a01_tenant_a/other-document/file.txt'
            }
          ]
        }
      })
    ).rejects.toMatchObject({
      code: 'MA_VDR_STORAGE_CLIENT_CONTROLLED'
    });

    expect(() =>
      maValidator.createDataRoomDocument.body({
        title: 'Validator storage injection',
        payload: {
          storage: {
            storageKey: 'foreign/key'
          }
        }
      })
    ).toThrow(/referencia fisica VDR/);

    const persisted = getSql(
      `
        SELECT id
        FROM ma_data_room_documents
        WHERE organization_id = @organizationId
          AND title = @title
        LIMIT 1
      `,
      {
        organizationId: ORG_A,
        title: 'Metadata storage injection'
      }
    );

    expect(persisted).toBeNull();
  });

  it('case 5: the owning organization downloads the server-generated file', async () => {
    const contents = 'valid-owner-bytes';
    const { document, fileBuffer } = await uploadFile({
      organizationId: ORG_A,
      userId: USER_A,
      fileName: 'valid-owner.txt',
      contents
    });
    const governed = await updateMaDataRoomDocumentGovernance(
      document.id,
      {
        folder: 'Ownership retained'
      },
      {
        organizationId: ORG_A
      }
    );

    expect(governed.storage.storageKey).toBe(document.storage.storageKey);
    expect(governed.storage.kind).toBe('server_file');

    const download = await getMaDataRoomFileDownload({
      id: document.id,
      organizationId: ORG_A,
      userId: USER_A,
      role: 'admin'
    });

    expect(fs.readFileSync(download.filePath)).toEqual(fileBuffer);
    expect(download.checksumSha256).toBe(sha256(fileBuffer));
    expect(download.checksumSha256).toBe(document.storage.checksumSha256);
    expect(
      path.resolve(download.filePath).startsWith(
        `${path.resolve(process.env.MA_VDR_STORAGE_DIR)}${path.sep}`
      )
    ).toBe(true);
  });

  it('case 6: a storage key that escapes the VDR root stays fail-closed', async () => {
    const sentinelName = 'a01-outside-vdr-sentinel.txt';
    const sentinelPath = path.join(process.env.CEOS_TEST_ROOT, sentinelName);
    const sentinelBytes = Buffer.from('outside-vdr-root-sentinel');
    fs.writeFileSync(sentinelPath, sentinelBytes);

    const { document } = await uploadFile({
      organizationId: ORG_A,
      userId: USER_A,
      fileName: 'path-escape-host.txt',
      contents: 'path-escape-host'
    });

    replaceStoredStorage(document.id, ORG_A, {
      kind: 'server_file',
      storageKey: `../${sentinelName}`
    });

    await expect(
      getMaDataRoomFileDownload({
        id: document.id,
        organizationId: ORG_A,
        userId: USER_A,
        role: 'admin'
      })
    ).rejects.toMatchObject({
      code: 'MA_VDR_STORAGE_PATH_INVALID'
    });

    expect(fs.readFileSync(sentinelPath)).toEqual(sentinelBytes);
  });

  it('case 7: secure share metadata cannot inherit a physical file reference', async () => {
    const { document: fileA, fileBuffer } = await uploadFile({
      organizationId: ORG_A,
      userId: USER_A,
      fileName: 'share-must-not-inherit.txt',
      contents: 'share-must-not-inherit-bytes'
    });
    const maCase = await createMaCase({
      name: 'A01 secure share case',
      organizationId: ORG_B,
      userId: USER_B,
      financials: {
        name: 'A01 secure share case',
        sector: 'Industria',
        normalizedEbitda: 1000
      }
    });
    const report = await createMaReport({
      organizationId: ORG_B,
      userId: USER_B,
      caseId: maCase.id,
      title: 'A01 secure share report',
      payload: {
        html: '<html><body>A01</body></html>',
        storage: {
          kind: 'server_file',
          storageKey: fileA.storage.storageKey
        }
      }
    });
    const share = await createMaSecureShareLink({
      organizationId: ORG_B,
      userId: USER_B,
      reportId: report.id,
      expiresInHours: 24
    });
    share.storage = {
      kind: 'server_file',
      storageKey: fileA.storage.storageKey
    };

    const shareDocument = await registerSecureShareDataRoomDocument({
      organizationId: ORG_B,
      userId: USER_B,
      share,
      reportId: report.id
    });

    expect(shareDocument.storage?.storageKey).toBeUndefined();
    expect(shareDocument.storage?.kind).not.toBe('server_file');

    await expect(
      getMaDataRoomFileDownload({
        id: shareDocument.id,
        organizationId: ORG_B,
        userId: USER_B,
        role: 'admin'
      })
    ).rejects.toMatchObject({
      code: 'MA_VDR_FILE_NOT_FOUND'
    });

    replaceStoredStorage(shareDocument.id, ORG_B, {
      kind: 'server_file',
      storageKey: fileA.storage.storageKey
    });

    await expect(
      getMaDataRoomFileDownload({
        id: shareDocument.id,
        organizationId: ORG_B,
        userId: USER_B,
        role: 'admin'
      })
    ).rejects.toMatchObject({
      code: 'MA_VDR_STORAGE_OWNERSHIP_INVALID'
    });

    const ownerDownload = await getMaDataRoomFileDownload({
      id: fileA.id,
      organizationId: ORG_A,
      userId: USER_A,
      role: 'admin'
    });

    expect(fs.readFileSync(ownerDownload.filePath)).toEqual(fileBuffer);
  });

  it('organization binding: organization A directory plus organization B document id is rejected', async () => {
    const plantedBytes = Buffer.from('planted-under-organization-a');
    const documentB = await createMaDataRoomDocument({
      organizationId: ORG_B,
      userId: USER_B,
      title: 'Organization B ownership shell'
    });
    const orgASegment = storageSegment(ORG_A, 'org');
    const documentSegment = storageSegment(documentB.id, 'document');
    const plantedDirectory = path.join(
      process.env.MA_VDR_STORAGE_DIR,
      orgASegment,
      documentSegment
    );
    const plantedPath = path.join(plantedDirectory, 'planted-file.txt');
    const storageKey = [orgASegment, documentSegment, 'planted-file.txt'].join('/');

    fs.mkdirSync(plantedDirectory, { recursive: true });
    fs.writeFileSync(plantedPath, plantedBytes);
    replaceStoredStorage(documentB.id, ORG_B, {
      kind: 'server_file',
      storageKey
    });

    await expect(
      getMaDataRoomFileDownload({
        id: documentB.id,
        organizationId: ORG_B,
        userId: USER_B,
        role: 'admin'
      })
    ).rejects.toMatchObject({
      code: 'MA_VDR_STORAGE_OWNERSHIP_INVALID'
    });

    expect(fs.readFileSync(plantedPath)).toEqual(plantedBytes);
  });
});
