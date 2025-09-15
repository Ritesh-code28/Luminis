const { User } = require('../models');

/**
 * Friend Controller
 * Handles friend requests, connections, and friend management
 */

/**
 * @desc    Send a friend request
 * @route   POST /api/friend-request
 * @access  Private
 */
const sendFriendRequest = async (req, res) => {
  try {
    const { recipientUsername, message } = req.body;
    const { user } = req; // From auth middleware

    // Validate input
    if (!recipientUsername) {
      return res.status(400).json({
        success: false,
        message: 'Recipient username is required',
        error: 'MISSING_RECIPIENT'
      });
    }

    // Cannot send request to yourself
    if (recipientUsername === user.username) {
      return res.status(400).json({
        success: false,
        message: 'Cannot send friend request to yourself',
        error: 'SELF_REQUEST'
      });
    }

    // Find recipient
    const recipient = await User.findByUsername(recipientUsername);
    if (!recipient) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        error: 'USER_NOT_FOUND'
      });
    }

    // Check if already friends
    if (recipient.friends.includes(user.username)) {
      return res.status(400).json({
        success: false,
        message: 'Already friends with this user',
        error: 'ALREADY_FRIENDS'
      });
    }

    // Check if request already exists
    const existingRequest = recipient.pendingFriendRequests.find(
      req => req.from === user.username
    );

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: 'Friend request already sent',
        error: 'REQUEST_EXISTS'
      });
    }

    // Add friend request
    await recipient.addFriendRequest(
      user.username, 
      message || 'Would like to connect with you on Echo!'
    );

    res.status(200).json({
      success: true,
      message: 'Friend request sent successfully',
      data: {
        recipientUsername,
        message: message || 'Would like to connect with you on Echo!'
      }
    });

  } catch (error) {
    console.error('Send friend request error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while sending friend request',
      error: process.env.NODE_ENV === 'development' ? error.message : 'SEND_REQUEST_ERROR'
    });
  }
};

/**
 * @desc    Accept a friend request
 * @route   POST /api/friend-request/accept
 * @access  Private
 */
const acceptFriendRequest = async (req, res) => {
  try {
    const { requesterUsername } = req.body;
    const { user } = req; // From auth middleware

    // Validate input
    if (!requesterUsername) {
      return res.status(400).json({
        success: false,
        message: 'Requester username is required',
        error: 'MISSING_REQUESTER'
      });
    }

    // Find the current user
    const currentUser = await User.findByUsername(user.username);
    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        error: 'USER_NOT_FOUND'
      });
    }

    // Check if friend request exists
    const requestExists = currentUser.pendingFriendRequests.find(
      req => req.from === requesterUsername
    );

    if (!requestExists) {
      return res.status(404).json({
        success: false,
        message: 'Friend request not found',
        error: 'REQUEST_NOT_FOUND'
      });
    }

    // Accept the friend request
    await currentUser.acceptFriendRequest(requesterUsername);

    // Add current user to requester's friends list as well
    const requester = await User.findByUsername(requesterUsername);
    if (requester && !requester.friends.includes(user.username)) {
      requester.friends.push(user.username);
      await requester.save();
    }

    res.status(200).json({
      success: true,
      message: 'Friend request accepted successfully',
      data: {
        requesterUsername,
        friendsCount: currentUser.friends.length + 1 // +1 for the newly added friend
      }
    });

  } catch (error) {
    console.error('Accept friend request error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while accepting friend request',
      error: process.env.NODE_ENV === 'development' ? error.message : 'ACCEPT_REQUEST_ERROR'
    });
  }
};

/**
 * @desc    Reject a friend request
 * @route   POST /api/friend-request/reject
 * @access  Private
 */
