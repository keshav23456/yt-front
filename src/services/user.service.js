import api from './api.js';

export const userService = {
  updateAccount: async (userData) => {
    const response = await api.patch('/users/update-account', userData);
    return response.data;
  },

  updateAvatar: async (avatarFile) => {
    const formData = new FormData();
    formData.append('avatar', avatarFile);
    return api.patch('/users/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => res.data);
  },

  updateCoverImage: async (coverImageFile) => {
    const formData = new FormData();
    formData.append('coverImage', coverImageFile);
    return api.patch('/users/cover-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => res.data);
  },

  getChannelProfile: async (username) => {
    const response = await api.get(`/users/c/${username}`);
    return response.data;
  },

  getWatchHistory: async () => {
    const response = await api.get('/users/history');
    return response.data;
  }
};