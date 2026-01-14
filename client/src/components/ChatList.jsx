import { useState, useEffect } from "react";
import api from "../utils/api";
import toast from "react-hot-toast";

export default function ChatList({
  chats,
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
    await onAccessChat(user._id);
    setSearchTerm("");
    setShowUserList(false);
  };

  const getLastMessage = (chat) => {
    if (!chat.lastMessage) return "No messages yet";
    if (chat.lastMessage.isDeleted) return "Message was deleted";
    return chat.lastMessage.content.substring(0, 50) + "...";
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Search Bar */}
      <div className="p-4 border-b border-gray-200">
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
        />

        {/* Search Results */}
        {showUserList && users.length > 0 && (
          <div className="mt-2 bg-white border border-gray-200 rounded max-h-48 overflow-y-auto">
            {users.map((user) => (
              <div
                key={user._id}
                onClick={() => handleUserSelect(user)}
                className="p-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
              >
                <p className="font-semibold">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {chats.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">
              No chats yet. Search for users to start!
            </p>
          </div>
        ) : (
          chats.map((chat) => (
            <div
              key={chat._id}
              onClick={() => onSelectChat(chat)}
              className={`p-4 border-b border-gray-100 cursor-pointer transition ${
                selectedChat?._id === chat._id
                  ? "bg-accent"
                  : "hover:bg-gray-50"
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="font-semibold">
                    {chat.isGroupChat
                      ? chat.chatName
                      : chat.users.find(
                          (u) => u._id !== localStorage.getItem("user")
                        )?.name || "User"}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {getLastMessage(chat)}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
