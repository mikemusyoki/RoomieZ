import { io } from "socket.io-client";

const socket = io("https://roomiez-backend.onrender.com");

export default socket;
