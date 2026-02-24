"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import socket from "@/lib/socket";

export default function ChatPage() {
  const router = useRouter();
  const inputRef = useRef(null);
  const bottomRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [showIsland, setShowIsland] = useState(false);

  // ================= SOCKET =================
  useEffect(() => {
    if (!socket.connected) socket.connect();

    const handleReceive = (data) => {
      setMessages((prev) => [
        ...prev,
        {
          text: data.text,
          timestamp: data.timestamp,
          self: data.senderId === socket.id,
          reaction: null,
        },
      ]);

      if (data.senderId !== socket.id) {
        setShowIsland(true);
        setTimeout(() => setShowIsland(false), 2500);
      }
    };

    const handleReaction = ({ messageIndex, emoji }) => {
      setMessages((prev) => {
        const updated = [...prev];
        if (updated[messageIndex]) {
          updated[messageIndex].reaction = emoji;
        }
        return updated;
      });
    };

    socket.on("receive-message", handleReceive);
    socket.on("reaction-updated", handleReaction);

    return () => {
      socket.off("receive-message", handleReceive);
      socket.off("reaction-updated", handleReaction);
    };
  }, []);

  // ================= AUTO SCROLL =================
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ================= SEND =================
  const sendMessage = () => {
    if (!message.trim()) return;

    socket.emit("send-message", message);

    setMessage("");
    setReplyTo(null);

    if (navigator.vibrate) navigator.vibrate([5, 10, 5]);

    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  const addReaction = (emoji, index) => {
    socket.emit("add-reaction", {
      messageIndex: index,
      emoji,
    });
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] dark:bg-[#0f0f11] pb-32">
      {/* Dynamic Island */}
      {showIsland && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-black text-white px-6 py-2 rounded-full shadow-2xl backdrop-blur-xl z-50">
          New message
        </div>
      )}

      {/* Messages */}
      <div className="pt-20 max-w-3xl mx-auto px-5 space-y-6">
        {messages.map((msg, i) => (
          <MessageBubble
            key={i}
            msg={msg}
            index={i}
            onReact={addReaction}
            onReply={() => setReplyTo(msg.text)}
          />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Reply Preview */}
      {replyTo && (
        <div className="fixed bottom-20 left-0 right-0 max-w-3xl mx-auto px-5">
          <div className="bg-white/90 dark:bg-[#1c1c1e] backdrop-blur-xl rounded-xl p-3 shadow-md text-sm opacity-80 border border-black/5 dark:border-white/10">
            Replying to: {replyTo}
          </div>
        </div>
      )}

      {/* Input Section */}
      <div className="fixed bottom-0 left-0 right-0 backdrop-blur-xl bg-white/80 dark:bg-black/70 border-t border-black/5 dark:border-white/10 p-3 pb-safe">
        <div className="max-w-3xl mx-auto flex items-center gap-2">
          <input
            ref={inputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message"
            className="flex-1 bg-transparent outline-none px-4 py-2"
          />

          <button
            onClick={() => socket.emit("skip")}
            className="text-red-500 text-sm px-3 py-2 rounded-full opacity-70 hover:opacity-100 transition"
          >
            Skip
          </button>

          <button
            onClick={sendMessage}
            className="bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-full active:scale-95 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

// ================= MESSAGE BUBBLE =================

function MessageBubble({ msg, index, onReact, onReply }) {
  const [showReactions, setShowReactions] = useState(false);

  return (
    <div className={`relative max-w-[75%] ${msg.self ? "ml-auto" : ""}`}>
      <div
        className={`relative px-5 py-3 rounded-3xl shadow-sm transition-all duration-200 active:scale-[0.98] ${
          msg.self
            ? "bg-black text-white dark:bg-white dark:text-black"
            : "bg-white dark:bg-[#1c1c1e] border border-black/5 dark:border-white/10"
        }`}
        onTouchStart={() => setShowReactions(true)}
      >
        {msg.text}

        <div className="text-[11px] mt-1 opacity-40">
          {new Date(msg.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>

        {msg.reaction && (
          <div className="absolute -bottom-3 right-3 text-sm">
            {msg.reaction}
          </div>
        )}
      </div>

      {showReactions && (
        <div className="absolute -top-12 bg-white dark:bg-[#1c1c1e] shadow-lg rounded-full px-3 py-2 flex gap-2">
          {["❤️", "😂", "🔥", "👍", "😮"].map((emoji) => (
            <span
              key={emoji}
              onClick={() => {
                onReact(emoji, index);
                setShowReactions(false);
              }}
              className="cursor-pointer hover:scale-125 transition"
            >
              {emoji}
            </span>
          ))}

          <span
            onClick={() => {
              onReply();
              setShowReactions(false);
            }}
            className="text-xs opacity-60 ml-2 cursor-pointer"
          >
            Reply
          </span>
        </div>
      )}
    </div>
  );
}