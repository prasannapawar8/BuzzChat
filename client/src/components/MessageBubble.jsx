export default function MessageBubble({ message, isOwn }) {
  const getTime = (date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
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
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-xs px-4 py-2 rounded-lg ${
          isOwn
            ? "bg-primary text-white rounded-br-none"
            : "bg-white text-gray-800 rounded-bl-none border border-gray-200"
        }`}
      >
        {!isOwn && (
          <p className="text-xs font-semibold text-primary mb-1">
            {message.sender.name}
          </p>
        )}
        <p className="break-words">{message.content}</p>
        {message.fileUrl && (
          <a
            href={message.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs underline mt-2 block"
          >
            Download File
          </a>
        )}
        <p
          className={`text-xs mt-1 ${
            isOwn ? "text-gray-200" : "text-gray-500"
          }`}
        >
          {getTime(message.createdAt)}
        </p>
      </div>
    </div>
  );
}
