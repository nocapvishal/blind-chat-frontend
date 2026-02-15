"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import socket from "@/lib/socket";

export default function MatchPage() {
  const router = useRouter();
  const [popup, setPopup] = useState(null);

  useEffect(() => {
    socket.connect();

    socket.emit("start-search", {
      gender: localStorage.getItem("gender"),
      preference: localStorage.getItem("preference"),
      intent: localStorage.getItem("intent"),
    });

    socket.on("matched", () => {
      router.push("/chat");
    });

    socket.on("requeue", () => {
      socket.emit("start-search", {
        gender: localStorage.getItem("gender"),
        preference: localStorage.getItem("preference"),
        intent: localStorage.getItem("intent"),
      });
    });

    // 🔥 FALLBACK POPUPS
    socket.on("suggest-relax-intent", () => {
      setPopup("relax");
    });

    socket.on("suggest-open-match", () => {
      setPopup("open");
    });

    return () => {
      socket.off("matched");
      socket.off("requeue");
      socket.off("suggest-relax-intent");
      socket.off("suggest-open-match");
    };
  }, []);

  const skip = () => socket.emit("skip");

  const acceptRelax = () => {
    socket.emit("relax-intent");
    setPopup(null);
  };

  const acceptOpen = () => {
    socket.emit("open-match");
    setPopup(null);
  };

  return (
    <div className="h-screen bg-black text-white flex flex-col items-center justify-center gap-6 text-center px-6">

      <h1 className="text-4xl font-bold">Finding someone…</h1>
      <p className="opacity-60">Please wait while we match you</p>

      <button
        onClick={skip}
        className="bg-white text-black px-6 py-3 rounded-xl font-semibold"
      >
        Skip ⏭
      </button>

      {/* POPUPS */}
      {popup === "relax" && (
        <Popup
          text="No one found with same intent. Try relaxing filters?"
          onAccept={acceptRelax}
          onClose={() => setPopup(null)}
        />
      )}

      {popup === "open" && (
        <Popup
          text="Still no matches 😔 Open to entire campus?"
          onAccept={acceptOpen}
          onClose={() => setPopup(null)}
        />
      )}
    </div>
  );
}

/* Popup component */
function Popup({ text, onAccept, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center">
      <div className="bg-zinc-900 p-6 rounded-2xl max-w-sm space-y-4">
        <p>{text}</p>
        <div className="flex gap-3">
          <button onClick={onAccept} className="bg-white text-black px-4 py-2 rounded">
            Yes
          </button>
          <button onClick={onClose} className="bg-zinc-700 px-4 py-2 rounded">
            No
          </button>
        </div>
      </div>
    </div>
  );
}
