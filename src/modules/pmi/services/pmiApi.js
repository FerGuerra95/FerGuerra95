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

export const pmiApi = {
  async getDashboard() {
    const response = await httpClient.get('/pmi/dashboard');
    return extractData(response);
  },

  async getSummary() {
    const response = await httpClient.get('/pmi/summary');
    return extractData(response);
  },

  async listCases() {
    const response = await httpClient.get('/pmi/cases');
    return extractItems(response);
  },

  async getCase(id) {
    const response = await httpClient.get(`/pmi/cases/${encodeURIComponent(id)}`);
    return extractData(response);
  },

  async createCase(payload = {}) {
    const response = await httpClient.post('/pmi/cases', payload);
    return extractData(response);
  },

  async createCaseFromMaDeal(dealId) {
    const response = await httpClient.post(
      `/pmi/cases/from-ma-deal/${encodeURIComponent(dealId)}`,
      {}
    );
    return extractData(response);
  },

  async updateCase(id, payload = {}) {
    const response = await httpClient.patch(`/pmi/cases/${encodeURIComponent(id)}`, payload);
    return extractData(response);
  },

  async duplicateCase(id) {
    const response = await httpClient.post(`/pmi/cases/${encodeURIComponent(id)}/duplicate`, {});
    return extractData(response);
  },

  async deleteCase(id) {
    const response = await httpClient.delete(`/pmi/cases/${encodeURIComponent(id)}`);
    return extractData(response);
  },

  async listAuditLogs(params = {}) {
    const query = new URLSearchParams();
    if (params.caseId) query.set('caseId', params.caseId);
    if (params.limit) query.set('limit', params.limit);
    const suffix = query.toString() ? `?${query.toString()}` : '';
    const response = await httpClient.get(`/pmi/audit-logs${suffix}`);
    return extractItems(response);
  },

  async getExecutiveHubBrief() {
    const response = await httpClient.get('/pmi/hub-overview');
    return extractData(response);
  },

  async listPrograms() {
    return extractItems(await httpClient.get('/pmi/programs'));
  },

  async getProgram(id) {
    return extractData(await httpClient.get(`/pmi/programs/${encodeURIComponent(id)}`));
  },

  async createProgram(payload = {}) {
    return extractData(await httpClient.post('/pmi/programs', payload));
  },

  async updateProgram(id, payload = {}) {
    return extractData(await httpClient.patch(`/pmi/programs/${encodeURIComponent(id)}`, payload));
  },

  async listSynergies() {
    return extractItems(await httpClient.get('/pmi/synergies'));
  },

  async createSynergy(payload = {}) {
    return extractData(await httpClient.post('/pmi/synergies', payload));
  },

  async listMilestones() {
    return extractItems(await httpClient.get('/pmi/milestones'));
  },

  async createMilestone(payload = {}) {
    return extractData(await httpClient.post('/pmi/milestones', payload));
  },

  async listRisks() {
    return extractItems(await httpClient.get('/pmi/risks'));
  },

  async createRisk(payload = {}) {
    return extractData(await httpClient.post('/pmi/risks', payload));
  },

  async listDayOne() {
    return extractItems(await httpClient.get('/pmi/day1'));
  },

  async createDayOne(payload = {}) {
    return extractData(await httpClient.post('/pmi/day1', payload));
  },

  async listHundredDay() {
    return extractItems(await httpClient.get('/pmi/day-100'));
  },

  async createHundredDay(payload = {}) {
    return extractData(await httpClient.post('/pmi/day-100', payload));
  },

  async listTransitionServices() {
    return extractItems(await httpClient.get('/pmi/transition-services'));
  },

  async createTransitionService(payload = {}) {
    return extractData(await httpClient.post('/pmi/transition-services', payload));
  },

  async listOperatingModel() {
    return extractItems(await httpClient.get('/pmi/operating-model'));
  },

  async createOperatingModel(payload = {}) {
    return extractData(await httpClient.post('/pmi/operating-model', payload));
  },

  async listPeopleCulture() {
    return extractItems(await httpClient.get('/pmi/people-culture'));
  },

  async createPeopleCulture(payload = {}) {
    return extractData(await httpClient.post('/pmi/people-culture', payload));
  },

  async listTechnology() {
    return extractItems(await httpClient.get('/pmi/technology'));
  },

  async createTechnology(payload = {}) {
    return extractData(await httpClient.post('/pmi/technology', payload));
  },

  async listReports() {
    return extractItems(await httpClient.get('/pmi/reports'));
  },

  async createReport(payload = {}) {
    return extractData(await httpClient.post('/pmi/reports', payload));
  }
};

export default pmiApi;
