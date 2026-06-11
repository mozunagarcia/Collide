import { useState, useEffect } from "react";
import SwipeCard from "../components/swipe/SwipeCard";
import api from "../utils/api";

function Swipe({ setPage }) {
  const [candidates, setCandidates] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeClass, setSwipeClass] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [matchNotif, setMatchNotif] = useState(null);

  useEffect(() => {
    async function loadCandidates() {
      try {
        const { data } = await api.get("/swipe/candidates");
        setCandidates(data);
      } catch (err) {
        const msg = err.response?.data?.message || err.message || "Failed to load candidates.";
        setError(msg);
      } finally {
        setLoading(false);
      }
    }
    loadCandidates();
  }, []);

  const currentCandidate = candidates[currentIndex];

  function moveNext() {
    setTimeout(() => {
      setCurrentIndex((i) => i + 1);
      setSwipeClass("");
    }, 350);
  }

  async function handlePass() {
    if (!currentCandidate) return;
    setSwipeClass("swipe-left");
    try {
      await api.post("/swipe", { swipedUserId: currentCandidate._id, direction: "pass" });
    } catch { /* 409 = already swiped, still advance */ }
    moveNext();
  }

  async function handleLike() {
    if (!currentCandidate) return;
    setSwipeClass("swipe-right");
    try {
      const { data } = await api.post("/swipe", { swipedUserId: currentCandidate._id, direction: "like" });
      if (data.match) {
        setMatchNotif(currentCandidate.name);
        setTimeout(() => setMatchNotif(null), 3000);
      }
    } catch { /* ignore */ }
    moveNext();
  }

  const toStudentShape = (u) => ({
    name: u.name,
    major: u.major || "No major set",
    year: u.year || "",
    course: u.courses?.[0]
      ? `${u.courses[0].department} ${u.courses[0].number}`
      : "No course",
    bio: u.bio || "No bio yet",
    skills: u.skillTags || [],
    profilePhoto: u.profilePhoto || null,
  });

  if (loading) return (
    <section className="empty-card">
      <p className="form-subtitle">Loading candidates...</p>
    </section>
  );

  if (error) return (
    <section className="empty-card">
      <p className="form-subtitle">{error}</p>
    </section>
  );

  return (
    <>
      {matchNotif && (
        <div className="match-notification">
          Its a match with {matchNotif}!
        </div>
      )}

      {currentCandidate ? (
        <SwipeCard
          student={toStudentShape(currentCandidate)}
          onPass={handlePass}
          onLike={handleLike}
          swipeClass={swipeClass}
        />
      ) : (
        <section className="empty-card">
          <h1 className="form-title">No more students</h1>
          <p className="form-subtitle">You've seen everyone for now — check back later!</p>
        </section>
      )}
    </>
  );
}

export default Swipe;
