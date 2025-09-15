const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * User Schema for Echo Application
 * Stores user information including authentication, profile, and social connections
 */
const userSchema = new mongoose.Schema({
  // Authentication fields
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters long'],
    maxlength: [30, 'Username cannot exceed 30 characters'],
    match: [/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens']
  },

  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false // Don't include password in queries by default
  },

  // User choice for happiness/mood (as specified in requirements)
  happyChoice: {
    type: String,
    enum: ['happy', 'calm', 'inspired', 'peaceful', 'creative', 'thoughtful', 'grateful'],
    default: 'peaceful'
  },

  // Profile information
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot exceed 500 characters'],
    default: ''
  },

  // Bloom/Avatar customization
  bloom: {
    type: String,
    default: '🌸' // Default bloom emoji
  },

  bloomStyle: {
    type: String,
    enum: ['serene', 'vibrant', 'nature', 'cosmic', 'gentle', 'creative', 'wisdom'],
    default: 'serene'
  },

  colorPalette: {
    type: String,
    enum: ['sage', 'lavender', 'blush', 'mint', 'cream', 'silver', 'charcoal', 'teal'],
    default: 'sage'
  },

  // Social connections
  friends: [{
    type: String, // Store usernames for simplicity
    ref: 'User'
  }],

  pendingFriendRequests: [{
    from: {
      type: String,
      required: true
    },
    sentAt: {
      type: Date,
      default: Date.now
    },
    message: {
      type: String,
      default: 'Would like to connect with you on Echo!'
    }
  }],

  // Activity tracking
  postsCount: {
    type: Number,
    default: 0
  },

  joinedStreams: [{
    type: String // Stream names for simplicity
  }],

  // Account metadata
  isActive: {
    type: Boolean,
    default: true
  },

  lastSeen: {
    type: Date,
    default: Date.now
  },

  // JWT token tracking (for session management)
  activeTokens: [{
    token: String,
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 604800 // 7 days in seconds
    }
  }]
}, {
  timestamps: true, // Automatically add createdAt and updatedAt
  toJSON: {
    transform: function(doc, ret) {
      // Remove sensitive fields when converting to JSON
      delete ret.activeTokens;
      return ret;
    }
  }
});

// Indexes for better query performance
userSchema.index({ username: 1 });
userSchema.index({ 'pendingFriendRequests.from': 1 });
userSchema.index({ friends: 1 });
userSchema.index({ createdAt: -1 });

// Instance methods
userSchema.methods.toPublicProfile = function() {
  return {
    username: this.username,
    bio: this.bio,
    bloom: this.bloom,
    bloomStyle: this.bloomStyle,
    colorPalette: this.colorPalette,
    friendsCount: this.friends.length,
    postsCount: this.postsCount,
    joinDate: this.createdAt,
    lastSeen: this.lastSeen,
    happyChoice: this.happyChoice
  };
};

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.hashPassword = async function(password) {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

userSchema.methods.addFriendRequest = function(fromUsername, message = '') {
  // Check if request already exists
  const existingRequest = this.pendingFriendRequests.find(req => req.from === fromUsername);
  if (existingRequest) {
    return false; // Request already exists
  }

  this.pendingFriendRequests.push({
    from: fromUsername,
    message: message || 'Would like to connect with you on Echo!',
    sentAt: new Date()
  });

  return this.save();
};

userSchema.methods.acceptFriendRequest = function(fromUsername) {
  // Find and remove the friend request
  const requestIndex = this.pendingFriendRequests.findIndex(req => req.from === fromUsername);
  if (requestIndex === -1) {
    return false; // Request not found
  }

  // Remove the request
  this.pendingFriendRequests.splice(requestIndex, 1);

  // Add to friends list if not already there
  if (!this.friends.includes(fromUsername)) {
    this.friends.push(fromUsername);
  }

  return this.save();
};

userSchema.methods.addActiveToken = function(token) {
  // Remove old tokens (keep only last 3)
  if (this.activeTokens.length >= 3) {
    this.activeTokens.shift();
  }
  
  this.activeTokens.push({
    token: token,
    createdAt: new Date()
  });
  
  return this.save();
};

// Static methods
userSchema.statics.findByUsername = function(username) {
  return this.findOne({ username: username, isActive: true });
};

userSchema.statics.createUser = function(userData) {
  const user = new this({
    username: userData.username,
    password: userData.password, // Will be hashed by pre-save middleware
    happyChoice: userData.happyChoice || 'peaceful',
    bio: userData.bio || '',
    bloom: userData.bloom || '🌸',
    bloomStyle: userData.bloomStyle || 'serene',
    colorPalette: userData.colorPalette || 'sage'
  });

  return user.save();
};

// Pre-save middleware
userSchema.pre('save', async function(next) {
  // Update lastSeen on any save operation
  this.lastSeen = new Date();
  
  // Hash password if it's modified or new
  if (this.isModified('password')) {
    try {
      const saltRounds = 12;
      this.password = await bcrypt.hash(this.password, saltRounds);
    } catch (error) {
      return next(error);
    }
  }
  
  next();
});

module.exports = mongoose.model('User', userSchema);