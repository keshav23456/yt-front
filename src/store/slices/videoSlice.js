import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { videoService } from '../../services';
import { LOADING_STATES } from '../../utils/constants';

const initialState = {
  videos: [],
  currentVideo: null,
  status: LOADING_STATES.IDLE,
  uploadStatus: LOADING_STATES.IDLE,
  error: null,
  uploadProgress: 0,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalVideos: 0,
    hasNextPage: false,
    hasPrevPage: false
  },
  filters: {
    sortBy: 'createdAt',
    sortOrder: 'desc',
    query: ''
  }
};

// Async thunks
export const getAllVideos = createAsyncThunk(
  'video/getAllVideos',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await videoService.getAllVideos(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch videos');
    }
  }
);

export const getVideoById = createAsyncThunk(
  'video/getVideoById',
  async (videoId, { rejectWithValue }) => {
    try {
      const response = await videoService.getVideoById(videoId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch video');
    }
  }
);

export const uploadVideo = createAsyncThunk(
  'video/uploadVideo',
  async ({ videoData, onProgress }, { rejectWithValue, dispatch }) => {
    try {
      const progressCallback = (progressEvent) => {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        dispatch(setUploadProgress(progress));
        if (onProgress) onProgress(progress);
      };
      
      const response = await videoService.uploadVideo(videoData, progressCallback);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Video upload failed');
    }
  }
);

export const updateVideo = createAsyncThunk(
  'video/updateVideo',
  async ({ videoId, videoData }, { rejectWithValue }) => {
    try {
      const response = await videoService.updateVideo(videoId, videoData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Video update failed');
    }
  }
);

export const deleteVideo = createAsyncThunk(
  'video/deleteVideo',
  async (videoId, { rejectWithValue }) => {
    try {
      await videoService.deleteVideo(videoId);
      return videoId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Video deletion failed');
    }
  }
);

export const togglePublishStatus = createAsyncThunk(
  'video/togglePublishStatus',
  async (videoId, { rejectWithValue }) => {
    try {
      const response = await videoService.togglePublishStatus(videoId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to toggle publish status');
    }
  }
);

const videoSlice = createSlice({
  name: 'video',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentVideo: (state, action) => {
      state.currentVideo = action.payload;
    },
    clearCurrentVideo: (state) => {
      state.currentVideo = null;
    },
    updateFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setUploadProgress: (state, action) => {
      state.uploadProgress = action.payload;
    },
    resetUpload: (state) => {
      state.uploadStatus = LOADING_STATES.IDLE;
      state.uploadProgress = 0;
    }
  },
  extraReducers: (builder) => {
    builder
      // Get All Videos
      .addCase(getAllVideos.pending, (state) => {
        state.status = LOADING_STATES.LOADING;
        state.error = null;
      })
      .addCase(getAllVideos.fulfilled, (state, action) => {
        state.status = LOADING_STATES.SUCCESS;
        state.videos = action.payload.videos;
        state.pagination = action.payload.pagination;
      })
      .addCase(getAllVideos.rejected, (state, action) => {
        state.status = LOADING_STATES.ERROR;
        state.error = action.payload;
      })
      // Get Video By ID
      .addCase(getVideoById.pending, (state) => {
        state.status = LOADING_STATES.LOADING;
        state.error = null;
      })
      .addCase(getVideoById.fulfilled, (state, action) => {
        state.status = LOADING_STATES.SUCCESS;
        state.currentVideo = action.payload.video;
      })
      .addCase(getVideoById.rejected, (state, action) => {
        state.status = LOADING_STATES.ERROR;
        state.error = action.payload;
      })
      // Upload Video
      .addCase(uploadVideo.pending, (state) => {
        state.uploadStatus = LOADING_STATES.LOADING;
        state.error = null;
      })
      .addCase(uploadVideo.fulfilled, (state, action) => {
        state.uploadStatus = LOADING_STATES.SUCCESS;
        state.videos.unshift(action.payload.video);
        state.uploadProgress = 0;
      })
      .addCase(uploadVideo.rejected, (state, action) => {
        state.uploadStatus = LOADING_STATES.ERROR;
        state.error = action.payload;
        state.uploadProgress = 0;
      })
      // Update Video
      .addCase(updateVideo.fulfilled, (state, action) => {
        const index = state.videos.findIndex(v => v._id === action.payload.video._id);
        if (index !== -1) {
          state.videos[index] = action.payload.video;
        }
        if (state.currentVideo?._id === action.payload.video._id) {
          state.currentVideo = action.payload.video;
        }
      })
      // Delete Video
      .addCase(deleteVideo.fulfilled, (state, action) => {
        state.videos = state.videos.filter(v => v._id !== action.payload);
        if (state.currentVideo?._id === action.payload) {
          state.currentVideo = null;
        }
      })
      // Toggle Publish Status
      .addCase(togglePublishStatus.fulfilled, (state, action) => {
        const index = state.videos.findIndex(v => v._id === action.payload.video._id);
        if (index !== -1) {
          state.videos[index] = action.payload.video;
        }
        if (state.currentVideo?._id === action.payload.video._id) {
          state.currentVideo = action.payload.video;
        }
      });
  }
});

export const {
  clearError,
  setCurrentVideo,
  clearCurrentVideo,
  updateFilters,
  setUploadProgress,
  resetUpload
} = videoSlice.actions;

export default videoSlice.reducer;