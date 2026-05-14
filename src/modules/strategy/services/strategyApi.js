import { httpClient } from '../../../shared/services/httpClient.js';

function data(response) { return response?.data ?? response ?? null; }
function items(response) {
  const value = data(response);
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.items)) return value.items;
  return [];
}

export const strategyApi = {
  async getDashboard() { return data(await httpClient.get('/strategy/dashboard')); },
  async getSummary() { return data(await httpClient.get('/strategy/summary')); },
  async listObjectives() { return items(await httpClient.get('/strategy/objectives')); },
  async createObjective(payload = {}) { return data(await httpClient.post('/strategy/objectives', payload)); },
  async listInitiatives() { return items(await httpClient.get('/strategy/initiatives')); },
  async createInitiative(payload = {}) { return data(await httpClient.post('/strategy/initiatives', payload)); },
  async listScenarios() { return items(await httpClient.get('/strategy/scenarios')); },
  async createScenario(payload = {}) { return data(await httpClient.post('/strategy/scenarios', payload)); },
  async listMarketNotes() { return items(await httpClient.get('/strategy/market-notes')); },
  async createMarketNote(payload = {}) { return data(await httpClient.post('/strategy/market-notes', payload)); },
  async listRisks() { return items(await httpClient.get('/strategy/risks')); },
  async createRisk(payload = {}) { return data(await httpClient.post('/strategy/risks', payload)); },
  async listReports() { return items(await httpClient.get('/strategy/reports')); },
  async createReport(payload = {}) { return data(await httpClient.post('/strategy/reports', payload)); }
};

export default strategyApi;
