"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import socket from "@/lib/socket";

export default function MatchPage() {
  const router = useRouter();

  useEffect(() => {
    socket.connect();
    socket.emit("start-search");

    socket.on("matched", () => {
      new Audio("/match.mp3").play();
      router.push("/chat");
    });

    return () => socket.off("matched");
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6">
      <div className="text-gray-400">Finding your vibe…</div>
      <div className="animate-pulse text-2xl">● ● ●</div>

      <button
        onClick={()=>router.push("/")}
        className="bg-gray-800 px-6 py-2 rounded-full">
        Cancel search
      </button>
    </div>
  );
}
