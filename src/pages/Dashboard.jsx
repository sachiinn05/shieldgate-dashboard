import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import toast from "react-hot-toast";
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
  const [stats, setStats] = useState({
    totalRequests: 0,
    allowed: 0,
    blocked: 0,
  });

  const [timeline, setTimeline] = useState([]);

  useEffect(() => {
    const socket = io("http://localhost:8001");

    socket.on("request_update", (data) => {
      console.log("🔥 Streaming:", data);

      // 🚨 Alert
      if (!data.allowed) {
        const now = Date.now();
        if (now - lastAlertTime > 2000) {
          lastAlertTime = now;

          toast.error("🚨 Rate limit exceeded!");
          new Audio("/transcendedlifting-race-start-beeps-125125.mp3").play().catch(() => {});
        }
      }

      // Stats update
      setStats((prev) => ({
        totalRequests: prev.totalRequests + 1,
        allowed: data.allowed ? prev.allowed + 1 : prev.allowed,
        blocked: !data.allowed ? prev.blocked + 1 : prev.blocked,
      }));

      // Timeline update
      const time = new Date(data.timestamp).toLocaleTimeString().slice(0, 5);

      setTimeline((prev) => [
        ...prev.slice(-19),
        { time, requests: data.totalRequests },
      ]);
    });

    return () => socket.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#020617] to-black text-white p-8">

      {/* 🔥 HEADER */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-cyan-300 text-transparent bg-clip-text">
          🚀 ShieldGate
        </h1>
        <p className="text-gray-400 mt-2">
          Real-time API Protection Dashboard
        </p>
      </div>

      {/* 🔥 STATS */}
      <div className="grid md:grid-cols-3 gap-8 mb-12">

        {/* TOTAL */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-400 blur opacity-20 group-hover:opacity-40 transition"></div>

          <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-xl">
            <p className="text-gray-400">Total Requests</p>
            <h2 className="text-3xl font-bold mt-2">
              {stats.totalRequests}
            </h2>
          </div>
        </div>

        {/* ALLOWED */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-400 blur opacity-20 group-hover:opacity-40 transition"></div>

          <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-xl">
            <p className="text-green-400">Allowed</p>
            <h2 className="text-3xl font-bold mt-2">
              {stats.allowed}
            </h2>
          </div>
        </div>

        {/* BLOCKED */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-400 blur opacity-20 group-hover:opacity-40 transition"></div>

          <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-xl">
            <p className="text-red-400">Blocked</p>
            <h2 className="text-3xl font-bold mt-2">
              {stats.blocked}
            </h2>
          </div>
        </div>

      </div>

      {/* 🔥 CHART */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 blur opacity-20 group-hover:opacity-40 transition"></div>

        <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-xl">
          <h2 className="text-xl font-semibold mb-6 text-gray-200">
            📈 Requests Timeline
          </h2>

          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={timeline}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="time" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#020617",
                  border: "1px solid #334155",
                  borderRadius: "10px",
                }}
              />
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
    </div>
  );
};

export default Dashboard;