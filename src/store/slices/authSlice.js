import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../../services/';

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      return await authService.loginService(credentials);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      return await authService.registerService(userData);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logoutService();
      return {};
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      return await authService.getCurrentUserService();
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async (userData, { rejectWithValue }) => {
    try {
      return await authService.updateUserAccountService(userData);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async (passwordData, { rejectWithValue }) => {
    try {
      return await authService.userChangePasswordService(passwordData);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      return await authService.refreshTokenService();
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Helper functions
const getFromStorage = (key) => {
  try {
    const item = localStorage.getItem(key);
    return key === 'user' ? JSON.parse(item) : item;
  } catch {
    return null;
  }
};

const saveToStorage = (data) => {
  try {
    Object.entries(data).forEach(([key, value]) => {
      if (value) {
        localStorage.setItem(key, typeof value === 'object' ? JSON.stringify(value) : value);
      }
    });
  } catch (error) {
    console.warn('Failed to save to localStorage:', error);
  }
};

const clearStorage = () => {
  try {
    ['accessToken', 'refreshToken', 'user'].forEach(key => localStorage.removeItem(key));
  } catch (error) {
    console.warn('Failed to clear localStorage:', error);
  }
};

// Initial state
const initialState = {
  user: getFromStorage('user'),
  token: getFromStorage('accessToken'),
  refreshToken: getFromStorage('refreshToken'),
  isAuthenticated: !!(getFromStorage('accessToken') && getFromStorage('user')),
  loading: false,
  error: null,
  lastActivity: null,
};

// Common state handlers
const handlePending = (state) => {
  state.loading = true;
  state.error = null;
};

const handleRejected = (state, action) => {
  state.loading = false;
  state.error = action.payload;
};

const handleAuthSuccess = (state, action) => {
  const { user, accessToken, refreshToken } = action.payload.data;
  state.loading = false;
  state.user = user;
  state.token = accessToken;
  state.refreshToken = refreshToken;
  state.isAuthenticated = true;
  state.error = null;
  state.lastActivity = Date.now();
  
  saveToStorage({ accessToken, refreshToken, user });
};

const handleAuthFailure = (state) => {
  state.user = null;
  state.token = null;
  state.refreshToken = null;
  state.isAuthenticated = false;
  state.lastActivity = null;
  clearStorage();
};

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    updateUserProfile: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        saveToStorage({ user: state.user });
      }
    },
    logout: (state) => {
      handleAuthFailure(state);
      state.loading = false;
      state.error = null;
    },
    setTokens: (state, action) => {
      const { accessToken, refreshToken, user } = action.payload;
      state.token = accessToken;
      state.refreshToken = refreshToken;
      if (user) {
        state.user = user;
        state.isAuthenticated = true;
      }
      saveToStorage({ accessToken, refreshToken, user });
    },
    updateLastActivity: (state) => {
      state.lastActivity = Date.now();
    },
    resetAuthState: () => ({ ...initialState, token: null, user: null, refreshToken: null, isAuthenticated: false }),
  },
  extraReducers: (builder) => {
    // Login & Register - same handling
    [loginUser, registerUser].forEach(thunk => {
      builder
        .addCase(thunk.pending, handlePending)
        .addCase(thunk.fulfilled, handleAuthSuccess)
        .addCase(thunk.rejected, (state, action) => {
          handleRejected(state, action);
          handleAuthFailure(state);
        });
    });

    // Logout
    builder
      .addCase(logoutUser.pending, handlePending)
      .addCase(logoutUser.fulfilled, (state) => {
        handleAuthFailure(state);
        state.loading = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        handleAuthFailure(state);
        state.loading = false;
      });

    // Get Current User
    builder
      .addCase(getCurrentUser.pending, handlePending)
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
        state.isAuthenticated = true;
        state.error = null;
        state.lastActivity = Date.now();
        saveToStorage({ user: action.payload.data });
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        handleRejected(state, action);
        handleAuthFailure(state);
      });

    // Update User
    builder
      .addCase(updateUser.pending, handlePending)
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = { ...state.user, ...action.payload.data };
        state.error = null;
        state.lastActivity = Date.now();
        saveToStorage({ user: state.user });
      })
      .addCase(updateUser.rejected, handleRejected);

    // Change Password
    builder
      .addCase(changePassword.pending, handlePending)
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        state.lastActivity = Date.now();
      })
      .addCase(changePassword.rejected, handleRejected);

    // Refresh Token
    builder
      .addCase(refreshToken.pending, handlePending)
      .addCase(refreshToken.fulfilled, (state, action) => {
        const { accessToken, user } = action.payload.data;
        state.loading = false;
        state.token = accessToken;
        if (user) state.user = user;
        state.error = null;
        state.lastActivity = Date.now();
        saveToStorage({ accessToken, user });
      })
      .addCase(refreshToken.rejected, (state, action) => {
        handleRejected(state, action);
        handleAuthFailure(state);
      });
  },
});

export const { 
  clearError, 
  setLoading, 
  updateUserProfile, 
  logout, 
  setTokens, 
  updateLastActivity, 
  resetAuthState 
} = authSlice.actions;

export default authSlice.reducer;