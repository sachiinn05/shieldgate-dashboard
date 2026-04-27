import { useState, useEffect } from "react";
import API from "../services/api";
import toast from "react-hot-toast";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const Register = () => {
    const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [isAuth, setIsAuth] = useState(null); 

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await API.get("/api/user/me");
        setIsAuth(true);
      } catch {
        setIsAuth(false);
      }
    };

    checkAuth();
  }, []);

  if (isAuth === null) return null;

  // ✅ redirect only if cookie is valid
  if (isAuth) return <Navigate to="/" />;

  const handleSubmit = async () => {
    try {
      const res = await API.post("/api/auth/register", form);

      // ✅ keep apiKey (for rate limit only)
      localStorage.setItem("apiKey", res.data.apiKey);

      toast.success("Account created 🎉");

      navigate("/")
    } catch (err) {
      toast.error(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">

      <div className="bg-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-2xl w-[350px] border border-white/10">

        <h2 className="text-2xl font-bold text-center text-white mb-6">
          Create Account 🚀
        </h2>

        <input
          placeholder="Name"
          className="w-full p-3 mb-3 rounded-lg bg-white/20 text-white"
          onChange={(e)=>setForm({...form,name:e.target.value})}
        />

        <input
          placeholder="Email"
          className="w-full p-3 mb-3 rounded-lg bg-white/20 text-white"
          onChange={(e)=>setForm({...form,email:e.target.value})}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-6 rounded-lg bg-white/20 text-white"
          onChange={(e)=>setForm({...form,password:e.target.value})}
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-green-500 hover:bg-green-600 py-3 rounded-lg"
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default Register;