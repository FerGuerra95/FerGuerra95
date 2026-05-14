import { httpClient } from '../../../shared/services/httpClient.js';

function data(response) { return response?.data ?? response ?? null; }
function items(response) {
  const value = data(response);
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.items)) return value.items;
  return [];
}

export const reportingApi = {
  async getDashboard() { return data(await httpClient.get('/reporting/dashboard')); },
  async getSummary() { return data(await httpClient.get('/reporting/summary')); },
  async listReports() { return items(await httpClient.get('/reporting/reports')); },
  async createReport(payload = {}) { return data(await httpClient.post('/reporting/reports', payload)); },
  async listTemplates() { return items(await httpClient.get('/reporting/templates')); },
  async createTemplate(payload = {}) { return data(await httpClient.post('/reporting/templates', payload)); },
  async listVersions() { return items(await httpClient.get('/reporting/versions')); },
  async createVersion(payload = {}) { return data(await httpClient.post('/reporting/versions', payload)); },
  async listExports() { return items(await httpClient.get('/reporting/exports')); },
  async createExport(payload = {}) { return data(await httpClient.post('/reporting/exports', payload)); },
  async listBoardPacks() { return items(await httpClient.get('/reporting/board-pack')); },
  async createBoardPack(payload = {}) { return data(await httpClient.post('/reporting/board-pack', payload)); },
  async listSchedules() { return items(await httpClient.get('/reporting/schedules')); },
  async createSchedule(payload = {}) { return data(await httpClient.post('/reporting/schedules', payload)); },
  async listEvidence() { return items(await httpClient.get('/reporting/evidence')); },
  async createEvidence(payload = {}) { return data(await httpClient.post('/reporting/evidence', payload)); }
};

export default reportingApi;
