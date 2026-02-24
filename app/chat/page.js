"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import socket from "@/lib/socket";

/* ================================
   MAIN CHAT PAGE
================================ */

export default function ChatPage() {
  const router = useRouter();
  const textareaRef = useRef(null);
  const scrollRef = useRef(null);
  const bottomRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [connected, setConnected] = useState(false);
  const [partnerTyping, setPartnerTyping] = useState(false);
  const [partnerLeft, setPartnerLeft] = useState(false);
  const [showIsland, setShowIsland] = useState(false);
  const [showSkipConfirm, setShowSkipConfirm] = useState(false);
  const [showScrollDown, setShowScrollDown] = useState(false);
  const [seenByPartner, setSeenByPartner] = useState(false);
  const [entering, setEntering] = useState(true);
  const [leaving, setLeaving] = useState(false);

  const [identity] = useState(() => ({
    self: "You",
    partner: "Stranger " + Math.floor(100 + Math.random() * 900),
  }));

  /* ================= SOCKET ================= */

  useEffect(() => {
    if (!socket.connected) socket.connect();

    const handleConnect = () => {
      setConnected(true);
      socket.emit("reconnect-request");
    };

    const handleReceive = (data) => {
      const newMsg = {
        messageId: data.messageId,
        text: data.text,
        timestamp: data.timestamp,
        self: data.senderId === socket.id,
        reactions: data.reactions || [],
        replyTo: data.replyTo || null,
      };

      setMessages((prev) => [...prev, newMsg]);

      if (!newMsg.self) {
        subtlePing();
        setShowIsland(true);
        navigator.vibrate?.(12);
        setTimeout(() => setShowIsland(false), 1800);
      }
    };

    socket.on("connect", handleConnect);
    socket.on("receive-message", handleReceive);
    socket.on("reaction-updated", ({ messageId, reactions }) => {
      setMessages((prev) =>
        prev.map((m) =>
          m.messageId === messageId ? { ...m, reactions } : m
        )
      );
    });
    socket.on("partner-typing", () => setPartnerTyping(true));
    socket.on("partner-stop-typing", () => setPartnerTyping(false));
    socket.on("partner-left", () => setPartnerLeft(true));
    socket.on("message-seen", () => setSeenByPartner(true));

    return () => socket.removeAllListeners();
  }, []);

  /* ================= ENTRY ================= */

  useEffect(() => {
    setTimeout(() => setEntering(false), 300);
  }, []);

  /* ================= SCROLL ================= */

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;

    const atBottom =
      el.scrollHeight - el.scrollTop - el.clientHeight < 80;

    setShowScrollDown(!atBottom);

    if (atBottom) socket.emit("message-seen");
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, partnerTyping]);

  /* ================= SEND ================= */

  const sendMessage = useCallback(() => {
    if (!message.trim()) return;

    socket.emit("send-message", {
      text: message,
      replyTo: replyTo
        ? { messageId: replyTo.messageId, text: replyTo.text }
        : null,
    });

    socket.emit("stop-typing");
    microHaptic();

    setMessage("");
    setReplyTo(null);
    setSeenByPartner(false);

    if (textareaRef.current) textareaRef.current.style.height = "auto";
  }, [message, replyTo]);

  const handleTyping = (val) => {
    setMessage(val);
    socket.emit("typing");

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  };

  /* ================= SOUND ================= */

  const subtlePing = () => {
    const ctx = new (window.AudioContext ||
      window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = 700;
    gain.gain.value = 0.02;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.06);
  };

  const microHaptic = () => {
    navigator.vibrate?.([4, 8, 4]);
  };

  /* ================= UTIL ================= */

  const isGrouped = (msg, index) => {
    if (index === 0) return false;
    const prev = messages[index - 1];
    return (
      prev &&
      prev.self === msg.self &&
      msg.timestamp - prev.timestamp < 120000
    );
  };

  /* ================= UI ================= */

  return (
    <div className="relative h-screen overflow-hidden bg-[#0f0f11] text-white">

      {/* Ambient motion background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px] animate-float1" />
        <div className="absolute right-0 bottom-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px] animate-float2" />
      </div>

      <div
        className={`flex flex-col h-screen transition-all duration-500 ${
          entering ? "opacity-0 translate-y-4" : "opacity-100"
        } ${leaving ? "opacity-0 translate-x-4" : ""}`}
      >

        {/* HEADER */}
        <div className="h-14 flex items-center justify-between px-6 border-b border-white/5 backdrop-blur-xl">
          <div className="text-sm opacity-60 tracking-wide">
            Anonymous Chat
          </div>

          <button
            onClick={() => setShowSkipConfirm(true)}
            className="text-xs tracking-[0.3em] text-red-500 hover:opacity-80 transition"
          >
            SKIP
          </button>
        </div>

        {/* MESSAGES */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-6 py-6 space-y-1"
        >
          {messages.map((msg, index) => (
            <MessageBubble
              key={msg.messageId}
              msg={msg}
              identity={identity}
              grouped={isGrouped(msg, index)}
              onReply={() => setReplyTo(msg)}
              onReact={(id, emoji) =>
                socket.emit("toggle-reaction", {
                  messageId: id,
                  emoji,
                })
              }
            />
          ))}

          {seenByPartner && (
            <div className="text-[10px] tracking-[0.2em] uppercase opacity-25 text-right pr-2">
              Seen
            </div>
          )}

          {partnerTyping && (
            <div className="ml-2 opacity-50 text-sm animate-pulse">
              typing...
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* SCROLL BUTTON */}
        {showScrollDown && (
          <button
            onClick={() =>
              bottomRef.current?.scrollIntoView({
                behavior: "smooth",
              })
            }
            className="absolute bottom-28 right-6 bg-white/10 backdrop-blur-xl px-4 py-2 rounded-full shadow-xl hover:scale-105 transition"
          >
            ↓
          </button>
        )}

        {/* INPUT */}
        <div className="border-t border-white/5 backdrop-blur-xl bg-black/40 p-4">
          <div className="flex items-end gap-3">
            <textarea
              ref={textareaRef}
              rows={1}
              value={message}
              onChange={(e) => handleTyping(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && !e.shiftKey && sendMessage()
              }
              placeholder="Type a message..."
              className="flex-1 resize-none bg-transparent outline-none px-4 py-2 text-white placeholder-white/30 max-h-40 overflow-auto break-words"
            />

            <button
              onClick={sendMessage}
              className="bg-white text-black rounded-full px-6 py-2 hover:scale-105 active:scale-95 transition-all"
            >
              Send
            </button>
          </div>
        </div>

        {/* SKIP MODAL */}
        {showSkipConfirm && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-[#1c1c1e] p-8 rounded-3xl space-y-6 text-center shadow-2xl">
              <p className="text-lg">Skip this conversation?</p>
              <div className="flex gap-6 justify-center">
                <button
                  onClick={() => setShowSkipConfirm(false)}
                  className="px-6 py-2 border border-white/10 rounded-full"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    socket.emit("skip-chat");
                    setLeaving(true);
                    setTimeout(() => router.push("/match"), 250);
                  }}
                  className="px-6 py-2 bg-red-500 rounded-full"
                >
                  Skip
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ================= MESSAGE BUBBLE ================= */

function MessageBubble({
  msg,
  identity,
  grouped,
  onReply,
  onReact,
}) {
  const [showReactions, setShowReactions] = useState(false);
  const [dragX, setDragX] = useState(0);

  const startDrag = (clientX) => {
    const startX = clientX;

    const move = (ev) => {
      const x = ev.touches ? ev.touches[0].clientX : ev.clientX;
      const diff = x - startX;
      if (diff > 0) setDragX(Math.min(diff, 80));
    };

    const end = () => {
      if (dragX > 60) onReply();
      setDragX(0);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", end);
      window.removeEventListener("touchmove", move);
      window.removeEventListener("touchend", end);
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", end);
    window.addEventListener("touchmove", move);
    window.addEventListener("touchend", end);
  };

  return (
    <div
      className={`max-w-[75%] ${
        msg.self ? "ml-auto" : ""
      } transition-all duration-200 hover:-translate-y-[2px]`}
      style={{ transform: `translateX(${dragX}px)` }}
      onMouseDown={(e) => startDrag(e.clientX)}
      onTouchStart={(e) => startDrag(e.touches[0].clientX)}
    >
      {!grouped && (
        <div className="text-[10px] tracking-[0.2em] uppercase opacity-30 mb-1">
          {msg.self ? identity.self : identity.partner}
        </div>
      )}

      <div
        className={`px-4 py-3 rounded-2xl ${
          msg.self
            ? "bg-white text-black rounded-br-md"
            : "bg-[#1c1c1e] text-white rounded-bl-md"
        } break-words whitespace-pre-wrap`}
        onContextMenu={(e) => {
          e.preventDefault();
          setShowReactions(!showReactions);
        }}
      >
        {msg.replyTo && (
          <div className="text-xs opacity-50 mb-2 border-l pl-2">
            {msg.replyTo.text}
          </div>
        )}

        {msg.text}

        <div className="text-[10px] opacity-40 mt-1">
          {new Date(msg.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>

        {msg.reactions?.length > 0 && (
          <div className="mt-2 text-xs">
            {msg.reactions.map((r) => r.emoji).join(" ")}
          </div>
        )}
      </div>

      {showReactions && (
        <div className="absolute -top-12 bg-black/80 backdrop-blur-xl border border-white/10 rounded-full px-4 py-2 flex gap-3 shadow-2xl">
          {["❤️", "😂", "🔥", "👍", "😮"].map((emoji) => (
            <span
              key={emoji}
              onClick={() => {
                onReact(msg.messageId, emoji);
                setShowReactions(false);
              }}
              className="text-lg cursor-pointer hover:scale-125 transition"
            >
              {emoji}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}