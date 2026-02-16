"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import socket from "@/lib/socket";

export default function MatchPage() {
  const router = useRouter();
  const [online, setOnline] = useState(0);
  const [status, setStatus] = useState("Connecting…");

  const playMatchSound = () => {
    const audio = new Audio("/match.mp3");
    audio.volume = 0.4;
    audio.play();
  };

  useEffect(() => {
    const gender = localStorage.getItem("gender");
    const preference = localStorage.getItem("preference");
    const intent = localStorage.getItem("intent");

    socket.connect();

    socket.emit("start-search", { gender, preference, intent });

    socket.on("online-count", (count) => setOnline(count));

    socket.on("matched", () => {
      playMatchSound();
      router.push("/chat");
    });

    socket.on("suggest-relax-intent", () => {
      if (confirm("No matches found for your intent. Expand search?")) {
        socket.emit("relax-intent");
        setStatus("Expanding search…");
      }
    });

    socket.on("suggest-open-match", () => {
      if (confirm("Still no matches. Open to everyone on campus?")) {
        socket.emit("open-match");
        setStatus("Searching campus…");
      }
    });

    return () => {
      socket.off("matched");
      socket.off("online-count");
    };
  }, []);

  return (
    <div className="h-screen bg-black text-white flex flex-col items-center justify-center gap-6 px-6 text-center">

      {/* spinner */}
      <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>

      <h1 className="text-3xl font-bold">Finding someone…</h1>
      <p className="opacity-60">{status}</p>

      <div className="opacity-40 text-sm">
        {online} students online
      </div>

      <button
        onClick={()=>{
          socket.disconnect();
          router.push("/preferences");
        }}
        className="mt-10 text-sm opacity-60 underline"
      >
        Change preferences
      </button>

    </div>
  );
}
