// src/store/slices/likeSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { likeService } from '../../services';

// Async thunks for API calls
export const toggleVideoLike = createAsyncThunk(
  'likes/toggleVideoLike',
  async (videoId, { rejectWithValue }) => {
    try {
      const response = await likeService.toggleVideoLike(videoId);
      return {
        videoId,
        isLiked: response.data.isLiked,
        likesCount: response.data.likesCount
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to toggle video like');
    }
  }
);

export const toggleCommentLike = createAsyncThunk(
  'likes/toggleCommentLike',
  async (commentId, { rejectWithValue }) => {
    try {
      const response = await likeService.toggleCommentLike(commentId);
      return {
        commentId,
        isLiked: response.data.isLiked,
        likesCount: response.data.likesCount
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to toggle comment like');
    }
  }
);

export const toggleTweetLike = createAsyncThunk(
  'likes/toggleTweetLike',
  async (tweetId, { rejectWithValue }) => {
    try {
      const response = await likeService.toggleTweetLike(tweetId);
      return {
        tweetId,
        isLiked: response.data.isLiked,
        likesCount: response.data.likesCount
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to toggle tweet like');
    }
  }
);

// Get user's liked videos
export const getLikedVideos = createAsyncThunk(
  'likes/getLikedVideos',
  async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      const response = await likeService.getLikedVideos(page, limit);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch liked videos');
    }
  }
);

const initialState = {
  // Store like status for different content types
  videoLikes: {}, // { videoId: { isLiked: boolean, likesCount: number } }
  commentLikes: {}, // { commentId: { isLiked: boolean, likesCount: number } }
  tweetLikes: {}, // { tweetId: { isLiked: boolean, likesCount: number } }
  
  // Liked content lists
  likedVideos: [],
  likedVideosMeta: {
    totalDocs: 0,
    totalPages: 0,
    page: 1,
    hasNextPage: false,
    hasPrevPage: false
  },
  
  // Loading states
  loading: {
    toggleVideo: false,
    toggleComment: false,
    toggleTweet: false,
    fetchLikedVideos: false
  },
  
  // Error states
  error: {
    toggleVideo: null,
    toggleComment: null,
    toggleTweet: null,
    fetchLikedVideos: null
  }
};

const likeSlice = createSlice({
  name: 'likes',
  initialState,
  reducers: {
    // Clear all like data (useful for logout)
    clearLikeData: (state) => {
      state.videoLikes = {};
      state.commentLikes = {};
      state.tweetLikes = {};
      state.likedVideos = [];
      state.likedVideosMeta = initialState.likedVideosMeta;
    },
    
    // Set initial like status for content (when loading content)
    setVideoLikeStatus: (state, action) => {
      const { videoId, isLiked, likesCount } = action.payload;
      state.videoLikes[videoId] = { isLiked, likesCount };
    },
    
    setCommentLikeStatus: (state, action) => {
      const { commentId, isLiked, likesCount } = action.payload;
      state.commentLikes[commentId] = { isLiked, likesCount };
    },
    
    setTweetLikeStatus: (state, action) => {
      const { tweetId, isLiked, likesCount } = action.payload;
      state.tweetLikes[tweetId] = { isLiked, likesCount };
    },
    
    // Clear specific errors
    clearError: (state, action) => {
      const errorType = action.payload;
      if (state.error[errorType]) {
        state.error[errorType] = null;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Toggle Video Like
      .addCase(toggleVideoLike.pending, (state) => {
        state.loading.toggleVideo = true;
        state.error.toggleVideo = null;
      })
      .addCase(toggleVideoLike.fulfilled, (state, action) => {
        state.loading.toggleVideo = false;
        const { videoId, isLiked, likesCount } = action.payload;
        state.videoLikes[videoId] = { isLiked, likesCount };
        
        // Update liked videos list if video was unliked
        if (!isLiked) {
          state.likedVideos = state.likedVideos.filter(video => video._id !== videoId);
        }
      })
      .addCase(toggleVideoLike.rejected, (state, action) => {
        state.loading.toggleVideo = false;
        state.error.toggleVideo = action.payload;
      })
      
      // Toggle Comment Like
      .addCase(toggleCommentLike.pending, (state) => {
        state.loading.toggleComment = true;
        state.error.toggleComment = null;
      })
      .addCase(toggleCommentLike.fulfilled, (state, action) => {
        state.loading.toggleComment = false;
        const { commentId, isLiked, likesCount } = action.payload;
        state.commentLikes[commentId] = { isLiked, likesCount };
      })
      .addCase(toggleCommentLike.rejected, (state, action) => {
        state.loading.toggleComment = false;
        state.error.toggleComment = action.payload;
      })
      
      // Toggle Tweet Like
      .addCase(toggleTweetLike.pending, (state) => {
        state.loading.toggleTweet = true;
        state.error.toggleTweet = null;
      })
      .addCase(toggleTweetLike.fulfilled, (state, action) => {
        state.loading.toggleTweet = false;
        const { tweetId, isLiked, likesCount } = action.payload;
        state.tweetLikes[tweetId] = { isLiked, likesCount };
      })
      .addCase(toggleTweetLike.rejected, (state, action) => {
        state.loading.toggleTweet = false;
        state.error.toggleTweet = action.payload;
      })
      
      // Get Liked Videos
      .addCase(getLikedVideos.pending, (state) => {
        state.loading.fetchLikedVideos = true;
        state.error.fetchLikedVideos = null;
      })
      .addCase(getLikedVideos.fulfilled, (state, action) => {
        state.loading.fetchLikedVideos = false;
        const { docs, ...meta } = action.payload;
        
        if (meta.page === 1) {
          state.likedVideos = docs;
        } else {
          state.likedVideos = [...state.likedVideos, ...docs];
        }
        
        state.likedVideosMeta = meta;
        
        // Update video likes status from fetched data
        docs.forEach(video => {
          state.videoLikes[video._id] = {
            isLiked: true,
            likesCount: video.likesCount
          };
        });
      })
      .addCase(getLikedVideos.rejected, (state, action) => {
        state.loading.fetchLikedVideos = false;
        state.error.fetchLikedVideos = action.payload;
      });
  }
});

// Action creators
export const {
  clearLikeData,
  setVideoLikeStatus,
  setCommentLikeStatus,
  setTweetLikeStatus,
  clearError
} = likeSlice.actions;

// Selectors
export const selectVideoLikeStatus = (state, videoId) => 
  state.likes.videoLikes[videoId] || { isLiked: false, likesCount: 0 };

export const selectCommentLikeStatus = (state, commentId) => 
  state.likes.commentLikes[commentId] || { isLiked: false, likesCount: 0 };

export const selectTweetLikeStatus = (state, tweetId) => 
  state.likes.tweetLikes[tweetId] || { isLiked: false, likesCount: 0 };

export const selectLikedVideos = (state) => state.likes.likedVideos;
export const selectLikedVideosMeta = (state) => state.likes.likedVideosMeta;
export const selectLikeLoading = (state) => state.likes.loading;
export const selectLikeErrors = (state) => state.likes.error;

export default likeSlice.reducer;