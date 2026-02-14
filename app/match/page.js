"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import socket from "@/lib/socket";

export default function MatchPage() {
  const router = useRouter();

  const [online, setOnline] = useState(0);
  const [searching, setSearching] = useState(true);
  const [dots, setDots] = useState("");

  // animated dots …
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((d) => (d.length >= 3 ? "" : d + "."));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // socket events
  useEffect(() => {
    // start searching when page opens
    socket.emit("start-search");

    // analytics
    window.gtag?.("event", "search_started");

    socket.on("online-count", (count) => {
      setOnline(count);
    });

    socket.on("matched", () => {
      setSearching(false);

      // play match sound
      new Audio("/ping.mp3").play();

      // analytics
      window.gtag?.("event", "match_found");

      setTimeout(() => {
        router.push("/chat");
      }, 1200);
    });

    return () => {
      socket.off("matched");
      socket.off("online-count");
    };
  }, [router]);

  const cancelSearch = () => {
    socket.disconnect();
    router.push("/");
  };

  return (
    <div className="h-screen bg-black text-white flex flex-col items-center justify-center px-6 text-center">

      {/* Online counter */}
      <p className="absolute top-6 text-sm opacity-70">
        🟢 {online} students online
      </p>

      {/* Big glowing circle animation */}
      <div className="relative mb-10">
        <div className="w-44 h-44 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 blur-3xl opacity-40 animate-pulse"></div>
        <div className="absolute inset-0 flex items-center justify-center text-6xl">
          🔍
        </div>
      </div>

      {/* Heading */}
      {searching ? (
        <>
          <h1 className="text-3xl font-semibold mb-2">
            Finding someone{dots}
          </h1>
          <p className="opacity-60 mb-10">
            Matching you with a student right now
          </p>
        </>
      ) : (
        <>
          <h1 className="text-3xl font-semibold text-green-400 mb-2">
            Match Found 💬
          </h1>
          <p className="opacity-60">Opening chat…</p>
        </>
      )}

      {/* Cancel button */}
      {searching && (
        <button
          onClick={cancelSearch}
          className="mt-12 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 transition"
        >
          Cancel
        </button>
      )}
    </div>
  );
}
