"use client";
import { io } from "socket.io-client";

const socket = io(
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "https://blind-chat-51iq.onrender.com",
  {
    transports:["websocket"],
    autoConnect:false
  }
);

export default socket;
