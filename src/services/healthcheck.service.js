import api from './api.js';

export const healthcheckService = {
  healthcheck: async () => {
    const response = await api.get('/healthcheck');
    return response.data;
  }
};