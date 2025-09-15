const mongoose = require('mongoose');

/**
 * Crowdfunding Form Schema for Echo Application
 * Stores crowdfunding requests and support information
 */
const crowdfundingFormSchema = new mongoose.Schema({
  needForMoney: {
    type: String,
    required: [true, 'Description of financial need is required'],
    trim: true,
    minlength: [10, 'Description must be at least 10 characters long'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },

  recipientName: {
    type: String,
    required: [true, 'Recipient name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [100, 'Name cannot exceed 100 characters']
  },

  state: {
    type: String,
    required: [true, 'State is required'],
    trim: true,
    minlength: [2, 'State must be at least 2 characters long'],
    maxlength: [50, 'State cannot exceed 50 characters']
  },

  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please provide a valid email address']
  },

  mobileNumber: {
    type: String,
    required: [true, 'Mobile number is required'],
    trim: true,
    match: [/^[\+]?[1-9][\d]{9,14}$/, 'Please provide a valid mobile number']
  },

  // Additional fields for better crowdfunding management
  targetAmount: {
    type: Number,
    min: [1, 'Target amount must be greater than 0'],
    max: [1000000, 'Target amount cannot exceed 1,000,000']
  },

  currentAmount: {
    type: Number,
    default: 0,
    min: [0, 'Current amount cannot be negative']
  },

  currency: {
    type: String,
    default: 'USD',
    enum: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'INR']
  },

  category: {
    type: String,
    enum: ['medical', 'education', 'emergency', 'community', 'personal', 'charity', 'other'],
    default: 'other'
  },

  urgencyLevel: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },

  deadline: {
    type: Date,
    validate: {
      validator: function(value) {
        return !value || value > new Date();
      },
      message: 'Deadline must be in the future'
    }
  },

  status: {
    type: String,
    enum: ['pending', 'approved', 'active', 'completed', 'cancelled', 'rejected'],
    default: 'pending'
  },

  submittedBy: {
    type: String, // Username of the person who submitted the form
    ref: 'User'
  },

  // Verification and moderation
  verification: {
    isVerified: {
      type: Boolean,
      default: false
    },
    verifiedBy: {
      type: String,
      ref: 'User'
    },
    verifiedAt: {
      type: Date
    },
    verificationNotes: {
      type: String,
      maxlength: [500, 'Verification notes cannot exceed 500 characters']
    }
  },

  // Support tracking
  supporters: [{
    username: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      required: true,
      min: [0.01, 'Support amount must be greater than 0']
    },
    message: {
      type: String,
      maxlength: [200, 'Support message cannot exceed 200 characters']
    },
    supportedAt: {
      type: Date,
      default: Date.now
    },
    isAnonymous: {
      type: Boolean,
      default: false
    }
  }],

  // Documentation
  attachments: [{
    filename: String,
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],

  // Admin/moderation fields
  moderationNotes: {
    type: String,
    maxlength: [1000, 'Moderation notes cannot exceed 1000 characters']
  },

  reviewedBy: {
    type: String,
    ref: 'User'
  },

  reviewedAt: {
    type: Date
  },

  // Privacy settings
  privacy: {
    showEmail: {
      type: Boolean,
      default: false
    },
    showMobile: {
      type: Boolean,
      default: false
    },
    showFullName: {
      type: Boolean,
      default: true
    }
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      // Remove sensitive information based on privacy settings
      if (!ret.privacy.showEmail) {
        delete ret.email;
      }
      if (!ret.privacy.showMobile) {
        delete ret.mobileNumber;
      }
      if (!ret.privacy.showFullName) {
        ret.recipientName = ret.recipientName.charAt(0) + '***';
      }
      return ret;
    }
  }
});

// Indexes for better performance
crowdfundingFormSchema.index({ status: 1 });
crowdfundingFormSchema.index({ category: 1 });
crowdfundingFormSchema.index({ urgencyLevel: 1 });
crowdfundingFormSchema.index({ submittedBy: 1 });
crowdfundingFormSchema.index({ createdAt: -1 });
crowdfundingFormSchema.index({ deadline: 1 });
crowdfundingFormSchema.index({ 'verification.isVerified': 1 });

