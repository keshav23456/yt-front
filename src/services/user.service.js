
import api from './api';

// Get current user
export const getCurrentUser = () => {
  return api.get('/users/current-user');
};

// Get user channel/profile
export const getUserChannel = (username) => {
  return api.get(`/users/c/${username}`);
};

// Get channel videos
export const getChannelVideos = (userId, page = 1, limit = 10) => {
  return api.get(`/users/channel/${userId}/videos`, {
    params: { page, limit }
  });
};

// Get watch history
export const getWatchHistory = (page = 1, limit = 10) => {
  return api.get('/users/history', {
    params: { page, limit }
  });
};

// Update user account details
export const updateUserAccount = (data) => {
  return api.patch('/users/update-account', data);
};

// Alternative name for the same function
export const updateAccountDetails = (data) => {
  return api.patch('/users/update-account', data);
};

// Update user avatar
export const updateUserAvatar = (avatarFile) => {
  const formData = new FormData();
  formData.append('avatar', avatarFile);
  return api.patch('/users/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// Alternative name for the same function
export const updateAvatar = (avatarFile) => {
  return updateUserAvatar(avatarFile);
};

// Update user cover image
export const updateUserCoverImage = (coverImageFile) => {
  const formData = new FormData();
  formData.append('coverImage', coverImageFile);
  return api.patch('/users/cover-image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// Alternative name for the same function
export const updateCoverImage = (coverImageFile) => {
  return updateUserCoverImage(coverImageFile);
};

// Change password
export const changePassword = (passwordData) => {
  return api.post('/users/change-password', passwordData);
};

// Get user profile by ID
export const getUserProfile = (userId) => {
  return api.get(`/users/${userId}`);
};

// Search users
export const searchUsers = (query, page = 1, limit = 10) => {
  return api.get('/users/search', {
    params: { query, page, limit }
  });
};

// Default export object
const userService = {
  // getCurrentUser,
  getUserChannel,
  getChannelVideos,
  getWatchHistory,
  updateUserAccount,
  updateAccountDetails,
  updateUserAvatar,
  updateAvatar,
  updateUserCoverImage,
  updateCoverImage,
  changePassword,
  getUserProfile,
  searchUsers
};

export default userService;


// import { api } from './api.js';

// export const updateAccount = async (userData) => {
//   const response = await api.patch('/users/update-account', userData);
//   return response.data;
// };

// export const updateAvatar = async (avatarFile) => {
//   const formData = new FormData();
//   formData.append('avatar', avatarFile);
//   return api.patch('/users/avatar', formData, {
//     headers: { 'Content-Type': 'multipart/form-data' }
//   }).then(res => res.data);
// };

// export const updateCoverImage = async (coverImageFile) => {
//   const formData = new FormData();
//   formData.append('coverImage', coverImageFile);
//   return api.patch('/users/cover-image', formData, {
//     headers: { 'Content-Type': 'multipart/form-data' }
//   }).then(res => res.data);
// };

// export const getChannelProfile = async (username) => {
//   const response = await api.get(`/users/c/${username}`);
//   return response.data;
// };

// export const getWatchHistory = async () => {
//   const response = await api.get('/users/history');
//   return response.data;
// };

// export const userService = {
//   updateAccount,
//   updateAvatar,
//   updateCoverImage,
//   getChannelProfile,
//   getWatchHistory
// };