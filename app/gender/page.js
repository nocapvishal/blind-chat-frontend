"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function GenderPage() {
  const router = useRouter();
  const [selected, setSelected] = useState(null);

  const options = [
    { id: "male", label: "Male" },
    { id: "female", label: "Female" },
    { id: "na", label: "Prefer not to say" },
  ];

  function handleContinue() {
    if (!selected) return;

    // later this will be saved to DB / localStorage
    localStorage.setItem("gender", selected);

    router.push("/preferences");
  }

  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#f5f7ff] via-[#f6f0ff] to-[#edf8f6]" />
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-purple-200/30 blur-[140px] rounded-full" />
      <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-teal-200/30 blur-[140px] rounded-full" />

      {/* Card */}
      <div className="relative w-[420px] p-10 rounded-[28px] bg-white/55 backdrop-blur-xl border border-white/60 shadow-[0_10px_40px_rgba(0,0,0,0.06)]">

        <h1 className="text-[28px] font-semibold text-gray-900 text-center">
          How do you identify?
        </h1>

        <p className="text-center text-gray-500 mt-2 text-sm">
          This helps us match you better.
        </p>

        <div className="mt-8 space-y-4">
          {options.map(opt => {
            const active = selected === opt.id;

            return (
              <button
                key={opt.id}
                onClick={() => setSelected(opt.id)}
                className={`
                  w-full py-4 rounded-2xl border text-[17px] font-medium transition-all duration-300
                  ${active
                    ? "bg-black text-white border-black shadow-sm scale-[1.015]"
                    : "bg-white/70 text-gray-700 border-gray-200 hover:bg-white"}
                `}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        <button
          onClick={handleContinue}
          disabled={!selected}
          className={`
            w-full mt-8 py-4 rounded-full font-semibold text-lg transition-all duration-300
            ${selected
              ? "text-white bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 shadow-md hover:scale-[1.02]"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"}
          `}
        >
          Continue →
        </button>

        <p className="text-center text-xs text-gray-400 mt-5">
          This information is never shown publicly.
        </p>

      </div>
    </main>
  );
}
