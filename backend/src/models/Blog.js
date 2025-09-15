const mongoose = require('mongoose');

/**
 * Blog Schema for Echo Application
 * Stores blog posts with content, author information, and engagement metrics
 */
const blogSchema = new mongoose.Schema({
  // Content fields
  title: {
    type: String,
    required: [true, 'Blog title is required'],
    trim: true,
    minlength: [5, 'Title must be at least 5 characters long'],
    maxlength: [200, 'Title cannot exceed 200 characters']
  },

  body: {
    type: String,
    required: [true, 'Blog content is required'],
    minlength: [50, 'Blog content must be at least 50 characters long'],
    maxlength: [10000, 'Blog content cannot exceed 10,000 characters']
  },

  excerpt: {
    type: String,
    maxlength: [300, 'Excerpt cannot exceed 300 characters']
  },

  // Author information
  author: {
    type: String,
    required: [true, 'Author username is required'],
    ref: 'User'
  },

  authorAvatar: {
    type: String,
    default: '🌸'
  },

  authorBio: {
    type: String,
    default: ''
  },

  // Categorization and tags
  tags: [{
    type: String,
    lowercase: true,
    trim: true,
    maxlength: [20, 'Tag cannot exceed 20 characters']
  }],

  category: {
    type: String,
    enum: ['mindfulness', 'creativity', 'reflection', 'wisdom', 'nature', 'growth', 'connection', 'peace', 'other'],
    default: 'reflection'
  },

  // Engagement metrics
  likes: {
    type: Number,
    default: 0,
    min: [0, 'Likes cannot be negative']
  },

  dislikes: {
    type: Number,
    default: 0,
    min: [0, 'Dislikes cannot be negative']
  },

  likedBy: [{
    type: String,
    ref: 'User'
  }],

  dislikedBy: [{
    type: String,
    ref: 'User'
  }],

  comments: {
    type: Number,
    default: 0,
    min: [0, 'Comments count cannot be negative']
  },

  views: {
    type: Number,
    default: 0,
    min: [0, 'Views cannot be negative']
  },

  // Content metadata
  readTime: {
    type: String,
    default: function() {
      // Calculate read time based on body length (average 200 words per minute)
      const wordCount = this.body.split(' ').length;
      const minutes = Math.ceil(wordCount / 200);
      return `${minutes} min read`;
    }
  },

  // Publishing information
  isPublished: {
    type: Boolean,
    default: true
  },

  publishDate: {
    type: Date,
    default: Date.now
  },

  lastModified: {
    type: Date,
    default: Date.now
  },

  // Content moderation
  isModerated: {
    type: Boolean,
    default: false
  },

  moderationFlags: [{
    reason: String,
    flaggedBy: String,
    flaggedAt: {
      type: Date,
      default: Date.now
    }
  }],

  // SEO and sharing
  slug: {
    type: String,
    unique: true,
    sparse: true
  }
}, {
  timestamps: true, // Automatically add createdAt and updatedAt
  toJSON: {
    transform: function(doc, ret) {
      // Remove moderation fields from public view
      delete ret.moderationFlags;
      delete ret.isModerated;
      return ret;
    }
  }
});

// Indexes for better query performance
blogSchema.index({ author: 1, createdAt: -1 });
blogSchema.index({ publishDate: -1 });
blogSchema.index({ likes: -1 });
blogSchema.index({ tags: 1 });
blogSchema.index({ category: 1 });
blogSchema.index({ title: 'text', body: 'text' }); // Text search index

// Virtual for blog ID
blogSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

// Instance methods
blogSchema.methods.generateExcerpt = function() {
  if (!this.excerpt && this.body) {
    // Generate excerpt from first 150 characters of body
    let excerpt = this.body.replace(/\n/g, ' ').substring(0, 150);
    if (this.body.length > 150) {
      excerpt += '...';
    }
    this.excerpt = excerpt;
  }
  return this.excerpt;
};

blogSchema.methods.generateSlug = function() {
  if (!this.slug) {
    const slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim('-'); // Remove leading/trailing hyphens
    
    this.slug = `${slug}-${this._id.toString().slice(-6)}`;
  }
  return this.slug;
};

blogSchema.methods.like = function(username) {
  // Remove from dislikes if present
  this.dislikedBy = this.dislikedBy.filter(user => user !== username);
  
  // Add to likes if not already liked
  if (!this.likedBy.includes(username)) {
    this.likedBy.push(username);
    this.likes = this.likedBy.length;
  }
  
  // Update dislike count
  this.dislikes = this.dislikedBy.length;
  
  return this.save();
};

blogSchema.methods.dislike = function(username) {
  // Remove from likes if present
  this.likedBy = this.likedBy.filter(user => user !== username);
  
  // Add to dislikes if not already disliked
  if (!this.dislikedBy.includes(username)) {
    this.dislikedBy.push(username);
    this.dislikes = this.dislikedBy.length;
  }
  
  // Update like count
  this.likes = this.likedBy.length;
  
  return this.save();
};

blogSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

blogSchema.methods.toPublicJSON = function() {
  return {
    id: this._id,
    title: this.title,
    body: this.body,
    excerpt: this.excerpt || this.generateExcerpt(),
    author: this.author,
    authorAvatar: this.authorAvatar,
    authorBio: this.authorBio,
    tags: this.tags,
    category: this.category,
    likes: this.likes,
    dislikes: this.dislikes,
    comments: this.comments,
    views: this.views,
    readTime: this.readTime,
    publishDate: this.publishDate,
    lastModified: this.lastModified,
    slug: this.slug,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

// Static methods
blogSchema.statics.findPublished = function() {
  return this.find({ isPublished: true }).sort({ publishDate: -1 });
};

blogSchema.statics.findByAuthor = function(author) {
  return this.find({ author: author, isPublished: true }).sort({ publishDate: -1 });
};

blogSchema.statics.findMostLiked = function(limit = 10) {
  return this.find({ isPublished: true }).sort({ likes: -1 }).limit(limit);
};

blogSchema.statics.findByTag = function(tag) {
  return this.find({ tags: tag, isPublished: true }).sort({ publishDate: -1 });
};

blogSchema.statics.search = function(query) {
  return this.find(
    { 
      $text: { $search: query },
      isPublished: true 
    },
    { score: { $meta: 'textScore' } }
  ).sort({ score: { $meta: 'textScore' } });
};

// Pre-save middleware
blogSchema.pre('save', function(next) {
  // Generate excerpt if not provided
  if (!this.excerpt) {
    this.generateExcerpt();
  }
  
  // Generate slug if not provided
  if (!this.slug) {
    this.generateSlug();
  }
  
  // Update lastModified timestamp
  this.lastModified = new Date();
  
  // Calculate read time
  if (this.body) {
    const wordCount = this.body.split(' ').length;
    const minutes = Math.ceil(wordCount / 200);
    this.readTime = `${minutes} min read`;
  }
  
  next();
});

module.exports = mongoose.model('Blog', blogSchema);