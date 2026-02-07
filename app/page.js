"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  return (
    <main className="h-screen flex items-center justify-center bg-[#0f0f14] text-white">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center space-y-6"
      >
        <h1 className="text-4xl font-bold">
          Meet someone. No pressure.
        </h1>

        <p className="opacity-70">
          Anonymous campus chat.
        </p>

        <Link href="/verify">
          <button className="px-6 py-3 rounded-xl bg-white text-black font-semibold">
            Enter Campus →
          </button>
        </Link>
      </motion.div>
    </main>
  );
}
