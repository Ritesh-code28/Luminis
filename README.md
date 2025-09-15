# Project Echo Finale

A mindful social platform combining real-time chat, blogging, and community features. Built with React, Express.js, and WebSockets for a seamless full-stack experience.

## 🌟 Features

- **World Chat**: Global real-time messaging with mindful community guidelines
- **Streams**: Topic-based chat rooms for focused conversations
- **Blogging**: Share thoughts and experiences with rich text editing
- **Bloom Customization**: Personalize your avatar and color palette
- **FINN AI**: Supportive AI companion for mental wellness
- **Friend System**: Connect with like-minded individuals
- **Crowdfunding**: Community support for meaningful projects

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd ProjectEchoFinale
   ```

2. **Install dependencies**
   ```bash
   npm run install-deps
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example environment file
   cp .env.example .env
   
   # Edit .env with your MongoDB URI and other settings
   # Copy the frontend environment file
   cp frontend/.env.example frontend/.env
   ```

4. **Start development servers**
   ```bash
   npm run dev
   ```

   This will start:
   - Backend server on http://localhost:10000
   - Frontend development server on http://localhost:3000

### Production Build

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start the production server**
   ```bash
   npm run start
   ```

   The server will serve both the API and the static frontend files on the same port.

## 📁 Project Structure

```
ProjectEchoFinale/
├── backend/                 # Express.js API server
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── controllers/    # Route handlers
│   │   ├── middleware/     # Custom middleware
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   ├── utils/          # Utility functions
│   │   └── server.js       # Main server file
│   └── package.json
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Route components
│   │   ├── services/       # API service layer
│   │   ├── data/           # Mock data and constants
│   │   └── App.jsx         # Main App component
│   └── package.json
├── package.json            # Root package.json for deployment
├── Procfile               # Render deployment configuration
└── README.md              # This file
```

## 🔧 Available Scripts

From the root directory:

- `npm run dev` - Start both frontend and backend in development mode
- `npm run build` - Build the frontend for production
- `npm run start` - Start the production server
- `npm run install-deps` - Install all dependencies for both frontend and backend

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Blogs
- `GET /api/blogs` - Get all blogs
- `POST /api/blogs` - Create a new blog
- `GET /api/blogs/:id` - Get a specific blog

### Profile
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile

### Friends
- `GET /api/friends` - Get friends list
- `POST /api/friends/request` - Send friend request
- `PUT /api/friends/request/:id` - Respond to friend request

### WebSocket Events
- `world_chat` - Global chat messages
- `stream_chat` - Stream-specific messages
- `join_stream` - Join a chat stream
- `leave_stream` - Leave a chat stream

## 🚀 Deployment

### Render Deployment

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Create a new Web Service on Render**
   - Connect your GitHub repository
   - Render will automatically detect the build and start commands from `package.json`

3. **Set Environment Variables on Render**
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/echo
   JWT_SECRET=your-production-jwt-secret
   NODE_ENV=production
   ```

4. **Deploy**
   - Render will automatically build and deploy your application
   - The build process runs `npm run build` followed by `npm run start`

## 🔒 Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/echo
JWT_SECRET=your-secret-key-here
PORT=10000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:10000
VITE_WS_URL=ws://localhost:10000
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email your-email@example.com or create an issue in this repository.

---

Built with ❤️ by the Echo Team