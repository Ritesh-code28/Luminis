const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

// Import configurations and utilities
const { connectDB, initializeDatabase } = require('./config/database');
const { wordTracker } = require('./utils/wordTracker');
const { 
  initializeFinn, 
  analyzeMessageForSupport, 
  generateSupportiveResponse,
  conversationMonitor
} = require('./utils/finnAI');
const { authenticateWebSocket, createWebSocketRateLimit } = require('./middleware/auth');
const { ChatHistory } = require('./models');

// Import routes
const authRoutes = require('./routes/authRoutes');
const blogRoutes = require('./routes/blogRoutes');
const friendRoutes = require('./routes/friendRoutes');
const profileRoutes = require('./routes/profileRoutes');
const crowdfundingRoutes = require('./routes/crowdfundingRoutes');

// Initialize Express app
const app = express();
const server = http.createServer(app);

// WebSocket server
const wss = new WebSocket.Server({ 
  server,
  path: '/ws'
});

// WebSocket rate limiting
const wsRateLimit = createWebSocketRateLimit(20, 60000); // 20 messages per minute

// Store active WebSocket connections
const activeConnections = new Map();
const streamConnections = new Map();

/**
 * CORS configuration
 */
const corsOptions = {
  origin: process.env.FRONTEND_URL || ['http://localhost:3000', 'https://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

/**
 * Static file serving configuration
 */
const frontendDistPath = path.join(__dirname, '../../frontend/dist');

/**
 * Rate limiting configuration
 */
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
    error: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Middleware setup
 */
app.use(helmet({
  crossOriginEmbedderPolicy: false
}));
app.use(compression());
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(limiter);

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Echo API Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
});

/**
 * API Routes
 */
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api', friendRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/crowdfunding', crowdfundingRoutes);

/**
 * Serve static files from React build
 */
app.use(express.static(frontendDistPath));

/**
 * Handle React Router - send all non-API requests to React app
 */
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendDistPath, 'index.html'));
});

/**
 * WebSocket connection handling
 */
wss.on('connection', (ws, req) => {
  console.log('🔌 New WebSocket connection attempt');

  ws.on('message', async (data) => {
    try {
      const message = JSON.parse(data.toString());
      
      // Handle different message types
      switch (message.type) {
        case 'auth':
          await handleWebSocketAuth(ws, message);
          break;
        case 'world_chat':
          await handleWorldChat(ws, message);
          break;
        case 'stream_chat':
          await handleStreamChat(ws, message);
          break;
        case 'join_stream':
          await handleJoinStream(ws, message);
          break;
        case 'leave_stream':
          await handleLeaveStream(ws, message);
          break;
        case 'heartbeat':
          handleHeartbeat(ws);
          break;
        default:
          ws.send(JSON.stringify({
            type: 'error',
            message: 'Unknown message type'
          }));
      }
    } catch (error) {
      console.error('❌ WebSocket message error:', error);
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Invalid message format'
      }));
    }
  });

  ws.on('close', () => {
    // Clean up user connections
    for (const [userId, connection] of activeConnections.entries()) {
      if (connection.ws === ws) {
        activeConnections.delete(userId);
        console.log(`👋 User ${userId} disconnected`);
        break;
      }
    }

    // Clean up stream connections
    for (const [streamName, connections] of streamConnections.entries()) {
      const filteredConnections = connections.filter(conn => conn.ws !== ws);
      if (filteredConnections.length === 0) {
        streamConnections.delete(streamName);
      } else {
        streamConnections.set(streamName, filteredConnections);
      }
    }
  });

  ws.on('error', (error) => {
    console.error('❌ WebSocket error:', error);
  });
});

/**
 * Handle WebSocket authentication
 */
const handleWebSocketAuth = async (ws, message) => {
  try {
    const { token } = message;
    const authResult = await authenticateWebSocket(token);
    
    // Store authenticated connection
    activeConnections.set(authResult.user._id.toString(), {
      ws,
      user: authResult.user,
      lastActivity: Date.now()
    });

    ws.send(JSON.stringify({
      type: 'auth_success',
      user: authResult.user.toPublicProfile()
    }));

    console.log(`✅ User ${authResult.user.username} authenticated`);
  } catch (error) {
    ws.send(JSON.stringify({
      type: 'auth_error',
      message: error.message
    }));
  }
};

/**
 * Handle world chat messages
 */
