// import { createSlice } from '@reduxjs/toolkit';

// const initialState = {
//   theme: 'light',
//   sidebarCollapsed: false,
//   isMobile: false,
//   notifications: [],
//   modals: {
//     login: false,
//     signup: false,
//     createPlaylist: false,
//     addToPlaylist: false,
//     videoUpload: false,
//     deleteConfirm: false
//   },
//   preferences: {
//     autoplay: true,
//     videoQuality: 'auto',
//     volume: 0.8,
//     playbackSpeed: 1
//   },
//   loading: {
//     global: false,
//     component: {}
//   }
// };

// const uiSlice = createSlice({
//   name: 'ui',
//   initialState,
//   reducers: {
//     setTheme: (state, action) => {
//       state.theme = action.payload;
//     },
//     toggleTheme: (state) => {
//       state.theme = state.theme === 'light' ? 'dark' : 'light';
//     },
//     setSidebarCollapsed: (state, action) => {
//       state.sidebarCollapsed = action.payload;
//     },
//     toggleSidebar: (state) => {
//       state.sidebarCollapsed = !state.sidebarCollapsed;
//     },
//     setIsMobile: (state, action) => {
//       state.isMobile = action.payload;
//     },
//     openModal: (state, action) => {
//       state.modals[action.payload] = true;
//     },
//     closeModal: (state, action) => {
//       state.modals[action.payload] = false;
//     },
//     closeAllModals: (state) => {
//       Object.keys(state.modals).forEach(key => {
//         state.modals[key] = false;
//       });
//     },
//     addNotification: (state, action) => {
//       const notification = {
//         id: Date.now() + Math.random(),
//         type: 'info',
//         duration: 5000,
//         ...action.payload
//       };
//       state.notifications.push(notification);
//     },
//     removeNotification: (state, action) => {
//       state.notifications = state.notifications.filter(n => n.id !== action.payload);
//     },
//     clearNotifications: (state) => {
//       state.notifications = [];
//     },
//     updatePreferences: (state, action) => {
//       state.preferences = { ...state.preferences, ...action.payload };
//     },
//     setGlobalLoading: (state, action) => {
//       state.loading.global = action.payload;
//     },
//     setComponentLoading: (state, action) => {
//       const { component, loading } = action.payload;
//       state.loading.component[component] = loading;
//     },
//     clearComponentLoading: (state, action) => {
//       delete state.loading.component[action.payload];
//     }
//   }
// });

// export const {
//   setTheme,
//   toggleTheme,
//   setSidebarCollapsed,
//   toggleSidebar,
//   setIsMobile,
//   openModal,
//   closeModal,
//   closeAllModals,
//   addNotification,
//   removeNotification,
//   clearNotifications,
//   updatePreferences,
//   setGlobalLoading,
//   setComponentLoading,
//   clearComponentLoading
// } = uiSlice.actions;

// export default uiSlice.reducer;


