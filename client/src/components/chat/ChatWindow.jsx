import { useState, useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import useChat from "../../hooks/useChat";
import api from "../../utils/api";

function ChatWindow({ setPage, matchId: propMatchId }) {
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const myId = storedUser.id || storedUser._id || "";

  const [matches, setMatches] = useState([]);
  const [activeMatchId, setActiveMatchId] = useState(propMatchId || null);
  const [loadingMatches, setLoadingMatches] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  const { messages, sendMessage } = useChat(activeMatchId);

  useEffect(() => {
    async function loadMatches() {
      try {
        const { data } = await api.get("/matches");
        setMatches(data);
        if (!propMatchId && data.length > 0) {
          setActiveMatchId(data[0]._id);
        }
      } finally {
        setLoadingMatches(false);
      }
    }
    loadMatches();
  }, []);

  useEffect(() => {
    if (propMatchId) setActiveMatchId(propMatchId);
  }, [propMatchId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const activeMatch = matches.find((m) => m._id === activeMatchId);
  const otherUser = activeMatch?.users.find((u) => u._id !== myId) || activeMatch?.users[0];

  function handleSend() {
    if (!newMessage.trim()) return;
    sendMessage(newMessage);
    setNewMessage("");
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") handleSend();
  }

  if (loadingMatches) {
    return (
      <section className="empty-card">
        <p className="form-subtitle">Loading chats...</p>
      </section>
    );
  }

  if (matches.length === 0) {
    return (
      <section className="empty-card">
        <h1 className="form-title">No matches yet</h1>
        <p className="form-subtitle">Match with someone on the Swipe page to start chatting!</p>
      </section>
    );
  }

  return (
    <section className="chat-window">
      <div className="chat-sidebar">
        <p className="chat-sidebar-label">Messages</p>
        {matches.map((match) => {
          const other = match.users.find((u) => u._id !== myId) || match.users[0];
          const isActive = match._id === activeMatchId;
          return (
            <button
              key={match._id}
              className={`chat-menu-button${isActive ? " chat-menu-button-active" : ""}`}
              onClick={() => setActiveMatchId(match._id)}
            >
              <div className="chat-sidebar-avatar">
                {other.profilePhoto
                  ? <img src={other.profilePhoto} alt={other.name} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "inherit" }} />
                  : other.name.charAt(0).toUpperCase()
                }
              </div>
              <span>{other.name}</span>
            </button>
          );
        })}
      </div>

      <div className="chat-main">
        {otherUser ? (
          <>
            <div className="chat-header">
              <div>
                <h1 className="chat-title">{otherUser.name}</h1>
                <p className="chat-subtitle">
                  {[otherUser.major, activeMatch?.course ? `${activeMatch.course.department} ${activeMatch.course.number}` : null]
                    .filter(Boolean).join(" • ")}
                </p>
              </div>
            </div>

            <div className="chat-messages">
              {messages.length === 0 && (
                <p className="chat-empty-hint">No messages yet — say hi!</p>
              )}
              {messages.map((msg) => (
                <MessageBubble key={msg._id} message={msg} myId={myId} />
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="chat-input-box">
              <input
                className="chat-input"
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button className="chat-send-button" type="button" onClick={handleSend}>
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="chat-placeholder">
            <p>Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default ChatWindow;
