const { Blog, User } = require('../models');

/**
 * Blog Controller
 * Handles blog creation, retrieval, and engagement (likes/dislikes)
 */

/**
 * @desc    Create a new blog post
 * @route   POST /api/blog/create
 * @access  Private
 */
const createBlog = async (req, res) => {
  try {
    const { title, body } = req.body;
    const { user } = req; // From auth middleware

    // Validate input
    if (!title || !body) {
      return res.status(400).json({
        success: false,
        message: 'Title and body are required',
        error: 'MISSING_REQUIRED_FIELDS'
      });
    }

    if (title.trim().length < 5 || title.trim().length > 200) {
      return res.status(400).json({
        success: false,
        message: 'Title must be between 5 and 200 characters',
        error: 'INVALID_TITLE_LENGTH'
      });
    }

    if (body.trim().length < 50 || body.trim().length > 10000) {
      return res.status(400).json({
        success: false,
        message: 'Blog content must be between 50 and 10,000 characters',
        error: 'INVALID_BODY_LENGTH'
      });
    }

    // Get user info for author details
    const authorUser = await User.findByUsername(user.username);
    
    // Create blog post
    const blogData = {
      title: title.trim(),
      body: body.trim(),
      author: user.username,
      authorAvatar: authorUser?.bloom || '🌸',
      authorBio: authorUser?.bio || ''
    };

    const blog = new Blog(blogData);
    await blog.save();

    // Update user's post count
    if (authorUser) {
      authorUser.postsCount += 1;
      await authorUser.save();
    }

    res.status(201).json({
      success: true,
      message: 'Blog post created successfully',
      data: {
        blog: blog.toPublicJSON()
      }
    });

  } catch (error) {
    console.error('Create blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while creating blog post',
      error: process.env.NODE_ENV === 'development' ? error.message : 'CREATE_BLOG_ERROR'
    });
  }
};

/**
 * @desc    Get all blog posts
 * @route   GET /api/blogs
 * @access  Public
 */
const getAllBlogs = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      author, 
      tag, 
      category, 
      sortBy = 'publishDate',
      order = 'desc',
      search
    } = req.query;

    // Build query
    let query = { isPublished: true };

    if (author) {
      query.author = author;
    }

    if (tag) {
      query.tags = { $in: [tag.toLowerCase()] };
    }

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$text = { $search: search };
    }

    // Build sort object
    const sortOptions = {};
    if (search) {
      sortOptions.score = { $meta: 'textScore' };
    } else {
      sortOptions[sortBy] = order === 'desc' ? -1 : 1;
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const blogs = await Blog.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const totalBlogs = await Blog.countDocuments(query);
    const totalPages = Math.ceil(totalBlogs / parseInt(limit));

    // Convert to public JSON
    const publicBlogs = blogs.map(blog => blog.toPublicJSON());

    res.status(200).json({
      success: true,
      data: {
        blogs: publicBlogs,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalBlogs,
          hasNextPage: parseInt(page) < totalPages,
          hasPrevPage: parseInt(page) > 1
        }
      }
    });

  } catch (error) {
    console.error('Get blogs error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching blogs',
      error: process.env.NODE_ENV === 'development' ? error.message : 'GET_BLOGS_ERROR'
    });
  }
};

/**
 * @desc    Get a single blog post
 * @route   GET /api/blogs/:id
 * @access  Public
 */
const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id);

    if (!blog || !blog.isPublished) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found',
        error: 'BLOG_NOT_FOUND'
      });
    }

    // Increment view count
    await blog.incrementViews();

    res.status(200).json({
      success: true,
      data: {
        blog: blog.toPublicJSON()
      }
    });

  } catch (error) {
    console.error('Get blog by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching blog',
      error: process.env.NODE_ENV === 'development' ? error.message : 'GET_BLOG_ERROR'
    });
  }
};

/**
 * @desc    Like a blog post
 * @route   POST /api/blogs/like
 * @access  Private
 */
const likeBlog = async (req, res) => {
  try {
    const { blogId } = req.body;
    const { user } = req; // From auth middleware

    if (!blogId) {
      return res.status(400).json({
        success: false,
        message: 'Blog ID is required',
        error: 'MISSING_BLOG_ID'
      });
    }

    const blog = await Blog.findById(blogId);

    if (!blog || !blog.isPublished) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found',
        error: 'BLOG_NOT_FOUND'
      });
    }

    // Like the blog
    await blog.like(user.username);

    res.status(200).json({
      success: true,
      message: 'Blog liked successfully',
      data: {
        likes: blog.likes,
        dislikes: blog.dislikes,
        hasLiked: blog.likedBy.includes(user.username),
        hasDisliked: blog.dislikedBy.includes(user.username)
      }
    });

  } catch (error) {
    console.error('Like blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while liking blog',
      error: process.env.NODE_ENV === 'development' ? error.message : 'LIKE_BLOG_ERROR'
    });
  }
};

/**
 * @desc    Dislike a blog post
 * @route   POST /api/blogs/dislike
 * @access  Private
 */
