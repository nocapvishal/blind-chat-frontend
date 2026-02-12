"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function VerifyPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  function handleContinue() {
    if (!email.endsWith("@pondiuni.ac.in")) {
      alert("Please use your Pondicherry University email.");
      return;
    }

    localStorage.setItem("campusEmail", email);
    router.push("/intent");
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

        <input
          type="email"
          placeholder="email@pondiuni.ac.in"
          className="w-full px-4 py-3 rounded-xl bg-black border border-white/20 outline-none"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />

        <button
          onClick={handleContinue}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 font-semibold"
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
