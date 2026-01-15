import { useState, useEffect } from "react";
import api from "../utils/api";
import toast from "react-hot-toast";
import { FiX } from "react-icons/fi";

export default function GroupModal({ isOpen, onClose, onGroupCreated }) {
  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  const fetchUsers = async () => {
    try {
      const response = await api.get("/auth/users");
      setUsers(response.data.users);
    } catch (error) {
      toast.error("Error fetching users");
    }
  };

  const toggleUserSelection = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();

    if (!groupName.trim()) {
      toast.error("Please enter a group name");
      return;
    }

    if (selectedUsers.length < 2) {
      toast.error("Select at least 2 members");
      return;
    }

    try {
      setIsLoading(true);
      await api.post("/chat/group", {
        chatName: groupName,
        users: selectedUsers,
      });

      toast.success("Group created successfully!");
      setGroupName("");
      setSelectedUsers([]);
      onGroupCreated();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error creating group");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-3xl shadow-2xl w-full max-w-md border border-purple-500/30 backdrop-blur-xl">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-purple-500/20">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            ✨ Create Group
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition transform hover:scale-110"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleCreateGroup} className="p-6 space-y-5">
          <input
            type="text"
            placeholder="Group Name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="w-full px-4 py-3 bg-slate-800/50 border border-purple-500/30 rounded-xl focus:outline-none focus:border-purple-500 focus:shadow-lg focus:shadow-purple-500/30 text-white placeholder-gray-400 transition"
          />

          <div>
            <label className="block text-sm font-bold text-purple-300 mb-3 uppercase tracking-wider">
              👥 Select Members ({selectedUsers.length})
            </label>
            <div className="border border-purple-500/30 rounded-xl max-h-48 overflow-y-auto bg-slate-800/30 backdrop-blur-sm">
              {users.map((user) => (
                <div
                  key={user._id}
                  onClick={() => toggleUserSelection(user._id)}
                  className="p-4 hover:bg-purple-600/20 cursor-pointer border-b border-purple-500/10 last:border-b-0 flex items-center transition duration-200"
                >
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user._id)}
                    onChange={() => {}}
                    className="mr-4 w-4 h-4 accent-purple-600"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-white">{user.name}</p>
                    <p className="text-xs text-gray-400">{user.email}</p>
                  </div>
                  {selectedUsers.includes(user._id) && (
                    <span className="text-purple-400 font-bold">✓</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-purple-500/30 rounded-xl hover:bg-purple-500/10 text-white transition duration-300 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl hover:shadow-lg hover:shadow-purple-500/50 text-white transition duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creating... ⏳" : "Create ✨"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
