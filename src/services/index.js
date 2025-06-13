// Auth service function exports
export {
  loginService,
  registerService,
  logoutService,
  refreshTokenService,
  getCurrentUserService,
  changePasswordService,
  updateAccountService,
  getStoredUserService,
  getStoredTokenService,
  isAuthenticatedService
} from './auth.service.js';

// User service function exports
export {
  getUserChannelService,
  getChannelProfileService,
  getChannelVideosService,
  getWatchHistoryService,
  updateUserAccountService,
  updateProfileService,
  updateAccountDetailsService,
  updateUserAvatarService,
  updateAvatarService,
  updateUserCoverImageService,
  updateCoverImageService,
  changePasswordService as userChangePasswordService,
  getUserProfileService,
  searchUsersService
} from './user.service.js';

// Video service function exports
export {
  getAllVideos,
  uploadVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus
} from './video.service.js';

// Comment service function exports
export {
  getVideoComments,
  addComment,
  updateComment,
  deleteComment,
  toggleCommentLike as toggleCommentLikeService,
  addReply,
  getReplies
} from './comment.service.js';

// Like service function exports
export {
  toggleVideoLike,
  toggleCommentLike,
  toggleTweetLike,
  getLikedVideos
} from './like.service.js';

// Subscription service function exports
export {
  toggleSubscription,
  getUserSubscriptions,
  getSubscribedChannels,
  getChannelSubscribers
} from './subscription.service.js';

// Playlist service function exports
export {
  createPlaylist,
  getPlaylistById,
  updatePlaylist,
  deletePlaylist,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  getUserPlaylists
} from './playlist.service.js';

// Tweet service function exports
export {
  createTweet,
  getUserTweets,
  updateTweet,
  deleteTweet
} from './tweet.service.js';

// Dashboard service function exports
export {
  getChannelStats,
  getChannelVideos as dashboardGetChannelVideos
} from './dashboard.service.js';

// Healthcheck service function exports
export {
  healthcheck
} from './healthcheck.service.js';

// Service object exports (for those who prefer object-based imports)
export { default as authService } from './auth.service.js';
export { videoService } from './video.service.js';
export { commentService } from './comment.service.js';
export { likeService } from './like.service.js';
export { default as userService } from './user.service.js';
export { subscriptionService } from './subscription.service.js';
export { playlistService } from './playlist.service.js';
export { tweetService } from './tweet.service.js';
export { dashboardService } from './dashboard.service.js';
export { healthcheckService } from './healthcheck.service.js';

// API export
export { api, api as default } from './api.js';