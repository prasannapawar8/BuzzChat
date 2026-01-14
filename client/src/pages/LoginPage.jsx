import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuthStore } from "../utils/store";
import api from "../utils/api";
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated 3D Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse top-0 -left-20"></div>
        <div className="absolute w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse top-20 -right-20"></div>
        <div className="absolute w-96 h-96 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse bottom-0 left-1/3"></div>
      </div>

      {/* Card with 3D Effect */}
      <div className="relative z-10">
        <div className="group">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 transform group-hover:scale-105"></div>
          <div className="relative bg-slate-900 rounded-2xl p-8 w-full max-w-md backdrop-blur-xl border border-purple-500/20 shadow-2xl transform transition duration-500 hover:shadow-purple-500/50">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-block p-4 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 mb-4 transform hover:scale-110 transition">
                <h1 className="text-4xl font-bold text-white">💬</h1>
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 bg-clip-text text-transparent mb-2">
                BuzzChat
              </h1>
              <p className="text-gray-400 text-sm">
                {isLogin
                  ? "Welcome back to the buzz!"
                  : "Join the conversation"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400 group-focus-within:text-blue-400 transition">
                    <FiUser size={20} />
                  </div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-purple-500/30 rounded-xl focus:outline-none focus:border-purple-500 focus:shadow-lg focus:shadow-purple-500/50 text-white placeholder-gray-500 transition backdrop-blur-sm"
                    required={!isLogin}
                  />
                </div>
              )}

              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400 group-focus-within:text-blue-400 transition">
                  <FiMail size={20} />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-purple-500/30 rounded-xl focus:outline-none focus:border-purple-500 focus:shadow-lg focus:shadow-purple-500/50 text-white placeholder-gray-500 transition backdrop-blur-sm"
                  required
                />
              </div>

              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400 group-focus-within:text-blue-400 transition">
                  <FiLock size={20} />
                </div>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-purple-500/30 rounded-xl focus:outline-none focus:border-purple-500 focus:shadow-lg focus:shadow-purple-500/50 text-white placeholder-gray-500 transition backdrop-blur-sm"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/50 transform hover:scale-105 transition duration-200 active:scale-95 mt-6"
              >
                {isLogin ? "Login" : "Register"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-400">
                {isLogin
                  ? "Don't have an account?"
                  : "Already have an account?"}
                <button
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setFormData({ name: "", email: "", password: "" });
                  }}
                  className="text-transparent bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text font-semibold hover:from-purple-300 hover:to-blue-300 transition ml-2"
                >
                  {isLogin ? "Register here" : "Login instead"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
