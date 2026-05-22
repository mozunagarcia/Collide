import SwipeCard from "../components/swipe/SwipeCard";
import useSwipe from "../hooks/useSwipe";

const students = [
  {
    name: "Mel Songco",
    major: "Computer Science",
    year: "3rd Year",
    course: "CS170",
    matchPercent: 92,
    bio: "Looking for a reliable project group that likes planning early.",
    skills: ["React", "Python", "UI/UX"]
  },
  {
    name: "Abby Allers",
    major: "Computer Engineering",
    year: "4th Year",
    course: "CS170",
    matchPercent: 87,
    bio: "I prefer working in person and finishing before the deadline.",
    skills: ["C++", "Circuits", "Backend"]
  }
];

function Swipe() {
  const {
    currentStudent,
    handlePass,
    handleLike
  } = useSwipe(students);

  if (currentStudent) {
    return (
      <main className="auth-page">
        <SwipeCard
          student={currentStudent}
          onPass={handlePass}
          onLike={handleLike}
        />
      </main>
    );
  } else {
    return (
      <main className="auth-page">
        <h1 className="form-title">
          No more students to show
        </h1>
      </main>
    );
  }
}

export default Swipe;