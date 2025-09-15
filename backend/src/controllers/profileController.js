const { User } = require('../models');

/**
 * Profile Controller
 * Handles user profile management and customization
 */

/**
 * @desc    Get user profile by username
 * @route   GET /api/profile/:username
 * @access  Public
 */
const getUserProfile = async (req, res) => {
  try {
    const { username } = req.params;

    // Find the user
    const user = await User.findByUsername(username);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        error: 'USER_NOT_FOUND'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        profile: user.toPublicProfile()
      }
    });

  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching profile',
      error: process.env.NODE_ENV === 'development' ? error.message : 'GET_PROFILE_ERROR'
    });
  }
};

/**
 * @desc    Edit user profile
 * @route   POST /api/profile/:username/edit
 * @access  Private
 */
const editUserProfile = async (req, res) => {
  try {
    const { username } = req.params;
    const { user } = req; // From auth middleware
    const { bio, bloom, bloomStyle, colorPalette, happyChoice } = req.body;

    // Check if user is editing their own profile
    if (username !== user.username) {
      return res.status(403).json({
        success: false,
        message: 'You can only edit your own profile',
        error: 'UNAUTHORIZED_EDIT'
      });
    }

    // Find the user
    const currentUser = await User.findByUsername(username);
    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        error: 'USER_NOT_FOUND'
      });
    }

    // Update allowed fields
    if (bio !== undefined) {
      if (bio.length > 500) {
        return res.status(400).json({
          success: false,
          message: 'Bio cannot exceed 500 characters',
          error: 'BIO_TOO_LONG'
        });
      }
      currentUser.bio = bio.trim();
    }

    if (bloom !== undefined) {
      currentUser.bloom = bloom;
    }

    if (bloomStyle !== undefined) {
      const validBloomStyles = ['serene', 'vibrant', 'nature', 'cosmic', 'gentle', 'creative', 'wisdom'];
      if (!validBloomStyles.includes(bloomStyle)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid bloom style',
          error: 'INVALID_BLOOM_STYLE'
        });
      }
      currentUser.bloomStyle = bloomStyle;
    }

    if (colorPalette !== undefined) {
      const validColorPalettes = ['sage', 'lavender', 'blush', 'mint', 'cream', 'silver', 'charcoal', 'teal'];
      if (!validColorPalettes.includes(colorPalette)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid color palette',
          error: 'INVALID_COLOR_PALETTE'
        });
      }
      currentUser.colorPalette = colorPalette;
    }

    if (happyChoice !== undefined) {
      const validHappyChoices = ['happy', 'calm', 'inspired', 'peaceful', 'creative', 'thoughtful', 'grateful'];
      if (!validHappyChoices.includes(happyChoice)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid happiness choice',
          error: 'INVALID_HAPPY_CHOICE'
        });
      }
      currentUser.happyChoice = happyChoice;
    }

    // Save the updated user
    await currentUser.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        profile: currentUser.toPublicProfile()
      }
    });

  } catch (error) {
    console.error('Edit user profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while updating profile',
      error: process.env.NODE_ENV === 'development' ? error.message : 'EDIT_PROFILE_ERROR'
    });
  }
};

/**
 * @desc    Get user's joined streams
 * @route   GET /api/profile/:username/streams
 * @access  Public
 */
const getUserStreams = async (req, res) => {
  try {
    const { username } = req.params;

    // Find the user
    const user = await User.findByUsername(username);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        error: 'USER_NOT_FOUND'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        username: user.username,
        joinedStreams: user.joinedStreams,
        totalStreams: user.joinedStreams.length
      }
    });

  } catch (error) {
    console.error('Get user streams error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching user streams',
      error: process.env.NODE_ENV === 'development' ? error.message : 'GET_USER_STREAMS_ERROR'
    });
  }
};

/**
 * @desc    Join a stream
 * @route   POST /api/profile/:username/streams/join
 * @access  Private
 */
const joinStream = async (req, res) => {
  try {
    const { username } = req.params;
    const { user } = req; // From auth middleware
    const { streamName } = req.body;

    // Check if user is modifying their own streams
    if (username !== user.username) {
      return res.status(403).json({
        success: false,
        message: 'You can only modify your own streams',
        error: 'UNAUTHORIZED_ACTION'
      });
    }

    if (!streamName) {
      return res.status(400).json({
        success: false,
        message: 'Stream name is required',
        error: 'MISSING_STREAM_NAME'
      });
    }

    // Find the user
    const currentUser = await User.findByUsername(username);
    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        error: 'USER_NOT_FOUND'
      });
    }

    // Check if already joined
    if (currentUser.joinedStreams.includes(streamName)) {
      return res.status(400).json({
        success: false,
        message: 'Already joined this stream',
        error: 'ALREADY_JOINED'
      });
    }

    // Add stream to joined streams
    currentUser.joinedStreams.push(streamName);
    await currentUser.save();

    res.status(200).json({
      success: true,
      message: 'Joined stream successfully',
      data: {
        streamName,
        joinedStreams: currentUser.joinedStreams,
        totalStreams: currentUser.joinedStreams.length
      }
    });

  } catch (error) {
    console.error('Join stream error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while joining stream',
      error: process.env.NODE_ENV === 'development' ? error.message : 'JOIN_STREAM_ERROR'
    });
  }
};

/**
 * @desc    Leave a stream
 * @route   POST /api/profile/:username/streams/leave
 * @access  Private
 */
const leaveStream = async (req, res) => {
  try {
    const { username } = req.params;
    const { user } = req; // From auth middleware
    const { streamName } = req.body;

    // Check if user is modifying their own streams
    if (username !== user.username) {
      return res.status(403).json({
        success: false,
        message: 'You can only modify your own streams',
        error: 'UNAUTHORIZED_ACTION'
      });
    }

    if (!streamName) {
      return res.status(400).json({
        success: false,
        message: 'Stream name is required',
        error: 'MISSING_STREAM_NAME'
      });
    }

    // Find the user
    const currentUser = await User.findByUsername(username);
    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        error: 'USER_NOT_FOUND'
      });
    }

    // Check if actually joined
    if (!currentUser.joinedStreams.includes(streamName)) {
      return res.status(400).json({
        success: false,
        message: 'Not joined to this stream',
        error: 'NOT_JOINED'
      });
    }

    // Remove stream from joined streams
    currentUser.joinedStreams = currentUser.joinedStreams.filter(
      stream => stream !== streamName
    );
    await currentUser.save();

    res.status(200).json({
      success: true,
      message: 'Left stream successfully',
      data: {
        streamName,
        joinedStreams: currentUser.joinedStreams,
        totalStreams: currentUser.joinedStreams.length
      }
    });

  } catch (error) {
    console.error('Leave stream error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while leaving stream',
      error: process.env.NODE_ENV === 'development' ? error.message : 'LEAVE_STREAM_ERROR'
    });
  }
};

module.exports = {
  getUserProfile,
  editUserProfile,
  getUserStreams,
  joinStream,
  leaveStream
};