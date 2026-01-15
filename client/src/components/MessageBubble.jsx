import { FiDownload, FiTrash2 } from "react-icons/fi";
import { downloadFile } from "../utils/downloadHelper";
import { motion } from "framer-motion";

export default function MessageBubble({ message, isOwn, onDelete }) {
  const getTime = (date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDeleteMessage = () => {
    if (onDelete) onDelete(message._id);
  };

  const handleDownloadFile = (fileUrl) => {
    downloadFile(fileUrl);
  };

  if (message.isDeleted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3 }}
        className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
      >
        <div className="max-w-xs px-4 py-2 glass-effect-sm rounded-2xl">
          <p className="text-sm italic text-gray-400">✓ Message was deleted</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isOwn ? "justify-end" : "justify-start"} group`}
    >
      <motion.div
        className={`max-w-xs md:max-w-md px-4 md:px-5 py-3 md:py-4 rounded-3xl transition duration-300 ${
          isOwn
            ? "bg-gradient-to-br from-purple-600/80 to-blue-600/80 text-white rounded-br-none glass-effect glow-effect shadow-lg"
            : "glass-effect-lg text-gray-100 rounded-bl-none glow-effect-sm shadow-lg"
        }`}
        whileHover={{ y: -2 }}
      >
        {!isOwn && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-xs md:text-sm font-bold text-cyan-300 mb-2 uppercase tracking-widest"
          >
            {message.sender.name}
          </motion.p>
        )}

        <p className="break-words leading-relaxed text-sm md:text-base font-medium">
          {message.content}
        </p>

        {/* File Display */}
        {message.fileUrl && (
          <motion.div
            className="mt-3 md:mt-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            {message.fileUrl.match(/\.(jpg|jpeg|png|gif)$/i) ? (
              <motion.img
                src={message.fileUrl}
                alt="Shared file"
                className="max-w-xs md:max-w-md rounded-2xl cursor-pointer shadow-lg glow-effect-sm"
                whileHover={{ scale: 1.05 }}
                onClick={() => window.open(message.fileUrl, "_blank")}
              />
            ) : (
              <motion.button
                onClick={() => handleDownloadFile(message.fileUrl)}
                className={`w-full flex items-center gap-2 md:gap-3 p-2 md:p-3 rounded-xl transition duration-300 font-semibold text-sm md:text-base ${
                  isOwn
                    ? "bg-white/20 hover:bg-white/30 glow-effect-sm"
                    : "bg-slate-700/40 hover:bg-slate-700/60 glass-effect-sm"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Click to download file"
              >
                <motion.div
                  animate={{ y: [0, -2, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <FiDownload size={18} className="md:size-20" />
                </motion.div>
                <span className="truncate">📥 Download</span>
              </motion.button>
            )}
          </motion.div>
        )}

        {/* Time and Actions */}
        <div className="flex items-center justify-between gap-2 mt-3 md:mt-4 pt-2 md:pt-3 border-t border-white/10">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className={`text-xs font-medium ${
              isOwn ? "text-purple-200/70" : "text-gray-400/70"
            }`}
          >
            {getTime(message.createdAt)}
          </motion.p>

          {isOwn && (
            <motion.button
              onClick={handleDeleteMessage}
              className="opacity-0 group-hover:opacity-100 transition-all p-1 md:p-2 hover:bg-red-500/40 rounded-lg duration-200 glow-effect-sm"
              whileHover={{ scale: 1.1, rotate: 10 }}
              whileTap={{ scale: 0.9 }}
              title="Delete message"
            >
              <FiTrash2 size={16} className="text-red-400" />
            </motion.button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
