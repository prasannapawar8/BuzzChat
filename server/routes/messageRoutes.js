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

router.post('/', protect, upload.single('file'), sendMessage);
router.get('/:chatId', protect, allMessages);
router.put('/:messageId/read', protect, markAsRead);
router.put('/reaction/add', protect, addReaction);
router.delete('/:messageId', protect, deleteMessage);

export default router;
