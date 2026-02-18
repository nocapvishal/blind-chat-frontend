"use client";
import { useEffect,useState,useRef } from "react";
import { useRouter } from "next/navigation";
import socket from "@/lib/socket";

export default function MatchPage(){

  const router = useRouter();
  const matchSound = useRef(null);

  const [counts,setCounts]=useState({friendship:0,dating:0,casual:0});
  const [showRelax,setShowRelax]=useState(false);
  const [showOpen,setShowOpen]=useState(false);

  useEffect(()=>{
    // ✅ Audio only in browser
    matchSound.current = new Audio("/match.mp3");

    socket.connect();

    const gender=localStorage.getItem("gender");
    const preference=localStorage.getItem("preference");
    const intent=localStorage.getItem("intent")||"casual";

    socket.emit("start-search",{gender,preference,intent});

    socket.on("matched",()=>{
      matchSound.current?.play();
      router.push("/chat");
    });

    socket.on("online-counts",setCounts);
    socket.on("suggest-relax-intent",()=>setShowRelax(true));
    socket.on("suggest-open-match",()=>setShowOpen(true));

    return()=>socket.disconnect();
  },[]);

  const cancelSearch=()=>{
    socket.emit("cancel-search");
    router.push("/preferences");
  };

  return(
    <div className="min-h-screen flex items-center justify-center text-center">
      <div>
        <h1 className="text-3xl font-bold">Finding someone...</h1>

        <p className="opacity-60 mt-2">
          🤝 {counts.friendship} | ❤️ {counts.dating} | 💬 {counts.casual} online
        </p>

        <button
          onClick={cancelSearch}
          className="bg-white text-black px-6 py-3 rounded-xl mt-6">
          Cancel search & change preferences
        </button>
      </div>
    </div>
  );
}
