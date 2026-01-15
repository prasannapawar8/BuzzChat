import { useState, useEffect } from "react";
import api from "../utils/api";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
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
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="glass-effect-lg rounded-3xl shadow-2xl w-full max-w-md border-purple-400/30 overflow-hidden"
        >
          {/* Header */}
          <motion.div
            className="flex justify-between items-center p-6 border-b border-purple-500/20 bg-gradient-to-r from-purple-600/20 to-blue-600/20"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <motion.h2
              className="text-2xl font-bold bg-gradient-to-r from-purple-300 via-blue-300 to-cyan-300 bg-clip-text text-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
            >
              ✨ Create Group
            </motion.h2>
            <motion.button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white transition glow-effect-sm rounded-lg"
              whileHover={{ scale: 1.2, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              <FiX size={24} />
            </motion.button>
          </motion.div>

          {/* Content */}
          <motion.form
            onSubmit={handleCreateGroup}
            className="p-6 space-y-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <motion.input
              type="text"
              placeholder="Group Name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full px-4 py-3 glass-effect-sm rounded-2xl focus:outline-none focus:glass-effect focus:glow-effect text-white placeholder-gray-500 transition"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
              whileFocus={{ scale: 1.02 }}
            />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="block text-sm font-bold text-cyan-300 mb-4 uppercase tracking-widest">
                👥 Select Members ({selectedUsers.length})
              </label>
              <motion.div className="border border-purple-500/30 rounded-2xl max-h-48 overflow-y-auto glass-effect-sm">
                <AnimatePresence>
                  {users.map((user, index) => (
                    <motion.div
                      key={user._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => toggleUserSelection(user._id)}
                      className="p-4 hover:glass-effect cursor-pointer border-b border-purple-500/10 last:border-b-0 flex items-center transition duration-200 group"
                      whileHover={{ scale: 1.02, x: 4 }}
                    >
                      <motion.input
                        type="checkbox"
                        checked={selectedUsers.includes(user._id)}
                        onChange={() => {}}
                        className="mr-4 w-4 h-4 accent-purple-600 cursor-pointer"
                        whileHover={{ scale: 1.15 }}
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-white group-hover:text-purple-200 transition">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-400">{user.email}</p>
                      </div>
                      <AnimatePresence>
                        {selectedUsers.includes(user._id) && (
                          <motion.span
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0 }}
                            className="text-cyan-400 font-bold text-lg"
                          >
                            ✓
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </motion.div>

            <motion.div
              className="flex gap-3 pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <motion.button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 glass-effect-sm rounded-2xl hover:glass-effect text-white transition duration-300 font-semibold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-2xl hover:glow-effect text-white transition duration-300 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 20px rgba(139, 92, 246, 0.5)",
                }}
                whileTap={{ scale: 0.95 }}
              >
                {isLoading ? (
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    ⏳ Creating...
                  </motion.span>
                ) : (
                  "Create ✨"
                )}
              </motion.button>
            </motion.div>
          </motion.form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
