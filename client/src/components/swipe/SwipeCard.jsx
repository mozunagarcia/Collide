import ProfileCard from "../profile/ProfileCard";

function SwipeCard({ student, onPass, onLike }) {
  return (
    <div className="swipe-card">
      <ProfileCard student={student} />

      <div className="swipe-buttons">
        <button className="pass-button" onClick={onPass}>
          Pass
        </button>

        <button className="like-button" onClick={onLike}>
          Match
        </button>
      </div>
    </div>
  );
}

export default SwipeCard;