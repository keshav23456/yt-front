import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import { LOADING_STATES } from '../../utils/constants';
import { playlistService } from '../../services';

const initialState = {
  playlists: [],
  currentPlaylist: null,
  userPlaylists: [],
  isLoading: LOADING_STATES.IDLE,
  isCreating: LOADING_STATES.IDLE,
  isUpdating: LOADING_STATES.IDLE,
  error: null,
  selectedPlaylistIds: [],
  sortBy: 'createdAt',
  sortOrder: 'desc'
};

// Utility function for error handling
const handleAsyncError = (error) => {
  const errorMessage = error.response?.data?.message || error.message || 'Operation failed';
  console.error('Playlist operation error:', error);
  return errorMessage;
};

// Utility function for localStorage operations
const updatePlaylistCache = (userId, playlists) => {
  if (userId) {
    localStorage.setItem(`userPlaylists_${userId}`, JSON.stringify(playlists.slice(0, 50)));
  }
};

// Async thunks
export const createPlaylistAsync = createAsyncThunk(
  'playlist/create',
  async (playlistData, { rejectWithValue, getState }) => {
    try {
      const response = await playlistService.createPlaylist(playlistData);
      const { auth } = getState();
      
      if (auth.user?.id) {
        const cached = JSON.parse(localStorage.getItem(`userPlaylists_${auth.user.id}`) || '[]');
        updatePlaylistCache(auth.user.id, [response.data.playlist, ...cached]);
      }
      
      return response.data;
    } catch (error) {
      return rejectWithValue(handleAsyncError(error));
    }
  }
);

export const getPlaylistByIdAsync = createAsyncThunk(
  'playlist/getById',
  async (playlistId, { rejectWithValue }) => {
    try {
      const response = await playlistService.getPlaylistById(playlistId);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleAsyncError(error));
    }
  }
);

export const updatePlaylistAsync = createAsyncThunk(
  'playlist/update',
  async ({ playlistId, playlistData }, { rejectWithValue, getState }) => {
    try {
      const response = await playlistService.updatePlaylist(playlistId, playlistData);
      const { auth } = getState();
      
      if (auth.user?.id) {
        const cached = JSON.parse(localStorage.getItem(`userPlaylists_${auth.user.id}`) || '[]');
        const updated = cached.map(p => p._id === playlistId ? { ...p, ...response.data.playlist } : p);
        updatePlaylistCache(auth.user.id, updated);
      }
      
      return response.data;
    } catch (error) {
      return rejectWithValue(handleAsyncError(error));
    }
  }
);

export const deletePlaylistAsync = createAsyncThunk(
  'playlist/delete',
  async (playlistId, { rejectWithValue, getState }) => {
    try {
      await playlistService.deletePlaylist(playlistId);
      const { auth } = getState();
      
      if (auth.user?.id) {
        const cached = JSON.parse(localStorage.getItem(`userPlaylists_${auth.user.id}`) || '[]');
        updatePlaylistCache(auth.user.id, cached.filter(p => p._id !== playlistId));
      }
      
      return playlistId;
    } catch (error) {
      return rejectWithValue(handleAsyncError(error));
    }
  }
);

export const addVideoToPlaylistAsync = createAsyncThunk(
  'playlist/addVideo',
  async ({ videoId, playlistId }, { rejectWithValue }) => {
    try {
      const response = await playlistService.addVideoToPlaylist(videoId, playlistId);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleAsyncError(error));
    }
  }
);

export const removeVideoFromPlaylistAsync = createAsyncThunk(
  'playlist/removeVideo',
  async ({ videoId, playlistId }, { rejectWithValue }) => {
    try {
      const response = await playlistService.removeVideoFromPlaylist(videoId, playlistId);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleAsyncError(error));
    }
  }
);

export const getUserPlaylistsAsync = createAsyncThunk(
  'playlist/getUserPlaylists',
  async (userId, { rejectWithValue }) => {
    try {
      // Check cache first
      const cached = JSON.parse(localStorage.getItem(`userPlaylists_${userId}`) || '[]');
      if (cached.length > 0) {
        // Return cached data immediately, fetch fresh data in background
        playlistService.getUserPlaylists(userId).then(response => {
          updatePlaylistCache(userId, response.data.playlists);
        }).catch(console.error);
        return { playlists: cached };
      }
      
      const response = await playlistService.getUserPlaylists(userId);
      updatePlaylistCache(userId, response.data.playlists);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleAsyncError(error));
    }
  }
);

// Utility function to update playlist in all arrays
const updatePlaylistInArrays = (state, updatedPlaylist) => {
  const updateArray = (array) => {
    const index = array.findIndex(p => p._id === updatedPlaylist._id);
    if (index !== -1) array[index] = updatedPlaylist;
  };
  
  updateArray(state.playlists);
  updateArray(state.userPlaylists);
  
  if (state.currentPlaylist?._id === updatedPlaylist._id) {
    state.currentPlaylist = updatedPlaylist;
  }
};

