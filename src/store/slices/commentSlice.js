import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { commentService } from '../../services';

// Async thunks with consistent error handling
export const fetchComments = createAsyncThunk(
  'comments/fetchComments',
  async ({ videoId, page = 1 }, { rejectWithValue }) => {
    try {
      const response = await commentService.getVideoComments(videoId, page);
      return {
        ...response.data,
        videoId,
        page
      };
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || 'Failed to fetch comments',
        status: error.response?.status || 500
      });
    }
  }
);

export const addComment = createAsyncThunk(
  'comments/addComment',
  async ({ videoId, content }, { rejectWithValue }) => {
    try {
      const response = await commentService.addComment(videoId, { content });
      return response.data;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || 'Failed to add comment',
        status: error.response?.status || 500
      });
    }
  }
);

export const updateComment = createAsyncThunk(
  'comments/updateComment',
  async ({ commentId, content }, { rejectWithValue }) => {
    try {
      const response = await commentService.updateComment(commentId, { content });
      return response.data;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || 'Failed to update comment',
        status: error.response?.status || 500
      });
    }
  }
);

export const deleteComment = createAsyncThunk(
  'comments/deleteComment',
  async (commentId, { rejectWithValue }) => {
    try {
      await commentService.deleteComment(commentId);
      return commentId;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || 'Failed to delete comment',
        status: error.response?.status || 500
      });
    }
  }
);

export const toggleCommentLike = createAsyncThunk(
  'comments/toggleCommentLike',
  async (commentId, { rejectWithValue }) => {
    try {
      const response = await commentService.toggleCommentLike(commentId);
      return { commentId, ...response.data };
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || 'Failed to toggle comment like',
        status: error.response?.status || 500
      });
    }
  }
);

// Initial state with consistent structure
const initialState = {
  // Data
  comments: [],
  commentsByVideo: {},
  
  // UI states
  isLoading: false,
  isAdding: false,
  isUpdating: false,
  isDeleting: false,
  
  // Error handling
  error: null,
  addError: null,
  updateError: null,
  deleteError: null,
  
  // Pagination
  pagination: {
    page: 1,
    totalPages: 1,
    totalComments: 0,
    hasMore: true,
    limit: 10
  },
  
  // Current context
  currentVideoId: null,
  
  // Optimistic updates tracking
  optimisticUpdates: new Set()
};

const commentSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    // Clear actions
    clearComments: (state) => {
      state.comments = [];
      state.commentsByVideo = {};
      state.pagination = initialState.pagination;
      state.currentVideoId = null;
      state.error = null;
    },
    
    clearErrors: (state) => {
      state.error = null;
      state.addError = null;
      state.updateError = null;
      state.deleteError = null;
    },
    
    clearError: (state) => {
      state.error = null;
    },
    
    // Video context management
    setCurrentVideo: (state, action) => {
      state.currentVideoId = action.payload;
      state.comments = state.commentsByVideo[action.payload] || [];
    },
    
    // Pagination management
    resetPagination: (state) => {
      state.pagination = initialState.pagination;
    },
    
    // Optimistic updates
    addOptimisticComment: (state, action) => {
      const tempComment = {
        ...action.payload,
        _id: `temp_${Date.now()}`,
        isOptimistic: true,
        createdAt: new Date().toISOString()
      };
      state.comments.unshift(tempComment);
      state.optimisticUpdates.add(tempComment._id);
    },
    
    removeOptimisticComment: (state, action) => {
      state.comments = state.comments.filter(comment => comment._id !== action.payload);
      state.optimisticUpdates.delete(action.payload);
    },
    
    // Local comment updates
    updateCommentLocally: (state, action) => {
      const { commentId, updates } = action.payload;
      const comment = state.comments.find(c => c._id === commentId);
      if (comment) {
        Object.assign(comment, updates);
      }
    }
  },
  
  extraReducers: (builder) => {
    builder
      // Fetch comments
      .addCase(fetchComments.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
        
        // Reset if it's a new video or first page
        const { videoId, page } = action.meta.arg;
        if (videoId !== state.currentVideoId || page === 1) {
          state.comments = [];
          state.currentVideoId = videoId;
          state.pagination.page = 1;
        }
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.isLoading = false;
        const { docs = [], ...paginationData } = action.payload;
        const { page, videoId } = action.payload;
        
        // Update comments
        if (page === 1) {
          state.comments = docs;
        } else {
          // Filter out duplicates and append new comments
          const existingIds = new Set(state.comments.map(c => c._id));
          const newComments = docs.filter(c => !existingIds.has(c._id));
          state.comments.push(...newComments);
        }
        
        // Cache comments by video
        state.commentsByVideo[videoId] = state.comments;
        
        // Update pagination
        state.pagination = {
          page: paginationData.page || page,
          totalPages: paginationData.totalPages || 1,
          totalComments: paginationData.totalDocs || docs.length,
          hasMore: paginationData.hasNextPage || false,
          limit: paginationData.limit || 10
        };
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Add comment
      .addCase(addComment.pending, (state) => {
        state.isAdding = true;
        state.addError = null;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.isAdding = false;
        
        // Remove optimistic comment if exists
        const optimisticIndex = state.comments.findIndex(c => c.isOptimistic);
        if (optimisticIndex !== -1) {
          state.comments.splice(optimisticIndex, 1);
        }
        
        // Add real comment
        state.comments.unshift(action.payload);
        
        // Update cache
        if (state.currentVideoId) {
          state.commentsByVideo[state.currentVideoId] = state.comments;
        }
        
        // Update total count
        state.pagination.totalComments += 1;
      })
      .addCase(addComment.rejected, (state, action) => {
        state.isAdding = false;
        state.addError = action.payload;
        
        // Remove failed optimistic comment
        state.comments = state.comments.filter(c => !c.isOptimistic);
      })
      
      // Update comment
      .addCase(updateComment.pending, (state) => {
        state.isUpdating = true;
        state.updateError = null;
      })
      .addCase(updateComment.fulfilled, (state, action) => {
        state.isUpdating = false;
        const updatedComment = action.payload;
        
        // Update in main list
        const index = state.comments.findIndex(c => c._id === updatedComment._id);
        if (index !== -1) {
          state.comments[index] = { ...state.comments[index], ...updatedComment };
        }
        
        // Update cache
        if (state.currentVideoId) {
          state.commentsByVideo[state.currentVideoId] = state.comments;
        }
      })
      .addCase(updateComment.rejected, (state, action) => {
        state.isUpdating = false;
        state.updateError = action.payload;
      })
      
      // Delete comment
      .addCase(deleteComment.pending, (state) => {
        state.isDeleting = true;
        state.deleteError = null;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.isDeleting = false;
        const deletedCommentId = action.payload;
        
        // Remove from main list
        state.comments = state.comments.filter(c => c._id !== deletedCommentId);
        
        // Update cache
        if (state.currentVideoId) {
          state.commentsByVideo[state.currentVideoId] = state.comments;
        }
        
        // Update total count
        state.pagination.totalComments = Math.max(0, state.pagination.totalComments - 1);
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.isDeleting = false;
        state.deleteError = action.payload;
      })
      
      // Toggle comment like
      .addCase(toggleCommentLike.fulfilled, (state, action) => {
        const { commentId, isLiked, likesCount } = action.payload;
        const comment = state.comments.find(c => c._id === commentId);
        
        if (comment) {
          comment.isLiked = isLiked;
          comment.likesCount = likesCount;
        }
        
        // Update cache
        if (state.currentVideoId) {
          state.commentsByVideo[state.currentVideoId] = state.comments;
        }
      });
  }
});

// Export actions
export const {
  clearComments,
  clearErrors,
  clearError,
  setCurrentVideo,
  resetPagination,
  addOptimisticComment,
  removeOptimisticComment,
  updateCommentLocally
} = commentSlice.actions;

// Selectors
export const selectComments = (state) => state.comments.comments;
export const selectCommentsLoading = (state) => state.comments.isLoading;
export const selectCommentsError = (state) => state.comments.error;
export const selectCommentsPagination = (state) => state.comments.pagination;
export const selectCurrentVideoId = (state) => state.comments.currentVideoId;
export const selectIsAddingComment = (state) => state.comments.isAdding;
export const selectIsUpdatingComment = (state) => state.comments.isUpdating;
export const selectIsDeletingComment = (state) => state.comments.isDeleting;
export const selectAddCommentError = (state) => state.comments.addError;
export const selectUpdateCommentError = (state) => state.comments.updateError;
export const selectDeleteCommentError = (state) => state.comments.deleteError;

// Computed selectors
export const selectCommentById = (commentId) => (state) => 
  state.comments.comments.find(comment => comment._id === commentId);

export const selectCommentsByVideoId = (videoId) => (state) => 
  state.comments.commentsByVideo[videoId] || [];

export const selectCommentsCount = (state) => state.comments.pagination.totalComments;

export const selectHasMoreComments = (state) => state.comments.pagination.hasMore;

export const selectCommentsWithReplies = (state) => {
  const comments = state.comments.comments;
  return comments.filter(comment => !comment.parentId);
};

export const selectRepliesForComment = (commentId) => (state) => {
  return state.comments.comments.filter(comment => comment.parentId === commentId);
};

export default commentSlice.reducer;