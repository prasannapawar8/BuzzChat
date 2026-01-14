# BuzzChat - Real-time Chat Application

A full-stack real-time chat application built with React, Node.js, Express, Socket.IO, and MongoDB. Similar to WhatsApp/Slack with support for 1-to-1 chat, group chat, real-time messaging, typing indicators, and online status.

## 🎯 Features

### Core Features

- ✅ **Authentication**: User registration & login with JWT & bcrypt
- ✅ **1-to-1 Chat**: Real-time messaging between users
- ✅ **Group Chat**: Create groups, add/remove members
- ✅ **Real-time Messaging**: Socket.IO for instant message delivery
- ✅ **Typing Indicators**: See when users are typing
- ✅ **Online Status**: Real-time user online/offline tracking
- ✅ **Message Read Receipts**: Track read status
- ✅ **File Sharing**: Upload images and files via Cloudinary

### Advanced Features

- ✅ **Message Reactions**: React with emojis (👍 ❤️ 😂)
- ✅ **Delete Messages**: Remove messages from conversation
- ✅ **Responsive Design**: Mobile-first, works on all devices
- ✅ **Dark Mode Ready**: Tailwind CSS customizable theme
- ✅ **Search Users**: Find and add users to start chat

## 🧱 Tech Stack

### Frontend

- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Socket.IO Client** - Real-time communication
- **Zustand** - State management
- **React Router** - Navigation
- **React Hot Toast** - Notifications

### Backend

- **Node.js** - Runtime
- **Express** - Web framework
- **Socket.IO** - WebSocket library
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Multer** - File uploads
- **Cloudinary** - Cloud storage

## 📁 Project Structure

```
Real-time-chat-application/
├── client/                          # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatList.jsx
│   │   │   ├── ChatBox.jsx
│   │   │   ├── MessageBubble.jsx
│   │   │   ├── TypingIndicator.jsx
│   │   │   └── GroupModal.jsx
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   └── ChatPage.jsx
│   │   ├── utils/
│   │   │   ├── api.js              # Axios instance
│   │   │   ├── store.js            # Zustand stores
│   │   │   └── socket.js           # Socket.IO setup
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── package.json
│   └── .env.example
│
├── server/                          # Backend (Node.js + Express)
│   ├── models/
│   │   ├── User.js                 # User schema with bcrypt
│   │   ├── Chat.js                 # Chat schema (1-to-1 & groups)
│   │   └── Message.js              # Message schema with reactions
│   ├── controllers/
│   │   ├── authController.js       # Auth logic
│   │   ├── chatController.js       # Chat CRUD
│   │   └── messageController.js    # Message operations
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── chatRoutes.js
│   │   └── messageRoutes.js
│   ├── middleware/
│   │   ├── auth.js                 # JWT authentication
│   │   └── errorHandler.js         # Error handling
│   ├── utils/
│   │   ├── cloudinary.js           # Cloudinary upload
│   │   └── multer.js               # File middleware
│   ├── server.js                   # Main server with Socket.IO
│   ├── package.json
│   └── .env.example
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Cloudinary account (free tier)

### Installation

#### 1. Clone and Setup Backend

```bash
cd server
npm install
```

Create `.env` file:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/chat-app
JWT_SECRET=your_super_secret_jwt_key_12345
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

#### 2. Setup Frontend

```bash
cd client
npm install
```

Create `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

### Running the Application

#### Terminal 1 - Backend Server

```bash
cd server
npm run dev
```

Backend will run on `http://localhost:5000`

#### Terminal 2 - Frontend Dev Server

```bash
cd client
npm run dev
```

Frontend will run on `http://localhost:5173`

