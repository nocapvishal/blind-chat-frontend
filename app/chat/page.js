"use client";
import { useEffect,useState,useRef } from "react";
import { useRouter } from "next/navigation";
import socket from "@/lib/socket";

export default function ChatPage(){

  const router=useRouter();
  const inputRef=useRef(null);
  const msgSound=useRef(null);

  const [counts,setCounts]=useState({friendship:0,dating:0,casual:0});
  const [messages,setMessages]=useState([]);
  const [message,setMessage]=useState("");

  useEffect(()=>{
    socket.connect();
    msgSound.current=new Audio("/msg.mp3");

    socket.on("online-counts",setCounts);

    socket.on("receive-message",(msg)=>{
      setMessages(prev=>[...prev,{text:msg,self:false}]);
      msgSound.current.play();
    });

    socket.on("partner-left",()=>{
      alert("Stranger left 😢");
      router.push("/match");
    });

    return()=>socket.disconnect();
  },[]);

  const sendMessage=()=>{
    if(!message.trim())return;
    socket.emit("send-message",message);
    setMessages(prev=>[...prev,{text:message,self:true}]);
    setMessage("");
    setTimeout(()=>inputRef.current?.focus(),10);
  };

  const skipChat=()=>{
    socket.emit("skip-chat");
    router.push("/match");
  };

  return(
    <div className="min-h-screen pb-20">

      {/* HEADER COUNTERS */}
      <div className="fixed top-0 w-full text-center p-3 border-b border-white/10">
        🤝 {counts.friendship} | ❤️ {counts.dating} | 💬 {counts.casual}
      </div>

      {/* MESSAGES */}
      <div className="pt-16 max-w-4xl mx-auto p-4 space-y-3">
        {messages.map((msg,i)=>(
          <div key={i}
            className={`max-w-[75%] px-4 py-2 rounded-2xl ${
              msg.self
              ? "ml-auto bg-gradient-to-r from-purple-500 to-pink-500"
              : "mr-auto bg-white/10"
            }`}>
            {msg.text}
          </div>
        ))}
      </div>

      {/* INPUT BAR */}
      <div className="fixed bottom-0 w-full bg-black border-t border-white/10 p-3">
        <div className="max-w-4xl mx-auto flex gap-2">
          <input
            ref={inputRef}
            value={message}
            onChange={e=>setMessage(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&sendMessage()}
            placeholder="Type a message..."
            className="flex-1 bg-white/10 px-4 py-3 rounded-full outline-none"
          />

          <button
            onClick={sendMessage}
            className="bg-white text-black px-6 py-3 rounded-full">
            Send
          </button>

          <button
            onClick={skipChat}
            className="bg-red-500 px-6 py-3 rounded-full">
            Skip
          </button>
        </div>
      </div>

    </div>
  );
}
