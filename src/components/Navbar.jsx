import API from "../services/api";

const Navbar = () => {
  const apiKey = localStorage.getItem("apiKey");

  const logout = async () => {
    await API.post("/api/auth/logout"); // 🔥 clear cookie
    localStorage.removeItem("apiKey");
    window.location.href = "/login";
  };

  return (
    <div className="flex justify-between items-center px-8 py-4 bg-slate-900/80 text-white">
      <h1 className="text-xl font-bold">ShieldGate 🚀</h1>

      <div className="flex gap-6">
        {apiKey ? (
          <button
            onClick={logout}
            className="bg-red-500 px-4 py-1 rounded-lg"
          >
            Logout
          </button>
        ) : (
          <>
            <a href="/login">Login</a>
            <a href="/register">Register</a>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;