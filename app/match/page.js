"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import socket from "@/lib/socket";

export default function MatchPage() {
  const router = useRouter();

  const [status, setStatus] = useState("Matching energies...");
  const [online, setOnline] = useState(0);
  const [connected, setConnected] = useState(false);

  // 🔊 match sound
  const playMatchSound = () => {
    const audio = new Audio("/match.mp3");
    audio.play();
  };

  useEffect(() => {
    socket.connect();
    socket.emit("start-search");

    socket.on("online-count", (count) => setOnline(count));

    socket.on("matched", () => {
      setStatus("Found your vibe ✨");
      setConnected(true);
      playMatchSound();

      setTimeout(() => {
        router.push("/chat");
      }, 1200);
    });

    socket.on("partner-left", () => {
      setStatus("Stranger left… finding new vibe");
      setConnected(false);
      socket.emit("start-search");
    });

    return () => {
      socket.off("matched");
      socket.off("online-count");
      socket.off("partner-left");
    };
  }, []);

  const cancelSearch = () => {
    socket.emit("stop-search");
    router.push("/");
  };

  const skipNow = () => {
    setStatus("Skipping...");
    socket.emit("skip");
  };

  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <p className="text-sm text-gray-400 mb-6">{online} students online</p>

      <h1 className="text-2xl font-semibold mb-4">{status}</h1>

      <div className="flex gap-4 mt-6">
        <button
          onClick={cancelSearch}
          className="bg-gray-800 px-5 py-2 rounded-full hover:bg-gray-700"
        >
          Cancel
        </button>

        {connected && (
          <button
            onClick={skipNow}
            className="bg-pink-600 px-5 py-2 rounded-full hover:bg-pink-500"
          >
            Skip 🔁
          </button>
        )}
      </div>
    </div>
  );
}
