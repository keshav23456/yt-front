// src/utils/formatters.js

/**
 * Format file size in bytes to human readable format
 * @param {number} bytes - File size in bytes
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted file size
 */
export const formatFileSize = (bytes, decimals = 2) => {
    if (!bytes || bytes === 0) return '0 Bytes';
  
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  
    const i = Math.floor(Math.log(bytes) / Math.log(k));
  
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };
  
  /**
   * Format duration in seconds to HH:MM:SS or MM:SS
   * @param {number} seconds - Duration in seconds
   * @returns {string} Formatted duration
   */
  export const formatDuration = (seconds) => {
    if (!seconds || seconds < 0) return '0:00';
  
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);
  
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    } else {
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
  };
  
  /**
   * Format number with commas (e.g., 1,234,567)
   * @param {number} num - Number to format
   * @returns {string} Formatted number
   */
  export const formatNumber = (num) => {
    if (!num && num !== 0) return '0';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };
  
  /**
   * Format large numbers with K, M, B suffixes
   * @param {number} num - Number to format
   * @param {number} digits - Number of decimal places
   * @returns {string} Formatted number
   */
  export const formatCompactNumber = (num, digits = 1) => {
    if (!num && num !== 0) return '0';
  
    const lookup = [
      { value: 1, symbol: '' },
      { value: 1e3, symbol: 'K' },
      { value: 1e6, symbol: 'M' },
      { value: 1e9, symbol: 'B' },
      { value: 1e12, symbol: 'T' }
    ];
  
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    const item = lookup.slice().reverse().find(item => num >= item.value);
    
    return item ? (num / item.value).toFixed(digits).replace(rx, '$1') + item.symbol : '0';
  };
  
  /**
   * Format date to relative time (e.g., "2 hours ago", "3 days ago")
   * @param {Date|string} date - Date to format
   * @returns {string} Formatted relative time
   */
  export const formatRelativeTime = (date) => {
    if (!date) return '';
  
    const now = new Date();
    const targetDate = new Date(date);
    const diffInSeconds = Math.floor((now - targetDate) / 1000);
  
    if (diffInSeconds < 60) {
      return 'Just now';
    }
  
    const intervals = [
      { label: 'year', seconds: 31536000 },
      { label: 'month', seconds: 2592000 },
      { label: 'week', seconds: 604800 },
      { label: 'day', seconds: 86400 },
      { label: 'hour', seconds: 3600 },
      { label: 'minute', seconds: 60 }
    ];
  
    for (const interval of intervals) {
      const count = Math.floor(diffInSeconds / interval.seconds);
      if (count >= 1) {
        return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
      }
    }
  
    return 'Just now';
  };
  
  /**
   * Format date to readable string
   * @param {Date|string} date - Date to format
   * @param {Object} options - Formatting options
   * @returns {string} Formatted date
   */
  export const formatDate = (date, options = {}) => {
    if (!date) return '';
  
    const defaultOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      ...options
    };
  
    return new Date(date).toLocaleDateString('en-US', defaultOptions);
  };
  
  /**
   * Format date and time
   * @param {Date|string} date - Date to format
   * @param {Object} options - Formatting options
   * @returns {string} Formatted date and time
   */
  export const formatDateTime = (date, options = {}) => {
    if (!date) return '';
  
    const defaultOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      ...options
    };
  
    return new Date(date).toLocaleString('en-US', defaultOptions);
  };
  
  /**
   * Format currency
   * @param {number} amount - Amount to format
   * @param {string} currency - Currency code
   * @param {string} locale - Locale
   * @returns {string} Formatted currency
   */
  export const formatCurrency = (amount, currency = 'USD', locale = 'en-US') => {
    if (!amount && amount !== 0) return '$0.00';
  
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency
    }).format(amount);
  };
  
  /**
   * Format percentage
   * @param {number} value - Value to format as percentage
   * @param {number} decimals - Number of decimal places
   * @returns {string} Formatted percentage
   */
  export const formatPercentage = (value, decimals = 1) => {
    if (!value && value !== 0) return '0%';
    return `${(value * 100).toFixed(decimals)}%`;
  };
  
  /**
   * Format phone number
   * @param {string} phoneNumber - Phone number to format
   * @returns {string} Formatted phone number
   */
  export const formatPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return '';
  
    const cleaned = phoneNumber.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    
    return phoneNumber;
  };
  
  /**
   * Format URL for display (remove protocol and trailing slash)
   * @param {string} url - URL to format
   * @returns {string} Formatted URL
   */
  export const formatUrl = (url) => {
    if (!url) return '';
    
    return url
      .replace(/^https?:\/\//, '')
      .replace(/\/$/, '');
  };
  
  /**
   * Format username for display (add @ prefix if not present)
   * @param {string} username - Username to format
   * @returns {string} Formatted username
   */
  export const formatUsername = (username) => {
    if (!username) return '';
    return username.startsWith('@') ? username : `@${username}`;
  };
  
  /**
   * Format video views count
   * @param {number} views - Number of views
   * @returns {string} Formatted views
   */
  export const formatViews = (views) => {
    if (!views && views !== 0) return '0 views';
    
    const formatted = formatCompactNumber(views);
    return `${formatted} view${views === 1 ? '' : 's'}`;
  };
  
  /**
   * Format likes count
   * @param {number} likes - Number of likes
   * @returns {string} Formatted likes
   */
  export const formatLikes = (likes) => {
    if (!likes && likes !== 0) return '0';
    return formatCompactNumber(likes);
  };
  
  /**
   * Format subscribers count
   * @param {number} subscribers - Number of subscribers
   * @returns {string} Formatted subscribers
   */
  export const formatSubscribers = (subscribers) => {
    if (!subscribers && subscribers !== 0) return '0 subscribers';
    
    const formatted = formatCompactNumber(subscribers);
    return `${formatted} subscriber${subscribers === 1 ? '' : 's'}`;
  };
  
  /**
   * Format comment count
   * @param {number} comments - Number of comments
   * @returns {string} Formatted comments
   */
  export const formatComments = (comments) => {
    if (!comments && comments !== 0) return '0 comments';
    
    const formatted = formatCompactNumber(comments);
    return `${formatted} comment${comments === 1 ? '' : 's'}`;
  };
  
  /**
   * Format playlist count
   * @param {number} count - Number of videos in playlist
   * @returns {string} Formatted count
   */
  export const formatPlaylistCount = (count) => {
    if (!count && count !== 0) return '0 videos';
    
    const formatted = formatCompactNumber(count);
    return `${formatted} video${count === 1 ? '' : 's'}`;
  };
  
  /**
   * Truncate and format text for display
   * @param {string} text - Text to format
   * @param {number} maxLength - Maximum length
   * @param {boolean} addEllipsis - Add ellipsis if truncated
   * @returns {string} Formatted text
   */
  export const formatDisplayText = (text, maxLength = 100, addEllipsis = true) => {
    if (!text) return '';
    
    if (text.length <= maxLength) {
      return text;
    }
    
    const truncated = text.substring(0, maxLength).trim();
    return addEllipsis ? `${truncated}...` : truncated;
  };
  
  /**
   * Format upload progress percentage
   * @param {number} loaded - Bytes uploaded
   * @param {number} total - Total bytes
   * @returns {string} Formatted progress
   */
  export const formatUploadProgress = (loaded, total) => {
    if (!total) return '0%';
    const percentage = Math.round((loaded / total) * 100);
    return `${percentage}%`;
  };