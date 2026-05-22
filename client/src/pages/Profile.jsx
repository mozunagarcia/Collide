import ProfileCard from "../components/profile/ProfileCard";

function Profile() {
  const student = {
    name: "Mel Quant",
    major: "Computer Science",
    year: "3rd Year",
    course: "CS170",
    matchPercent: 92,
    bio: "Looking for someone who is understanding",
    skills: [
      "React",
      "Python",
      "UI/UX",
      "MongoDB"
    ]
  };

  return (
    <main className="auth-page">
      <section className="profile-page">
        <div className="profile-sidebar">
          <div className="profile-sidebar-card">
            <div className="profile-sidebar-avatar">
              M
            </div>

            <h2 className="profile-sidebar-name">
              Mel Quant
            </h2>

            <p className="profile-sidebar-major">
              Computer Science
            </p>

            <button className="profile-edit-button">
              Edit Profile
            </button>
          </div>
        </div>

        <div className="profile-main">
          <ProfileCard student={student} />

          <section className="profile-section">
            <h2 className="profile-section-title">
              Working Preferences
            </h2>

            <div className="profile-preferences">
              <div className="profile-preference-card">
                Remote Friendly
              </div>

              <div className="profile-preference-card">
                Night Study Sessions
              </div>

              <div className="profile-preference-card">
                Finish Early
              </div>

              <div className="profile-preference-card">
                Weekly Meetings
              </div>
            </div>
          </section>

          <section className="profile-section">
            <h2 className="profile-section-title">
              Reputation
            </h2>

            <div className="reputation-card">
              <h1 className="reputation-score">
                4.8
              </h1>

              <p className="reputation-text">
                Top Rated Collaborator
              </p>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

export default Profile;