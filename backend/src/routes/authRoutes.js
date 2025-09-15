const express = require('express');
const { body } = require('express-validator');
const { 
  signup, 
  login, 
  logout, 
  getMe, 
  refreshToken 
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

const router = express.Router();

// Validation rules
const signupValidation = [
  body('username')
    .notEmpty()
    .isLength({ min: 3, max: 30 })
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Username must be 3-30 characters and contain only letters, numbers, underscores, and hyphens'),
  body('password')
    .notEmpty()
    .isLength({ min: 6, max: 128 })
    .withMessage('Password must be between 6 and 128 characters'),
  body('happyChoice')
    .optional()
    .isIn(['happy', 'calm', 'inspired', 'peaceful', 'creative', 'thoughtful', 'grateful'])
    .withMessage('Invalid happiness choice')
];

const loginValidation = [
  body('username')
    .notEmpty()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Routes
router.post('/signup', signupValidation, validate, signup);
router.post('/login', loginValidation, validate, login);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.post('/refresh-token', protect, refreshToken);

module.exports = router;