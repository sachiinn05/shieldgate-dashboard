import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import toast from "react-hot-toast";
import API from "../services/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

let lastAlertTime = 0;

const Dashboard = () => {
  const apiKey = localStorage.getItem("apiKey");

  const [stats, setStats] = useState({
    totalRequests: 0,
    allowed: 0,
    blocked: 0,
  });

  const [timeline, setTimeline] = useState([]);
  const [user, setUser] = useState(null);
  const [currentApiKey, setCurrentApiKey] = useState(apiKey);

  //  Fetch user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get("/api/auth/me", {
          headers: { "x-api-key": apiKey },
        });
        setUser(res.data);
      } catch {
        toast.error("User fetch failed");
      }
    };

    fetchUser();
  }, []);

  // SOCKET
  useEffect(() => {
    const socket = io("http://localhost:8001");

    socket.on("request_update", (data) => {
      console.log(" Streaming:", data);

      //  Alert
      if (!data.allowed) {
        const now = Date.now();
        if (now - lastAlertTime > 2000) {
          lastAlertTime = now;

          toast.error("🚨 Rate limit exceeded!");
          new Audio("/transcendedlifting-race-start-beeps-125125.mp3")
            .play()
            .catch(() => {});
        }
      }

      // Update stats
      setStats((prev) => ({
        totalRequests: prev.totalRequests + 1,
        allowed: data.allowed ? prev.allowed + 1 : prev.allowed,
        blocked: !data.allowed ? prev.blocked + 1 : prev.blocked,
      }));

      // Timeline
      const time = new Date(data.timestamp)
        .toLocaleTimeString()
        .slice(0, 5);

      setTimeline((prev) => [
        ...prev.slice(-19),
        { time, requests: data.totalRequests },
      ]);
    });

    return () => socket.disconnect();
  }, []);

  //  Copy API key
  const copyKey = () => {
    navigator.clipboard.writeText(currentApiKey);
    toast.success("API Key copied ✅");
  };

  //  Regenerate API key
  const regenerateKey = async () => {
    try {
      const res = await API.post(
        "/api/auth/regenerate-key",
        {},
        {
          headers: { "x-api-key": currentApiKey },
        }
      );

      localStorage.setItem("apiKey", res.data.apiKey);
      setCurrentApiKey(res.data.apiKey);

      toast.success("New API Key generated 🔑");
    } catch {
      toast.error("Failed to regenerate");
    }
  };

  const maxLimit = user?.plan === "premium_user" ? 50 : 10;
  const percent = Math.min((stats.totalRequests / maxLimit) * 100, 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#020617] to-black text-white p-8">

      {/*  HEADER */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-400 to-cyan-300 text-transparent bg-clip-text">
          🚀 ShieldGate
        </h1>
        <p className="text-gray-400 mt-2">
          Real-time API Protection Dashboard
        </p>
      </div>

      {/*  TOP GRID */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">

        {/* API KEY CARD */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl">
          <h2 className="mb-3">🔑 API Key</h2>

          <div className="bg-black/40 p-3 rounded-lg text-sm break-all mb-4">
            {currentApiKey}
          </div>

          <div className="flex gap-3">
            <button
              onClick={copyKey}
              className="bg-blue-500 px-4 py-2 rounded-lg"
            >
              Copy
            </button>

            <button
              onClick={regenerateKey}
              className="bg-red-500 px-4 py-2 rounded-lg"
            >
              Regenerate
            </button>
          </div>
        </div>

        {/* RATE LIMIT */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl">
          <h2 className="mb-3">⚡ Rate Limit Usage</h2>

          <div className="w-full bg-gray-700 rounded-full h-4">
            <div
              className="bg-gradient-to-r from-blue-500 to-cyan-400 h-4 rounded-full transition-all"
              style={{ width: `${percent}%` }}
            />
          </div>

          <p className="text-sm text-gray-400 mt-2">
            {stats.totalRequests} / {maxLimit} requests
          </p>
        </div>
      </div>

      {/*  STATS */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">

        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
          <p>Total Requests</p>
          <h2 className="text-2xl font-bold">{stats.totalRequests}</h2>
        </div>

        <div className="bg-green-500/20 p-6 rounded-2xl">
          <p>Allowed</p>
          <h2 className="text-2xl font-bold">{stats.allowed}</h2>
        </div>

        <div className="bg-red-500/20 p-6 rounded-2xl">
          <p>Blocked</p>
          <h2 className="text-2xl font-bold">{stats.blocked}</h2>
        </div>
      </div>

      {/*  PROFILE */}
      {user && (
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 mb-10">
          <h2 className="mb-3">👤 Profile</h2>
          <p>Email: {user.email}</p>
          <p>Plan: {user.plan}</p>
        </div>
      )}

      {/*  CHART */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl">
        <h2 className="mb-6">📈 Requests Timeline</h2>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={timeline}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="time" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="requests"
              stroke="#38bdf8"
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;