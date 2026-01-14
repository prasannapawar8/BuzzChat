import express from 'express';
import {
  sendMessage,
  allMessages,
  markAsRead,
  addReaction,
  deleteMessage,
} from '../controllers/messageController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../utils/multer.js';

const router = express.Router();

// Multer error handler middleware
const handleMulterError = (err, req, res, next) => {
  if (err && err.name === 'MulterError') {
    if (err.code === 'FILE_TOO_LARGE') {
      return res.status(400).json({ message: 'File size exceeds 10MB limit' });
    }
    return res.status(400).json({ message: err.message });
  }
  if (err && err.message === 'Invalid file type') {
    return res.status(400).json({ message: 'Invalid file type. Only images and documents allowed.' });
  }
  next();
};

router.post('/', protect, (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    handleMulterError(err, req, res, () => sendMessage(req, res, next));
  });
});

router.get('/:chatId', protect, allMessages);
router.put('/:messageId/read', protect, markAsRead);
router.put('/reaction/add', protect, addReaction);
router.delete('/:messageId', protect, deleteMessage);

export default router;
