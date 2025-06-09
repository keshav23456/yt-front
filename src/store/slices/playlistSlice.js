import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { LOADING_STATES } from '../../utils/constants';
import { playlistService } from '../../services';

const initialState = {
  playlists: [],
  currentPlaylist: null,
  userPlaylists: [],
  loading: LOADING_STATES.IDLE,
  error: null,
  creating: LOADING_STATES.IDLE
};

// Async thunks
export const createPlaylistAsync = createAsyncThunk(
  'playlist/createPlaylist',
  async (playlistData, { rejectWithValue }) => {
    try {
      const response = await playlistService.createPlaylist(playlistData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create playlist');
    }
  }
);

export const getPlaylistByIdAsync = createAsyncThunk(
  'playlist/getPlaylistById',
  async (playlistId, { rejectWithValue }) => {
    try {
      const response = await playlistService.getPlaylistById(playlistId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch playlist');
    }
  }
);

export const updatePlaylistAsync = createAsyncThunk(
  'playlist/updatePlaylist',
  async ({ playlistId, playlistData }, { rejectWithValue }) => {
    try {
      const response = await playlistService.updatePlaylist(playlistId, playlistData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update playlist');
    }
  }
);

export const deletePlaylistAsync = createAsyncThunk(
  'playlist/deletePlaylist',
  async (playlistId, { rejectWithValue }) => {
    try {
      await playlistService.deletePlaylist(playlistId);
      return playlistId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete playlist');
    }
  }
);

export const addVideoToPlaylistAsync = createAsyncThunk(
  'playlist/addVideoToPlaylist',
  async ({ videoId, playlistId }, { rejectWithValue }) => {
    try {
      const response = await playlistService.addVideoToPlaylist(videoId, playlistId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add video to playlist');
    }
  }
);

export const removeVideoFromPlaylistAsync = createAsyncThunk(
  'playlist/removeVideoFromPlaylist',
  async ({ videoId, playlistId }, { rejectWithValue }) => {
    try {
      const response = await playlistService.removeVideoFromPlaylist(videoId, playlistId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove video from playlist');
    }
  }
);

export const getUserPlaylistsAsync = createAsyncThunk(
  'playlist/getUserPlaylists',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await playlistService.getUserPlaylists(userId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user playlists');
    }
  }
);

const playlistSlice = createSlice({
  name: 'playlist',
  initialState,
  reducers: {
    clearPlaylistError: (state) => {
      state.error = null;
    },
    clearCurrentPlaylist: (state) => {
      state.currentPlaylist = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Create Playlist
      .addCase(createPlaylistAsync.pending, (state) => {
        state.creating = LOADING_STATES.PENDING;
        state.error = null;
      })
      .addCase(createPlaylistAsync.fulfilled, (state, action) => {
        state.creating = LOADING_STATES.FULFILLED;
        state.playlists.unshift(action.payload.playlist);
        state.userPlaylists.unshift(action.payload.playlist);
      })
      .addCase(createPlaylistAsync.rejected, (state, action) => {
        state.creating = LOADING_STATES.REJECTED;
        state.error = action.payload;
      })
      // Get Playlist By ID
      .addCase(getPlaylistByIdAsync.pending, (state) => {
        state.loading = LOADING_STATES.PENDING;
        state.error = null;
      })
      .addCase(getPlaylistByIdAsync.fulfilled, (state, action) => {
        state.loading = LOADING_STATES.FULFILLED;
        state.currentPlaylist = action.payload.playlist;
      })
      .addCase(getPlaylistByIdAsync.rejected, (state, action) => {
        state.loading = LOADING_STATES.REJECTED;
        state.error = action.payload;
      })
      // Update Playlist
      .addCase(updatePlaylistAsync.fulfilled, (state, action) => {
        const index = state.playlists.findIndex(p => p._id === action.payload.playlist._id);
        if (index !== -1) {
          state.playlists[index] = action.payload.playlist;
        }
        const userIndex = state.userPlaylists.findIndex(p => p._id === action.payload.playlist._id);
        if (userIndex !== -1) {
          state.userPlaylists[userIndex] = action.payload.playlist;
        }
        if (state.currentPlaylist?._id === action.payload.playlist._id) {
          state.currentPlaylist = action.payload.playlist;
        }
      })
      // Delete Playlist
      .addCase(deletePlaylistAsync.fulfilled, (state, action) => {
        state.playlists = state.playlists.filter(p => p._id !== action.payload);
        state.userPlaylists = state.userPlaylists.filter(p => p._id !== action.payload);
        if (state.currentPlaylist?._id === action.payload) {
          state.currentPlaylist = null;
        }
      })
      // Add Video to Playlist
      .addCase(addVideoToPlaylistAsync.fulfilled, (state, action) => {
        if (state.currentPlaylist?._id === action.payload.playlist._id) {
          state.currentPlaylist = action.payload.playlist;
        }
      })
      // Remove Video from Playlist
      .addCase(removeVideoFromPlaylistAsync.fulfilled, (state, action) => {
        if (state.currentPlaylist?._id === action.payload.playlist._id) {
          state.currentPlaylist = action.payload.playlist;
        }
      })
      // Get User Playlists
      .addCase(getUserPlaylistsAsync.fulfilled, (state, action) => {
        state.userPlaylists = action.payload.playlists;
      });
  }
});

export const { clearPlaylistError, clearCurrentPlaylist } = playlistSlice.actions;
export default playlistSlice.reducer;