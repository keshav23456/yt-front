// src/utils/validators.js

/**
 * Email validation regex
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Username validation regex (alphanumeric, underscore, hyphen, 3-20 chars)
 */
const USERNAME_REGEX = /^[a-zA-Z0-9_-]{3,20}$/;

/**
 * Password validation regex (at least 8 chars, 1 uppercase, 1 lowercase, 1 number)
 */
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;

/**
 * URL validation regex
 */
const URL_REGEX = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {Object} Validation result
 */
export const validateEmail = (email) => {
  const errors = [];
  
  if (!email) {
    errors.push('Email is required');
  } else if (!EMAIL_REGEX.test(email)) {
    errors.push('Please enter a valid email address');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate username
 * @param {string} username - Username to validate
 * @returns {Object} Validation result
 */
export const validateUsername = (username) => {
  const errors = [];
  
  if (!username) {
    errors.push('Username is required');
  } else {
    if (username.length < 3) {
      errors.push('Username must be at least 3 characters long');
    } else if (username.length > 20) {
      errors.push('Username must be no more than 20 characters long');
    } else if (!USERNAME_REGEX.test(username)) {
      errors.push('Username can only contain letters, numbers, underscores, and hyphens');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate password
 * @param {string} password - Password to validate
 * @param {Object} options - Validation options
 * @returns {Object} Validation result
 */
export const validatePassword = (password, options = {}) => {
  const {
    minLength = 8,
    requireUppercase = true,
    requireLowercase = true,
    requireNumbers = true,
    requireSpecialChars = false
  } = options;
  
  const errors = [];
  
  if (!password) {
    errors.push('Password is required');
    return { isValid: false, errors };
  }
  
  if (password.length < minLength) {
    errors.push(`Password must be at least ${minLength} characters long`);
  }
  
  if (requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (requireNumbers && !/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (requireSpecialChars && !/[@$!%*?&]/.test(password)) {
    errors.push('Password must contain at least one special character (@$!%*?&)');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate password confirmation
 * @param {string} password - Original password
 * @param {string} confirmPassword - Password confirmation
 * @returns {Object} Validation result
 */
export const validatePasswordConfirmation = (password, confirmPassword) => {
  const errors = [];
  
  if (!confirmPassword) {
    errors.push('Please confirm your password');
  } else if (password !== confirmPassword) {
    errors.push('Passwords do not match');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate full name
 * @param {string} fullName - Full name to validate
 * @returns {Object} Validation result
 */
export const validateFullName = (fullName) => {
  const errors = [];
  
  if (!fullName) {
    errors.push('Full name is required');
  } else {
    if (fullName.trim().length < 2) {
      errors.push('Full name must be at least 2 characters long');
    } else if (fullName.trim().length > 50) {
      errors.push('Full name must be no more than 50 characters long');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate video title
 * @param {string} title - Video title to validate
 * @returns {Object} Validation result
 */
export const validateVideoTitle = (title) => {
  const errors = [];
  
  if (!title) {
    errors.push('Video title is required');
  } else {
    if (title.trim().length < 3) {
      errors.push('Video title must be at least 3 characters long');
    } else if (title.trim().length > 100) {
      errors.push('Video title must be no more than 100 characters long');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate video description
 * @param {string} description - Video description to validate
 * @returns {Object} Validation result
 */
export const validateVideoDescription = (description) => {
  const errors = [];
  
  if (description && description.trim().length > 5000) {
    errors.push('Video description must be no more than 5000 characters long');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate comment content
 * @param {string} content - Comment content to validate
 * @returns {Object} Validation result
 */
export const validateCommentContent = (content) => {
  const errors = [];
  
  if (!content) {
    errors.push('Comment cannot be empty');
  } else {
    if (content.trim().length < 1) {
      errors.push('Comment cannot be empty');
    } else if (content.trim().length > 1000) {
      errors.push('Comment must be no more than 1000 characters long');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate tweet content
 * @param {string} content - Tweet content to validate
 * @returns {Object} Validation result
 */
export const validateTweetContent = (content) => {
  const errors = [];
  
  if (!content) {
    errors.push('Tweet cannot be empty');
  } else {
    if (content.trim().length < 1) {
      errors.push('Tweet cannot be empty');
    } else if (content.trim().length > 280) {
      errors.push('Tweet must be no more than 280 characters long');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate playlist name
 * @param {string} name - Playlist name to validate
 * @returns {Object} Validation result
 */
export const validatePlaylistName = (name) => {
  const errors = [];
  
  if (!name) {
    errors.push('Playlist name is required');
  } else {
    if (name.trim().length < 3) {
      errors.push('Playlist name must be at least 3 characters long');
    } else if (name.trim().length > 100) {
      errors.push('Playlist name must be no more than 100 characters long');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate playlist description
 * @param {string} description - Playlist description to validate
 * @returns {Object} Validation result
 */
export const validatePlaylistDescription = (description) => {
  const errors = [];
  
  if (description && description.trim().length > 1000) {
    errors.push('Playlist description must be no more than 1000 characters long');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate URL
 * @param {string} url - URL to validate
 * @returns {Object} Validation result
 */
export const validateUrl = (url) => {
  const errors = [];
  
  if (url && !URL_REGEX.test(url)) {
    errors.push('Please enter a valid URL');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate required field
 * @param {*} value - Value to validate
 * @param {string} fieldName - Field name for error message
 * @returns {Object} Validation result
 */
export const validateRequired = (value, fieldName = 'Field') => {
  const errors = [];
  
  if (!value || (typeof value === 'string' && value.trim().length === 0)) {
    errors.push(`${fieldName} is required`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate form with multiple fields
 * @param {Object} formData - Form data to validate
 * @param {Object} validationRules - Validation rules
 * @returns {Object} Validation result
 */
export const validateForm = (formData, validationRules) => {
  const errors = {};
  let isValid = true;
  
  for (const [field, rules] of Object.entries(validationRules)) {
    const value = formData[field];
    const fieldErrors = [];
    
    for (const rule of rules) {
      const result = rule(value);
      if (!result.isValid) {
        fieldErrors.push(...result.errors);
      }
    }
    
    if (fieldErrors.length > 0) {
      errors[field] = fieldErrors;
      isValid = false;
    }
  }
  
  return {
    isValid,
    errors
  };
};

/**
 * Common validation rule sets
 */
export const validationRules = {
  // Registration form
  registration: {
    username: [validateUsername],
    email: [validateEmail],
    password: [validatePassword],
    fullName: [validateFullName]
  },
  
  // Login form
  login: {
    email: [validateEmail],
    password: [(value) => validateRequired(value, 'Password')]
  },
  
  // Video upload form
  videoUpload: {
    title: [validateVideoTitle],
    description: [validateVideoDescription]
  },
  
  // Comment form
  comment: {
    content: [validateCommentContent]
  },
  
  // Tweet form
  tweet: {
    content: [validateTweetContent]
  },
  
  // Playlist form
  playlist: {
    name: [validatePlaylistName],
    description: [validatePlaylistDescription]
  },
  
  // Profile update form
  profileUpdate: {
    fullName: [validateFullName],
    email: [validateEmail]
  },
  
  // Password change form
  passwordChange: {
    oldPassword: [(value) => validateRequired(value, 'Current password')],
    newPassword: [validatePassword]
  }
};