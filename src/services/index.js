export { 
  register, 
  login, 
  logout, 
  refreshToken, 
  getCurrentUser, 
  // changePassword 
} from './auth.service.js';

export { 
  // getCurrentUser,
  getUserChannel,
  getChannelVideos,
  getWatchHistory,
  updateUserAccount,
  updateAccountDetails,
  updateUserAvatar,
  updateAvatar,
  updateUserCoverImage,
  updateCoverImage,
  changePassword,
  getUserProfile,
  searchUsers
} from './user.service.js';

export { 
  getAllVideos, 
  uploadVideo, 
  getVideoById, 
  updateVideo, 
  deleteVideo, 
  togglePublishStatus 
} from './video.service.js';

export { 
  getVideoComments, 
  addComment, 
  updateComment, 
  deleteComment 
} from './comment.service.js';

export { 
  toggleVideoLike, 
  toggleCommentLike, 
  toggleTweetLike, 
  getLikedVideos 
} from './like.service.js';

export { 
  toggleSubscription, 
  getSubscribedChannels, 
  getChannelSubscribers 
} from './subscription.service.js';

export { 
  createPlaylist, 
  getPlaylistById, 
  updatePlaylist, 
  deletePlaylist, 
  addVideoToPlaylist, 
  removeVideoFromPlaylist, 
  getUserPlaylists 
} from './playlist.service.js';

export { 
  createTweet, 
  getUserTweets, 
  updateTweet, 
  deleteTweet 
} from './tweet.service.js';

export { 
  getChannelStats, 
  // getChannelVideos 
} from './dashboard.service.js';

export { 
  healthcheck 
} from './healthcheck.service.js';

// Service object exports
export { authService } from './auth.service.js';
import userService from './user.service.js';
export { userService };

export { videoService } from './video.service.js';
export { commentService } from './comment.service.js';
export { likeService } from './like.service.js';
export { subscriptionService } from './subscription.service.js';
export { playlistService } from './playlist.service.js';
export { tweetService } from './tweet.service.js';
export { dashboardService } from './dashboard.service.js';
export { healthcheckService } from './healthcheck.service.js';

// API export
export { api, api as default } from './api.js';