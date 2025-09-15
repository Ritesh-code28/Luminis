const express = require('express');
const { body, param, query } = require('express-validator');
const {
  submitCrowdfundingRequest,
  getCrowdfundingStatus,
  getAllCrowdfundingRequests,
  supportCrowdfundingRequest,
  getMyCrowdfundingRequests
} = require('../controllers/crowdfundingController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

const router = express.Router();

// Validation rules
const crowdfundingValidation = [
  body('needForMoney')
    .notEmpty()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Need description must be between 10 and 1000 characters'),
  body('recipientName')
    .notEmpty()
    .isLength({ min: 2, max: 100 })
    .withMessage('Recipient name must be between 2 and 100 characters'),
  body('state')
    .notEmpty()
    .isLength({ min: 2, max: 50 })
    .withMessage('State is required'),
  body('email')
    .notEmpty()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('mobileNumber')
    .notEmpty()
    .matches(/^[\+]?[1-9][\d]{9,14}$/)
    .withMessage('Please provide a valid mobile number'),
  body('targetAmount')
    .optional()
    .isFloat({ min: 1, max: 1000000 })
    .withMessage('Target amount must be between 1 and 1,000,000'),
  body('category')
    .optional()
    .isIn(['medical', 'education', 'emergency', 'community', 'personal', 'charity', 'other'])
    .withMessage('Invalid category'),
  body('urgencyLevel')
    .optional()
    .isIn(['low', 'medium', 'high', 'critical'])
    .withMessage('Invalid urgency level')
];

const supportValidation = [
  param('requestId')
    .isMongoId()
    .withMessage('Invalid request ID'),
  body('amount')
    .notEmpty()
    .isFloat({ min: 0.01 })
    .withMessage('Support amount must be greater than 0'),
  body('message')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Message cannot exceed 200 characters')
];

const statusValidation = [
  param('requestId')
    .isMongoId()
    .withMessage('Invalid request ID')
];

const queryValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50'),
  query('category')
    .optional()
    .isIn(['medical', 'education', 'emergency', 'community', 'personal', 'charity', 'other', 'all'])
    .withMessage('Invalid category'),
  query('urgency')
    .optional()
    .isIn(['low', 'medium', 'high', 'critical', 'all'])
    .withMessage('Invalid urgency level'),
  query('status')
    .optional()
    .isIn(['pending', 'approved', 'active', 'completed', 'cancelled', 'rejected', 'all'])
    .withMessage('Invalid status')
];

// Routes
router.post('/', protect, crowdfundingValidation, validate, submitCrowdfundingRequest);
router.get('/my-requests', protect, getMyCrowdfundingRequests);
router.get('/:requestId', statusValidation, validate, getCrowdfundingStatus);
router.post('/:requestId/support', protect, supportValidation, validate, supportCrowdfundingRequest);
router.get('/', queryValidation, validate, getAllCrowdfundingRequests);

module.exports = router;