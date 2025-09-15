const mongoose = require('mongoose');

/**
 * Database Configuration
 * Handles MongoDB connection and configuration
 */

const connectDB = async () => {
  try {
    // MongoDB connection options
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 1
    };

    // Connect to MongoDB
    const conn = await mongoose.connect(process.env.MONGODB_URI, options);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // Connection event listeners
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('📴 MongoDB connection closed through app termination');
      process.exit(0);
    });

    return conn;
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

/**
 * Initialize database with default data
 */
const initializeDatabase = async () => {
  try {
    const { User } = require('../models');

    // Check if FINN user exists, if not create it
    const finnUser = await User.findByUsername('FINN');
    
    if (!finnUser) {
      console.log('🐬 Creating FINN user...');
      
      const finn = await User.createUser({
        username: 'FINN',
        happyChoice: 'inspired',
        bio: 'Friendly dolphin spreading joy and wisdom across the digital seas. Always here to help fellow Echo travelers find their peaceful path. 🌊✨',
        bloom: '🐬',
        bloomStyle: 'cosmic',
        colorPalette: 'teal'
      });

      console.log('✅ FINN user created successfully');
    } else {
      console.log('✅ FINN user already exists');
    }

    // Create indexes for better performance
    await createIndexes();
    
  } catch (error) {
    console.error('❌ Error initializing database:', error.message);
  }
};

/**
 * Create database indexes for better performance
 */
const createIndexes = async () => {
  try {
    const { User, Blog, ChatHistory } = require('../models');

    // Helper function to create index safely
    const createIndexSafe = async (collection, indexSpec, options = {}) => {
      try {
        await collection.createIndex(indexSpec, options);
      } catch (error) {
        if (error.code !== 85) { // Index already exists error
          console.warn(`⚠️ Index creation warning:`, error.message);
        }
      }
    };

    // User indexes
    await createIndexSafe(User.collection, { username: 1 }, { unique: true });
    await createIndexSafe(User.collection, { 'pendingFriendRequests.from': 1 });
    await createIndexSafe(User.collection, { friends: 1 });
    await createIndexSafe(User.collection, { createdAt: -1 });

    // Blog indexes
    await createIndexSafe(Blog.collection, { author: 1, createdAt: -1 });
    await createIndexSafe(Blog.collection, { publishDate: -1 });
    await createIndexSafe(Blog.collection, { likes: -1 });
    await createIndexSafe(Blog.collection, { tags: 1 });
    await createIndexSafe(Blog.collection, { category: 1 });
    await createIndexSafe(Blog.collection, { 
      title: 'text', 
      body: 'text' 
    });

    // ChatHistory indexes
    await createIndexSafe(ChatHistory.collection, { chatType: 1, timestamp: -1 });
    await createIndexSafe(ChatHistory.collection, { streamName: 1, timestamp: -1 });
    await createIndexSafe(ChatHistory.collection, { grottoParticipants: 1, timestamp: -1 });
    await createIndexSafe(ChatHistory.collection, { username: 1, timestamp: -1 });
    await createIndexSafe(ChatHistory.collection, { timestamp: -1 });
    
    // TTL index for automatic cleanup (30 days) - only create if not exists
    try {
      const existingIndexes = await ChatHistory.collection.listIndexes().toArray();
      const ttlIndexExists = existingIndexes.some(index => 
        index.expireAfterSeconds !== undefined
      );
      
      if (!ttlIndexExists) {
        await createIndexSafe(ChatHistory.collection, 
          { timestamp: 1 }, 
          { expireAfterSeconds: 2592000 }
        );
      }
    } catch (error) {
      console.warn('⚠️ TTL index creation warning:', error.message);
    }

    console.log('✅ Database indexes created successfully');
  } catch (error) {
    console.error('❌ Error creating indexes:', error.message);
  }
};

/**
 * Get database connection status
 */
const getConnectionStatus = () => {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };

  return {
    status: states[mongoose.connection.readyState],
    host: mongoose.connection.host,
    name: mongoose.connection.name,
    collections: Object.keys(mongoose.connection.collections)
  };
};

/**
 * Close database connection
 */
const closeConnection = async () => {
  try {
    await mongoose.connection.close();
    console.log('📴 Database connection closed');
  } catch (error) {
    console.error('❌ Error closing database connection:', error.message);
  }
};

module.exports = {
  connectDB,
  initializeDatabase,
  createIndexes,
  getConnectionStatus,
  closeConnection
};