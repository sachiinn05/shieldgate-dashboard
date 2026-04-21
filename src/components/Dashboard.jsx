import { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalRequests: 0,
    allowed: 0,
    blocked: 0,
  });

  const [timeline, setTimeline] = useState([]);

  // 🔥 Fetch function (same)
  const fetchData = async () => {
    try {
      const statsRes = await axios.get(
        "http://localhost:8001/api/stats/overview"
      );

      const timelineRes = await axios.get(
        "http://localhost:8001/api/stats/timeline"
      );

      setStats(statsRes.data);
      setTimeline(timelineRes.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // ✅ Initial load
    fetchData();

    // 🔥 Connect socket
    const socket = io("http://localhost:8001");

    // 🔥 Listen for backend events
    socket.on("request_update", () => {
      console.log("⚡ Real-time update received");

      // ✅ Update UI instantly
      fetchData();
    });

    return () => {
      socket.disconnect(); // cleanup
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-wide">
          🚀 ShieldGate Dashboard
        </h1>
        <span className="text-sm text-gray-300">Live Monitoring</span>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        
        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-lg hover:scale-105 transition">
          <p className="text-gray-300 text-sm">Total Requests</p>
          <h2 className="text-2xl font-bold mt-2">{stats.totalRequests}</h2>
        </div>

        <div className="bg-green-500/20 backdrop-blur-lg p-6 rounded-2xl shadow-lg hover:scale-105 transition">
          <p className="text-green-300 text-sm">Allowed</p>
          <h2 className="text-2xl font-bold mt-2">{stats.allowed}</h2>
        </div>

        <div className="bg-red-500/20 backdrop-blur-lg p-6 rounded-2xl shadow-lg hover:scale-105 transition">
          <p className="text-red-300 text-sm">Blocked</p>
          <h2 className="text-2xl font-bold mt-2">{stats.blocked}</h2>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-lg">
        <h2 className="text-xl font-semibold mb-6 text-gray-200">
          📈 Requests Timeline
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={timeline}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="time" stroke="#ccc" />
            <YAxis stroke="#ccc" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e293b",
                border: "none",
                borderRadius: "10px",
                color: "#fff",
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
  );
};

export default Dashboard;