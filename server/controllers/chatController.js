import Chat from '../models/Chat.js';
import User from '../models/User.js';

// Get or create 1-to-1 chat
export const accessChat = async (req, res, next) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'UserId param not sent with request' });
    }

    let isChat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.userId } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate('users', '-password')
      .populate('lastMessage');

    isChat = await User.populate(isChat, {
      path: 'lastMessage.sender',
      select: 'name avatar email',
    });

    if (isChat.length > 0) {
      res.send(isChat[0]);
    } else {
      const chatData = {
        chatName: 'sender',
        isGroupChat: false,
        users: [req.userId, userId],
      };

      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findById(createdChat._id).populate(
        'users',
        '-password'
      );
      res.status(200).json(FullChat);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fetch all chats for a user
export const fetchChats = async (req, res, next) => {
  try {
    let results = await Chat.find({ users: { $elemMatch: { $eq: req.userId } } })
      .populate('users', '-password')
      .populate('groupAdmin', '-password')
      .populate('lastMessage')
      .sort({ updatedAt: -1 });

    results = await User.populate(results, {
      path: 'lastMessage.sender',
      select: 'name avatar email',
    });

    res.status(200).json({
      success: true,
      chats: results,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create group chat
export const createGroupChat = async (req, res, next) => {
  try {
    const { users, chatName } = req.body;

    if (!users || !chatName) {
      return res.status(400).json({
        message: 'Please provide users and chat name for group chat',
      });
    }

    let parsedUsers;
    try {
      parsedUsers =
        typeof users === 'string' ? JSON.parse(users) : users;
    } catch (e) {
      parsedUsers = users;
    }

    if (parsedUsers.length < 2) {
      return res.status(400).json({
        message: 'More than 2 users are required to form a group chat',
      });
    }

    parsedUsers.push(req.userId);

    const groupChat = await Chat.create({
      chatName,
      users: parsedUsers,
      isGroupChat: true,
      groupAdmin: req.userId,
    });

    const fullGroupChat = await Chat.findById(groupChat._id)
      .populate('users', '-password')
      .populate('groupAdmin', '-password');

    res.status(200).json({
      success: true,
      chat: fullGroupChat,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Rename group
export const renameGroup = async (req, res, next) => {
  try {
    const { chatId, chatName } = req.body;

    if (!chatId || !chatName) {
      return res.status(400).json({ message: 'Please provide chatId and chatName' });
    }

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { chatName },
      { new: true }
    )
      .populate('users', '-password')
      .populate('groupAdmin', '-password');

    if (!updatedChat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    res.status(200).json({
      success: true,
      chat: updatedChat,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add user to group
export const addToGroup = async (req, res, next) => {
  try {
    const { chatId, userId } = req.body;

    if (!chatId || !userId) {
      return res.status(400).json({ message: 'Please provide chatId and userId' });
    }

    const added = await Chat.findByIdAndUpdate(
      chatId,
      { $push: { users: userId } },
      { new: true }
    )
      .populate('users', '-password')
      .populate('groupAdmin', '-password');

    if (!added) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    res.status(200).json({
      success: true,
      chat: added,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove user from group
export const removeFromGroup = async (req, res, next) => {
  try {
    const { chatId, userId } = req.body;

    if (!chatId || !userId) {
      return res.status(400).json({ message: 'Please provide chatId and userId' });
    }

    const removed = await Chat.findByIdAndUpdate(
      chatId,
      { $pull: { users: userId } },
      { new: true }
    )
      .populate('users', '-password')
      .populate('groupAdmin', '-password');

    if (!removed) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    res.status(200).json({
      success: true,
      chat: removed,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
