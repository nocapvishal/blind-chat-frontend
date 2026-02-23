import { io } from "socket.io-client";

const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL, {
  autoConnect: false,
  transports: ["websocket"], // optional but good for production
});

export default socket;