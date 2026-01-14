import React, { useState, useEffect } from "react";
import api from "../utils/api";
import toast from "react-hot-toast";
import { FiSearch, FiPlus } from "react-icons/fi";

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
    <div className="flex-1 flex flex-col bg-slate-900 border-r border-purple-500/20">
      <div className="p-4 border-b border-purple-500/20 bg-slate-800/50 backdrop-blur-sm">
        <h2 className="text-2xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text mb-4">
          Chats
        </h2>

        <div className="relative">
          <div className="relative flex items-center gap-2 bg-slate-800 rounded-xl px-3 py-2 border border-purple-500/30">
            <FiSearch size={18} className="text-purple-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent text-white placeholder-gray-500 focus:outline-none text-sm"
            />
          </div>

          {showUserList && users.length > 0 && (
            <div className="absolute left-0 right-0 mt-2 bg-slate-800 border border-purple-500/30 rounded-xl max-h-48 overflow-y-auto z-50 backdrop-blur-sm shadow-lg">
              {users.map((user) => (
                <button
                  key={user._id}
                  onClick={() => handleUserSelect(user)}
                  className="w-full p-3 hover:bg-purple-500/20 transition border-b border-purple-500/10 last:border-b-0 text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold">
                      {user.name[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{user.name}</p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                    </div>
                    <FiPlus className="ml-auto text-purple-400" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {!chats || chats.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 text-center">
              💬 No chats yet. Search users to start!
            </p>
          </div>
        ) : (
          chats.map((chat) => (
            <button
              key={chat._id}
              onClick={() => onSelectChat && onSelectChat(chat)}
              className={`w-full p-4 border-b border-purple-500/10 transition-all duration-200 text-left group ${
                selectedChat?._id === chat._id
                  ? "bg-gradient-to-r from-purple-600/30 to-blue-600/30 border-l-4 border-l-purple-500"
                  : "hover:bg-purple-500/10"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold">
                    {chat.isGroupChat
                      ? chat.chatName[0]
                      : chat.users.find(
                          (u) => u._id !== localStorage.getItem("user")
                        )?.name[0] || "?"}
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900"></div>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white truncate">
                    {chat.isGroupChat
                      ? chat.chatName
                      : chat.users.find(
                          (u) => u._id !== localStorage.getItem("user")
                        )?.name || "User"}
                  </p>
                  <p className="text-sm text-gray-400 truncate">
                    {getLastMessage(chat)}
                  </p>
                </div>

                <div className="flex-shrink-0 text-xs text-gray-500">
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
            </button>
          ))
        )}
      </div>
    </div>
  );
}
