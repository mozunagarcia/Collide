import { useState } from "react";

const pronounOptions = [
  "he/him",
  "she/her",
  "they/them",
  "Unlisted",
  "Do not display"
];

const skillOptions = [
  "C++",
  "Python",
  "Java",
  "JavaScript",
  "React",
  "Node.js",
  "MongoDB",
  "SQL",
  "HTML/CSS",
  "Git/GitHub",
  "Linux",
  "MATLAB",
  "SolidWorks",
  "AutoCAD",
  "Arduino",
  "ESP32",
  "Embedded Systems",
  "Circuit Design",
  "Data Structures",
  "Algorithms",
  "Machine Learning",
  "UI/UX Design",
  "Technical Writing",
  "Project Management"
];

function ProfileForm({ initialProfile, onSave, buttonText }) {
  const [profilePhoto, setProfilePhoto] = useState(initialProfile.profilePhoto);
  const [displayName, setDisplayName] = useState(initialProfile.displayName);
  const [pronouns, setPronouns] = useState(initialProfile.pronouns);
  const [customPronouns, setCustomPronouns] = useState(initialProfile.customPronouns);
  const [major, setMajor] = useState(initialProfile.major);
  const [year, setYear] = useState(initialProfile.year);
  const [bio, setBio] = useState(initialProfile.bio);
  const [skills, setSkills] = useState(initialProfile.skills);
  const [error, setError] = useState("");

  function handlePhotoChange(event) {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onloadend = function () {
      setProfilePhoto(reader.result);
    };

    reader.readAsDataURL(file);
  }

  function handleSkillChange(skill) {
    if (skills.includes(skill)) {
      setSkills(skills.filter((item) => item !== skill));
    } else {
      setSkills([...skills, skill]);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (displayName.trim().length === 0) {
      setError("Please add a display name");
      return;
    } else if (skills.length === 0) {
      setError("Please choose at least one skill");
      return;
    } else if (pronouns === "Unlisted" && customPronouns.trim().length === 0) {
      setError("Please type your pronouns or choose do not display");
      return;
    } else {
      setError("");
    }

    onSave({
      profilePhoto,
      displayName: displayName.trim(),
      pronouns,
      customPronouns: customPronouns.trim(),
      major: major.trim(),
      year: year.trim(),
      bio: bio.trim(),
      skills
    });
  }

  return (
    <form className="form profile-edit-form" onSubmit={handleSubmit}>
      <div className="form-header">
        <h1 className="form-title">Personalize Profile</h1>
        <p className="form-subtitle">Set up your Collide dating-style study profile</p>
      </div>

      <div className="profile-photo-editor">
        <div className="profile-photo-preview">
          {profilePhoto && (
            <img className="profile-photo-image" src={profilePhoto} alt="Profile preview" />
          )}

          {!profilePhoto && (
            <span>{displayName.charAt(0).toUpperCase() || "C"}</span>
          )}
        </div>

        <label className="photo-upload-button">
          Set Profile Pic
          <input className="photo-upload-input" type="file" accept="image/*" onChange={handlePhotoChange} />
        </label>
      </div>

      <div className="input-row">
        <label className="input-group">
          <span className="input-label">Display Name</span>
          <input
            className="input-field"
            type="text"
            placeholder="Mel"
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
          />
        </label>

        <label className="input-group">
          <span className="input-label">Pronouns</span>
          <select className="input-field" value={pronouns} onChange={(event) => setPronouns(event.target.value)}>
            {pronounOptions.map((option) => (
              <option value={option} key={option}>{option}</option>
            ))}
          </select>
        </label>
      </div>

      {pronouns === "Unlisted" && (
        <label className="input-group">
          <span className="input-label">Your Pronouns</span>
          <input
            className="input-field"
            type="text"
            placeholder="Type your pronouns"
            value={customPronouns}
            onChange={(event) => setCustomPronouns(event.target.value)}
          />
        </label>
      )}

      <div className="input-row">
        <label className="input-group">
          <span className="input-label">Major</span>
          <input
            className="input-field"
            type="text"
            placeholder="Computer Science"
            value={major}
            onChange={(event) => setMajor(event.target.value)}
          />
        </label>

        <label className="input-group">
          <span className="input-label">Year</span>
          <input
            className="input-field"
            type="text"
            placeholder="4th Year"
            value={year}
            onChange={(event) => setYear(event.target.value)}
          />
        </label>
      </div>

      <label className="input-group">
        <span className="input-label">Bio</span>
        <textarea
          className="input-field textarea-field"
          placeholder="What kind of teammate are you looking for?"
          value={bio}
          onChange={(event) => setBio(event.target.value)}
        />
      </label>

      <div className="input-group">
        <span className="input-label">Engineering Skills</span>
        <div className="skills-grid">
          {skillOptions.map((skill) => (
            <label className="skill-checkbox" key={skill}>
              <input
                type="checkbox"
                checked={skills.includes(skill)}
                onChange={() => handleSkillChange(skill)}
              />
              <span>{skill}</span>
            </label>
          ))}
        </div>
      </div>

      {error.length > 0 && (
        <p className="error-text">{error}</p>
      )}

      <button className="main-button" type="submit">
        {buttonText}
      </button>
    </form>
  );
}

ProfileForm.defaultProps = {
  initialProfile: {
    profilePhoto: "",
    displayName: "",
    pronouns: "Do not display",
    customPronouns: "",
    major: "",
    year: "",
    bio: "",
    skills: []
  },
  buttonText: "Save Profile"
};

export default ProfileForm;