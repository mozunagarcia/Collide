function MessageBubble({ message }) {
  let bubbleClass;

  if (message.sender === "me") {
    bubbleClass = "message-bubble message-bubble-me";
  } else {
    bubbleClass = "message-bubble message-bubble-other";
  }

  return (
    <div className={bubbleClass}>
      <p className="message-text">
        {message.text}
      </p>

      <span className="message-time">
        {message.time}
      </span>
    </div>
  );
}

export default MessageBubble;