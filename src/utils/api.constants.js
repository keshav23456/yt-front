// src/utils/api.constants.js

export const API_ENDPOINTS = {
    // Health Check
    HEALTH_CHECK: '/healthcheck',
  
    // Authentication & User Management
    AUTH: {
      REGISTER: '/users/register',
      LOGIN: '/users/login',
      LOGOUT: '/users/logout',
      REFRESH_TOKEN: '/users/refresh-token',
      CURRENT_USER: '/users/current-user',
      CHANGE_PASSWORD: '/users/change-password',
      UPDATE_ACCOUNT: '/users/update-account',
      UPDATE_AVATAR: '/users/avatar',
      UPDATE_COVER: '/users/cover-image',
      GET_CHANNEL: (username) => `/users/c/${username}`,
      GET_HISTORY: '/users/history',
    },
  
    // Video Management
    VIDEOS: {
      GET_ALL: '/videos',
      UPLOAD: '/videos',
      GET_BY_ID: (id) => `/videos/${id}`,
      UPDATE: (id) => `/videos/${id}`,
      DELETE: (id) => `/videos/${id}`,
      TOGGLE_PUBLISH: (id) => `/videos/toggle/publish/${id}`,
    },
  
    // Comments
    COMMENTS: {
      GET_BY_VIDEO: (videoId) => `/comments/${videoId}`,
      ADD: (videoId) => `/comments/${videoId}`,
      UPDATE: (commentId) => `/comments/c/${commentId}`,
      DELETE: (commentId) => `/comments/c/${commentId}`,
    },
  
    // Likes
    LIKES: {
      TOGGLE_VIDEO: (videoId) => `/likes/toggle/v/${videoId}`,
      TOGGLE_COMMENT: (commentId) => `/likes/toggle/c/${commentId}`,
      TOGGLE_TWEET: (tweetId) => `/likes/toggle/t/${tweetId}`,
      GET_LIKED_VIDEOS: '/likes/videos',
    },
  
    // Playlists
    PLAYLISTS: {
      CREATE: '/playlist',
      GET_BY_ID: (id) => `/playlist/${id}`,
      UPDATE: (id) => `/playlist/${id}`,
      DELETE: (id) => `/playlist/${id}`,
      ADD_VIDEO: (videoId, playlistId) => `/playlist/add/${videoId}/${playlistId}`,
      REMOVE_VIDEO: (videoId, playlistId) => `/playlist/remove/${videoId}/${playlistId}`,
      GET_USER_PLAYLISTS: (userId) => `/playlist/user/${userId}`,
    },
  
    // Subscriptions
    SUBSCRIPTIONS: {
      TOGGLE: (channelId) => `/subscriptions/c/${channelId}`,
      GET_SUBSCRIBED: (channelId) => `/subscriptions/c/${channelId}`,
      GET_SUBSCRIBERS: (subscriberId) => `/subscriptions/u/${subscriberId}`,
    },
  
    // Tweets
    TWEETS: {
      CREATE: '/tweets',
      GET_USER_TWEETS: (userId) => `/tweets/user/${userId}`,
      UPDATE: (tweetId) => `/tweets/${tweetId}`,
      DELETE: (tweetId) => `/tweets/${tweetId}`,
    },
  
    // Dashboard
    DASHBOARD: {
      GET_STATS: '/dashboard/stats',
      GET_VIDEOS: '/dashboard/videos',
    },
  };
  
  export const HTTP_METHODS = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    PATCH: 'PATCH',
    DELETE: 'DELETE',
  };
  
  export const CONTENT_TYPES = {
    JSON: 'application/json',
    FORM_DATA: 'multipart/form-data',
    URL_ENCODED: 'application/x-www-form-urlencoded',
  };
  
  export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    INTERNAL_SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503,
  };
  
  export const REQUEST_TIMEOUT = 30000; // 30 seconds
  
  export const RETRY_CONFIG = {
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000, // 1 second
    BACKOFF_MULTIPLIER: 2,
  };