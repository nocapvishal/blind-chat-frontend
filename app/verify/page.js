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

  const usernamePart = email.split("@")[0] || "";
  const showSuggestion =
    email.includes("@") && !email.endsWith(domain);

  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden">

      <div className="absolute inset-0 bg-gradient-to-br from-[#0f0f11] via-black to-[#141417]" />

      <div className="relative w-full max-w-md px-10 py-12 rounded-[28px] bg-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.4)] text-center space-y-8">

        <div>
          <h1 className="text-3xl font-semibold mb-2">
            Verify student status
          </h1>
          <p className="text-white/50 text-sm">
            Use your Pondicherry University email
          </p>
        </div>

        <div className="space-y-3">

          <input
            type="email"
            placeholder="name@pondiuni.ac.in"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleContinue();
            }}
            className="w-full px-5 py-4 rounded-2xl bg-black/40 border border-white/10 outline-none focus:border-purple-500 transition"
          />

          {showSuggestion && (
            <button
              onClick={() => setEmail(usernamePart + domain)}
              className="text-xs text-purple-400 hover:underline"
            >
              Use {usernamePart + domain}
            </button>
          )}
        </div>

        <button
          onClick={handleContinue}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500 font-semibold hover:scale-[1.02] transition-all duration-300"
        >
          Continue →
        </button>

        <p className="text-xs text-white/30">
          Your email is never shared publicly.
        </p>

      </div>
    </main>
  );
}