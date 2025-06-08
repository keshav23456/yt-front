import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { videoService } from '../../services';
import { LOADING_STATES } from '../../utils/constants';

const initialState = {
  videos: [],
  currentVideo: null,
  uploading: LOADING_STATES.IDLE,
  loading: LOADING_STATES.IDLE,
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
    sortType: 'desc',
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
  async ({ videoData, onProgress }, { rejectWithValue }) => {
    try {
      const response = await videoService.uploadVideo(videoData, onProgress);
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
    clearVideoError: (state) => {
      state.error = null;
    },
    setCurrentVideo: (state, action) => {
      state.currentVideo = action.payload;
    },
    clearCurrentVideo: (state) => {
      state.currentVideo = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setUploadProgress: (state, action) => {
      state.uploadProgress = action.payload;
    },
    resetUpload: (state) => {
      state.uploading = LOADING_STATES.IDLE;
      state.uploadProgress = 0;
    }
  },
  extraReducers: (builder) => {
    builder
      // Get All Videos
      .addCase(getAllVideos.pending, (state) => {
        state.loading = LOADING_STATES.PENDING;
        state.error = null;
      })
      .addCase(getAllVideos.fulfilled, (state, action) => {
        state.loading = LOADING_STATES.FULFILLED;
        state.videos = action.payload.videos;
        state.pagination = action.payload.pagination;
      })
      .addCase(getAllVideos.rejected, (state, action) => {
        state.loading = LOADING_STATES.REJECTED;
        state.error = action.payload;
      })
      // Get Video By ID
      .addCase(getVideoById.pending, (state) => {
        state.loading = LOADING_STATES.PENDING;
        state.error = null;
      })
      .addCase(getVideoById.fulfilled, (state, action) => {
        state.loading = LOADING_STATES.FULFILLED;
        state.currentVideo = action.payload.video;
      })
      .addCase(getVideoById.rejected, (state, action) => {
        state.loading = LOADING_STATES.REJECTED;
        state.error = action.payload;
      })
      // Upload Video
      .addCase(uploadVideo.pending, (state) => {
        state.uploading = LOADING_STATES.PENDING;
        state.error = null;
      })
      .addCase(uploadVideo.fulfilled, (state, action) => {
        state.uploading = LOADING_STATES.FULFILLED;
        state.videos.unshift(action.payload.video);
        state.uploadProgress = 0;
      })
      .addCase(uploadVideo.rejected, (state, action) => {
        state.uploading = LOADING_STATES.REJECTED;
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
  clearVideoError,
  setCurrentVideo,
  clearCurrentVideo,
  setFilters,
  setUploadProgress,
  resetUpload
} = videoSlice.actions;

export default videoSlice.reducer;
