// // src/utils/helpers.js

// import { FILE_LIMITS, SUPPORTED_FORMATS, ERROR_MESSAGES } from './constants';

// /**
//  * Sleep/delay function
//  * @param {number} ms - Milliseconds to sleep
//  * @returns {Promise}
//  */
// export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// /**
//  * Generate unique ID
//  * @returns {string} Unique identifier
//  */
// export const generateId = () => {
//   return Date.now().toString(36) + Math.random().toString(36).substr(2);
// };

// /**
//  * Deep clone object
//  * @param {*} obj - Object to clone
//  * @returns {*} Cloned object
//  */
// export const deepClone = (obj) => {
//   if (obj === null || typeof obj !== 'object') return obj;
//   if (obj instanceof Date) return new Date(obj.getTime());
//   if (obj instanceof Array) return obj.map(item => deepClone(item));
//   if (typeof obj === 'object') {
//     const clonedObj = {};
//     for (const key in obj) {
//       if (obj.hasOwnProperty(key)) {
//         clonedObj[key] = deepClone(obj[key]);
//       }
//     }
//     return clonedObj;
//   }
// };

// /**
//  * Debounce function
//  * @param {Function} func - Function to debounce
//  * @param {number} wait - Wait time in milliseconds
//  * @param {boolean} immediate - Execute immediately
//  * @returns {Function} Debounced function
//  */
// export const debounce = (func, wait, immediate) => {
//   let timeout;
//   return function executedFunction(...args) {
//     const later = () => {
//       timeout = null;
//       if (!immediate) func(...args);
//     };
//     const callNow = immediate && !timeout;
//     clearTimeout(timeout);
//     timeout = setTimeout(later, wait);
//     if (callNow) func(...args);
//   };
// };

// /**
//  * Throttle function
//  * @param {Function} func - Function to throttle
//  * @param {number} limit - Time limit in milliseconds
//  * @returns {Function} Throttled function
//  */
// export const throttle = (func, limit) => {
//   let inThrottle;
//   return function (...args) {
//     if (!inThrottle) {
//       func.apply(this, args);
//       inThrottle = true;
//       setTimeout(() => (inThrottle = false), limit);
//     }
//   };
// };

// /**
//  * Capitalize first letter
//  * @param {string} str - String to capitalize
//  * @returns {string} Capitalized string
//  */
// export const capitalize = (str) => {
//   if (!str) return '';
//   return str.charAt(0).toUpperCase() + str.slice(1);
// };

// /**
//  * Truncate text
//  * @param {string} text - Text to truncate
//  * @param {number} length - Maximum length
//  * @param {string} suffix - Suffix to add
//  * @returns {string} Truncated text
//  */
// export const truncateText = (text, length = 100, suffix = '...') => {
//   if (!text || text.length <= length) return text;
//   return text.substring(0, length).trim() + suffix;
// };

// /**
//  * Remove HTML tags from string
//  * @param {string} html - HTML string
//  * @returns {string} Plain text
//  */
// export const stripHtml = (html) => {
//   if (!html) return '';
//   return html.replace(/<[^>]*>/g, '');
// };

// /**
//  * Convert string to slug
//  * @param {string} str - String to convert
//  * @returns {string} Slug
//  */
// export const slugify = (str) => {
//   if (!str) return '';
//   return str
//     .toLowerCase()
//     .trim()
//     .replace(/[^\w\s-]/g, '')
//     .replace(/[\s_-]+/g, '-')
//     .replace(/^-+|-+$/g, '');
// };

// /**
//  * Get file extension
//  * @param {string} filename - File name
//  * @returns {string} File extension
//  */
// export const getFileExtension = (filename) => {
//   if (!filename) return '';
//   return filename.split('.').pop().toLowerCase();
// };

// /**
//  * Validate file type and size
//  * @param {File} file - File to validate
//  * @param {string} type - File type (video, image, avatar)
//  * @returns {Object} Validation result
//  */
// export const validateFile = (file, type = 'image') => {
//   if (!file) {
//     return { isValid: false, error: 'No file selected' };
//   }

