// src/services/subscription.service.js
import { api } from './api.js';

export const toggleSubscription = async (channelId) => {
  const response = await api.post(`/subscriptions/c/${channelId}`);
  return response.data;
};

export const getUserSubscriptions = async (page = 1, limit = 10) => {
  const response = await api.get(`/subscriptions/user?page=${page}&limit=${limit}`);
  return response.data;
};

export const getSubscribedChannels = async (subscriberId, page = 1, limit = 10) => {
  const response = await api.get(`/subscriptions/c/${subscriberId}?page=${page}&limit=${limit}`);
  return response.data;
};

export const getChannelSubscribers = async (channelId, page = 1, limit = 10) => {
  const response = await api.get(`/subscriptions/u/${channelId}?page=${page}&limit=${limit}`);
  return response.data;
};

export const subscriptionService = {
  toggleSubscription,
  getUserSubscriptions,
  getSubscribedChannels,
  getChannelSubscribers
};