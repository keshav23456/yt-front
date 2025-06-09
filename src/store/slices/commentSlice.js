// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { commentService } from '../../services';
// import { LOADING_STATES } from '../../utils/constants';

// const initialState = {
//   comments: [],
//   loading: LOADING_STATES.IDLE,
//   error: null,
//   addingComment: LOADING_STATES.IDLE,
//   updatingComment: LOADING_STATES.IDLE
// };

// // Async thunks
// export const getVideoComments = createAsyncThunk(
//   'comment/getVideoComments',
//   async (videoId, { rejectWithValue }) => {
//     try {
//       const response = await commentService.getVideoComments(videoId);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to fetch comments');
//     }
//   }
// );

// export const addComment = createAsyncThunk(
//   'comment/addComment',
//   async ({ videoId, content }, { rejectWithValue }) => {
//     try {
//       const response = await commentService.addComment(videoId, { content });
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to add comment');
//     }
//   }
// );

// export const updateComment = createAsyncThunk(
//   'comment/updateComment',
//   async ({ commentId, content }, { rejectWithValue }) => {
//     try {
//       const response = await commentService.updateComment(commentId, { content });
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to update comment');
//     }
//   }
// );

// export const deleteComment = createAsyncThunk(
//   'comment/deleteComment',
//   async (commentId, { rejectWithValue }) => {
//     try {
//       await commentService.deleteComment(commentId);
//       return commentId;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to delete comment');
//     }
//   }
// );

// const commentSlice = createSlice({
//   name: 'comment',
//   initialState,
//   reducers: {
//     clearCommentError: (state) => {
//       state.error = null;
//     },
//     clearComments: (state) => {
//       state.comments = [];
//     }
//   },
//   extraReducers: (builder) => {
//     builder
//       // Get Video Comments
//       .addCase(getVideoComments.pending, (state) => {
//         state.loading = LOADING_STATES.PENDING;
//         state.error = null;
//       })
//       .addCase(getVideoComments.fulfilled, (state, action) => {
//         state.loading = LOADING_STATES.FULFILLED;
//         state.comments = action.payload.comments;
//       })
//       .addCase(getVideoComments.rejected, (state, action) => {
//         state.loading = LOADING_STATES.REJECTED;
//         state.error = action.payload;
//       })
//       // Add Comment
//       .addCase(addComment.pending, (state) => {
//         state.addingComment = LOADING_STATES.PENDING;
//         state.error = null;
//       })
//       .addCase(addComment.fulfilled, (state, action) => {
//         state.addingComment = LOADING_STATES.FULFILLED;
//         state.comments.unshift(action.payload.comment);
//       })
//       .addCase(addComment.rejected, (state, action) => {
//         state.addingComment = LOADING_STATES.REJECTED;
//         state.error = action.payload;
//       })
//       // Update Comment
//       .addCase(updateComment.pending, (state) => {
//         state.updatingComment = LOADING_STATES.PENDING;
//         state.error = null;
//       })
//       .addCase(updateComment.fulfilled, (state, action) => {
//         state.updatingComment = LOADING_STATES.FULFILLED;
//         const index = state.comments.findIndex(c => c._id === action.payload.comment._id);
//         if (index !== -1) {
//           state.comments[index] = action.payload.comment;
//         }
//       })
//       .addCase(updateComment.rejected, (state, action) => {
//         state.updatingComment = LOADING_STATES.REJECTED;
//         state.error = action.payload;
//       })
//       // Delete Comment
//       .addCase(deleteComment.fulfilled, (state, action) => {
//         state.comments = state.comments.filter(c => c._id !== action.payload);
//       });
//   }
// });

// export const { clearCommentError, clearComments } = commentSlice.actions;
// export default commentSlice.reducer;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { commentService } from '../../services';
// Async thunks
export const fetchComments = createAsyncThunk(
  'comments/fetchComments',
  async (videoId, { rejectWithValue }) => {
    try {
      const response = await commentService.getVideoComments(videoId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch comments');
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
      return rejectWithValue(error.response?.data?.message || 'Failed to add comment');
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
      return rejectWithValue(error.response?.data?.message || 'Failed to update comment');
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
      return rejectWithValue(error.response?.data?.message || 'Failed to delete comment');
    }
  }
);

const initialState = {
  comments: [],
  loading: false,
  error: null,
  hasMore: true,
  page: 1
};

const commentSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    clearComments: (state) => {
      state.comments = [];
      state.page = 1;
      state.hasMore = true;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch comments
      .addCase(fetchComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.loading = false;
        if (action.meta.arg.page === 1) {
          state.comments = action.payload.docs || [];
        } else {
          state.comments = [...state.comments, ...(action.payload.docs || [])];
        }
        state.hasMore = action.payload.hasNextPage || false;
        state.page = action.payload.page || 1;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Add comment
      .addCase(addComment.fulfilled, (state, action) => {
        state.comments.unshift(action.payload);
      })
      
      // Update comment
      .addCase(updateComment.fulfilled, (state, action) => {
        const index = state.comments.findIndex(comment => comment._id === action.payload._id);
        if (index !== -1) {
          state.comments[index] = action.payload;
        }
      })
      
      // Delete comment
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.comments = state.comments.filter(comment => comment._id !== action.payload);
      });
  }
});

export const { clearComments, clearError } = commentSlice.actions;
export default commentSlice.reducer;