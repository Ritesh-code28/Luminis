const express = require('express');
const { body, param } = require('express-validator');
const {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriendRequests,
  getFriends,
  removeFriend
} = require('../controllers/friendController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

const router = express.Router();

// Validation rules
const friendRequestValidation = [
  body('recipientUsername')
    .notEmpty()
    .isLength({ min: 3, max: 30 })
    .withMessage('Valid recipient username is required'),
  body('message')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Message cannot exceed 200 characters')
];

const acceptRejectValidation = [
  body('requesterUsername')
    .notEmpty()
    .isLength({ min: 3, max: 30 })
    .withMessage('Valid requester username is required')
];

const removeFriendValidation = [
  param('username')
    .notEmpty()
    .isLength({ min: 3, max: 30 })
    .withMessage('Valid username is required')
];

// Routes
router.post('/friend-request', protect, friendRequestValidation, validate, sendFriendRequest);
router.post('/friend-request/accept', protect, acceptRejectValidation, validate, acceptFriendRequest);
router.post('/friend-request/reject', protect, acceptRejectValidation, validate, rejectFriendRequest);
router.get('/friend-requests', protect, getFriendRequests);
router.get('/friends', protect, getFriends);
router.delete('/friends/:username', protect, removeFriendValidation, validate, removeFriend);

module.exports = router;