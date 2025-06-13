import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userService } from '../../services';

// Streamlined initial state
const initialState = {
  profile: null,
  channelProfile: null,
  watchHistory: [],
  subscriptions: [],
  preferences: {
    theme: 'system',
    language: 'en',
    autoplay: true,
    notifications: true,
    quality: 'auto'
  },
  stats: {
    totalVideos: 0,
    totalViews: 0,
    totalSubscribers: 0,
    totalLikes: 0
  },
  isLoading: false,
  isUpdating: false,
  error: null,
  lastUpdated: null,
  pagination: {
    currentPage: 1,
    hasMore: false,
    limit: 10
  }
};

// Helper function for error handling
const handleError = (error) => ({
  message: error.response?.data?.message || error.message || 'Operation failed',
  status: error.response?.status || 500,
  timestamp: Date.now()
});

// Helper function for file validation
const validateFile = (file, maxSize, allowedTypes) => {
  if (file.size > maxSize) {
    throw new Error(`File size must be less than ${maxSize / (1024 * 1024)}MB`);
  }
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type');
  }
};

// =============================================
// ASYNC THUNKS
// =============================================

export const getCurrentUser = createAsyncThunk(
  'user/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await userService.getCurrentUserService();
      return response.data;
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

export const updateProfile = createAsyncThunk(
  'user/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await userService.updateProfileService(profileData);
      return { ...response.data, timestamp: Date.now() };
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

export const updateAvatar = createAsyncThunk(
  'user/updateAvatar',
  async (avatarFile, { rejectWithValue }) => {
    try {
      validateFile(avatarFile, 2 * 1024 * 1024, ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']);
      const response = await userService.updateAvatarService(avatarFile);
      return { ...response.data, timestamp: Date.now() };
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

export const updateCoverImage = createAsyncThunk(
  'user/updateCoverImage',
  async (coverImageFile, { rejectWithValue }) => {
    try {
      validateFile(coverImageFile, 5 * 1024 * 1024, ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']);
      const response = await userService.updateCoverImageService(coverImageFile);
      return { ...response.data, timestamp: Date.now() };
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

export const getChannelProfile = createAsyncThunk(
  'user/getChannelProfile',
  async (username, { rejectWithValue }) => {
    try {
      if (!username?.trim()) throw new Error('Username is required');
      const response = await userService.getChannelProfileService(username);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

export const getWatchHistory = createAsyncThunk(
  'user/getWatchHistory',
  async ({ page = 1, limit = 10, refresh = false } = {}, { rejectWithValue }) => {
    try {
      const response = await userService.getWatchHistoryService(page, limit);
      return { ...response.data, page, limit, refresh, timestamp: Date.now() };
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

export const changePassword = createAsyncThunk(
  'user/changePassword',
  async (passwordData, { rejectWithValue }) => {
    try {
      const { oldPassword, newPassword, confirmPassword } = passwordData;
      if (!oldPassword || !newPassword || !confirmPassword) {
        throw new Error('All password fields are required');
      }
      if (newPassword !== confirmPassword) {
        throw new Error('New passwords do not match');
      }
      if (newPassword.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }
      const response = await userService.changePasswordService(passwordData);
      return { ...response.data, timestamp: Date.now() };
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

// =============================================
// SLICE DEFINITION
// =============================================

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => { state.error = null; },
    clearChannelProfile: (state) => { state.channelProfile = null; },
    clearUserData: () => initialState,
    updateLocalPreferences: (state, action) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },
    addToWatchHistory: (state, action) => {
      const video = action.payload;
      const existingIndex = state.watchHistory.findIndex(item => item.videoId === video.id);
      if (existingIndex !== -1) state.watchHistory.splice(existingIndex, 1);
      state.watchHistory.unshift({
        videoId: video.id,
        video,
        watchedAt: new Date().toISOString(),
        progress: 0
      });
      if (state.watchHistory.length > 100) {
        state.watchHistory = state.watchHistory.slice(0, 100);
      }
    },
    removeFromWatchHistory: (state, action) => {
      state.watchHistory = state.watchHistory.filter(item => item.videoId !== action.payload);
    },
    clearWatchHistory: (state) => {
      state.watchHistory = [];
      state.pagination = initialState.pagination;
    }
  },
  
  extraReducers: (builder) => {
    // Generic pending handler
    const setPending = (state, loadingKey = 'isLoading') => {
      state[loadingKey] = true;
      state.error = null;
    };
    
    // Generic rejected handler
    const setRejected = (state, action, loadingKey = 'isLoading') => {
      state[loadingKey] = false;
      state.error = action.payload;
    };

    builder
      // Current User
      .addCase(getCurrentUser.pending, (state) => setPending(state))
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload.user;
        state.stats = action.payload.stats || state.stats;
        state.subscriptions = action.payload.subscriptions || [];
        state.lastUpdated = action.payload.timestamp;
        state.error = null;
      })
      .addCase(getCurrentUser.rejected, (state, action) => setRejected(state, action))
      
      // Update Profile
      .addCase(updateProfile.pending, (state) => setPending(state, 'isUpdating'))
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.profile = { ...state.profile, ...action.payload.user };
        state.lastUpdated = action.payload.timestamp;
        state.error = null;
      })
      .addCase(updateProfile.rejected, (state, action) => setRejected(state, action, 'isUpdating'))
      
      // Avatar & Cover (shared handler)
      .addCase(updateAvatar.fulfilled, (state, action) => {
        if (state.profile) state.profile.avatar = action.payload.user.avatar;
        state.lastUpdated = action.payload.timestamp;
      })
      .addCase(updateCoverImage.fulfilled, (state, action) => {
        if (state.profile) state.profile.coverImage = action.payload.user.coverImage;
        state.lastUpdated = action.payload.timestamp;
      })
      
      // Channel Profile
      .addCase(getChannelProfile.pending, (state) => setPending(state))
      .addCase(getChannelProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.channelProfile = action.payload.channel;
        state.error = null;
      })
      .addCase(getChannelProfile.rejected, (state, action) => {
        setRejected(state, action);
        state.channelProfile = null;
      })
      
      // Watch History
      .addCase(getWatchHistory.fulfilled, (state, action) => {
        const { history, pagination, page, refresh } = action.payload;
        state.watchHistory = refresh || page === 1 ? history : [...state.watchHistory, ...history];
        state.pagination = {
          currentPage: page,
          hasMore: pagination?.hasMore || false,
          limit: pagination?.limit || 10
        };
      })
      
      // Password Change
      .addCase(changePassword.pending, (state) => setPending(state, 'isUpdating'))
      .addCase(changePassword.fulfilled, (state) => {
        state.isUpdating = false;
        state.error = null;
      })
      .addCase(changePassword.rejected, (state, action) => setRejected(state, action, 'isUpdating'));
  }
});

export const {
  clearError,
  clearChannelProfile,
  clearUserData,
  updateLocalPreferences,
  addToWatchHistory,
  removeFromWatchHistory,
  clearWatchHistory
} = userSlice.actions;

export default userSlice.reducer;