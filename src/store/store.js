// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';

// Import slice reducers
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import videoReducer from './slices/videoSlice';
import commentReducer from './slices/commentSlice';
import playlistReducer from './slices/playlistSlice';
import tweetReducer from './slices/tweetSlice';
import uiReducer from './slices/uiSlice';

// Persist configuration
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'user', 'ui'], // Only persist these reducers
  blacklist: ['video', 'comment', 'playlist', 'tweet'] // Don't persist these (they should be fresh)
};

// Auth persist config (separate for more control)
const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['token', 'refreshToken', 'isAuthenticated', 'user'] // Only persist auth data
};

// UI persist config
const uiPersistConfig = {
  key: 'ui',
  storage,
  whitelist: ['theme', 'sidebarCollapsed', 'preferences'] // Persist UI settings
};

// Root reducer
const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  user: userReducer,
  video: videoReducer,
  comment: commentReducer,
  playlist: playlistReducer,
  tweet: tweetReducer,
  ui: persistReducer(uiPersistConfig, uiReducer)
});

// Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        ignoredPaths: ['register', 'rehydrate']
      }
    }),
  devTools: process.env.NODE_ENV !== 'production'
});

// Persistor
export const persistor = persistStore(store);

// Types for TypeScript (if needed)
export const RootState = store.getState;
export const AppDispatch = store.dispatch;

// Export default store
export default store;