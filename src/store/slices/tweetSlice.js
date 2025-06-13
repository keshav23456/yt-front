import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { tweetService } from '../../services';
import { LOADING_STATES, ERROR_MESSAGES } from '../../utils/constants';

const initialState = {
  tweets: [],
  userTweets: [],
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  error: null
};

// Helper for consistent error handling
const handleError = (error) => {
  return error.response?.data?.message || error.message || ERROR_MESSAGES.SERVER_ERROR;
};

// Async thunks
export const createTweet = createAsyncThunk(
  'tweet/createTweet',
  async (tweetData, { rejectWithValue }) => {
    try {
      const response = await tweetService.createTweet(tweetData);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

export const getUserTweets = createAsyncThunk(
  'tweet/getUserTweets',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await tweetService.getUserTweets(userId);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

export const updateTweet = createAsyncThunk(
  'tweet/updateTweet',
  async ({ tweetId, content }, { rejectWithValue }) => {
    try {
      const response = await tweetService.updateTweet(tweetId, { content });
      return response.data;
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

export const deleteTweet = createAsyncThunk(
  'tweet/deleteTweet',
  async (tweetId, { rejectWithValue }) => {
    try {
      await tweetService.deleteTweet(tweetId);
      return tweetId;
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

// Helper for updating tweets in arrays
const updateTweetInState = (state, updatedTweet) => {
  const updateArray = (array) => {
    const index = array.findIndex(t => t._id === updatedTweet._id);
    if (index !== -1) array[index] = updatedTweet;
  };
  updateArray(state.tweets);
  updateArray(state.userTweets);
};

const tweetSlice = createSlice({
  name: 'tweet',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearTweets: (state) => {
      state.tweets = [];
      state.userTweets = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Create Tweet
      .addCase(createTweet.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createTweet.fulfilled, (state, action) => {
        state.isCreating = false;
        const tweet = action.payload.tweet || action.payload;
        state.tweets.unshift(tweet);
        state.userTweets.unshift(tweet);
      })
      .addCase(createTweet.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload;
      })
      
      // Get User Tweets
      .addCase(getUserTweets.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserTweets.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userTweets = action.payload.tweets || action.payload;
      })
      .addCase(getUserTweets.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Update Tweet
      .addCase(updateTweet.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateTweet.fulfilled, (state, action) => {
        state.isUpdating = false;
        const tweet = action.payload.tweet || action.payload;
        updateTweetInState(state, tweet);
      })
      .addCase(updateTweet.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload;
      })
      
      // Delete Tweet
      .addCase(deleteTweet.fulfilled, (state, action) => {
        const tweetId = action.payload;
        state.tweets = state.tweets.filter(t => t._id !== tweetId);
        state.userTweets = state.userTweets.filter(t => t._id !== tweetId);
      });
  }
});

export const { clearError, clearTweets } = tweetSlice.actions;
export default tweetSlice.reducer;