const handleWorldChat = async (ws, message) => {
  try {
    const connection = findConnectionByWs(ws);
    if (!connection) {
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Authentication required'
      }));
      return;
    }

    const { user } = connection;
    const { message: chatMessage } = message;

    // Rate limiting
    if (!wsRateLimit(user._id.toString())) {
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Message rate limit exceeded'
      }));
      return;
    }

    // Filter message content
    const filterResult = wordTracker(chatMessage);

    // Analyze message for FINN support triggers
    const supportTriggers = analyzeMessageForSupport(chatMessage);
    
    // Save to database
    const chatRecord = await ChatHistory.createMessage({
      message: chatMessage,
      filteredMessage: filterResult.filteredMessage,
      username: user.username,
      userAvatar: user.bloom,
      chatType: 'world',
      wasFiltered: filterResult.wasFiltered,
      filterReasons: filterResult.filterReasons
    });

    // Broadcast to all connected users
    const broadcastMessage = {
      type: 'world_chat_message',
      data: chatRecord.toPublicJSON()
    };

    activeConnections.forEach(conn => {
      if (conn.ws.readyState === WebSocket.OPEN) {
        conn.ws.send(JSON.stringify(broadcastMessage));
      }
    });

    // FINN's proactive responses
    if (supportTriggers.length > 0) {
      // Delay FINN's response slightly to feel natural
      setTimeout(async () => {
        const finnResponse = generateSupportiveResponse(supportTriggers);
        if (finnResponse) {
          await sendFinnMessage(finnResponse, 'world');
        }
      }, 2000 + Math.random() * 3000); // 2-5 second delay
    }

    // Track conversation patterns for grotto suggestions
    // For world chat, we need to identify who might be talking to each other
    // This is a simplified approach - in a real implementation, you might use more sophisticated NLP
    
    console.log(`💬 World chat message from ${user.username}`);
  } catch (error) {
    console.error('❌ World chat error:', error);
    ws.send(JSON.stringify({
      type: 'error',
      message: 'Failed to send message'
    }));
  }
};

/**
 * Handle stream chat messages
 */
const handleStreamChat = async (ws, message) => {
  try {
    const connection = findConnectionByWs(ws);
    if (!connection) {
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Authentication required'
      }));
      return;
    }

    const { user } = connection;
    const { message: chatMessage, streamName } = message;

    // Rate limiting
    if (!wsRateLimit(user._id.toString())) {
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Message rate limit exceeded'
      }));
      return;
    }

    // Check if user is in the stream
    if (!user.joinedStreams.includes(streamName)) {
      ws.send(JSON.stringify({
        type: 'error',
        message: 'You must join the stream first'
      }));
      return;
    }

    // Filter message content
    const filterResult = wordTracker(chatMessage);

    // Save to database
    const chatRecord = await ChatHistory.createMessage({
      message: chatMessage,
      filteredMessage: filterResult.filteredMessage,
      username: user.username,
      userAvatar: user.bloom,
      chatType: 'stream',
      streamName,
      wasFiltered: filterResult.wasFiltered,
      filterReasons: filterResult.filterReasons
    });

    // Broadcast to stream members
    const streamConnections = getStreamConnections(streamName);
    const broadcastMessage = {
      type: 'stream_chat_message',
      streamName,
      data: chatRecord.toPublicJSON()
    };

    streamConnections.forEach(conn => {
      if (conn.ws.readyState === WebSocket.OPEN) {
        conn.ws.send(JSON.stringify(broadcastMessage));
      }
    });

    console.log(`🌊 Stream message from ${user.username} in ${streamName}`);
  } catch (error) {
    console.error('❌ Stream chat error:', error);
    ws.send(JSON.stringify({
      type: 'error',
      message: 'Failed to send message'
    }));
  }
};

/**
 * Handle joining a stream
 */
const handleJoinStream = async (ws, message) => {
  try {
    const connection = findConnectionByWs(ws);
    if (!connection) {
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Authentication required'
      }));
      return;
    }

    const { streamName } = message;
    
    // Add connection to stream
    if (!streamConnections.has(streamName)) {
      streamConnections.set(streamName, []);
    }
    
    const connections = streamConnections.get(streamName);
    if (!connections.find(conn => conn.ws === ws)) {
      connections.push(connection);
    }

    ws.send(JSON.stringify({
      type: 'stream_joined',
      streamName
    }));

    console.log(`🌊 User ${connection.user.username} joined stream ${streamName}`);
  } catch (error) {
    console.error('❌ Join stream error:', error);
    ws.send(JSON.stringify({
      type: 'error',
      message: 'Failed to join stream'
    }));
  }
};

