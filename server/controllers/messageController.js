import Message from '../models/Message.js';
import Chat from '../models/Chat.js';
import User from '../models/User.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';

// Send message
export const sendMessage = async (req, res, next) => {
  try {
    const { content, chatId } = req.body;

    // Validate that either content or file is provided
    const hasContent = content && content.trim() !== '';
    const hasFile = req.file && req.file.buffer;

    if (!hasContent && !hasFile) {
      return res.status(400).json({ message: 'Please provide message content or attach a file' });
    }

    if (!chatId) {
      return res.status(400).json({ message: 'Chat ID is required' });
    }

    let fileUrl = null;

    // Handle file upload if exists
    if (hasFile) {
      try {
        console.log('Uploading file:', req.file.originalname, 'Size:', req.file.size, 'Type:', req.file.mimetype);
        const uploadedFile = await uploadToCloudinary(req.file);
        fileUrl = uploadedFile.secure_url;
        console.log('✅ File uploaded successfully:', fileUrl);
      } catch (uploadError) {
        console.error('❌ Cloudinary upload error in message controller:', {
          error: uploadError.message,
          file: req.file.originalname,
          stack: uploadError.stack
        });
        // Don't return error - allow message to be sent without file
        console.log('Continuing without file upload...');
      }
    }

    let messageData = {
      sender: req.userId,
      content: hasContent ? content.trim() : '',
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

    console.log('Final message object being sent:', {
      _id: message._id,
      content: message.content,
      fileUrl: message.fileUrl,
      sender: message.sender._id,
      createdAt: message.createdAt,
    });

    res.status(201).json({
      success: true,
      message,
    });
  } catch (error) {
    console.error('Send message error:', error);
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
