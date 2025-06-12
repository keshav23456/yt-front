// src/services/auth.service.js
import { api } from './api.js';

export const registerService = async (userData) => {
  try {
    const formData = new FormData();
    
    // Add all fields except files
    Object.keys(userData).forEach(key => {
      if (key !== 'avatar' && key !== 'coverImage') {
        formData.append(key, userData[key]);
      }
    });
    
    // Add files if present
    if (userData.avatar) formData.append('avatar', userData.avatar);
    if (userData.coverImage) formData.append('coverImage', userData.coverImage);

    const response = await api.post('/users/register', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    const { accessToken, refreshToken, user } = response.data.data;
    
    // Store auth data
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
    
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const loginService = async (credentials) => {
  try {
    const response = await api.post('/users/login', credentials);
    const { accessToken, refreshToken, user } = response.data.data;
    
    // Store auth data
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
    
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const logoutService = async () => {
  try {
    await api.post('/users/logout');
  } catch (error) {
    console.error('Logout API error:', error);
    // Continue with cleanup even if API call fails
  } finally {
    // Always clear local storage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }
};

export const refreshTokenService = async () => {
  try {
    const response = await api.post('/users/refresh-token');
    const { accessToken, user } = response.data.data;
    
    // Update stored access token
    localStorage.setItem('accessToken', accessToken);
    
    // Update user data if provided
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
    
    return response.data;
  } catch (error) {
    console.error('Token refresh error:', error);
    // Clear tokens if refresh fails
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    throw error;
  }
};

export const getCurrentUserService = async () => {
  try {
    const response = await api.get('/users/current-user');
    
    // Update stored user data
    if (response.data.success && response.data.data) {
      localStorage.setItem('user', JSON.stringify(response.data.data));
    }
    
    return response.data;
  } catch (error) {
    console.error('Get current user error:', error);
    throw error;
  }
};

export const changePasswordService = async (passwordData) => {
  try {
    const response = await api.post('/users/change-password', passwordData);
    return response.data;
  } catch (error) {
    console.error('Change password error:', error);
    throw error;
  }
};

export const updateAccountService = async (userData) => {
  try {
    const response = await api.patch('/users/update-account', userData);
    return response.data;
  } catch (error) {
    console.error('Update account error:', error);
    throw error;
  }
};

// Helper functions
export const getStoredUserService = () => {
  try {
    const userString = localStorage.getItem('user');
    return userString ? JSON.parse(userString) : null;
  } catch (error) {
    console.error('Error parsing stored user data:', error);
    localStorage.removeItem('user');
    return null;
  }
};

export const getStoredTokenService = () => {
  return localStorage.getItem('accessToken');
};

export const isAuthenticatedService = () => {
  const token = getStoredTokenService();
  const user = getStoredUserService();
  return !!(token && user);
};

// Default export object
 export const  authService = {
  registerService,
  loginService,
  logoutService,
  refreshTokenService,
  getCurrentUserService,
  changePasswordService,
  updateAccountService,
  getStoredUserService,
  getStoredTokenService,
  isAuthenticatedService
};

