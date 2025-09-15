const express = require('express');
const { body, param, query } = require('express-validator');
const {
  createBlog,
  getAllBlogs,
  getBlogById,
  likeBlog,
  dislikeBlog,
  getBlogsByAuthor,
  getMostLikedBlogs,
  getFilteredBlogs
} = require('../controllers/blogController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

const router = express.Router();

// Validation rules
const createBlogValidation = [
  body('title')
    .notEmpty()
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters'),
  body('body')
    .notEmpty()
    .isLength({ min: 50, max: 10000 })
    .withMessage('Body must be between 50 and 10,000 characters')
];

const likeBlogValidation = [
  body('blogId')
    .notEmpty()
    .isMongoId()
    .withMessage('Valid blog ID is required')
];

const getBlogValidation = [
  param('id')
    .isMongoId()
    .withMessage('Valid blog ID is required')
];

const getAuthorBlogsValidation = [
  param('username')
    .notEmpty()
    .isLength({ min: 3, max: 30 })
    .withMessage('Valid username is required')
];

const filterValidation = [
  query('filter')
    .notEmpty()
    .isIn(['most_liked', 'by_me', 'recent', 'most_viewed', 'trending', 'friends'])
    .withMessage('Valid filter is required'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50')
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
  query('sortBy')
    .optional()
    .isIn(['publishDate', 'likes', 'views', 'title'])
    .withMessage('Invalid sort field'),
  query('order')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Order must be asc or desc')
];

// Routes
router.post('/create', protect, createBlogValidation, validate, createBlog);
router.get('/filter', filterValidation, validate, getFilteredBlogs);
router.get('/most-liked', getMostLikedBlogs);
router.get('/author/:username', getAuthorBlogsValidation, validate, getBlogsByAuthor);
router.get('/:id', getBlogValidation, validate, getBlogById);
router.get('/', queryValidation, validate, getAllBlogs);
router.post('/like', protect, likeBlogValidation, validate, likeBlog);
router.post('/dislike', protect, likeBlogValidation, validate, dislikeBlog);

module.exports = router;