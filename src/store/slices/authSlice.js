// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { authService } from '../../services';
// import { LOADING_STATES } from '../../utils/constants';

// // Initial state
// const initialState = {
//   user: null,
//   token: null,
//   refreshToken: null,
//   isAuthenticated: false,
//   loading: LOADING_STATES.IDLE,
//   error: null,
//   registrationStep: 1,
//   passwordResetEmail: null
// };

// // Async thunks
// export const login = createAsyncThunk(
//   'auth/login',
//   async (credentials, { rejectWithValue }) => {
//     try {
//       const response = await authService.login(credentials);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Login failed');
//     }
//   }
// );

// export const register = createAsyncThunk(
//   'auth/register',
//   async (userData, { rejectWithValue }) => {
//     try {
//       const response = await authService.register(userData);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Registration failed');
//     }
//   }
// );

// export const logout = createAsyncThunk(
//   'auth/logout',
//   async (_, { rejectWithValue }) => {
//     try {
//       await authService.logout();
//       return true;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Logout failed');
//     }
//   }
// );

// export const refreshToken = createAsyncThunk(
//   'auth/refreshToken',
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await authService.refreshToken();
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Token refresh failed');
//     }
//   }
// );

// export const getCurrentUser = createAsyncThunk(
//   'auth/getCurrentUser',
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await authService.getCurrentUser();
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to get user');
//     }
//   }
// );

// export const changePassword = createAsyncThunk(
//   'auth/changePassword',
//   async (passwordData, { rejectWithValue }) => {
//     try {
//       const response = await authService.changePassword(passwordData);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Password change failed');
//     }
//   }
// );

// // Auth slice
// const authSlice = createSlice({
//   name: 'auth',
//   initialState,
//   reducers: {
//     clearError: (state) => {
//       state.error = null;
//     },
//     setRegistrationStep: (state, action) => {
//       state.registrationStep = action.payload;
//     },
//     setPasswordResetEmail: (state, action) => {
//       state.passwordResetEmail = action.payload;
//     },
//     clearAuth: (state) => {
//       state.user = null;
//       state.token = null;
//       state.refreshToken = null;
//       state.isAuthenticated = false;
//       state.error = null;
//     }
//   },
//   extraReducers: (builder) => {
//     builder
//       // Login
//       .addCase(login.pending, (state) => {
//         state.loading = LOADING_STATES.PENDING;
//         state.error = null;
//       })
//       .addCase(login.fulfilled, (state, action) => {
//         state.loading = LOADING_STATES.FULFILLED;
//         state.user = action.payload.user;
//         state.token = action.payload.accessToken;
//         state.refreshToken = action.payload.refreshToken;
//         state.isAuthenticated = true;
//         state.error = null;
//       })
//       .addCase(login.rejected, (state, action) => {
//         state.loading = LOADING_STATES.REJECTED;
//         state.error = action.payload;
//         state.isAuthenticated = false;
//       })
//       // Register
//       .addCase(register.pending, (state) => {
//         state.loading = LOADING_STATES.PENDING;
//         state.error = null;
//       })
//       .addCase(register.fulfilled, (state, action) => {
//         state.loading = LOADING_STATES.FULFILLED;
//         state.user = action.payload.user;
//         state.token = action.payload.accessToken;
//         state.refreshToken = action.payload.refreshToken;
//         state.isAuthenticated = true;
//         state.error = null;
//       })
//       .addCase(register.rejected, (state, action) => {
//         state.loading = LOADING_STATES.REJECTED;
//         state.error = action.payload;
//       })
//       // Logout
//       .addCase(logout.fulfilled, (state) => {
//         state.user = null;
//         state.token = null;
//         state.refreshToken = null;
//         state.isAuthenticated = false;
//         state.loading = LOADING_STATES.IDLE;
//         state.error = null;
//       })
//       // Refresh Token
//       .addCase(refreshToken.fulfilled, (state, action) => {
//         state.token = action.payload.accessToken;
//         state.refreshToken = action.payload.refreshToken;
//       })
//       // Get Current User
//       .addCase(getCurrentUser.fulfilled, (state, action) => {
//         state.user = action.payload.user;
//         state.isAuthenticated = true;
//       })
//       // Change Password
//       .addCase(changePassword.pending, (state) => {
//         state.loading = LOADING_STATES.PENDING;
//         state.error = null;
//       })
//       .addCase(changePassword.fulfilled, (state) => {
//         state.loading = LOADING_STATES.FULFILLED;
//         state.error = null;
//       })
//       .addCase(changePassword.rejected, (state, action) => {
//         state.loading = LOADING_STATES.REJECTED;
//         state.error = action.payload;
//       });
//   }
// });
// export const { clearError, setRegistrationStep, setPasswordResetEmail, clearAuth } = authSlice.actions;
// export default authSlice.reducer;


import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../../services';

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authService.register(userData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
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
      const response = await authService.getCurrentUser();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authService.updateAccount(userData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async (passwordData, { rejectWithValue }) => {
    try {
      const response = await authService.changePassword(passwordData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Initial state
const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  isLoading: false,
  error: null,
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
      state.isLoading = action.payload;
    },
    updateUserProfile: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.accessToken;
        state.isAuthenticated = true;
        state.error = null;
        if (action.payload.accessToken) {
          localStorage.setItem('token', action.payload.accessToken);
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.accessToken;
        state.isAuthenticated = true;
        state.error = null;
        if (action.payload.accessToken) {
          localStorage.setItem('token', action.payload.accessToken);
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      
      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
        localStorage.removeItem('token');
      })
      .addCase(logoutUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        localStorage.removeItem('token');
      })
      
      // Get Current User
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        localStorage.removeItem('token');
      })
      
      // Update User
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = { ...state.user, ...action.payload };
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Change Password
      .addCase(changePassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, setLoading, updateUserProfile, logout } = authSlice.actions;

export default authSlice.reducer;