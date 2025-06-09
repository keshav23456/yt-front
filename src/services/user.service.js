// src/services/user.service.js
import { api } from './api.js';

// Get user channel/profile by username
export const getUserChannel = async (username) => {
  try {
    const response = await api.get(`/users/c/${username}`);
    return response.data;
  } catch (error) {
    console.error('Get user channel error:', error);
    throw error;
  }
};

// Get user profile by ID
export const getUserProfile = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Get user profile error:', error);
    throw error;
  }
};

// Get channel videos
export const getChannelVideos = async (userId, page = 1, limit = 10) => {
  try {
    const response = await api.get(`/users/channel/${userId}/videos`, {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    console.error('Get channel videos error:', error);
    throw error;
  }
};

// Get watch history
export const getWatchHistory = async (page = 1, limit = 10) => {
  try {
    const response = await api.get('/users/history', {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    console.error('Get watch history error:', error);
    throw error;
  }
};

// Update user account details
export const updateAccountDetails = async (data) => {
  try {
    const response = await api.patch('/users/update-account', data);
    return response.data;
  } catch (error) {
    console.error('Update account details error:', error);
    throw error;
  }
};

// Update user avatar
export const updateAvatar = async (avatarFile) => {
  try {
    const formData = new FormData();
    formData.append('avatar', avatarFile);
    
    const response = await api.patch('/users/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    console.error('Update avatar error:', error);
    throw error;
  }
};

// Update user cover image
export const updateCoverImage = async (coverImageFile) => {
  try {
    const formData = new FormData();
    formData.append('coverImage', coverImageFile);
    
    const response = await api.patch('/users/cover-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    console.error('Update cover image error:', error);
    throw error;
  }
};

// Search users
export const searchUsers = async (query, page = 1, limit = 10) => {
  try {
    const response = await api.get('/users/search', {
      params: { query, page, limit }
    });
    return response.data;
  } catch (error) {
    console.error('Search users error:', error);
    throw error;
  }
};

// Service object for easy import
export const userService = {
  getUserChannel,
  getUserProfile,
  getChannelVideos,
  getWatchHistory,
  updateAccountDetails,
  updateAvatar,
  updateCoverImage,
  searchUsers
};

export default userService;