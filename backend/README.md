# Echo Backend API

A robust, scalable backend API server for the Echo web application - a mindful social platform designed for peaceful digital connections.

## 🌟 Features

- **RESTful API** - Clean, well-documented endpoints
- **Real-time Chat** - WebSocket-powered messaging for World Chat and Streams
- **User Authentication** - JWT-based secure authentication
- **Content Moderation** - Intelligent word filtering and content validation
- **Blog Management** - Full CRUD operations for blog posts
- **Friend System** - Send, accept, and manage friend connections
- **Profile Customization** - Bloom styles and color palettes
- **MongoDB Integration** - Scalable document database
- **Rate Limiting** - Protection against abuse
- **Input Validation** - Comprehensive data validation
- **Error Handling** - Graceful error responses
- **Deployment Ready** - Configured for Render deployment

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB Atlas account (or local MongoDB)
- Environment variables configured

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run dev

# Start production server
npm start
```

### Environment Variables

Create a `.env` file in the root directory:

```env
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/echo
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
FRONTEND_URL=https://your-frontend-domain.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
WS_HEARTBEAT_INTERVAL=30000
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh-token` - Refresh JWT token

### Blog Management
- `POST /api/blogs/create` - Create new blog post
- `GET /api/blogs` - Get all blog posts (with pagination)
- `GET /api/blogs/:id` - Get specific blog post
- `GET /api/blogs/author/:username` - Get blogs by author
- `GET /api/blogs/most-liked` - Get most liked blogs
- `POST /api/blogs/like` - Like a blog post
- `POST /api/blogs/dislike` - Dislike a blog post

### Friend System
- `POST /api/friend-request` - Send friend request
- `POST /api/friend-request/accept` - Accept friend request
- `POST /api/friend-request/reject` - Reject friend request
- `GET /api/friend-requests` - Get pending friend requests
- `GET /api/friends` - Get friends list
- `DELETE /api/friends/:username` - Remove friend

### Profile Management
- `GET /api/profile/:username` - Get user profile
- `POST /api/profile/:username/edit` - Edit user profile
- `GET /api/profile/:username/streams` - Get user's streams
- `POST /api/profile/:username/streams/join` - Join a stream
- `POST /api/profile/:username/streams/leave` - Leave a stream

### Crowdfunding (Demo)
- `POST /api/crowdfunding` - Submit funding request (dummy)
- `GET /api/crowdfunding/:requestId` - Get request status (dummy)

### Health Check
- `GET /health` - Server health status

## 🔌 WebSocket API

Connect to: `ws://localhost:10000/ws`

### Message Types

#### Authentication
```json
{
  "type": "auth",
  "token": "your-jwt-token"
}
```

#### World Chat
```json
{
  "type": "world_chat",
  "message": "Hello, peaceful world!"
}
```

#### Stream Chat
```json
{
  "type": "stream_chat",
  "streamName": "mindful-moments",
  "message": "Sharing some wisdom here"
}
```

#### Stream Management
```json
{
  "type": "join_stream",
  "streamName": "mindful-moments"
}
```

```json
{
  "type": "leave_stream",
  "streamName": "mindful-moments"
}
```

#### Heartbeat
```json
{
  "type": "heartbeat"
}
```

## 🛡️ Security Features

- **JWT Authentication** - Secure token-based authentication
- **Rate Limiting** - Protection against API abuse
- **Input Validation** - Comprehensive data sanitization
- **CORS Protection** - Cross-origin request filtering
- **Helmet Security** - HTTP security headers
- **Content Filtering** - Toxic word detection and removal
- **PII Protection** - Automatic phone/email removal

## 🗄️ Database Schema

### User Model
- Username, bio, bloom customization
- Friends list and pending requests
- Authentication tokens
- Activity tracking

### Blog Model  
- Title, content, author information
- Engagement metrics (likes, dislikes, views)
- Tags and categorization
- Publishing workflow

### ChatHistory Model
- Message content and metadata
- Chat type (world, stream, grotto)
- Moderation flags and filtering
- TTL for automatic cleanup

## 🔧 Development

### Project Structure
```
src/
├── config/          # Database and app configuration
├── controllers/     # Request handlers
├── middleware/      # Authentication, validation, etc.
├── models/          # MongoDB schemas
├── routes/          # API route definitions
├── utils/           # Utility functions
└── server.js        # Main application entry point
```

### Scripts
- `npm run dev` - Development server with nodemon
- `npm start` - Production server
- `npm test` - Run tests (when implemented)

### Code Quality
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Nodemon** - Development auto-restart
- **Morgan** - HTTP request logging

## 🚀 Deployment

### Render Deployment

1. **Create Render Account**
   - Sign up at [render.com](https://render.com)

2. **Connect Repository**
   - Link your GitHub repository
   - Select the backend directory

3. **Configure Environment**
   - Set environment variables in Render dashboard
   - Ensure MongoDB Atlas is accessible

4. **Deploy Settings**
   ```
   Build Command: npm install
   Start Command: npm start
   Node Version: 18
   ```

5. **Environment Variables**
   Set all required variables from `.env.example`

### MongoDB Atlas Setup

1. Create cluster at [mongodb.com](https://mongodb.com)
2. Configure network access (0.0.0.0/0 for Render)
3. Create database user
4. Get connection string
5. Add to `MONGODB_URI` environment variable

### Domain Configuration
- Update `FRONTEND_URL` with your frontend domain
- Configure CORS settings as needed

## 📊 Monitoring

The server includes built-in monitoring:
- Health check endpoint (`/health`)
- Connection status tracking
- Error logging and handling
- Performance metrics via Morgan
- Database connection monitoring

## 🤝 API Response Format

All API responses follow this consistent format:

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "ERROR_CODE",
  "details": {
    // Additional error details
  }
}
```

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check MongoDB URI format
   - Verify network access in Atlas
   - Ensure credentials are correct

2. **WebSocket Connection Issues**
   - Verify WebSocket URL format
   - Check CORS configuration
   - Ensure proper authentication

3. **Rate Limiting**
   - Adjust limits in environment variables
   - Implement exponential backoff on client

4. **Authentication Errors**
   - Verify JWT secret consistency
   - Check token expiration settings
   - Ensure proper header format

## 📈 Performance Optimization

- **Database Indexing** - Optimized queries
- **Connection Pooling** - Efficient DB connections
- **Response Compression** - Reduced payload size
- **Rate Limiting** - Resource protection
- **Graceful Degradation** - Fallback mechanisms

## 🔮 Future Enhancements

- [ ] Redis caching layer
- [ ] Advanced analytics
- [ ] Push notifications
- [ ] File upload support
- [ ] Advanced moderation AI
- [ ] Multi-language support
- [ ] Comprehensive testing suite

## 📄 License

This project is licensed under the MIT License.

## 🌟 Contributing

1. Fork the repository
2. Create feature branch
3. Commit your changes
4. Push to the branch
5. Create Pull Request

---

Built with ❤️ for peaceful digital connections.