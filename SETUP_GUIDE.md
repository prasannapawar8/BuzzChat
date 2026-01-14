## 📖 Complete Setup & Development Guide

This guide walks you through setting up, running, and deploying BuzzChat.

---

## 📋 Table of Contents

1. [System Requirements](#system-requirements)
2. [Quick Start (5 minutes)](#quick-start-5-minutes)
3. [Detailed Setup](#detailed-setup)
4. [Testing the Application](#testing-the-application)
5. [Deployment Guide](#deployment-guide)
6. [Architecture & Technology](#architecture--technology)
7. [Development Tips](#development-tips)
8. [Common Issues](#common-issues)

---

## 🖥️ System Requirements

### Minimum Requirements

- **OS**: Windows 10+, macOS 10.15+, Ubuntu 20.04+
- **Node.js**: 16.0.0 or higher
- **npm**: 7.0.0 or higher
- **RAM**: 4GB
- **Disk Space**: 2GB

### Required Accounts (Free)

- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) - Database
- [Cloudinary](https://cloudinary.com) - File Storage
- [GitHub](https://github.com) - Version Control (for deployment)
- [Render](https://render.com) or [Railway](https://railway.app) - Backend Hosting
- [Vercel](https://vercel.com) - Frontend Hosting

### Installation

#### Windows

1. Download and install Node.js from [nodejs.org](https://nodejs.org)
2. Verify installation:
   ```bash
   node --version
   npm --version
   ```

#### macOS

```bash
brew install node
node --version
npm --version
```

#### Linux (Ubuntu/Debian)

```bash
sudo apt update
sudo apt install nodejs npm
node --version
npm --version
```

---

## 🚀 Quick Start (5 minutes)

### 1. Clone Repository

```bash
git clone <your-repo-url>
cd Real-time-chat-application
```

### 2. Setup Backend

```bash
cd server
npm install
cp .env.example .env
```

Edit `.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/chat-app
JWT_SECRET=dev_secret_key_12345
CLOUDINARY_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### 3. Setup Frontend

```bash
cd ../client
npm install
cp .env.example .env
```

### 4. Run Application

```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

### 5. Open App

Visit: [http://localhost:5173](http://localhost:5173)

---

## 🔧 Detailed Setup

### Backend Setup

#### Step 1: Install Dependencies

```bash
cd server
npm install
```

This installs:

- `express` - Web framework
- `socket.io` - Real-time communication
- `mongoose` - Database ODM
- `jsonwebtoken` - Authentication
- `bcryptjs` - Password hashing
- `cloudinary` - File uploads
- `multer` - File middleware
- `dotenv` - Environment variables
- `cors` - Cross-origin requests

#### Step 2: Configure Environment

Create `server/.env`:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/chat-app

# JWT
JWT_SECRET=your_super_secret_key_change_this_in_production

# Cloudinary
CLOUDINARY_NAME=dqv1a2b3c
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwx

# CORS
CLIENT_URL=http://localhost:5173
```

#### Step 3: Start Development Server

```bash
npm run dev
```

You should see:

```
Server running on port 5000
MongoDB connected successfully
```

Test health check:

```bash
curl http://localhost:5000/health
```

Response:

```json
{ "status": "Server is running" }
```

---

### Frontend Setup

#### Step 1: Install Dependencies

```bash
cd client
npm install
```

This installs:

- `react` & `react-dom` - UI framework
- `vite` - Build tool
- `tailwindcss` - Styling
- `socket.io-client` - WebSocket client
- `zustand` - State management
- `axios` - HTTP client
- `react-router-dom` - Navigation
- `react-hot-toast` - Notifications

#### Step 2: Configure Environment

Create `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

#### Step 3: Start Development Server

```bash
npm run dev
```

You should see:

```
VITE v4.4.9 ready in 234 ms

➜ Local: http://localhost:5173/
```

#### Step 4: Open Browser

Visit: [http://localhost:5173](http://localhost:5173)

---

### Database Setup

#### Local MongoDB

##### Install MongoDB Community

- **Windows**: Download from [mongodb.com](https://www.mongodb.com/try/download/community)
- **macOS**: `brew install mongodb-community`
- **Linux**: Follow [official guide](https://docs.mongodb.com/manual/installation/)

##### Start MongoDB

```bash
# Windows
mongod

# macOS/Linux
brew services start mongodb-community

# Or using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

Verify connection:

```bash
mongosh
```

---

#### MongoDB Atlas (Cloud)

1. Create account at [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create new project
3. Create M0 cluster (free tier)
4. Add IP to whitelist (or allow all: 0.0.0.0/0)
5. Create database user
6. Get connection string:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/dbname
   ```
7. Add to `.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/chat-app
   ```

---

### Cloudinary Setup

1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Go to Dashboard
3. Copy credentials:
   - Cloud Name
   - API Key
   - API Secret
4. Add to `server/.env`:
   ```
   CLOUDINARY_NAME=your_cloud_name
   CLOUDINARY_API_KEY=123456789
   CLOUDINARY_API_SECRET=abcdefgh
   ```

---

## 🧪 Testing the Application

### Register User

1. Open [http://localhost:5173](http://localhost:5173)
2. Click "Register"
3. Fill in:
   - **Name**: John Doe
   - **Email**: john@example.com
   - **Password**: password123
4. Click Register
5. Should redirect to chat page

### Create Second User

1. Open incognito window
2. Go to [http://localhost:5173](http://localhost:5173)
3. Register another user:
   - **Name**: Jane Smith
   - **Email**: jane@example.com
   - **Password**: password123

### Test 1-to-1 Chat

1. **User 1 (John)**: Search for "Jane" in search bar
2. Click on Jane
3. Type message: "Hi Jane!"
4. Send message
5. **User 2 (Jane)**: Should see message appear instantly

### Test Typing Indicator

1. **User 1**: Start typing in message box
2. **User 2**: Should see "Someone is typing..." with animated dots
3. **User 1**: Wait 3 seconds
4. **User 2**: "typing" indicator should disappear

### Test Group Chat

1. **User 1**: Click "+ Group" button
2. Enter group name: "Dev Team"
3. Select Jane (User 2)
4. Click Create
5. **Both Users**: Should see group in chat list
6. Send messages in group
7. Both should receive instantly

### Test Online Status

1. **User 1 & 2**: Both logged in
2. Keep browser consoles open
3. **User 1**: Close browser tab
4. Check MongoDB or backend logs
5. User should show as offline

### Test Message Features

#### Delete Message

1. Send a message
2. Right-click on message (or look for delete button)
3. Click delete
4. Message should show "Message was deleted"

#### Message Reactions

1. Hover over message
2. Click reaction button
3. Select emoji (👍 ❤️ 😂)
4. Emoji should appear under message

---

## 🚀 Deployment Guide

### Prerequisites for Deployment

- Git repository on GitHub
- MongoDB Atlas account
- Cloudinary account
- Render/Railway account
- Vercel account

---

### Step 1: Prepare for Deployment

#### Create GitHub Repository

```bash
git init
git add .
git commit -m "Initial commit: Full-stack chat app"
git branch -M main
git remote add origin https://github.com/yourusername/chat-app.git
git push -u origin main
```

#### Update Environment Variables

Create production values for each service.

---

### Step 2: Deploy Backend (Render)

1. **Login to Render**

   - Go to [render.com](https://render.com)
   - Sign up or login with GitHub

2. **Create New Web Service**

   - Click "New +" → "Web Service"
   - Connect GitHub account
   - Select repository
   - Select branch: `main`

3. **Configure Service**

   - **Name**: chat-app-server
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Root Directory**: `server`

4. **Add Environment Variables**

   ```
   PORT=5000
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/chat-app
   JWT_SECRET=generate_random_string_here
   CLOUDINARY_NAME=your_name
   CLOUDINARY_API_KEY=your_key
   CLOUDINARY_API_SECRET=your_secret
   CLIENT_URL=https://your-frontend-url.vercel.app
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for build to complete
   - Note the URL: `https://chat-app-server.onrender.com`

---

### Alternative: Deploy Backend (Railway)

1. **Login to Railway**

   - Go to [railway.app](https://railway.app)
   - Connect GitHub

2. **Create Project**

   - Click "New Project"
   - "Deploy from GitHub Repo"
   - Select repository
   - Select branch: `main`

3. **Configure**

   - Select `server` directory
   - Add variables (same as Render)

4. **Deploy**
   - Railway auto-deploys
   - Get URL from Deployments

---

### Step 3: Deploy Frontend (Vercel)

1. **Login to Vercel**

   - Go to [vercel.com](https://vercel.com)
   - Import GitHub repository

2. **Configure Project**

   - **Framework**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

3. **Environment Variables**

   ```
   VITE_API_URL=https://chat-app-server.onrender.com/api
   ```

   (Use your actual backend URL)

4. **Deploy**
   - Click "Deploy"
   - Wait for build
   - Get URL: `https://chat-app-xyz.vercel.app`

---

### Step 4: Update Backend CLIENT_URL

1. Go back to Render/Railway dashboard
2. Edit environment variables
3. Update `CLIENT_URL` to your Vercel URL
4. Redeploy

---

## 🏗️ Architecture & Technology

### Frontend Architecture

```
React App
├── Authentication (JWT tokens stored in localStorage)
├── Socket.IO Connection (persistent WebSocket)
├── State Management (Zustand stores)
└── Components
    ├── LoginPage (Auth flow)
    ├── ChatPage (Main UI)
    ├── ChatList (Sidebar)
    ├── ChatBox (Message area)
    └── GroupModal (Create groups)
```

### Backend Architecture

```
Express Server
├── HTTP Routes (REST API)
├── Socket.IO Events (Real-time)
├── MongoDB (Persistence)
└── Authentication (JWT middleware)
```

### Data Flow

#### Sending a Message

1. User types and clicks send
2. Frontend emits "new message" via Socket.IO
3. Backend creates message in MongoDB
4. Backend emits "message received" to chat room
5. All connected clients receive message
6. Message appears in UI

#### Authentication

1. User registers/logs in
2. Password hashed with bcrypt
3. JWT token generated
4. Token stored in localStorage
5. Token sent with each API request
6. Backend verifies token with JWT middleware

#### Real-time Status

1. User connects → emit "setup" with userId
2. Backend broadcasts "user-online"
3. All clients update online list
4. User disconnects → emit "user-offline"
5. Clients update offline list

---

## 💡 Development Tips

### Useful VS Code Extensions

- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- MongoDB for VS Code
- Thunder Client (API testing)
- WebSocket Client

### Debug Socket.IO Events

```javascript
// In browser console
socket.on("connect", () => console.log("Connected"));
socket.on("disconnect", () => console.log("Disconnected"));
socket.on("*", (event, ...args) => console.log(event, args));
```

### Test API Endpoints

```bash
# Using curl
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'

# Using Thunder Client
# Import from Thunder Client app
```

### Monitor MongoDB

```bash
# In MongoDB shell
db.messages.find().sort({createdAt: -1}).limit(10)
db.chats.find()
db.users.find()
```

### Clear Cache & Reset

```bash
# Frontend
localStorage.clear()
sessionStorage.clear()
# Hard refresh: Ctrl+Shift+R

# Backend
# Delete .env and regenerate
# Clear database in MongoDB
```

---

## 🐛 Common Issues & Solutions

### Issue: "Cannot find module 'express'"

**Solution:**

```bash
cd server
npm install
```

### Issue: "ECONNREFUSED - MongoDB connection failed"

**Solution:**

1. Start MongoDB:
   ```bash
   mongod  # or Docker
   ```
2. Check connection string in `.env`
3. Verify MongoDB is running: `db.adminCommand('ping')`

### Issue: "Socket.IO not connecting"

**Solution:**

1. Check frontend `.env` - `VITE_API_URL` must be correct
2. Check backend CORS - `CLIENT_URL` must match frontend
3. Check browser console for errors
4. Try in incognito mode (no cache)

### Issue: "Cloudinary upload fails"

**Solution:**

1. Verify API credentials in `.env`
2. Check file size < 10MB
3. Check file type is allowed
4. Test credentials: `npm run test:cloudinary`

### Issue: "Port already in use"

**Solution:**

```bash
# Find process on port
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows

# Kill process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

### Issue: "Build fails on Vercel/Render"

**Solution:**

1. Check build logs in dashboard
2. Verify environment variables are set
3. Ensure `package.json` has all dependencies
4. Check Node version compatibility
5. Try building locally first: `npm run build`

### Issue: "Blank page after login"

**Solution:**

1. Check backend is running and accessible
2. Verify `VITE_API_URL` in `.env`
3. Check browser Network tab for API errors
4. Clear localStorage and try again
5. Check browser console for errors

---

## 📚 Additional Resources

### Official Docs

- [React Hooks](https://react.dev/reference/react)
- [Socket.IO Docs](https://socket.io/docs/)
- [Express Guide](https://expressjs.com/)
- [MongoDB Docs](https://docs.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Zustand](https://github.com/pmndrs/zustand)

### Video Tutorials

- Socket.IO Real-time Chat
- MERN Stack Complete Course
- MongoDB Atlas Setup
- Render Deployment Guide

### Helpful Articles

- JWT Authentication Best Practices
- WebSocket vs HTTP
- Database Design Patterns
- React Performance Optimization

---

## 🎓 Next Steps

1. **Customize**: Add your branding, colors, logo
2. **Features**: Add reactions, search, user profiles
3. **Performance**: Add caching, optimize queries
4. **Security**: Add rate limiting, input validation
5. **Testing**: Add unit & integration tests
6. **CI/CD**: Setup automated testing & deployment

---

**Happy Coding! 🚀**

Questions? Check [GitHub Issues](https://github.com/your-repo/issues)
