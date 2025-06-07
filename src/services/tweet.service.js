import api from './api.js';

export const tweetService = {
  createTweet: async (content) => {
    const response = await api.post('/tweets', { content });
    return response.data;
  },

  getUserTweets: async (userId) => {
    const response = await api.get(`/tweets/user/${userId}`);
    return response.data;
  },

  updateTweet: async (tweetId, content) => {
    const response = await api.patch(`/tweets/${tweetId}`, { content });
    return response.data;
  },

  deleteTweet: async (tweetId) => {
    const response = await api.delete(`/tweets/${tweetId}`);
    return response.data;
  }
};