import { useState } from "react";
import Dashboard from "./components/Dashboard";
import { Toaster } from "react-hot-toast";

function App() {
  const [plan, setPlan] = useState("free_user");

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1e293b",
            color: "#fff",
          },
        }}
      />

   
      <div className="p-4 flex gap-4 justify-center bg-slate-900 text-white">
        <button
          onClick={() => setPlan("free_user")}
          className={`px-4 py-2 rounded ${
            plan === "free_user" ? "bg-blue-500" : "bg-gray-600"
          }`}
        >
          Free User
        </button>

        <button
          onClick={() => setPlan("premium_user")}
          className={`px-4 py-2 rounded ${
            plan === "premium_user" ? "bg-green-500" : "bg-gray-600"
          }`}
        >
          Premium User 🚀
        </button>
      </div>

      <Dashboard plan={plan} />
    </>
  );
}

export default App;