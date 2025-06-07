import api from './api.js';

export const authService = {
  register: async (userData) => {
    const formData = new FormData();
    Object.keys(userData).forEach(key => {
      if (key !== 'avatar' && key !== 'coverImage') {
        formData.append(key, userData[key]);
      }
    });
    
    if (userData.avatar) formData.append('avatar', userData.avatar);
    if (userData.coverImage) formData.append('coverImage', userData.coverImage);

    return api.post('/users/register', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => res.data);
  },

  login: async (credentials) => {
    const response = await api.post('/users/login', credentials);
    const { accessToken, refreshToken, user } = response.data.data;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
    return response.data;
  },

  logout: async () => {
    try {
      await api.post('/users/logout');
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  },

  refreshToken: async () => {
    const response = await api.post('/users/refresh-token');
    localStorage.setItem('accessToken', response.data.data.accessToken);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/users/current-user');
    return response.data;
  },

  changePassword: async (passwordData) => {
    const response = await api.post('/users/change-password', passwordData);
    return response.data;
  }
};