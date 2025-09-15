const mongoose = require('mongoose');

/**
 * Stream Schema for Echo Application
 * Stores information about themed discussion streams
 */
const streamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Stream name is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Stream name must be at least 3 characters long'],
    maxlength: [50, 'Stream name cannot exceed 50 characters'],
    match: [/^[a-zA-Z0-9\s_-]+$/, 'Stream name can only contain letters, numbers, spaces, underscores, and hyphens']
  },

  description: {
    type: String,
    required: [true, 'Stream description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },

  warden: {
    type: String,
    required: [true, 'Stream warden is required'],
    ref: 'User'
  },

  category: {
    type: String,
    enum: ['mindfulness', 'creativity', 'learning', 'support', 'nature', 'wellness', 'community', 'general'],
    default: 'general'
  },

  tags: [{
    type: String,
    trim: true,
    maxlength: [20, 'Tag cannot exceed 20 characters']
  }],

  participants: [{
    username: {
      type: String,
      required: true
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    role: {
      type: String,
      enum: ['participant', 'moderator', 'warden'],
      default: 'participant'
    }
  }],

  settings: {
    isPrivate: {
      type: Boolean,
      default: false
    },
    requireApproval: {
      type: Boolean,
      default: false
    },
    maxParticipants: {
      type: Number,
      default: 100,
      min: 2,
      max: 500
    },
    allowGuestMessages: {
      type: Boolean,
      default: true
    }
  },

  statistics: {
    totalMessages: {
      type: Number,
      default: 0
    },
    activeParticipants: {
      type: Number,
      default: 0
    },
    peakParticipants: {
      type: Number,
      default: 0
    },
    lastActivity: {
      type: Date,
      default: Date.now
    }
  },

  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      return ret;
    }
  }
});

// Indexes for better performance
streamSchema.index({ name: 1 });
streamSchema.index({ warden: 1 });
streamSchema.index({ category: 1 });
streamSchema.index({ 'participants.username': 1 });
streamSchema.index({ createdAt: -1 });
streamSchema.index({ 'statistics.lastActivity': -1 });

// Instance methods
streamSchema.methods.addParticipant = function(username, role = 'participant') {
  // Check if user is already a participant
  const existingParticipant = this.participants.find(p => p.username === username);
  if (existingParticipant) {
    return false; // Already a participant
  }

  // Check if stream is at capacity
  if (this.participants.length >= this.settings.maxParticipants) {
    throw new Error('Stream is at maximum capacity');
  }

  this.participants.push({
    username,
    role,
    joinedAt: new Date()
  });

  // Update statistics
  this.statistics.activeParticipants = this.participants.length;
  if (this.statistics.activeParticipants > this.statistics.peakParticipants) {
    this.statistics.peakParticipants = this.statistics.activeParticipants;
  }

  return this.save();
};

streamSchema.methods.removeParticipant = function(username) {
  const participantIndex = this.participants.findIndex(p => p.username === username);
  if (participantIndex === -1) {
    return false; // Participant not found
  }

  // Cannot remove warden
  if (this.participants[participantIndex].role === 'warden') {
    throw new Error('Cannot remove stream warden');
  }

  this.participants.splice(participantIndex, 1);
  this.statistics.activeParticipants = this.participants.length;

  return this.save();
};

streamSchema.methods.updateActivity = function() {
  this.statistics.lastActivity = new Date();
  this.statistics.totalMessages += 1;
  return this.save();
};

streamSchema.methods.getPublicInfo = function() {
  return {
    _id: this._id,
    name: this.name,
    description: this.description,
    warden: this.warden,
    category: this.category,
    tags: this.tags,
    participantCount: this.participants.length,
    maxParticipants: this.settings.maxParticipants,
    isPrivate: this.settings.isPrivate,
    lastActivity: this.statistics.lastActivity,
    createdAt: this.createdAt
  };
};

// Static methods
streamSchema.statics.findByName = function(name) {
  return this.findOne({ name: name, isActive: true });
};

streamSchema.statics.findByWarden = function(wardenUsername) {
  return this.find({ warden: wardenUsername, isActive: true });
};

streamSchema.statics.findByCategory = function(category) {
  return this.find({ category: category, isActive: true });
};

streamSchema.statics.getActiveStreams = function(limit = 20) {
  return this.find({ isActive: true })
    .sort({ 'statistics.lastActivity': -1 })
    .limit(limit);
};

streamSchema.statics.createStream = function(streamData) {
  const stream = new this({
    name: streamData.name,
    description: streamData.description,
    warden: streamData.warden,
    category: streamData.category || 'general',
    tags: streamData.tags || [],
    settings: {
      isPrivate: streamData.isPrivate || false,
      requireApproval: streamData.requireApproval || false,
      maxParticipants: streamData.maxParticipants || 100,
      allowGuestMessages: streamData.allowGuestMessages !== false
    }
  });

  // Add warden as first participant
  stream.participants.push({
    username: streamData.warden,
    role: 'warden',
    joinedAt: new Date()
  });

  stream.statistics.activeParticipants = 1;
  stream.statistics.peakParticipants = 1;

  return stream.save();
};

module.exports = mongoose.model('Stream', streamSchema);