import { useState } from "react";
import API from "../services/api";
import toast from "react-hot-toast";
import { Navigate } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });

  if (localStorage.getItem("apiKey")) {
    return <Navigate to="/" />;
  }

  const handleSubmit = async () => {
    try {
      const res = await API.post("/api/auth/login", form);
      localStorage.setItem("apiKey", res.data.apiKey);
      toast.success("Welcome back 🚀");
      window.location.href = "/";
    } catch {
      toast.error("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">

      {/* Card */}
      <div className="bg-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-2xl w-[350px] border border-white/10">

        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-white mb-6">
          Welcome Back 👋
        </h2>

        {/* Inputs */}
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 rounded-lg bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-6 rounded-lg bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        {/* Button */}
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-500 hover:bg-blue-600 transition py-3 rounded-lg font-semibold"
        >
          Login 🚀
        </button>

        {/* Footer */}
        <p className="text-sm text-center text-gray-400 mt-4">
          Don’t have an account?{" "}
          <a href="/register" className="text-blue-400">
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;