"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import socket from "@/lib/socket";

export default function MatchPage() {
  const router = useRouter();
  const [online, setOnline] = useState(0);

  useEffect(() => {
    socket.connect();

    socket.emit("start-search");

    socket.on("online-count", (count) => {
      setOnline(count);
    });

    socket.on("matched", () => {
      new Audio("/match.mp3").play(); // 🔔 SOUND
      router.push("/chat");
    });

    return () => {
      socket.off("matched");
      socket.off("online-count");
    };
  }, []);

  const cancelSearch = () => {
    socket.emit("stop-search");
    router.push("/");
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center text-center px-6">
      <p className="text-sm text-cyan-400 mb-4">
        {online} students online
      </p>

      <h1 className="text-3xl font-semibold text-white mb-4">
        Finding your vibe…
      </h1>

      <div className="flex gap-2 mb-8">
        <span className="w-3 h-3 bg-white rounded-full animate-bounce"></span>
        <span className="w-3 h-3 bg-white rounded-full animate-bounce delay-150"></span>
        <span className="w-3 h-3 bg-white rounded-full animate-bounce delay-300"></span>
      </div>

      <button
        onClick={cancelSearch}
        className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 transition"
      >
        Cancel search
      </button>
    </div>
  );
}
