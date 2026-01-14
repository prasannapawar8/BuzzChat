import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      default: '',
    },
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chat',
      required: true,
    },
    fileUrl: {
      type: String,
      default: null,
    },
    readBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    reactions: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        emoji: String,
      },
    ],
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Message', messageSchema);
