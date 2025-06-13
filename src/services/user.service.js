import api from './api';

// Get current user
export const getCurrentUserService = () => {
  return api.get('/users/current-user');
};

// Get user channel/profile
export const getUserChannelService = (username) => {
  return api.get(`/users/c/${username}`);
};

// Alternative name for channel profile (to match slice usage)
export const getChannelProfileService = (username) => {
  return api.get(`/users/c/${username}`);
};

// Get channel videos
export const getChannelVideosService = (userId, page = 1, limit = 10) => {
  return api.get(`/users/channel/${userId}/videos`, {
    params: { page, limit }
  });
};

// Get watch history
export const getWatchHistoryService = (page = 1, limit = 10) => {
  return api.get('/users/history', {
    params: { page, limit }
  });
};

// Update user account details
export const updateUserAccountService = (data) => {
  return api.patch('/users/update-account', data);
};

// Alternative name for profile update (to match slice usage)
export const updateProfileService = (data) => {
  return api.patch('/users/update-account', data);
};

// Alternative name for the same function
export const updateAccountDetailsService = (data) => {
  return api.patch('/users/update-account', data);
};

// Update user avatar
export const updateUserAvatarService = (avatarFile) => {
  const formData = new FormData();
  formData.append('avatar', avatarFile);
  return api.patch('/users/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// Alternative name for the same function (to match slice usage)
export const updateAvatarService = (avatarFile) => {
  return updateUserAvatarService(avatarFile);
};

// Update user cover image
export const updateUserCoverImageService = (coverImageFile) => {
  const formData = new FormData();
  formData.append('coverImage', coverImageFile);
  return api.patch('/users/cover-image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// Alternative name for the same function (to match slice usage)
export const updateCoverImageService = (coverImageFile) => {
  return updateUserCoverImageService(coverImageFile);
};

// Change password
export const changePasswordService = (passwordData) => {
  return api.post('/users/change-password', passwordData);
};

// Get user profile by ID
export const getUserProfileService = (userId) => {
  return api.get(`/users/${userId}`);
};

// Search users
export const searchUsersService = (query, page = 1, limit = 10) => {
  return api.get('/users/search', {
    params: { query, page, limit }
  });
};

// Default export object
const userService = {
  getCurrentUserService,
  getUserChannelService,
  getChannelProfileService,
  getChannelVideosService,
  getWatchHistoryService,
  updateUserAccountService,
  updateProfileService,
  updateAccountDetailsService,
  updateUserAvatarService,
  updateAvatarService,
  updateUserCoverImageService,
  updateCoverImageService,
  changePasswordService,
  getUserProfileService,
  searchUsersService
};
export { userService };
export default userService;