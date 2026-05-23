import { useState } from "react";
import ProfileCard from "../profile/ProfileCard";

function SwipeCard({ student, onPass, onLike, swipeClass }) {
  const [position, setPosition] = useState({
    x: 0,
    y: 0
  });

  const [startPoint, setStartPoint] = useState({
    x: 0,
    y: 0
  });

  const [dragging, setDragging] = useState(false);

  function handleMouseDown(event) {
    setDragging(true);

    setStartPoint({
      x: event.clientX - position.x,
      y: event.clientY - position.y
    });
  }

  function handleMouseMove(event) {
    if (dragging) {
      setPosition({
        x: event.clientX - startPoint.x,
        y: event.clientY - startPoint.y
      });
    } else {
      return;
    }
  }

  function handleMouseUp() {
    setDragging(false);

    if (position.x > 120) {
      onLike();

      setPosition({
        x: 0,
        y: 0
      });
    } else if (position.x < -120) {
      onPass();

      setPosition({
        x: 0,
        y: 0
      });
    } else {
      setPosition({
        x: 0,
        y: 0
      });
    }
  }

  let swipeLabel;

  if (position.x > 40) {
    swipeLabel = (
      <div className="swipe-label match-label">
        MATCH
      </div>
    );
  } else if (position.x < -40) {
    swipeLabel = (
      <div className="swipe-label pass-label">
        PASS
      </div>
    );
  } else {
    swipeLabel = null;
  }

  return (
    <div
      className={`swipe-card ${swipeClass}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{
        transform: `
          translate(${position.x}px, ${position.y}px)
          rotate(${position.x * 0.04}deg)
        `
      }}
    >
      {swipeLabel}

      <ProfileCard student={student} />

      <div className="swipe-buttons">
        <button
          className="pass-button"
          type="button"
          onClick={onPass}
        >
          Pass
        </button>

        <button
          className="like-button"
          type="button"
          onClick={onLike}
        >
          Match
        </button>
      </div>
    </div>
  );
}

export default SwipeCard;