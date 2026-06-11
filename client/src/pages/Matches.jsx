import { useState, useEffect } from "react";
import api from "../utils/api";

function Matches({ setPage, setChatMatchId }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadMatches() {
      try {
        const { data } = await api.get("/matches");
        setMatches(data);
      } catch {
        setError("Failed to load matches.");
      } finally {
        setLoading(false);
      }
    }
    loadMatches();
  }, []);

  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const myId = storedUser._id || storedUser.id || "";

  if (loading) return (
    <section className="empty-card">
      <p className="form-subtitle">Loading matches...</p>
    </section>
  );

  if (error) return (
    <section className="empty-card">
      <p className="form-subtitle">{error}</p>
    </section>
  );

  if (matches.length === 0) {
    return (
      <section className="empty-card">
        <h1 className="form-title">No matches yet</h1>
        <p className="form-subtitle">Keep swiping to find your group!</p>
      </section>
    );
  }

  return (
    <section className="matches-page">
      <h1 className="matches-title">Your Matches</h1>
      <div className="matches-grid">
        {matches.map((match) => {
          const other = match.users.find((u) => u._id !== myId) || match.users[0];
          const courseName = match.course
            ? `${match.course.department} ${match.course.number}`
            : "";
          return (
            <div key={match._id} className="match-card">
              <div className="match-avatar">
                {other.profilePhoto
                  ? <img src={other.profilePhoto} alt={other.name} className="match-avatar-img" />
                  : <span>{other.name.charAt(0).toUpperCase()}</span>
                }
              </div>
              <div className="match-info">
                <h3 className="match-name">{other.name}</h3>
                {other.major && <p className="match-detail">{other.major}</p>}
                {other.year && <p className="match-detail">{other.year}</p>}
                {courseName && <span className="match-course">{courseName}</span>}
                {other.bio && <p className="match-bio">{other.bio}</p>}
                {other.skillTags && other.skillTags.length > 0 && (
                  <div className="profile-tags" style={{ marginTop: 8 }}>
                    {other.skillTags.slice(0, 4).map((tag) => (
                      <span key={tag} className="profile-tag">{tag}</span>
                    ))}
                  </div>
                )}
              </div>
              <button
                className="demo-button"
                onClick={() => { setChatMatchId(match._id); setPage("chat"); }}
                style={{ marginTop: 12, alignSelf: "flex-start" }}
              >
                Chat
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default Matches;
