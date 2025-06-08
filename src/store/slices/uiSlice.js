import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  theme: 'light',
  sidebarCollapsed: false,
  isMobile: false,
  notifications: [],
  modals: {
    login: false,
    signup: false,
    createPlaylist: false,
    addToPlaylist: false,
    videoUpload: false,
    deleteConfirm: false
  },
  preferences: {
    autoplay: true,
    videoQuality: 'auto',
    volume: 0.8,
    playbackSpeed: 1
  },
  loading: {
    global: false,
    component: {}
  }
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    setSidebarCollapsed: (state, action) => {
      state.sidebarCollapsed = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setIsMobile: (state, action) => {
      state.isMobile = action.payload;
    },
    openModal: (state, action) => {
      state.modals[action.payload] = true;
    },
    closeModal: (state, action) => {
      state.modals[action.payload] = false;
    },
    closeAllModals: (state) => {
      Object.keys(state.modals).forEach(key => {
        state.modals[key] = false;
      });
    },
    addNotification: (state, action) => {
      const notification = {
        id: Date.now() + Math.random(),
        type: 'info',
        duration: 5000,
        ...action.payload
      };
      state.notifications.push(notification);
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    updatePreferences: (state, action) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },
    setGlobalLoading: (state, action) => {
      state.loading.global = action.payload;
    },
    setComponentLoading: (state, action) => {
      const { component, loading } = action.payload;
      state.loading.component[component] = loading;
    },
    clearComponentLoading: (state, action) => {
      delete state.loading.component[action.payload];
    }
  }
});

export const {
  setTheme,
  toggleTheme,
  setSidebarCollapsed,
  toggleSidebar,
  setIsMobile,
  openModal,
  closeModal,
  closeAllModals,
  addNotification,
  removeNotification,
  clearNotifications,
  updatePreferences,
  setGlobalLoading,
  setComponentLoading,
  clearComponentLoading
} = uiSlice.actions;

export default uiSlice.reducer;