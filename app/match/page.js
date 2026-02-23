"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import socket from "@/lib/socket";

export default function MatchPage() {
  const router = useRouter();
  const [counts, setCounts] = useState({ friendship: 0, dating: 0, casual: 0 });

  useEffect(() => {
    const preferences = JSON.parse(localStorage.getItem("preferences"));

    if (!preferences) {
      router.push("/intent");
      return;
    }

    if (!socket.connected) {
      socket.connect();
    }

    const handleCounts = (data) => {
      setCounts(data);
    };

    const handleMatch = () => {
      router.push("/chat");
    };

    socket.on("online-counts", handleCounts);
    socket.on("match-found", handleMatch);

    socket.emit("start-search", preferences);

    return () => {
      socket.off("online-counts", handleCounts);
      socket.off("match-found", handleMatch);
      socket.emit("cancel-search");
    };
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen bg-black text-white flex-col gap-6">
      <h1 className="text-3xl font-bold">Finding someone...</h1>

      <div className="flex gap-4 text-lg">
        <span>🤝 {counts.friendship}</span>
        <span>❤️ {counts.dating}</span>
        <span>💬 {counts.casual}</span>
      </div>

      <button
        onClick={() => {
          socket.emit("cancel-search");
          router.push("/intent");
        }}
        className="bg-white text-black px-6 py-2 rounded-lg"
      >
        Cancel search & change preferences
      </button>
    </div>
  );
}