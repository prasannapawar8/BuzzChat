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

  const handleDownloadFile = async (fileUrl) => {
    try {
      // Get the filename from the URL
      const urlParts = fileUrl.split('/');
      const filename = urlParts[urlParts.length - 1].split('?')[0] || 'download';

      // Fetch the file
      const response = await fetch(fileUrl);
      if (!response.ok) throw new Error('Failed to download file');

      // Create a blob from the response
      const blob = await response.blob();

      // Create a temporary download link
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      link.style.display = 'none';

      // Trigger the download
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      console.log('✅ File downloaded:', filename);
    } catch (error) {
      console.error('❌ Download failed:', error);
      // Fallback: open in new tab
      window.open(fileUrl, '_blank');
    }
  };

  if (message.isDeleted) {
    return (
      <div
        className={`flex ${
          isOwn ? "justify-end" : "justify-start"
        } message-animate`}
      >
        <div
          className={`max-w-xs px-4 py-2 rounded-xl backdrop-blur-sm ${
            isOwn
              ? "bg-red-500/20 border border-red-500/30"
              : "bg-gray-500/20 border border-gray-500/30"
          }`}
        >
          <p className="text-sm italic text-gray-400">✓ Message was deleted</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex ${
        isOwn ? "justify-end" : "justify-start"
      } group message-animate`}
    >
      <div
        className={`max-w-xs px-5 py-3 rounded-2xl backdrop-blur-sm transition duration-300 ${
          isOwn
            ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-br-none shadow-lg shadow-purple-500/40 hover:shadow-purple-500/60"
            : "bg-slate-700/60 text-gray-100 rounded-bl-none border border-slate-600/50 shadow-lg shadow-slate-700/40 hover:bg-slate-700/70 hover:border-slate-500/60"
        }`}
      >
        {!isOwn && (
          <p className="text-xs font-bold text-purple-300 mb-2 uppercase tracking-wide">
            {message.sender.name}
          </p>
        )}

        <p className="break-words leading-relaxed text-base">
          {message.content}
        </p>

        {/* File Display */}
        {message.fileUrl && (
          <div className="mt-3">
            {message.fileUrl.match(/\.(jpg|jpeg|png|gif)$/i) ? (
              <img
                src={message.fileUrl}
                alt="Shared file"
                className="max-w-xs rounded-xl mt-3 cursor-pointer hover:opacity-90 transition shadow-lg"
                onClick={() => window.open(message.fileUrl, "_blank")}
              />
            ) : (
              <button
                onClick={() => handleDownloadFile(message.fileUrl)}
                className={`w-full flex items-center gap-2 p-3 rounded-lg transition duration-300 font-semibold ${
                  isOwn
                    ? "bg-white/20 hover:bg-white/30"
                    : "bg-slate-600/60 hover:bg-slate-600/80"
                }`}
                title="Click to download file"
              >
                <FiDownload size={18} />
                <span className="text-sm truncate">📥 Download File</span>
              </button>
            )}
          </div>
        )}

        {/* Time and Actions */}
        <div className="flex items-center justify-between gap-2 mt-3 pt-2 border-t border-white/10">
          <p
            className={`text-xs font-medium ${
              isOwn ? "text-purple-200/80" : "text-gray-400/80"
            }`}
          >
            {getTime(message.createdAt)}
          </p>

          {isOwn && (
            <button
              onClick={handleDeleteMessage}
              className="opacity-0 group-hover:opacity-100 transition-all p-1.5 hover:bg-red-500/40 rounded-lg duration-200 hover:scale-110"
              title="Delete message"
            >
              <FiTrash2 size={16} className="text-red-400" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
