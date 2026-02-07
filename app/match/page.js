"use client";

import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

let socket;

export default function MatchPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [onlineCount, setOnlineCount] = useState(0);
  const [typing, setTyping] = useState(false);

  const bottomRef = useRef(null);

  useEffect(() => {
    socket = io("https://blind-chat-5i1q.onrender.com");

    socket.on("connect", () => {
      console.log("Connected");
    });

    socket.emit("joinQueue");

    socket.on("onlineCount", (count) => {
      setOnlineCount(count);
    });

    socket.on("matched", () => {
      setMessages([
        { text: "✨ You are now chatting with a student", system: true },
      ]);
    });

    socket.on("message", (msg) => {
      setMessages((prev) => [...prev, { text: msg, me: false }]);
    });

    socket.on("typing", () => {
      setTyping(true);
      setTimeout(() => setTyping(false), 1500);
    });

    socket.on("partnerLeft", () => {
      setMessages((prev) => [
        ...prev,
        { text: "Partner left. Finding new match…", system: true },
      ]);
      socket.emit("joinQueue");
    });

    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const sendMessage = () => {
    if (!input.trim()) return;

    socket.emit("message", input);
    setMessages((prev) => [...prev, { text: input, me: true }]);
    setInput("");
  };

  const handleKey = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  const skip = () => {
    socket.emit("skip");
    setMessages([{ text: "Finding new match…", system: true }]);
  };

  return (
    <div style={styles.page}>
      {/* HEADER */}
      <div style={styles.header}>
        <div>
          <div style={styles.title}>Anonymous Student</div>
          <div style={styles.online}>{onlineCount} students online</div>
        </div>

        <button style={styles.skipBtn} onClick={skip}>
          Skip
        </button>
      </div>

      {/* CHAT AREA */}
      <div style={styles.chatBox}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={
              msg.system
                ? styles.systemMsg
                : msg.me
                ? styles.myMsg
                : styles.theirMsg
            }
          >
            {msg.text}
          </div>
        ))}

        {typing && (
          <div style={styles.typingBubble}>Stranger is typing…</div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* INPUT BAR */}
      <div style={styles.inputBar}>
        <input
          style={styles.input}
          placeholder="Type a message…"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            socket.emit("typing");
          }}
          onKeyDown={handleKey}
        />

        <button style={styles.sendBtn} onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: {
    height: "100vh",
    background: "#0f1226",
    display: "flex",
    flexDirection: "column",
    color: "white",
    fontFamily: "Inter, sans-serif",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    padding: "16px 20px",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
  },

  title: {
    fontSize: "18px",
    fontWeight: 600,
  },

  online: {
    fontSize: "13px",
    opacity: 0.6,
  },

  skipBtn: {
    background: "linear-gradient(45deg,#7b61ff,#ff6ec7)",
    border: "none",
    color: "white",
    padding: "8px 16px",
    borderRadius: "999px",
    cursor: "pointer",
  },

  chatBox: {
    flex: 1,
    padding: "20px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  myMsg: {
    alignSelf: "flex-end",
    background: "linear-gradient(45deg,#7b61ff,#ff6ec7)",
    padding: "10px 16px",
    borderRadius: "18px",
    maxWidth: "70%",
  },

  theirMsg: {
    alignSelf: "flex-start",
    background: "#1f234a",
    padding: "10px 16px",
    borderRadius: "18px",
    maxWidth: "70%",
  },

  systemMsg: {
    alignSelf: "center",
    opacity: 0.6,
    fontSize: "13px",
  },

  typingBubble: {
    alignSelf: "flex-start",
    background: "#1f234a",
    padding: "8px 14px",
    borderRadius: "18px",
    fontSize: "13px",
    opacity: 0.7,
  },

  inputBar: {
    display: "flex",
    gap: "10px",
    padding: "16px",
    borderTop: "1px solid rgba(255,255,255,0.08)",
  },

  input: {
    flex: 1,
    padding: "12px",
    borderRadius: "999px",
    border: "none",
    outline: "none",
  },

  sendBtn: {
    background: "linear-gradient(45deg,#7b61ff,#ff6ec7)",
    border: "none",
    color: "white",
    padding: "12px 18px",
    borderRadius: "999px",
    cursor: "pointer",
  },
};
