const express = require('express');
const { body, param } = require('express-validator');
const {
  getUserProfile,
  editUserProfile,
  getUserStreams,
  joinStream,
  leaveStream
} = require('../controllers/profileController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

const router = express.Router();

// Validation rules
const usernameValidation = [
  param('username')
    .notEmpty()
    .isLength({ min: 3, max: 30 })
    .withMessage('Valid username is required')
];

const editProfileValidation = [
  param('username')
    .notEmpty()
    .isLength({ min: 3, max: 30 })
    .withMessage('Valid username is required'),
  body('bio')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Bio cannot exceed 500 characters'),
  body('bloom')
    .optional()
    .isLength({ min: 1, max: 10 })
    .withMessage('Invalid bloom'),
  body('bloomStyle')
    .optional()
    .isIn(['serene', 'vibrant', 'nature', 'cosmic', 'gentle', 'creative', 'wisdom'])
    .withMessage('Invalid bloom style'),
  body('colorPalette')
    .optional()
    .isIn(['sage', 'lavender', 'blush', 'mint', 'cream', 'silver', 'charcoal', 'teal'])
    .withMessage('Invalid color palette'),
  body('happyChoice')
    .optional()
    .isIn(['happy', 'calm', 'inspired', 'peaceful', 'creative', 'thoughtful', 'grateful'])
    .withMessage('Invalid happiness choice')
];

const streamValidation = [
  param('username')
    .notEmpty()
    .isLength({ min: 3, max: 30 })
    .withMessage('Valid username is required'),
  body('streamName')
    .notEmpty()
    .isLength({ min: 2, max: 50 })
    .withMessage('Stream name must be between 2 and 50 characters')
];

// Routes
router.get('/:username', usernameValidation, validate, getUserProfile);
router.post('/:username/edit', protect, editProfileValidation, validate, editUserProfile);
router.get('/:username/streams', usernameValidation, validate, getUserStreams);
router.post('/:username/streams/join', protect, streamValidation, validate, joinStream);
router.post('/:username/streams/leave', protect, streamValidation, validate, leaveStream);

module.exports = router;