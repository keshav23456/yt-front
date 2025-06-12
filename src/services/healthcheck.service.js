import { api } from './api.js';

export const healthcheck = async () => {
  const response = await api.get('/healthcheck');
  return response.data;
};

export const healthcheckService={
  healthcheck
}