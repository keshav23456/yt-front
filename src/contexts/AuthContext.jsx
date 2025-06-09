import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';

import { refreshToken as refreshTokenService, getCurrentUser, login as loginService, register as registerService, logout as logoutService } from '../services/auth.service';

// Initial state
const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  isInitialized: false
};

// Action types
const AUTH_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_INITIALIZED: 'SET_INITIALIZED',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  SET_USER: 'SET_USER',
  UPDATE_USER: 'UPDATE_USER',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_ERROR: 'SET_ERROR',
  REFRESH_TOKEN_SUCCESS: 'REFRESH_TOKEN_SUCCESS',
  REFRESH_TOKEN_FAILURE: 'REFRESH_TOKEN_FAILURE'
};

// Auth reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };

    case AUTH_ACTIONS.SET_INITIALIZED:
      return {
        ...state,
        isInitialized: action.payload,
        isLoading: false
      };

    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        isInitialized: true
      };

    case AUTH_ACTIONS.LOGIN_FAILURE:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
        isInitialized: true
      };

    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        isInitialized: true
      };

    case AUTH_ACTIONS.SET_USER:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token || state.token,
        isAuthenticated: !!action.payload.user,
        isLoading: false,
        error: null,
        isInitialized: true
      };

    case AUTH_ACTIONS.UPDATE_USER:
      return {
        ...state,
        user: state.user ? {
          ...state.user,
          ...action.payload
        } : null
      };

    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };

    case AUTH_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    case AUTH_ACTIONS.REFRESH_TOKEN_SUCCESS:
      return {
        ...state,
        token: action.payload.token,
        user: action.payload.user || state.user,
        isAuthenticated: true,
        error: null
      };

    case AUTH_ACTIONS.REFRESH_TOKEN_FAILURE:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        error: action.payload
      };

    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Memoized token refresh function
  const handleRefreshToken = useCallback(async () => {
    try {
      const response = await refreshTokenService();
      
      if (response.success) {
        dispatch({
          type: AUTH_ACTIONS.REFRESH_TOKEN_SUCCESS,
          payload: {
            user: response.data.user,
            token: response.data.accessToken
          }
        });
        return true;
      } else {
        dispatch({ 
          type: AUTH_ACTIONS.REFRESH_TOKEN_FAILURE, 
          payload: response.message || 'Token refresh failed'
        });
        return false;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      dispatch({ 
        type: AUTH_ACTIONS.REFRESH_TOKEN_FAILURE, 
        payload: error.message || 'Token refresh failed'
      });
      return false;
    }
  }, []);

  // Check authentication status on mount
  const checkAuthStatus = useCallback(async () => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      
      // Check for stored token
      const storedToken = localStorage.getItem('accessToken') || 
                         (document.cookie.match(/accessToken=([^;]+)/) || [])[1];
      
      if (!storedToken) {
        dispatch({ type: AUTH_ACTIONS.SET_INITIALIZED, payload: true });
        return;
      }

      // Verify token with backend
      const response = await getCurrentUser();
      
      if (response.success) {
        dispatch({ 
          type: AUTH_ACTIONS.SET_USER, 
          payload: { 
            user: response.data,
            token: storedToken
          }
        });
      } else {
        // Try to refresh token if getCurrentUser fails
        const refreshSuccess = await handleRefreshToken();
        if (!refreshSuccess) {
          // Clear invalid tokens
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          dispatch({ type: AUTH_ACTIONS.SET_INITIALIZED, payload: true });
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // Try token refresh on error
      const refreshSuccess = await handleRefreshToken();
      if (!refreshSuccess) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        dispatch({ type: AUTH_ACTIONS.SET_INITIALIZED, payload: true });
      }
    }
  }, [handleRefreshToken]);

  // Initialize auth on mount
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  // Login function
  const login = async (credentials) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

      const response = await loginService(credentials);
      
      if (response.success) {
        const { user, accessToken } = response.data;
        
        dispatch({ 
          type: AUTH_ACTIONS.LOGIN_SUCCESS, 
          payload: {
            user,
            token: accessToken
          }
        });
        
        return { success: true, data: response.data };
      } else {
        dispatch({ 
          type: AUTH_ACTIONS.LOGIN_FAILURE, 
          payload: response.message || 'Login failed' 
        });
        return { success: false, message: response.message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Login failed. Please try again.';
      dispatch({ 
        type: AUTH_ACTIONS.LOGIN_FAILURE, 
        payload: errorMessage 
      });
      return { success: false, message: errorMessage };
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

      const response = await registerService(userData);
      
      if (response.success) {
        const { user, accessToken } = response.data;
        
        dispatch({ 
          type: AUTH_ACTIONS.LOGIN_SUCCESS, 
          payload: {
            user,
            token: accessToken
          }
        });
        
        return { success: true, data: response.data };
      } else {
        dispatch({ 
          type: AUTH_ACTIONS.SET_ERROR, 
          payload: response.message || 'Registration failed' 
        });
        return { success: false, message: response.message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Registration failed. Please try again.';
      dispatch({ 
        type: AUTH_ACTIONS.SET_ERROR, 
        payload: errorMessage 
      });
      return { success: false, message: errorMessage };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await logoutService();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear stored tokens
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      
      // Clear auth state
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    }
  };

  // Update user function
  const updateUser = (userData) => {
    dispatch({ 
      type: AUTH_ACTIONS.UPDATE_USER, 
      payload: userData 
    });
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  // Set error function
  const setError = (error) => {
    dispatch({ 
      type: AUTH_ACTIONS.SET_ERROR, 
      payload: error 
    });
  };

  // Context value
  const value = {
    // State
    user: state.user,
    token: state.token,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
    isInitialized: state.isInitialized,
    
    // Actions
    login,
    register,
    logout,
    updateUser,
    clearError,
    setError,
    refreshToken: handleRefreshToken,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Legacy hook name for backward compatibility
export const useAuthContext = () => {
  console.warn('useAuthContext is deprecated. Use useAuth instead.');
  return useAuth();
};

export default AuthContext;