import { useState } from "react";

function useSwipe(students) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matches, setMatches] = useState([]);

  const currentStudent = students[currentIndex];

  function handlePass() {
    setCurrentIndex(currentIndex + 1);
  }

  function handleLike() {
    setMatches([...matches, currentStudent]);
    setCurrentIndex(currentIndex + 1);
  }

  return {
    currentStudent,
    matches,
    handlePass,
    handleLike
  };
}

export default useSwipe;