// Instance methods
crowdfundingFormSchema.methods.addSupport = function(supportData) {
  // Validate support data
  if (!supportData.username || !supportData.amount || supportData.amount <= 0) {
    throw new Error('Invalid support data');
  }

  // Check if user already supported
  const existingSupport = this.supporters.find(s => s.username === supportData.username);
  if (existingSupport) {
    // Update existing support
    existingSupport.amount += supportData.amount;
    existingSupport.message = supportData.message || existingSupport.message;
    existingSupport.supportedAt = new Date();
  } else {
    // Add new support
    this.supporters.push({
      username: supportData.username,
      amount: supportData.amount,
      message: supportData.message || '',
      isAnonymous: supportData.isAnonymous || false,
      supportedAt: new Date()
    });
  }

  // Update current amount
  this.currentAmount += supportData.amount;

  // Check if target is reached
  if (this.targetAmount && this.currentAmount >= this.targetAmount) {
    this.status = 'completed';
  }

  return this.save();
};

crowdfundingFormSchema.methods.getProgress = function() {
  if (!this.targetAmount) return null;
  
  const percentage = Math.min((this.currentAmount / this.targetAmount) * 100, 100);
  return {
    current: this.currentAmount,
    target: this.targetAmount,
    percentage: Math.round(percentage * 100) / 100,
    remaining: Math.max(this.targetAmount - this.currentAmount, 0)
  };
};

crowdfundingFormSchema.methods.getPublicInfo = function() {
  const progress = this.getProgress();
  
  return {
    _id: this._id,
    needForMoney: this.needForMoney,
    recipientName: this.privacy.showFullName ? this.recipientName : this.recipientName.charAt(0) + '***',
    state: this.state,
    category: this.category,
    urgencyLevel: this.urgencyLevel,
    status: this.status,
    progress: progress,
    supportersCount: this.supporters.length,
    deadline: this.deadline,
    createdAt: this.createdAt,
    isVerified: this.verification.isVerified
  };
};

// Static methods
crowdfundingFormSchema.statics.findByStatus = function(status) {
  return this.find({ status: status });
};

crowdfundingFormSchema.statics.findByCategory = function(category) {
  return this.find({ category: category, status: { $in: ['approved', 'active'] } });
};

crowdfundingFormSchema.statics.findUrgent = function() {
  return this.find({ 
    urgencyLevel: { $in: ['high', 'critical'] }, 
    status: { $in: ['approved', 'active'] } 
  }).sort({ urgencyLevel: -1, createdAt: -1 });
};

crowdfundingFormSchema.statics.createCrowdfundingRequest = function(formData) {
  const request = new this({
    needForMoney: formData.needForMoney,
    recipientName: formData.recipientName,
    state: formData.state,
    email: formData.email,
    mobileNumber: formData.mobileNumber,
    targetAmount: formData.targetAmount,
    currency: formData.currency || 'USD',
    category: formData.category || 'other',
    urgencyLevel: formData.urgencyLevel || 'medium',
    deadline: formData.deadline,
    submittedBy: formData.submittedBy,
    privacy: {
      showEmail: formData.showEmail || false,
      showMobile: formData.showMobile || false,
      showFullName: formData.showFullName !== false
    }
  });

  return request.save();
};

// Pre-save middleware
crowdfundingFormSchema.pre('save', function(next) {
  // Auto-complete if target reached
  if (this.targetAmount && this.currentAmount >= this.targetAmount && this.status === 'active') {
    this.status = 'completed';
  }
  
  // Auto-cancel if deadline passed and not completed
  if (this.deadline && new Date() > this.deadline && this.status === 'active') {
    this.status = 'cancelled';
  }
  
  next();
});

module.exports = mongoose.model('CrowdfundingForm', crowdfundingFormSchema);