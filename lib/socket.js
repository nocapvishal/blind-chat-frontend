"use client";

import { io } from "socket.io-client";

const URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "https://blind-chat-5i1q.onrender.com";

const socket = io(URL, {
  transports: ["websocket"],
  autoConnect: false,
});

export default socket;
