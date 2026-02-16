"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import socket from "@/lib/socket";

export default function MatchPage() {
  const router = useRouter();
  const [popup, setPopup] = useState(null);

  useEffect(() => {
    const gender = localStorage.getItem("gender");
    const preference = localStorage.getItem("preference");
    const intent = localStorage.getItem("intent") || "friends";

    socket.connect();
    socket.emit("start-search", { gender, preference, intent });

    socket.on("matched", () => {
      playMatchSound();
      router.push("/chat");
    });

    socket.on("requeue", () => {
      socket.emit("start-search", { gender, preference, intent });
    });

    socket.on("suggest-relax-intent", () => {
      setPopup("No one found with same intent. Match across intents?");
    });

    socket.on("suggest-open-match", () => {
      setPopup("Still no matches. Open campus matching?");
    });

    socket.on("restart-search", () => {
  socket.emit("start-search", {
    gender: localStorage.getItem("gender"),
    preference: localStorage.getItem("preference"),
    intent: localStorage.getItem("intent"),
  });
});


    return () => socket.off();
  }, []);

  function playMatchSound() {
    const audio = new Audio("/match.mp3");
    audio.play();
  }

  function acceptSuggestion() {
    socket.emit("open-match");
    setPopup(null);
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center text-center">

      <h1 className="text-3xl font-bold mb-3">Finding someone…</h1>
      <p className="opacity-50 mb-8">Please wait while we match you</p>

      <button
        onClick={() => socket.emit("skip")}
        className="bg-white text-black px-6 py-3 rounded-xl"
      >
        Skip ⏭️
      </button>

      {popup && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
          <div className="bg-zinc-900 p-8 rounded-2xl text-center space-y-5">
            <h2 className="text-xl font-bold">No matches yet</h2>
            <p className="opacity-70">{popup}</p>
            <button
              onClick={acceptSuggestion}
              className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 rounded-xl"
            >
              Yes 👍
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
