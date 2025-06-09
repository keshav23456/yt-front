// src/services/auth.service.js
import { api } from './api.js';

export const register = async (userData) => {
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

export const login = async (credentials) => {
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

export const logout = async () => {
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

export const refreshToken = async () => {
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

export const getCurrentUser = async () => {
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

export const changePassword = async (passwordData) => {
  try {
    const response = await api.post('/users/change-password', passwordData);
    return response.data;
  } catch (error) {
    console.error('Change password error:', error);
    throw error;
  }
};

// Helper functions
export const getStoredUser = () => {
  try {
    const userString = localStorage.getItem('user');
    return userString ? JSON.parse(userString) : null;
  } catch (error) {
    console.error('Error parsing stored user data:', error);
    localStorage.removeItem('user');
    return null;
  }
};

export const getStoredToken = () => {
  return localStorage.getItem('accessToken');
};

export const isAuthenticated = () => {
  const token = getStoredToken();
  const user = getStoredUser();
  return !!(token && user);
};

export const authService = {
  register,
  login,
  logout,
  refreshToken,
  getCurrentUser,
  changePassword,
  getStoredUser,
  getStoredToken,
  isAuthenticated
};