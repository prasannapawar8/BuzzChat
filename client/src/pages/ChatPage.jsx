import { useEffect, useState } from "react";
import { useAuthStore, useChatStore } from "../utils/store";
import { getSocket } from "../utils/socket";
import api from "../utils/api";
import ChatList from "../components/ChatList";
import ChatBox from "../components/ChatBox";
import GroupModal from "../components/GroupModal";
import toast from "react-hot-toast";

export default function ChatPage() {
  const user = useAuthStore((state) => state.user);
  const chats = useChatStore((state) => state.chats);
  const selectedChat = useChatStore((state) => state.selectedChat);
  const { setChats, setSelectedChat, clearChat } = useChatStore();
  const { logout } = useAuthStore();
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchChats();
    const interval = setInterval(fetchChats, 5000); // Fetch chats every 5 seconds
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

      // Join chat room
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
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-full md:w-1/3 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 bg-primary text-white flex justify-between items-center">
          <h1 className="text-2xl font-bold">ChatApp</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setIsGroupModalOpen(true)}
              className="bg-secondary hover:bg-opacity-90 px-3 py-1 rounded text-sm"
            >
              + Group
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Chat List */}
        {isLoading ? (
          <div className="flex items-center justify-center flex-1">
            <p className="text-gray-500">Loading chats...</p>
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
      <div className="hidden md:flex md:w-2/3 flex-col bg-white">
        {selectedChat ? (
          <ChatBox chat={selectedChat} currentUser={user} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 text-lg">
              Select a chat to start messaging
            </p>
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
