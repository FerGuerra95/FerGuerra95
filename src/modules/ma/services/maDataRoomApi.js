import { httpClient } from '../../../shared/services/httpClient.js';

function encodeHeader(value = '') {
  return encodeURIComponent(String(value || '').trim());
}

function normalizeFileName(value = 'ma-vdr-document') {
  return String(value || 'ma-vdr-document')
    .replace(/["\r\n]/g, '_')
    .trim() || 'ma-vdr-document';
}

function getDownloadName(contentDisposition = '', fallback = 'ma-vdr-document') {
  const match = /filename="([^"]+)"/i.exec(contentDisposition);

  return normalizeFileName(match?.[1] || fallback);
}

export const maDataRoomApi = {
  async listDataRoom() {
    const response = await httpClient.get('/ma/data-room');
    return response.data ?? response;
  },

  async createDocument(payload = {}) {
    const response = await httpClient.post('/ma/data-room/documents', payload);
    return response.data ?? response;
  },

  async uploadFile(file, payload = {}) {
    if (!file) {
      throw new Error('VDR file is required.');
    }

    const response = await httpClient.postBinary('/ma/data-room/files', file, {
      timeoutMs: 120_000,
      headers: {
        'Content-Type': file.type || 'application/octet-stream',
        'X-MA-File-Name': encodeHeader(file.name),
        'X-MA-Document-Title': encodeHeader(payload.title || file.name),
        'X-MA-Document-Type': encodeHeader(payload.documentType || 'other'),
        'X-MA-Classification': encodeHeader(payload.classification || 'confidential'),
        'X-MA-Document-Status': encodeHeader(payload.status || 'ready'),
        'X-MA-Area': encodeHeader(payload.area || 'financial'),
        'X-MA-Folder': encodeHeader(payload.folder || 'General DD'),
        'X-MA-Allow-Download': encodeHeader(
          payload.allowDownload === false ? 'false' : 'true'
        ),
        'X-MA-Access-Expires-At': encodeHeader(payload.expiresAt || ''),
        'X-MA-Watermark-Label': encodeHeader(
          payload.watermarkLabel || 'CONFIDENTIAL'
        ),
        'X-MA-Allowed-Roles': encodeHeader(
          Array.isArray(payload.allowedRoles)
            ? payload.allowedRoles.join(',')
            : payload.allowedRoles || 'admin,user,viewer'
        ),
        'X-MA-Legal-Hold': encodeHeader(payload.legalHold ? 'true' : 'false'),
        'X-MA-Retention-Until': encodeHeader(payload.retentionUntil || ''),
        ...(payload.caseId ? { 'X-MA-Case-Id': encodeHeader(payload.caseId) } : {}),
        ...(payload.reportId ? { 'X-MA-Report-Id': encodeHeader(payload.reportId) } : {})
      }
    });

    return response.data ?? response;
  },

  async downloadDocument(item) {
    const response = await httpClient.download(
      `/ma/data-room/documents/${encodeURIComponent(item.id)}/download`,
      {
        timeoutMs: 120_000
      }
    );
    const blob = response.data;
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const storage = item.storage || {};

    link.href = url;
    link.download = getDownloadName(
      response.meta?.contentDisposition,
      storage.originalFileName || item.title
    );
    link.click();
    URL.revokeObjectURL(url);

    return response.meta || {};
  },

  async updateDocumentGovernance(id, payload = {}) {
    const response = await httpClient.patch(
      `/ma/data-room/documents/${encodeURIComponent(id)}/governance`,
      payload
    );

    return response.data ?? response;
  },

  async revokeShare(id) {
    const response = await httpClient.delete(`/ma/secure-shares/${id}`);
    return response.data ?? response;
  },

  async listAuditLogs({ limit = 100, entityId = '' } = {}) {
    const entityFilter = entityId
      ? `&entityId=${encodeURIComponent(entityId)}`
      : '';
    const response = await httpClient.get(
      `/ma/audit-logs?entityType=ma&limit=${encodeURIComponent(limit)}${entityFilter}`
    );

    const data = response.data ?? response;

    return Array.isArray(data?.items) ? data.items : [];
  }
};

export default maDataRoomApi;
