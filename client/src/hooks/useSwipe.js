import { useState } from "react";
import api from "../utils/api";

function useSwipe(candidates) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeClass, setSwipeClass] = useState("");
  const [match, setMatch] = useState(null);

  const currentStudent = candidates[currentIndex];

  function moveToNext() {
    setTimeout(() => {
      setCurrentIndex((i) => i + 1);
      setSwipeClass("");
    }, 350);
  }

  async function handlePass() {
    setSwipeClass("swipe-left");
    try {
      await api.post("/swipe", { swipedUserId: currentStudent._id, direction: "pass" });
    } catch (err) {
      console.error("Swipe error:", err);
    }
    moveToNext();
  }

  async function handleLike() {
    setSwipeClass("swipe-right");
    try {
      const res = await api.post("/swipe", { swipedUserId: currentStudent._id, direction: "like" });
      if (res.data.match) setMatch(res.data.match);
    } catch (err) {
      console.error("Swipe error:", err);
    }
    moveToNext();
  }

  function dismissMatch() {
    setMatch(null);
  }

  return { currentStudent, swipeClass, handlePass, handleLike, match, dismissMatch };
}

export default useSwipe;
