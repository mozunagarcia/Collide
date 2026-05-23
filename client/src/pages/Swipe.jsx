import SwipeCard from "../components/swipe/SwipeCard";
import useSwipe from "../hooks/useSwipe";

const students = [
  {
    name: "Mel Songco",
    major: "Computer Science",
    year: "3rd Year",
    course: "CS170",
    matchPercent: 81,
    bio: "I go at my own pace",
    skills: ["React", "Frontend", "UI/UX"]
  },
  {
    name: "Abby Allers",
    major: "Computer Engineering",
    year: "4th Year",
    course: "CS170",
    matchPercent: 90,
    bio: "I prefer working in person and finishing before the deadline.",
    skills: ["C++", "Backend", "Circuits"]
  },
    {
    name: "Mari Ozuna",
    major: "Computer Science",
    year: "4th Year",
    course: "CS170",
    matchPercent: 98,
    bio: "I'm flexible working online or in-person, I prefer to get everything done on time.",
    skills: ["Python", "Backend", "Embedded"]
  }
];

function Swipe() {
  const {
    currentStudent,
    swipeClass,
    handlePass,
    handleLike
  } = useSwipe(students);

  if (currentStudent) {
    return (
      <SwipeCard
        student={currentStudent}
        onPass={handlePass}
        onLike={handleLike}
        swipeClass={swipeClass}
      />
    );
  } else {
    return (
      <section className="empty-card">
        <h1 className="form-title">No more students</h1>
        <p className="form-subtitle">Check back later for more matches.</p>
      </section>
    );
  }
}

export default Swipe;