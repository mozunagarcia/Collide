import { useState, useEffect, useRef } from "react";
import socket from "../utils/socket";

function useChat(matchId) {
  const [messages, setMessages] = useState([]);
  const prevMatchId = useRef(null);

  useEffect(() => {
    if (!matchId) return;

    // Leave previous room before joining new one
    if (prevMatchId.current && prevMatchId.current !== matchId) {
      socket.emit("leave_match", { matchId: prevMatchId.current });
    }
    prevMatchId.current = matchId;

    if (!socket.connected) {
      socket.auth = { token: localStorage.getItem("token") };
      socket.connect();
    }

    setMessages([]);
    socket.emit("join_match", { matchId });

    function onHistory(history) {
      setMessages(history);
    }

    function onMessage(message) {
      setMessages((prev) => [...prev, message]);
    }

    socket.on("message_history", onHistory);
    socket.on("receive_message", onMessage);

    return () => {
      socket.off("message_history", onHistory);
      socket.off("receive_message", onMessage);
    };
  }, [matchId]);

  useEffect(() => {
    return () => {
      socket.disconnect();
      prevMatchId.current = null;
    };
  }, []);

  function sendMessage(content) {
    if (!content?.trim() || !matchId) return;
    socket.emit("send_message", { matchId, content });
  }

  return { messages, sendMessage };
}

export default useChat;
