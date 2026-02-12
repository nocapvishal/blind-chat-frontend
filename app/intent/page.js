"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Preferences() {
  const router = useRouter();

  const [gender, setGender] = useState("");
  const [preferredGender, setPreferredGender] = useState("");
  const [intent, setIntent] = useState("");

  function continueFlow() {
    if (!gender || !preferredGender || !intent) {
      alert("Please complete all selections.");
      return;
    }

    localStorage.setItem("gender", gender);
    localStorage.setItem("preferredGender", preferredGender);
    localStorage.setItem("intent", intent);

    router.push("/match");
  }

  const optionStyle = (value, state) =>
    `w-full py-3 rounded-xl border transition ${
      state === value
        ? "bg-white text-black"
        : "border-white/20 hover:border-white/40"
    }`;

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-5">

      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-pink-900/20" />

      <div className="relative w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 space-y-7">

        <div className="text-center">
          <h1 className="text-3xl font-semibold">Your Preferences</h1>
          <p className="text-gray-400 text-sm">Helps us find better matches</p>
        </div>

        {/* USER GENDER */}
        <div className="space-y-2">
          <p className="text-sm text-gray-400">I identify as</p>

          <button onClick={()=>setGender("male")} className={optionStyle("male", gender)}>Male</button>
          <button onClick={()=>setGender("female")} className={optionStyle("female", gender)}>Female</button>
          <button onClick={()=>setGender("lgbt")} className={optionStyle("lgbt", gender)}>LGBTQ+</button>
        </div>

        {/* PREFERRED GENDER */}
        <div className="space-y-2">
          <p className="text-sm text-gray-400">I want to talk to</p>

          <button onClick={()=>setPreferredGender("male")} className={optionStyle("male", preferredGender)}>Male</button>
          <button onClick={()=>setPreferredGender("female")} className={optionStyle("female", preferredGender)}>Female</button>
          <button onClick={()=>setPreferredGender("any")} className={optionStyle("any", preferredGender)}>Anyone</button>
        </div>

        {/* INTENT */}
        <div className="space-y-2">
          <p className="text-sm text-gray-400">Looking for</p>

          <button onClick={()=>setIntent("friends")} className={optionStyle("friends", intent)}>Friendship</button>
          <button onClick={()=>setIntent("dating")} className={optionStyle("dating", intent)}>Dating</button>
          <button onClick={()=>setIntent("casual")} className={optionStyle("casual", intent)}>Casual conversations</button>
        </div>

        <button
          onClick={continueFlow}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 font-semibold"
        >
          Start Matching →
        </button>

      </div>
    </div>
  );
}
