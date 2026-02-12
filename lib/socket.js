import { io } from "socket.io-client";

const URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "https://blind-chat-51iq.onrender.com";

export const socket = io(URL, {
  transports: ["websocket"],
});
