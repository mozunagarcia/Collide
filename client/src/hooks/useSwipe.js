import { useState } from "react";

function useSwipe(students) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matches, setMatches] = useState([]);
  const [swipeClass, setSwipeClass] = useState("");

  const currentStudent = students[currentIndex];

  function moveToNextStudent() {
    setTimeout(() => {
      setCurrentIndex(currentIndex + 1);
      setSwipeClass("");
    }, 350);
  }

  function handlePass() {
    setSwipeClass("swipe-left");
    moveToNextStudent();
  }

  function handleLike() {
    setSwipeClass("swipe-right");
    setMatches([...matches, currentStudent]);
    moveToNextStudent();
  }

  return {
    currentStudent,
    matches,
    swipeClass,
    handlePass,
    handleLike
  };
}

export default useSwipe;