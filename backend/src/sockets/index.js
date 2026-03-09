import { Server } from "socket.io";
import registerConnection from "./connection.js";
import jwt from "jsonwebtoken";

// Optional: Uncomment if using Redis scaling
// import { createAdapter } from "@socket.io/redis-adapter";
// import { createClient } from "redis";

export const initSocket = async (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true,
    },
    transports: ["websocket", "polling"],
    pingTimeout: 60000,
    pingInterval: 25000,
    maxHttpBufferSize: 1e8, // 100MB (for media signaling safety)
  });

  /* =====================================
     OPTIONAL REDIS SCALING (Horizontal Scaling Ready)
  ===================================== */
  /*
  const pubClient = createClient({ url: process.env.REDIS_URL });
  const subClient = pubClient.duplicate();

  await pubClient.connect();
  await subClient.connect();

  io.adapter(createAdapter(pubClient, subClient));
  */

  /* =====================================
     GLOBAL SOCKET AUTH MIDDLEWARE
  ===================================== */
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;

      if (!token) {
        return next(new Error("Authentication required"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;

      next();
    } catch (error) {
      next(new Error("Invalid or expired token"));
    }
  });

  /* =====================================
     REGISTER ALL SOCKET MODULES
  ===================================== */
  registerConnection(io);

  /* =====================================
     GLOBAL ERROR HANDLER
  ===================================== */
  io.on("connection_error", (err) => {
    console.error("Socket Connection Error:", err.message);
  });

  console.log("🔥 Enterprise Socket System Initialized");

  return io;
};
