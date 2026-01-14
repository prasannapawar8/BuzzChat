import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import 'express-async-errors';

// Import routes
import authRoutes from './routes/authRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import messageRoutes from './routes/messageRoutes.js';

// Import middleware
import { errorHandler } from './middleware/errorHandler.js';

// Load env variables
dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Error handling middleware
app.use(errorHandler);

// Socket.IO Events
const userSocketMap = {}; // userId -> socketId

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // User joins (setup)
  socket.on('setup', (userId) => {
    userSocketMap[userId] = socket.id;
    socket.join(userId);
    socket.emit('connected');
    io.emit('user-online', { userId, isOnline: true });
    console.log(`User ${userId} connected with socket ${socket.id}`);
  });

  // Join chat room
  socket.on('join chat', (chatId) => {
    socket.join(chatId);
    console.log(`User joined chat: ${chatId}`);
  });

  // Send message
  socket.on('new message', (newMessage) => {
    const chat = newMessage.chat;

    if (!chat.users) {
      return console.log('Chat.users not defined');
    }

    // Send to all users in the chat except sender
    chat.users.forEach((user) => {
      if (user._id !== newMessage.sender._id) {
        socket.in(user._id).emit('message received', newMessage);
      }
    });
  });

  // Typing indicator
  socket.on('typing', (data) => {
    const { chatId, userId } = data;
    socket.in(chatId).emit('typing', { userId, chatId });
  });

  // Stop typing
  socket.on('stop typing', (data) => {
    const { chatId, userId } = data;
    socket.in(chatId).emit('stop typing', { userId, chatId });
  });

  // Mark as read
  socket.on('message read', (messageId) => {
    io.emit('message-read', messageId);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    // Find and remove user from map
    for (const userId in userSocketMap) {
      if (userSocketMap[userId] === socket.id) {
        delete userSocketMap[userId];
        io.emit('user-offline', { userId, isOnline: false });
        break;
      }
    }
    console.log('User disconnected:', socket.id);
  });
});

// Database connection
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/buzzchat')
  .then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch((err) => {
    console.log('MongoDB connection error:', err);
    process.exit(1);
  });

// Start server
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export { io };
