export { default as store, persistor } from './store';

// Export all slice actions
export * from './slices/authSlice';
export * from './slices/userSlice';
export * from './slices/videoSlice';
export * from './slices/commentSlice';
export * from './slices/playlistSlice';
export * from './slices/tweetSlice';
export * from './slices/uiSlice';

// Selectors
export const selectAuth = (state) => state.auth;
export const selectUser = (state) => state.user;
export const selectVideo = (state) => state.video;
export const selectComment = (state) => state.comment;
export const selectPlaylist = (state) => state.playlist;
export const selectTweet = (state) => state.tweet;
export const selectUI = (state) => state.ui;

// Compound selectors
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectCurrentUser = (state) => state.auth.user;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectCurrentVideo = (state) => state.video.currentVideo;
export const selectVideos = (state) => state.video.videos;
export const selectVideoLoading = (state) => state.video.loading;
export const selectComments = (state) => state.comment.comments;
export const selectUserPlaylists = (state) => state.playlist.userPlaylists;
export const selectTheme = (state) => state.ui.theme;
export const selectNotifications = (state) => state.ui.notifications;
export const selectModals = (state) => state.ui.modals;