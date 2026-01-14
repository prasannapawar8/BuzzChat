export default function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="max-w-xs px-4 py-3 rounded-lg bg-white border border-gray-200 flex items-center gap-2">
        <div className="flex gap-1">
          <span
            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: "0s" }}
          ></span>
          <span
            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></span>
          <span
            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: "0.4s" }}
          ></span>
        </div>
        <span className="text-xs text-gray-500">Someone is typing...</span>
      </div>
    </div>
  );
}
