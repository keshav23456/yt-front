// src/utils/file.utils.js

import { FILE_LIMITS, SUPPORTED_FORMATS, ERROR_MESSAGES } from './constants';

/**
 * Validate file type and size
 * @param {File} file - File to validate
 * @param {string} type - Expected file type (video, image, avatar)
 * @returns {Object} Validation result
 */
export const validateFile = (file, type = 'image') => {
  if (!file) {
    return { isValid: false, error: 'No file selected' };
  }

  const extension = getFileExtension(file.name);
  const typeKey = type.toUpperCase();
  const allowedFormats = SUPPORTED_FORMATS[typeKey] || SUPPORTED_FORMATS.IMAGE;
  const maxSize = FILE_LIMITS[`${typeKey}_MAX_SIZE`] || FILE_LIMITS.IMAGE_MAX_SIZE;

  // Check file type
  if (!allowedFormats.includes(extension)) {
    return {
      isValid: false,
      error: `Invalid file type. Allowed formats: ${allowedFormats.join(', ')}`
    };
  }

  // Check file size
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `File size exceeds maximum limit of ${formatFileSize(maxSize)}`
    };
  }

  return { isValid: true };
};

/**
 * Get file extension from filename
 * @param {string} filename - File name
 * @returns {string} File extension in lowercase
 */
export const getFileExtension = (filename) => {
  if (!filename) return '';
  return filename.split('.').pop().toLowerCase();
};

/**
 * Get MIME type from file extension
 * @param {string} extension - File extension
 * @returns {string} MIME type
 */
export const getMimeTypeFromExtension = (extension) => {
  const mimeTypes = {
    // Images
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    svg: 'image/svg+xml',
    
    // Videos
    mp4: 'video/mp4',
    avi: 'video/x-msvideo',
    mov: 'video/quicktime',
    wmv: 'video/x-ms-wmv',
    flv: 'video/x-flv',
    webm: 'video/webm',
    
    // Audio
    mp3: 'audio/mpeg',
    wav: 'audio/wav',
    ogg: 'audio/ogg',
    
    // Documents
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    txt: 'text/plain'
  };
  
  return mimeTypes[extension.toLowerCase()] || 'application/octet-stream';
};

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
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

/**
 * Create file preview URL
 * @param {File} file - File object
 * @returns {string} Preview URL
 */
export const createFilePreview = (file) => {
  if (!file) return null;
  return URL.createObjectURL(file);
};

/**
 * Revoke file preview URL to free memory
 * @param {string} url - Preview URL to revoke
 */
export const revokeFilePreview = (url) => {
  if (url) {
    URL.revokeObjectURL(url);
  }
};

/**
 * Check if file is an image
 * @param {File} file - File object
 * @returns {boolean} Is image file
 */
export const isImageFile = (file) => {
  if (!file) return false;
  const extension = getFileExtension(file.name);
  return SUPPORTED_FORMATS.IMAGE.includes(extension);
};

/**
 * Check if file is a video
 * @param {File} file - File object
 * @returns {boolean} Is video file
 */
export const isVideoFile = (file) => {
  if (!file) return false;
  const extension = getFileExtension(file.name);
  return SUPPORTED_FORMATS.VIDEO.includes(extension);
};

/**
 * Compress image file
 * @param {File} file - Image file to compress
 * @param {Object} options - Compression options
 * @returns {Promise<File>} Compressed file
 */
export const compressImage = (file, options = {}) => {
  return new Promise((resolve, reject) => {
    const {
      maxWidth = 1920,
      maxHeight = 1080,
      quality = 0.8,
      format = 'jpeg'
    } = options;

    if (!isImageFile(file)) {
      reject(new Error('File is not an image'));
      return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;
      
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }

      // Set canvas dimensions
      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: `image/${format}`,
              lastModified: Date.now()
            });
            resolve(compressedFile);
          } else {
            reject(new Error('Failed to compress image'));
          }
        },
        `image/${format}`,
        quality
      );
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = createFilePreview(file);
  });
};

/**
 * Generate thumbnail from video file
 * @param {File} file - Video file
 * @param {number} timeOffset - Time offset in seconds
 * @returns {Promise<File>} Thumbnail file
 */
