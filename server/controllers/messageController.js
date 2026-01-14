import Message from '../models/Message.js';
import Chat from '../models/Chat.js';
import User from '../models/User.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';

// Send message
export const sendMessage = async (req, res, next) => {
  try {
    const { content, chatId } = req.body;

    if (!content && !req.file) {
      return res.status(400).json({ message: 'Message content or file is required' });
    }

    if (!chatId) {
      return res.status(400).json({ message: 'Chat ID is required' });
    }

    let fileUrl = null;

    // Handle file upload if exists
    if (req.file) {
      try {
        const uploadedFile = await uploadToCloudinary(req.file);
        fileUrl = uploadedFile.secure_url;
      } catch (uploadError) {
        return res.status(500).json({ message: 'Error uploading file: ' + uploadError.message });
      }
    }

    let messageData = {
      sender: req.userId,
      content: content || 'Sent a file',
      chat: chatId,
    };

    if (fileUrl) {
      messageData.fileUrl = fileUrl;
    }

    let message = await Message.create(messageData);

    message = await message.populate('sender', 'name avatar email');
    message = await message.populate('chat');
    message = await User.populate(message, {
      path: 'chat.users',
      select: 'name avatar email',
    });

    // Update chat's lastMessage
    await Chat.findByIdAndUpdate(chatId, { lastMessage: message._id });

    res.status(201).json({
      success: true,
      message,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all messages for a chat
export const allMessages = async (req, res, next) => {
  try {
    const { chatId } = req.params;

    if (!chatId) {
      return res.status(400).json({ message: 'Chat ID is required' });
    }

    const messages = await Message.find({ chat: chatId })
      .populate('sender', 'name avatar email')
      .populate('chat')
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark message as read
export const markAsRead = async (req, res, next) => {
  try {
    const { messageId } = req.params;

    if (!messageId) {
      return res.status(400).json({ message: 'Message ID is required' });
    }

    const message = await Message.findByIdAndUpdate(
      messageId,
      { $addToSet: { readBy: req.userId } },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    res.status(200).json({
      success: true,
      message,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add reaction to message
export const addReaction = async (req, res, next) => {
  try {
    const { messageId, emoji } = req.body;

    if (!messageId || !emoji) {
      return res
        .status(400)
        .json({ message: 'Message ID and emoji are required' });
    }

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Check if user already reacted with this emoji
    const existingReaction = message.reactions.find(
      (r) => r.user.toString() === req.userId && r.emoji === emoji
    );

    if (existingReaction) {
      // Remove reaction if it exists
      message.reactions = message.reactions.filter(
        (r) => !(r.user.toString() === req.userId && r.emoji === emoji)
      );
    } else {
      // Add reaction
      message.reactions.push({
        user: req.userId,
        emoji,
      });
    }

    await message.save();

    res.status(200).json({
      success: true,
      message,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete message
export const deleteMessage = async (req, res, next) => {
  try {
    const { messageId } = req.params;

    if (!messageId) {
      return res.status(400).json({ message: 'Message ID is required' });
    }

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Only sender can delete
    if (message.sender.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this message' });
    }

    message.isDeleted = true;
    await message.save();

    res.status(200).json({
      success: true,
      message: 'Message deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
