import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuthStore } from "../utils/store";
import api from "../utils/api";
import { motion } from "framer-motion";
import { FiMail, FiLock, FiUser } from "react-icons/fi";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, setLoading } = useAuthStore();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/register";
      const response = await api.post(endpoint, formData);

      const { token, user } = response.data;
      login(user, token);
      toast.success(isLogin ? "Login successful!" : "Registration successful!");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden"
    >
      {/* Animated 3D Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ x: [0, 50, 0], y: [0, -50, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 top-0 -left-20"
        />
        <motion.div
          animate={{ x: [0, -50, 0], y: [0, 50, 0] }}
          transition={{ duration: 25, repeat: Infinity, delay: 1 }}
          className="absolute w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 top-20 -right-20"
        />
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, 30, 0] }}
          transition={{ duration: 30, repeat: Infinity, delay: 2 }}
          className="absolute w-96 h-96 bg-cyan-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 bottom-0 left-1/3"
        />
      </div>

      {/* Card with Premium Glass Effect */}
      <motion.div
        className="relative z-10 w-full max-w-md"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <motion.div
          className="relative"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          {/* Animated Glow Background */}
          <motion.div
            className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 rounded-3xl blur-xl opacity-60"
            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
            transition={{ duration: 8, repeat: Infinity }}
          />

          {/* Glass Card */}
          <div className="relative glass-effect-lg rounded-3xl p-8 border-purple-400/30 shadow-2xl glow-effect">
            {/* Header */}
            <motion.div
              className="text-center mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <motion.div
                className="inline-block p-4 rounded-2xl bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 mb-4 glow-effect shadow-xl"
                whileHover={{ scale: 1.15, rotate: 10 }}
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <motion.h1
                  className="text-4xl font-bold text-white"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  💬
                </motion.h1>
              </motion.div>

              <motion.h1
                className="text-4xl font-bold bg-gradient-to-r from-purple-300 via-blue-300 to-cyan-300 bg-clip-text text-transparent mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                BuzzChat
              </motion.h1>

              <motion.p
                className="text-cyan-200/80 text-sm font-semibold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {isLogin
                  ? "✨ Welcome back to the buzz!"
                  : "✨ Join the conversation"}
              </motion.p>
            </motion.div>

            <motion.form
              onSubmit={handleSubmit}
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, staggerChildren: 0.1 }}
            >
              {!isLogin && (
                <motion.div
                  className="relative group/input"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 }}
                >
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400 group-focus-within/input:text-cyan-400 transition">
                    <FiUser size={20} />
                  </div>
                  <motion.input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 glass-effect-sm rounded-2xl focus:outline-none focus:glass-effect focus:glow-effect text-white placeholder-gray-500 transition"
                    required={!isLogin}
                    whileFocus={{ scale: 1.02 }}
                  />
                </motion.div>
              )}

              <motion.div
                className="relative group"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400 group-focus-within:text-cyan-400 transition">
                  <FiMail size={20} />
                </div>
                <motion.input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 glass-effect-sm rounded-2xl focus:outline-none focus:glass-effect focus:glow-effect text-white placeholder-gray-500 transition"
                  required
                  whileFocus={{ scale: 1.02 }}
                />
              </motion.div>

              <motion.div
                className="relative group"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.45 }}
              >
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400 group-focus-within:text-cyan-400 transition">
                  <FiLock size={20} />
                </div>
                <motion.input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 glass-effect-sm rounded-2xl focus:outline-none focus:glass-effect focus:glow-effect text-white placeholder-gray-500 transition"
                  required
                  whileFocus={{ scale: 1.02 }}
                />
              </motion.div>

              <motion.button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 text-white py-3 rounded-2xl font-bold hover:glow-effect transform transition disabled:opacity-50 mt-6"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 30px rgba(139, 92, 246, 0.6)",
                }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {isLogin ? "Login" : "Register"}
              </motion.button>
            </motion.form>

            {/* Toggle Form */}
            <motion.div
              className="mt-8 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <p className="text-gray-400 text-sm">
                {isLogin
                  ? "Don't have an account?"
                  : "Already have an account?"}
                <motion.button
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setFormData({ name: "", email: "", password: "" });
                  }}
                  className="text-transparent bg-gradient-to-r from-purple-300 to-cyan-300 bg-clip-text font-bold hover:from-purple-200 hover:to-cyan-200 transition ml-2 inline-block"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isLogin ? "Register here" : "Login instead"}
                </motion.button>
              </p>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
