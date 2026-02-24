"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import socket from "@/lib/socket";

export default function MatchPage() {
  const router = useRouter();

  const [counts, setCounts] = useState({
    friendship: 0,
    dating: 0,
    casual: 0,
  });

  const [displayCounts, setDisplayCounts] = useState({
    friendship: 0,
    dating: 0,
    casual: 0,
  });

  const [seconds, setSeconds] = useState(0);
  const [relaxed, setRelaxed] = useState(false);
  const [timeoutReached, setTimeoutReached] = useState(false);
  const [loading, setLoading] = useState(true);
  const [matched, setMatched] = useState(false);

  const timerRef = useRef(null);

  /* =========================
     Animated Count Up
  ========================== */

  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayCounts((prev) => ({
        friendship:
          prev.friendship < counts.friendship
            ? prev.friendship + 1
            : counts.friendship,
        dating:
          prev.dating < counts.dating
            ? prev.dating + 1
            : counts.dating,
        casual:
          prev.casual < counts.casual
            ? prev.casual + 1
            : counts.casual,
      }));
    }, 35);

    return () => clearInterval(interval);
  }, [counts]);

  /* =========================
     Initial Load
  ========================== */

  useEffect(() => {
    const preferences = JSON.parse(localStorage.getItem("preferences"));

    if (!preferences) {
      router.push("/intent");
      return;
    }

    if (!socket.connected) socket.connect();

    const handleCounts = (data) => {
      setCounts(data);
      setLoading(false);
    };

    const handleMatch = () => {
      clearInterval(timerRef.current);
      setMatched(true);

      if (navigator.vibrate) navigator.vibrate([40, 20, 40]);

      setTimeout(() => {
        router.push("/chat");
      }, 900);
    };

    socket.on("online-counts", handleCounts);
    socket.on("match-found", handleMatch);

    socket.emit("start-search", preferences);

    timerRef.current = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(timerRef.current);
      socket.off("online-counts", handleCounts);
      socket.off("match-found", handleMatch);
      socket.emit("cancel-search");
    };
  }, [router]);

  /* =========================
     Timeout Logic
  ========================== */

  useEffect(() => {
    if (seconds >= 25 && !relaxed) {
      setTimeoutReached(true);
    }
  }, [seconds, relaxed]);

  /* =========================
     Estimated Wait
  ========================== */

  const totalOnline =
    counts.friendship + counts.dating + counts.casual;

  const estimatedWait =
    totalOnline === 0
      ? "No one online"
      : totalOnline < 5
      ? "≈ 30–60 sec"
      : totalOnline < 15
      ? "≈ 15–30 sec"
      : "Almost instant";

  /* =========================
     Relax Preference
  ========================== */

  const handleRelax = () => {
    const prefs = JSON.parse(localStorage.getItem("preferences"));
    if (!prefs) return;

    const relaxedPrefs = {
      ...prefs,
      preference: "any",
    };

    localStorage.setItem("preferences", JSON.stringify(relaxedPrefs));

    socket.emit("cancel-search");
    socket.emit("start-search", relaxedPrefs);

    setRelaxed(true);
    setTimeoutReached(false);
    setSeconds(0);
  };

  /* =========================
     UI
  ========================== */

  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#f5f5f7] dark:bg-[#0f0f11] transition-opacity duration-500">

      {/* Match Transition Overlay */}
      {matched && (
        <div className="absolute inset-0 flex items-center justify-center bg-black text-white z-50">
          <div className="text-center space-y-6 animate-pageFade">
            <div className="w-20 h-20 rounded-full bg-white mx-auto animate-pulse" />
            <h1 className="text-2xl font-semibold tracking-tight">
              Matched
            </h1>
          </div>
        </div>
      )}

      <div className="relative w-full max-w-md text-center space-y-12 px-6">

        {/* Skeleton Loader */}
        {loading ? (
          <div className="space-y-6">
            <div className="w-24 h-24 rounded-full shimmer mx-auto" />
            <div className="h-6 w-48 mx-auto shimmer rounded" />
            <div className="h-4 w-32 mx-auto shimmer rounded" />
            <div className="grid grid-cols-3 gap-6">
              <div className="h-20 shimmer rounded-2xl" />
              <div className="h-20 shimmer rounded-2xl" />
              <div className="h-20 shimmer rounded-2xl" />
            </div>
          </div>
        ) : (
          <>
            {/* Search Indicator */}
            <div className="flex justify-center">
              <div className="relative w-24 h-24">
                <div className="absolute inset-0 rounded-full border border-black/10 dark:border-white/10 animate-ping opacity-20" />
                <div className="absolute inset-4 rounded-full border border-black/20 dark:border-white/20 animate-pulse" />
                <div className="absolute inset-8 rounded-full bg-black dark:bg-white" />
              </div>
            </div>

            <div className="space-y-3">
              <h1 className="text-2xl font-semibold tracking-tight">
                Finding someone...
              </h1>

              <p className="text-sm opacity-50">
                Estimated wait: {estimatedWait}
              </p>

              <p className="text-xs opacity-40">
                Searching for {seconds}s
              </p>
            </div>

            {/* Premium Counters */}
            <div className="grid grid-cols-3 gap-6 max-w-sm mx-auto">
              <CountCard label="FRIENDSHIP" value={displayCounts.friendship} />
              <CountCard label="DATING" value={displayCounts.dating} />
              <CountCard label="CASUAL" value={displayCounts.casual} />
            </div>

            {timeoutReached && !relaxed && (
              <div className="space-y-4">
                <p className="text-sm opacity-50">
                  Not finding a match?
                </p>
                <button
                  onClick={handleRelax}
                  className="px-6 py-3 rounded-full border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10 transition"
                >
                  Expand preference to anyone
                </button>
              </div>
            )}

            <button
              onClick={() => {
                socket.emit("cancel-search");
                router.push("/intent");
              }}
              className="text-sm opacity-40 hover:opacity-70 transition"
            >
              Cancel search
            </button>
          </>
        )}
      </div>
    </main>
  );
}

/* Premium Counter Card */

function CountCard({ label, value }) {
  return (
    <div className="px-4 py-5 rounded-2xl bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-black/5 dark:border-white/10 text-center transition-all duration-300">
      <div className="text-[10px] tracking-widest opacity-40 mb-2">
        {label}
      </div>
      <div className="text-2xl font-semibold tracking-tight">
        {value}
      </div>
    </div>
  );
}