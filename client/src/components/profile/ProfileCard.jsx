function ProfileCard({ student }) {
  const courseList = student.courses
    ?.map((c) => `${c.department} ${c.number}`)
    .join(", ");

  return (
    <section className="profile-card">
      <div className="profile-header">
        <div className="profile-avatar">
          {student.name?.charAt(0)}
        </div>

        <div>
          <h2 className="profile-name">{student.name}</h2>
          <p className="profile-major">{student.major}</p>
        </div>
      </div>

      {student.bio && <p className="profile-bio">{student.bio}</p>}

      <div className="profile-info">
        {student.year && <p>Year: {student.year}</p>}
        {courseList && <p>Course: {courseList}</p>}
      </div>

      {student.skillTags?.length > 0 && (
        <div className="profile-tags">
          {student.skillTags.map((skill) => (
            <span className="profile-tag" key={skill}>
              {skill}
            </span>
          ))}
        </div>
      )}
    </section>
  );
}

export default ProfileCard;
