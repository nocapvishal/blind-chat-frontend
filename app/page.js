"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f0f11] via-black to-[#141417]" />
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-purple-600/20 blur-[160px] rounded-full" />
      <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-pink-600/20 blur-[160px] rounded-full" />

      <div className="relative w-full max-w-xl px-10 py-14 rounded-[32px] bg-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_25px_80px_rgba(0,0,0,0.35)] text-center space-y-8">

        <div className="space-y-4">
          <h1 className="text-5xl font-semibold tracking-tight">
            Blind<span className="opacity-50">Chat</span>
          </h1>

          <p className="text-white/60 text-lg">
            Anonymous conversations. Real-time. Students only.
          </p>
        </div>

        <button
          onClick={() => router.push("/verify")}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500 text-lg font-semibold shadow-lg hover:scale-[1.02] transition-all duration-300"
        >
          Enter Campus →
        </button>

        <p className="text-xs text-white/40">
          Students of Pondicherry University only.
        </p>
      </div>
    </main>
  );
}