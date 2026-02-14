"use client";

import { useEffect, useRef, useState } from "react";
import socket from "@/lib/socket";

export default function ChatPage() {
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);

  const bottomRef = useRef();

  useEffect(() => {
    socket.on("receive-message", (msg) => {
      setMessages((prev) => [...prev, { text: msg, me: false }]);
      playSound();
    });

    socket.on("typing", () => {
      setTyping(true);
      setTimeout(() => setTyping(false), 1500);
    });

    socket.on("partner-left", () => {
      alert("Stranger left the chat");
      window.location.href = "/match";
    });

    return () => socket.off();
  }, []);

  const playSound = () => {
    new Audio("/ping.mp3").play();
  };

  const sendMessage = () => {
    if (!msg) return;
    socket.emit("send-message", msg);
    socket.emit("typing", false);
    setMessages((prev) => [...prev, { text: msg, me: true }]);
    setMsg("");

    window.gtag?.("event", "message_sent");
  };

  return (
    <div className="h-screen bg-black text-white flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((m, i) => (
          <div key={i} className={m.me ? "text-right" : ""}>
            <span className="bg-white/10 px-3 py-2 rounded-xl inline-block">
              {m.text}
            </span>
          </div>
        ))}
        {typing && <p className="text-sm opacity-60">Typing…</p>}
        <div ref={bottomRef} />
      </div>

      <div className="p-4 flex gap-2">
        <input
          value={msg}
          onChange={(e) => {
            setMsg(e.target.value);
            socket.emit("typing");
          }}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 p-3 rounded-xl bg-white/10 outline-none"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="bg-white text-black px-5 rounded-xl"
        >
          Send
        </button>
      </div>
    </div>
  );
}
