"use client";

import { trackMatchStart, trackMatched, trackSearchCancelled, trackRelaxAccepted, trackOpenAccepted } from "@/lib/mixpanel";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import socket from "@/lib/socket";

export default function MatchPage() {
  const router = useRouter();

  const [showRelaxPopup, setShowRelaxPopup] = useState(false);
  const [showOpenPopup, setShowOpenPopup] = useState(false);

  const matchSound = typeof Audio !== "undefined" ? new Audio("/match.mp3") : null;

  useEffect(() => {
    socket.connect();

    const gender = localStorage.getItem("gender");
    const preference = localStorage.getItem("preference");
    const intent = localStorage.getItem("intent") || "chat";

    socket.emit("start-search", { gender, preference, intent });

    trackMatchStart();

    // MATCHED
    socket.on("matched", () => {
      if (matchSound) matchSound.play();
      trackMatched();
      router.push("/chat");
    });

    // Suggest relax
    socket.on("suggest-relax-intent", () => {
      setShowRelaxPopup(true);
    });

    // Suggest open campus
    socket.on("suggest-open-match", () => {
      setShowOpenPopup(true);
    });

    return () => {
      socket.off("matched");
      socket.off("suggest-relax-intent");
      socket.off("suggest-open-match");
    };
  }, []);

  const cancelSearch = () => {
    socket.emit("cancel-search");
    trackSearchCancelled();
    router.push("/preferences");
  };

  const acceptRelax = () => {
    socket.emit("relax-intent");
    trackRelaxAccepted();
    setShowRelaxPopup(false);
  };

  const acceptOpen = () => {
    socket.emit("open-match");
    trackOpenAccepted();
    setShowOpenPopup(false);
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">

      <div className="text-center space-y-6 max-w-md">
        <h1 className="text-3xl font-bold">Finding someone…</h1>
        <p className="opacity-60">Searching based on your preferences</p>
        <div className="animate-pulse text-4xl">● ● ●</div>

        <button
          onClick={cancelSearch}
          className="bg-white text-black px-6 py-3 rounded-xl mt-6"
        >
          Cancel search & change preferences
        </button>
      </div>

      {/* RELAX POPUP */}
      {showRelaxPopup && (
        <Popup
          title="Expand your search?"
          text="We couldn't find someone with same intent. Want to match with more people?"
          left="Wait more"
          right="Yes, expand"
          onLeft={() => setShowRelaxPopup(false)}
          onRight={acceptRelax}
        />
      )}

      {/* OPEN MATCH POPUP */}
      {showOpenPopup && (
        <Popup
          title="Still searching…"
          text="Not many students online. Allow matching with anyone?"
          left="Keep waiting"
          right="Match anyone"
          onLeft={() => setShowOpenPopup(false)}
          onRight={acceptOpen}
        />
      )}

    </div>
  );
}

function Popup({ title, text, left, right, onLeft, onRight }) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
      <div className="bg-zinc-900 p-8 rounded-2xl text-center space-y-4 max-w-sm">
        <h2 className="text-xl font-bold">{title}</h2>
        <p className="opacity-70 text-sm">{text}</p>

        <div className="flex gap-3 justify-center">
          <button onClick={onLeft} className="px-4 py-2 bg-white/10 rounded-lg">
            {left}
          </button>
          <button onClick={onRight} className="px-4 py-2 bg-white text-black rounded-lg">
            {right}
          </button>
        </div>
      </div>
    </div>
  );
}
