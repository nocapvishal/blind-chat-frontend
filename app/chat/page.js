"use client";

import { useEffect, useRef, useState } from "react";
import socket from "@/lib/socket";
import { useRouter } from "next/navigation";
import { trackChatStarted, trackMessageSent, trackMessageReceived, trackChatSkipped } from "@/lib/mixpanel";

export default function ChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const messageSound = typeof Audio !== "undefined" ? new Audio("/msg.mp3") : null;
  const bottomRef = useRef();

  useEffect(() => {
    trackChatStarted();

    socket.on("receive-message", (msg) => {
      setMessages((prev) => [...prev, { text: msg, mine: false }]);
      if (messageSound) messageSound.play();
      trackMessageReceived();
    });

    socket.on("partner-disconnected", () => {
      alert("Partner left the chat");
      router.push("/match");
    });

    return () => {
      socket.off("receive-message");
      socket.off("partner-disconnected");
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!text.trim()) return;

    socket.emit("send-message", text);
    setMessages((prev) => [...prev, { text, mine: true }]);
    trackMessageSent();
    setText("");
  };

  const skipChat = () => {
    socket.emit("skip");
    trackChatSkipped();
    router.push("/match");
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`max-w-xs px-4 py-2 rounded-xl ${m.mine ? "bg-white text-black ml-auto" : "bg-white/10"}`}>
            {m.text}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="p-4 border-t border-white/10 flex gap-3">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-white/10 px-4 py-2 rounded-xl outline-none"
        />
        <button onClick={sendMessage} className="bg-white text-black px-5 rounded-xl">
          Send
        </button>
        <button onClick={skipChat} className="bg-red-500 px-4 rounded-xl">
          Skip
        </button>
      </div>

    </div>
  );
}
