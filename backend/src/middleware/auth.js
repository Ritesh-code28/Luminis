const jwt = require('jsonwebtoken');
const { User } = require('../models');

/**
 * Authentication Middleware
 * Protects routes that require user authentication
 */

/**
 * Middleware to protect routes requiring authentication
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Check for token in cookies (optional)
    if (!token && req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.',
        error: 'NO_TOKEN'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Find user and check if token is still active
      const user = await User.findById(decoded.userId);
      
      if (!user || !user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'User not found or inactive',
          error: 'INVALID_USER'
        });
      }

      // Check if token exists in user's active tokens
      const isTokenActive = user.activeTokens.some(
        activeToken => activeToken.token === token
      );

      if (!isTokenActive) {
        return res.status(401).json({
          success: false,
          message: 'Token is no longer valid',
          error: 'TOKEN_EXPIRED'
        });
      }

      // Attach user and token to request
      req.user = user;
      req.token = token;
      next();

    } catch (jwtError) {
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token has expired',
          error: 'TOKEN_EXPIRED'
        });
      } else if (jwtError.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          message: 'Invalid token',
          error: 'INVALID_TOKEN'
        });
      } else {
        throw jwtError;
      }
    }

  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during authentication',
      error: process.env.NODE_ENV === 'development' ? error.message : 'AUTH_ERROR'
    });
  }
};

/**
 * Middleware to extract user info from token (optional authentication)
 * Used for routes that work both for authenticated and non-authenticated users
 */
const optionalAuth = async (req, res, next) => {
  try {
    let token;

    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Check for token in cookies
    if (!token && req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (token) {
      try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Find user
        const user = await User.findById(decoded.userId);
        
        if (user && user.isActive) {
          // Check if token is active
          const isTokenActive = user.activeTokens.some(
            activeToken => activeToken.token === token
          );

          if (isTokenActive) {
            req.user = user;
            req.token = token;
          }
        }
      } catch (jwtError) {
        // Silent fail for optional auth
        console.log('Optional auth failed:', jwtError.message);
      }
    }

    next();
  } catch (error) {
    console.error('Optional auth middleware error:', error);
    next(); // Continue without authentication
  }
};

/**
 * Middleware to check if user is admin (for future use)
 */
const requireAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
        error: 'AUTH_REQUIRED'
      });
    }

    // For now, FINN is considered admin
    if (req.user.username !== 'FINN') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required',
        error: 'ADMIN_REQUIRED'
      });
    }

    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during admin check',
      error: process.env.NODE_ENV === 'development' ? error.message : 'ADMIN_CHECK_ERROR'
    });
  }
};

/**
 * WebSocket authentication helper
 * Extracts and validates JWT token from WebSocket connection
 */
const authenticateWebSocket = async (token) => {
  try {
    if (!token) {
      throw new Error('No token provided');
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user
    const user = await User.findById(decoded.userId);
    
    if (!user || !user.isActive) {
      throw new Error('User not found or inactive');
    }

    // Check if token is active
    const isTokenActive = user.activeTokens.some(
      activeToken => activeToken.token === token
    );

    if (!isTokenActive) {
      throw new Error('Token is no longer valid');
    }

    return { user, token };
  } catch (error) {
    throw new Error(`WebSocket authentication failed: ${error.message}`);
  }
};

/**
 * Rate limiting helper for WebSocket connections
 */
const createWebSocketRateLimit = (maxMessages = 10, windowMs = 60000) => {
  const clients = new Map();

  return (userId) => {
    const now = Date.now();
    const userRecord = clients.get(userId) || { count: 0, resetTime: now + windowMs };

    // Reset if window has passed
    if (now > userRecord.resetTime) {
      userRecord.count = 0;
      userRecord.resetTime = now + windowMs;
    }

    userRecord.count++;
    clients.set(userId, userRecord);

    // Clean up old records periodically
    if (clients.size > 1000) {
      for (const [key, record] of clients.entries()) {
        if (now > record.resetTime) {
          clients.delete(key);
        }
      }
    }

    return userRecord.count <= maxMessages;
  };
};

module.exports = {
  protect,
  optionalAuth,
  requireAdmin,
  authenticateWebSocket,
  createWebSocketRateLimit
};