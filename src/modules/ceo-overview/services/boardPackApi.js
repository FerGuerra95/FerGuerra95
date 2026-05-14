import { httpClient } from '../../../shared/services/httpClient.js';

function extractData(response) {
  return response?.data ?? response ?? null;
}

export const boardPackApi = {
  async getBoardPack() {
    const response = await httpClient.get('/reports/board-pack');
    return extractData(response);
  }
};

export default boardPackApi;
