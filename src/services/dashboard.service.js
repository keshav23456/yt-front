import { api } from './api.js';

export const getChannelStats = async () => {
  const response = await api.get('/dashboard/stats');
  return response.data;
};

export const getChannelVideos = async () => {
  const response = await api.get('/dashboard/videos');
  return response.data;
};

export const dashboardService=[
  getChannelStats,
  getChannelVideos
]