import { api } from './api.js';

export const createPlaylist = async (playlistData) => {
  const response = await api.post('/playlist', playlistData);
  return response.data;
};

export const getPlaylistById = async (playlistId) => {
  const response = await api.get(`/playlist/${playlistId}`);
  return response.data;
};

export const updatePlaylist = async (playlistId, updateData) => {
  const response = await api.patch(`/playlist/${playlistId}`, updateData);
  return response.data;
};

export const deletePlaylist = async (playlistId) => {
  const response = await api.delete(`/playlist/${playlistId}`);
  return response.data;
};

export const addVideoToPlaylist = async (videoId, playlistId) => {
  const response = await api.patch(`/playlist/add/${videoId}/${playlistId}`);
  return response.data;
};

export const removeVideoFromPlaylist = async (videoId, playlistId) => {
  const response = await api.patch(`/playlist/remove/${videoId}/${playlistId}`);
  return response.data;
};

export const getUserPlaylists = async (userId) => {
  const response = await api.get(`/playlist/user/${userId}`);
  return response.data;
};

export const playlistService = {
  createPlaylist,
  getPlaylistById,
  updatePlaylist,
  deletePlaylist,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  getUserPlaylists
};
