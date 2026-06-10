import { useEffect, useState } from "react";
import ProfileCard from "../components/profile/ProfileCard";
import ProfileForm from "../components/profile/ProfileForm";
import api from "../utils/api";

function Profile() {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/users/me")
      .then((res) => setUser(res.data))
      .catch((err) => console.error("Failed to fetch profile:", err))
      .finally(() => setLoading(false));
  }, []);
  
  async function handleSave(profileData) {
    try {
      const res = await api.patch("/users/me", {
        name: profileData.displayName,
        major: profileData.major,
        year: profileData.year,
        bio: profileData.bio,
        pronouns: profileData.pronouns,
        customPronouns: profileData.customPronouns,
        skillTags: profileData.skills,
      });
      setUser(res.data);
      setEditing(false);
    } catch (err) {
      console.error("Failed to save profile:", err);
    }
  }

  if (loading) {
    return (
      <main className="auth-page">
        <p className="form-subtitle">Loading...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="auth-page">
        <p className="form-subtitle">Could not load profile.</p>
      </main>
    );
  }

  if (editing) {
    return (
      <main className="auth-page">
        <section className="profile-edit-page">
          <ProfileForm
            initialProfile={{
              profilePhoto: user.profilePhoto || "",
              displayName: user.name,
              pronouns: user.pronouns || "Do not display",
              customPronouns: user.customPronouns || "",
              major: user.major || "",
              year: user.year || "",
              bio: user.bio || "",
              skills: user.skillTags || [],
            }}
            onSave={handleSave}
            buttonText="Save Changes"
          />
        </section>
      </main>
    );
  }

  const preferences = [
    user.workingStyle?.location,
    user.workingStyle?.pace,
    user.workingStyle?.hours,
    user.workingStyle?.communicationStyle,
    user.groupSizePreference,
  ].filter(Boolean);

  return (
    <main className="auth-page">
      <section className="profile-page">
        <div className="profile-sidebar">
          <div className="profile-sidebar-card">
            <div className="profile-sidebar-avatar">
              {user.profilePhoto
                ? <img className="profile-photo-image" src={user.profilePhoto} alt="Profile" />
                : <span>{user.name?.charAt(0)}</span>
              }
            </div>

            <h2 className="profile-sidebar-name">{user.name}</h2>
            <p className="profile-sidebar-major">{user.major}</p>

            <button className="profile-edit-button" onClick={() => setEditing(true)}>
              Edit Profile
            </button>
          </div>
        </div>

        <div className="profile-main">
          <ProfileCard student={user} />

          {preferences.length > 0 && (
            <section className="profile-section">
              <h2 className="profile-section-title">Working Preferences</h2>
              <div className="profile-preferences">
                {preferences.map((pref) => (
                  <div className="profile-preference-card" key={pref}>{pref}</div>
                ))}
              </div>
            </section>
          )}

          <section className="profile-section">
            <h2 className="profile-section-title">Reputation</h2>
            <div className="reputation-card">
              <h1 className="reputation-score">
                {user.averageRating > 0 ? user.averageRating.toFixed(1) : "—"}
              </h1>
              <p className="reputation-text">
                {user.ratingCount > 0
                  ? `${user.ratingCount} rating${user.ratingCount !== 1 ? "s" : ""}`
                  : "No ratings yet"}
              </p>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

export default Profile;
