const ProfileCard = ({ user }) => {
  return (
    <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
      <h2 className="mb-3">👤 Profile</h2>

      <p><span className="text-gray-400">Email:</span> {user.email}</p>
      <p><span className="text-gray-400">Plan:</span> {user.plan}</p>
    </div>
  );
};

export default ProfileCard;