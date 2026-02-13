"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import socket from "@/lib/socket";

export default function ChatPage() {
  const router = useRouter();
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef();

  const playMsgSound = () => new Audio("/msg.mp3").play();

  useEffect(() => {
    socket.connect();

    socket.on("receive-message", (text) => {
      setMessages((prev) => [...prev, { text, me: false }]);
      playMsgSound();
    });

    socket.on("partner-typing", () => setTyping(true));
    socket.on("partner-stop-typing", () => setTyping(false));

    socket.on("partner-left", () => router.push("/match"));

    return () => {
      socket.off("receive-message");
      socket.off("partner-typing");
      socket.off("partner-stop-typing");
      socket.off("partner-left");
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!msg.trim()) return;
    socket.emit("send-message", msg);
    socket.emit("stop-typing");
    setMessages(prev => [...prev, { text: msg, me: true }]);
    setMsg("");
  };

  const handleTyping = (e) => {
    setMsg(e.target.value);
    socket.emit("typing");
  };

  const skip = () => {
    socket.emit("skip");
    router.push("/match");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="text-center text-sm text-gray-400 py-2">
        You are now connected
      </div>

      <div className="flex-1 overflow-y-auto px-4 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`max-w-[70%] p-3 rounded-full ${m.me
            ? "ml-auto bg-gradient-to-r from-purple-500 to-pink-500"
            : "bg-gray-800"}`}>
            {m.text}
          </div>
        ))}

        {typing && <div className="text-gray-400 text-sm">Stranger is typing...</div>}
        <div ref={bottomRef}/>
      </div>

      <div className="flex gap-2 p-3 border-t border-white/10">
        <input
          value={msg}
          onChange={handleTyping}
          onBlur={()=>socket.emit("stop-typing")}
          placeholder="Type a message..."
          className="flex-1 bg-gray-900 p-3 rounded-full outline-none"
          onKeyDown={(e)=> e.key==="Enter" && sendMessage()}
        />

        <button onClick={sendMessage}
          className="bg-gradient-to-r from-purple-500 to-pink-500 px-5 rounded-full">
          Send
        </button>

        <button onClick={skip}
          className="bg-gray-800 px-4 rounded-full">
          Skip
        </button>
      </div>
    </div>
  );
}
