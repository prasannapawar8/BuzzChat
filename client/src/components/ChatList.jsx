import React, { useState, useEffect } from "react";
import api from "../utils/api";
import toast from "react-hot-toast";
import { FiSearch, FiPlus } from "react-icons/fi";
import { motion } from "framer-motion";

export default function ChatList({
  chats = [],
  selectedChat,
  onSelectChat,
  onAccessChat,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [showUserList, setShowUserList] = useState(false);

  useEffect(() => {
    if (searchTerm.length > 0) {
      searchUsers();
    } else {
      setShowUserList(false);
    }
  }, [searchTerm]);

  const searchUsers = async () => {
    try {
      const response = await api.get("/auth/users");
      const filtered = response.data.users.filter((u) =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setUsers(filtered);
      setShowUserList(true);
    } catch (error) {
      toast.error("Error searching users");
    }
  };

  const handleUserSelect = async (user) => {
    if (onAccessChat) await onAccessChat(user._id);
    setSearchTerm("");
    setShowUserList(false);
  };

  const getLastMessage = (chat) => {
    if (!chat.lastMessage) return "No messages yet";
    if (chat.lastMessage.isDeleted) return "Message was deleted";
    return (chat.lastMessage.content || "").substring(0, 50) + "...";
  };

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-b from-slate-900 to-slate-950">
      <div className="p-5 border-b border-purple-500/20 glass-effect-lg">
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-transparent bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text mb-4"
        >
          💬 Chats
        </motion.h2>

        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="relative flex items-center gap-2 glass-effect-sm rounded-2xl px-4 py-3 border-purple-500/30 focus-within:border-purple-500/60 focus-within:glow-effect transition duration-300">
            <FiSearch size={18} className="text-purple-400" />
            <input
              type="text"
              placeholder="Search users... 🔍"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent text-white placeholder-gray-500 focus:outline-none text-sm font-medium"
            />
          </div>

          {showUserList && users.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute left-0 right-0 mt-3 glass-effect-lg rounded-2xl max-h-48 overflow-y-auto z-50 shadow-2xl shadow-purple-500/20"
            >
              {users.map((user, index) => (
                <motion.button
                  key={user._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleUserSelect(user)}
                  className="w-full p-4 hover:bg-purple-600/20 transition border-b border-purple-500/10 last:border-b-0 text-left duration-200 group card-hover"
                >
                  <div className="flex items-center gap-3">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold shadow-lg glow-effect-sm"
                    >
                      {user.name[0]}
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white group-hover:text-purple-200 transition">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-400 truncate group-hover:text-gray-300 transition">
                        {user.email}
                      </p>
                    </div>
                    <motion.div
                      whileHover={{ rotate: 90 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FiPlus className="text-purple-400 flex-shrink-0" />
                    </motion.div>
                  </div>
                </motion.button>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {!chats || chats.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-center"
            >
              <p className="text-gray-500 text-lg">
                💬 No chats yet. Search users to start!
              </p>
            </motion.div>
          </div>
        ) : (
          chats.map((chat, index) => (
            <motion.button
              key={chat._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => onSelectChat && onSelectChat(chat)}
              className={`w-full p-4 border-b border-purple-500/10 transition-all duration-300 text-left group ${
                selectedChat?._id === chat._id
                  ? "glass-effect-lg border-l-4 border-l-purple-400 shadow-lg shadow-purple-500/30"
                  : "hover:glass-effect-sm hover:border-l-4 hover:border-l-purple-500/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <motion.div
                  className="relative flex-shrink-0 group/avatar"
                  whileHover={{ scale: 1.15 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold shadow-lg glow-effect">
                    {chat.isGroupChat
                      ? chat.chatName[0]
                      : chat.users.find(
                          (u) => u._id !== localStorage.getItem("user")
                        )?.name[0] || "?"}
                  </div>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-slate-900 shadow-lg shadow-green-400/50"
                  ></motion.div>
                </motion.div>

                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white truncate group-hover:text-purple-200 transition">
                    {chat.isGroupChat
                      ? chat.chatName
                      : chat.users.find(
                          (u) => u._id !== localStorage.getItem("user")
                        )?.name || "User"}
                  </p>
                  <p className="text-sm text-gray-400 truncate group-hover:text-gray-300 transition">
                    {getLastMessage(chat)}
                  </p>
                </div>

                <div className="flex-shrink-0 text-xs text-gray-500 group-hover:text-gray-400 transition">
                  {chat.lastMessage && (
                    <span>
                      {new Date(chat.lastMessage.createdAt).toLocaleDateString(
                        "en-US",
                        { month: "short", day: "numeric" }
                      )}
                    </span>
                  )}
                </div>
              </div>
            </motion.button>
          ))
        )}
      </div>
    </div>
  );
}
