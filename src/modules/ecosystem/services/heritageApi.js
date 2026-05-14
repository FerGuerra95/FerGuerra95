import { httpClient } from '../../../shared/services/httpClient.js';

function extractData(response) {
  return response?.data ?? response ?? null;
}

function extractItems(response) {
  const data = extractData(response);
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  return [];
}

export const heritageApi = {
  async listAssets() {
    return extractItems(await httpClient.get('/heritage/assets'));
  },

  async createAsset(payload = {}) {
    return extractData(await httpClient.post('/heritage/assets', payload));
  },

  async updateAsset(id, payload = {}) {
    return extractData(await httpClient.patch(`/heritage/assets/${encodeURIComponent(id)}`, payload));
  },

  async deleteAsset(id) {
    return extractData(await httpClient.delete(`/heritage/assets/${encodeURIComponent(id)}`));
  },

  async listSuccessions() {
    return extractItems(await httpClient.get('/heritage/successions'));
  },

  async createSuccession(payload = {}) {
    return extractData(await httpClient.post('/heritage/successions', payload));
  },

  async updateSuccession(id, payload = {}) {
    return extractData(await httpClient.patch(`/heritage/successions/${encodeURIComponent(id)}`, payload));
  },

  async deleteSuccession(id) {
    return extractData(await httpClient.delete(`/heritage/successions/${encodeURIComponent(id)}`));
  },

  async listProtections() {
    return extractItems(await httpClient.get('/heritage/protections'));
  },

  async createProtection(payload = {}) {
    return extractData(await httpClient.post('/heritage/protections', payload));
  },

  async updateProtection(id, payload = {}) {
    return extractData(await httpClient.patch(`/heritage/protections/${encodeURIComponent(id)}`, payload));
  },

  async deleteProtection(id) {
    return extractData(await httpClient.delete(`/heritage/protections/${encodeURIComponent(id)}`));
  },

  async listDocuments() {
    return extractItems(await httpClient.get('/heritage/documents'));
  },

  async createDocument(payload = {}) {
    return extractData(await httpClient.post('/heritage/documents', payload));
  },

  async updateDocument(id, payload = {}) {
    return extractData(await httpClient.patch(`/heritage/documents/${encodeURIComponent(id)}`, payload));
  },

  async listReports() {
    return extractItems(await httpClient.get('/heritage/reports'));
  },

  async generateReport(payload = {}) {
    return extractData(await httpClient.post('/heritage/reports/generate', payload));
  },

  async listAuditLogs(params = {}) {
    return extractItems(await httpClient.get('/heritage/audit-logs', { params }));
  },

  async getHubOverview() {
    return extractData(await httpClient.get('/heritage/hub-overview'));
  }
};

export default heritageApi;
