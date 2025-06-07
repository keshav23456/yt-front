import api from './api.js';

export const subscriptionService = {
  toggleSubscription: async (channelId) => {
    const response = await api.post(`/subscriptions/c/${channelId}`);
    return response.data;
  },

  getSubscribedChannels: async (channelId) => {
    const response = await api.get(`/subscriptions/c/${channelId}`);
    return response.data;
  },

  getChannelSubscribers: async (subscriberId) => {
    const response = await api.get(`/subscriptions/u/${subscriberId}`);
    return response.data;
  }
};