/**
 * Handle leaving a stream
 */
const handleLeaveStream = async (ws, message) => {
  try {
    const { streamName } = message;
    
    if (streamConnections.has(streamName)) {
      const connections = streamConnections.get(streamName);
      const filteredConnections = connections.filter(conn => conn.ws !== ws);
      
      if (filteredConnections.length === 0) {
        streamConnections.delete(streamName);
      } else {
        streamConnections.set(streamName, filteredConnections);
      }
    }

    ws.send(JSON.stringify({
      type: 'stream_left',
      streamName
    }));

    console.log(`👋 User left stream ${streamName}`);
  } catch (error) {
    console.error('❌ Leave stream error:', error);
  }
};

/**
 * Handle heartbeat
 */
const handleHeartbeat = (ws) => {
  const connection = findConnectionByWs(ws);
  if (connection) {
    connection.lastActivity = Date.now();
  }
  
  ws.send(JSON.stringify({
    type: 'heartbeat_ack'
  }));
};

/**
 * Helper function to send FINN's messages
 */
const sendFinnMessage = async (message, chatType = 'world', streamName = null) => {
  try {
    // Create FINN's message record
    const chatRecord = await ChatHistory.createMessage({
      message: message,
      filteredMessage: message, // FINN's messages are already clean
      username: 'FINN',
      userAvatar: '🐬',
      chatType: chatType,
      streamName: streamName,
      wasFiltered: false,
      filterReasons: []
    });

    // Broadcast FINN's message
    const broadcastMessage = {
      type: chatType === 'world' ? 'world_chat_message' : 'stream_chat_message',
      data: chatRecord.toPublicJSON()
    };

    if (streamName) {
      broadcastMessage.streamName = streamName;
    }

    // Send to appropriate audience
    if (chatType === 'world') {
      activeConnections.forEach(conn => {
        if (conn.ws.readyState === WebSocket.OPEN) {
          conn.ws.send(JSON.stringify(broadcastMessage));
        }
      });
    } else if (chatType === 'stream' && streamName) {
      const streamConnections = getStreamConnections(streamName);
      streamConnections.forEach(conn => {
        if (conn.ws.readyState === WebSocket.OPEN) {
          conn.ws.send(JSON.stringify(broadcastMessage));
        }
      });
    }

    console.log(`🐬 FINN sent ${chatType} message: ${message.substring(0, 50)}...`);
  } catch (error) {
    console.error('❌ Error sending FINN message:', error);
  }
};

/**
 * Helper functions
 */
const findConnectionByWs = (ws) => {
  for (const connection of activeConnections.values()) {
    if (connection.ws === ws) {
      return connection;
    }
  }
  return null;
};

const getStreamConnections = (streamName) => {
  return streamConnections.get(streamName) || [];
};

/**
 * Cleanup inactive connections
 */
setInterval(() => {
  const now = Date.now();
  const timeout = 5 * 60 * 1000; // 5 minutes

  for (const [userId, connection] of activeConnections.entries()) {
    if (now - connection.lastActivity > timeout) {
      if (connection.ws.readyState === WebSocket.OPEN) {
        connection.ws.close();
      }
      activeConnections.delete(userId);
      console.log(`🧹 Cleaned up inactive connection for user ${userId}`);
    }
  }
}, 60000); // Check every minute



/**
 * Global error handler
 */
app.use((error, req, res, next) => {
  console.error('🚨 Global error handler:', error);

  if (error.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      error: 'VALIDATION_ERROR',
      details: Object.values(error.errors).map(err => err.message)
    });
  }

  if (error.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format',
      error: 'INVALID_ID'
    });
  }

  if (error.code === 11000) {
    return res.status(409).json({
      success: false,
      message: 'Resource already exists',
      error: 'DUPLICATE_RESOURCE'
    });
  }

  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : 'INTERNAL_ERROR'
  });
});

/**
 * Start server
 */
const PORT = process.env.PORT || 10000;

const startServer = async () => {
  try {
    // Connect to database
    await connectDB();
    await initializeDatabase();
    
    // Initialize FINN AI
    await initializeFinn();
    
    // Start server
    server.listen(PORT, () => {
      console.log(`🚀 Echo API Server running on port ${PORT}`);
      console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔌 WebSocket server ready at ws://localhost:${PORT}/ws`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('📴 SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

// Start the server
startServer();

module.exports = { app, server, wss };