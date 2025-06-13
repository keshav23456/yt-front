import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { LOADING_STATES, LOCAL_STORAGE_KEYS } from '../../utils/constants';

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
      
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial state
const initialState = {
  // Theme
  theme: localStorage.getItem(LOCAL_STORAGE_KEYS.THEME) || 'light',
  
  // Loading states
  status: LOADING_STATES.IDLE,
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
      type: 'all',
      duration: 'any',
      uploadDate: 'any',
      sortBy: 'relevance',
    },
  },
  
  // Notifications
  notifications: [],
  
  // Health status
  serverHealth: {
    status: LOADING_STATES.IDLE,
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
    pip: false,
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Theme
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem(LOCAL_STORAGE_KEYS.THEME, action.payload);
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem(LOCAL_STORAGE_KEYS.THEME, state.theme);
    },
    
    // Loading
    setLoading: (state, action) => {
      state.status = action.payload.isLoading ? LOADING_STATES.LOADING : LOADING_STATES.IDLE;
      state.loadingMessage = action.payload.message || '';
    },
    
    // Modals
    toggleModal: (state, action) => {
      const modalName = action.payload;
      state.modals[modalName] = !state.modals[modalName];
    },
    setModal: (state, action) => {
      const { modal, isOpen } = action.payload;
      state.modals[modal] = isOpen;
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
    toggleSidebarCollapse: (state) => {
      state.sidebar.isCollapsed = !state.sidebar.isCollapsed;
      localStorage.setItem('sidebarCollapsed', state.sidebar.isCollapsed.toString());
    },
    setSidebar: (state, action) => {
      state.sidebar = { ...state.sidebar, ...action.payload };
      if (action.payload.isCollapsed !== undefined) {
        localStorage.setItem('sidebarCollapsed', action.payload.isCollapsed.toString());
      }
    },
    
    // Search
    updateSearch: (state, action) => {
      if (action.payload.query !== undefined) {
        state.search.query = action.payload.query;
      }
      if (action.payload.filters) {
        state.search.filters = { ...state.search.filters, ...action.payload.filters };
      }
    },
    clearSearch: (state) => {
      state.search.query = '';
      state.search.filters = initialState.search.filters;
    },
    
    // Notifications
    addNotification: (state, action) => {
      const notification = {
        id: Date.now() + Math.random(),
        type: action.payload.type || 'info',
        title: action.payload.title,
        message: action.payload.message,
        duration: action.payload.duration || 5000,
        createdAt: new Date().toISOString(),
      };
      state.notifications.push(notification);
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
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
    updatePlayer: (state, action) => {
      state.player = { ...state.player, ...action.payload };
      
      // Update localStorage for persistent settings
      if (action.payload.volume !== undefined) {
        localStorage.setItem('playerVolume', action.payload.volume.toString());
      }
      if (action.payload.quality !== undefined) {
        localStorage.setItem('playerQuality', action.payload.quality);
      }
      if (action.payload.autoplay !== undefined) {
        localStorage.setItem('playerAutoplay', action.payload.autoplay.toString());
      }
    },
    togglePlayerSetting: (state, action) => {
      const setting = action.payload;
      if (setting === 'theater') {
        state.player.theater = !state.player.theater;
      } else if (setting === 'pip') {
        state.player.pip = !state.player.pip;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkHealthStatus.pending, (state) => {
        state.serverHealth.status = LOADING_STATES.LOADING;
      })
      .addCase(checkHealthStatus.fulfilled, (state) => {
        state.serverHealth.status = LOADING_STATES.SUCCESS;
        state.serverHealth.lastChecked = new Date().toISOString();
        state.serverHealth.error = null;
      })
      .addCase(checkHealthStatus.rejected, (state, action) => {
        state.serverHealth.status = LOADING_STATES.ERROR;
        state.serverHealth.lastChecked = new Date().toISOString();
        state.serverHealth.error = action.payload;
      });
  },
});

export const {
  setTheme,
  toggleTheme,
  setLoading,
  toggleModal,
  setModal,
  closeAllModals,
  toggleSidebar,
  toggleSidebarCollapse,
  setSidebar,
  updateSearch,
  clearSearch,
  addNotification,
  removeNotification,
  clearNotifications,
  addError,
  removeError,
  clearErrors,
  updatePlayer,
  togglePlayerSetting,
} = uiSlice.actions;

export default uiSlice.reducer;