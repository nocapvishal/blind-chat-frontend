"use client";

import { io } from "socket.io-client";

const URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

const socket = io(URL, {
  transports: ["websocket"],
  withCredentials: true,
  autoConnect: true, // IMPORTANT
});

export default socket;
