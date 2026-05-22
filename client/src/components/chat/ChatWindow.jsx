import MessageBubble from "./MessageBubble";

function ChatWindow() {
  const messages = [
    {
      id: 1,
      sender: "collider",
      text: "Heyyyy, r u looking for a groupmate?",
      time: "1:24 PM"
    },
    {
      id: 2,
      sender: "me",
      text: "Yes! Sorry but i need to tell you that I am a bit strict with deadlines",
      time: "10:25 AM"
    },
    {
      id: 3,
      sender: "collider",
      text: "Same i like that",
      time: "10:26 AM"
    },
    {
      id: 4,
      sender: "me",
      text: "Okay, we can make a group space.",
      time: "10:27 AM"
    }
  ];

  return (
    <section className="chat-window">
      <div className="chat-sidebar">
        <div className="chat-profile">
          <div className="chat-avatar">
            M
          </div>

          <h2 className="chat-name">
            Mel
          </h2>

          <p className="chat-status">
            CS170 Match
          </p>
        </div>

        <button className="chat-menu-button">
          Messages
        </button>

        <button className="chat-menu-button">
          Group Space
        </button>

        <button className="chat-menu-button">
          Profile
        </button>
      </div>

      <div className="chat-main">
        <div className="chat-header">
          <div>
            <h1 className="chat-title">
              Mel Quant
            </h1>

            <p className="chat-subtitle">
              Computer Engineering • 78% Match
            </p>
          </div>

          <button className="chat-action-button">
            Create Group
          </button>
        </div>

        <div className="chat-messages">
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
            />
          ))}
        </div>

        <div className="chat-input-box">
          <input
            className="chat-input"
            type="text"
            placeholder="Type a message..."
          />

          <button className="chat-send-button">
            Send
          </button>
        </div>
      </div>
    </section>
  );
}

export default ChatWindow;