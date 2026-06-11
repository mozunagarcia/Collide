import { useState, useEffect } from "react";
import ProfileCard from "../components/profile/ProfileCard";
import EditProfileModal from "../components/profile/EditProfileModal";
import api from "../utils/api";

function Profile({ setPage }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const { data } = await api.get("/users/me");
        setUser(data);
      } catch (err) {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  if (loading) return <main className="auth-page"><p>Loading...</p></main>;
  if (error) return <main className="auth-page"><p>{error}</p></main>;

  const student = {
    name: user.name,
    major: user.major || "No major set",
    year: user.year || "",
    course: user.courses?.[0]
      ? `${user.courses[0].department} ${user.courses[0].number}`
      : "No course",
    bio: user.bio || "No bio yet",
    skills: user.skillTags || [],
    profilePhoto: user.profilePhoto || null,
  };

  const workingStyle = user.workingStyle || {};
  const preferences = [
    workingStyle.location,
    workingStyle.hours,
    workingStyle.pace,
    workingStyle.communicationStyle,
  ].filter(Boolean);

  return (
    <main className="auth-page">
      {editing && (
        <EditProfileModal
          user={user}
          onClose={() => setEditing(false)}
          onSave={(updated) => setUser(updated)}
        />
      )}
      <section className="profile-page">
        <div className="profile-sidebar">
          <div className="profile-sidebar-card">
            <div className="profile-sidebar-avatar">
              {user.profilePhoto
                ? <img src={user.profilePhoto} alt={user.name} style={{ width:"100%", height:"100%", objectFit:"cover", borderRadius:"28px" }} />
                : user.name.charAt(0).toUpperCase()
              }
            </div>

            <h2 className="profile-sidebar-name">{user.name}</h2>

            <p className="profile-sidebar-major">{user.major || "No major set"}</p>

            <button className="profile-edit-button" onClick={() => setEditing(true)}>
              Edit Profile
            </button>
          </div>
        </div>

        <div className="profile-main">
          <ProfileCard student={student} />

          <section className="profile-section">
            <h2 className="profile-section-title">Working Preferences</h2>
            <div className="profile-preferences">
              {preferences.length > 0 ? (
                preferences.map((pref) => (
                  <div className="profile-preference-card" key={pref}>
                    {pref}
                  </div>
                ))
              ) : (
                <p>No preferences set</p>
              )}
            </div>
          </section>

        </div>
      </section>
    </main>
  );
}

export default Profile;
