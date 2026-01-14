import { useState, useEffect, useRef } from "react";
import { useChatStore } from "../utils/store";
import { getSocket } from "../utils/socket";
import api from "../utils/api";
import toast from "react-hot-toast";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import { FiSend, FiPaperclip, FiX } from "react-icons/fi";

export default function ChatBox({ chat, currentUser }) {
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
          "Sending file:",
          selectedFile.name,
          "Size:",
          selectedFile.size
        );
        formData.append("file", selectedFile);
      }

      const response = await api.post("/message", formData);

      const newMessage = response.data.message;
      console.log("Message response:", newMessage);
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
    <div className="flex flex-col h-full bg-gradient-to-b from-slate-800 to-slate-900">
      {/* Chat Header - 3D Effect */}
      <div className="relative bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 p-4 text-white shadow-lg border-b border-purple-500/30 backdrop-blur-sm">
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
        <div className="relative z-10">
          <h2 className="text-xl font-bold drop-shadow-lg">{getChatName()}</h2>
          <p className="text-sm text-purple-100">
            {chat.users.length} member{chat.users.length > 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="inline-block animate-spin mb-3">
                <div className="w-8 h-8 border-4 border-purple-500 border-t-blue-500 rounded-full"></div>
              </div>
              <p className="text-gray-400">Loading messages...</p>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 text-center">
              💬 No messages yet. <br /> Start the conversation!
            </p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <MessageBubble
                key={message._id}
                message={message}
                isOwn={message.sender._id === currentUser._id}
                onDelete={handleDeleteMessage}
              />
            ))}
            {typingUsers.length > 0 && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* File Preview */}
      {selectedFile && (
        <div className="px-4 py-2 bg-slate-700/50 border-t border-purple-500/20 backdrop-blur-sm">
          <div className="flex items-center gap-2 p-2 bg-slate-600/50 rounded-lg">
            <div className="flex-1">
              <p className="text-sm text-white font-medium truncate">
                📎 {selectedFile.name}
              </p>
              <p className="text-xs text-gray-400">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSelectedFile(null)}
              className="p-1 hover:bg-red-500/30 rounded-lg transition"
            >
              <FiX size={18} className="text-red-400" />
            </button>
          </div>
        </div>
      )}

      {/* Input Area - 3D Effect */}
      <form
        onSubmit={handleSendMessage}
        className="p-4 border-t border-purple-500/20 bg-slate-800/50 backdrop-blur-sm"
      >
        <div className="flex gap-2 items-center">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*,.pdf,.doc,.docx,.txt,.xlsx"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex-shrink-0 p-3 hover:bg-purple-500/30 rounded-xl transition transform hover:scale-110 active:scale-95 disabled:opacity-50"
            title="Attach file"
          >
            <FiPaperclip size={20} className="text-purple-400" />
          </button>

          <input
            type="text"
            value={messageInput}
            onChange={(e) => {
              setMessageInput(e.target.value);
              handleTyping();
            }}
            placeholder="Type a message..."
            disabled={isUploading}
            className="flex-1 px-4 py-3 bg-slate-700/50 border border-purple-500/30 rounded-xl focus:outline-none focus:border-purple-500 focus:shadow-lg focus:shadow-purple-500/50 text-white placeholder-gray-500 transition backdrop-blur-sm disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={isUploading || (!messageInput.trim() && !selectedFile)}
            className="flex-shrink-0 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-3 rounded-xl hover:shadow-lg hover:shadow-purple-500/50 transform hover:scale-105 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? (
              <div className="animate-spin">⏳</div>
            ) : (
              <FiSend size={20} />
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
