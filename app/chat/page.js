"use client";

import { useEffect, useRef, useState } from "react";
import socket from "@/lib/socket";

export default function ChatPage() {

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [online, setOnline] = useState(0);
  const [typing, setTyping] = useState(false);

  const bottomRef = useRef(null);

  // Auto scroll to latest message
  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  // SOCKET LISTENERS
  useEffect(() => {

    socket.on("receive-message", (msg) => {
      setMessages(prev => [...prev, { text: msg, mine: false }]);
    });

    socket.on("partner-typing", () => {
      setTyping(true);
      setTimeout(() => setTyping(false), 1500);
    });

    socket.on("online-count", (count) => {
      setOnline(count);
    });

    socket.on("partner-left", () => {
      alert("Your partner left. Searching again…");
      setMessages([]);
      socket.emit("start-search", {
        gender: localStorage.getItem("gender"),
        preferredGender: localStorage.getItem("preferredGender"),
        intent: localStorage.getItem("intent")
      });
    });

    return () => {
      socket.off("receive-message");
      socket.off("partner-typing");
      socket.off("online-count");
      socket.off("partner-left");
    };

  }, []);

  // SEND MESSAGE
  const sendMessage = () => {
    if (!input.trim()) return;

    socket.emit("send-message", input);
    setMessages(prev => [...prev, { text: input, mine: true }]);
    setInput("");
  };

  // ENTER TO SEND + typing indicator
  const handleKey = (e) => {
    if (e.key === "Enter") sendMessage();
    else socket.emit("typing");
  };

  // SKIP USER (instant re-match)
  const skipPartner = () => {
    socket.emit("skip");
    setMessages([]);
  };

  // REPORT BUTTON (MVP)
  const reportUser = () => {
    alert("User reported. Thank you.");
  };

  return (
    <div className="h-screen bg-black text-white flex flex-col">

      {/* HEADER */}
      <div className="flex justify-between items-center px-4 py-3 border-b border-white/10">
        <div>
          <p className="text-sm opacity-60">Anonymous chat</p>
          <p className="text-xs opacity-40">{online} students online</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={reportUser}
            className="px-3 py-1.5 text-sm rounded-full bg-red-500/20 hover:bg-red-500/30 transition"
          >
            Report
          </button>

          <button
            onClick={skipPartner}
            className="px-4 py-1.5 text-sm rounded-full bg-white/10 hover:bg-white/20 transition"
          >
            Skip →
          </button>
        </div>
      </div>

      {/* CHAT AREA */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <div className="text-center text-xs opacity-40">
          You are now connected
        </div>

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm ${
              msg.mine
                ? "ml-auto bg-gradient-to-r from-purple-500 to-pink-500"
                : "bg-white/10"
            }`}
          >
            {msg.text}
          </div>
        ))}

        {typing && (
          <div className="text-xs opacity-50">Partner is typing…</div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* INPUT BAR */}
      <div className="p-3 border-t border-white/10 flex gap-2">
        <input
          value={input}
          onChange={(e)=>setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Type a message…"
          className="flex-1 bg-white/10 px-4 py-3 rounded-full outline-none text-sm"
        />

        <button
          onClick={sendMessage}
          className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-sm font-semibold"
        >
          Send
        </button>
      </div>
    </div>
  );
}
