"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import socket from "@/lib/socket";

export default function ChatPage() {
  const router = useRouter();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);

  const playMsgSound = () => {
    const audio = new Audio("/message.mp3");
    audio.volume = 0.35;
    audio.play();
  };

  const scrollDown = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {

    socket.on("receive-message", (msg) => {
      setMessages(prev => [...prev, { text: msg, me: false }]);
      playMsgSound();
      scrollDown();
    });

    socket.on("typing", () => {
      setTyping(true);
      setTimeout(()=>setTyping(false), 1500);
    });

    socket.on("partner-left", () => {
      alert("Partner left. Finding new match…");
      router.push("/match");
    });

    return () => {
      socket.off("receive-message");
      socket.off("typing");
      socket.off("partner-left");
    };

  }, []);

  const sendMessage = () => {
    if (!input.trim()) return;

    socket.emit("send-message", input);
    setMessages(prev => [...prev, { text: input, me: true }]);
    setInput("");
    scrollDown();
  };

  const handleTyping = (e) => {
    setInput(e.target.value);
    socket.emit("typing");
  };

  const handleKey = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  const skipPartner = () => {
    socket.disconnect();
    socket.connect();
    router.push("/match");
  };

  return (
    <div className="h-screen bg-black text-white flex flex-col">

      <div className="p-4 border-b border-white/10 flex justify-between">
        <span className="opacity-70">Anonymous chat</span>
        <button onClick={skipPartner} className="bg-white text-black px-3 py-1 rounded-full text-sm">
          Skip →
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg,i)=>(
          <div key={i} className={`max-w-[75%] px-4 py-2 rounded-2xl ${
            msg.me ? "bg-white text-black ml-auto" : "bg-white/10"
          }`}>
            {msg.text}
          </div>
        ))}

        {typing && (
          <div className="text-sm opacity-60">Typing…</div>
        )}

        <div ref={bottomRef}/>
      </div>

      <div className="p-4 border-t border-white/10 flex gap-2">
        <input
          value={input}
          onChange={handleTyping}
          onKeyDown={handleKey}
          placeholder="Type a message…"
          className="flex-1 bg-white/10 px-4 py-2 rounded-full outline-none"
        />
        <button onClick={sendMessage} className="bg-white text-black px-5 rounded-full">
          Send
        </button>
      </div>

    </div>
  );
}
