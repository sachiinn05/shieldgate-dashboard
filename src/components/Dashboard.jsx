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

const Dashboard = ({ plan }) => {
  const [stats, setStats] = useState({
    totalRequests: 0,
    allowed: 0,
    blocked: 0,
  });

  const [timeline, setTimeline] = useState([]);

  useEffect(() => {
    
    const socket = io("http://localhost:8001", {
      query: { apiKey: plan },
    });

    socket.on("request_update", (data) => {
      console.log("🔥 Streaming:", data);

      
      if (!data.allowed) {
        const now = Date.now();

        if (now - lastAlertTime > 2000) {
          lastAlertTime = now;

          toast.error("🚨 Rate limit exceeded!", {
            duration: 2000,
          });

          const audio = new Audio(
            "/transcendedlifting-race-start-beeps-125125.mp3"
          );
          audio.volume = 0.5;
          audio.play().catch(() => {});
        }
      }

    
      setStats((prev) => ({
        totalRequests: prev.totalRequests + 1,
        allowed: data.allowed ? prev.allowed + 1 : prev.allowed,
        blocked: !data.allowed ? prev.blocked + 1 : prev.blocked,
      }));

  
      const time = new Date(data.timestamp)
        .toLocaleTimeString()
        .slice(0, 5);

  
      setTimeline((prev) => {
        const updated = [
          ...prev,
          { time, requests: data.totalRequests },
        ];
        return updated.slice(-20);
      });
    });

    return () => socket.disconnect();
  }, [plan]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6">
      
  
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-wide">
          🚀 ShieldGate Dashboard
        </h1>
        <span className="text-sm text-gray-300">
          Live Monitoring • Plan:{" "}
          <span className="font-semibold">
            {plan === "premium_user" ? "Premium 🚀" : "Free"}
          </span>
        </span>
      </div>

    
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white/10 p-6 rounded-2xl">
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

    
      <div className="bg-white/10 p-6 rounded-2xl">
        <h2 className="mb-4">📈 Requests Timeline</h2>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={timeline}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
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