const dislikeBlog = async (req, res) => {
  try {
    const { blogId } = req.body;
    const { user } = req; // From auth middleware

    if (!blogId) {
      return res.status(400).json({
        success: false,
        message: 'Blog ID is required',
        error: 'MISSING_BLOG_ID'
      });
    }

    const blog = await Blog.findById(blogId);

    if (!blog || !blog.isPublished) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found',
        error: 'BLOG_NOT_FOUND'
      });
    }

    // Dislike the blog
    await blog.dislike(user.username);

    res.status(200).json({
      success: true,
      message: 'Blog disliked successfully',
      data: {
        likes: blog.likes,
        dislikes: blog.dislikes,
        hasLiked: blog.likedBy.includes(user.username),
        hasDisliked: blog.dislikedBy.includes(user.username)
      }
    });

  } catch (error) {
    console.error('Dislike blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while disliking blog',
      error: process.env.NODE_ENV === 'development' ? error.message : 'DISLIKE_BLOG_ERROR'
    });
  }
};

/**
 * @desc    Get blogs by author
 * @route   GET /api/blogs/author/:username
 * @access  Public
 */
const getBlogsByAuthor = async (req, res) => {
  try {
    const { username } = req.params;
    const { page = 1, limit = 10 } = req.query;

    // Check if author exists
    const author = await User.findByUsername(username);
    if (!author) {
      return res.status(404).json({
        success: false,
        message: 'Author not found',
        error: 'AUTHOR_NOT_FOUND'
      });
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get blogs by author
    const blogs = await Blog.findByAuthor(username)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count
    const totalBlogs = await Blog.countDocuments({ 
      author: username, 
      isPublished: true 
    });
    const totalPages = Math.ceil(totalBlogs / parseInt(limit));

    const publicBlogs = blogs.map(blog => blog.toPublicJSON());

    res.status(200).json({
      success: true,
      data: {
        blogs: publicBlogs,
        author: author.toPublicProfile(),
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalBlogs,
          hasNextPage: parseInt(page) < totalPages,
          hasPrevPage: parseInt(page) > 1
        }
      }
    });

  } catch (error) {
    console.error('Get blogs by author error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching author blogs',
      error: process.env.NODE_ENV === 'development' ? error.message : 'GET_AUTHOR_BLOGS_ERROR'
    });
  }
};

/**
 * @desc    Get filtered blogs
 * @route   GET /api/blogs/filter
 * @access  Private/Public
 */
const getFilteredBlogs = async (req, res) => {
  try {
    const { filter, page = 1, limit = 10 } = req.query;
    const { user } = req; // From auth middleware (may be null for public access)

    if (!filter) {
      return res.status(400).json({
        success: false,
        message: 'Filter parameter is required',
        error: 'MISSING_FILTER'
      });
    }

    let query = { isPublished: true };
    let sortOptions = {};

    // Apply filter logic
    switch (filter) {
      case 'most_liked':
        sortOptions = { likes: -1, publishDate: -1 };
        break;
        
      case 'by_me':
        if (!user) {
          return res.status(401).json({
            success: false,
            message: 'Authentication required for this filter',
            error: 'AUTH_REQUIRED'
          });
        }
        query.author = user.username;
        sortOptions = { publishDate: -1 };
        break;
        
      case 'recent':
        sortOptions = { publishDate: -1 };
        break;
        
      case 'most_viewed':
        sortOptions = { views: -1, publishDate: -1 };
        break;
        
      case 'trending':
        // Trending: high engagement in last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        query.publishDate = { $gte: sevenDaysAgo };
        sortOptions = { 
          $expr: { 
            $add: ['$likes', { $multiply: ['$views', 0.1] }] 
          },
          publishDate: -1 
        };
        break;
        
      case 'friends':
        if (!user) {
          return res.status(401).json({
            success: false,
            message: 'Authentication required for this filter',
            error: 'AUTH_REQUIRED'
          });
        }
        // Get user's friends list
        const currentUser = await User.findByUsername(user.username);
        if (currentUser && currentUser.friends.length > 0) {
          query.author = { $in: currentUser.friends };
        } else {
          query.author = { $in: [] }; // Empty result if no friends
        }
        sortOptions = { publishDate: -1 };
        break;
        
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid filter option',
          error: 'INVALID_FILTER',
          availableFilters: ['most_liked', 'by_me', 'recent', 'most_viewed', 'trending', 'friends']
        });
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const blogs = await Blog.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count
    const totalBlogs = await Blog.countDocuments(query);
    const totalPages = Math.ceil(totalBlogs / parseInt(limit));

    const publicBlogs = blogs.map(blog => blog.toPublicJSON());

    res.status(200).json({
      success: true,
      data: {
        blogs: publicBlogs,
        filter: filter,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalBlogs,
          hasNextPage: parseInt(page) < totalPages,
          hasPrevPage: parseInt(page) > 1
        }
      }
    });

  } catch (error) {
    console.error('Get filtered blogs error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while filtering blogs',
      error: process.env.NODE_ENV === 'development' ? error.message : 'FILTER_BLOGS_ERROR'
    });
  }
};

/**
 * @desc    Get most liked blogs
 * @route   GET /api/blogs/most-liked
 * @access  Public
 */
const getMostLikedBlogs = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const blogs = await Blog.findMostLiked(parseInt(limit));
    const publicBlogs = blogs.map(blog => blog.toPublicJSON());

    res.status(200).json({
      success: true,
      data: {
        blogs: publicBlogs
      }
    });

  } catch (error) {
    console.error('Get most liked blogs error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching most liked blogs',
      error: process.env.NODE_ENV === 'development' ? error.message : 'GET_MOST_LIKED_ERROR'
    });
  }
};

module.exports = {
  createBlog,
  getAllBlogs,
  getBlogById,
  likeBlog,
  dislikeBlog,
  getBlogsByAuthor,
  getMostLikedBlogs,
  getFilteredBlogs
};