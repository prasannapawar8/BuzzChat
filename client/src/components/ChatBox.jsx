import { useState, useEffect, useRef } from "react";
import { useChatStore } from "../utils/store";
import { getSocket } from "../utils/socket";
import api from "../utils/api";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import { FiSend, FiPaperclip, FiX, FiArrowLeft } from "react-icons/fi";

export default function ChatBox({ chat, currentUser, onBack }) {
  const messages = useChatStore((state) => state.messages);
  const typingUsers = useChatStore((state) => state.typingUsers);
  const { setMessages, addMessage } = useChatStore();
  const [messageInput, setMessageInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const fileInputRef = useRef(null);
  const socket = getSocket();

  useEffect(() => {
    fetchMessages();
  }, [chat._id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/message/${chat._id}`);
      setMessages(response.data.messages);
    } catch (error) {
      toast.error("Error fetching messages");
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleTyping = () => {
    if (!isTyping) {
      setIsTyping(true);
      socket?.emit("typing", { chatId: chat._id, userId: currentUser._id });
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      socket?.emit("stop typing", {
        chatId: chat._id,
        userId: currentUser._id,
      });
    }, 3000);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        toast.error("File size must be less than 10MB");
        return;
      }
      setSelectedFile(file);
      toast.success(`File selected: ${file.name}`);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!messageInput.trim() && !selectedFile) {
      toast.error("Please enter a message or select a file");
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("content", messageInput.trim());
      formData.append("chatId", chat._id);

      if (selectedFile) {
        console.log(
          "🚀 Sending file to server:",
          selectedFile.name,
          "Size:",
          selectedFile.size,
          "Type:",
          selectedFile.mimetype
        );
        formData.append("file", selectedFile);
        console.log("FormData entries:", Array.from(formData.entries()));
      }

      console.log("Posting to /message endpoint...");
      const response = await api.post("/message", formData);

      const newMessage = response.data.message;
      console.log("✅ Message response:", newMessage);
      addMessage(newMessage);

      socket?.emit("new message", newMessage);

      setMessageInput("");
      setSelectedFile(null);
      setIsTyping(false);

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      toast.success("Message sent!");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.response?.data?.message || "Error sending message");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      await api.delete(`/message/${messageId}`);
      setMessages(messages.filter((msg) => msg._id !== messageId));
      toast.success("Message deleted");
    } catch (error) {
      toast.error("Error deleting message");
    }
  };

  const getChatName = () => {
    if (chat.isGroupChat) {
      return chat.chatName;
    }
    return chat.users.find((u) => u._id !== currentUser._id)?.name || "User";
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col h-full bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900"
    >
      {/* Chat Header - Premium 3D Glass Effect */}
      <motion.div
        className="relative glass-effect-lg p-4 md:p-6 text-white shadow-xl border-b border-purple-500/20 rounded-b-3xl flex-shrink-0"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-purple-600/40 via-blue-600/40 to-cyan-600/40 rounded-b-3xl"
          animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            {onBack && (
              <motion.button
                onClick={onBack}
                className="md:hidden p-2 hover:bg-white/20 rounded-lg transition"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FiArrowLeft size={24} />
              </motion.button>
            )}
            <div>
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-lg md:text-2xl font-bold bg-gradient-to-r from-purple-300 via-blue-300 to-cyan-300 bg-clip-text text-transparent drop-shadow-lg"
              >
                {getChatName()}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-xs md:text-sm text-cyan-200/80"
              >
                {chat.users.length} member{chat.users.length > 1 ? "s" : ""} •
                Active now
              </motion.p>
            </div>
          </div>
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="text-xl md:text-2xl flex-shrink-0"
          >
            💬
          </motion.div>
        </div>
      </motion.div>

      {/* Messages Area - Glass Container */}
      <motion.div
        className="flex-1 overflow-y-auto overflow-x-hidden p-3 md:p-6 space-y-4 custom-scrollbar"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {isLoading ? (
          <motion.div
            className="flex items-center justify-center h-full"
            animate={{ scale: [0.95, 1.05, 0.95] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4 border-purple-500 border-t-cyan-500 rounded-full mx-auto mb-4 glow-effect"
              />
              <p className="text-gray-300 font-semibold">
                Loading messages... ✨
              </p>
            </div>
          </motion.div>
        ) : messages.length === 0 ? (
          <motion.div
            className="flex items-center justify-center h-full"
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <div className="text-center">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-6xl mb-4"
              >
                💬
              </motion.div>
              <p className="text-gray-400 text-lg">
                No messages yet. Start the conversation! 🚀
              </p>
            </div>
          </motion.div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-3"
            >
              {messages.map((message, index) => (
                <motion.div
                  key={message._id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <MessageBubble
                    message={message}
                    isOwn={message.sender._id === currentUser._id}
                    onDelete={handleDeleteMessage}
                  />
                </motion.div>
              ))}
            </motion.div>
            {typingUsers.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <TypingIndicator />
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </motion.div>

      {/* File Preview - Glass Effect */}
      {selectedFile && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="px-3 md:px-6 py-2 md:py-3 glass-effect-sm border-t border-purple-500/20 rounded-t-2xl flex-shrink-0"
        >
          <motion.div
            className="flex items-center gap-3 p-3 glass-effect-lg rounded-xl"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
          >
            <div className="flex-1">
              <p className="text-sm text-white font-semibold truncate">
                📎 {selectedFile.name}
              </p>
              <p className="text-xs text-gray-400">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <motion.button
              type="button"
              onClick={() => setSelectedFile(null)}
              className="p-2 hover:bg-red-500/30 rounded-lg transition glow-effect-sm"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FiX size={18} className="text-red-400" />
            </motion.button>
          </motion.div>
        </motion.div>
      )}

      {/* Input Area - Floating Glass Bar */}
      <motion.form
        onSubmit={handleSendMessage}
        className="sticky bottom-0 p-3 md:p-6 border-t border-purple-500/20 glass-effect-lg rounded-t-3xl shadow-xl flex-shrink-0"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex gap-2 md:gap-3 items-center">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*,.pdf,.doc,.docx,.txt,.xlsx"
          />

          <motion.button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex-shrink-0 p-2 md:p-3 glass-effect-sm hover:glass-effect rounded-2xl transition glow-effect-sm disabled:opacity-50"
            whileHover={{ scale: 1.15, rotate: 15 }}
            whileTap={{ scale: 0.9 }}
            title="Attach file"
          >
            <FiPaperclip size={18} className="md:size-20 text-purple-400" />
          </motion.button>

          <motion.input
            type="text"
            value={messageInput}
            onChange={(e) => {
              setMessageInput(e.target.value);
              handleTyping();
            }}
            placeholder="Type a message... ✨"
            disabled={isUploading}
            className="flex-1 px-3 md:px-5 py-2 md:py-3 glass-effect-sm rounded-2xl focus:outline-none focus:glass-effect focus:glow-effect text-white placeholder-gray-500 transition disabled:opacity-50 text-sm md:text-base"
            whileFocus={{ scale: 1.02 }}
          />

          <motion.button
            type="submit"
            disabled={isUploading || (!messageInput.trim() && !selectedFile)}
            className="flex-shrink-0 bg-gradient-to-r from-purple-600 to-cyan-600 text-white p-2 md:p-3 rounded-2xl hover:glow-effect transform transition disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{
              scale: 1.1,
              boxShadow: "0 0 20px rgba(139, 92, 246, 0.6)",
            }}
            whileTap={{ scale: 0.9 }}
          >
            {isUploading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                ⏳
              </motion.div>
            ) : (
              <FiSend size={18} className="md:size-20" />
            )}
          </motion.button>
        </div>
      </motion.form>
    </motion.div>
  );
}
