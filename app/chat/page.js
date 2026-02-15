"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import socket from "@/lib/socket";

export default function ChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const ping = useRef(null);

  useEffect(() => {
    ping.current = new Audio("/ping.mp3");

    socket.on("receive-message", (msg) => {
      setMessages(m => [...m, { me: false, text: msg }]);
      ping.current.play();
    });

    socket.on("partner-left", () => {
      alert("Partner left 😢 Finding new match...");
      router.push("/match");
    });

    return () => {
      socket.off("receive-message");
      socket.off("partner-left");
    };
  }, []);

  const send = () => {
    if (!text) return;

    socket.emit("send-message", text);
    setMessages(m => [...m, { me: true, text }]);
    setText("");
  };

  const skip = () => {
    socket.emit("skip");
    router.push("/match");
  };

  return (
    <div className="h-screen bg-black text-white flex flex-col">

      <div className="p-4 border-b border-white/10 flex justify-between">
        <span>You are now connected</span>
        <button onClick={skip} className="text-red-400">Skip ⏭</button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={m.me ? "text-right" : "text-left"}>
            <span className="bg-zinc-800 px-4 py-2 rounded-xl inline-block">
              {m.text}
            </span>
          </div>
        ))}
      </div>

      <div className="p-4 flex gap-2 border-t border-white/10">
        <input
          value={text}
          onChange={(e)=>setText(e.target.value)}
          className="flex-1 bg-zinc-900 p-3 rounded-xl"
          placeholder="Type a message..."
        />
        <button onClick={send} className="bg-white text-black px-5 rounded-xl">
          Send
        </button>
      </div>

    </div>
  );
}
