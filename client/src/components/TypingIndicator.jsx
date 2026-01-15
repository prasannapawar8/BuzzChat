export default function TypingIndicator() {
  return (
    <div className="flex justify-start message-animate">
      <div className="max-w-xs px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600/30 to-blue-600/30 border border-purple-500/40 backdrop-blur-sm flex items-center gap-3 shadow-lg shadow-purple-500/20">
        <div className="flex gap-1.5">
          <span
            className="w-2.5 h-2.5 bg-purple-400 rounded-full animate-bounce"
            style={{ animationDelay: "0s" }}
          ></span>
          <span
            className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></span>
          <span
            className="w-2.5 h-2.5 bg-pink-400 rounded-full animate-bounce"
            style={{ animationDelay: "0.4s" }}
          ></span>
        </div>
        <span className="text-xs text-purple-200 font-medium">
          ✍️ Someone is typing...
        </span>
      </div>
    </div>
  );
}