const playlistSlice = createSlice({
  name: 'playlist',
  initialState,
  reducers: {
    clearError: (state) => { state.error = null; },
    clearCurrentPlaylist: (state) => { state.currentPlaylist = null; },
    resetState: () => initialState,
    toggleSelection: (state, action) => {
      const id = action.payload;
      const index = state.selectedPlaylistIds.indexOf(id);
      if (index > -1) {
        state.selectedPlaylistIds.splice(index, 1);
      } else {
        state.selectedPlaylistIds.push(id);
      }
    },
    clearSelection: (state) => { state.selectedPlaylistIds = []; },
    setSortOptions: (state, action) => {
      state.sortBy = action.payload.sortBy || state.sortBy;
      state.sortOrder = action.payload.sortOrder || state.sortOrder;
    }
  },
  extraReducers: (builder) => {
    // Create Playlist
    builder
      .addCase(createPlaylistAsync.pending, (state) => {
        state.isCreating = LOADING_STATES.PENDING;
        state.error = null;
      })
      .addCase(createPlaylistAsync.fulfilled, (state, action) => {
        state.isCreating = LOADING_STATES.FULFILLED;
        const newPlaylist = action.payload.playlist;
        state.playlists.unshift(newPlaylist);
        state.userPlaylists.unshift(newPlaylist);
      })
      .addCase(createPlaylistAsync.rejected, (state, action) => {
        state.isCreating = LOADING_STATES.REJECTED;
        state.error = action.payload;
      })
      
      // Get Playlist By ID
      .addCase(getPlaylistByIdAsync.pending, (state) => {
        state.isLoading = LOADING_STATES.PENDING;
        state.error = null;
      })
      .addCase(getPlaylistByIdAsync.fulfilled, (state, action) => {
        state.isLoading = LOADING_STATES.FULFILLED;
        state.currentPlaylist = action.payload.playlist;
      })
      .addCase(getPlaylistByIdAsync.rejected, (state, action) => {
        state.isLoading = LOADING_STATES.REJECTED;
        state.error = action.payload;
      })
      
      // Update Playlist
      .addCase(updatePlaylistAsync.pending, (state) => {
        state.isUpdating = LOADING_STATES.PENDING;
        state.error = null;
      })
      .addCase(updatePlaylistAsync.fulfilled, (state, action) => {
        state.isUpdating = LOADING_STATES.FULFILLED;
        updatePlaylistInArrays(state, action.payload.playlist);
      })
      .addCase(updatePlaylistAsync.rejected, (state, action) => {
        state.isUpdating = LOADING_STATES.REJECTED;
        state.error = action.payload;
      })
      
      // Delete Playlist
      .addCase(deletePlaylistAsync.fulfilled, (state, action) => {
        const playlistId = action.payload;
        state.playlists = state.playlists.filter(p => p._id !== playlistId);
        state.userPlaylists = state.userPlaylists.filter(p => p._id !== playlistId);
        state.selectedPlaylistIds = state.selectedPlaylistIds.filter(id => id !== playlistId);
        if (state.currentPlaylist?._id === playlistId) {
          state.currentPlaylist = null;
        }
      })
      .addCase(deletePlaylistAsync.rejected, (state, action) => {
        state.error = action.payload;
      })
      
      // Add/Remove Video from Playlist
      .addCase(addVideoToPlaylistAsync.fulfilled, (state, action) => {
        updatePlaylistInArrays(state, action.payload.playlist);
      })
      .addCase(removeVideoFromPlaylistAsync.fulfilled, (state, action) => {
        updatePlaylistInArrays(state, action.payload.playlist);
      })
      .addCase(addVideoToPlaylistAsync.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(removeVideoFromPlaylistAsync.rejected, (state, action) => {
        state.error = action.payload;
      })
      
      // Get User Playlists
      .addCase(getUserPlaylistsAsync.fulfilled, (state, action) => {
        state.userPlaylists = action.payload.playlists;
      })
      .addCase(getUserPlaylistsAsync.rejected, (state, action) => {
        state.error = action.payload;
      });
  }
});

// Selectors
export const selectPlaylistState = (state) => state.playlist;
export const selectAllPlaylists = (state) => state.playlist.playlists;
export const selectCurrentPlaylist = (state) => state.playlist.currentPlaylist;
export const selectUserPlaylists = (state) => state.playlist.userPlaylists;

export const selectPlaylistById = createSelector(
  [selectAllPlaylists, (state, id) => id],
  (playlists, playlistId) => playlists.find(p => p._id === playlistId)
);

export const selectSortedPlaylists = createSelector(
  [selectAllPlaylists, selectPlaylistState],
  (playlists, { sortBy, sortOrder }) => {
    return [...playlists].sort((a, b) => {
      const comparison = a[sortBy] > b[sortBy] ? 1 : -1;
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }
);

export const selectPlaylistStats = createSelector(
  [selectUserPlaylists],
  (playlists) => ({
    total: playlists.length,
    totalVideos: playlists.reduce((sum, p) => sum + (p.videos?.length || 0), 0),
    public: playlists.filter(p => p.isPublic).length
  })
);

export const {
  clearError,
  clearCurrentPlaylist,
  resetState,
  toggleSelection,
  clearSelection,
  setSortOptions
} = playlistSlice.actions;

export default playlistSlice.reducer;