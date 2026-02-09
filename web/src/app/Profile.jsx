import { useEffect, useState } from "react";
import api from "@/lib/api";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get("/api/auth/workspaces/me");
        console.log("Profile data:", data);
        setProfile(data);
      } catch (err) {
        console.error("Failed to fetch profile", err);
        setError("Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>

      {profile?.workspaces ? (
        <div className="space-y-4">
          <p><strong>Workspaces ({profile.workspaces.length}):</strong></p>
          
          {profile.workspaces.map((ws) => (
            <div key={ws.id} className="p-4 bg-gray-50 rounded-lg border">
              <h2 className="font-semibold text-lg">{ws.name}</h2>
              <p className="text-sm font-medium text-blue-600">Role: {ws.role}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No workspaces found.</p>
      )}
    </div>
  );
};

export default Profile;
