import api from './api.js';

export const playlistService = {
  createPlaylist: async (playlistData) => {
    const response = await api.post('/playlist', playlistData);
    return response.data;
  },

  getPlaylistById: async (playlistId) => {
    const response = await api.get(`/playlist/${playlistId}`);
    return response.data;
  },

  updatePlaylist: async (playlistId, updateData) => {
    const response = await api.patch(`/playlist/${playlistId}`, updateData);
    return response.data;
  },

  deletePlaylist: async (playlistId) => {
    const response = await api.delete(`/playlist/${playlistId}`);
    return response.data;
  },

  addVideoToPlaylist: async (videoId, playlistId) => {
    const response = await api.patch(`/playlist/add/${videoId}/${playlistId}`);
    return response.data;
  },

  removeVideoFromPlaylist: async (videoId, playlistId) => {
    const response = await api.patch(`/playlist/remove/${videoId}/${playlistId}`);
    return response.data;
  },

  getUserPlaylists: async (userId) => {
    const response = await api.get(`/playlist/user/${userId}`);
    return response.data;
  }
};