// src/store/slices/likeSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { likeService } from '../../services';

// Async thunks with consistent error handling
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
  // Like status for different content types
  videoLikes: {},
  commentLikes: {},
  tweetLikes: {},
  
  // Liked content
  likedVideos: [],
  likedVideosMeta: {
    totalDocs: 0,
    totalPages: 0,
    page: 1,
    hasNextPage: false,
    hasPrevPage: false
  },
  
  // Consistent loading states
  isLoading: {
    toggleVideo: false,
    toggleComment: false,
    toggleTweet: false,
    fetchLikedVideos: false
  },
  
  // Consistent error states
  errors: {
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
    clearLikeData: (state) => {
      Object.assign(state, initialState);
    },
    
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
    
    clearError: (state, action) => {
      const errorType = action.payload;
      if (state.errors[errorType] !== undefined) {
        state.errors[errorType] = null;
      }
    }
  },
  
  extraReducers: (builder) => {
    // Toggle Video Like
    builder
      .addCase(toggleVideoLike.pending, (state) => {
        state.isLoading.toggleVideo = true;
        state.errors.toggleVideo = null;
      })
      .addCase(toggleVideoLike.fulfilled, (state, action) => {
        state.isLoading.toggleVideo = false;
        const { videoId, isLiked, likesCount } = action.payload;
        state.videoLikes[videoId] = { isLiked, likesCount };
        
        // Remove from liked videos if unliked
        if (!isLiked) {
          state.likedVideos = state.likedVideos.filter(video => video._id !== videoId);
        }
      })
      .addCase(toggleVideoLike.rejected, (state, action) => {
        state.isLoading.toggleVideo = false;
        state.errors.toggleVideo = action.payload;
      })
      
      // Toggle Comment Like
      .addCase(toggleCommentLike.pending, (state) => {
        state.isLoading.toggleComment = true;
        state.errors.toggleComment = null;
      })
      .addCase(toggleCommentLike.fulfilled, (state, action) => {
        state.isLoading.toggleComment = false;
        const { commentId, isLiked, likesCount } = action.payload;
        state.commentLikes[commentId] = { isLiked, likesCount };
      })
      .addCase(toggleCommentLike.rejected, (state, action) => {
        state.isLoading.toggleComment = false;
        state.errors.toggleComment = action.payload;
      })
      
      // Toggle Tweet Like
      .addCase(toggleTweetLike.pending, (state) => {
        state.isLoading.toggleTweet = true;
        state.errors.toggleTweet = null;
      })
      .addCase(toggleTweetLike.fulfilled, (state, action) => {
        state.isLoading.toggleTweet = false;
        const { tweetId, isLiked, likesCount } = action.payload;
        state.tweetLikes[tweetId] = { isLiked, likesCount };
      })
      .addCase(toggleTweetLike.rejected, (state, action) => {
        state.isLoading.toggleTweet = false;
        state.errors.toggleTweet = action.payload;
      })
      
      // Get Liked Videos
      .addCase(getLikedVideos.pending, (state) => {
        state.isLoading.fetchLikedVideos = true;
        state.errors.fetchLikedVideos = null;
      })
      .addCase(getLikedVideos.fulfilled, (state, action) => {
        state.isLoading.fetchLikedVideos = false;
        const { docs, ...meta } = action.payload;
        
        if (meta.page === 1) {
          state.likedVideos = docs;
        } else {
          state.likedVideos = [...state.likedVideos, ...docs];
        }
        
        state.likedVideosMeta = meta;
        
        // Update video likes status
        docs.forEach(video => {
          state.videoLikes[video._id] = {
            isLiked: true,
            likesCount: video.likesCount
          };
        });
      })
      .addCase(getLikedVideos.rejected, (state, action) => {
        state.isLoading.fetchLikedVideos = false;
        state.errors.fetchLikedVideos = action.payload;
      });
  }
});

// Export actions
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
export const selectLikeIsLoading = (state) => state.likes.isLoading;
export const selectLikeErrors = (state) => state.likes.errors;

export default likeSlice.reducer;