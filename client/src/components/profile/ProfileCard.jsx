function ProfileCard({ student }) {
  return (
    <section className="profile-card">
      <div className="profile-header">
        <div className="profile-avatar">
          {student.profilePhoto
            ? <img src={student.profilePhoto} alt={student.name} style={{ width:"100%", height:"100%", objectFit:"cover", borderRadius:"18px" }} />
            : student.name.charAt(0)
          }
        </div>

        <div>
          <h2 className="profile-name">{student.name}</h2>
          <p className="profile-major">{student.major}</p>
        </div>
      </div>

      <p className="profile-bio">{student.bio}</p>

      <div className="profile-info">
        <p>Year: {student.year}</p>
        <p>Course: {student.course}</p>
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