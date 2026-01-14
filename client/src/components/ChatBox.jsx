import { useState, useEffect, useRef } from "react";
import { useChatStore } from "../utils/store";
import { getSocket } from "../utils/socket";
import api from "../utils/api";
import toast from "react-hot-toast";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import { FiSend, FiPaperclip } from "react-icons/fi";

export default function ChatBox({ chat, currentUser }) {
  const messages = useChatStore((state) => state.messages);
  const typingUsers = useChatStore((state) => state.typingUsers);
  const { setMessages, addMessage } = useChatStore();
  const [messageInput, setMessageInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
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

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      socket?.emit("stop typing", {
        chatId: chat._id,
        userId: currentUser._id,
      });
    }, 3000);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!messageInput.trim()) {
      return;
    }

    try {
      const response = await api.post("/message", {
        content: messageInput,
        chatId: chat._id,
      });

      const newMessage = response.data.message;
      addMessage(newMessage);

      // Emit through socket
      socket?.emit("new message", newMessage);

      setMessageInput("");
      setIsTyping(false);

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    } catch (error) {
      toast.error("Error sending message");
    }
  };

  const getChatName = () => {
    if (chat.isGroupChat) {
      return chat.chatName;
    }
    return chat.users.find((u) => u._id !== currentUser._id)?.name || "User";
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="p-4 bg-primary text-white flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold">{getChatName()}</h2>
          <p className="text-sm text-gray-200">
            {chat.users.length} member{chat.users.length > 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-accent">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">
              No messages yet. Start the conversation!
            </p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <MessageBubble
                key={message._id}
                message={message}
                isOwn={message.sender._id === currentUser._id}
              />
            ))}
            {typingUsers.length > 0 && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <form
        onSubmit={handleSendMessage}
        className="p-4 bg-white border-t border-gray-200"
      >
        <div className="flex gap-2">
          <button
            type="button"
            className="text-gray-500 hover:text-primary p-2"
          >
            <FiPaperclip size={24} />
          </button>
          <input
            type="text"
            value={messageInput}
            onChange={(e) => {
              setMessageInput(e.target.value);
              handleTyping();
            }}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
          />
          <button
            type="submit"
            className="bg-primary text-white p-2 rounded-lg hover:bg-opacity-90"
          >
            <FiSend size={24} />
          </button>
        </div>
      </form>
    </div>
  );
}
