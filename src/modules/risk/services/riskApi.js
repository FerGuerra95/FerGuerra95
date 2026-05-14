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

export const riskApi = {
  async getDashboard() {
    return extractData(await httpClient.get('/risk/dashboard'));
  },
  async getSummary() {
    return extractData(await httpClient.get('/risk/summary'));
  },
  async listRegister() {
    return extractItems(await httpClient.get('/risk/register'));
  },
  async createRisk(payload = {}) {
    return extractData(await httpClient.post('/risk/register', payload));
  },
  async listControls() {
    return extractItems(await httpClient.get('/risk/controls'));
  },
  async createControl(payload = {}) {
    return extractData(await httpClient.post('/risk/controls', payload));
  },
  async listMitigations() {
    return extractItems(await httpClient.get('/risk/mitigations'));
  },
  async createMitigation(payload = {}) {
    return extractData(await httpClient.post('/risk/mitigations', payload));
  },
  async listIncidents() {
    return extractItems(await httpClient.get('/risk/incidents'));
  },
  async createIncident(payload = {}) {
    return extractData(await httpClient.post('/risk/incidents', payload));
  },
  async listKri() {
    return extractItems(await httpClient.get('/risk/kri'));
  },
  async createKri(payload = {}) {
    return extractData(await httpClient.post('/risk/kri', payload));
  },
  async listAppetite() {
    return extractItems(await httpClient.get('/risk/appetite'));
  },
  async createAppetite(payload = {}) {
    return extractData(await httpClient.post('/risk/appetite', payload));
  },
  async listReports() {
    return extractItems(await httpClient.get('/risk/reports'));
  },
  async createReport(payload = {}) {
    return extractData(await httpClient.post('/risk/reports', payload));
  }
};

export default riskApi;