Open [http://localhost:5173](http://localhost:5173) in your browser and start chatting!

## 📡 Socket.IO Events

### Client Events (Emitted)

```javascript
socket.emit("setup", userId); // Connect user
socket.emit("join chat", chatId); // Join chat room
socket.emit("new message", messageObject); // Send message
socket.emit("typing", { chatId, userId }); // Typing indicator
socket.emit("stop typing", { chatId, userId }); // Stop typing
socket.emit("message read", messageId); // Mark as read
```

### Server Events (Listened)

```javascript
socket.on("connected"); // Connected confirmation
socket.on("message received", message); // Receive new message
socket.on("typing", { userId, chatId }); // User typing
socket.on("stop typing", { userId }); // Stop typing
socket.on("user-online", { userId }); // User came online
socket.on("user-offline", { userId }); // User went offline
socket.on("message-read", messageId); // Message read receipt
```

## 🔐 API Endpoints

### Authentication

```
POST   /api/auth/register          Register user
POST   /api/auth/login             Login user
GET    /api/auth/me                Get current user (protected)
PUT    /api/auth/update            Update profile (protected)
GET    /api/auth/users             Get all users (protected)
```

### Chats

```
POST   /api/chat                   Get or create 1-to-1 chat (protected)
GET    /api/chat                   Fetch all chats (protected)
POST   /api/chat/group             Create group chat (protected)
PUT    /api/chat/rename            Rename group (protected)
PUT    /api/chat/groupadd          Add user to group (protected)
PUT    /api/chat/groupremove       Remove user from group (protected)
```

### Messages

```
POST   /api/message                Send message (protected)
GET    /api/message/:chatId        Get messages (protected)
PUT    /api/message/:messageId/read  Mark as read (protected)
PUT    /api/message/reaction/add   Add reaction (protected)
DELETE /api/message/:messageId     Delete message (protected)
```

## 🗂️ Database Schema

### User

```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  avatar: String (URL),
  isOnline: Boolean,
  socketId: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Chat

```javascript
{
  chatName: String,
  isGroupChat: Boolean,
  users: [ObjectId],          // References to User
  groupAdmin: ObjectId,       // Reference to User
  lastMessage: ObjectId,      // Reference to Message
  createdAt: Date,
  updatedAt: Date
}
```

### Message

```javascript
{
  sender: ObjectId,           // Reference to User
  content: String,
  chat: ObjectId,             // Reference to Chat
  fileUrl: String,
  readBy: [ObjectId],         // References to Users
  reactions: [{               // Message reactions
    user: ObjectId,
    emoji: String
  }],
  isDeleted: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## 🌐 Environment Variables

### Server (.env)

| Variable              | Description           | Example                            |
| --------------------- | --------------------- | ---------------------------------- |
| PORT                  | Server port           | 5000                               |
| MONGODB_URI           | MongoDB connection    | mongodb://localhost:27017/chat-app |
| JWT_SECRET            | JWT signing key       | random_secret_key_123              |
| CLOUDINARY_NAME       | Cloudinary account    | your_account_name                  |
| CLOUDINARY_API_KEY    | Cloudinary API key    | 1234567890                         |
| CLOUDINARY_API_SECRET | Cloudinary secret     | secret_key_xyz                     |
| NODE_ENV              | Environment           | development/production             |
| CLIENT_URL            | Frontend URL for CORS | http://localhost:5173              |

### Client (.env)

| Variable     | Description     | Example                   |
| ------------ | --------------- | ------------------------- |
| VITE_API_URL | Backend API URL | http://localhost:5000/api |

## 🚀 Deployment

### Backend Deployment (Render)

1. Push code to GitHub
2. Create Render account at [render.com](https://render.com)
3. Create New > Web Service
4. Connect GitHub repo
5. Set environment variables
6. Deploy

### Backend Deployment (Railway)

1. Push code to GitHub
2. Create Railway account at [railway.app](https://railway.app)
3. New Project > Deploy from GitHub
4. Select repository
5. Add environment variables
6. Deploy

### Frontend Deployment (Vercel)

1. Push code to GitHub
2. Create Vercel account at [vercel.com](https://vercel.com)
3. Import project
4. Set `VITE_API_URL` to your backend URL
5. Deploy

### Environment Variables for Production

**Render/Railway Backend:**

```
PORT=5000
MONGODB_URI=your_atlas_uri
JWT_SECRET=generate_strong_secret
CLOUDINARY_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
NODE_ENV=production
CLIENT_URL=https://your-frontend-url.vercel.app
```

**Vercel Frontend:**

```
VITE_API_URL=https://your-backend-url.onrender.com/api
```

## 🔧 Configuration Files

### Cloudinary Setup

1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Get API credentials from dashboard
3. Add to `.env` file
4. Images auto-optimize and serve via CDN

### MongoDB Atlas

1. Create account at [mongodb.com/cloud](https://mongodb.com/cloud)
2. Create cluster
3. Get connection string
4. Use in `MONGODB_URI`

## 📝 Key Features Implementation

### Real-time Messaging

- Socket.IO manages connection pooling
- Room-based chat separation
- Automatic reconnection with exponential backoff
- Message buffering during disconnections

### Authentication Flow

1. User registers with email/password
2. Password hashed with bcryptjs (10 rounds)
3. JWT token issued (30-day expiry)
4. Token stored in localStorage
5. Included in Authorization header
6. Verified on each protected route

### Message Delivery

1. Message created in database
2. Emitted through Socket.IO to chat room
3. Received on all connected clients
4. Can add read receipts, reactions
5. Soft delete support (isDeleted flag)

### Typing Indicators

1. Emit "typing" event after keystroke
2. Broadcast to chat room
3. 3-second debounce for "stop typing"
4. Display animated dots UI

### Online Status

1. Emit "setup" on connection
2. Broadcast "user-online" event
3. Remove from online list on disconnect
4. Emit "user-offline" event

## 🎨 Customization

### Theme Colors

Edit `client/tailwind.config.js`:

```javascript
colors: {
  primary: '#075E54',    // WhatsApp green
  secondary: '#25D366',  // Lighter green
  accent: '#ECE5DD',     // Light beige
}
```

### Message Styling

Modify `MessageBubble.jsx` component

### Modal Animations

Update CSS classes in components

## 🧪 Testing

### Test User Registration

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Test Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

## 🐛 Troubleshooting

### MongoDB Connection Issues

- Ensure MongoDB is running: `mongod`
- Check connection string format
- Verify network access for Atlas

### Socket.IO Not Connecting

- Check CORS settings in server.js
- Verify client URL matches SERVER CLIENT_URL
- Check browser console for errors

### Cloudinary Upload Fails

- Verify API credentials
- Check file size (max 10MB)
- Ensure file type is allowed

### Login Issues

- Clear localStorage: `localStorage.clear()`
- Check JWT_SECRET is set
- Verify token hasn't expired

## 📚 Learning Resources

- [Socket.IO Docs](https://socket.io/docs/)
- [React Hooks](https://react.dev/reference/react)
- [MongoDB Docs](https://docs.mongodb.com/)
- [JWT.io](https://jwt.io)
- [Tailwind CSS](https://tailwindcss.com)
- [Zustand](https://github.com/pmndrs/zustand)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙋 Support

For issues or questions:

1. Check existing GitHub issues
2. Create new issue with description
3. Include error screenshots/logs

## 🎓 Resume Points

This project demonstrates:

- ✅ Full-stack development (MERN)
- ✅ Real-time communication (Socket.IO)
- ✅ Authentication & security (JWT, bcrypt)
- ✅ Database design & optimization
- ✅ API design & RESTful principles
- ✅ State management (Zustand)
- ✅ Responsive UI/UX (Tailwind CSS)
- ✅ Deployment & DevOps
- ✅ Error handling & logging
- ✅ Code organization & best practices

## 📈 Future Enhancements

- [ ] End-to-end encryption
- [ ] Voice/video calls
- [ ] Message search
- [ ] User profiles with settings
- [ ] Scheduled messages
- [ ] Message pinning
- [ ] Channel creation
- [ ] Admin panel
- [ ] Analytics dashboard
- [ ] Mobile app (React Native)

---

**Happy Chatting! 💬**

If you found this helpful, please star the repository ⭐