const rejectFriendRequest = async (req, res) => {
  try {
    const { requesterUsername } = req.body;
    const { user } = req; // From auth middleware

    // Validate input
    if (!requesterUsername) {
      return res.status(400).json({
        success: false,
        message: 'Requester username is required',
        error: 'MISSING_REQUESTER'
      });
    }

    // Find the current user
    const currentUser = await User.findByUsername(user.username);
    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        error: 'USER_NOT_FOUND'
      });
    }

    // Find and remove the friend request
    const requestIndex = currentUser.pendingFriendRequests.findIndex(
      req => req.from === requesterUsername
    );

    if (requestIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Friend request not found',
        error: 'REQUEST_NOT_FOUND'
      });
    }

    // Remove the request
    currentUser.pendingFriendRequests.splice(requestIndex, 1);
    await currentUser.save();

    res.status(200).json({
      success: true,
      message: 'Friend request rejected successfully',
      data: {
        requesterUsername
      }
    });

  } catch (error) {
    console.error('Reject friend request error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while rejecting friend request',
      error: process.env.NODE_ENV === 'development' ? error.message : 'REJECT_REQUEST_ERROR'
    });
  }
};

/**
 * @desc    Get pending friend requests
 * @route   GET /api/friend-requests
 * @access  Private
 */
const getFriendRequests = async (req, res) => {
  try {
    const { user } = req; // From auth middleware

    // Find the current user with pending requests
    const currentUser = await User.findByUsername(user.username);
    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        error: 'USER_NOT_FOUND'
      });
    }

    // Get detailed information about requesters
    const friendRequests = await Promise.all(
      currentUser.pendingFriendRequests.map(async (request) => {
        const requester = await User.findByUsername(request.from);
        return {
          id: request._id,
          from: request.from,
          fromName: requester?.username || request.from,
          fromAvatar: requester?.bloom || '🌸',
          fromBio: requester?.bio || '',
          message: request.message,
          sentAt: request.sentAt
        };
      })
    );

    res.status(200).json({
      success: true,
      data: {
        friendRequests,
        totalRequests: friendRequests.length
      }
    });

  } catch (error) {
    console.error('Get friend requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching friend requests',
      error: process.env.NODE_ENV === 'development' ? error.message : 'GET_REQUESTS_ERROR'
    });
  }
};

/**
 * @desc    Get user's friends list
 * @route   GET /api/friends
 * @access  Private
 */
const getFriends = async (req, res) => {
  try {
    const { user } = req; // From auth middleware

    // Find the current user
    const currentUser = await User.findByUsername(user.username);
    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        error: 'USER_NOT_FOUND'
      });
    }

    // Get detailed information about friends
    const friends = await Promise.all(
      currentUser.friends.map(async (friendUsername) => {
        const friend = await User.findByUsername(friendUsername);
        return friend ? friend.toPublicProfile() : null;
      })
    );

    // Filter out null values (deleted users)
    const validFriends = friends.filter(friend => friend !== null);

    res.status(200).json({
      success: true,
      data: {
        friends: validFriends,
        totalFriends: validFriends.length
      }
    });

  } catch (error) {
    console.error('Get friends error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching friends',
      error: process.env.NODE_ENV === 'development' ? error.message : 'GET_FRIENDS_ERROR'
    });
  }
};

/**
 * @desc    Remove a friend
 * @route   DELETE /api/friends/:username
 * @access  Private
 */
const removeFriend = async (req, res) => {
  try {
    const { username } = req.params;
    const { user } = req; // From auth middleware

    // Find the current user
    const currentUser = await User.findByUsername(user.username);
    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        error: 'USER_NOT_FOUND'
      });
    }

    // Check if they are friends
    if (!currentUser.friends.includes(username)) {
      return res.status(400).json({
        success: false,
        message: 'Not friends with this user',
        error: 'NOT_FRIENDS'
      });
    }

    // Remove from current user's friends list
    currentUser.friends = currentUser.friends.filter(friend => friend !== username);
    await currentUser.save();

    // Remove current user from the other user's friends list
    const otherUser = await User.findByUsername(username);
    if (otherUser) {
      otherUser.friends = otherUser.friends.filter(friend => friend !== user.username);
      await otherUser.save();
    }

    res.status(200).json({
      success: true,
      message: 'Friend removed successfully',
      data: {
        removedFriend: username,
        friendsCount: currentUser.friends.length
      }
    });

  } catch (error) {
    console.error('Remove friend error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while removing friend',
      error: process.env.NODE_ENV === 'development' ? error.message : 'REMOVE_FRIEND_ERROR'
    });
  }
};

module.exports = {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriendRequests,
  getFriends,
  removeFriend
};