import { api } from './api.js';

export const createTweet = async (content) => {
  const response = await api.post('/tweets', { content });
  return response.data;
};

export const getUserTweets = async (userId) => {
  const response = await api.get(`/tweets/user/${userId}`);
  return response.data;
};

export const updateTweet = async (tweetId, content) => {
  const response = await api.patch(`/tweets/${tweetId}`, { content });
  return response.data;
};

export const deleteTweet = async (tweetId) => {
  const response = await api.delete(`/tweets/${tweetId}`);
  return response.data;
};

export const tweetService = {
  createTweet,
  getUserTweets,
  updateTweet,
  deleteTweet
};
