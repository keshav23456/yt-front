import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { tweetService } from '../../services';
import { LOADING_STATES } from '../../utils/constants';

const initialState = {
  tweets: [],
  userTweets: [],
  loading: LOADING_STATES.IDLE,
  error: null,
  creating: LOADING_STATES.IDLE,
  updating: LOADING_STATES.IDLE
};

// Async thunks
export const createTweet = createAsyncThunk(
  'tweet/createTweet',
  async (tweetData, { rejectWithValue }) => {
    try {
      const response = await tweetService.createTweet(tweetData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create tweet');
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
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch tweets');
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
      return rejectWithValue(error.response?.data?.message || 'Failed to update tweet');
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
      return rejectWithValue(error.response?.data?.message || 'Failed to delete tweet');
    }
  }
);

const tweetSlice = createSlice({
  name: 'tweet',
  initialState,
  reducers: {
    clearTweetError: (state) => {
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
        state.creating = LOADING_STATES.PENDING;
        state.error = null;
      })
      .addCase(createTweet.fulfilled, (state, action) => {
        state.creating = LOADING_STATES.FULFILLED;
        state.tweets.unshift(action.payload.tweet);
        state.userTweets.unshift(action.payload.tweet);
      })
      .addCase(createTweet.rejected, (state, action) => {
        state.creating = LOADING_STATES.REJECTED;
        state.error = action.payload;
      })
      // Get User Tweets
      .addCase(getUserTweets.pending, (state) => {
        state.loading = LOADING_STATES.PENDING;
        state.error = null;
      })
      .addCase(getUserTweets.fulfilled, (state, action) => {
        state.loading = LOADING_STATES.FULFILLED;
        state.userTweets = action.payload.tweets;
      })
      .addCase(getUserTweets.rejected, (state, action) => {
        state.loading = LOADING_STATES.REJECTED;
        state.error = action.payload;
      })
      // Update Tweet
      .addCase(updateTweet.pending, (state) => {
        state.updating = LOADING_STATES.PENDING;
        state.error = null;
      })
      .addCase(updateTweet.fulfilled, (state, action) => {
        state.updating = LOADING_STATES.FULFILLED;
        const tweetIndex = state.tweets.findIndex(t => t._id === action.payload.tweet._id);
        if (tweetIndex !== -1) {
          state.tweets[tweetIndex] = action.payload.tweet;
        }
        const userTweetIndex = state.userTweets.findIndex(t => t._id === action.payload.tweet._id);
        if (userTweetIndex !== -1) {
          state.userTweets[userTweetIndex] = action.payload.tweet;
        }
      })
      .addCase(updateTweet.rejected, (state, action) => {
        state.updating = LOADING_STATES.REJECTED;
        state.error = action.payload;
      })
      // Delete Tweet
      .addCase(deleteTweet.fulfilled, (state, action) => {
        state.tweets = state.tweets.filter(t => t._id !== action.payload);
        state.userTweets = state.userTweets.filter(t => t._id !== action.payload);
      });
  }
});

export const { clearTweetError, clearTweets } = tweetSlice.actions;
export default tweetSlice.reducer;