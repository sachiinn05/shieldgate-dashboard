const RateLimitBar = ({ current, max }) => {
  const percent = Math.min((current / max) * 100, 100);

  return (
    <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
      <h2 className="mb-3">⚡ Rate Limit Usage</h2>

      <div className="w-full bg-gray-700 rounded-full h-4">
        <div
          className="bg-gradient-to-r from-blue-500 to-cyan-400 h-4 rounded-full transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>

      <p className="text-sm text-gray-400 mt-2">
        {current} / {max} requests
      </p>
    </div>
  );
};

export default RateLimitBar;