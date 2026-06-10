import { useEffect, useState } from "react";
import SwipeCard from "../components/swipe/SwipeCard";
import useSwipe from "../hooks/useSwipe";
import useAuth from "../hooks/useAuth";
import api from "../utils/api";

function Swipe() {
  const { user } = useAuth();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const courseId = user?.courses?.[0];
    if (!courseId) {
      setLoading(false);
      return;
    }
    api.get(`/swipe/candidates?courseId=${courseId}`)
      .then((res) => setCandidates(res.data))
      .catch((err) => console.error("Failed to fetch candidates:", err))
      .finally(() => setLoading(false));
  }, [user]);

  const { currentStudent, swipeClass, handlePass, handleLike, match, dismissMatch } = useSwipe(candidates);

  if (loading) {
    return (
      <section className="empty-card">
        <p className="form-subtitle">Loading...</p>
      </section>
    );
  }

  if (match) {
    return (
      <section className="empty-card">
        <h1 className="form-title">It's a Match!</h1>
        <p className="form-subtitle">You and {match.users.find((u) => u._id !== match.users[0]._id)?.name ?? "someone"} matched!</p>
        <button className="main-button" onClick={dismissMatch}>Keep Swiping</button>
      </section>
    );
  }

  if (currentStudent) {
    return (
      <SwipeCard
        student={currentStudent}
        onPass={handlePass}
        onLike={handleLike}
        swipeClass={swipeClass}
      />
    );
  }

  return (
    <section className="empty-card">
      <h1 className="form-title">No more students</h1>
      <p className="form-subtitle">Check back later for more matches.</p>
    </section>
  );
}

export default Swipe;
