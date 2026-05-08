import { httpClient } from '../../../shared/services/httpClient.js';

function extractItems(response) {
  const data = response.data ?? response;
  return Array.isArray(data?.items) ? data.items : [];
}

function extractEnvelopeData(response, fallback = {}) {
  const data = response?.data ?? response;
  return data && typeof data === 'object' ? data : fallback;
}

function extractLatestSnapshot(hub = {}) {
  const latest = hub?.latestSnapshot;
  return latest && typeof latest === 'object' ? latest : {};
}

export function buildFundingBridgeSnapshot({
  rounds = [],
  summary = {},
  hub = {},
  failures = {}
} = {}) {
  const latestSnapshot = extractLatestSnapshot(hub);
  const totalAmountRaised =
    Number(summary?.totalAmountRaised ?? summary?.totalRaised) ||
    Number(latestSnapshot?.targetRaise) ||
    0;
  const projectedRunwayMonths =
    summary?.projectedRunwayMonths ??
    summary?.latestRound?.projectedRunwayMonths ??
    latestSnapshot?.runwayAfterRaiseMonths ??
    null;
  const estimatedDilution =
    summary?.estimatedDilution ??
    summary?.averageDilution ??
    summary?.latestRound?.dilutionPercentage ??
    latestSnapshot?.dilutionPct ??
    null;

  return {
    rounds: Array.isArray(rounds) ? rounds : [],
    summary: {
      ...summary,
      totalAmountRaised,
      projectedRunwayMonths,
      estimatedDilution,
      roundsCount:
        Number(summary?.roundsCount) ||
        Number(summary?.totalRounds) ||
        (Array.isArray(rounds) ? rounds.length : 0),
      fundingRiskStatus:
        summary?.fundingRiskStatus ||
        summary?.riskStatus ||
        summary?.latestRound?.riskStatus ||
        'normal',
      requiresExecutiveUpdate: Boolean(
        summary?.requiresExecutiveUpdate ||
          failures?.summaryFailed ||
          failures?.hubFailed
      )
    },
    hub,
    meta: {
      bridgeResilient: true,
      summaryFailed: Boolean(failures?.summaryFailed),
      hubFailed: Boolean(failures?.hubFailed),
      roundsFailed: Boolean(failures?.roundsFailed)
    }
  };
}

export const fundingEnterpriseApi = {
  async listFundingRounds(params = {}) {
    const response = await httpClient.get('/funding/rounds', {
      params: {
        ...(params.status ? { status: params.status } : {}),
        ...(params.roundType ? { roundType: params.roundType } : {})
      }
    });
    return extractItems(response);
  },

  async getFundingRound(id) {
    const response = await httpClient.get(`/funding/rounds/${encodeURIComponent(id)}`);
    return response.data ?? response;
  },

  async createFundingRound(payload = {}) {
    const response = await httpClient.post('/funding/rounds', payload);
    return response.data ?? response;
  },

  async updateFundingRound(id, payload = {}) {
    const response = await httpClient.put(
      `/funding/rounds/${encodeURIComponent(id)}`,
      payload
    );
    return response.data ?? response;
  },

  async deleteFundingRound(id) {
    const response = await httpClient.delete(`/funding/rounds/${encodeURIComponent(id)}`);
    return response.data ?? response;
  },

  async getFundingSummary() {
    const response = await httpClient.get('/funding/summary');
    return response.data ?? response;
  },

  async listSnapshots() {
    const response = await httpClient.get('/funding/snapshots');
    return extractItems(response);
  },

  async createSnapshot({ fundingInputs, fundingSettings } = {}) {
    const response = await httpClient.post('/funding/snapshots', {
      fundingInputs: fundingInputs || {},
      fundingSettings: fundingSettings || {}
    });

    return response.data ?? response;
  },

  async getSnapshot(id) {
    const response = await httpClient.get(
      `/funding/snapshots/${encodeURIComponent(id)}`
    );

    return response.data ?? response;
  },

  async exportLedger(id) {
    const response = await httpClient.get(
      `/funding/snapshots/${encodeURIComponent(id)}/ledger-export`
    );

    return response.data ?? response;
  },

  async getExecutiveHubBrief() {
    const response = await httpClient.get('/funding/hub-overview');
    return response.data ?? response;
  },

  async getExecutiveBridgeSnapshot() {
    const [roundsResult, summaryResult, hubResult] = await Promise.allSettled([
      this.listFundingRounds(),
      this.getFundingSummary(),
      this.getExecutiveHubBrief()
    ]);

    const rounds = roundsResult.status === 'fulfilled' ? roundsResult.value : [];
    const summary =
      summaryResult.status === 'fulfilled'
        ? extractEnvelopeData(summaryResult.value, {})
        : {};
    const hub =
      hubResult.status === 'fulfilled'
        ? extractEnvelopeData(hubResult.value, {})
        : {};

    return buildFundingBridgeSnapshot({
      rounds,
      summary,
      hub,
      failures: {
        roundsFailed: roundsResult.status === 'rejected',
        summaryFailed: summaryResult.status === 'rejected',
        hubFailed: hubResult.status === 'rejected'
      }
    });
  }
};

export default fundingEnterpriseApi;
