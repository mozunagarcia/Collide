import { useState } from "react";
import ProfileCard from "../components/profile/ProfileCard";
import ProfileForm from "../components/profile/ProfileForm";

const defaultProfile = {
  fullName: "Mel Quant",
  email: "test@ucr.edu",
  profilePhoto: "",
  displayName: "Mel Quant",
  pronouns: "she/her",
  customPronouns: "",
  major: "Computer Science",
  year: "3rd Year",
  courseCode: "CS170",
  matchPercent: 92,
  bio: "Looking for someone who is understanding and likes finishing projects early.",
  skills: [
    "React",
    "Python",
    "UI/UX Design",
    "MongoDB"
  ]
};

function getSavedProfile() {
  const savedProfile = localStorage.getItem("collideProfile");

  if (savedProfile) {
    return {
      ...defaultProfile,
      ...JSON.parse(savedProfile)
    };
  } else {
    return defaultProfile;
  }
}

function Profile() {
  const [student, setStudent] = useState(getSavedProfile());
  const [editing, setEditing] = useState(false);

  function handleSave(updatedProfile) {
    const newProfile = {
      ...student,
      ...updatedProfile
    };

    localStorage.setItem("collideProfile", JSON.stringify(newProfile));
    setStudent(newProfile);
    setEditing(false);
  }

  if (editing) {
    return (
      <main className="auth-page">
        <section className="profile-edit-page">
          <ProfileForm
            initialProfile={student}
            onSave={handleSave}
            buttonText="Save Changes"
          />
        </section>
      </main>
    );
  } else {
    return (
      <main className="auth-page">
        <section className="profile-page">
          <div className="profile-sidebar">
            <div className="profile-sidebar-card">
              <div className="profile-sidebar-avatar">
                {student.profilePhoto && (
                  <img className="profile-photo-image" src={student.profilePhoto} alt="Profile" />
                )}

                {!student.profilePhoto && (
                  <span>{student.displayName.charAt(0).toUpperCase()}</span>
                )}
              </div>

              <h2 className="profile-sidebar-name">
                {student.displayName}
              </h2>

              <p className="profile-sidebar-major">
                {student.major}
              </p>

              <button className="profile-edit-button" onClick={() => setEditing(true)}>
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
}

export default Profile;