export const generateVideoThumbnail = (file, timeOffset = 1) => {
  return new Promise((resolve, reject) => {
    if (!isVideoFile(file)) {
      reject(new Error('File is not a video'));
      return;
    }

    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    video.addEventListener('loadedmetadata', () => {
      video.currentTime = Math.min(timeOffset, video.duration);
    });

    video.addEventListener('seeked', () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      ctx.drawImage(video, 0, 0);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const thumbnailFile = new File(
            [blob],
            `${file.name.split('.')[0]}_thumbnail.jpg`,
            { type: 'image/jpeg', lastModified: Date.now() }
          );
          resolve(thumbnailFile);
        } else {
          reject(new Error('Failed to generate thumbnail'));
        }
      }, 'image/jpeg', 0.8);
    });

    video.addEventListener('error', () => {
      reject(new Error('Failed to load video'));
    });

    video.src = createFilePreview(file);
    video.load();
  });
};

/**
 * Read file as data URL
 * @param {File} file - File to read
 * @returns {Promise<string>} Data URL
 */
export const readFileAsDataURL = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(file);
  });
};

/**
 * Read file as text
 * @param {File} file - File to read
 * @returns {Promise<string>} File content as text
 */
export const readFileAsText = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (e) => reject(e);
    reader.readAsText(file);
  });
};

/**
 * Read file as array buffer
 * @param {File} file - File to read
 * @returns {Promise<ArrayBuffer>} File content as array buffer
 */
export const readFileAsArrayBuffer = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (e) => reject(e);
    reader.readAsArrayBuffer(file);
  });
};

/**
 * Download file from URL
 * @param {string} url - File URL
 * @param {string} filename - Download filename
 */
export const downloadFile = (url, filename) => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || 'download';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Convert data URL to file
 * @param {string} dataUrl - Data URL
 * @param {string} filename - File name
 * @returns {File} File object
 */
export const dataUrlToFile = (dataUrl, filename) => {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  
  return new File([u8arr], filename, { type: mime });
};

/**
 * Create FormData from object with file handling
 * @param {Object} data - Data object
 * @returns {FormData} FormData object
 */
export const createFormData = (data) => {
  const formData = new FormData();
  
  for (const [key, value] of Object.entries(data)) {
    if (value instanceof File) {
      formData.append(key, value);
    } else if (value instanceof FileList) {
      for (let i = 0; i < value.length; i++) {
        formData.append(key, value[i]);
      }
    } else if (Array.isArray(value)) {
      value.forEach((item, index) => {
        if (item instanceof File) {
          formData.append(`${key}[${index}]`, item);
        } else {
          formData.append(`${key}[${index}]`, item);
        }
      });
    } else if (value !== null && value !== undefined) {
      formData.append(key, value);
    }
  }
  
  return formData;
};

/**
 * Get video duration from file
 * @param {File} file - Video file
 * @returns {Promise<number>} Duration in seconds
 */
export const getVideoDuration = (file) => {
  return new Promise((resolve, reject) => {
    if (!isVideoFile(file)) {
      reject(new Error('File is not a video'));
      return;
    }

    const video = document.createElement('video');
    
    video.addEventListener('loadedmetadata', () => {
      resolve(video.duration);
    });
    
    video.addEventListener('error', () => {
      reject(new Error('Failed to load video'));
    });
    
    video.src = createFilePreview(file);
    video.load();
  });
};

/**
 * Validate multiple files
 * @param {FileList|File[]} files - Files to validate
 * @param {string} type - File type
 * @returns {Object} Validation result
 */
export const validateFiles = (files, type = 'image') => {
  const results = [];
  const fileArray = Array.from(files);
  
  for (const file of fileArray) {
    const result = validateFile(file, type);
    results.push({
      file,
      ...result
    });
  }
  
  const validFiles = results.filter(r => r.isValid).map(r => r.file);
  const errors = results.filter(r => !r.isValid).map(r => r.error);
  
  return {
    isValid: errors.length === 0,
    validFiles,
    errors,
    results
  };
};