import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userService } from '../../services';
import { LOADING_STATES } from '../../utils/constants';

const initialState = {
  profile: null,
  channelProfile: null,
  watchHistory: [],
  loading: LOADING_STATES.IDLE,
  error: null,
  updateLoading: LOADING_STATES.IDLE
};

// Async thunks
export const updateProfile = createAsyncThunk(
  'user/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await userService.updateProfileService(profileData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Profile update failed');
    }
  }
);

export const updateAvatar = createAsyncThunk(
  'user/updateAvatar',
  async (avatarFile, { rejectWithValue }) => {
    try {
      const response = await userService.updateAvatarService(avatarFile);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Avatar update failed');
    }
  }
);

export const updateCoverImage = createAsyncThunk(
  'user/updateCoverImage',
  async (coverImageFile, { rejectWithValue }) => {
    try {
      const response = await userService.updateCoverImageService(coverImageFile);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Cover image update failed');
    }
  }
);

export const getChannelProfile = createAsyncThunk(
  'user/getChannelProfile',
  async (username, { rejectWithValue }) => {
    try {
      const response = await userService.getChannelProfileService(username);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get channel profile');
    }
  }
);

export const getWatchHistory = createAsyncThunk(
  'user/getWatchHistory',
  async (_, { rejectWithValue }) => {
    try {
      const response = await userService.getWatchHistoryService();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get watch history');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUserError: (state) => {
      state.error = null;
    },
    clearChannelProfile: (state) => {
      state.channelProfile = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.updateLoading = LOADING_STATES.PENDING;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.updateLoading = LOADING_STATES.FULFILLED;
        state.profile = action.payload.user;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.updateLoading = LOADING_STATES.REJECTED;
        state.error = action.payload;
      })
      // Update Avatar
      .addCase(updateAvatar.fulfilled, (state, action) => {
        if (state.profile) {
          state.profile.avatar = action.payload.user.avatar;
        }
      })
      // Update Cover Image
      .addCase(updateCoverImage.fulfilled, (state, action) => {
        if (state.profile) {
          state.profile.coverImage = action.payload.user.coverImage;
        }
      })
      // Get Channel Profile
      .addCase(getChannelProfile.pending, (state) => {
        state.loading = LOADING_STATES.PENDING;
        state.error = null;
      })
      .addCase(getChannelProfile.fulfilled, (state, action) => {
        state.loading = LOADING_STATES.FULFILLED;
        state.channelProfile = action.payload.channel;
      })
      .addCase(getChannelProfile.rejected, (state, action) => {
        state.loading = LOADING_STATES.REJECTED;
        state.error = action.payload;
      })
      // Get Watch History
      .addCase(getWatchHistory.fulfilled, (state, action) => {
        state.watchHistory = action.payload.history;
      });
  }
});

export const { clearUserError, clearChannelProfile } = userSlice.actions;
export default userSlice.reducer;