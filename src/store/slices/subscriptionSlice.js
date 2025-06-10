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
      return {
        channelId,
        ...response.data
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch subscribers');
    }
  }
);

// Get subscribed channels (channels user is subscribed to)
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

const initialState = {
  // Store subscription status for channels
  channelSubscriptions: {}, // { channelId: { isSubscribed: boolean, subscribersCount: number } }
  
  // User's subscriptions (channels they subscribe to)
  userSubscriptions: [],
  userSubscriptionsMeta: {
    totalDocs: 0,
    totalPages: 0,
    page: 1,
    hasNextPage: false,
    hasPrevPage: false
  },
  
  // Channel subscribers data
  channelSubscribers: {}, // { channelId: { subscribers: [], meta: {} } }
  
  // Subscribed channels data
  subscribedChannels: [],
  subscribedChannelsMeta: {
    totalDocs: 0,
    totalPages: 0,
    page: 1,
    hasNextPage: false,
    hasPrevPage: false
  },
  
  // Loading states
  loading: {
    toggle: false,
    fetchSubscriptions: false,
    fetchSubscribers: false,
    fetchSubscribedChannels: false
  },
  
  // Error states
  error: {
    toggle: null,
    fetchSubscriptions: null,
    fetchSubscribers: null,
    fetchSubscribedChannels: null
  }
};

const subscriptionSlice = createSlice({
  name: 'subscriptions',
  initialState,
  reducers: {
    // Clear all subscription data (useful for logout)
    clearSubscriptionData: (state) => {
      state.channelSubscriptions = {};
      state.userSubscriptions = [];
      state.userSubscriptionsMeta = initialState.userSubscriptionsMeta;
      state.channelSubscribers = {};
      state.subscribedChannels = [];
      state.subscribedChannelsMeta = initialState.subscribedChannelsMeta;
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
      if (state.error[errorType]) {
        state.error[errorType] = null;
      }
    },
    
    // Remove channel from subscriptions (optimistic update)
    removeFromSubscriptions: (state, action) => {
      const channelId = action.payload;
      state.userSubscriptions = state.userSubscriptions.filter(
        subscription => subscription.channel._id !== channelId
      );
    }
  },
  extraReducers: (builder) => {
    builder
      // Toggle Subscription
      .addCase(toggleSubscription.pending, (state) => {
        state.loading.toggle = true;
        state.error.toggle = null;
      })
      .addCase(toggleSubscription.fulfilled, (state, action) => {
        state.loading.toggle = false;
        const { channelId, isSubscribed, subscribersCount } = action.payload;
        
        // Update subscription status
        state.channelSubscriptions[channelId] = { isSubscribed, subscribersCount };
        
        // Update user subscriptions list
        if (!isSubscribed) {
          // Remove from subscriptions if unsubscribed
          state.userSubscriptions = state.userSubscriptions.filter(
            subscription => subscription.channel._id !== channelId
          );
        }
      })
      .addCase(toggleSubscription.rejected, (state, action) => {
        state.loading.toggle = false;
        state.error.toggle = action.payload;
      })
      
      // Get User Subscriptions
      .addCase(getUserSubscriptions.pending, (state) => {
        state.loading.fetchSubscriptions = true;
        state.error.fetchSubscriptions = null;
      })
      .addCase(getUserSubscriptions.fulfilled, (state, action) => {
        state.loading.fetchSubscriptions = false;
        const { docs, ...meta } = action.payload;
        
        if (meta.page === 1) {
          state.userSubscriptions = docs;
        } else {
          state.userSubscriptions = [...state.userSubscriptions, ...docs];
        }
        
        state.userSubscriptionsMeta = meta;
        
        // Update channel subscription status from fetched data
        docs.forEach(subscription => {
          state.channelSubscriptions[subscription.channel._id] = {
            isSubscribed: true,
            subscribersCount: subscription.channel.subscribersCount
          };
        });
      })
      .addCase(getUserSubscriptions.rejected, (state, action) => {
        state.loading.fetchSubscriptions = false;
        state.error.fetchSubscriptions = action.payload;
      })
      
      // Get Channel Subscribers
      .addCase(getChannelSubscribers.pending, (state) => {
        state.loading.fetchSubscribers = true;
        state.error.fetchSubscribers = null;
      })
      .addCase(getChannelSubscribers.fulfilled, (state, action) => {
        state.loading.fetchSubscribers = false;
        const { channelId, docs, ...meta } = action.payload;
        
        if (!state.channelSubscribers[channelId]) {
          state.channelSubscribers[channelId] = { subscribers: [], meta: {} };
        }
        
        if (meta.page === 1) {
          state.channelSubscribers[channelId].subscribers = docs;
        } else {
          state.channelSubscribers[channelId].subscribers = [
            ...state.channelSubscribers[channelId].subscribers,
            ...docs
          ];
        }
        
        state.channelSubscribers[channelId].meta = meta;
      })
      .addCase(getChannelSubscribers.rejected, (state, action) => {
        state.loading.fetchSubscribers = false;
        state.error.fetchSubscribers = action.payload;
      })
      
      // Get Subscribed Channels
      .addCase(getSubscribedChannels.pending, (state) => {
        state.loading.fetchSubscribedChannels = true;
        state.error.fetchSubscribedChannels = null;
      })
      .addCase(getSubscribedChannels.fulfilled, (state, action) => {
        state.loading.fetchSubscribedChannels = false;
        const { docs, ...meta } = action.payload;
        
        if (meta.page === 1) {
          state.subscribedChannels = docs;
        } else {
          state.subscribedChannels = [...state.subscribedChannels, ...docs];
        }
        
        state.subscribedChannelsMeta = meta;
        
        // Update channel subscription status
        docs.forEach(channel => {
          state.channelSubscriptions[channel._id] = {
            isSubscribed: true,
            subscribersCount: channel.subscribersCount
          };
        });
      })
      .addCase(getSubscribedChannels.rejected, (state, action) => {
        state.loading.fetchSubscribedChannels = false;
        state.error.fetchSubscribedChannels = action.payload;
      });
  }
});

// Action creators
export const {
  clearSubscriptionData,
  setChannelSubscriptionStatus,
  updateSubscribersCount,
  clearError,
  removeFromSubscriptions
} = subscriptionSlice.actions;

// Selectors
export const selectChannelSubscriptionStatus = (state, channelId) => 
  state.subscriptions.channelSubscriptions[channelId] || { isSubscribed: false, subscribersCount: 0 };

export const selectUserSubscriptions = (state) => state.subscriptions.userSubscriptions;
export const selectUserSubscriptionsMeta = (state) => state.subscriptions.userSubscriptionsMeta;

export const selectChannelSubscribers = (state, channelId) => 
  state.subscriptions.channelSubscribers[channelId] || { subscribers: [], meta: {} };

export const selectSubscribedChannels = (state) => state.subscriptions.subscribedChannels;
export const selectSubscribedChannelsMeta = (state) => state.subscriptions.subscribedChannelsMeta;

export const selectSubscriptionLoading = (state) => state.subscriptions.loading;
export const selectSubscriptionErrors = (state) => state.subscriptions.error;

// Utility selectors
export const selectIsSubscribedToChannel = (state, channelId) => 
  state.subscriptions.channelSubscriptions[channelId]?.isSubscribed || false;

export const selectChannelSubscribersCount = (state, channelId) => 
  state.subscriptions.channelSubscriptions[channelId]?.subscribersCount || 0;

export default subscriptionSlice.reducer;