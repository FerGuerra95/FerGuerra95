import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { initializeDatabaseSchema } from '../../../backend/storage/databaseSchema.js';
import {
  closeDatabase,
  getSql
} from '../../../backend/storage/sqliteStorage.js';
import {
  createMaCase,
  deleteMaCase,
  getMaCaseById,
  listMaCases,
  updateMaCase
} from '../../../backend/services/ma/cases.service.js';
import {
  createMaReport,
  listMaReports
} from '../../../backend/services/ma/reports.service.js';
import {
  createMaSecureShareLink,
  getMaSecureShare,
  revokeMaSecureShare
} from '../../../backend/services/ma/secureShare.service.js';
import {
  createMaDataRoomFileDocument,
  createMaDataRoomDocument,
  getMaDataRoomFileDownload,
  listMaDataRoomDocuments,
  markSecureShareDataRoomDocumentRevoked,
  registerSecureShareDataRoomDocument,
  updateMaDataRoomDocumentGovernance
} from '../../../backend/services/ma/dataRoom.service.js';
import {
  createMaDeal,
  deleteMaDeal,
  listMaDeals,
  updateMaDeal
} from '../../../backend/services/ma/deals.service.js';
import {
  listAuditLogs,
  recordAuditLog
} from '../../../backend/services/audit/auditLog.service.js';

let tempDir = '';

function buildCasePayload(name, organizationId, userId = 'u_test') {
  return {
    name,
    organizationId,
    userId,
    financials: {
      name,
      sector: 'Industria',
      normalizedEbitda: 750000
    },
    settings: {
      reportCurrency: 'EUR',
      evidenceDocuments: [
        {
          id: `${name}-doc`,
          title: `${name} evidence`,
          status: 'verified',
          sourceIds: ['ma.financials.normalizedEbitda']
        }
      ]
    }
  };
}

