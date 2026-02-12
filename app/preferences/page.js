"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function PreferencesPage() {
  const router = useRouter();

  const [gender, setGender] = useState("");
  const [preference, setPreference] = useState("");

  const continueToMatch = () => {
    if (!gender || !preference) {
      alert("Please select both options");
      return;
    }

    localStorage.setItem("gender", gender);
    localStorage.setItem("preference", preference);

    router.push("/match");
  };

  const Card = ({ title, value, selected, onClick }) => (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onClick(value)}
      className={`p-4 rounded-2xl cursor-pointer transition border ${
        selected
          ? "bg-white text-black border-white"
          : "bg-white/10 border-white/20 hover:bg-white/20"
      }`}
    >
      {title}
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">
      <div className="max-w-md w-full space-y-10">

        {/* Heading */}
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">
            Set your preferences
          </h1>
          <p className="opacity-60">
            This helps us find better matches.
          </p>
        </div>

        {/* YOUR GENDER */}
        <div className="space-y-3">
          <h2 className="opacity-70 text-sm">I am</h2>

          <div className="grid grid-cols-3 gap-3">
            <Card title="Male" value="male" selected={gender==="male"} onClick={setGender}/>
            <Card title="Female" value="female" selected={gender==="female"} onClick={setGender}/>
            <Card title="Other" value="other" selected={gender==="other"} onClick={setGender}/>
          </div>
        </div>

        {/* MATCH PREFERENCE */}
        <div className="space-y-3">
          <h2 className="opacity-70 text-sm">I want to meet</h2>

          <div className="grid grid-cols-3 gap-3">
            <Card title="Male" value="male" selected={preference==="male"} onClick={setPreference}/>
            <Card title="Female" value="female" selected={preference==="female"} onClick={setPreference}/>
            <Card title="Anyone" value="any" selected={preference==="any"} onClick={setPreference}/>
          </div>
        </div>

        {/* CONTINUE */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={continueToMatch}
          className="w-full bg-white text-black py-4 rounded-2xl font-semibold"
        >
          Start Matching →
        </motion.button>

      </div>
    </div>
  );
}
