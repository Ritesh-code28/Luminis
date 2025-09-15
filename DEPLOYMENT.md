# Deployment Checklist

## ✅ Local Development Setup Complete

- [x] Root `package.json` created with combined dependencies
- [x] Backend server configured to serve static files
- [x] Frontend `.env` file created with API/WebSocket URLs  
- [x] Frontend build configuration updated
- [x] Procfile and render.yaml created for deployment
- [x] Build process tested successfully
- [x] Server integration tested

## 🚀 Pre-Render Deployment Steps

### 1. Database Setup
- [ ] Set up MongoDB Atlas cluster (or your preferred MongoDB hosting)
- [ ] Get your MongoDB connection string
- [ ] Whitelist all IP addresses (0.0.0.0/0) for Render deployment

### 2. Environment Variables Preparation
Copy these environment variables and their values for Render:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/echo?retryWrites=true&w=majority
JWT_SECRET=your-super-secure-jwt-secret-here
NODE_ENV=production
PORT=10000
```

### 3. Git Repository
- [ ] Initialize git repository: `git init`
- [ ] Add all files: `git add .`
- [ ] Commit: `git commit -m "Initial commit: Full-stack integration complete"`
- [ ] Push to GitHub/GitLab

## 🌐 Render Deployment Steps

### 1. Create Web Service
- [ ] Go to [Render Dashboard](https://render.com)
- [ ] Click "New" → "Web Service"
- [ ] Connect your Git repository
- [ ] Choose the repository containing your code

### 2. Configure Service Settings
- **Name**: `project-echo-finale` (or your preferred name)
- **Environment**: `Node`
- **Region**: Choose closest to your users
- **Branch**: `main` (or your default branch)
- **Root Directory**: Leave empty (uses root)
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm run start`

### 3. Set Environment Variables
In the "Environment" tab, add:
- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: A secure random string
- `NODE_ENV`: `production`
- `PORT`: `10000` (Render may override this)

### 4. Deploy
- [ ] Click "Create Web Service"
- [ ] Wait for deployment to complete (5-10 minutes)
- [ ] Test your deployed application

## 🧪 Post-Deployment Testing

### Test these features on your deployed app:
- [ ] Homepage loads correctly
- [ ] User registration works
- [ ] User login works
- [ ] World Chat page loads
- [ ] WebSocket connection establishes
- [ ] API endpoints respond correctly
- [ ] Static files (CSS, JS, images) load properly

### Common Issues & Solutions

1. **Build Fails**
   - Check that all dependencies are in the root `package.json`
   - Verify the build command in Render matches `npm run build`

2. **Environment Variables Not Working**
   - Double-check variable names match exactly
   - Ensure MongoDB URI is properly formatted

3. **Static Files Not Loading**
   - Verify the backend server is serving from `../frontend/dist`
   - Check the build output directory is correct

4. **WebSocket Connection Fails**
   - Use `wss://` instead of `ws://` for HTTPS deployments
   - Update the `VITE_WS_URL` in production

## 🎉 Success!

Once deployed, your full-stack Echo application will be available at:
`https://your-service-name.onrender.com`

The server handles:
- ✅ Serving the React frontend
- ✅ All API endpoints (`/api/*`)
- ✅ WebSocket connections (`/ws`)
- ✅ Static file serving
- ✅ React Router support (SPA routing)

## 📝 Notes

- The app uses a single server deployment model
- All traffic goes through the Express.js server
- Frontend is served as static files from the `dist` directory
- WebSocket and HTTP traffic share the same port
- Environment variables control development vs production behavior