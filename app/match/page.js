"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import socket from "@/lib/socket";

export default function MatchPage() {
  const router = useRouter();

  const [online, setOnline] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);

  const messages = [
    "Scanning campus…",
    "Finding your vibe…",
    "Matching energies…",
    "Almost there…"
  ];

  // ROTATING TEXT ANIMATION
  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // SOCKET MATCHING
  useEffect(() => {
    const gender = localStorage.getItem("gender");
    const preferredGender = localStorage.getItem("preferredGender");
    const intent = localStorage.getItem("intent");

    socket.emit("start-search", { gender, preferredGender, intent });

    socket.on("matched", () => {
      router.push("/chat");
    });

    socket.on("online-count", (count) => {
      setOnline(count);
    });

    return () => {
      socket.off("matched");
      socket.off("online-count");
    };
  }, []);

  // CANCEL SEARCH
  const cancelSearch = () => {
    router.push("/intent");
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">

      {/* gradient glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-pink-900/20" />

      <div className="relative text-center space-y-8">

        <p className="text-sm text-gray-400">
          {online} students online
        </p>

        <h1 className="text-3xl font-semibold animate-pulse">
          {messages[messageIndex]}
        </h1>

        {/* bouncing dots */}
        <div className="flex justify-center gap-3">
          <span className="w-3 h-3 bg-white rounded-full animate-bounce"/>
          <span className="w-3 h-3 bg-white rounded-full animate-bounce delay-150"/>
          <span className="w-3 h-3 bg-white rounded-full animate-bounce delay-300"/>
        </div>

        <button
          onClick={cancelSearch}
          className="mt-6 px-6 py-2 rounded-full bg-white/10 hover:bg-white/20 transition text-sm"
        >
          Cancel search
        </button>

      </div>
    </div>
  );
}
