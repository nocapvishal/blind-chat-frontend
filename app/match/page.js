"use client";

import { useEffect, useState } from "react";
import socket from "@/lib/socket";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function MatchPage() {
  const router = useRouter();

  const [showRelaxPopup, setShowRelaxPopup] = useState(false);
  const [showOpenPopup, setShowOpenPopup] = useState(false);

  useEffect(() => {
    const gender = localStorage.getItem("gender");
    const preference = localStorage.getItem("preference");

    // start searching with saved prefs
    socket.emit("start-search", {
      gender,
      preference,
      intent: "default" // we add intent later
    });

    socket.on("matched", () => {
      router.push("/chat");
    });

    socket.on("suggest-relax-intent", () => {
      setShowRelaxPopup(true);
    });

    socket.on("suggest-open-match", () => {
      setShowOpenPopup(true);
    });

    return () => {
      socket.off("matched");
      socket.off("suggest-relax-intent");
      socket.off("suggest-open-match");
    };

  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">

      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold">Finding someone...</h1>
        <p className="opacity-60">Please wait while we match you</p>

        {/* SKIP BUTTON */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => socket.emit("skip")}
          className="mt-6 px-6 py-3 bg-white text-black rounded-xl font-semibold"
        >
          Skip 🔄
        </motion.button>
      </div>

      {/* RELAX FILTER POPUP */}
      {showRelaxPopup && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
          <div className="bg-white text-black p-6 rounded-2xl space-y-4 text-center max-w-sm">
            <h2 className="text-xl font-bold">Not many matches 😕</h2>
            <p>Broaden your search to meet more students?</p>
            <button
              onClick={() => {
                socket.emit("relax-intent");
                setShowRelaxPopup(false);
              }}
              className="w-full bg-black text-white py-3 rounded-xl"
            >
              Broaden Search
            </button>
          </div>
        </div>
      )}

      {/* OPEN MATCH POPUP */}
      {showOpenPopup && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
          <div className="bg-white text-black p-6 rounded-2xl space-y-4 text-center max-w-sm">
            <h2 className="text-xl font-bold">Campus is quiet 😴</h2>
            <p>Connect with anyone online?</p>
            <button
              onClick={() => {
                socket.emit("open-match");
                setShowOpenPopup(false);
              }}
              className="w-full bg-black text-white py-3 rounded-xl"
            >
              Connect Anyone
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
