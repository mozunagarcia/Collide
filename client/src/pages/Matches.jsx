import { useEffect, useState } from "react";
import api from "../utils/api";
import useAuth from "../hooks/useAuth";

function Matches() {
  const { user } = useAuth();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/matches")
      .then((res) => setMatches(res.data))
      .catch((err) => console.error("Failed to fetch matches:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="empty-card">
        <p className="form-subtitle">Loading...</p>
      </section>
    );
  }

  if (!matches.length) {
    return (
      <section className="empty-card">
        <h1 className="form-title">No matches yet</h1>
        <p className="form-subtitle">Keep swiping to find study partners!</p>
      </section>
    );
  }

  return (
    <section className="matches-page">
      <h1 className="form-title">Your Matches</h1>
      <div className="matches-list">
        {matches.map((match) => {
          const other = match.users.find((u) => u._id !== user?.id);
          return (
            <div key={match._id} className="match-card">
              <h3 className="match-name">{other?.name}</h3>
              <p className="match-details">{other?.major} · {other?.year}</p>
              <p className="match-course">
                {match.course?.department} {match.course?.number}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default Matches;
