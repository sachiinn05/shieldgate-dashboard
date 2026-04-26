import { useState } from "react";
import API from "../services/api";
import toast from "react-hot-toast";

const ApiKeyCard = ({ apiKey, setApiKey }) => {
  const [loading, setLoading] = useState(false);

  const copyKey = () => {
    navigator.clipboard.writeText(apiKey);
    toast.success("API Key copied ✅");
  };

  const regenerate = async () => {
    try {
      setLoading(true);

      const res = await API.post("/api/auth/regenerate-key", {}, {
        headers: { "x-api-key": apiKey }
      });

      localStorage.setItem("apiKey", res.data.apiKey);
      setApiKey(res.data.apiKey);

      toast.success("New API Key generated 🔑");
    } catch {
      toast.error("Failed to regenerate");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-xl">
      <h2 className="text-lg mb-3">🔑 API Key</h2>

      <div className="bg-black/40 p-3 rounded-lg text-sm break-all mb-4">
        {apiKey}
      </div>

      <div className="flex gap-3">
        <button
          onClick={copyKey}
          className="bg-blue-500 px-4 py-2 rounded-lg"
        >
          Copy
        </button>

        <button
          onClick={regenerate}
          disabled={loading}
          className="bg-red-500 px-4 py-2 rounded-lg"
        >
          {loading ? "..." : "Regenerate"}
        </button>
      </div>
    </div>
  );
};

export default ApiKeyCard;