//   const extension = getFileExtension(file.name);
//   const allowedFormats = SUPPORTED_FORMATS[type.toUpperCase()] || SUPPORTED_FORMATS.IMAGE;
//   const maxSize = FILE_LIMITS[`${type.toUpperCase()}_MAX_SIZE`] || FILE_LIMITS.IMAGE_MAX_SIZE;

//   if (!allowedFormats.includes(extension)) {
//     return {
//       isValid: false,
//       error: `Invalid file type. Allowed formats: ${allowedFormats.join(', ')}`
//     };
//   }

//   if (file.size > maxSize) {
//     return {
//       isValid: false,
//       error: ERROR_MESSAGES.FILE_TOO_LARGE
//     };
//   }

//   return { isValid: true };
// };

// /**
//  * Copy text to clipboard
//  * @param {string} text - Text to copy
//  * @returns {Promise<boolean>} Success status
//  */
// export const copyToClipboard = async (text) => {
//   try {
//     if (navigator.clipboard && window.isSecureContext) {
//       await navigator.clipboard.writeText(text);
//       return true;
//     } else {
//       // Fallback for older browsers
//       const textArea = document.createElement('textarea');
//       textArea.value = text;
//       textArea.style.position = 'fixed';
//       textArea.style.left = '-999999px';
//       textArea.style.top = '-999999px';
//       document.body.appendChild(textArea);
//       textArea.focus();
//       textArea.select();
//       const success = document.execCommand('copy');
//       textArea.remove();
//       return success;
//     }
//   } catch (error) {
//     console.error('Failed to copy text:', error);
//     return false;
//   }
// };

// /**
//  * Check if device is mobile
//  * @returns {boolean} Is mobile device
//  */
// export const isMobile = () => {
//   return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
//     navigator.userAgent
//   );
// };

// /**
//  * Scroll to element
//  * @param {string} elementId - Element ID
//  * @param {Object} options - Scroll options
//  */
// export const scrollToElement = (elementId, options = {}) => {
//   const element = document.getElementById(elementId);
//   if (element) {
//     element.scrollIntoView({
//       behavior: 'smooth',
//       block: 'start',
//       ...options
//     });
//   }
// };

// /**
//  * Generate random color
//  * @returns {string} Hex color
//  */
// export const generateRandomColor = () => {
//   return '#' + Math.floor(Math.random() * 16777215).toString(16);
// };

// /**
//  * Get contrast color (black or white)
//  * @param {string} hexColor - Hex color
//  * @returns {string} Contrast color
//  */
// export const getContrastColor = (hexColor) => {
//   const r = parseInt(hexColor.slice(1, 3), 16);
//   const g = parseInt(hexColor.slice(3, 5), 16);
//   const b = parseInt(hexColor.slice(5, 7), 16);
//   const brightness = (r * 299 + g * 587 + b * 114) / 1000;
//   return brightness > 128 ? '#000000' : '#ffffff';
// };

// /**
//  * Parse URL parameters
//  * @param {string} url - URL to parse
//  * @returns {Object} Parsed parameters
//  */
// export const parseUrlParams = (url = window.location.search) => {
//   const params = new URLSearchParams(url);
//   const result = {};
//   for (const [key, value] of params) {
//     result[key] = value;
//   }
//   return result;
// };

// /**
//  * Build URL with parameters
//  * @param {string} baseUrl - Base URL
//  * @param {Object} params - Parameters object
//  * @returns {string} URL with parameters
//  */
// export const buildUrlWithParams = (baseUrl, params = {}) => {
//   const url = new URL(baseUrl, window.location.origin);
//   Object.keys(params).forEach(key => {
//     if (params[key] !== null && params[key] !== undefined) {
//       url.searchParams.set(key, params[key]);
//     }
//   });
//   return url.toString();
// };

