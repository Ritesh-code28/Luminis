const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { generateUsername } = require('../utils/usernameGenerator');

/**
 * Authentication Controller
 * Handles user signup, login, and session management
 */

/**
 * @desc    Register a new user
 * @route   POST /api/signup
 * @access  Public
 */
const signup = async (req, res) => {
  try {
    const { username, password, happyChoice } = req.body;

    // Validate input
    if (!username || username.trim().length < 3) {
      return res.status(400).json({
        success: false,
        message: 'Username must be at least 3 characters long',
        error: 'INVALID_USERNAME'
      });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
        error: 'INVALID_PASSWORD'
      });
    }

    // Check if username already exists
    const existingUser = await User.findByUsername(username.trim());
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Username already taken',
        error: 'USERNAME_EXISTS'
      });
    }

    // Create new user
    const userData = {
      username: username.trim(),
      password: password, // Will be hashed by pre-save middleware
      happyChoice: happyChoice || 'peaceful'
    };

    const user = await User.createUser(userData);

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id,
        username: user.username 
      },
      process.env.JWT_SECRET,
      { 
        expiresIn: process.env.JWT_EXPIRE || '7d' 
      }
    );

    // Store token in user document
    await user.addActiveToken(token);

    // Send automatic friend request from FINN
    await sendFinnFriendRequest(user.username);

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        user: user.toPublicProfile(),
        token,
        expiresIn: process.env.JWT_EXPIRE || '7d'
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during signup',
      error: process.env.NODE_ENV === 'development' ? error.message : 'SIGNUP_ERROR'
    });
  }
};

/**
 * @desc    Login existing user
 * @route   POST /api/login
 * @access  Public
 */
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || username.trim().length < 3) {
      return res.status(400).json({
        success: false,
        message: 'Valid username is required',
        error: 'INVALID_USERNAME'
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Password is required',
        error: 'INVALID_PASSWORD'
      });
    }

    // Find user (need to include password for authentication)
    const user = await User.findOne({ username: username.trim(), isActive: true }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password',
        error: 'INVALID_CREDENTIALS'
      });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password',
        error: 'INVALID_CREDENTIALS'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id,
        username: user.username 
      },
      process.env.JWT_SECRET,
      { 
        expiresIn: process.env.JWT_EXPIRE || '7d' 
      }
    );

    // Store token in user document
    await user.addActiveToken(token);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: user.toPublicProfile(),
        token,
        expiresIn: process.env.JWT_EXPIRE || '7d'
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during login',
      error: process.env.NODE_ENV === 'development' ? error.message : 'LOGIN_ERROR'
    });
  }
};

/**
 * @desc    Logout user (invalidate token)
 * @route   POST /api/logout
 * @access  Private
 */
const logout = async (req, res) => {
  try {
    const { user, token } = req; // From auth middleware

    // Remove the current token from active tokens
    user.activeTokens = user.activeTokens.filter(
      activeToken => activeToken.token !== token
    );
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Logout successful'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during logout',
      error: process.env.NODE_ENV === 'development' ? error.message : 'LOGOUT_ERROR'
    });
  }
};

/**
 * @desc    Get current user profile
 * @route   GET /api/me
 * @access  Private
 */
const getMe = async (req, res) => {
  try {
    const { user } = req; // From auth middleware

    res.status(200).json({
      success: true,
      data: {
        user: user.toPublicProfile()
      }
    });

  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'GET_USER_ERROR'
    });
  }
};

/**
 * @desc    Refresh user token
 * @route   POST /api/refresh-token
 * @access  Private
 */
const refreshToken = async (req, res) => {
  try {
    const { user } = req; // From auth middleware

    // Generate new JWT token
    const newToken = jwt.sign(
      { 
        userId: user._id,
        username: user.username 
      },
      process.env.JWT_SECRET,
      { 
        expiresIn: process.env.JWT_EXPIRE || '7d' 
      }
    );

    // Replace old token with new one
    const currentToken = req.token;
    const tokenIndex = user.activeTokens.findIndex(
      activeToken => activeToken.token === currentToken
    );

    if (tokenIndex !== -1) {
      user.activeTokens[tokenIndex].token = newToken;
      user.activeTokens[tokenIndex].createdAt = new Date();
    } else {
      await user.addActiveToken(newToken);
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        token: newToken,
        expiresIn: process.env.JWT_EXPIRE || '7d'
      }
    });

  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during token refresh',
      error: process.env.NODE_ENV === 'development' ? error.message : 'REFRESH_TOKEN_ERROR'
    });
  }
};

/**
 * Helper function to send automatic friend request from FINN
 */
const sendFinnFriendRequest = async (username) => {
  try {
    // Find or create FINN user if not exists
    let finnUser = await User.findByUsername('FINN');
    
    if (!finnUser) {
      // Create FINN user
      finnUser = await User.createUser({
        username: 'FINN',
        password: 'finn_secure_password_2024', // FINN's secure password
        happyChoice: 'inspired',
        bio: 'Friendly dolphin spreading joy and wisdom across the digital seas. Always here to help fellow Echo travelers find their peaceful path. 🌊✨',
        bloom: '🐬',
        bloomStyle: 'cosmic',
        colorPalette: 'teal'
      });
    }

    // Find the new user and send friend request
    const newUser = await User.findByUsername(username);
    if (newUser) {
      await newUser.addFriendRequest(
        'FINN',
        'Hey! Welcome to Echo! Would love to connect with you and help you get started on your peaceful journey. 🐬✨'
      );
    }

  } catch (error) {
    console.error('Error sending FINN friend request:', error);
    // Don't throw error as this shouldn't break signup process
  }
};

module.exports = {
  signup,
  login,
  logout,
  getMe,
  refreshToken
};