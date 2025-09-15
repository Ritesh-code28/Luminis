const { validationResult } = require('express-validator');

/**
 * Validation Middleware
 * Handles express-validator results and returns appropriate error responses
 */

/**
 * Middleware to validate request data using express-validator
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    // Format validation errors
    const formattedErrors = errors.array().map(error => ({
      field: error.path || error.param,
      message: error.msg,
      value: error.value
    }));

    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      error: 'VALIDATION_ERROR',
      details: formattedErrors
    });
  }

  next();
};

/**
 * Custom validation helper for MongoDB ObjectIds
 */
const isValidObjectId = (value) => {
  return /^[0-9a-fA-F]{24}$/.test(value);
};

/**
 * Custom validation helper for usernames
 */
const isValidUsername = (value) => {
  if (!value || typeof value !== 'string') {
    return false;
  }
  
  return /^[a-zA-Z0-9_-]{3,30}$/.test(value);
};

/**
 * Custom validation helper for email addresses
 */
const isValidEmail = (value) => {
  if (!value || typeof value !== 'string') {
    return false;
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
};

/**
 * Custom validation helper for Indian mobile numbers
 */
const isValidIndianMobile = (value) => {
  if (!value || typeof value !== 'string') {
    return false;
  }
  
  // Indian mobile number format: +91XXXXXXXXXX or XXXXXXXXXX (10 digits starting with 6-9)
  const mobileRegex = /^(\+91)?[6-9]\d{9}$/;
  return mobileRegex.test(value.replace(/\s+/g, ''));
};

/**
 * Sanitize input data
 */
const sanitizeInput = (req, res, next) => {
  // Remove any null bytes and trim strings
  const sanitizeValue = (value) => {
    if (typeof value === 'string') {
      return value.replace(/\0/g, '').trim();
    }
    if (typeof value === 'object' && value !== null) {
      const sanitized = {};
      for (const key in value) {
        sanitized[key] = sanitizeValue(value[key]);
      }
      return sanitized;
    }
    return value;
  };

  if (req.body) {
    req.body = sanitizeValue(req.body);
  }
  
  if (req.query) {
    req.query = sanitizeValue(req.query);
  }
  
  if (req.params) {
    req.params = sanitizeValue(req.params);
  }

  next();
};

/**
 * Validate pagination parameters
 */
const validatePagination = (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;
  
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  
  if (isNaN(pageNum) || pageNum < 1) {
    return res.status(400).json({
      success: false,
      message: 'Page must be a positive integer',
      error: 'INVALID_PAGE'
    });
  }
  
  if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
    return res.status(400).json({
      success: false,
      message: 'Limit must be between 1 and 100',
      error: 'INVALID_LIMIT'
    });
  }
  
  req.pagination = {
    page: pageNum,
    limit: limitNum,
    skip: (pageNum - 1) * limitNum
  };
  
  next();
};

/**
 * Validate sort parameters
 */
const validateSort = (allowedFields = []) => {
  return (req, res, next) => {
    const { sortBy, order = 'desc' } = req.query;
    
    if (sortBy && !allowedFields.includes(sortBy)) {
      return res.status(400).json({
        success: false,
        message: `Invalid sort field. Allowed fields: ${allowedFields.join(', ')}`,
        error: 'INVALID_SORT_FIELD'
      });
    }
    
    if (order && !['asc', 'desc'].includes(order.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: 'Order must be either asc or desc',
        error: 'INVALID_SORT_ORDER'
      });
    }
    
    req.sort = {
      field: sortBy || allowedFields[0] || 'createdAt',
      order: order.toLowerCase() === 'asc' ? 1 : -1
    };
    
    next();
  };
};

/**
 * Validate content length for messages and posts
 */
const validateContentLength = (minLength = 1, maxLength = 1000) => {
  return (req, res, next) => {
    const content = req.body.message || req.body.body || req.body.content;
    
    if (!content || typeof content !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Content is required',
        error: 'MISSING_CONTENT'
      });
    }
    
    const trimmedContent = content.trim();
    
    if (trimmedContent.length < minLength) {
      return res.status(400).json({
        success: false,
        message: `Content must be at least ${minLength} characters long`,
        error: 'CONTENT_TOO_SHORT'
      });
    }
    
    if (trimmedContent.length > maxLength) {
      return res.status(400).json({
        success: false,
        message: `Content cannot exceed ${maxLength} characters`,
        error: 'CONTENT_TOO_LONG'
      });
    }
    
    next();
  };
};

/**
 * Custom error formatter for consistent API responses
 */
const formatValidationErrors = (errors) => {
  const formatted = {};
  
  errors.forEach(error => {
    const field = error.path || error.param;
    if (!formatted[field]) {
      formatted[field] = [];
    }
    formatted[field].push(error.msg);
  });
  
  return formatted;
};

module.exports = {
  validate,
  sanitizeInput,
  validatePagination,
  validateSort,
  validateContentLength,
  isValidObjectId,
  isValidUsername,
  isValidEmail,
  isValidIndianMobile,
  formatValidationErrors
};