describe('ma services multi-tenancy', () => {
  beforeAll(() => {
    closeDatabase();
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ceos-ma-services-'));
    process.env.DB_PATH = path.join(tempDir, 'test.sqlite');
    initializeDatabaseSchema();
  });

  afterAll(() => {
    closeDatabase();
    delete process.env.DB_PATH;

    if (tempDir) {
      fs.rmSync(tempDir, {
        recursive: true,
        force: true
      });
    }
  });

  it('aplica migraciones versionadas M&A enterprise SaaS', () => {
    const migration = getSql(
      `
        SELECT id
        FROM schema_migrations
        WHERE id = @id
        LIMIT 1
      `,
      {
        id: '002_ma_enterprise_saas'
      }
    );
    const dataRoomTable = getSql(
      `
        SELECT name
        FROM sqlite_master
        WHERE type = 'table'
          AND name = 'ma_data_room_documents'
        LIMIT 1
      `
    );
    const dealsTable = getSql(
      `
        SELECT name
        FROM sqlite_master
        WHERE type = 'table'
          AND name = 'ma_deals'
        LIMIT 1
      `
    );

    expect(migration?.id).toBe('002_ma_enterprise_saas');
    expect(dataRoomTable?.name).toBe('ma_data_room_documents');
    expect(dealsTable?.name).toBe('ma_deals');
  });

  it('aisla casos y reportes M&A por organizacion', async () => {
    const caseA = await createMaCase(
      buildCasePayload('Target A', 'org_service_a', 'u_a')
    );
    const caseB = await createMaCase(
      buildCasePayload('Target B', 'org_service_b', 'u_b')
    );

    const orgAList = await listMaCases({
      organizationId: 'org_service_a'
    });
    const orgBList = await listMaCases({
      organizationId: 'org_service_b'
    });

    expect(orgAList.map((item) => item.id)).toEqual([caseA.id]);
    expect(orgBList.map((item) => item.id)).toEqual([caseB.id]);

    await expect(
      getMaCaseById(caseB.id, {
        organizationId: 'org_service_a'
      })
    ).resolves.toBeNull();

    await expect(
      updateMaCase(
        caseB.id,
        {
          name: 'Cross tenant edit',
          financials: {
            name: 'Cross tenant edit',
            sector: 'Industria',
            normalizedEbitda: 900000
          }
        },
        {
          organizationId: 'org_service_a'
        }
      )
    ).resolves.toBeNull();

    await expect(
      createMaReport({
        organizationId: 'org_service_a',
        userId: 'u_a',
        caseId: caseB.id,
        title: 'Foreign case report'
      })
    ).rejects.toMatchObject({
      code: 'MA_CASE_NOT_FOUND'
    });

    const reportA = await createMaReport({
      organizationId: 'org_service_a',
      userId: 'u_a',
      caseId: caseA.id,
      title: 'Org A report'
    });

    const reportsA = await listMaReports({
      organizationId: 'org_service_a'
    });
    const reportsB = await listMaReports({
      organizationId: 'org_service_b'
    });

    expect(reportsA.map((item) => item.id)).toEqual([reportA.id]);
    expect(reportsB).toEqual([]);

    const deleteResult = await deleteMaCase(caseB.id, {
      organizationId: 'org_service_a'
    });

    expect(deleteResult.deleted).toBe(false);
  });

  it('crea, valida y revoca secure share links M&A por organizacion', async () => {
    const item = await createMaCase(
      buildCasePayload('Secure Share Target', 'org_secure_share', 'u_share')
    );

    const report = await createMaReport({
      organizationId: 'org_secure_share',
      userId: 'u_share',
      caseId: item.id,
      title: 'Secure share report',
      payload: {
        html: '<html><body>Secure report</body></html>'
      }
    });

    const share = await createMaSecureShareLink({
      organizationId: 'org_secure_share',
      userId: 'u_share',
      reportId: report.id,
      expiresInHours: 24
    });

    expect(share.id).toBeTruthy();
    expect(share.token).toBeTruthy();
    expect(share.shareUrl).toContain('/ma/secure-share#');
    expect(share.shareUrl).toContain('sid=');
    expect(share.shareUrl).toContain('&t=');

    const resolved = await getMaSecureShare({
      organizationId: 'org_secure_share',
      id: share.id,
      token: share.token
    });

    expect(resolved.report.id).toBe(report.id);
    expect(resolved.report.payload.html).toContain('Secure report');

    await expect(
      getMaSecureShare({
        organizationId: 'org_secure_share',
        id: share.id,
        token: 'wrong-token'
      })
    ).rejects.toMatchObject({
      code: 'SECURE_SHARE_TOKEN_INVALID'
    });

    const revoked = await revokeMaSecureShare({
      organizationId: 'org_secure_share',
      id: share.id
    });

    expect(revoked.status).toBe('revoked');

    await expect(
      getMaSecureShare({
        organizationId: 'org_secure_share',
        id: share.id,
        token: share.token
      })
    ).rejects.toMatchObject({
      code: 'SECURE_SHARE_REVOKED'
    });
  });

  it('mantiene el data room M&A aislado por organizacion y sincroniza secure shares', async () => {
    const item = await createMaCase(
      buildCasePayload('Data Room Target', 'org_data_room_a', 'u_room_a')
    );

    const report = await createMaReport({
      organizationId: 'org_data_room_a',
      userId: 'u_room_a',
      caseId: item.id,
      title: 'Data room report',
      payload: {
        html: '<html><body>Data room report</body></html>'
      }
    });

    const manualDocument = await createMaDataRoomDocument({
      organizationId: 'org_data_room_a',
      userId: 'u_room_a',
      caseId: item.id,
      reportId: report.id,
      title: 'Board approved CIM',
      documentType: 'cim',
      classification: 'confidential',
      status: 'ready'
    });

    expect(manualDocument.id).toBeTruthy();
    expect(manualDocument.caseId).toBe(item.id);

    await expect(
      createMaDataRoomDocument({
        organizationId: 'org_data_room_b',
        userId: 'u_room_b',
        caseId: item.id,
        title: 'Foreign tenant document'
      })
    ).rejects.toMatchObject({
      code: 'MA_CASE_NOT_FOUND'
    });

    const share = await createMaSecureShareLink({
      organizationId: 'org_data_room_a',
      userId: 'u_room_a',
      reportId: report.id,
      expiresInHours: 24
    });

    await expect(
      createMaDataRoomDocument({
        organizationId: 'org_data_room_b',
        userId: 'u_room_b',
        shareId: share.id,
        title: 'Foreign tenant share document'
      })
    ).rejects.toMatchObject({
      code: 'SECURE_SHARE_NOT_FOUND'
    });

    const shareDocument = await registerSecureShareDataRoomDocument({
      organizationId: 'org_data_room_a',
      userId: 'u_room_a',
      share,
      reportId: report.id
    });

    expect(shareDocument.status).toBe('shared');
    expect(shareDocument.shareId).toBe(share.id);

    const orgAItems = await listMaDataRoomDocuments({
      organizationId: 'org_data_room_a'
    });
    const orgBItems = await listMaDataRoomDocuments({
      organizationId: 'org_data_room_b'
    });

    expect(orgAItems.map((document) => document.id).sort()).toEqual(
      [manualDocument.id, shareDocument.id].sort()
    );
    expect(orgBItems).toEqual([]);

    const revokedDocument = await markSecureShareDataRoomDocumentRevoked({
      organizationId: 'org_data_room_a',
      shareId: share.id
    });

    expect(revokedDocument.status).toBe('revoked');
  });

  it('persiste ficheros VDR server-side con checksum y aislamiento por organizacion', async () => {
    const fileBuffer = Buffer.from('Confidential VDR quality of earnings file');

    const document = await createMaDataRoomFileDocument({
      organizationId: 'org_vdr_a',
      userId: 'u_vdr_a',
      title: 'Quality of earnings.pdf',
      originalFileName: 'quality-of-earnings.pdf',
      mimeType: 'application/pdf',
      documentType: 'financials',
      classification: 'restricted',
      fileBuffer
    });

    expect(document.id).toBeTruthy();
    expect(document.storage.kind).toBe('server_file');
    expect(document.storage.sizeBytes).toBe(fileBuffer.length);
    expect(document.storage.checksumSha256).toHaveLength(64);

    const download = await getMaDataRoomFileDownload({
      organizationId: 'org_vdr_a',
      id: document.id
    });

    expect(download.fileName).toBe('quality-of-earnings.pdf');
    expect(download.sizeBytes).toBe(fileBuffer.length);
    expect(download.checksumSha256).toBe(document.storage.checksumSha256);

    await expect(
      getMaDataRoomFileDownload({
        organizationId: 'org_vdr_b',
        id: document.id
      })
    ).rejects.toMatchObject({
      code: 'MA_VDR_DOCUMENT_NOT_FOUND'
    });

    await expect(
      createMaDataRoomFileDocument({
        organizationId: 'org_vdr_a',
        userId: 'u_vdr_a',
        title: 'Blocked executable',
        originalFileName: 'malware.exe',
        fileBuffer
      })
    ).rejects.toMatchObject({
      code: 'MA_VDR_FILE_TYPE_BLOCKED'
    });
  });

  it('aplica gobierno VDR real: expiracion, roles, descarga bloqueable y audit por documento', async () => {
    const fileBuffer = Buffer.from('Confidential VDR seller financial model');

    const document = await createMaDataRoomFileDocument({
      organizationId: 'org_vdr_policy',
      userId: 'u_vdr_policy',
      title: 'Seller model.xlsx',
      originalFileName: 'seller-model.xlsx',
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      documentType: 'financials',
      classification: 'restricted',
      fileBuffer,
      area: 'financial',
      folder: '01 Financial DD',
      allowedRoles: ['admin', 'user'],
      watermarkLabel: 'PROJECT ATLAS',
      expiresAt: '2099-01-01T00:00:00.000Z',
      retentionUntil: '2099-12-31T00:00:00.000Z',
      legalHold: true
    });

    expect(document.area).toBe('financial');
    expect(document.folder).toBe('01 Financial DD');
    expect(document.access.allowedRoles).toEqual(['admin', 'user']);
    expect(document.governance.legalHold).toBe(true);

    await expect(
      getMaDataRoomFileDownload({
        organizationId: 'org_vdr_policy',
        userId: 'viewer_policy',
        role: 'viewer',
        id: document.id
      })
    ).rejects.toMatchObject({
      code: 'MA_VDR_ROLE_NOT_ALLOWED'
    });

    const adminDownload = await getMaDataRoomFileDownload({
      organizationId: 'org_vdr_policy',
      userId: 'admin_policy',
      role: 'admin',
      id: document.id
    });

    expect(adminDownload.watermark).toContain('PROJECT ATLAS');
    expect(adminDownload.watermark).toContain(document.id);

    const disabled = await updateMaDataRoomDocumentGovernance(
      document.id,
      {
        allowDownload: false
      },
      {
        organizationId: 'org_vdr_policy'
      }
    );

    expect(disabled.access.allowDownload).toBe(false);

    await expect(
      getMaDataRoomFileDownload({
        organizationId: 'org_vdr_policy',
        userId: 'admin_policy',
        role: 'admin',
        id: document.id
      })
    ).rejects.toMatchObject({
      code: 'MA_VDR_DOWNLOAD_DISABLED'
    });

    const expired = await createMaDataRoomFileDocument({
      organizationId: 'org_vdr_policy',
      userId: 'u_vdr_policy',
      title: 'Expired teaser.pdf',
      originalFileName: 'expired-teaser.pdf',
      mimeType: 'application/pdf',
      fileBuffer,
      expiresAt: '2000-01-01T00:00:00.000Z'
    });

    await expect(
      getMaDataRoomFileDownload({
        organizationId: 'org_vdr_policy',
        userId: 'admin_policy',
        role: 'admin',
        id: expired.id
      })
    ).rejects.toMatchObject({
      code: 'MA_VDR_ACCESS_EXPIRED'
    });

    await recordAuditLog({
      organizationId: 'org_vdr_policy',
      userId: 'u_vdr_policy',
      action: 'ma.data_room.file.downloaded',
      entityType: 'ma',
      entityId: document.id,
      metadata: {
        checksumSha256: document.storage.checksumSha256
      }
    });
    await recordAuditLog({
      organizationId: 'org_vdr_policy',
      userId: 'u_vdr_policy',
      action: 'ma.data_room.file.downloaded',
      entityType: 'ma',
      entityId: expired.id
    });

    const documentAuditItems = await listAuditLogs({
      organizationId: 'org_vdr_policy',
      entityType: 'ma',
      entityId: document.id,
      limit: 20
    });

    expect(documentAuditItems).toHaveLength(1);
    expect(documentAuditItems[0].entityId).toBe(document.id);
  });

  it('opera pipeline real ma_deals con aislamiento multi-tenant y audit export', async () => {
    const item = await createMaCase(
      buildCasePayload('Pipeline Target', 'org_pipeline_a', 'u_pipeline_a')
    );

    const deal = await createMaDeal({
      organizationId: 'org_pipeline_a',
      userId: 'u_pipeline_a',
      caseId: item.id,
      name: 'Pipeline Target Deal',
      stage: 'ic-review',
      ownerName: 'M&A Lead',
      priority: 'high',
      riskLevel: 'controlled',
      status: 'active',
      nextStep: 'Prepare investment committee memo',
      icMemoStatus: 'draft',
      equityValue: 12000000,
      sector: 'Industrial services',
      market: 'Western Europe'
    });

    expect(deal.id).toBeTruthy();
    expect(deal.stage).toBe('ic-review');
    expect(deal.caseId).toBe(item.id);

    await expect(
      createMaDeal({
        organizationId: 'org_pipeline_b',
        userId: 'u_pipeline_b',
        caseId: item.id,
        name: 'Foreign tenant deal'
      })
    ).rejects.toMatchObject({
      code: 'MA_CASE_NOT_FOUND'
    });

    const updated = await updateMaDeal(
      deal.id,
      {
        stage: 'negotiation',
        nextStep: 'Align SPA perimeter'
      },
      {
        organizationId: 'org_pipeline_a'
      }
    );

    expect(updated.stage).toBe('negotiation');
    expect(updated.nextStep).toBe('Align SPA perimeter');

    const patchedNextStepOnly = await updateMaDeal(
      deal.id,
      {
        nextStep: 'Send revised SPA mark-up'
      },
      {
        organizationId: 'org_pipeline_a'
      }
    );

    expect(patchedNextStepOnly.stage).toBe('negotiation');
    expect(patchedNextStepOnly.status).toBe('active');
    expect(patchedNextStepOnly.priority).toBe('high');
    expect(patchedNextStepOnly.payload.sector).toBe('Industrial services');
    expect(patchedNextStepOnly.nextStep).toBe('Send revised SPA mark-up');

    const orgADeals = await listMaDeals({
      organizationId: 'org_pipeline_a'
    });
    const orgBDeals = await listMaDeals({
      organizationId: 'org_pipeline_b'
    });

    expect(orgADeals.map((entry) => entry.id)).toEqual([deal.id]);
    expect(orgBDeals).toEqual([]);

    await recordAuditLog({
      organizationId: 'org_pipeline_a',
      userId: 'u_pipeline_a',
      action: 'ma.deal.updated',
      entityType: 'ma',
      entityId: deal.id,
      metadata: {
        stage: 'negotiation'
      }
    });

    const auditItems = await listAuditLogs({
      organizationId: 'org_pipeline_a',
      entityType: 'ma',
      limit: 20
    });

    expect(auditItems.some((entry) => entry.entityId === deal.id)).toBe(true);

    const deleteResult = await deleteMaDeal(deal.id, {
      organizationId: 'org_pipeline_b'
    });

    expect(deleteResult.deleted).toBe(false);
  });
});
