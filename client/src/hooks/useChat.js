import { useState } from "react";

function useChat() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "collider",
      text: "Hii, i am looking for a group in CS110, Can I still join your group?",
      time: "1:24 PM"
    },
    {
      id: 2,
      sender: "me",
      text: "Yes! I do have to be honest... we do work a bit fast-paced",
      time: "1:30 PM"
    },
    {
      id: 3,
      sender: "collider",
      text: "Sameeeee. I think we will be a good fit.",
      time: "1:31 PM"
    },
        {
      id: 4,
      sender: "me",
      text: "Ok, I'll collide with you.",
      time: "1:34 PM"
    },
  ]);

  function sendMessage(text) {
    const newMessage = {
      id: messages.length + 1,
      sender: "me",
      text: text,
      time: "Now"
    };

    setMessages([...messages, newMessage]);
  }

  return {
    messages,
    sendMessage
  };
}

export default useChat;