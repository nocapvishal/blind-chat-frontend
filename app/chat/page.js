"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import socket from "@/lib/socket";

export default function ChatPage() {

  const router = useRouter();
  const inputRef = useRef(null);
  const msgSound = useRef(null);

  const [counts, setCounts] = useState({ friendship: 0, dating: 0, casual: 0 });
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [seen, setSeen] = useState(false);

  useEffect(() => {

    if (!socket.connected) {
      socket.connect();
    }

    socket.on("connect", () => {
      socket.emit("reconnect-request");
    });

    msgSound.current = new Audio("/msg.mp3");

    const handleCounts = (data) => setCounts(data);

    const handleMessage = (data) => {
      setMessages(prev => [
        ...prev,
        {
          text: data.text,
          timestamp: data.timestamp,
          self: data.senderId === socket.id
        }
      ]);

      if (data.senderId !== socket.id) {
        socket.emit("message-seen");
        msgSound.current?.play().catch(() => {});
      }
    };

    const handlePartnerLeft = () => {
      alert("Stranger left 😢");
      router.push("/match");
    };

    const handleTyping = () => setIsTyping(true);
    const handleStopTyping = () => setIsTyping(false);
    const handleSeen = () => setSeen(true);

    socket.on("online-counts", handleCounts);
    socket.on("receive-message", handleMessage);
    socket.on("partner-left", handlePartnerLeft);
    socket.on("partner-typing", handleTyping);
    socket.on("partner-stop-typing", handleStopTyping);
    socket.on("message-seen", handleSeen);

    return () => {
      socket.off("online-counts", handleCounts);
      socket.off("receive-message", handleMessage);
      socket.off("partner-left", handlePartnerLeft);
      socket.off("partner-typing", handleTyping);
      socket.off("partner-stop-typing", handleStopTyping);
      socket.off("message-seen", handleSeen);
    };

  }, [router]);

  const sendMessage = () => {
    if (!message.trim()) return;

    socket.emit("send-message", message);
    setMessage("");
    setSeen(false);
  };

  return (
    <div className="min-h-screen pb-20">

      <div className="fixed top-0 w-full text-center p-3 border-b border-white/10">
        🤝 {counts.friendship} | ❤️ {counts.dating} | 💬 {counts.casual}
      </div>

      <div className="pt-16 max-w-4xl mx-auto p-4 space-y-3">

        {messages.map((msg, i) => (
          <div key={i}>
            <div
              className={`max-w-[75%] px-4 py-2 rounded-2xl ${
                msg.self
                  ? "ml-auto bg-gradient-to-r from-purple-500 to-pink-500"
                  : "mr-auto bg-white/10"
              }`}
            >
              {msg.text}
              <div className="text-xs text-white/40 mt-1">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </div>
            </div>

            {msg.self && i === messages.length - 1 && seen && (
              <div className="text-xs text-blue-400 text-right">Seen</div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="text-sm text-white/50">Stranger is typing...</div>
        )}

      </div>

      <div className="fixed bottom-0 w-full bg-black border-t border-white/10 p-3">
        <div className="max-w-4xl mx-auto flex gap-2">
          <input
            ref={inputRef}
            value={message}
            onChange={e => {
              setMessage(e.target.value);
              socket.emit("typing");
              setTimeout(() => socket.emit("stop-typing"), 1000);
            }}
            onKeyDown={e => e.key === "Enter" && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 bg-white/10 px-4 py-3 rounded-full outline-none"
          />

          <button
            onClick={sendMessage}
            className="bg-white text-black px-6 py-3 rounded-full"
          >
            Send
          </button>

          <button
            onClick={() => {
              socket.emit("skip-chat");
              router.push("/match");
            }}
            className="bg-red-500 px-6 py-3 rounded-full"
          >
            Skip
          </button>
        </div>
      </div>

    </div>
  );
}