import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for health check
export const checkHealthStatus = createAsyncThunk(
  'ui/checkHealthStatus',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api/v1'}/healthcheck`, {
        method: 'GET',
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Health check failed');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial state
const initialState = {
  // Theme
  theme: localStorage.getItem('theme') || 'light',
  
  // Loading states
  isLoading: false,
  loadingMessage: '',
  
  // Modals
  modals: {
    videoUpload: false,
    createPlaylist: false,
    addToPlaylist: false,
    deleteConfirm: false,
  },
  
  // Sidebar
  sidebar: {
    isOpen: false,
    isCollapsed: localStorage.getItem('sidebarCollapsed') === 'true',
  },
  
  // Search
  search: {
    query: '',
    filters: {
      type: 'all', // all, video, channel, playlist
      duration: 'any', // any, short, medium, long
      uploadDate: 'any', // any, today, week, month, year
      sortBy: 'relevance', // relevance, date, views, rating
    },
  },
  
  // Notifications/Toasts
  notifications: [],
  
  // Health status
  serverHealth: {
    status: 'unknown',
    lastChecked: null,
    error: null,
  },
  
  // Error handling
  errors: [],
  
  // Player
  player: {
    volume: parseFloat(localStorage.getItem('playerVolume')) || 1,
    quality: localStorage.getItem('playerQuality') || 'auto',
    autoplay: localStorage.getItem('playerAutoplay') === 'true',
    theater: false,
    pip: false, // Picture in Picture
  },
};

// UI slice
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Theme
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem('theme', action.payload);
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', state.theme);
    },
    
    // Loading
    setLoading: (state, action) => {
      state.isLoading = action.payload.isLoading;
      state.loadingMessage = action.payload.message || '';
    },
    
    // Modals
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
    
    // Sidebar
    toggleSidebar: (state) => {
      state.sidebar.isOpen = !state.sidebar.isOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebar.isOpen = action.payload;
    },
    toggleSidebarCollapse: (state) => {
      state.sidebar.isCollapsed = !state.sidebar.isCollapsed;
      localStorage.setItem('sidebarCollapsed', state.sidebar.isCollapsed.toString());
    },
    setSidebarCollapsed: (state, action) => {
      state.sidebar.isCollapsed = action.payload;
      localStorage.setItem('sidebarCollapsed', action.payload.toString());
    },
    
    // Search
    setSearchQuery: (state, action) => {
      state.search.query = action.payload;
    },
    setSearchFilters: (state, action) => {
      state.search.filters = { ...state.search.filters, ...action.payload };
    },
    clearSearch: (state) => {
      state.search.query = '';
      state.search.filters = initialState.search.filters;
    },
    
    // Notifications
    addNotification: (state, action) => {
      const notification = {
        id: Date.now() + Math.random(),
        type: action.payload.type || 'info', // success, error, warning, info
        title: action.payload.title,
        message: action.payload.message,
        duration: action.payload.duration || 5000,
        createdAt: new Date().toISOString(),
      };
      state.notifications.push(notification);
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    
    // Errors
    addError: (state, action) => {
      const error = {
        id: Date.now() + Math.random(),
        message: action.payload.message,
        code: action.payload.code,
        timestamp: new Date().toISOString(),
      };
      state.errors.push(error);
    },
    removeError: (state, action) => {
      state.errors = state.errors.filter(error => error.id !== action.payload);
    },
    clearErrors: (state) => {
      state.errors = [];
    },
    
    // Player
    setPlayerVolume: (state, action) => {
      state.player.volume = action.payload;
      localStorage.setItem('playerVolume', action.payload.toString());
    },
    setPlayerQuality: (state, action) => {
      state.player.quality = action.payload;
      localStorage.setItem('playerQuality', action.payload);
    },
    setPlayerAutoplay: (state, action) => {
      state.player.autoplay = action.payload;
      localStorage.setItem('playerAutoplay', action.payload.toString());
    },
    toggleTheaterMode: (state) => {
      state.player.theater = !state.player.theater;
    },
    setTheaterMode: (state, action) => {
      state.player.theater = action.payload;
    },
    togglePictureInPicture: (state) => {
      state.player.pip = !state.player.pip;
    },
    setPictureInPicture: (state, action) => {
      state.player.pip = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Health Check
      .addCase(checkHealthStatus.pending, (state) => {
        state.serverHealth.status = 'checking';
      })
      .addCase(checkHealthStatus.fulfilled, (state, action) => {
        state.serverHealth.status = 'healthy';
        state.serverHealth.lastChecked = new Date().toISOString();
        state.serverHealth.error = null;
      })
      .addCase(checkHealthStatus.rejected, (state, action) => {
        state.serverHealth.status = 'unhealthy';
        state.serverHealth.lastChecked = new Date().toISOString();
        state.serverHealth.error = action.payload;
      });
  },
});

export const {
  // Theme
  setTheme,
  toggleTheme,
  
  // Loading
  setLoading,
  
  // Modals
  openModal,
  closeModal,
  closeAllModals,
  
  // Sidebar
  toggleSidebar,
  setSidebarOpen,
  toggleSidebarCollapse,
  setSidebarCollapsed,
  
  // Search
  setSearchQuery,
  setSearchFilters,
  clearSearch,
  
  // Notifications
  addNotification,
  removeNotification,
  clearNotifications,
  
  // Errors
  addError,
  removeError,
  clearErrors,
  
  // Player
  setPlayerVolume,
  setPlayerQuality,
  setPlayerAutoplay,
  toggleTheaterMode,
  setTheaterMode,
  togglePictureInPicture,
  setPictureInPicture,
} = uiSlice.actions;

export default uiSlice.reducer;