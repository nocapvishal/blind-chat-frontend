"use client";

import { useEffect, useState, useCallback } from "react";
import socket from "@/lib/socket"; // Default export
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function MatchPage() {
  const router = useRouter();

  const [showRelaxPopup, setShowRelaxPopup] = useState(false);
  const [showOpenPopup, setShowOpenPopup] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);

  // Handle skip functionality
  const handleSkip = useCallback(() => {
    if (socket && socket.connected) {
      socket.emit("skip");
      setShowRelaxPopup(false);
      setShowOpenPopup(false);
    }
  }, []);

  // Handle relax intent
  const handleRelaxIntent = useCallback(() => {
    if (socket && socket.connected) {
      socket.emit("relax-intent");
      setShowRelaxPopup(false);
    }
  }, []);

  // Handle open match
  const handleOpenMatch = useCallback(() => {
    if (socket && socket.connected) {
      socket.emit("open-match");
      setShowOpenPopup(false);
    }
  }, []);

  useEffect(() => {
    // Check if socket is available
    if (!socket) {
      setError("Connection unavailable. Please refresh the page.");
      return;
    }

    // Get user preferences from localStorage
    const gender = localStorage.getItem("gender");
    const preference = localStorage.getItem("preference");

    // Validate preferences exist
    if (!gender || !preference) {
      setError("Please set your preferences first.");
      router.push("/"); // Redirect to home/setup page
      return;
    }

    setIsSearching(true);

    // Start searching for a match
    socket.emit("start-search", {
      gender,
      preference,
      intent: "default"
    });

    // Socket event handlers
    const handleMatched = () => {
      setIsSearching(false);
      router.push("/chat");
    };

    const handleSuggestRelax = () => {
      setShowRelaxPopup(true);
    };

    const handleSuggestOpen = () => {
      setShowOpenPopup(true);
    };

    const handleConnectionError = () => {
      setError("Connection lost. Trying to reconnect...");
      setIsSearching(false);
    };

    const handleReconnect = () => {
      setError(null);
      setIsSearching(true);
      // Restart search on reconnection
      socket.emit("start-search", {
        gender,
        preference,
        intent: "default"
      });
    };

    // Register event listeners
    socket.on("matched", handleMatched);
    socket.on("suggest-relax-intent", handleSuggestRelax);
    socket.on("suggest-open-match", handleSuggestOpen);
    socket.on("connect_error", handleConnectionError);
    socket.on("reconnect", handleReconnect);

    // Cleanup function
    return () => {
      socket.off("matched", handleMatched);
      socket.off("suggest-relax-intent", handleSuggestRelax);
      socket.off("suggest-open-match", handleSuggestOpen);
      socket.off("connect_error", handleConnectionError);
      socket.off("reconnect", handleReconnect);
      
      // Optional: Cancel search when leaving page
      if (socket.connected) {
        socket.emit("cancel-search");
      }
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">
      <div className="text-center space-y-6">
        {error ? (
          <>
            <h1 className="text-4xl font-bold text-red-500">Oops!</h1>
            <p className="opacity-80">{error}</p>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.reload()}
              className="mt-6 px-6 py-3 bg-white text-black rounded-xl font-semibold"
            >
              Refresh Page
            </motion.button>
          </>
        ) : (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="text-6xl mb-4"
            >
              🔍
            </motion.div>
            <h1 className="text-4xl font-bold">Finding someone...</h1>
            <p className="opacity-60">Please wait while we match you</p>

            {/* SKIP BUTTON */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleSkip}
              disabled={!isSearching}
              className="mt-6 px-6 py-3 bg-white text-black rounded-xl font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Skip 🔄
            </motion.button>
          </>
        )}
      </div>

      {/* RELAX FILTER POPUP */}
      <AnimatePresence>
        {showRelaxPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white text-black p-6 rounded-2xl space-y-4 text-center max-w-sm w-full"
            >
              <div className="text-4xl mb-2">😕</div>
              <h2 className="text-xl font-bold">Not many matches</h2>
              <p className="text-gray-700">
                Broaden your search to meet more students?
              </p>
              <div className="space-y-3">
                <button
                  onClick={handleRelaxIntent}
                  className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors"
                >
                  Broaden Search
                </button>
                <button
                  onClick={() => setShowRelaxPopup(false)}
                  className="w-full bg-gray-200 text-black py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                >
                  Keep Waiting
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* OPEN MATCH POPUP */}
      <AnimatePresence>
        {showOpenPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white text-black p-6 rounded-2xl space-y-4 text-center max-w-sm w-full"
            >
              <div className="text-4xl mb-2">😴</div>
              <h2 className="text-xl font-bold">Campus is quiet</h2>
              <p className="text-gray-700">
                Connect with anyone online?
              </p>
              <div className="space-y-3">
                <button
                  onClick={handleOpenMatch}
                  className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors"
                >
                  Connect Anyone
                </button>
                <button
                  onClick={() => setShowOpenPopup(false)}
                  className="w-full bg-gray-200 text-black py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                >
                  Keep Waiting
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}