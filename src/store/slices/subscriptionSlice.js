// src/store/slices/subscriptionSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { subscriptionService } from '../../services';

// Async thunks for API calls
export const toggleSubscription = createAsyncThunk(
  'subscriptions/toggleSubscription',
  async (channelId, { rejectWithValue }) => {
    try {
      const response = await subscriptionService.toggleSubscription(channelId);
      return {
        channelId,
        isSubscribed: response.data.isSubscribed,
        subscribersCount: response.data.subscribersCount
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to toggle subscription');
    }
  }
);

// Get user's subscriptions
export const getUserSubscriptions = createAsyncThunk(
  'subscriptions/getUserSubscriptions',
  async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      const response = await subscriptionService.getUserSubscriptions(page, limit);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch subscriptions');
    }
  }
);

// Get channel subscribers
export const getChannelSubscribers = createAsyncThunk(
  'subscriptions/getChannelSubscribers',
  async ({ channelId, page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await subscriptionService.getChannelSubscribers(channelId, page, limit);
      return { channelId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch subscribers');
    }
  }
);

// Get subscribed channels
export const getSubscribedChannels = createAsyncThunk(
  'subscriptions/getSubscribedChannels',
  async ({ subscriberId, page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await subscriptionService.getSubscribedChannels(subscriberId, page, limit);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch subscribed channels');
    }
  }
);

const createInitialMeta = () => ({
  totalDocs: 0,
  totalPages: 0,
  page: 1,
  hasNextPage: false,
  hasPrevPage: false
});

const initialState = {
  // Store subscription status for channels
  channelSubscriptions: {}, // { channelId: { isSubscribed: boolean, subscribersCount: number } }
  
  // User's subscriptions (channels they subscribe to)
  userSubscriptions: [],
  userSubscriptionsMeta: createInitialMeta(),
  
  // Channel subscribers data
  channelSubscribers: {}, // { channelId: { subscribers: [], meta: {} } }
  
  // Subscribed channels data
  subscribedChannels: [],
  subscribedChannelsMeta: createInitialMeta(),
  
  // Consistent loading states using isLoading prefix
  isLoading: {
    toggle: false,
    userSubscriptions: false,
    channelSubscribers: false,
    subscribedChannels: false
  },
  
  // Consistent error states
  errors: {
    toggle: null,
    userSubscriptions: null,
    channelSubscribers: null,
    subscribedChannels: null
  }
};

const subscriptionSlice = createSlice({
  name: 'subscriptions',
  initialState,
  reducers: {
    // Clear all subscription data (useful for logout)
    clearSubscriptionData: (state) => {
      Object.assign(state, {
        channelSubscriptions: {},
        userSubscriptions: [],
        userSubscriptionsMeta: createInitialMeta(),
        channelSubscribers: {},
        subscribedChannels: [],
        subscribedChannelsMeta: createInitialMeta()
      });
    },
    
    // Set initial subscription status for a channel
    setChannelSubscriptionStatus: (state, action) => {
      const { channelId, isSubscribed, subscribersCount } = action.payload;
      state.channelSubscriptions[channelId] = { isSubscribed, subscribersCount };
    },
    
    // Update subscribers count for a channel
    updateSubscribersCount: (state, action) => {
      const { channelId, subscribersCount } = action.payload;
      if (state.channelSubscriptions[channelId]) {
        state.channelSubscriptions[channelId].subscribersCount = subscribersCount;
      }
    },
    
    // Clear specific errors
    clearError: (state, action) => {
      const errorType = action.payload;
      if (state.errors[errorType] !== undefined) {
        state.errors[errorType] = null;
      }
    },
    
    // Clear all errors
    clearAllErrors: (state) => {
      Object.keys(state.errors).forEach(key => {
        state.errors[key] = null;
      });
    },
    
    // Remove channel from subscriptions (optimistic update)
    removeFromSubscriptions: (state, action) => {
      const channelId = action.payload;
      state.userSubscriptions = state.userSubscriptions.filter(
        subscription => subscription.channel?._id !== channelId
      );
    },
    
    // Reset pagination for a specific list
    resetPagination: (state, action) => {
      const { type } = action.payload;
      if (type === 'userSubscriptions') {
        state.userSubscriptionsMeta = createInitialMeta();
      } else if (type === 'subscribedChannels') {
        state.subscribedChannelsMeta = createInitialMeta();
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Toggle Subscription
      .addCase(toggleSubscription.pending, (state) => {
        state.isLoading.toggle = true;
        state.errors.toggle = null;
      })
      .addCase(toggleSubscription.fulfilled, (state, action) => {
        state.isLoading.toggle = false;
        const { channelId, isSubscribed, subscribersCount } = action.payload;
        
        // Update subscription status
        state.channelSubscriptions[channelId] = { isSubscribed, subscribersCount };
        
        // Update user subscriptions list if unsubscribed
        if (!isSubscribed) {
          state.userSubscriptions = state.userSubscriptions.filter(
            subscription => subscription.channel?._id !== channelId
          );
        }
      })
      .addCase(toggleSubscription.rejected, (state, action) => {
        state.isLoading.toggle = false;
        state.errors.toggle = action.payload;
      })
      
      // Get User Subscriptions
      .addCase(getUserSubscriptions.pending, (state) => {
        state.isLoading.userSubscriptions = true;
        state.errors.userSubscriptions = null;
      })
      .addCase(getUserSubscriptions.fulfilled, (state, action) => {
        state.isLoading.userSubscriptions = false;
        const { docs = [], ...meta } = action.payload;
        
        // Replace or append based on page number
        state.userSubscriptions = meta.page === 1 
          ? docs 
          : [...state.userSubscriptions, ...docs];
        
        state.userSubscriptionsMeta = meta;
        
        // Update channel subscription status from fetched data
        docs.forEach(subscription => {
          if (subscription.channel?._id) {
            state.channelSubscriptions[subscription.channel._id] = {
              isSubscribed: true,
              subscribersCount: subscription.channel.subscribersCount || 0
            };
          }
        });
      })
      .addCase(getUserSubscriptions.rejected, (state, action) => {
        state.isLoading.userSubscriptions = false;
        state.errors.userSubscriptions = action.payload;
      })
      
      // Get Channel Subscribers
      .addCase(getChannelSubscribers.pending, (state) => {
        state.isLoading.channelSubscribers = true;
        state.errors.channelSubscribers = null;
      })
      .addCase(getChannelSubscribers.fulfilled, (state, action) => {
        state.isLoading.channelSubscribers = false;
        const { channelId, docs = [], ...meta } = action.payload;
        
        // Initialize channel subscribers if not exists
        if (!state.channelSubscribers[channelId]) {
          state.channelSubscribers[channelId] = { subscribers: [], meta: {} };
        }
        
        // Replace or append based on page number
        const channelData = state.channelSubscribers[channelId];
        channelData.subscribers = meta.page === 1 
          ? docs 
          : [...channelData.subscribers, ...docs];
        channelData.meta = meta;
      })
      .addCase(getChannelSubscribers.rejected, (state, action) => {
        state.isLoading.channelSubscribers = false;
        state.errors.channelSubscribers = action.payload;
      })
      
      // Get Subscribed Channels
      .addCase(getSubscribedChannels.pending, (state) => {
        state.isLoading.subscribedChannels = true;
        state.errors.subscribedChannels = null;
      })
      .addCase(getSubscribedChannels.fulfilled, (state, action) => {
        state.isLoading.subscribedChannels = false;
        const { docs = [], ...meta } = action.payload;
        
        // Replace or append based on page number
        state.subscribedChannels = meta.page === 1 
          ? docs 
          : [...state.subscribedChannels, ...docs];
        
        state.subscribedChannelsMeta = meta;
        
        // Update channel subscription status
        docs.forEach(channel => {
          if (channel._id) {
            state.channelSubscriptions[channel._id] = {
              isSubscribed: true,
              subscribersCount: channel.subscribersCount || 0
            };
          }
        });
      })
      .addCase(getSubscribedChannels.rejected, (state, action) => {
        state.isLoading.subscribedChannels = false;
        state.errors.subscribedChannels = action.payload;
      });
  }
});

// Action creators
export const {
  clearSubscriptionData,
  setChannelSubscriptionStatus,
  updateSubscribersCount,
  clearError,
  clearAllErrors,
  removeFromSubscriptions,
  resetPagination
} = subscriptionSlice.actions;

// Memoized selectors
export const selectChannelSubscriptionStatus = (state, channelId) => 
  state.subscriptions.channelSubscriptions[channelId] || { isSubscribed: false, subscribersCount: 0 };

export const selectUserSubscriptions = (state) => state.subscriptions.userSubscriptions;
export const selectUserSubscriptionsMeta = (state) => state.subscriptions.userSubscriptionsMeta;

export const selectChannelSubscribers = (state, channelId) => 
  state.subscriptions.channelSubscribers[channelId] || { subscribers: [], meta: createInitialMeta() };

export const selectSubscribedChannels = (state) => state.subscriptions.subscribedChannels;
export const selectSubscribedChannelsMeta = (state) => state.subscriptions.subscribedChannelsMeta;

export const selectSubscriptionLoading = (state) => state.subscriptions.isLoading;
export const selectSubscriptionErrors = (state) => state.subscriptions.errors;

// Utility selectors
export const selectIsSubscribedToChannel = (state, channelId) => 
  state.subscriptions.channelSubscriptions[channelId]?.isSubscribed || false;

export const selectChannelSubscribersCount = (state, channelId) => 
  state.subscriptions.channelSubscriptions[channelId]?.subscribersCount || 0;

// Enhanced selectors
export const selectHasSubscriptionError = (state) => 
  Object.values(state.subscriptions.errors).some(error => error !== null);

export const selectSubscriptionLoadingState = (state) => 
  Object.values(state.subscriptions.isLoading).some(loading => loading === true);

export const selectUserSubscriptionIds = (state) => 
  state.subscriptions.userSubscriptions.map(sub => sub.channel?._id).filter(Boolean);

export default subscriptionSlice.reducer;