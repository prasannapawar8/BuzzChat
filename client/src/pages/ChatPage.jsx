import { useEffect, useState } from "react";
import { useAuthStore, useChatStore } from "../utils/store";
import { getSocket } from "../utils/socket";
import api from "../utils/api";
import ChatList from "../components/ChatList";
import ChatBox from "../components/ChatBox";
import GroupModal from "../components/GroupModal";
import toast from "react-hot-toast";
import { FiLogOut, FiPlus, FiMenu, FiX } from "react-icons/fi";

export default function ChatPage() {
  const user = useAuthStore((state) => state.user);
  const chats = useChatStore((state) => state.chats);
  const selectedChat = useChatStore((state) => state.selectedChat);
  const { setChats, setSelectedChat, clearChat } = useChatStore();
  const { logout } = useAuthStore();
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    fetchChats();
    const interval = setInterval(fetchChats, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchChats = async () => {
    try {
      const response = await api.get("/chat");
      setChats(response.data.chats);
    } catch (error) {
      console.log("Error fetching chats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccessChat = async (userId) => {
    try {
      const response = await api.post("/chat", { userId });
      setSelectedChat(response.data);

      const socket = getSocket();
      if (socket) {
        socket.emit("join chat", response.data._id);
      }
    } catch (error) {
      toast.error("Error opening chat");
    }
  };

  const handleLogout = () => {
    logout();
    clearChat();
  };

  return (
    <div className="flex h-screen bg-slate-900">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-full md:w-1/3" : "hidden md:w-1/3 md:flex"
        } bg-gradient-to-b from-slate-900 to-slate-950 border-r border-purple-500/20 flex flex-col transition-all duration-300`}
      >
        {/* Header with 3D Gradient */}
        <div className="relative bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 p-5 text-white shadow-xl border-b border-purple-400/30 animate-gradient">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
          <div className="relative z-10 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold drop-shadow-lg">BuzzChat</h1>
              <p className="text-sm text-purple-100">
                Welcome, {user?.name}! 👋
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setIsGroupModalOpen(true)}
                className="p-2 hover:bg-white/20 rounded-xl transition transform hover:scale-110 active:scale-95 duration-200 backdrop-blur-sm"
                title="Create group"
              >
                <FiPlus size={24} />
              </button>
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-red-500/40 rounded-xl transition transform hover:scale-110 active:scale-95 duration-200 backdrop-blur-sm"
                title="Logout"
              >
                <FiLogOut size={24} />
              </button>
            </div>
          </div>
        </div>

        {/* Chat List */}
        {isLoading ? (
          <div className="flex items-center justify-center flex-1">
            <div className="text-center">
              <div className="inline-block animate-spin mb-3">
                <div className="w-10 h-10 border-4 border-purple-500 border-t-blue-500 rounded-full"></div>
              </div>
              <p className="text-gray-400">Loading chats...</p>
            </div>
          </div>
        ) : (
          <ChatList
            chats={chats}
            selectedChat={selectedChat}
            onSelectChat={setSelectedChat}
            onAccessChat={handleAccessChat}
          />
        )}
      </div>

      {/* Chat Box */}
      <div className="hidden md:flex md:w-2/3 flex-col bg-slate-900">
        {selectedChat ? (
          <ChatBox chat={selectedChat} currentUser={user} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-6xl mb-4">💬</div>
              <p className="text-gray-400 text-lg">
                Select a chat to start messaging
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Group Modal */}
      {isGroupModalOpen && (
        <GroupModal
          isOpen={isGroupModalOpen}
          onClose={() => setIsGroupModalOpen(false)}
          onGroupCreated={() => {
            setIsGroupModalOpen(false);
            fetchChats();
          }}
        />
      )}
    </div>
  );
}
