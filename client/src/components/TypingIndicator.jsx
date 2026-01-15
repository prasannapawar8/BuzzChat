import { motion } from "framer-motion";

export default function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      className="flex justify-start"
    >
      <motion.div className="max-w-xs px-5 py-4 rounded-3xl glass-effect-lg flex items-center gap-3 shadow-lg glow-effect-sm">
        <div className="flex gap-2">
          <motion.span
            className="w-3 h-3 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full"
            animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.4, repeat: Infinity, delay: 0 }}
          />
          <motion.span
            className="w-3 h-3 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"
            animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.4, repeat: Infinity, delay: 0.2 }}
          />
          <motion.span
            className="w-3 h-3 bg-gradient-to-r from-cyan-400 to-pink-400 rounded-full"
            animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.4, repeat: Infinity, delay: 0.4 }}
          />
        </div>
        <motion.span
          className="text-xs text-cyan-200 font-semibold uppercase tracking-wide"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          ✍️ Typing...
        </motion.span>
      </motion.div>
    </motion.div>
  );
}
