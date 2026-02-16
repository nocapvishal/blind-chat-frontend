"use client";

import { io } from "socket.io-client";

// ⚠️ change this to your Render backend URL
const URL = "https://blind-chat-5i1q.onrender.com";

const socket = io(URL, {
  autoConnect: false,
  transports: ["websocket"]
});

export default socket;