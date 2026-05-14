import { httpClient } from '../../../shared/services/httpClient.js';

function data(response) {
  return response?.data ?? response ?? null;
}

function items(response) {
  const value = data(response);
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.items)) return value.items;
  return [];
}

export const executiveApi = {
  async getOverview() { return data(await httpClient.get('/executive/overview')); },
  async getSummary() { return data(await httpClient.get('/executive/summary')); },
  async getSignals() { return items(await httpClient.get('/executive/signals')); },
  async getDecisionQueue() { return items(await httpClient.get('/executive/decision-queue')); },
  async getBoardView() { return data(await httpClient.get('/executive/board-view')); },
  async getReadiness() { return data(await httpClient.get('/executive/readiness')); },
  async getReports() { return items(await httpClient.get('/executive/reports')); },
  async createReport(payload = {}) { return data(await httpClient.post('/executive/reports', payload)); },
  async createSnapshot(payload = {}) { return data(await httpClient.post('/executive/snapshot', payload)); },
  async getCalendar() { return items(await httpClient.get('/executive/calendar')); }
};

export default executiveApi;
