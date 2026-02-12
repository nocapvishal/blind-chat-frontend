"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-black flex items-center justify-center px-6">

      {/* gradient glow background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-black to-pink-900/30" />

      <div className="relative w-full max-w-lg bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-10 text-center space-y-6">

        <h1 className="text-4xl font-bold leading-tight">
          Meet someone<br/>on campus
        </h1>

        <p className="text-gray-400">
          Anonymous conversations. Real-time. Students only.
        </p>

        <button
          onClick={()=>router.push("/verify")}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 font-semibold text-lg hover:opacity-90 transition"
        >
          Enter Campus →
        </button>

        <p className="text-xs text-gray-500">
          By continuing you agree to our community guidelines.
        </p>

      </div>
    </main>
  );
}
