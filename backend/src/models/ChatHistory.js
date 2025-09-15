const mongoose = require('mongoose');

/**
 * ChatHistory Schema for Echo Application
 * Stores chat messages for World Chat and Stream-specific chats
 */
const chatHistorySchema = new mongoose.Schema({
  // Message content
  message: {
    type: String,
    required: [true, 'Message content is required'],
    maxlength: [1000, 'Message cannot exceed 1000 characters'],
    trim: true
  },

  // Filtered message (after word tracking/moderation)
  filteredMessage: {
    type: String,
    required: true
  },

  // Author information
  username: {
    type: String,
    required: [true, 'Username is required'],
    ref: 'User'
  },

  userAvatar: {
    type: String,
    default: '🌸'
  },

  // Chat context
  chatType: {
    type: String,
    enum: ['world', 'stream', 'grotto'],
    required: [true, 'Chat type is required']
  },

  // For stream chats - which stream this belongs to
  streamName: {
    type: String,
    required: function() {
      return this.chatType === 'stream';
    }
  },

  // For grotto (private) chats - participants
  grottoParticipants: [{
    type: String,
    ref: 'User'
  }],

  // Message metadata
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },

  // Moderation and filtering
  wasFiltered: {
    type: Boolean,
    default: false
  },

  filterReasons: [{
    type: String,
    enum: ['toxic_words', 'phone_number', 'email_address', 'spam', 'other']
  }],

  // Message reactions/engagement
  reactions: [{
    emoji: String,
    users: [String] // usernames who reacted
  }],

  // Technical metadata
  ipAddress: {
    type: String,
    select: false // Don't include in queries by default
  },

  userAgent: {
    type: String,
    select: false
  },

  // Message status
  isDeleted: {
    type: Boolean,
    default: false
  },

  deletedAt: {
    type: Date
  },

  deletedBy: {
    type: String,
    ref: 'User'
  },

  // For system messages
  isSystemMessage: {
    type: Boolean,
    default: false
  },

  systemMessageType: {
    type: String,
    enum: ['user_joined', 'user_left', 'stream_created', 'announcement'],
    required: function() {
      return this.isSystemMessage;
    }
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      // Remove sensitive fields
      delete ret.ipAddress;
      delete ret.userAgent;
      delete ret.filterReasons;
      return ret;
    }
  }
});

// Indexes for efficient querying
chatHistorySchema.index({ chatType: 1, timestamp: -1 });
chatHistorySchema.index({ streamName: 1, timestamp: -1 });
chatHistorySchema.index({ grottoParticipants: 1, timestamp: -1 });
chatHistorySchema.index({ username: 1, timestamp: -1 });
chatHistorySchema.index({ timestamp: -1 });

// TTL index - automatically delete messages older than 30 days
chatHistorySchema.index({ timestamp: 1 }, { expireAfterSeconds: 2592000 }); // 30 days

// Instance methods
chatHistorySchema.methods.addReaction = function(emoji, username) {
  let reaction = this.reactions.find(r => r.emoji === emoji);
  
  if (!reaction) {
    reaction = { emoji: emoji, users: [] };
    this.reactions.push(reaction);
  }
  
  if (!reaction.users.includes(username)) {
    reaction.users.push(username);
  }
  
  return this.save();
};

chatHistorySchema.methods.removeReaction = function(emoji, username) {
  const reaction = this.reactions.find(r => r.emoji === emoji);
  
  if (reaction) {
    reaction.users = reaction.users.filter(user => user !== username);
    
    // Remove reaction entirely if no users left
    if (reaction.users.length === 0) {
      this.reactions = this.reactions.filter(r => r.emoji !== emoji);
    }
  }
  
  return this.save();
};

chatHistorySchema.methods.softDelete = function(deletedBy) {
  this.isDeleted = true;
  this.deletedAt = new Date();
  this.deletedBy = deletedBy;
  return this.save();
};

chatHistorySchema.methods.toPublicJSON = function() {
  return {
    id: this._id,
    message: this.isDeleted ? '[Message deleted]' : this.filteredMessage,
    username: this.username,
    userAvatar: this.userAvatar,
    chatType: this.chatType,
    streamName: this.streamName,
    timestamp: this.timestamp,
    reactions: this.reactions,
    isSystemMessage: this.isSystemMessage,
    systemMessageType: this.systemMessageType,
    isDeleted: this.isDeleted
  };
};

// Static methods
chatHistorySchema.statics.getWorldChatHistory = function(limit = 50, before = null) {
  const query = { 
    chatType: 'world',
    isDeleted: false
  };
  
  if (before) {
    query.timestamp = { $lt: before };
  }
  
  return this.find(query)
    .sort({ timestamp: -1 })
    .limit(limit)
    .populate('username', 'bloom');
};

chatHistorySchema.statics.getStreamChatHistory = function(streamName, limit = 50, before = null) {
  const query = { 
    chatType: 'stream',
    streamName: streamName,
    isDeleted: false
  };
  
  if (before) {
    query.timestamp = { $lt: before };
  }
  
  return this.find(query)
    .sort({ timestamp: -1 })
    .limit(limit)
    .populate('username', 'bloom');
};

chatHistorySchema.statics.getGrottoChatHistory = function(participants, limit = 50, before = null) {
  const query = { 
    chatType: 'grotto',
    grottoParticipants: { $all: participants },
    isDeleted: false
  };
  
  if (before) {
    query.timestamp = { $lt: before };
  }
  
  return this.find(query)
    .sort({ timestamp: -1 })
    .limit(limit)
    .populate('username', 'bloom');
};

chatHistorySchema.statics.createMessage = function(messageData) {
  return this.create({
    message: messageData.message,
    filteredMessage: messageData.filteredMessage || messageData.message,
    username: messageData.username,
    userAvatar: messageData.userAvatar || '🌸',
    chatType: messageData.chatType,
    streamName: messageData.streamName,
    grottoParticipants: messageData.grottoParticipants,
    wasFiltered: messageData.wasFiltered || false,
    filterReasons: messageData.filterReasons || [],
    ipAddress: messageData.ipAddress,
    userAgent: messageData.userAgent,
    isSystemMessage: messageData.isSystemMessage || false,
    systemMessageType: messageData.systemMessageType
  });
};

chatHistorySchema.statics.getRecentActivity = function(hours = 24) {
  const since = new Date(Date.now() - (hours * 60 * 60 * 1000));
  
  return this.aggregate([
    {
      $match: {
        timestamp: { $gte: since },
        isDeleted: false,
        isSystemMessage: false
      }
    },
    {
      $group: {
        _id: '$chatType',
        messageCount: { $sum: 1 },
        uniqueUsers: { $addToSet: '$username' }
      }
    },
    {
      $project: {
        chatType: '$_id',
        messageCount: 1,
        uniqueUserCount: { $size: '$uniqueUsers' }
      }
    }
  ]);
};

// Pre-save middleware
chatHistorySchema.pre('save', function(next) {
  // Ensure filteredMessage is set
  if (!this.filteredMessage) {
    this.filteredMessage = this.message;
  }
  
  next();
});

module.exports = mongoose.model('ChatHistory', chatHistorySchema);
