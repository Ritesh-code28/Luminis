const { CrowdfundingForm, User } = require('../models');

/**
 * Crowdfunding Controller
 * Handles crowdfunding form submissions with database storage
 */

/**
 * @desc    Submit crowdfunding request
 * @route   POST /api/crowdfunding
 * @access  Private
 */
const submitCrowdfundingRequest = async (req, res) => {
  try {
    const { 
      needForMoney, 
      recipientName, 
      state, 
      email, 
      mobileNumber,
      targetAmount,
      currency,
      category,
      urgencyLevel,
      deadline,
      showEmail,
      showMobile,
      showFullName
    } = req.body;
    const { user } = req; // From auth middleware

    // Validate required fields
    if (!needForMoney || !recipientName || !state || !email || !mobileNumber) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided',
        error: 'MISSING_REQUIRED_FIELDS',
        requiredFields: ['needForMoney', 'recipientName', 'state', 'email', 'mobileNumber']
      });
    }

    // Create crowdfunding request
    const formData = {
      needForMoney,
      recipientName,
      state,
      email,
      mobileNumber,
      targetAmount: targetAmount || null,
      currency: currency || 'USD',
      category: category || 'other',
      urgencyLevel: urgencyLevel || 'medium',
      deadline: deadline ? new Date(deadline) : null,
      submittedBy: user.username,
      showEmail: showEmail || false,
      showMobile: showMobile || false,
      showFullName: showFullName !== false
    };

    const crowdfundingRequest = await CrowdfundingForm.createCrowdfundingRequest(formData);

    res.status(201).json({
      success: true,
      message: 'Crowdfunding request submitted successfully',
      data: {
        requestId: crowdfundingRequest._id,
        status: crowdfundingRequest.status,
        message: 'Your crowdfunding request has been submitted and will be reviewed by our team.',
        publicInfo: crowdfundingRequest.getPublicInfo()
      }
    });

  } catch (error) {
    console.error('Crowdfunding submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while processing request',
      error: process.env.NODE_ENV === 'development' ? error.message : 'SUBMISSION_ERROR'
    });
  }
};

/**
 * @desc    Get crowdfunding request status
 * @route   GET /api/crowdfunding/:requestId
 * @access  Public
 */
const getCrowdfundingStatus = async (req, res) => {
  try {
    const { requestId } = req.params;

    const request = await CrowdfundingForm.findById(requestId);
    
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Crowdfunding request not found',
        error: 'REQUEST_NOT_FOUND'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        request: request.getPublicInfo(),
        progress: request.getProgress()
      }
    });

  } catch (error) {
    console.error('Get crowdfunding status error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching status',
      error: process.env.NODE_ENV === 'development' ? error.message : 'STATUS_ERROR'
    });
  }
};

/**
 * @desc    Get all crowdfunding requests
 * @route   GET /api/crowdfunding
 * @access  Public
 */
const getAllCrowdfundingRequests = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      category, 
      urgency, 
      status = 'active',
      sortBy = 'createdAt',
      order = 'desc'
    } = req.query;

    // Build query
    let query = {};
    
    if (status === 'active') {
      query.status = { $in: ['approved', 'active'] };
    } else if (status !== 'all') {
      query.status = status;
    }
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (urgency && urgency !== 'all') {
      query.urgencyLevel = urgency;
    }

    // Build sort object
    const sortOptions = {};
    sortOptions[sortBy] = order === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const requests = await CrowdfundingForm.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count
    const totalRequests = await CrowdfundingForm.countDocuments(query);
    const totalPages = Math.ceil(totalRequests / parseInt(limit));

    const publicRequests = requests.map(request => request.getPublicInfo());

    res.status(200).json({
      success: true,
      data: {
        requests: publicRequests,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalRequests,
          hasNextPage: parseInt(page) < totalPages,
          hasPrevPage: parseInt(page) > 1
        }
      }
    });

  } catch (error) {
    console.error('Get crowdfunding requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching requests',
      error: process.env.NODE_ENV === 'development' ? error.message : 'GET_REQUESTS_ERROR'
    });
  }
};

/**
 * @desc    Support a crowdfunding request
 * @route   POST /api/crowdfunding/:requestId/support
 * @access  Private
 */
const supportCrowdfundingRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { amount, message, isAnonymous } = req.body;
    const { user } = req; // From auth middleware

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid support amount is required',
        error: 'INVALID_AMOUNT'
      });
    }

    const request = await CrowdfundingForm.findById(requestId);
    
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Crowdfunding request not found',
        error: 'REQUEST_NOT_FOUND'
      });
    }

    if (request.status !== 'active' && request.status !== 'approved') {
      return res.status(400).json({
        success: false,
        message: 'This crowdfunding request is not accepting support',
        error: 'REQUEST_NOT_ACTIVE'
      });
    }

    // Add support
    await request.addSupport({
      username: user.username,
      amount: parseFloat(amount),
      message: message || '',
      isAnonymous: isAnonymous || false
    });

    res.status(200).json({
      success: true,
      message: 'Support added successfully',
      data: {
        request: request.getPublicInfo(),
        progress: request.getProgress()
      }
    });

  } catch (error) {
    console.error('Support crowdfunding error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while adding support',
      error: process.env.NODE_ENV === 'development' ? error.message : 'SUPPORT_ERROR'
    });
  }
};

/**
 * @desc    Get user's crowdfunding requests
 * @route   GET /api/crowdfunding/my-requests
 * @access  Private
 */
const getMyCrowdfundingRequests = async (req, res) => {
  try {
    const { user } = req; // From auth middleware
    const { page = 1, limit = 10 } = req.query;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get user's requests
    const requests = await CrowdfundingForm.find({ submittedBy: user.username })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count
    const totalRequests = await CrowdfundingForm.countDocuments({ submittedBy: user.username });
    const totalPages = Math.ceil(totalRequests / parseInt(limit));

    const detailedRequests = requests.map(request => ({
      ...request.toJSON(),
      progress: request.getProgress()
    }));

    res.status(200).json({
      success: true,
      data: {
        requests: detailedRequests,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalRequests,
          hasNextPage: parseInt(page) < totalPages,
          hasPrevPage: parseInt(page) > 1
        }
      }
    });

  } catch (error) {
    console.error('Get my crowdfunding requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching requests',
      error: process.env.NODE_ENV === 'development' ? error.message : 'GET_MY_REQUESTS_ERROR'
    });
  }
};

module.exports = {
  submitCrowdfundingRequest,
  getCrowdfundingStatus,
  getAllCrowdfundingRequests,
  supportCrowdfundingRequest,
  getMyCrowdfundingRequests
};