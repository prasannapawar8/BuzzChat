import { FiDownload, FiTrash2 } from "react-icons/fi";

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

  if (message.isDeleted) {
    return (
      <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
        <div
          className={`max-w-xs px-4 py-2 rounded-lg ${
            isOwn ? "bg-primary text-white" : "bg-white text-gray-600"
          }`}
        >
          <p className="text-sm italic">Message was deleted</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} group`}>
      <div
        className={`max-w-xs px-4 py-2 rounded-lg ${
          isOwn
            ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-br-none shadow-lg shadow-purple-500/30"
            : "bg-slate-700/70 text-gray-100 rounded-bl-none border border-slate-600/50 shadow-lg shadow-slate-700/30"
        }`}
      >
        {!isOwn && (
          <p className="text-xs font-semibold text-purple-300 mb-1">
            {message.sender.name}
          </p>
        )}

        <p className="break-words leading-relaxed">{message.content}</p>

        {/* File Display */}
        {message.fileUrl && (
          <a
            href={message.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`mt-2 flex items-center gap-2 p-2 rounded-lg transition ${
              isOwn
                ? "bg-white/20 hover:bg-white/30"
                : "bg-slate-600/50 hover:bg-slate-600"
            }`}
          >
            <FiDownload size={16} />
            <span className="text-sm truncate">Download File</span>
          </a>
        )}

        {/* Time and Actions */}
        <div className="flex items-center justify-between gap-2 mt-2">
          <p
            className={`text-xs ${isOwn ? "text-purple-200" : "text-gray-400"}`}
          >
            {getTime(message.createdAt)}
          </p>

          {isOwn && (
            <button
              onClick={handleDeleteMessage}
              className="opacity-0 group-hover:opacity-100 transition p-1 hover:bg-red-500/30 rounded"
              title="Delete message"
            >
              <FiTrash2 size={14} className="text-red-400" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
