"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function VerifyPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  const domain = "@pondiuni.ac.in";

  function handleContinue() {
    if (!email.endsWith(domain)) {
      alert("Please use your Pondicherry University email.");
      return;
    }

    localStorage.setItem("campusEmail", email);
    router.push("/intent");
  }

  function handleChange(e) {
    setEmail(e.target.value);
  }

  const showGhost =
    email.includes("@") &&
    !email.endsWith(domain) &&
    email.split("@")[1] !== "pondiuni.ac.in";

  const usernamePart = email.split("@")[0];

  function applySuggestion() {
    setEmail(usernamePart + domain);
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 space-y-6 text-center">

        <h1 className="text-3xl font-semibold">
          Verify student status
        </h1>

        <p className="text-gray-400 text-sm">
          Use your Pondicherry University email
        </p>

        <div className="relative text-left">

          {/* INPUT */}
          <input
            type="email"
            placeholder="email@pondiuni.ac.in"
            className="w-full px-4 py-3 rounded-xl bg-black border border-white/20 outline-none relative z-10"
            value={email}
            onChange={handleChange}
            onKeyDown={(e) => {
              if (e.key === "Tab" && showGhost) {
                e.preventDefault();
                applySuggestion();
              }
              if (e.key === "Enter") {
                handleContinue();
              }
            }}
          />

          {/* INLINE GHOST SUGGESTION */}
          {showGhost && (
            <div className="absolute inset-0 flex items-center px-4 pointer-events-none">
              <span className="text-white/40 truncate">
                {usernamePart}
                <span className="text-white/20">
                  {domain}
                </span>
              </span>
            </div>
          )}

          {/* PREMIUM CLICKABLE CHIP */}
          {showGhost && (
            <div
              onClick={applySuggestion}
              className="mt-3 inline-block px-4 py-1 rounded-full bg-white/10 border border-white/20 text-sm text-white/80 hover:bg-white/20 transition-all cursor-pointer"
            >
              {domain}
            </div>
          )}

        </div>

        <button
          onClick={handleContinue}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 font-semibold hover:opacity-90 transition"
        >
          Continue →
        </button>

        <p className="text-xs text-gray-500">
          Your email is never shared with other users.
        </p>

      </div>
    </div>
  );
}