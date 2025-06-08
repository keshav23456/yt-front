// src/utils/constants.js

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

// File upload constants
export const FILE_LIMITS = {
  VIDEO_MAX_SIZE: 100 * 1024 * 1024, // 100MB
  IMAGE_MAX_SIZE: 5 * 1024 * 1024,   // 5MB
  AVATAR_MAX_SIZE: 2 * 1024 * 1024,  // 2MB
};

export const SUPPORTED_FORMATS = {
  VIDEO: ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'],
  IMAGE: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
  AVATAR: ['jpg', 'jpeg', 'png', 'webp'],
};

// UI Constants
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  UPLOAD: '/upload',
  WATCH: '/watch',
  CHANNEL: '/channel',
  LIKED_VIDEOS: '/liked-videos',
  HISTORY: '/history',
  PLAYLISTS: '/playlists',
  SUBSCRIPTIONS: '/subscriptions',
  TWEETS: '/tweets',
};

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 50,
};

export const VIDEO_STATUS = {
  PUBLISHED: 'published',
  UNPUBLISHED: 'unpublished',
  DRAFT: 'draft',
};

export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
};

export const LOCAL_STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_PREFERENCES: 'user_preferences',
  THEME: 'theme',
  WATCH_HISTORY: 'watch_history',
};

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'Please log in to continue.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Something went wrong. Please try again later.',
  FILE_TOO_LARGE: 'File size exceeds the maximum limit.',
  INVALID_FILE_TYPE: 'Invalid file type.',
  VALIDATION_ERROR: 'Please check your input and try again.',
};

export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Logged in successfully!',
  SIGNUP_SUCCESS: 'Account created successfully!',
  VIDEO_UPLOADED: 'Video uploaded successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  COMMENT_ADDED: 'Comment added successfully!',
  PLAYLIST_CREATED: 'Playlist created successfully!',
};

export const LOADING_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
};

export const COMMENT_ACTIONS = {
  ADD: 'add',
  EDIT: 'edit',
  DELETE: 'delete',
  REPLY: 'reply',
};

export const SORT_OPTIONS = {
  NEWEST: 'newest',
  OLDEST: 'oldest',
  MOST_LIKED: 'most_liked',
  MOST_VIEWED: 'most_viewed',
};

export const VIDEO_QUALITY = {
  AUTO: 'auto',
  HD: '720p',
  FULL_HD: '1080p',
  STANDARD: '480p',
  LOW: '360p',
};
