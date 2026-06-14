import { io } from "socket.io-client";

export const socket = io("https://oxadmedia.online", {
  autoConnect: false,
});