// /**
//  * Check if object is empty
//  * @param {Object} obj - Object to check
//  * @returns {boolean} Is empty
//  */
// export const isEmpty = (obj) => {
//   if (obj == null) return true;
//   if (Array.isArray(obj) || typeof obj === 'string') return obj.length === 0;
//   return Object.keys(obj).length === 0;
// };

// /**
//  * Safe JSON parse
//  * @param {string} str - JSON string
//  * @param {*} defaultValue - Default value if parsing fails
//  * @returns {*} Parsed value or default
//  */
// export const safeJsonParse = (str, defaultValue = null) => {
//   try {
//     return JSON.parse(str);
//   } catch (error) {
//     return defaultValue;
//   }
// };

// Toast notification system
let toastContainer = null;

const createToastContainer = () => {
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
    `;
    document.body.appendChild(toastContainer);
  }
  return toastContainer;
};

export const showToast = (message, type = 'info', duration = 3000) => {
  const container = createToastContainer();
  
  const toast = document.createElement('div');
  toast.style.cssText = `
    padding: 12px 16px;
    border-radius: 8px;
    color: white;
    font-weight: 500;
    max-width: 350px;
    word-wrap: break-word;
    animation: slideIn 0.3s ease-out;
    cursor: pointer;
  `;
  
  // Set background color based on type
  const colors = {
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6'
  };
  
  toast.style.backgroundColor = colors[type] || colors.info;
  toast.textContent = message;
  
  // Add CSS animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(100%); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
  
  container.appendChild(toast);
  
  // Auto remove after duration
  const timeoutId = setTimeout(() => {
    removeToast(toast);
  }, duration);
  
  // Click to dismiss
  toast.onclick = () => {
    clearTimeout(timeoutId);
    removeToast(toast);
  };
};

const removeToast = (toast) => {
  toast.style.animation = 'slideOut 0.3s ease-in';
  setTimeout(() => {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast);
    }
  }, 300);
};

// Format file size
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Format duration (seconds to mm:ss or hh:mm:ss)
export const formatDuration = (seconds) => {
  if (!seconds || seconds < 0) return '0:00';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// Format number with K, M suffixes
export const formatNumber = (num) => {
  if (num < 1000) return num.toString();
  if (num < 1000000) return (num / 1000).toFixed(1) + 'K';
  if (num < 1000000000) return (num / 1000000).toFixed(1) + 'M';
  return (num / 1000000000).toFixed(1) + 'B';
};

// Format date relative to now
export const formatRelativeTime = (date) => {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now - past) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
  return `${Math.floor(diffInSeconds / 31536000)} years ago`;
};

// Format date to readable string
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle function
export const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Copy to clipboard
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    showToast('Copied to clipboard!', 'success');
    return true;
  } catch (err) {
    console.error('Failed to copy: ', err);
    showToast('Failed to copy to clipboard', 'error');
    return false;
  }
};

// Generate random ID
export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

// Validate image file
export const isValidImageFile = (file) => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  return validTypes.includes(file.type);
};

// Validate video file
export const isValidVideoFile = (file) => {
  const validTypes = ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo', 'video/webm'];
  return validTypes.includes(file.type);
};

// Get file extension
export const getFileExtension = (filename) => {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
};

// Truncate text
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Capitalize first letter
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Generate video thumbnail URL
export const getVideoThumbnail = (videoId, quality = 'medium') => {
  const qualities = {
    low: 'mqdefault',
    medium: 'hqdefault',
    high: 'maxresdefault'
  };
  
  return `/api/v1/videos/${videoId}/thumbnail?quality=${qualities[quality] || qualities.medium}`;
};

// Generate user avatar URL
export const getUserAvatar = (user) => {
  if (user?.avatar) {
    return user.avatar;
  }
  return '/assets/default-avatar.png';
};

// Check if user is online (placeholder for future implementation)
export const isUserOnline = (lastSeen) => {
  if (!lastSeen) return false;
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  return new Date(lastSeen) > fiveMinutesAgo;
};