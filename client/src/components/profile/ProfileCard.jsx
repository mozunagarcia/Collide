function ProfileCard({ student }) {
  let shownPronouns = "";

  if (student.pronouns === "Unlisted") {
    shownPronouns = student.customPronouns;
  } else if (student.pronouns === "Do not display") {
    shownPronouns = "";
  } else {
    shownPronouns = student.pronouns;
  }

  return (
    <section className="profile-card">
      <div className="profile-header">
        <div className="profile-avatar">
          {student.profilePhoto && (
            <img className="profile-photo-image" src={student.profilePhoto} alt="Profile" />
          )}

          {!student.profilePhoto && (
            <span>{student.displayName.charAt(0).toUpperCase()}</span>
          )}
        </div>

        <div>
          <h2 className="profile-name">{student.displayName}</h2>
          <p className="profile-major">{student.major}</p>

          {shownPronouns.length > 0 && (
            <p className="profile-pronouns">{shownPronouns}</p>
          )}
        </div>
      </div>

      <p className="profile-bio">{student.bio}</p>

      <div className="profile-info">
        <p>Year: {student.year}</p>
        <p>Course: {student.courseCode}</p>
        <p>Match: {student.matchPercent}%</p>
      </div>

      <div className="profile-tags">
        {student.skills.map((skill) => (
          <span className="profile-tag" key={skill}>
            {skill}
          </span>
        ))}
      </div>
    </section>
  );
}

export default ProfileCard;