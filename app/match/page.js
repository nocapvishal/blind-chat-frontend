"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import socket from "@/lib/socket";
import mixpanel from "@/lib/mixpanel";

export default function MatchPage() {
  const router = useRouter();

  const [status, setStatus] = useState("Finding someone...");
  const [showRelaxPopup, setShowRelaxPopup] = useState(false);
  const [showOpenPopup, setShowOpenPopup] = useState(false);

  const matchSound = new Audio("/match.mp3");

  useEffect(() => {
    socket.connect();

    mixpanel.track("Started Searching");

    const gender = localStorage.getItem("gender");
    const preference = localStorage.getItem("preference");
    const intent = localStorage.getItem("intent") || "chat";

    socket.emit("start-search", { gender, preference, intent });

    // matched
    socket.on("matched", () => {
      matchSound.play();
      mixpanel.track("User Matched");
      router.push("/chat");
    });

    // relax intent suggestion
    socket.on("suggest-relax-intent", () => {
      setShowRelaxPopup(true);
    });

    // open campus suggestion
    socket.on("suggest-open-match", () => {
      setShowOpenPopup(true);
    });

    return () => {
      socket.off("matched");
      socket.off("suggest-relax-intent");
      socket.off("suggest-open-match");
    };
  }, []);

  // Skip search (clear meaning)
  const skipSearch = () => {
    socket.emit("cancel-search");
    mixpanel.track("Search Cancelled");

    alert(
      "Search cancelled. You can change preferences or start a fresh search."
    );

    router.push("/preferences");
  };

  const acceptRelax = () => {
    socket.emit("relax-intent");
    mixpanel.track("Relax Intent Accepted");
    setShowRelaxPopup(false);
  };

  const acceptOpen = () => {
    socket.emit("open-match");
    mixpanel.track("Open Match Accepted");
    setShowOpenPopup(false);
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">

      <div className="text-center space-y-6 max-w-md">

        <h1 className="text-3xl font-bold">{status}</h1>
        <p className="opacity-60">
          Please wait while we find someone based on your preferences.
        </p>

        <div className="animate-pulse text-4xl">● ● ●</div>

        {/* Skip button */}
        <button
          onClick={skipSearch}
          className="bg-white text-black px-6 py-3 rounded-xl mt-6"
        >
          Cancel search & change preferences
        </button>
      </div>

      {/* RELAX POPUP */}
      {showRelaxPopup && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
          <div className="bg-zinc-900 p-8 rounded-2xl text-center space-y-4 max-w-sm">
            <h2 className="text-xl font-bold">Expand your search?</h2>
            <p className="opacity-70 text-sm">
              We couldn't find someone with the same intent yet.  
              Want to match with more people on campus?
            </p>

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setShowRelaxPopup(false)}
                className="px-4 py-2 bg-white/10 rounded-lg"
              >
                Wait more
              </button>
              <button
                onClick={acceptRelax}
                className="px-4 py-2 bg-white text-black rounded-lg"
              >
                Yes, expand
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OPEN CAMPUS POPUP */}
      {showOpenPopup && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
          <div className="bg-zinc-900 p-8 rounded-2xl text-center space-y-4 max-w-sm">
            <h2 className="text-xl font-bold">Still searching…</h2>
            <p className="opacity-70 text-sm">
              Not many students online right now.  
              Allow matching with ANYONE on campus?
            </p>

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setShowOpenPopup(false)}
                className="px-4 py-2 bg-white/10 rounded-lg"
              >
                Keep waiting
              </button>
              <button
                onClick={acceptOpen}
                className="px-4 py-2 bg-white text-black rounded-lg"
              >
                Match anyone
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
