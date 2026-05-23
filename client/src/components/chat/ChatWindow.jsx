import { useState } from "react";
import MessageBubble from "./MessageBubble";
import useChat from "../../hooks/useChat";

function ChatWindow() {
  const [newMessage, setNewMessage] = useState("");
  const { messages, sendMessage } = useChat();

  function handleSend() {
    if (newMessage.trim() === "") {
      return;
    } else {
      sendMessage(newMessage);
      setNewMessage("");
    }
  }

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      handleSend();
    } else {
      return;
    }
  }

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
            value={newMessage}
            onChange={(event) => setNewMessage(event.target.value)}
            onKeyDown={handleKeyDown}
          />

          <button
            className="chat-send-button"
            type="button"
            onClick={handleSend}
          >
            Send
          </button>
        </div>
      </div>
    </section>
  );
}

export default ChatWindow;