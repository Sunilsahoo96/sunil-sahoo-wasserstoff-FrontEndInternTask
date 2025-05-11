import { io } from "socket.io-client";

// Use process.env.NODE_ENV to determine if it's development or production
export const socket = process.env.NODE_ENV === 'production'
  ? io("https://backend-k7ta.onrender.com") 
  : io("http://localhost:4000"); // Local development URL
