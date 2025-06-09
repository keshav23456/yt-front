// src/services/subscription.service.js
import { api } from './api.js';

export const toggleSubscription = async (channelId) => {
  const response = await api.post(`/subscriptions/c/${channelId}`);
  return response.data;
};

export const getSubscribedChannels = async (channelId) => {
  const response = await api.get(`/subscriptions/c/${channelId}`);
  return response.data;
};

export const getChannelSubscribers = async (subscriberId) => {
  const response = await api.get(`/subscriptions/u/${subscriberId}`);
  return response.data;
};

export const subscriptionService = {
  toggleSubscription,
  getSubscribedChannels,
  getChannelSubscribers
};