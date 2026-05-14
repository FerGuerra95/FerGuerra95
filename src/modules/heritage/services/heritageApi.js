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
  async getDashboard() {
    return extractData(await httpClient.get('/heritage/dashboard'));
  },

  async getSummary() {
    return extractData(await httpClient.get('/heritage/summary'));
  },

  async getBridgeSignals() {
    return extractData(await httpClient.get('/heritage/bridge-signals'));
  },

  async listAssets() {
    return extractItems(await httpClient.get('/heritage/assets'));
  },

  async createAsset(payload = {}) {
    return extractData(await httpClient.post('/heritage/assets', payload));
  },

  async updateAsset(id, payload = {}) {
    return extractData(await httpClient.patch(`/heritage/assets/${encodeURIComponent(id)}`, payload));
  },

  async listSuccessions() {
    return extractItems(await httpClient.get('/heritage/successions'));
  },

  async createSuccession(payload = {}) {
    return extractData(await httpClient.post('/heritage/successions', payload));
  },

  async listProtections() {
    return extractItems(await httpClient.get('/heritage/protections'));
  },

  async createProtection(payload = {}) {
    return extractData(await httpClient.post('/heritage/protections', payload));
  },

  async listDocuments() {
    return extractItems(await httpClient.get('/heritage/documents'));
  },

  async createDocument(payload = {}) {
    return extractData(await httpClient.post('/heritage/documents', payload));
  },

  async listReports() {
    return extractItems(await httpClient.get('/heritage/reports'));
  },

  async generateReport(payload = {}) {
    return extractData(await httpClient.post('/heritage/reports/generate', payload));
  },

  async listAuditTrail(params = {}) {
    return extractItems(await httpClient.get('/heritage/audit-logs', { params }));
  }
};

export default heritageApi;
