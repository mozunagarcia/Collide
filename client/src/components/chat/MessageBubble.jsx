function MessageBubble({ message, myId }) {
  const senderId = message.sender?._id?.toString() || message.sender?.toString();
  const isMe = senderId === myId;

  const time = message.createdAt
    ? new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "";

  return (
    <div className={`message-bubble ${isMe ? "message-bubble-me" : "message-bubble-other"}`}>
      {!isMe && message.sender?.name && (
        <span className="message-sender">{message.sender.name}</span>
      )}
      <p className="message-text">{message.content}</p>
      <span className="message-time">{time}</span>
    </div>
  );
}

export default MessageBubble;
