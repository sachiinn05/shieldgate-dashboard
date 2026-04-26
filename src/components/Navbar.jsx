import { Link } from "react-router-dom";

const Navbar = () => {
  const apiKey = localStorage.getItem("apiKey");

  return (
    <div className="flex justify-between items-center px-8 py-4 bg-slate-900/80 backdrop-blur border-b border-white/10 text-white">
      <h1 className="text-xl font-bold">ShieldGate 🚀</h1>

      <div className="flex gap-6">
        {apiKey ? (
          <button
            onClick={() => {
              localStorage.removeItem("apiKey");
              window.location.href = "/login";
            }}
            className="bg-red-500 px-4 py-1 rounded-lg"
          >
            Logout
          </button>
        ) : (
          <>
            <Link to="/login" className="hover:text-blue-400">
              Login
            </Link>
            <Link to="/register" className="hover:text-blue-400">
              Register
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;