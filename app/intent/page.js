"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function IntentPage() {
  const router = useRouter();

  const [selectedGender, setSelectedGender] = useState("");
  const [selectedPreference, setSelectedPreference] = useState("");
  const [selectedIntent, setSelectedIntent] = useState("");

  const handleStart = () => {
    if (!selectedGender || !selectedPreference || !selectedIntent) {
      alert("Please select all options");
      return;
    }

    const formattedPreferences = {
      gender: selectedGender.toLowerCase(),
      preference: selectedPreference.toLowerCase(),
      intent:
        selectedIntent === "Casual conversations"
          ? "casual"
          : selectedIntent.toLowerCase(),
    };

    console.log("💾 Saving preferences:", formattedPreferences);

    localStorage.setItem(
      "preferences",
      JSON.stringify(formattedPreferences)
    );

    router.push("/match");
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-6 px-6">
      <h1 className="text-3xl font-bold">Set Your Preferences</h1>

      {/* Gender */}
      <div className="flex flex-col gap-3 w-full max-w-md">
        <p>I identify as</p>
        {["Male", "Female", "LGBTQ+"].map((g) => (
          <button
            key={g}
            onClick={() => setSelectedGender(g)}
            className={`border p-3 rounded-lg ${
              selectedGender === g ? "bg-white text-black" : ""
            }`}
          >
            {g}
          </button>
        ))}
      </div>

      {/* Preference */}
      <div className="flex flex-col gap-3 w-full max-w-md">
        <p>I want to talk to</p>
        {["Male", "Female", "Anyone"].map((p) => (
          <button
            key={p}
            onClick={() => setSelectedPreference(p)}
            className={`border p-3 rounded-lg ${
              selectedPreference === p ? "bg-white text-black" : ""
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Intent */}
      <div className="flex flex-col gap-3 w-full max-w-md">
        <p>Looking for</p>
        {["Friendship", "Dating", "Casual conversations"].map((i) => (
          <button
            key={i}
            onClick={() => setSelectedIntent(i)}
            className={`border p-3 rounded-lg ${
              selectedIntent === i ? "bg-white text-black" : ""
            }`}
          >
            {i}
          </button>
        ))}
      </div>

      <button
        onClick={handleStart}
        className="mt-6 bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 rounded-lg font-semibold"
      >
        Start Matching →
      </button>
    </div>
  );
}